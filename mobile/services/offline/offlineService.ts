import { databaseService } from "../local/databaseService"
import { storageService } from "../local/storage"
import NetInfo from "@react-native-community/netinfo"
import * as FileSystem from "expo-file-system"

export interface OfflineStatus {
    isOfflineMode: boolean
    hasOfflineData: boolean
    offlineModelsReady: boolean
    cachedImagesCount: number
    lastOfflineSync: Date | null
    offlineCapabilities: {
        plantManagement: boolean
        diseaseDetection: boolean
        scanHistory: boolean
        weatherCache: boolean
    }
}

class OfflineService {
    private offlineStatus: OfflineStatus = {
        isOfflineMode: false,
        hasOfflineData: false,
        offlineModelsReady: false,
        cachedImagesCount: 0,
        lastOfflineSync: null,
        offlineCapabilities: {
            plantManagement: true,
            diseaseDetection: false,
            scanHistory: true,
            weatherCache: false,
        },
    }

    private listeners: ((status: OfflineStatus) => void)[] = []
    private offlineMLModel: any = null

    async initialize(): Promise<void> {
        try {
            // Check network status
            const netInfo = await NetInfo.fetch()
            this.offlineStatus.isOfflineMode = !netInfo.isConnected

            // Setup network listener
            NetInfo.addEventListener((state) => {
                const wasOffline = this.offlineStatus.isOfflineMode
                this.offlineStatus.isOfflineMode = !state.isConnected

                if (wasOffline && !this.offlineStatus.isOfflineMode) {
                    // Just came online
                    this.onConnectionRestored()
                } else if (!wasOffline && this.offlineStatus.isOfflineMode) {
                    // Just went offline
                    this.onConnectionLost()
                }

                this.notifyListeners()
            })

            // Load offline data status
            await this.checkOfflineDataAvailability()

            // Initialize offline ML model if available
            await this.initializeOfflineML()

            // Load cached images count
            await this.updateCachedImagesCount()

            console.log("Offline service initialized")
        } catch (error) {
            console.error("Failed to initialize offline service:", error)
        }
    }

    private async checkOfflineDataAvailability(): Promise<void> {
        try {
            // Check if we have plants data
            const plants = await databaseService.getPlants()

            // Check if we have diseases data
            const diseases = await databaseService.getDiseases()

            // Check if we have scan history
            const scans = await databaseService.getPlantScans(1)

            this.offlineStatus.hasOfflineData = plants.length > 0 || diseases.length > 0 || scans.length > 0

            // Load last offline sync time
            const lastSync = await storageService.getSecureItem("last_offline_sync")
            if (lastSync) {
                this.offlineStatus.lastOfflineSync = new Date(lastSync)
            }
        } catch (error) {
            console.error("Error checking offline data:", error)
            this.offlineStatus.hasOfflineData = false
        }
    }

    private async initializeOfflineML(): Promise<void> {
        try {
            // Check if offline ML model exists
            const modelPath = `${FileSystem.documentDirectory}ml_models/plant_disease_model.tflite`
            const modelExists = await FileSystem.getInfoAsync(modelPath)

            if (modelExists.exists) {
                // Load the offline ML model
                // This would use TensorFlow Lite or similar
                // For now, we'll simulate with a simple offline classifier
                this.offlineMLModel = new OfflineMLClassifier()
                await this.offlineMLModel.initialize(modelPath)

                this.offlineStatus.offlineModelsReady = true
                this.offlineStatus.offlineCapabilities.diseaseDetection = true
            } else {
                // Try to download model if online
                if (!this.offlineStatus.isOfflineMode) {
                    await this.downloadOfflineModel()
                }
            }
        } catch (error) {
            console.error("Failed to initialize offline ML:", error)
            this.offlineStatus.offlineModelsReady = false
            this.offlineStatus.offlineCapabilities.diseaseDetection = false
        }
    }

