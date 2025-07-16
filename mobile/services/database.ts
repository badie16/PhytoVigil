// import type { Disease, Plant, PlantScan } from "@/types"
// import * as FileSystem from "expo-file-system"
// import * as SQLite from "expo-sqlite"

// class DatabaseService {
//   private db: SQLite.SQLiteDatabase | null = null

//   async init() {
//     try {
//       this.db = await SQLite.openDatabaseAsync("phytovigil.db")
//       await this.createTables()
//       await this.seedDiseases()
//       console.log("Database initialized successfully")
//     } catch (error) {
//       console.error("Database initialization error:", error)
//       throw error
//     }
//   }

//   private async createTables() {
//     if (!this.db) throw new Error("Database not initialized")

//     // Plant Scans table
//     await this.db.execAsync(`
//       CREATE TABLE IF NOT EXISTS plant_scans (
//         id TEXT PRIMARY KEY,
//         plant_name TEXT NOT NULL,
//         disease_name TEXT NOT NULL,
//         confidence INTEGER NOT NULL,
//         treatment TEXT NOT NULL,
//         image_uri TEXT NOT NULL,
//         latitude REAL,
//         longitude REAL,
//         address TEXT,
//         created_at TEXT NOT NULL,
//         updated_at TEXT NOT NULL,
//         status TEXT NOT NULL,
//         notes TEXT
//       );
//     `)

//     // Plants table
//     await this.db.execAsync(`
//       CREATE TABLE IF NOT EXISTS plants (
//         id TEXT PRIMARY KEY,
//         name TEXT NOT NULL,
//         type TEXT NOT NULL,
//         variety TEXT,
//         planted_date TEXT,
//         latitude REAL,
//         longitude REAL,
//         address TEXT,
//         image_uri TEXT,
//         health TEXT NOT NULL,
//         last_scanned TEXT,
//         notes TEXT,
//         created_at TEXT NOT NULL,
//         updated_at TEXT NOT NULL
//       );
//     `)

//     // Diseases table
//     await this.db.execAsync(`
//       CREATE TABLE IF NOT EXISTS diseases (
//         id TEXT PRIMARY KEY,
//         name TEXT NOT NULL,
//         scientific_name TEXT,
//         description TEXT NOT NULL,
//         symptoms TEXT NOT NULL,
//         treatment TEXT NOT NULL,
//         prevention TEXT NOT NULL,
//         severity TEXT NOT NULL,
//         affected_plants TEXT NOT NULL,
//         image_uri TEXT
//       );
//     `)
//   }

//   private async seedDiseases() {
//     if (!this.db) return

//     const count = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM diseases")
//     if ((count as any)?.count > 0) return

//     const diseases: Omit<Disease, "id">[] = [
//       {
//         name: "Late Blight",
//         scientificName: "Phytophthora infestans",
//         description: "A devastating disease that affects tomatoes and potatoes",
//         symptoms: ["Dark spots on leaves", "White fuzzy growth", "Rapid leaf death"],
//         treatment: "Apply copper-based fungicide every 7-10 days. Remove affected leaves immediately.",
//         prevention: "Ensure good air circulation, avoid overhead watering, plant resistant varieties.",
//         severity: "high",
//         affectedPlants: ["Tomato", "Potato", "Pepper"],
//         imageUri: "/placeholder.svg?height=200&width=200",
//       },
//       {
//         name: "Powdery Mildew",
//         scientificName: "Erysiphe cichoracearum",
//         description: "Common fungal disease causing white powdery coating",
//         symptoms: ["White powdery spots", "Yellowing leaves", "Stunted growth"],
//         treatment: "Apply baking soda solution (1 tsp per quart water) twice weekly.",
//         prevention: "Improve air circulation, avoid overcrowding, water at soil level.",
//         severity: "medium",
//         affectedPlants: ["Rose", "Cucumber", "Zucchini", "Grape"],
//         imageUri: "/placeholder.svg?height=200&width=200",
//       },
//       {
//         name: "Black Spot",
//         scientificName: "Diplocarpon rosae",
//         description: "Fungal disease primarily affecting roses",
//         symptoms: ["Black circular spots", "Yellow halos", "Leaf drop"],
//         treatment: "Use neem oil spray weekly. Improve air circulation around plants.",
//         prevention: "Water at soil level, remove fallen leaves, plant resistant varieties.",
//         severity: "medium",
//         affectedPlants: ["Rose"],
//         imageUri: "/placeholder.svg?height=200&width=200",
//       },
//     ]

