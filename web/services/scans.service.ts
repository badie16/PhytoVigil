import { apiClient, type ApiResponse } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

export interface PlantScan {
  id: number
  user_id: number
  plant_id?: number
  image_url: string
  result_type: "healthy" | "diseased" | "unknown"
  confidence_score: number
  detected_diseases: any[]
  recommendations?: string
  scan_date: string
  location_lat?: number
  location_lng?: number
  user?: {
    id: number
    name: string
    email: string
  }
  plant?: {
    id: number
    name: string
    type: string
  }
  validation_status?: "pending" | "validated" | "rejected"
  expert_notes?: string
}

export interface CreateScanData {
  user_id: number
  plant_id?: number
  image_url: string
  result_type: "healthy" | "diseased" | "unknown"
  confidence_score: number
  detected_diseases: any[]
  recommendations?: string
  location_lat?: number
  location_lng?: number
}

export interface UpdateScanData {
  result_type?: "healthy" | "diseased" | "unknown"
  confidence_score?: number
  detected_diseases?: any[]
  recommendations?: string
  validation_status?: "pending" | "validated" | "rejected"
  expert_notes?: string
}

export interface ScansListParams {
  page?: number
  limit?: number
  search?: string
  user_id?: number
  result_type?: string
  validation_status?: string
  date_from?: string
  date_to?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ScanStats {
  totalScans: number
  correctPredictions: number
  incorrectPredictions: number
  accuracy: number
  scansByDay: Array<{
    name: string
    scans: number
    correct: number
  }>
  diseaseDistribution: Array<{
    name: string
    value: number
    color: string
  }>
}

export interface ValidateScanData {
  validation_status: "validated" | "rejected"
  expert_notes?: string
  correct_disease_id?: number
}

export class ScansService {
  async getScans(params: ScansListParams = {}): Promise<ApiResponse<PlantScan[]>> {
    return apiClient.get<PlantScan[]>(API_ENDPOINTS.SCANS.LIST, params)
  }

  async getScanById(id: number): Promise<ApiResponse<PlantScan>> {
    return apiClient.get<PlantScan>(API_ENDPOINTS.SCANS.GET(id))
  }

  async createScan(data: CreateScanData): Promise<ApiResponse<PlantScan>> {
    return apiClient.post<PlantScan>(API_ENDPOINTS.SCANS.CREATE, data)
  }

  async updateScan(id: number, data: UpdateScanData): Promise<ApiResponse<PlantScan>> {
    return apiClient.put<PlantScan>(API_ENDPOINTS.SCANS.UPDATE(id), data)
  }

  async deleteScan(id: number): Promise<ApiResponse> {
    return apiClient.delete(API_ENDPOINTS.SCANS.DELETE(id))
  }

  async getScanStats(): Promise<ApiResponse<ScanStats>> {
    return apiClient.get<ScanStats>(API_ENDPOINTS.SCANS.STATS)
  }

  async validateScan(id: number, data: ValidateScanData): Promise<ApiResponse<PlantScan>> {
    return apiClient.post<PlantScan>(API_ENDPOINTS.SCANS.VALIDATE(id), data)
  }

  async exportScans(params: ScansListParams = {}): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>(API_ENDPOINTS.SCANS.EXPORT, params)
  }

  async bulkValidateScans(scanIds: number[], data: ValidateScanData): Promise<ApiResponse> {
    return apiClient.post("/plant-scans/bulk-validate", { scanIds, data })
  }

  async getUserScans(userId: number, params: Omit<ScansListParams, "user_id"> = {}): Promise<ApiResponse<PlantScan[]>> {
    return apiClient.get<PlantScan[]>(`/plant-scans/user/${userId}`, params)
  }
}

export const scansService = new ScansService()