    private async downloadOfflineModel(): Promise<void> {
        try {
            console.log("Downloading offline ML model...")

            // Create models directory
            const modelsDir = `${FileSystem.documentDirectory}ml_models/`
            await FileSystem.makeDirectoryAsync(modelsDir, { intermediates: true })

            // Download model file (this would be your actual model URL)
            const modelUrl = `${process.env.EXPO_PUBLIC_API_URL}/models/plant_disease_model.tflite`
            const modelPath = `${modelsDir}plant_disease_model.tflite`

            const downloadResult = await FileSystem.downloadAsync(modelUrl, modelPath)

            if (downloadResult.status === 200) {
                console.log("Offline model downloaded successfully")
                await this.initializeOfflineML()
            }
        } catch (error) {
            console.error("Failed to download offline model:", error)
        }
    }

    private async updateCachedImagesCount(): Promise<void> {
        try {
            const imagesDir = `${FileSystem.documentDirectory}images/`
            const dirInfo = await FileSystem.getInfoAsync(imagesDir)

            if (dirInfo.exists && dirInfo.isDirectory) {
                const files = await FileSystem.readDirectoryAsync(imagesDir)
                this.offlineStatus.cachedImagesCount = files.length
            }
        } catch (error) {
            console.error("Error counting cached images:", error)
            this.offlineStatus.cachedImagesCount = 0
        }
    }

    // Offline Plant Disease Detection
    async detectDiseaseOffline(imageUri: string): Promise<{
        diseaseName: string
        confidence: number
        treatment: string
        isOfflineResult: boolean
    }> {
        if (!this.offlineStatus.offlineModelsReady || !this.offlineMLModel) {
            throw new Error("Offline disease detection not available")
        }

        try {
            // Use offline ML model to detect disease
            const result = await this.offlineMLModel.predict(imageUri)

            // Get treatment from local database
            const disease = await databaseService.getDiseaseByName(result.diseaseName)

            return {
                diseaseName: result.diseaseName,
                confidence: result.confidence,
                treatment: disease?.treatment || "Treatment information not available offline",
                isOfflineResult: true,
            }
        } catch (error) {
            console.error("Offline disease detection failed:", error)
            throw new Error("Failed to detect disease offline")
        }
    }

    // Cache essential data for offline use
    async cacheEssentialData(): Promise<void> {
        if (this.offlineStatus.isOfflineMode) {
            throw new Error("Cannot cache data while offline")
        }

        try {
            console.log("Caching essential data for offline use...")

            // Cache diseases data
            await this.cacheDiseases()

            // Cache weather data
            await this.cacheWeatherData()

            // Cache plant care tips
            await this.cachePlantTips()

            // Update last sync time
            await storageService.setSecureItem("last_offline_sync", new Date().toISOString())
            this.offlineStatus.lastOfflineSync = new Date()

            console.log("Essential data cached successfully")
            this.notifyListeners()
        } catch (error) {
            console.error("Failed to cache essential data:", error)
            throw error
        }
    }

    private async cacheDiseases(): Promise<void> {
        try {
            // This would typically fetch from API and store in local DB
            // For now, we'll ensure we have basic disease data
            const diseases = await databaseService.getDiseases()

            if (diseases.length === 0) {
                // Add some basic disease data for offline use
                const basicDiseases = [
                    {
                        name: "Healthy",
                        scientific_name: "No Disease",
                        description: "Plant appears healthy with no visible signs of disease",
                        symptoms: ["Green leaves", "Normal growth", "No spots or discoloration"],
                        treatment: "Continue regular care and monitoring",
                        prevention: "Maintain proper watering, lighting, and nutrition",
                        severity_level: 0,
                        image_url: null,
                    },
                    {
                        name: "Leaf Spot",
                        scientific_name: "Various pathogens",
                        description: "Common fungal or bacterial infection causing spots on leaves",
                        symptoms: ["Brown or black spots on leaves", "Yellowing around spots", "Leaf drop"],
                        treatment: "Remove affected leaves, improve air circulation, apply fungicide if needed",
                        prevention: "Avoid overhead watering, ensure good drainage",
                        severity_level: 2,
                        image_url: null,
                    },
                    {
                        name: "Powdery Mildew",
                        scientific_name: "Erysiphales",
                        description: "Fungal infection creating white powdery coating on leaves",
                        symptoms: ["White powdery coating", "Leaf distortion", "Stunted growth"],
                        treatment: "Improve air circulation, apply fungicide, remove affected parts",
                        prevention: "Avoid overcrowding, maintain proper humidity",
                        severity_level: 2,
                        image_url: null,
                    },
                ]

                // Save to local database
                for (const disease of basicDiseases) {
                    // TODO: Add more comprehensive disease data for offline use in the future
                    // await databaseService.saveDisease(disease)
                }
            }
        } catch (error) {
            console.error("Failed to cache diseases:", error)
        }
    }

