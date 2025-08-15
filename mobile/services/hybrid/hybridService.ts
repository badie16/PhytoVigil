import { databaseService } from "@/services/local/databaseService"
import { syncService } from "@/services/sync/syncService"
import diseaseService from "@/services/remote/diseaseService"
import plantService from "@/services/remote/plantService"
import { scanService } from "@/services/remote/scanService"
import type { Disease, Plant, PlantScan, PredictionRequest } from "@/types"

class HybridService {
    // === GESTION DES MALADIES ===

    async getAllDiseases(): Promise<Disease[]> {
        try {
            // Essayer d'abord en ligne
            if (await this.isOnline()) {
                const remoteDiseases = await diseaseService.getAllDisease()

                // Sauvegarder en local pour usage offline
                for (const disease of remoteDiseases) {
                    await databaseService.saveDisease(disease)
                }

                return remoteDiseases
            }
        } catch (error) {
            console.log("❌ Erreur API maladies, basculement offline:", error)
        }

        // Fallback: données locales
        console.log("📱 Mode offline: chargement des maladies locales")
        return await databaseService.getDiseases()
    }

    async getDiseaseByName(name: string): Promise<Disease | null> {
        try {
            if (await this.isOnline()) {
                const disease = await diseaseService.getDiseaseByName(name)
                if (disease) {
                    await databaseService.saveDisease(disease)
                    return disease
                }
            }
        } catch (error) {
            console.log("❌ Erreur API maladie, basculement offline:", error)
        }

        return await databaseService.getDiseaseByName(name)
    }

    async searchDiseases(query: string): Promise<Disease[]> {
        try {
            if (await this.isOnline()) {
                const diseases = await diseaseService.getAllDisease()
                // TODO searchDiseases
                // Sauvegarder les résultats en local
                for (const disease of diseases) {
                    await databaseService.saveDisease(disease)
                }

                return diseases
            }
        } catch (error) {
            console.log("❌ Erreur recherche API, basculement offline:", error)
        }

        return await databaseService.searchDiseases(query)
    }

    // === GESTION DES PLANTES ===

    async getUserPlants(): Promise<Plant[]> {
        try {
            if (await this.isOnline()) {
                const remotePlants = await plantService.getUserPlantsBackend()

                // Synchroniser avec la base locale
                for (const plant of remotePlants) {
                    await databaseService.savePlantFromRemote(plant)
                }

                return await Promise.all(remotePlants.map(plantService.transformBackendPlantToPlant.bind(plantService)))
            }
        } catch (error) {
            console.log("❌ Erreur API plantes, basculement offline:", error)
        }

        return await databaseService.getPlants()
    }

    // async createPlant(plantData: Omit<Plant, "id" | "createdAt" | "updatedAt">): Promise<Plant> {
    //     // Toujours sauvegarder en local d'abord
    //     const localId = await databaseService.savePlant(plantData)
    //     const localPlant = await databaseService.getPlantById(localId)

    //     if (!localPlant) {
    //         throw new Error("Erreur lors de la sauvegarde locale")
    //     }

    //     // Essayer de synchroniser en ligne
    //     if (await this.isOnline()) {
    //         try {
    //             const remotePlant = await plantService.createPlant(plantData)

    //             // Mettre à jour avec l'ID distant
    //             await databaseService.updatePlant(localId, {
    //                 id: remotePlant.id,
    //                 synced: true,
    //             })

    //             return remotePlant
    //         } catch (error) {
    //             console.log("❌ Erreur création plante online, ajout à la queue:", error)

    //             // Ajouter à la queue de synchronisation
    //             await syncService.addToSyncQueue("plant", "create", plantData)
    //         }
    //     } else {
    //         // Ajouter à la queue pour sync ultérieure
    //         await syncService.addToSyncQueue("plant", "create", plantData)
    //     }

    //     return localPlant
    // }

    // async updatePlant(id: number, updates: Partial<Plant>): Promise<void> {
    //     // Mettre à jour en local
    //     await databaseService.updatePlant(id.toString(), updates)

    //     // Essayer de synchroniser
    //     if (await this.isOnline()) {
    //         try {
    //             await plantService.updatePlant(id, updates)
    //             await databaseService.updatePlant(id.toString(), { synced: true })
    //         } catch (error) {
    //             console.log("❌ Erreur update plante online, ajout à la queue:", error)
    //             await syncService.addToSyncQueue("plant", "update", { id, ...updates })
    //         }
    //     } else {
    //         await syncService.addToSyncQueue("plant", "update", { id, ...updates })
    //     }
    // }

