import { config } from "@/lib/config/env"
import { storageService } from "../local/storage"

export interface Activity {
    id: string
    type: "scan" | "plant_added" | "treatment" | "watering" | "fertilizing" | "note_added"
    title: string
    description: string
    timestamp: string
    plantId?: number
    plantName?: string
    scanId?: number
    status?: "healthy" | "diseased" | "warning" | "info"
    meta_data?: {
        diseaseName?: string
        confidence?: number
        treatment?: string
        location?: string
        [key: string]: any
    }
}

class ActivityService {
    private async getAuthHeaders(): Promise<HeadersInit> {
        const token = await storageService.getSecureItem(config.TOKEN_KEY)
        return {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }
    }

    /**
     * Get recent activities for the user
     */
    async getRecentActivities(limit = 10): Promise<Activity[]> {
        try {
            const response = await fetch(`${config.API_URL}/api/activities/recent?limit=${limit}`, {
                method: "GET",
                headers: await this.getAuthHeaders(),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log(data)
            return data || []
        } catch (error) {
            console.error("Error fetching recent activities:", error)
            return []
        }
    }

    /**
     * Create a new activity
     */
    async createActivity(activity: Omit<Activity, "id" | "timestamp">): Promise<Activity> {
        try {
            const response = await fetch(`${config.API_URL}/api/activities/`, {
                method: "POST",
                headers: await this.getAuthHeaders(),
                body: JSON.stringify({
                    ...activity,
                    timestamp: new Date().toISOString(),
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error creating activity:", error)
            throw error
        }
    }

    /**
     * Get activities by type
     */
    async getActivitiesByType(type: Activity["type"], limit = 20): Promise<Activity[]> {
        try {
            const response = await fetch(`${config.API_URL}/api/activities/by-type/${type}?limit=${limit}`, {
                method: "GET",
                headers: await this.getAuthHeaders(),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data || []
        } catch (error) {
            console.error("Error fetching activities by type:", error)
            return []
        }
    }

    /**
     * Get activities for a specific plant
     */
    async getPlantActivities(plantId: number, limit = 20): Promise<Activity[]> {
        try {
            const response = await fetch(`${config.API_URL}/api/activities/plant/${plantId}?limit=${limit}`, {
                method: "GET",
                headers: await this.getAuthHeaders(),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data || []
        } catch (error) {
            console.error("Error fetching plant activities:", error)
            return []
        }
    }

    /**
     * Delete an activity
     */
    async deleteActivity(activityId: string): Promise<void> {
        try {
            const response = await fetch(`${config.API_URL}/api/activities/${activityId}`, {
                method: "DELETE",
                headers: await this.getAuthHeaders(),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        } catch (error) {
            console.error("Error deleting activity:", error)
            throw error
        }
    }
}

export const activityService = new ActivityService()
export default activityService