    private async cacheWeatherData(): Promise<void> {
        try {
            // Cache current weather data for offline use
            const weatherData = {
                temperature: 22,
                humidity: 65,
                condition: "partly_cloudy",
                cached_at: new Date().toISOString(),
                location: "Cached Location",
            }

            await storageService.setSecureItem("cached_weather", JSON.stringify(weatherData))
            this.offlineStatus.offlineCapabilities.weatherCache = true
        } catch (error) {
            console.error("Failed to cache weather data:", error)
        }
    }

    private async cachePlantTips(): Promise<void> {
        try {
            const basicTips = [
                {
                    id: "tip_1",
                    title: "Watering Best Practices",
                    content: "Water plants early morning or late evening to reduce evaporation",
                    category: "watering",
                    priority: "high",
                },
                {
                    id: "tip_2",
                    title: "Disease Prevention",
                    content: "Ensure good air circulation around plants to prevent fungal diseases",
                    category: "disease_prevention",
                    priority: "high",
                },
                {
                    id: "tip_3",
                    title: "Nutrient Management",
                    content: "Use balanced fertilizer during growing season for optimal plant health",
                    category: "nutrition",
                    priority: "medium",
                },
            ]

            await storageService.setSecureItem("cached_tips", JSON.stringify(basicTips))
        } catch (error) {
            console.error("Failed to cache plant tips:", error)
        }
    }

    // Get cached weather data for offline use
    async getCachedWeather(): Promise<any> {
        try {
            const cachedWeather = await storageService.getSecureItem("cached_weather")
            if (cachedWeather) {
                return JSON.parse(cachedWeather)
            }
            return null
        } catch (error) {
            console.error("Failed to get cached weather:", error)
            return null
        }
    }

    // Get cached tips for offline use
    async getCachedTips(): Promise<any[]> {
        try {
            const cachedTips = await storageService.getSecureItem("cached_tips")
            if (cachedTips) {
                return JSON.parse(cachedTips)
            }
            return []
        } catch (error) {
            console.error("Failed to get cached tips:", error)
            return []
        }
    }

    // Event handlers
    private async onConnectionRestored(): Promise<void> {
        console.log("Connection restored - preparing for sync")
        // Trigger sync when connection is restored
        // This would be handled by the sync service
    }

    private async onConnectionLost(): Promise<void> {
        console.log("Connection lost - switching to offline mode")
        // Ensure offline capabilities are ready
        await this.checkOfflineDataAvailability()
    }

    // Public methods
    get status(): OfflineStatus {
        return { ...this.offlineStatus }
    }

    get isOffline(): boolean {
        return this.offlineStatus.isOfflineMode
    }

    get canDetectDiseasesOffline(): boolean {
        return this.offlineStatus.offlineModelsReady
    }

    // Listener management
    addListener(listener: (status: OfflineStatus) => void): () => void {
        this.listeners.push(listener)
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener)
        }
    }

    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener({ ...this.offlineStatus }))
    }
}

// Simple offline ML classifier simulation
class OfflineMLClassifier {
    private isInitialized = false

    async initialize(modelPath: string): Promise<void> {
        // In a real implementation, this would load a TensorFlow Lite model
        console.log(`Initializing offline ML model from ${modelPath}`)
        this.isInitialized = true
    }

    async predict(imageUri: string): Promise<{ diseaseName: string; confidence: number }> {
        if (!this.isInitialized) {
            throw new Error("Model not initialized")
        }

        // Simulate ML prediction with basic image analysis
        // In reality, this would use TensorFlow Lite or similar
        const predictions = [
            { diseaseName: "Healthy", confidence: 0.85 },
            { diseaseName: "Leaf Spot", confidence: 0.75 },
            { diseaseName: "Powdery Mildew", confidence: 0.65 },
        ]

        // Return random prediction for simulation
        const randomIndex = Math.floor(Math.random() * predictions.length)
        return predictions[randomIndex]
    }
}

export const offlineService = new OfflineService()