//     for (const disease of diseases) {
//       await this.db.runAsync(
//         `INSERT INTO diseases (id, name, scientific_name, description, symptoms, treatment, prevention, severity, affected_plants, image_uri)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           Date.now().toString() + Math.random().toString(36).substr(2, 9),
//           disease.name,
//           disease.scientificName || "",
//           disease.description,
//           JSON.stringify(disease.symptoms),
//           disease.treatment,
//           disease.prevention,
//           disease.severity,
//           JSON.stringify(disease.affectedPlants),
//           disease.imageUri || "",
//         ],
//       )
//     }
//   }

//   // Plant Scans CRUD
//   async savePlantScan(scan: Omit<PlantScan, "id" | "createdAt" | "updatedAt">): Promise<string> {
//     if (!this.db) throw new Error("Database not initialized")

//     const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
//     const now = new Date().toISOString()

//     // Save image to local storage
//     const savedImageUri = await this.saveImageLocally(scan.imageUri, id)

//     await this.db.runAsync(
//       `INSERT INTO plant_scans (id, plant_name, disease_name, confidence, treatment, image_uri, latitude, longitude, address, created_at, updated_at, status, notes)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         id,
//         scan.plantName,
//         scan.diseaseName,
//         scan.confidence,
//         scan.treatment,
//         savedImageUri,
//         scan.location?.latitude || null,
//         scan.location?.longitude || null,
//         scan.location?.address || null,
//         now,
//         now,
//         scan.status,
//         scan.notes || null,
//       ],
//     )

//     return id
//   }

//   async getPlantScans(limit?: number): Promise<PlantScan[]> {
//     if (!this.db) throw new Error("Database not initialized")

//     const query = `SELECT * FROM plant_scans ORDER BY created_at DESC ${limit ? `LIMIT ${limit}` : ""}`
//     const rows = await this.db.getAllAsync(query)

//     return rows.map(this.mapRowToPlantScan)
//   }

//   async getPlantScanById(id: string): Promise<PlantScan | null> {
//     if (!this.db) throw new Error("Database not initialized")

//     const row = await this.db.getFirstAsync("SELECT * FROM plant_scans WHERE id = ?", [id])
//     return row ? this.mapRowToPlantScan(row) : null
//   }

//   async deletePlantScan(id: string): Promise<void> {
//     if (!this.db) throw new Error("Database not initialized")

//     // Get the scan to delete its image
//     const scan = await this.getPlantScanById(id)
//     if (scan?.imageUri) {
//       await this.deleteImageLocally(scan.imageUri)
//     }

//     await this.db.runAsync("DELETE FROM plant_scans WHERE id = ?", [id])
//   }

//   // Plants CRUD
//   async savePlant(plant: Omit<Plant, "id" | "createdAt" | "updatedAt">): Promise<string> {
//     if (!this.db) throw new Error("Database not initialized")

//     const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
//     const now = new Date().toISOString()

//     let savedImageUri = null
//     if (plant.imageUri) {
//       savedImageUri = await this.saveImageLocally(plant.imageUri, id)
//     }

//     await this.db.runAsync(
//       `INSERT INTO plants (id, name, type, variety, planted_date, latitude, longitude, address, image_uri, health, last_scanned, notes, created_at, updated_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         id,
//         plant.name,
//         plant.type,
//         plant.variety || null,
//         plant.plantedDate || null,
//         plant.location?.latitude || null,
//         plant.location?.longitude || null,
//         plant.location?.address || null,
//         savedImageUri,
//         plant.health,
//         plant.lastScanned || null,
//         plant.notes || null,
//         now,
//         now,
//       ],
//     )

//     return id
//   }

//   async getPlants(): Promise<Plant[]> {
//     if (!this.db) throw new Error("Database not initialized")

//     const rows = await this.db.getAllAsync("SELECT * FROM plants ORDER BY created_at DESC")
//     return rows.map(this.mapRowToPlant)
//   }

//   async updatePlant(id: string, updates: Partial<Plant>): Promise<void> {
//     if (!this.db) throw new Error("Database not initialized")

//     const now = new Date().toISOString()
//     const setClause = Object.keys(updates)
//       .map((key) => `${key} = ?`)
//       .join(", ")
//     const values = [...Object.values(updates), now, id]

