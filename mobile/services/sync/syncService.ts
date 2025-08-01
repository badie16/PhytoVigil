import { databaseService } from "../local/databaseService";
import { authService } from "../remote/auth";
import { storageService } from "../local/storage";
import NetInfo from "@react-native-community/netinfo";
import { config } from "@/lib/config/env";
import { Security } from "@/lib/guards/security";

// Interfaces
export interface SyncStatus {
    isOnline: boolean;
    lastSyncTime: Date | null;
    pendingUploads: number;
    pendingDownloads: number;
    isSyncing: boolean;
    syncProgress: number;
    errors: SyncError[];
}

export interface SyncError {
    id: string;
    type: "upload" | "download" | "conflict" | "general";
    message: string;
    timestamp: Date;
    data?: any;
}

export interface SyncQueueItem {
    id: string;
    type: "plant" | "scan" | "activity" | "user_profile";
    action: "create" | "update" | "delete";
    localId: string;
    serverId?: string;
    data: any;
    timestamp: Date;
    retryCount: number;
    priority: "high" | "medium" | "low";
}

// Interface pour les données de conflit (plus explicite)
export interface Conflict {
    id: string;
    type: string;
    localData: any;
    serverData: any;
    timestamp: Date;
}

class SyncService {
    private isInitialized = false;
    private syncStatus: SyncStatus = {
        isOnline: false,
        lastSyncTime: null,
        pendingUploads: 0,
        pendingDownloads: 0,
        isSyncing: false,
        syncProgress: 0,
        errors: [],
    };
    private syncQueue: SyncQueueItem[] = [];
    private listeners: ((status: SyncStatus) => void)[] = [];
    private syncInterval: NodeJS.Timeout | null = null;
    private conflictResolver: ConflictResolver;

    constructor() {
        this.conflictResolver = new ConflictResolver();
    }

    /**
     * Initializes the sync service, loads data from storage, and sets up listeners.
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            await this.loadSyncQueue();
            await this.loadSyncStatus();
            this.setupNetworkListener();
            this.setupPeriodicSync();

            this.isInitialized = true;
            console.log("✅ Sync service initialized");
        } catch (error) {
            console.error("❌ Failed to initialize sync service:", error);
            throw error;
        }
    }

    // --- Méthodes de persistance ---

    private async loadSyncQueue(): Promise<void> {
        try {
            const queueData = await storageService.getSecureItem("sync_queue");
            if (queueData) {
                this.syncQueue = JSON.parse(queueData).map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp),
                }));
            }
        } catch (error) {
            console.error("❌ Failed to load sync queue:", error);
            this.syncQueue = [];
        }
    }

    private async saveSyncQueue(): Promise<void> {
        try {
            await storageService.setSecureItem("sync_queue", JSON.stringify(this.syncQueue));
        } catch (error) {
            console.error("❌ Failed to save sync queue:", error);
        }
    }

    private async loadSyncStatus(): Promise<void> {
        try {
            const statusData = await storageService.getSecureItem("sync_status");
            if (statusData) {
                const parsed = JSON.parse(statusData);
                this.syncStatus = {
                    ...this.syncStatus,
                    lastSyncTime: parsed.lastSyncTime ? new Date(parsed.lastSyncTime) : null,
                    errors:
                        parsed.errors?.map((error: any) => ({
                            ...error,
                            timestamp: new Date(error.timestamp),
                        })) || [],
                };
            }
        } catch (error) {
            console.error("❌ Failed to load sync status:", error);
        }
    }

    private async saveSyncStatus(): Promise<void> {
        try {
            // Ne pas sauvegarder le statut isSyncing ou la progression
            const { isSyncing, syncProgress, ...statusToSave } = this.syncStatus;
            await storageService.setSecureItem("sync_status", JSON.stringify(statusToSave));
        } catch (error) {
            console.error("❌ Failed to save sync status:", error);
        }
    }

    // --- Configuration des listeners ---

    private setupNetworkListener(): void {
        NetInfo.addEventListener((state) => {
            const wasOnline = this.syncStatus.isOnline;
            this.syncStatus.isOnline = state.isConnected ?? false;

            if (!wasOnline && this.syncStatus.isOnline) {
                console.log("🌐 Network connection restored. Triggering sync.");
                this.triggerSync();
            }

            this.notifyListeners();
        });
    }

    private setupPeriodicSync(): void {
        // Sync every 5 minutes when online
        this.syncInterval = setInterval(
            () => {
                if (this.syncStatus.isOnline && !this.syncStatus.isSyncing) {
                    this.triggerSync();
                }
            },
            5 * 60 * 1000,
            // La conversion est parfois nécessaire dans les environnements non-Node.js comme React Native
        ) as unknown as NodeJS.Timeout;
    }

    // --- Méthodes publiques ---

    /**
     * Adds an item to the synchronization queue.
     * @param item The item to add, without id, timestamp, and retryCount.
     */
    async addToSyncQueue(item: Omit<SyncQueueItem, "id" | "timestamp" | "retryCount">): Promise<void> {
        const queueItem: SyncQueueItem = {
            ...item,
            id: `${item.type}_${item.localId}_${Date.now()}`,
            timestamp: new Date(),
            retryCount: 0,
        };

        this.syncQueue.push(queueItem);
        await this.saveSyncQueue();

        this.updatePendingUploadsCount();
        this.notifyListeners();

        if (this.syncStatus.isOnline) {
            this.triggerSync();
        }
    }

