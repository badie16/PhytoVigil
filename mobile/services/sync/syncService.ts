import { databaseService } from "@/services/local/databaseService"
import { storageService } from "@/services/local/storage"
import diseaseService from "@/services/remote/diseaseService"
import plantService from "@/services/remote/plantService"
import { scanService } from "@/services/remote/scanService"

interface SyncQueue {
  id: string
  type: "plant" | "scan" | "disease"
  action: "create" | "update" | "delete"
  data: any
  timestamp: string
  retryCount: number
}

class SyncService {
  private syncQueue: SyncQueue[] = []
  private isSyncing = false
  private readonly MAX_RETRIES = 3
  private readonly SYNC_QUEUE_KEY = "sync_queue"

  async initialize() {
    // Charger la queue de sync depuis le storage
    await this.loadSyncQueue()

    // Écouter les changements de connexion
    this.setupNetworkListener()
  }

  private setupNetworkListener() {
    // Cette méthode sera appelée quand la connexion revient
    // Pour l'instant, on peut l'appeler manuellement
  }

  // === GESTION DE LA QUEUE DE SYNC ===

  async addToSyncQueue(type: SyncQueue["type"], action: SyncQueue["action"], data: any) {
    const queueItem: SyncQueue = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      action,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    }

    this.syncQueue.push(queueItem)
    await this.saveSyncQueue()

    // Essayer de synchroniser immédiatement si connecté
    if (await this.isOnline()) {
      this.processSyncQueue()
    }
  }

  private async loadSyncQueue() {
    try {
      const queueData = await storageService.getUserPreferences()
      this.syncQueue = queueData[this.SYNC_QUEUE_KEY] || []
    } catch (error) {
      console.error("Erreur lors du chargement de la queue de sync:", error)
      this.syncQueue = []
    }
  }

  private async saveSyncQueue() {
    try {
      await storageService.saveUserPreference(this.SYNC_QUEUE_KEY, this.syncQueue)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la queue de sync:", error)
    }
  }

  // === SYNCHRONISATION DES DONNÉES ===

  async syncAllData() {
    if (!(await this.isOnline())) {
      console.log("Pas de connexion - sync annulée")
      return false
    }

    if (this.isSyncing) {
      console.log("Synchronisation déjà en cours")
      return false
    }

    this.isSyncing = true

    try {
      // 1. Synchroniser les données de référence (maladies)
      await this.syncDiseases()

      // 2. Traiter la queue de synchronisation
      await this.processSyncQueue()

      // 3. Synchroniser les données utilisateur
      await this.syncUserData()

      return true
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error)
      return false
    } finally {
      this.isSyncing = false
    }
  }

  private async syncDiseases() {
    try {
      console.log("🔄 Synchronisation des maladies...")

      // Récupérer les maladies depuis l'API
      const remoteDiseases = await diseaseService.getAllDisease()

      // Sauvegarder localement
      for (const disease of remoteDiseases) {
        await databaseService.saveDisease(disease)
      }

      // Marquer la dernière sync
      await storageService.saveUserPreference("last_diseases_sync", new Date().toISOString())

      console.log(`✅ ${remoteDiseases.length} maladies synchronisées`)
    } catch (error) {
      console.error("❌ Erreur sync maladies:", error)
      throw error
    }
  }

  private async syncUserData() {
    try {
      console.log("🔄 Synchronisation des données utilisateur...")

      // Synchroniser les plantes
      const remotePlants = await plantService.getUserPlantsBackend()
      for (const plant of remotePlants) {
        await databaseService.savePlantFromRemote(plant)
      }
      // Synchroniser les scans de plantes pour chaque plante
      for (const plant of remotePlants) {
        if (plant.id) {
          const remoteScans = await plantService.getScansByPlantId(plant.id)
          for (const scan of remoteScans) {
            await databaseService.savePlantScan(scan)
          }
        }
      }

      console.log(`✅ ${remotePlants.length} plantes synchronisées`)
    } catch (error) {
      console.error("❌ Erreur sync données utilisateur:", error)
      throw error
    }
  }

  private async processSyncQueue() {
    console.log(`🔄 Traitement de ${this.syncQueue.length} éléments en queue`)

    const itemsToRemove: string[] = []

    for (const item of this.syncQueue) {
      try {
        await this.syncQueueItem(item)
        itemsToRemove.push(item.id)
      } catch (error) {
        console.error(`❌ Erreur sync item ${item.id}:`, error)

        item.retryCount++
        if (item.retryCount >= this.MAX_RETRIES) {
          console.log(`🗑️ Suppression item ${item.id} après ${this.MAX_RETRIES} tentatives`)
          itemsToRemove.push(item.id)
        }
      }
    }

    // Supprimer les éléments traités
    this.syncQueue = this.syncQueue.filter((item) => !itemsToRemove.includes(item.id))
    await this.saveSyncQueue()
  }

  private async syncQueueItem(item: SyncQueue) {
    switch (item.type) {
      case "plant":
        await this.syncPlantItem(item)
        break
      case "scan":
        await this.syncScanItem(item)
        break
      default:
        console.log(`Type de sync non supporté: ${item.type}`)
    }
  }

  private async syncPlantItem(item: SyncQueue) {
    switch (item.action) {
      case "create":
        await plantService.createPlant(item.data)
        break
      case "update":
        // await plantService.updatePlant(item.data.id, item.data)
        break
      case "delete":
        // await plantService.deletePlant(item.data.id)
        break
    }
  }

  private async syncScanItem(item: SyncQueue) {
    switch (item.action) {
      case "create":
        // Convertir l'image locale en base64 pour l'envoi
        const imageBase64 = await this.convertImageToBase64(item.data.imageUri)
        await scanService.predictAndSaveScan({
          ...item.data,
          image: imageBase64,
        })
        break
    }
  }

  // === UTILITAIRES ===

  private async isOnline(): Promise<boolean> {
    // Utiliser le hook useNetworkStatus ou une vérification simple
    try {
      const response = await fetch("https://www.google.com", {
        method: "HEAD",
        mode: "no-cors",
      })
      return true
    } catch {
      return false
    }
  }

  private async convertImageToBase64(imageUri: string): Promise<string> {
    // Implémentation pour convertir l'image en base64
    // Cette fonction dépend de la plateforme (React Native vs Web)
    return imageUri // Placeholder
  }

  // === API PUBLIQUE ===

  async getSyncStatus() {
    const lastSync = await storageService.getUserPreferences()
    return {
      isOnline: await this.isOnline(),
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      lastDiseasesSync: lastSync.last_diseases_sync,
      lastUserDataSync: lastSync.last_user_data_sync,
    }
  }

  async forceSyncDiseases() {
    if (await this.isOnline()) {
      await this.syncDiseases()
      return true
    }
    return false
  }
}

export const syncService = new SyncService()