//     await this.db.runAsync(`UPDATE plants SET ${setClause}, updated_at = ? WHERE id = ?`, values)
//   }

//   // Diseases
//   async getDiseases(): Promise<Disease[]> {
//     if (!this.db) throw new Error("Database not initialized")

//     const rows = await this.db.getAllAsync("SELECT * FROM diseases ORDER BY name")
//     return rows.map(this.mapRowToDisease)
//   }

//   async searchDiseases(query: string): Promise<Disease[]> {
//     if (!this.db) throw new Error("Database not initialized")

//     const rows = await this.db.getAllAsync(
//       "SELECT * FROM diseases WHERE name LIKE ? OR description LIKE ? ORDER BY name",
//       [`%${query}%`, `%${query}%`],
//     )
//     return rows.map(this.mapRowToDisease)
//   }

//   // Statistics
//   async getStats() {
//     if (!this.db) throw new Error("Database not initialized")

//     const totalScans = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM plant_scans")
//     const healthyScans = await this.db.getFirstAsync(
//       'SELECT COUNT(*) as count FROM plant_scans WHERE status = "healthy"',
//     )
//     const diseasedScans = await this.db.getFirstAsync(
//       'SELECT COUNT(*) as count FROM plant_scans WHERE status = "diseased"',
//     )
//     const totalPlants = await this.db.getFirstAsync("SELECT COUNT(*) as count FROM plants")

//     return {
//       totalScans: (totalScans as any)?.count || 0,
//       healthyScans: (healthyScans as any)?.count || 0,
//       diseasedScans: (diseasedScans as any)?.count || 0,
//       totalPlants: (totalPlants as any)?.count || 0,
//     }
//   }

//   // Helper methods
//   private async saveImageLocally(sourceUri: string, id: string): Promise<string> {
//     try {
//       const directory = `${FileSystem.documentDirectory}images/`
//       await FileSystem.makeDirectoryAsync(directory, { intermediates: true })

//       const filename = `${id}_${Date.now()}.jpg`
//       const destinationUri = `${directory}${filename}`

//       await FileSystem.copyAsync({
//         from: sourceUri,
//         to: destinationUri,
//       })

//       return destinationUri
//     } catch (error) {
//       console.error("Error saving image locally:", error)
//       return sourceUri // Fallback to original URI
//     }
//   }

//   private async deleteImageLocally(imageUri: string): Promise<void> {
//     try {
//       if (imageUri.startsWith(FileSystem.documentDirectory!)) {
//         await FileSystem.deleteAsync(imageUri, { idempotent: true })
//       }
//     } catch (error) {
//       console.error("Error deleting image locally:", error)
//     }
//   }

//   private mapRowToPlantScan(row: any): PlantScan {
//     return {
//       id: row.id,
//       plantName: row.plant_name,
//       diseaseName: row.disease_name,
//       confidence: row.confidence,
//       treatment: row.treatment,
//       imageUri: row.image_uri,
//       location:
//         row.latitude && row.longitude
//           ? {
//               latitude: row.latitude,
//               longitude: row.longitude,
//               address: row.address,
//             }
//           : undefined,
//       createdAt: row.created_at,
//       updatedAt: row.updated_at,
//       status: row.status,
//       notes: row.notes,
//     }
//   }

//   private mapRowToPlant(row: any): Plant {
//     return {
//       id: row.id,
//       name: row.name,
//       type: row.type,
//       variety: row.variety,
//       plantedDate: row.planted_date,
//       location:
//         row.latitude && row.longitude
//           ? {
//               latitude: row.latitude,
//               longitude: row.longitude,
//               address: row.address,
//             }
//           : undefined,
//       imageUri: row.image_uri,
//       health: row.health,
//       lastScanned: row.last_scanned,
//       notes: row.notes,
//       createdAt: row.created_at,
//       updatedAt: row.updated_at,
//     }
//   }

//   private mapRowToDisease(row: any): Disease {
//     return {
//       id: row.id,
//       name: row.name,
//       scientificName: row.scientific_name,
//       description: row.description,
//       symptoms: JSON.parse(row.symptoms),
//       treatment: row.treatment,
//       prevention: row.prevention,
//       severity: row.severity,
//       affectedPlants: JSON.parse(row.affected_plants),
//       imageUri: row.image_uri,
//     }
//   }
// }

// export const databaseService = new DatabaseService()
