import { config } from "@/lib/config/env"
import type { Disease, Plant, PlantScan, BackendPlant } from "@/types"
import NetInfo from "@react-native-community/netinfo"
import * as FileSystem from "expo-file-system"
import { Platform } from "react-native"

class DatabaseService {
    private db: any | null = null

    async init() {
        console.log("🔄 Initialisation de la base de données...")
        if (Platform.OS === "web") {
            console.log("⚠️ SQLite non supporté sur web, init skipped")
            return
        } else {
            const SQLite = await require("expo-sqlite")
            try {
                this.db = await SQLite.openDatabaseAsync("phytovigil.db")
                await this.createTables()
                await this.seedDiseases()
                console.log("✅ Base de données initialisée avec succès")
            } catch (error) {
                console.error("❌ Erreur d'initialisation de la base de données:", error)
                throw error
            }
        }
    }

    private async createTables() {
        if (!this.db) throw new Error("Base de données non initialisée")

        // Table des scans de plantes
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS plant_scans (
                id TEXT PRIMARY KEY,
                plant_id INTEGER,
                disease_name TEXT,
                top_predictions TEXT,
                confidence REAL,
                treatment TEXT,
                image_uri TEXT NOT NULL,
                latitude REAL,
                longitude REAL,
                address TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'unknown',
                notes TEXT,
                processing_time INTEGER,
                model_version TEXT,
                synced INTEGER DEFAULT 0,
                needs_reanalysis INTEGER DEFAULT 0
            );
        `)

        // Table des plantes
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS plants (
                id TEXT PRIMARY KEY,
                remote_id INTEGER,
                name TEXT NOT NULL,
                type TEXT,
                variety TEXT,
                planted_date TEXT,
                latitude REAL,
                longitude REAL,
                address TEXT,
                image_uri TEXT,
                health TEXT DEFAULT 'not scanned',
                last_scanned TEXT,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                synced INTEGER DEFAULT 0,
                deleted INTEGER DEFAULT 0
            );
        `)

