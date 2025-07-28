import { weatherService, type WeatherData } from "./remote/weatherService"
import { scanService } from "./remote/scanService"
import  plantService  from "./remote/plantService"
import type { Plant, PlantScan } from "@/types"
import * as Location from "expo-location"

export interface Tip {
    id: string
    title: string
    description: string
    icon: string
    priority: "high" | "medium" | "low"
    category: "weather" | "plant" | "disease" | "general"
    action?: {
        type: "scan" | "navigate" | "external"
        data?: any
    }
    dismissible: boolean
    createdAt: string
}

class TipsService {
    private recentScans: PlantScan[] = []
    private userPlants: Plant[] = []
    private currentWeather: WeatherData | null = null

    async generateTips(): Promise<Tip[]> {
        const tips: Tip[] = []

        try {
            // Get user location and weather
            await this.updateWeatherData()

            // Get user data
            await this.updateUserData()

            // Generate different types of tips
            const weatherTips = this.generateWeatherTips()
            const plantTips = this.generatePlantTips()
            const diseaseTips = this.generateDiseaseTips()
            const generalTips = this.generateGeneralTips()

            tips.push(...weatherTips, ...plantTips, ...diseaseTips, ...generalTips)

            // Sort by priority and limit to 3-5 tips
            return tips.sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority)).slice(0, 5)
        } catch (error) {
            console.error("Error generating tips:", error)
            return this.getFallbackTips()
        }
    }

    private async updateWeatherData(): Promise<void> {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                throw new Error("Location permission denied")
            }

            const location = await Location.getCurrentPositionAsync({})
            this.currentWeather = await weatherService.getCurrentWeather(location.coords.latitude, location.coords.longitude)
        } catch (error) {
            console.error("Error updating weather data:", error)
        }
    }

    private async updateUserData(): Promise<void> {
        try {
            // Get recent scans
            // this.recentScans = await this.getRecentScans()

            // Get user plants
            // this.userPlants = await plantService.getUserPlants()
        } catch (error) {
            console.error("Error updating user data:", error)
        }
    }

    private async getRecentScans(): Promise<PlantScan[]> {
        try {
            const response = await scanService.getScanHistory({
                page: 1,
                per_page: 10,
            })

            // Transform backend scans to PlantScan format
            return response.scans.map((scan) => ({
                id: scan.id,
                plant_id: scan.plant_id,
                diseaseName: scan.detected_diseases?.disease_name || "Unknown",
                top_predictions: [],
                confidence: Number.parseFloat(scan.confidence_score) || 0,
                treatment: scan.recommendations || "",
                imageUri: scan.image_url || "",
                location:
                    scan.location_lat && scan.location_lng
                        ? {
                            latitude: Number.parseFloat(scan.location_lat),
                            longitude: Number.parseFloat(scan.location_lng),
                            address: "",
                        }
                        : undefined,
                createdAt: scan.scan_date,
                updatedAt: scan.scan_date,
                status: scan.result_type,
                notes: "",
            }))
        } catch (error) {
            console.error("Error fetching recent scans:", error)
            return []
        }
    }

    private generateWeatherTips(): Tip[] {
        const tips: Tip[] = []

        if (!this.currentWeather) return tips

        const weather = this.currentWeather

        // Perfect weather for scanning
        if (weatherService.isGoodWeatherForScanning(weather)) {
            tips.push({
                id: "perfect-weather",
                title: "Perfect Weather for Scanning",
                description:
                    "Natural lighting is ideal for accurate plant disease detection. Take photos outdoors when possible.",
                icon: "☀️",
                priority: "high",
                category: "weather",
                action: {
                    type: "scan",
                },
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        // High temperature warning
        if (weather.temperature > 30) {
            tips.push({
                id: "high-temp-warning",
                title: "High Temperature Alert",
                description: `It's ${weather.temperature}°C today. Increase watering frequency and provide shade for sensitive plants.`,
                icon: "🌡️",
                priority: "high",
                category: "weather",
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        // Low temperature warning
        if (weather.temperature < 5) {
            tips.push({
                id: "low-temp-warning",
                title: "Frost Protection Needed",
                description: `Temperature is ${weather.temperature}°C. Cover sensitive plants or move them indoors.`,
                icon: "❄️",
                priority: "high",
                category: "weather",
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        // High humidity warning
        if (weather.humidity > 80) {
            tips.push({
                id: "high-humidity",
                title: "High Humidity Alert",
                description: `Humidity is ${weather.humidity}%. Watch for fungal diseases and ensure good air circulation.`,
                icon: "💧",
                priority: "medium",
                category: "weather",
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        return tips
    }

    private generatePlantTips(): Tip[] {
        const tips: Tip[] = []

        // No plants added
        if (this.userPlants.length === 0) {
            tips.push({
                id: "add-first-plant",
                title: "Add Your First Plant",
                description: "Start tracking your plants' health by adding them to your garden.",
                icon: "🌱",
                priority: "high",
                category: "plant",
                action: {
                    type: "navigate",
                    data: { screen: "add-plant" },
                },
                dismissible: false,
                createdAt: new Date().toISOString(),
            })
            return tips
        }

        // Plants not scanned recently
        const unscannedPlants = this.userPlants.filter((plant) => {
            const lastScan = this.recentScans.find((scan) => scan.plant_id === plant.id)
            if (!lastScan) return true

            const daysSinceLastScan = Math.floor(
                (Date.now() - new Date(lastScan.createdAt).getTime()) / (1000 * 60 * 60 * 24),
            )
            return daysSinceLastScan > 7
        })

        if (unscannedPlants.length > 0) {
            tips.push({
                id: "scan-plants",
                title: "Check Your Plants",
                description: `${unscannedPlants.length} plants haven't been scanned recently. Regular monitoring helps catch issues early.`,
                icon: "🔍",
                priority: "medium",
                category: "plant",
                action: {
                    type: "navigate",
                    data: { screen: "plants" },
                },
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        // Unhealthy plants
        const unhealthyPlants = this.userPlants.filter((plant) => plant.health === "warning" || plant.health === "danger")

        if (unhealthyPlants.length > 0) {
            tips.push({
                id: "unhealthy-plants",
                title: "Plants Need Attention",
                description: `${unhealthyPlants.length} plants show signs of health issues. Check them for proper treatment.`,
                icon: "⚠️",
                priority: "high",
                category: "plant",
                action: {
                    type: "navigate",
                    data: { screen: "plants" },
                },
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        return tips
    }

    private generateDiseaseTips(): Tip[] {
        const tips: Tip[] = []

        // Recent disease detections
        const recentDiseases = this.recentScans.filter(
            (scan) => scan.status === "diseased" && Date.now() - new Date(scan.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000, // Last 7 days
        )

        if (recentDiseases.length > 0) {
            const uniqueDiseases = [...new Set(recentDiseases.map((scan) => scan.diseaseName))]

            tips.push({
                id: "recent-diseases",
                title: "Monitor Recent Diseases",
                description: `${uniqueDiseases.length} disease(s) detected recently: ${uniqueDiseases.slice(0, 2).join(", ")}. Continue monitoring affected plants.`,
                icon: "🦠",
                priority: "high",
                category: "disease",
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        // Seasonal disease warnings
        const currentMonth = new Date().getMonth()
        if (currentMonth >= 5 && currentMonth <= 8) {
            // Summer months
            tips.push({
                id: "summer-diseases",
                title: "Summer Disease Watch",
                description: "Hot weather increases risk of bacterial and viral diseases. Scan plants more frequently.",
                icon: "🌞",
                priority: "medium",
                category: "disease",
                action: {
                    type: "scan",
                },
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        return tips
    }

    private generateGeneralTips(): Tip[] {
        const tips: Tip[] = []

        // Time-based tips
        const currentHour = new Date().getHours()

        if (currentHour >= 8 && currentHour <= 10) {
            tips.push({
                id: "morning-scan",
                title: "Perfect Time for Scanning",
                description: "Morning light provides the best conditions for accurate plant disease detection.",
                icon: "🌅",
                priority: "medium",
                category: "general",
                action: {
                    type: "scan",
                },
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        // Seasonal tips
        const currentMonth = new Date().getMonth()
        if (currentMonth >= 2 && currentMonth <= 4) {
            // Spring
            tips.push({
                id: "spring-care",
                title: "Spring Plant Care",
                description: "Spring is the perfect time to fertilize and repot your plants for healthy growth.",
                icon: "🌸",
                priority: "low",
                category: "general",
                dismissible: true,
                createdAt: new Date().toISOString(),
            })
        }

        return tips
    }

    private getPriorityWeight(priority: "high" | "medium" | "low"): number {
        switch (priority) {
            case "high":
                return 3
            case "medium":
                return 2
            case "low":
                return 1
            default:
                return 0
        }
    }

    private getFallbackTips(): Tip[] {
        return [
            {
                id: "fallback-scan",
                title: "Scan Your Plants",
                description: "Regular scanning helps detect plant diseases early and maintain healthy plants.",
                icon: "📱",
                priority: "medium",
                category: "general",
                action: {
                    type: "scan",
                },
                dismissible: true,
                createdAt: new Date().toISOString(),
            },
        ]
    }
}

export const tipsService = new TipsService()
export default tipsService