    /**
     * Triggers a full synchronization cycle (download, upload, resolve conflicts).
     */
    async triggerSync(): Promise<void> {
        if (this.syncStatus.isSyncing || !this.syncStatus.isOnline) {
            return;
        }

        try {
            this.syncStatus.isSyncing = true;
            this.syncStatus.syncProgress = 0;
            this.notifyListeners();

            // Étape 1: Télécharger les changements du serveur
            await this.downloadChanges();

            // Étape 2: Envoyer les changements en attente
            await this.uploadChanges();

            // Étape 3: Résoudre les conflits
            await this.resolveConflicts();

            this.syncStatus.lastSyncTime = new Date();
            console.log("✅ Sync completed successfully");
        } catch (error: any) {
            console.error("❌ Sync failed:", error);
            this.addSyncError("general", `Sync failed: ${error.message}`);
        } finally {
            this.syncStatus.isSyncing = false;
            this.syncStatus.syncProgress = 100;
            await this.saveSyncStatus();
            this.notifyListeners();
        }
    }

    // --- Logique de synchronisation (privée) ---

    private async downloadChanges(): Promise<void> {
        const user = await authService.getCurrentUser();
        if (!user) return;

        this.updateSyncProgress(10);
        const lastSync = this.syncStatus.lastSyncTime?.toISOString() ?? "1970-01-01T00:00:00Z";

        // Traitement générique pour chaque type de données
        await this._fetchAndProcessData("plants", lastSync, (items) => this.processDownloadedItems(items, "plant", databaseService.getPlantByServerId, databaseService.createPlant, databaseService.updatePlant));
        this.updateSyncProgress(30);

        await this._fetchAndProcessData("scans", lastSync, (items) => this.processDownloadedItems(items, "scan", databaseService.getScanByServerId, databaseService.createScan, databaseService.updateScan));
        this.updateSyncProgress(50);

        await this._fetchAndProcessData("activities", lastSync, (items) => this.processDownloadedItems(items, "activity", databaseService.getActivityByServerId, databaseService.createActivity, databaseService.updateActivity));
        this.updateSyncProgress(70);
    }

    /**
     * Generic function to fetch data from an endpoint and process it.
     */
    private async _fetchAndProcessData(endpoint: string, since: string, processFn: (items: any[]) => Promise<void>): Promise<void> {
        try {
            const response = await fetch(`${config.API_URL}/sync/${endpoint}?since=${since}`, {
                headers: { Authorization: `Bearer ${Security.getToken()}` },
            });

            if (response.ok) {
                const items = await response.json();
                if (items && items.length > 0) {
                    await processFn(items);
                }
            } else {
                throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
            }
        } catch (error: any) {
            console.error(`❌ Download failed for ${endpoint}:`, error);
            this.addSyncError("download", `Failed to download ${endpoint}: ${error.message}`);
        }
    }

