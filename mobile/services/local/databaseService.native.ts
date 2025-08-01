import type { Disease, Plant, PlantScan } from "@/types"
import * as FileSystem from "expo-file-system"
import { Platform } from "react-native"

class DatabaseService {
    private db: any | null = null

    async init() {
        console.log("Initializing database...")
        if (Platform.OS === "web") {
            console.log("⚠️ SQLite non supporté sur web, init skipped")
            return
        } else {
            const SQLite = await require("expo-sqlite")
            try {
                this.db = await SQLite.openDatabaseAsync("phytovigil.db")
                await this.createTables()
                console.log("✅ Database initialized successfully")
            } catch (error) {
                console.error("❌ Database initialization error:", error)
                throw error
            }
        }
    }

    private async createTables() {
        if (!this.db) throw new Error("Database not initialized")

        // Users table (for offline users)
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                hashed_password TEXT,
                role TEXT NOT NULL DEFAULT 'user',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                synced INTEGER DEFAULT 0
            );
        `)

        // Plants table (compatible with backend schema)
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS plants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER UNIQUE,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                type TEXT,
                variety TEXT,
                planted_date TEXT,
                location TEXT,
                notes TEXT,
                image_url TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                synced INTEGER DEFAULT 0,
                deleted INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            );
        `)

        // Plant scans table (compatible with backend schema)
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS plant_scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER UNIQUE,
                user_id INTEGER NOT NULL,
                plant_id INTEGER,
                image_url TEXT NOT NULL,
                result_type TEXT CHECK (result_type IN ('healthy', 'diseased', 'unknown')),
                confidence_score REAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
                detected_diseases TEXT, -- JSON string
                recommendations TEXT,
                scan_date TEXT DEFAULT CURRENT_TIMESTAMP,
                location_lat REAL CHECK (location_lat >= -90 AND location_lat <= 90),
                location_lng REAL CHECK (location_lng >= -180 AND location_lng <= 180),
                synced INTEGER DEFAULT 0,
                deleted INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (plant_id) REFERENCES plants (id)
            );
        `)

        // Diseases table (compatible with backend schema)
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS diseases (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                scientific_name TEXT,
                description TEXT,
                symptoms TEXT, -- JSON string
                treatment TEXT,
                prevention TEXT,
                severity_level INTEGER CHECK (severity_level >= 1 AND severity_level <= 5),
                image_url TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `)

        // Activities table (compatible with backend schema)
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS activities (
                id TEXT PRIMARY KEY,
                server_id TEXT UNIQUE,
                user_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                plant_id INTEGER,
                scan_id INTEGER,
                status TEXT DEFAULT 'active',
                meta_data TEXT, -- JSON string
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                synced INTEGER DEFAULT 0,
                deleted INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (plant_id) REFERENCES plants (id),
                FOREIGN KEY (scan_id) REFERENCES plant_scans (id)
            );
        `)

        // Scan diseases table (compatible with backend schema)
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS scan_diseases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER UNIQUE,
                scan_id INTEGER NOT NULL,
                disease_id INTEGER NOT NULL,
                confidence_score REAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
                affected_area_percentage REAL CHECK (affected_area_percentage >= 0 AND affected_area_percentage <= 100),
                synced INTEGER DEFAULT 0,
                FOREIGN KEY (scan_id) REFERENCES plant_scans (id),
                FOREIGN KEY (disease_id) REFERENCES diseases (id)
            );
        `)

        // Push tokens table (for offline storage)
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS push_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER UNIQUE,
                user_id INTEGER NOT NULL,
                token TEXT NOT NULL UNIQUE,
                device TEXT,
                deviceId TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                synced INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            );
        `)

        // Sync queue table
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS sync_queue (
                id TEXT PRIMARY KEY,
                table_name TEXT NOT NULL,
                local_id TEXT NOT NULL,
                server_id TEXT,
                action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
                data TEXT, -- JSON string
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                retry_count INTEGER DEFAULT 0,
                last_error TEXT
            );
        `)

        // Conflicts table for sync conflicts
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS sync_conflicts (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                local_data TEXT NOT NULL, -- JSON string
                server_data TEXT NOT NULL, -- JSON string
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                resolved INTEGER DEFAULT 0
            );
        `)

        // Create indexes for better performance
        await this.db.execAsync(`
            CREATE INDEX IF NOT EXISTS idx_plants_user_id ON plants(user_id);
            CREATE INDEX IF NOT EXISTS idx_plants_server_id ON plants(server_id);
            CREATE INDEX IF NOT EXISTS idx_plant_scans_user_id ON plant_scans(user_id);
            CREATE INDEX IF NOT EXISTS idx_plant_scans_plant_id ON plant_scans(plant_id);
            CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
            CREATE INDEX IF NOT EXISTS idx_sync_queue_table ON sync_queue(table_name);
        `)

        console.log("✅ All tables created successfully")
    }

    // User management methods
    async createOfflineUser(user: any): Promise<number> {
        if (!this.db) throw new Error("Database not initialized")

        const result = await this.db.runAsync(
            `INSERT INTO users (id, name, email, hashed_password, role, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user.id, user.name, user.email, user.hashed_password || "", user.role, user.created_at],
        )

        return result.lastInsertRowId
    }

    async getOfflineUserByEmail(email: string): Promise<any> {
        if (!this.db) throw new Error("Database not initialized")

        const result = await this.db.getFirstAsync("SELECT * FROM users WHERE email = ?", [email])

        return result
    }

    async deleteOfflineUser(userId: number): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        await this.db.runAsync("DELETE FROM users WHERE id = ?", [userId])
    }

    // Plant methods
    async createPlant(plant: any): Promise<string> {
        if (!this.db) throw new Error("Database not initialized")

        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const now = new Date().toISOString()

        let savedImageUri = null
        if (plant.image_url) {
            savedImageUri = await this.saveImageLocally(plant.image_url, id)
        }

        await this.db.runAsync(
            `INSERT INTO plants (id, server_id, user_id, name, type, variety, planted_date, location, notes, image_url, created_at, updated_at, synced)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                plant.server_id || null,
                plant.user_id || 1,
                plant.name,
                plant.type,
                plant.variety || null,
                plant.planted_date || null,
                plant.location || null,
                plant.notes || null,
                savedImageUri,
                now,
                now,
                plant.synced || 0,
            ],
        )

        return id
    }

    async savePlant(plant: Omit<Plant, "id" | "createdAt" | "updatedAt">): Promise<string> {
        if (!this.db) throw new Error("Database not initialized")

        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const now = new Date().toISOString()

        let savedImageUri = null
        if (plant.image_url) {
            savedImageUri = await this.saveImageLocally(plant.image_url, id)
        }

        await this.db.runAsync(
            `INSERT INTO plants (id, user_id, name, type, variety, planted_date, location, notes, image_url, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                plant.user_id || 1,
                plant.name,
                plant.type,
                plant.variety || null,
                plant.plantedDate || null,
                plant.location ? JSON.stringify(plant.location) : null,
                plant.notes || null,
                savedImageUri,
                now,
                now,
            ],
        )

        // Add to sync queue
        await this.addToSyncQueue("plants", id, "create", {
            name: plant.name,
            type: plant.type,
            variety: plant.variety,
            planted_date: plant.plantedDate,
            location: plant.location?.address,
            notes: plant.notes,
            image_url: savedImageUri,
        })

        return id
    }

    async getPlants(): Promise<Plant[]> {
        if (!this.db) throw new Error("Database not initialized")

        const rows = await this.db.getAllAsync("SELECT * FROM plants WHERE deleted = 0 ORDER BY created_at DESC")

        return rows.map(this.mapRowToPlant)
    }

    async getPlantById(id: string): Promise<Plant | null> {
        if (!this.db) throw new Error("Database not initialized")

        const row = await this.db.getFirstAsync("SELECT * FROM plants WHERE id = ? AND deleted = 0", [id])

        return row ? this.mapRowToPlant(row) : null
    }

    async getPlantByServerId(serverId: string): Promise<Plant | null> {
        if (!this.db) throw new Error("Database not initialized")

        const row = await this.db.getFirstAsync("SELECT * FROM plants WHERE server_id = ? AND deleted = 0", [serverId])

        return row ? this.mapRowToPlant(row) : null
    }

    async updatePlant(id: string | number, updates: Partial<any>): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        const now = new Date().toISOString()

        // Handle different update formats
        const updateFields: string[] = []
        const updateValues: any[] = []

        Object.keys(updates).forEach((key) => {
            if (key !== "id") {
                const dbColumn = this.mapPlantFieldToColumn(key)
                updateFields.push(`${dbColumn} = ?`)

                let value = updates[key]
                if (key === "location" && typeof value === "object") {
                    value = JSON.stringify(value)
                }
                updateValues.push(value)
            }
        })

        if (updateFields.length === 0) return

        const setClause = updateFields.join(", ")
        const query = `UPDATE plants SET ${setClause}, updated_at = ? WHERE id = ?`

        await this.db.runAsync(query, [...updateValues, now, id])

        // Add to sync queue if not already synced
        if (!updates.synced) {
            await this.addToSyncQueue("plants", id.toString(), "update", updates)
        }
    }

    async deletePlant(id: string): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        await this.db.runAsync("UPDATE plants SET deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [id])

        // Add to sync queue
        await this.addToSyncQueue("plants", id, "delete", {})
    }

    // Plant scan methods
    async createScan(scan: any): Promise<string> {
        if (!this.db) throw new Error("Database not initialized")

        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const now = new Date().toISOString()

        let savedImageUri = null
        if (scan.image_url) {
            savedImageUri = await this.saveImageLocally(scan.image_url, id)
        }

        await this.db.runAsync(
            `INSERT INTO plant_scans (id, server_id, user_id, plant_id, image_url, result_type, confidence_score, 
             detected_diseases, recommendations, scan_date, location_lat, location_lng, synced)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                scan.server_id || null,
                scan.user_id || 1,
                scan.plant_id || null,
                savedImageUri,
                scan.result_type,
                scan.confidence_score,
                scan.detected_diseases ? JSON.stringify(scan.detected_diseases) : null,
                scan.recommendations,
                now,
                scan.location_lat || null,
                scan.location_lng || null,
                scan.synced || 0,
            ],
        )

        return id
    }

    async savePlantScan(scan: Omit<PlantScan, "id" | "createdAt" | "updatedAt">): Promise<string> {
        if (!this.db) throw new Error("Database not initialized")

        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const now = new Date().toISOString()

        const savedImageUri = await this.saveImageLocally(scan.imageUri, id)

        await this.db.runAsync(
            `INSERT INTO plant_scans (id, plant_id, image_url, result_type, confidence_score, 
             detected_diseases, recommendations, scan_date, location_lat, location_lng)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                // scan.userId || 1,
                scan.plant_id || null,
                savedImageUri,
                scan.status,
                scan.confidence,
                JSON.stringify(scan.top_predictions || []),
                scan.treatment,
                now,
                scan.location?.latitude || null,
                scan.location?.longitude || null,
            ],
        )

        // Add to sync queue
        await this.addToSyncQueue("plant_scans", id, "create", {
            plant_id: scan.plant_id,
            image_url: savedImageUri,
            result_type: scan.status,
            confidence_score: scan.confidence,
            detected_diseases: scan.top_predictions,
            recommendations: scan.treatment,
            location_lat: scan.location?.latitude,
            location_lng: scan.location?.longitude,
        })

        return id
    }

    async getPlantScans(limit?: number): Promise<PlantScan[]> {
        if (!this.db) throw new Error("Database not initialized")

        const query = `
            SELECT ps.*, p.name as plant_name 
            FROM plant_scans ps 
            LEFT JOIN plants p ON ps.plant_id = p.id 
            WHERE ps.deleted = 0 
            ORDER BY ps.scan_date DESC 
            ${limit ? `LIMIT ${limit}` : ""}
        `

        const rows = await this.db.getAllAsync(query)
        return rows.map(this.mapRowToPlantScan)
    }

    async getPlantScanById(id: string): Promise<PlantScan | null> {
        if (!this.db) throw new Error("Database not initialized")

        const row = await this.db.getFirstAsync(
            `SELECT ps.*, p.name as plant_name 
             FROM plant_scans ps 
             LEFT JOIN plants p ON ps.plant_id = p.id 
             WHERE ps.id = ? AND ps.deleted = 0`,
            [id],
        )

        return row ? this.mapRowToPlantScan(row) : null
    }

    async getScanByServerId(serverId: string): Promise<any> {
        if (!this.db) throw new Error("Database not initialized")

        const row = await this.db.getFirstAsync("SELECT * FROM plant_scans WHERE server_id = ? AND deleted = 0", [serverId])

        return row ? this.mapRowToPlantScan(row) : null
    }

    async updateScan(id: string | number, updates: Partial<any>): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        const now = new Date().toISOString()

        const updateFields: string[] = []
        const updateValues: any[] = []

        Object.keys(updates).forEach((key) => {
            if (key !== "id") {
                updateFields.push(`${key} = ?`)
                let value = updates[key]
                if (typeof value === "object" && value !== null) {
                    value = JSON.stringify(value)
                }
                updateValues.push(value)
            }
        })

        if (updateFields.length === 0) return

        const setClause = updateFields.join(", ")
        const query = `UPDATE plant_scans SET ${setClause}, scan_date = ? WHERE id = ?`

        await this.db.runAsync(query, [...updateValues, now, id])

        // Add to sync queue if not already synced
        if (!updates.synced) {
            await this.addToSyncQueue("plant_scans", id.toString(), "update", updates)
        }
    }

    async deletePlantScan(id: string): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        // Get the scan to delete its image
        const scan = await this.getPlantScanById(id)
        if (scan?.imageUri) {
            await this.deleteImageLocally(scan.imageUri)
        }

        await this.db.runAsync("UPDATE plant_scans SET deleted = 1 WHERE id = ?", [id])

        // Add to sync queue
        await this.addToSyncQueue("plant_scans", id, "delete", {})
    }

    // Activity methods
    async createActivity(activity: any): Promise<string> {
        if (!this.db) throw new Error("Database not initialized")

        const id = activity.id || `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const now = new Date().toISOString()

        await this.db.runAsync(
            `INSERT INTO activities (id, server_id, user_id, type, title, description, plant_id, scan_id, status, meta_data, created_at, updated_at, synced)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                activity.server_id || null,
                activity.user_id || 1,
                activity.type,
                activity.title,
                activity.description || null,
                activity.plant_id || null,
                activity.scan_id || null,
                activity.status || "active",
                activity.meta_data ? JSON.stringify(activity.meta_data) : null,
                now,
                now,
                activity.synced || 0,
            ],
        )

        return id
    }

    async getActivities(): Promise<any[]> {
        if (!this.db) throw new Error("Database not initialized")

        const rows = await this.db.getAllAsync(
            `SELECT a.*, p.name as plant_name 
             FROM activities a 
             LEFT JOIN plants p ON a.plant_id = p.id 
             WHERE a.deleted = 0 
             ORDER BY a.created_at DESC`,
        )

        return rows.map((row: any) => ({
            ...row,
            meta_data: row.meta_data ? JSON.parse(row.meta_data) : null,
        }))
    }

    async getActivityByServerId(serverId: string): Promise<any> {
        if (!this.db) throw new Error("Database not initialized")

        const row = await this.db.getFirstAsync("SELECT * FROM activities WHERE server_id = ? AND deleted = 0", [serverId])

        return row
            ? {
                ...row,
                meta_data: row.meta_data ? JSON.parse(row.meta_data) : null,
            }
            : null
    }

    async updateActivity(id: string | number, updates: Partial<any>): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        const now = new Date().toISOString()

        const updateFields: string[] = []
        const updateValues: any[] = []

        Object.keys(updates).forEach((key) => {
            if (key !== "id") {
                updateFields.push(`${key} = ?`)
                let value = updates[key]
                if (key === "meta_data" && typeof value === "object") {
                    value = JSON.stringify(value)
                }
                updateValues.push(value)
            }
        })

        if (updateFields.length === 0) return

        const setClause = updateFields.join(", ")
        const query = `UPDATE activities SET ${setClause}, updated_at = ? WHERE id = ?`

        await this.db.runAsync(query, [...updateValues, now, id])

        // Add to sync queue if not already synced
        if (!updates.synced) {
            await this.addToSyncQueue("activities", id.toString(), "update", updates)
        }
    }

    // Disease methods
    async insertDisease(disease: any): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        await this.db.runAsync(
            `INSERT OR REPLACE INTO diseases (
                id, name, scientific_name, description, symptoms,
                treatment, prevention, severity_level, image_url, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                disease.id,
                disease.name,
                disease.scientific_name,
                disease.description,
                typeof disease.symptoms === "string" ? disease.symptoms : JSON.stringify(disease.symptoms),
                disease.treatment,
                disease.prevention,
                disease.severity_level,
                disease.image_url,
                disease.created_at || new Date().toISOString(),
            ],
        )
    }

    async getDiseases(): Promise<Disease[]> {
        if (!this.db) throw new Error("Database not initialized")

        try {
            const rows = await this.db.getAllAsync("SELECT * FROM diseases ORDER BY name")
            return rows.map(this.mapRowToDisease)
        } catch (err) {
            console.error("❌ Error reading diseases:", err)
            return []
        }
    }

    async getDiseaseByName(name: string): Promise<Disease | null> {
        if (!this.db) throw new Error("Database not initialized")

        try {
            const row = await this.db.getFirstAsync("SELECT * FROM diseases WHERE name = ?", [name])
            return row ? this.mapRowToDisease(row) : null
        } catch (err) {
            console.error("❌ Error reading disease by name:", err)
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

    // Conflict management methods
    async getConflicts(): Promise<any[]> {
        if (!this.db) throw new Error("Database not initialized")

        const rows = await this.db.getAllAsync("SELECT * FROM sync_conflicts WHERE resolved = 0 ORDER BY timestamp ASC")

        return rows.map((row: any) => ({
            ...row,
            localData: JSON.parse(row.local_data),
            serverData: JSON.parse(row.server_data),
            timestamp: new Date(row.timestamp),
        }))
    }

    async saveConflict(conflict: any): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        await this.db.runAsync(
            `INSERT INTO sync_conflicts (id, type, local_data, server_data, timestamp)
             VALUES (?, ?, ?, ?, ?)`,
            [
                conflict.id,
                conflict.type,
                JSON.stringify(conflict.localData),
                JSON.stringify(conflict.serverData),
                conflict.timestamp.toISOString(),
            ],
        )
    }

    async removeConflict(conflictId: string): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        await this.db.runAsync("DELETE FROM sync_conflicts WHERE id = ?", [conflictId])
    }

    // Statistics
    async getStats() {
        if (!this.db) throw new Error("Database not initialized")

        const totalScans = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM plant_scans WHERE deleted = 0")
        const healthyScans = await this.db.getFirstAsync(
            "SELECT COUNT(*) as count FROM plant_scans WHERE result_type = 'healthy' AND deleted = 0",
        )
        const diseasedScans = await this.db.getFirstAsync(
            "SELECT COUNT(*) as count FROM plant_scans WHERE result_type = 'diseased' AND deleted = 0",
        )
        const totalPlants = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM plants WHERE deleted = 0")

        return {
            totalScans: (totalScans as any)?.count || 0,
            healthyScans: (healthyScans as any)?.count || 0,
            diseasedScans: (diseasedScans as any)?.count || 0,
            totalPlants: (totalPlants as any)?.count || 0,
        }
    }

    // Sync queue methods
    async addToSyncQueue(tableName: string, localId: string, action: string, data: any): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        const id = `sync_${tableName}_${localId}_${Date.now()}`

        await this.db.runAsync(
            `INSERT OR REPLACE INTO sync_queue (id, table_name, local_id, action, data, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, tableName, localId, action, JSON.stringify(data), new Date().toISOString()],
        )
    }

    async getSyncQueue(): Promise<any[]> {
        if (!this.db) throw new Error("Database not initialized")

        const rows = await this.db.getAllAsync("SELECT * FROM sync_queue ORDER BY created_at ASC")

        return rows.map((row: any) => ({
            ...row,
            data: JSON.parse(row.data),
        }))
    }

    async removeSyncQueueItem(id: string): Promise<void> {
        if (!this.db) throw new Error("Database not initialized")

        await this.db.runAsync("DELETE FROM sync_queue WHERE id = ?", [id])
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
            return sourceUri
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

    private mapPlantFieldToColumn(field: string): string {
        const fieldMap: Record<string, string> = {
            plantedDate: "planted_date",
            imageUri: "image_url",
            createdAt: "created_at",
            updatedAt: "updated_at",
            userId: "user_id",
            serverId: "server_id",
        }
        return fieldMap[field] || field
    }

    private mapRowToPlantScan(row: any): PlantScan {
        return {
            id: row.id,
            plant_id: row.plant_id || null,
            diseaseName: row.result_type === "healthy" ? "Healthy" : "Disease Detected",
            confidence: row.confidence_score || 0,
            treatment: row.recommendations || "",
            imageUri: row.image_url,
            location:
                row.location_lat && row.location_lng
                    ? {
                        latitude: row.location_lat,
                        longitude: row.location_lng,
                    }
                    : undefined,
            createdAt: row.scan_date,
            updatedAt: row.scan_date,
            status: row.result_type || "unknown",
            top_predictions: row.detected_diseases ? JSON.parse(row.detected_diseases) : [],
            user_id: row.user_id,
        }
    }

    private mapRowToPlant(row: any): any {
        let location
        try {
            location = row.location ? JSON.parse(row.location) : undefined
        } catch {
            location = undefined
        }

        return {
            id: row.id,
            name: row.name,
            type: row.type,
            variety: row.variety,
            plantedDate: row.planted_date,
            location,
            image_url: row.image_url,
            health: "healthy", // Default value
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            user_id: row.user_id,
            server_id: row.server_id,
            synced: row.synced,
            updated_at: row.updated_at,
        }
    }

    private mapRowToDisease(row: any): Disease {
        let symptomsParsed
        try {
            symptomsParsed = typeof row.symptoms === "string" ? JSON.parse(row.symptoms) : row.symptoms
        } catch {
            symptomsParsed = row.symptoms
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
            affectedPlants: [],
            image_url: row.image_url,
            created_at: row.created_at,
        }
    }
}

export const databaseService = new DatabaseService()