    // async deletePlant(id: number): Promise<void> {
    //     // Marquer comme supprimé localement
    //     await databaseService.updatePlant(id.toString(), {
    //         deleted: true,
    //         synced: false,
    //     })

    //     if (await this.isOnline()) {
    //         try {
    //             await plantService.deletePlant(id)
    //             await databaseService.deletePlant(id.toString())
    //         } catch (error) {
    //             console.log("❌ Erreur suppression plante online, ajout à la queue:", error)
    //             await syncService.addToSyncQueue("plant", "delete", { id })
    //         }
    //     } else {
    //         await syncService.addToSyncQueue("plant", "delete", { id })
    //     }
    // }

    // === GESTION DES SCANS ===

    async predictDisease(request: PredictionRequest): Promise<PlantScan> {
        if (await this.isOnline()) {
            try {
                // Scan en ligne avec IA complète
                const result = await scanService.predictDisease(request)

                // Sauvegarder le résultat localement
                const scanData = {
                    plant_id: 0, // Scan rapide sans plante associée
                    diseaseName: result.diseaseName,
                    top_predictions: result.top_predictions,
                    confidence: result.confidence,
                    treatment: result.treatment,
                    imageUri: request.image,
                    status: result.status,
                    processing_time: result.processing_time,
                    model_version: result.model_version,
                }

                const localId = await databaseService.savePlantScan(scanData)
                const localScan = await databaseService.getPlantScanById(localId)

                return localScan!
            } catch (error) {
                console.log("❌ Erreur scan online, basculement offline:", error)
            }
        }

        // Mode offline: scan basique avec données locales
        return await this.predictDiseaseOffline(request)
    }

    private async predictDiseaseOffline(request: PredictionRequest): Promise<PlantScan> {
        console.log("📱 Mode offline: analyse basique de l'image")

        // Analyse offline simplifiée
        // On peut implémenter une logique basique ou utiliser des modèles légers
        const offlineResult = {
            diseaseName: "Analyse offline - Connexion requise pour diagnostic précis",
            top_predictions: [
                {
                    class_name: "Analyse limitée",
                    confidence: 0.5,
                    rank: 1,
                },
            ],
            confidence: 0.5,
            treatment:
                "Veuillez vous connecter à Internet pour obtenir un diagnostic précis et des recommandations de traitement.",
            status: "unknown" as const,
            processing_time: 100,
            model_version: "offline-v1.0",
        }

        // Sauvegarder localement
        const scanData = {
            plant_id: 0,
            diseaseName: offlineResult.diseaseName,
            top_predictions: offlineResult.top_predictions,
            confidence: offlineResult.confidence,
            treatment: offlineResult.treatment,
            imageUri: request.image,
            status: offlineResult.status,
            processing_time: offlineResult.processing_time,
            model_version: offlineResult.model_version,
        }

        const localId = await databaseService.savePlantScan(scanData)
        const localScan = await databaseService.getPlantScanById(localId)

        // Ajouter à la queue pour re-analyse en ligne
        await syncService.addToSyncQueue("scan", "create", {
            ...scanData,
            needsReanalysis: true,
        })

        return localScan!
    }

    async predictAndSaveScan(request: { image: string; plantId: number }): Promise<PlantScan> {
        if (await this.isOnline()) {
            try {
                const result = await scanService.predictAndSaveScan(request)

                // Sauvegarder localement aussi
                const scanData = {
                    plant_id: request.plantId,
                    diseaseName: result.diseaseName,
                    top_predictions: result.top_predictions,
                    confidence: result.confidence,
                    treatment: result.treatment,
                    imageUri: request.image,
                    status: result.status,
                    processing_time: result.processing_time,
                    model_version: result.model_version,
                }

                await databaseService.savePlantScan(scanData)
                return result
            } catch (error) {
                console.log("❌ Erreur scan avec sauvegarde online:", error)
            }
        }

        // Mode offline
        const offlineResult = await this.predictDiseaseOffline({ image: request.image })

        // Mettre à jour avec l'ID de la plante
        await databaseService.updatePlantScan(offlineResult.id.toString(), {
            plant_id: request.plantId,
        })

        return offlineResult
    }

    // === UTILITAIRES ===

    private async isOnline(): Promise<boolean> {
        try {
            const response = await fetch("https://www.google.com", {
                method: "HEAD",
                mode: "no-cors",
                cache: "no-cache",
            })
            return true
        } catch {
            return false
        }
    }

    async getConnectionStatus() {
        return {
            isOnline: await this.isOnline(),
            syncStatus: await syncService.getSyncStatus(),
        }
    }
}

export const hybridService = new HybridService()