    /**
     * Generic function to process downloaded items, checking for conflicts and creating/updating local records.
     */
    private async processDownloadedItems(items: any[], type: string, getByServerId: (id: string) => Promise<any>, createFn: (data: any) => Promise<any>, updateFn: (id: number, data: any) => Promise<any>): Promise<void> {
        for (const item of items) {
            try {
                const existingItem = await getByServerId(item.id);

                if (existingItem) {
                    if (existingItem.updatedAt && new Date(item.updated_at) < new Date(existingItem.updatedAt)) {
                        await this.handleConflict(type, existingItem, item);
                        continue;
                    }
                    // **CORRECTION CRITIQUE**: Ajout de 'await'
                    await updateFn(existingItem.id, { ...item, server_id: item.id, synced: true });
                } else {
                    // **CORRECTION CRITIQUE**: Ajout de 'await'
                    await createFn({ ...item, server_id: item.id, synced: true });
                }
            } catch (error: any) {
                console.error(`❌ Failed to process ${type} ${item.id}:`, error);
                this.addSyncError("download", `Failed to sync ${type}: ${error.message}`, item);
            }
        }
    }


    private async uploadChanges(): Promise<void> {
        const itemsToUpload = this.syncQueue.filter((item) => item.action !== "delete"); // Exclude deletes for now if they are handled differently

        for (let i = 0; i < itemsToUpload.length; i++) {
            const item = itemsToUpload[i];
            try {
                await this.uploadSyncItem(item);
                this.syncQueue = this.syncQueue.filter((queueItem) => queueItem.id !== item.id);
            } catch (error: any) {
                console.error(`❌ Failed to upload item ${item.id}:`, error);
                item.retryCount++;
                if (item.retryCount >= 3) {
                    this.syncQueue = this.syncQueue.filter((queueItem) => queueItem.id !== item.id);
                    this.addSyncError("upload", `Failed to upload after 3 retries: ${error.message}`, item);
                }
            }
            this.updateSyncProgress(70 + ((i + 1) / itemsToUpload.length) * 20);
        }

        await this.saveSyncQueue();
        this.updatePendingUploadsCount();
    }