        // Table des maladies (données de référence)
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
                affected_plants TEXT,
                image_uri TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `)

        // Table de cache pour les images
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS image_cache (
                id TEXT PRIMARY KEY,
                original_url TEXT NOT NULL,
                local_path TEXT NOT NULL,
                size INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                last_accessed TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `)

        // Index pour améliorer les performances
        await this.db.execAsync(`
            CREATE INDEX IF NOT EXISTS idx_plants_health ON plants(health);
            CREATE INDEX IF NOT EXISTS idx_plants_type ON plants(type);
            CREATE INDEX IF NOT EXISTS idx_scans_plant_id ON plant_scans(plant_id);
            CREATE INDEX IF NOT EXISTS idx_scans_status ON plant_scans(status);
            CREATE INDEX IF NOT EXISTS idx_diseases_name ON diseases(name);
        `)
    }

    private async seedDiseases() {
        if (!this.db) throw new Error("Base de données non initialisée")

        // Vérifier si on a déjà des maladies
        const existingCount = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM diseases")
        if (existingCount?.count > 0) {
            console.log(`📚 ${existingCount.count} maladies déjà en base`)
            return
        }

        const netInfo = await NetInfo.fetch()
        if (!netInfo.isConnected) {
            console.log("⚠️ Pas de connexion : skip seed diseases")
            return
        }

        try {
            console.log("🌱 Téléchargement des maladies de référence...")
            const response = await fetch(`${config.API_URL}/api/diseases`)
            if (!response.ok) throw new Error("Échec du téléchargement des maladies")

            const diseases: Disease[] = await response.json()

            // Insertion en lot pour de meilleures performances
            await this.db.withTransactionAsync(async () => {
                for (const disease of diseases) {
                    await this.saveDisease(disease)
                }
            })

            console.log(`✅ ${diseases.length} maladies téléchargées et sauvegardées`)
        } catch (err) {
            console.error("❌ Erreur lors du téléchargement des maladies :", err)
        }
    }

    // === GESTION DES MALADIES ===

    async saveDisease(disease: Disease): Promise<void> {
        if (!this.db) throw new Error("Base de données non initialisée")

        await this.db.runAsync(
            `INSERT OR REPLACE INTO diseases (
                id, name, scientific_name, description, symptoms,
                treatment, prevention, severity_level, affected_plants, image_uri
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                disease.id,
                disease.name,
                disease.scientific_name || null,
                disease.description,
                JSON.stringify(disease.symptoms),
                disease.treatment,
                disease.prevention,
                disease.severity_level,
                JSON.stringify(disease.affectedPlants || []),
                disease.image_url || null,
            ],
        )
    }

    async getDiseases(): Promise<Disease[]> {
        if (!this.db) throw new Error("Base de données non initialisée")

        try {
            const rows = await this.db.getAllAsync("SELECT * FROM diseases ORDER BY name")
            return rows.map(this.mapRowToDisease)
        } catch (err) {
            console.error("❌ Erreur lors de la lecture des maladies:", err)
            return []
        }
    }

    async getDiseaseByName(name: string): Promise<Disease | null> {
        if (!this.db) throw new Error("Base de données non initialisée")

        try {
            const row = await this.db.getFirstAsync("SELECT * FROM diseases WHERE name = ? COLLATE NOCASE", [name])
            return row ? this.mapRowToDisease(row) : null
        } catch (err) {
            console.error("❌ Erreur lors de la lecture de la maladie par nom:", err)
            return null
        }
    }

    async searchDiseases(query: string): Promise<Disease[]> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const searchTerm = `%${query}%`
        const rows = await this.db.getAllAsync(
            `SELECT * FROM diseases 
             WHERE name LIKE ? COLLATE NOCASE 
                OR description LIKE ? COLLATE NOCASE 
                OR treatment LIKE ? COLLATE NOCASE
             ORDER BY 
                CASE WHEN name LIKE ? COLLATE NOCASE THEN 1 ELSE 2 END,
                name`,
            [searchTerm, searchTerm, searchTerm, searchTerm],
        )
        return rows.map(this.mapRowToDisease)
    }

    // === GESTION DES PLANTES ===

    async savePlant(plant: Omit<Plant, "id" | "createdAt" | "updatedAt">): Promise<string> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const now = new Date().toISOString()

        let savedImageUri = null
        if (plant.image_url) {
            savedImageUri = await this.saveImageLocally(plant.image_url, id)
        }

        await this.db.runAsync(
            `INSERT INTO plants (
                id, name, type, variety, planted_date, latitude, longitude, 
                address, image_uri, health, last_scanned, notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    async savePlantFromRemote(remotePlant: BackendPlant): Promise<void> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const localId = `remote_${remotePlant.id}`

        // Télécharger et sauvegarder l'image si nécessaire
        let localImageUri = null
        if (remotePlant.image_url) {
            localImageUri = await this.cacheRemoteImage(remotePlant.image_url, localId)
        }

        await this.db.runAsync(
            `INSERT OR REPLACE INTO plants (
                id, remote_id, name, type, variety, planted_date, 
                address, image_uri, health, last_scanned, notes, 
                created_at, updated_at, synced
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                localId,
                remotePlant.id,
                remotePlant.name,
                remotePlant.type,
                remotePlant.variety || null,
                remotePlant.planted_date || null,
                remotePlant.location || null,
                localImageUri || remotePlant.image_url,
                "not scanned", // Calculé séparément
                null, // Calculé séparément
                remotePlant.notes || null,
                remotePlant.created_at,
                remotePlant.updated_at,
                1, // Marqué comme synchronisé
            ],
        )
    }

    async getPlants(): Promise<Plant[]> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const rows = await this.db.getAllAsync("SELECT * FROM plants WHERE deleted = 0 ORDER BY created_at DESC")
        return rows.map(this.mapRowToPlant)
    }

    async getPlantById(id: string): Promise<Plant | null> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const row = await this.db.getFirstAsync("SELECT * FROM plants WHERE id = ? AND deleted = 0", [id])
        return row ? this.mapRowToPlant(row) : null
    }

    async updatePlant(id: string, updates: Partial<Plant & { synced?: boolean; deleted?: boolean }>): Promise<void> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const now = new Date().toISOString()
        const setClause = Object.keys(updates)
            .filter((key) => key !== "id" && key !== "createdAt")
            .map((key) => `${key} = ?`)
            .join(", ")

        const values = Object.keys(updates)
            .filter((key) => key !== "id" && key !== "createdAt")
            .map((key) => (updates as any)[key])

        await this.db.runAsync(`UPDATE plants SET ${setClause}, updated_at = ? WHERE id = ?`, [...values, now, id])
    }

    async deletePlant(id: string): Promise<void> {
        if (!this.db) throw new Error("Base de données non initialisée")

        // Supprimer les scans associés
        await this.db.runAsync("DELETE FROM plant_scans WHERE plant_id = ?", [id])

        // Supprimer la plante
        await this.db.runAsync("DELETE FROM plants WHERE id = ?", [id])
    }

    // === GESTION DES SCANS ===

    async savePlantScan(scan: Omit<PlantScan, "id" | "createdAt" | "updatedAt">): Promise<string> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const id = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const now = new Date().toISOString()

        // Sauvegarder l'image localement
        const savedImageUri = await this.saveImageLocally(scan.imageUri, id)

        await this.db.runAsync(
            `INSERT INTO plant_scans (
                id, plant_id, disease_name, top_predictions, confidence, treatment, 
                image_uri, latitude, longitude, address, created_at, updated_at, 
                status, notes, processing_time, model_version
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                scan.plant_id,
                scan.diseaseName,
                JSON.stringify(scan.top_predictions),
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
                scan.processing_time || null,
                scan.model_version || null,
            ],
        )

        return id
    }

    async getPlantScans(limit?: number): Promise<PlantScan[]> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const query = `
            SELECT * FROM plant_scans 
            ORDER BY created_at DESC 
            ${limit ? `LIMIT ${limit}` : ""}
        `
        const rows = await this.db.getAllAsync(query)
        return rows.map(this.mapRowToPlantScan)
    }

    async getPlantScanById(id: string): Promise<PlantScan | null> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const row = await this.db.getFirstAsync("SELECT * FROM plant_scans WHERE id = ?", [id])
        return row ? this.mapRowToPlantScan(row) : null
    }

    async getPlantScansByPlantId(plantId: number): Promise<PlantScan[]> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const rows = await this.db.getAllAsync("SELECT * FROM plant_scans WHERE plant_id = ? ORDER BY created_at DESC", [
            plantId,
        ])
        return rows.map(this.mapRowToPlantScan)
    }

    async updatePlantScan(id: string, updates: Partial<PlantScan>): Promise<void> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const now = new Date().toISOString()
        const setClause = Object.keys(updates)
            .filter((key) => key !== "id" && key !== "createdAt")
            .map((key) => `${key} = ?`)
            .join(", ")

        const values = Object.keys(updates)
            .filter((key) => key !== "id" && key !== "createdAt")
            .map((key) => (updates as any)[key])

        await this.db.runAsync(`UPDATE plant_scans SET ${setClause}, updated_at = ? WHERE id = ?`, [...values, now, id])
    }

    async deletePlantScan(id: string): Promise<void> {
        if (!this.db) throw new Error("Base de données non initialisée")

        // Récupérer le scan pour supprimer son image
        const scan = await this.getPlantScanById(id)
        if (scan?.imageUri) {
            await this.deleteImageLocally(scan.imageUri)
        }

        await this.db.runAsync("DELETE FROM plant_scans WHERE id = ?", [id])
    }

    // === GESTION DES IMAGES ===

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
            console.error("❌ Erreur sauvegarde image locale:", error)
            return sourceUri // Fallback vers l'URI originale
        }
    }

    private async cacheRemoteImage(remoteUrl: string, id: string): Promise<string> {
        try {
            // Vérifier si l'image est déjà en cache
            const cached = await this.db.getFirstAsync("SELECT local_path FROM image_cache WHERE original_url = ?", [
                remoteUrl,
            ])

            if (cached && (await FileSystem.getInfoAsync(cached.local_path))) {
                // Mettre à jour la date d'accès
                await this.db.runAsync("UPDATE image_cache SET last_accessed = ? WHERE original_url = ?", [
                    new Date().toISOString(),
                    remoteUrl,
                ])
                return cached.local_path
            }

            // Télécharger et sauvegarder l'image
            const directory = `${FileSystem.documentDirectory}cache/images/`
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true })

            const filename = `cached_${id}_${Date.now()}.jpg`
            const localPath = `${directory}${filename}`

            const downloadResult = await FileSystem.downloadAsync(remoteUrl, localPath)

            if (downloadResult.status === 200) {
                // Sauvegarder en cache
                await this.db.runAsync(
                    `INSERT OR REPLACE INTO image_cache (id, original_url, local_path, size) 
                     VALUES (?, ?, ?, ?)`,
                    [id, remoteUrl, localPath, downloadResult.headers["content-length"] || 0],
                )

                return localPath
            }

            return remoteUrl // Fallback
        } catch (error) {
            console.error("❌ Erreur cache image distante:", error)
            return remoteUrl // Fallback
        }
    }

    private async deleteImageLocally(imageUri: string): Promise<void> {
        try {
            if (imageUri.startsWith(FileSystem.documentDirectory!)) {
                await FileSystem.deleteAsync(imageUri, { idempotent: true })
            }
        } catch (error) {
            console.error("❌ Erreur suppression image locale:", error)
        }
    }

    // === STATISTIQUES ===

    async getStats() {
        if (!this.db) throw new Error("Base de données non initialisée")

        const totalScans = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM plant_scans")
        const healthyScans = await this.db.getFirstAsync(
            'SELECT COUNT(*) as count FROM plant_scans WHERE status = "healthy"',
        )
        const diseasedScans = await this.db.getFirstAsync(
            'SELECT COUNT(*) as count FROM plant_scans WHERE status = "diseased"',
        )
        const totalPlants = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM plants WHERE deleted = 0")

        return {
            totalScans: (totalScans as any)?.count || 0,
            healthyScans: (healthyScans as any)?.count || 0,
            diseasedScans: (diseasedScans as any)?.count || 0,
            totalPlants: (totalPlants as any)?.count || 0,
        }
    }

    // === NETTOYAGE ET MAINTENANCE ===

    async cleanupCache(maxAgeInDays = 30): Promise<void> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays)
        const cutoffISO = cutoffDate.toISOString()

        // Récupérer les images à supprimer
        const oldImages = await this.db.getAllAsync("SELECT local_path FROM image_cache WHERE last_accessed < ?", [
            cutoffISO,
        ])

        // Supprimer les fichiers
        for (const image of oldImages) {
            await this.deleteImageLocally(image.local_path)
        }

        // Supprimer les entrées de cache
        await this.db.runAsync("DELETE FROM image_cache WHERE last_accessed < ?", [cutoffISO])

        console.log(`🧹 ${oldImages.length} images de cache supprimées`)
    }

    async getCacheSize(): Promise<number> {
        if (!this.db) throw new Error("Base de données non initialisée")

        const result = await this.db.getFirstAsync("SELECT SUM(size) as total_size FROM image_cache")
        return (result as any)?.total_size || 0
    }

    // === MAPPERS ===

    private mapRowToPlantScan(row: any): PlantScan {
        return {
            id: Number.parseInt(row.id.replace(/\D/g, "")) || 0,
            plant_id: row.plant_id,
            diseaseName: row.disease_name,
            top_predictions: row.top_predictions
                ? (() => {
                    try {
                        const parsed =
                            typeof row.top_predictions === "string" ? JSON.parse(row.top_predictions) : row.top_predictions
                        return Array.isArray(parsed) ? parsed : []
                    } catch {
                        return []
                    }
                })()
                : [],
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
            processing_time: row.processing_time,
            model_version: row.model_version,
        }
    }

    private mapRowToPlant(row: any): Plant {
        return {
            id: row.remote_id || Number.parseInt(row.id.replace(/\D/g, "")) || 0,
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
            image_url: row.image_uri,
            health: row.health,
            lastScanned: row.last_scanned,
            notes: row.notes,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }
    }

    private mapRowToDisease(row: any): Disease {
        let symptomsParsed
        try {
            symptomsParsed = typeof row.symptoms === "string" ? JSON.parse(row.symptoms) : row.symptoms
        } catch {
            symptomsParsed = row.symptoms
        }

        let affectedPlantsParsed
        try {
            affectedPlantsParsed =
                typeof row.affected_plants === "string" ? JSON.parse(row.affected_plants) : row.affected_plants
        } catch {
            affectedPlantsParsed = []
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
            affectedPlants: affectedPlantsParsed,
            image_url: row.image_uri,
        }
    }
}

export const databaseService = new DatabaseService()
