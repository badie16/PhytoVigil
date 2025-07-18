import { config } from "@/lib/config/env"
import type { Disease, Plant, PlantScan } from "@/types"
import NetInfo from "@react-native-community/netinfo"
import * as FileSystem from "expo-file-system"
import { Platform } from "react-native"

class DatabaseService {
    private db: any | null = null
    async init() {
        console.log("deszd")
        if (Platform.OS === 'web') {
            console.log("⚠️ SQLite non supporté sur web, init skipped");
            return;
        } else {
            const SQLite = await require("expo-sqlite")
            this.db = await SQLite.openDatabaseAsync("phytovigil.db")
            try {
                this.db = await SQLite.openDatabaseAsync("phytovigil.db")
                await this.createTables()
                // await this.seedDiseases()
                console.log("Database initialized successfully")
            } catch (error) {
                console.error("Database initialization error:", error)
                throw error
            }
        }
    }

    private async createTables() {
        if (!this.db) throw new Error("Database not initialized")

        // Plant Scans table
        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS plant_scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_id INTEGER,
        image_uri TEXT NOT NULL,
        result_type TEXT,
        confidence_score REAL,
        detected_diseases TEXT,
        recommendations TEXT,
        scan_date TEXT DEFAULT CURRENT_TIMESTAMP,
        location_lat REAL,
        location_lng REAL,
        synced INTEGER DEFAULT 0
      );
    `)

        // Plants table
        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS plants (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT,
        variety TEXT,
        planted_date TEXT,
        location TEXT,
        notes TEXT,
        image_uri TEXT,
        synced INTEGER DEFAULT 0
      );
    `)

        // Diseases table
        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS diseases (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        scientific_name TEXT,
        description TEXT,
        symptoms TEXT,
        treatment TEXT,
        prevention TEXT,
        severity_level INTEGER,
        image_uri TEXT
      );
    `)
    }

    private async seedDiseases() {
        if (!this.db) throw new Error("Database not initialized")

        const netInfo = await NetInfo.fetch()
        if (!netInfo.isConnected) {
            console.log("⚠️ Pas de connexion : skip seed diseases")
            return
        }

        try {
            const response = await fetch(`${config.API_URL}/api/diseases`)
            if (!response.ok) throw new Error("Failed to fetch diseases")

            const diseases: Disease[] = await response.json()

            // Insertion dans SQLite
            for (const d of diseases) {
                await this.db.runAsync(
                    `INSERT OR REPLACE INTO diseases (
          id, name, scientific_name, description, symptoms,
          treatment, prevention, severity_level, image_uri
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    [
                        d.id ?? null,
                        d.name ?? null,
                        d.scientific_name ?? null,
                        d.description ?? null,
                        JSON.stringify(d.symptoms ?? null),
                        d.treatment ?? null,
                        d.prevention ?? null,
                        d.severity_level ?? null,
                        d.image_url ?? null,
                    ]
                )
            }

            console.log(`✅ ${diseases.length} maladies insérées localement`)
        } catch (err) {
            console.error("Erreur lors du seed des maladies :", err)
        }
    }

    // Plant Scans CRUD
    async savePlantScan(scan: Omit<PlantScan, "id" | "createdAt" | "updatedAt">): Promise<string> {
        if (!this.db) throw new Error("Database not initialized")

        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const now = new Date().toISOString()

        // Save image to local storage
        const savedImageUri = await this.saveImageLocally(scan.imageUri, id)

        await this.db.runAsync(
            `INSERT INTO plant_scans (id, plant_name, disease_name, confidence, treatment, image_uri, latitude, longitude, address, created_at, updated_at, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                scan.plantName,
                scan.diseaseName,
                scan.confidence,
                scan.treatment,
                savedImageUri,
                scan.location?.latitude || null,
                scan.location?.longitude || null,
                scan.location?.address || null,
                now,
                now,
                scan.status,
                scan.notes || null,
            ],
        )

        return id
    }

    async getPlantScans(limit?: number): Promise<PlantScan[]> {
        if (!this.db) throw new Error("Database not initialized")

        const query = `SELECT * FROM plant_scans ORDER BY created_at DESC ${limit ? `LIMIT ${limit}` : ""}`
        const rows = await this.db.getAllAsync(query)

        return rows.map(this.mapRowToPlantScan)
    }

    async getPlantScanById(id: string): Promise<PlantScan | null> {
        if (!this.db) throw new Error("Database not initialized")

        const row = await this.db.getFirstAsync("SELECT * FROM plant_scans WHERE id = ?", [id])
        return row ? this.mapRowToPlantScan(row) : null
    }

    async deletePlantScan(id: string): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        // Get the scan to delete its image
        const scan = await this.getPlantScanById(id)
        if (scan?.imageUri) {
            await this.deleteImageLocally(scan.imageUri)
        }

        await this.db.runAsync("DELETE FROM plant_scans WHERE id = ?", [id])
    }

    // Plants CRUD
    async savePlant(plant: Omit<Plant, "id" | "createdAt" | "updatedAt">): Promise<string> {
        if (!this.db) throw new Error("Database not initialized")

        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const now = new Date().toISOString()

        let savedImageUri = null
        if (plant.imageUri) {
            savedImageUri = await this.saveImageLocally(plant.imageUri, id)
        }

        await this.db.runAsync(
            `INSERT INTO plants (id, name, type, variety, planted_date, latitude, longitude, address, image_uri, health, last_scanned, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                plant.name,
                plant.type,
                plant.variety || null,
                plant.plantedDate || null,
                plant.location?.latitude || null,
                plant.location?.longitude || null,
                plant.location?.address || null,
                savedImageUri,
                plant.health,
                plant.lastScanned || null,
                plant.notes || null,
                now,
                now,
            ],
        )

        return id
    }

    async getPlants(): Promise<Plant[]> {
        if (!this.db) throw new Error("Database not initialized")

        const rows = await this.db.getAllAsync("SELECT * FROM plants ORDER BY created_at DESC")
        return rows.map(this.mapRowToPlant)
    }

    async updatePlant(id: string, updates: Partial<Plant>): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        const now = new Date().toISOString()
        const setClause = Object.keys(updates)
            .map((key) => `${key} = ?`)
            .join(", ")
        const values = [...Object.values(updates), now, id]

        await this.db.runAsync(`UPDATE plants SET ${setClause}, updated_at = ? WHERE id = ?`, values)
    }

    async getDiseases(): Promise<Disease[]> {
        if (!this.db) throw new Error("Database not initialized")

        try {
            const rows = await this.db.getAllAsync("SELECT * FROM diseases")
            console.log(rows)
            return rows.map(this.mapRowToDisease)
        } catch (err) {
            console.error("❌ Erreur lors de la lecture des maladies:", err)
            return []
        }
    }
    async getDiseaseByName(name: string): Promise<Disease | null> {
        if (!this.db) throw new Error("Database not initialized")

        try {
            const row = await this.db.getFirstAsync(
                "SELECT * FROM diseases WHERE name = ?",
                [name]
            )
            if (!row) return null
            return this.mapRowToDisease(row)
        } catch (err) {
            console.error("❌ Erreur lors de la lecture de la maladie par nom:", err)
            return null
        }
    }

    async searchDiseases(query: string): Promise<Disease[]> {
        if (!this.db) throw new Error("Database not initialized")

        const rows = await this.db.getAllAsync(
            "SELECT * FROM diseases WHERE name LIKE ? OR description LIKE ? ORDER BY name",
            [`%${query}%`, `%${query}%`],
        )
        return rows.map(this.mapRowToDisease)
    }

    // Statistics
    async getStats() {
        if (!this.db) throw new Error("Database not initialized")

        const totalScans = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM plant_scans")
        const healthyScans = await this.db.getFirstAsync(
            'SELECT COUNT(*) as count FROM plant_scans WHERE status = "healthy"',
        )
        const diseasedScans = await this.db.getFirstAsync(
            'SELECT COUNT(*) as count FROM plant_scans WHERE status = "diseased"',
        )
        const totalPlants = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM plants")

        return {
            totalScans: (totalScans as any)?.count || 0,
            healthyScans: (healthyScans as any)?.count || 0,
            diseasedScans: (diseasedScans as any)?.count || 0,
            totalPlants: (totalPlants as any)?.count || 0,
        }
    }

    // Helper methods
    private async saveImageLocally(sourceUri: string, id: string): Promise<string> {
        try {
            const directory = `${FileSystem.documentDirectory}images/`
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true })

            const filename = `${id}_${Date.now()}.jpg`
            const destinationUri = `${directory}${filename}`

            await FileSystem.copyAsync({
                from: sourceUri,
                to: destinationUri,
            })

            return destinationUri
        } catch (error) {
            console.error("Error saving image locally:", error)
            return sourceUri // Fallback to original URI
        }
    }

    private async deleteImageLocally(imageUri: string): Promise<void> {
        try {
            if (imageUri.startsWith(FileSystem.documentDirectory!)) {
                await FileSystem.deleteAsync(imageUri, { idempotent: true })
            }
        } catch (error) {
            console.error("Error deleting image locally:", error)
        }
    }

    private mapRowToPlantScan(row: any): PlantScan {
        return {
            id: row.id,
            plantName: row.plant_name,
            diseaseName: row.disease_name,
            confidence: row.confidence,
            treatment: row.treatment,
            imageUri: row.image_uri,
            location:
                row.latitude && row.longitude
                    ? {
                        latitude: row.latitude,
                        longitude: row.longitude,
                        address: row.address,
                    }
                    : undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            status: row.status,
            notes: row.notes,
        }
    }

    private mapRowToPlant(row: any): Plant {
        return {
            id: row.id,
            name: row.name,
            type: row.type,
            variety: row.variety,
            plantedDate: row.planted_date,
            location:
                row.latitude && row.longitude
                    ? {
                        latitude: row.latitude,
                        longitude: row.longitude,
                        address: row.address,
                    }
                    : undefined,
            imageUri: row.image_uri,
            health: row.health,
            lastScanned: row.last_scanned,
            notes: row.notes,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }
    }

    private mapRowToDisease(row: any): Disease {
        let symptomsParsed;
        try {
            symptomsParsed = typeof row.symptoms === 'string' ? JSON.parse(row.symptoms) : row.symptoms;
        } catch {
            symptomsParsed = row.symptoms; // fallback si JSON invalide
        }

        return {
            id: row.id,
            name: row.name,
            scientific_name: row.scientific_name,
            description: row.description,
            symptoms: symptomsParsed,
            treatment: row.treatment,
            prevention: row.prevention,
            severity_level: row.severity_level,
            affectedPlants: row.affected_plants ? JSON.parse(row.affected_plants) : [],
            image_url: row.image_uri,
        }
    }
}

export const databaseService = new DatabaseService()