    private async uploadSyncItem(item: SyncQueueItem): Promise<void> {
        const user = await authService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        let endpoint = "";
        let method: "POST" | "PUT" | "DELETE";

        switch (item.action) {
            case "create":
                endpoint = `/${item.type}s`;
                method = "POST";
                break;
            case "update":
                endpoint = `/${item.type}s/${item.serverId}`;
                method = "PUT";
                break;
            case "delete":
                endpoint = `/${item.type}s/${item.serverId}`;
                method = "DELETE";
                break;
        }

        const response = await fetch(`${config.API_URL}${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Security.getToken()}`,
            },
            body: method !== "DELETE" ? JSON.stringify(item.data) : undefined,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorBody}`);
        }

        if (item.action === "create") {
            const result = await response.json();
            await this.updateLocalRecordWithServerId(item.type, item.localId, result.id);
        }
    }

    private async updateLocalRecordWithServerId(type: string, localId: string, serverId: string): Promise<void> {
        const data = { server_id: serverId, synced: true };
        const id = Number.parseInt(localId, 10);

        switch (type) {
            case "plant": await databaseService.updatePlant(id, data); break;
            case "scan": await databaseService.updateScan(id, data); break;
            case "activity": await databaseService.updateActivity(id, data); break;
        }
    }

    // --- Gestion des conflits ---

    private async resolveConflicts(): Promise<void> {
        this.updateSyncProgress(95);
        const conflicts = await databaseService.getConflicts();

        for (const conflict of conflicts) {
            try {
                const resolution = await this.conflictResolver.resolve(conflict);
                await this.applyConflictResolution(conflict, resolution);
                await databaseService.removeConflict(conflict.id);
            } catch (error: any) {
                console.error(`❌ Failed to resolve conflict ${conflict.id}:`, error);
                this.addSyncError("conflict", `Failed to resolve conflict: ${error.message}`, conflict);
            }
        }
    }

    private async handleConflict(type: string, localData: any, serverData: any): Promise<void> {
        const conflict: Conflict = {
            id: `${type}_${localData.id}_${Date.now()}`,
            type,
            localData,
            serverData,
            timestamp: new Date(),
        };
        await databaseService.saveConflict(conflict);
    }

    private async applyConflictResolution(conflict: Conflict, resolution: any): Promise<void> {
        switch (resolution.action) {
            case "use_local":
                await this.addToSyncQueue({
                    type: conflict.type as any, // Cast as it's safe here
                    action: "update",
                    localId: conflict.localData.id.toString(),
                    serverId: conflict.serverData.id,
                    data: conflict.localData,
                    priority: "high",
                });
                break;

            case "use_server":
                const data = { ...conflict.serverData, server_id: conflict.serverData.id, synced: true };
                switch (conflict.type) {
                    case "plant": await databaseService.updatePlant(conflict.localData.id, data); break;
                    // Ajoutez d'autres types si nécessaire
                }
                break;

            case "merge":
                const mergedData = { ...resolution.mergedData, server_id: conflict.serverData.id, synced: true };
                switch (conflict.type) {
                    case "plant": await databaseService.updatePlant(conflict.localData.id, mergedData); break;
                    // Ajoutez d'autres types si nécessaire
                }
                break;
        }
    }

    // --- Utilitaires et Listeners ---

    private addSyncError(type: SyncError["type"], message: string, data?: any): void {
        const error: SyncError = {
            id: `error_${Date.now()}`,
            type,
            message,
            timestamp: new Date(),
            data,
        };
        this.syncStatus.errors.push(error);
        if (this.syncStatus.errors.length > 20) {
            this.syncStatus.errors = this.syncStatus.errors.slice(-20);
        }
    }

    private updatePendingUploadsCount(): void {
        this.syncStatus.pendingUploads = this.syncQueue.filter(
            (item) => item.action !== "delete", // Adapter si la suppression est comptée
        ).length;
    }

    private updateSyncProgress(progress: number): void {
        this.syncStatus.syncProgress = progress;
        this.notifyListeners();
    }

    addListener(listener: (status: SyncStatus) => void): () => void {
        this.listeners.push(listener);
        // Retourne une fonction pour se désinscrire
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener({ ...this.syncStatus }));
    }

    // --- Getters ---
    get status(): SyncStatus { return { ...this.syncStatus }; }
    get isOnline(): boolean { return this.syncStatus.isOnline; }
    get isSyncing(): boolean { return this.syncStatus.isSyncing; }

    // --- Cleanup ---
    destroy(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        this.listeners = [];
        this.isInitialized = false;
        console.log("🧹 Sync service destroyed.");
    }
}

class ConflictResolver {
    async resolve(conflict: Conflict): Promise<{ action: 'use_local' | 'use_server' | 'merge', mergedData?: any }> {
        // Stratégie simple : "last write wins" (le plus récent gagne)
        const localTimestamp = new Date(conflict.localData.updated_at || conflict.localData.created_at);
        const serverTimestamp = new Date(conflict.serverData.updated_at || conflict.serverData.created_at);

        if (localTimestamp > serverTimestamp) {
            return { action: "use_local" };
        } else {
            return { action: "use_server" };
        }

        // Exemple pour une logique de fusion plus complexe (actuellement non utilisée)
        // return {
        //   action: 'merge',
        //   mergedData: this.mergeData(conflict.localData, conflict.serverData)
        // }
    }

    private mergeData(localData: any, serverData: any): any {
        // Implémentez ici une logique de fusion intelligente.
        // Cet exemple simple préfère les valeurs du serveur mais remplit les champs nuls avec les données locales.
        const merged = { ...serverData };
        for (const key of Object.keys(localData)) {
            if (merged[key] === null || merged[key] === undefined) {
                merged[key] = localData[key];
            }
        }
        return merged;
    }
}

export const syncService = new SyncService();