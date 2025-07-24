import { config } from "@/lib/config/env";
import { appendImageToFormData } from "@/lib/constant/Helper";
import type { BackendPlantScan, PlantScan, PredictionRequest, PredictionResponse } from "@/types";
import { storageService } from "../local/storage";
import plantService from "./plantService";


export interface ScanHistoryResponse {
    scans: BackendPlantScan[]
    total: number
    page: number
    per_page: number
}

class ScanService {
    private async getAuthHeaders(): Promise<HeadersInit> {
        const token = await storageService.getSecureItem(config.TOKEN_KEY)
        return {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }
    }
    private async getMultipartHeaders(): Promise<HeadersInit> {
        const token = await storageService.getSecureItem(config.TOKEN_KEY)
        return {
            Authorization: token ? `Bearer ${token}` : "",
        }
    }

    /**
     * Upload image and get ML prediction
     */
    async predictDisease(request: PredictionRequest): Promise<PredictionResponse> {
        try {
            const formData = new FormData()
            const dateStr = new Date().toISOString().replace(/[:.]/g, "-")
            const name = `plant_image_${dateStr}.jpg`
            await appendImageToFormData(formData, request.image, name, "image");
            const apiResponse = await fetch(`${config.API_URL}/api/ml/predict`, {
                method: "POST",
                headers: await this.getMultipartHeaders(),
                body: formData,
            })

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json().catch(() => ({}))
                throw new Error(errorData.detail || `HTTP error! status: ${apiResponse.status}`)
            }

            const data = await apiResponse.json()
            return this.transformBackendPredictToPredict(data)
        } catch (error) {
            console.error("Error predicting disease:", error)
            throw new Error(error instanceof Error ? error.message : "Failed to analyze image")
        }
    }

    /**
     * Upload image, get ML prediction, and save scan in database
    */
    async predictAndSaveScan(request: {
        image: any,
        plantId?: number,
        locationLat?: number,
        locationLng?: number,
        address?: string
    }): Promise<PlantScan> {
        try {
            const formData = new FormData()
            const dateStr = new Date().toISOString().replace(/[:.]/g, "-")
            const name = `plant_scan_${dateStr}.jpg`
            await appendImageToFormData(formData, request.image, name, "image")

            if (request.plantId !== undefined) {
                formData.append("plant_id", String(request.plantId))
            }
            if (request.locationLat !== undefined) {
                formData.append("location_lat", String(request.locationLat))
            }
            if (request.locationLng !== undefined) {
                formData.append("location_lng", String(request.locationLng))
            }
            if (request.address !== undefined) {
                formData.append("address", String(request.address))
            }
            const response = await fetch(`${config.API_URL}/api/scans/`, {
                method: "POST",
                headers: await this.getMultipartHeaders(),
                body: formData,
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return plantService.transformBackendScanToPlantScan(data)
        } catch (error) {
            console.error("Error predicting and saving scan:", error)
            throw new Error(error instanceof Error ? error.message : "Failed to analyze and save scan")
        }
    }


    /**
     * Save scan result to database
     */
    async saveScanResult(scanData: {
        plant_id: number
        image_url: string
        result_type: "healthy" | "diseased" | "unknown"
        confidence_score: number
        detected_diseases?: Record<string, any>
        recommendations?: string
        location_lat?: number
        location_lng?: number
        notes?: string
    }): Promise<BackendPlantScan> {
        try {
            const response = await fetch(`${config.API_URL}/api/v1/scans/`, {
                method: "POST",
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(scanData),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error saving scan result:", error)
            throw new Error(error instanceof Error ? error.message : "Failed to save scan result")
        }
    }

    /**
     * Get scan history for current user
     */
    async getScanHistory(params?: {
        page?: number
        per_page?: number
        plant_id?: number
        result_type?: "healthy" | "diseased" | "unknown"
        start_date?: string
        end_date?: string
    }): Promise<ScanHistoryResponse> {
        try {
            const queryParams = new URLSearchParams()

            if (params?.page) queryParams.append("page", params.page.toString())
            if (params?.per_page) queryParams.append("per_page", params.per_page.toString())
            if (params?.plant_id) queryParams.append("plant_id", params.plant_id.toString())
            if (params?.result_type) queryParams.append("result_type", params.result_type)
            if (params?.start_date) queryParams.append("start_date", params.start_date)
            if (params?.end_date) queryParams.append("end_date", params.end_date)

            const url = `${config.API_URL}/api/v1/scans/?${queryParams.toString()}`

            const response = await fetch(url, {
                method: "GET",
                headers: await this.getAuthHeaders(),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error fetching scan history:", error)
            throw new Error(error instanceof Error ? error.message : "Failed to fetch scan history")
        }
    }

    /**
     * Get specific scan by ID
     */
    async getScanById(scanId: number): Promise<BackendPlantScan> {
        try {
            const response = await fetch(`${config.API_URL}/api/v1/scans/${scanId}`, {
                method: "GET",
                headers: await this.getAuthHeaders(),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error fetching scan:", error)
            throw new Error(error instanceof Error ? error.message : "Failed to fetch scan")
        }
    }

    /**
     * Delete scan by ID
     */
    async deleteScan(scanId: number): Promise<void> {
        try {
            const response = await fetch(`${config.API_URL}/api/v1/scans/${scanId}`, {
                method: "DELETE",
                headers: await this.getAuthHeaders(),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
            }
        } catch (error) {
            console.error("Error deleting scan:", error)
            throw new Error(error instanceof Error ? error.message : "Failed to delete scan")
        }
    }

    /**
     * Update scan notes
     */
    async updateScanNotes(scanId: number, notes: string): Promise<BackendPlantScan> {
        try {
            const response = await fetch(`${config.API_URL}/api/v1/scans/${scanId}`, {
                method: "PATCH",
                headers: await this.getAuthHeaders(),
                body: JSON.stringify({ notes }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error updating scan notes:", error)
            throw new Error(error instanceof Error ? error.message : "Failed to update scan notes")
        }
    }

    transformBackendPredictToPredict(backend: any): PredictionResponse {
        return {
            diseaseName: backend.predicted_class ?? backend.disease_name ?? "",
            top_predictions: Array.isArray(backend.top_predictions)
                ? backend.top_predictions.map((pred: any) => ({
                    class_name: pred.class_name ?? pred.className ?? "",
                    confidence: pred.confidence,
                    rank: pred.rank,
                }))
                : [],
            confidence: Number((backend.confidence * 100).toFixed(2)),
            treatment: backend.treatment ?? backend.recommendations,
            location: backend.location
                ? {
                    latitude: backend.location.latitude,
                    longitude: backend.location.longitude,
                    address: backend.location.address,
                }
                : undefined,
            status: backend.result_type ?? "unknown",
            createdAt: backend.scan_date ?? undefined,
            model_version: backend.model_version ?? undefined,
            processing_time: backend.processing_time ?? undefined,
        }
    }

    /**
     * Get scan statistics for dashboard
     */
    async getScanStatistics(params?: {
        plant_id?: number
        days?: number // Last N days
    }): Promise<{
        total_scans: number
        healthy_scans: number
        diseased_scans: number
        unknown_scans: number
        most_common_diseases: Array<{
            disease_name: string
            count: number
        }>
        scan_trend: Array<{
            date: string
            count: number
        }>
    }> {
        try {
            const queryParams = new URLSearchParams()

            if (params?.plant_id) queryParams.append("plant_id", params.plant_id.toString())
            if (params?.days) queryParams.append("days", params.days.toString())

            const url = `${config.API_URL}/api/v1/scans/statistics?${queryParams.toString()}`

            const response = await fetch(url, {
                method: "GET",
                headers: await this.getAuthHeaders(),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error fetching scan statistics:", error)
            throw new Error(error instanceof Error ? error.message : "Failed to fetch scan statistics")
        }
    }

    /**
     * Batch process multiple images (for future use)
     */
    // async batchPredict(images: PredictionRequest[]): Promise<PredictionResponse[]> {
    //     try {
    //         const promises = images.map((image) => this.predictDisease(image))
    //         const results = await Promise.allSettled(promises)

    //         return results.map((result, index) => {
    //             if (result.status === "fulfilled") {
    //                 return result.value
    //             } else {
    //                 console.error(`Batch prediction failed for image ${index}:`, result.reason)
    //                 return {
    //                     success: false,
    //                     prediction: {
    //                         class_name: "Error",
    //                         confidence: 0,
    //                         is_healthy: false,
    //                     },
    //                     message: result.reason?.message || "Prediction failed",
    //                 }
    //             }
    //         })
    //     } catch (error) {
    //         console.error("Error in batch prediction:", error)
    //         throw new Error(error instanceof Error ? error.message : "Batch prediction failed")
    //     }
    // }
}

export const scanService = new ScanService()
export default scanService
