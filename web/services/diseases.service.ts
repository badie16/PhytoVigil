import { apiClient, type ApiResponse } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

export interface Disease {
  id: number
  name: string
  scientific_name?: string
  description?: string
  symptoms: string[] | string
  treatment: string
  prevention?: string
  severity_level: number
  image_url?: string
  created_at: string
  scan_count?: number
  detection_accuracy?: number
  affectedPlants?: string[]
}
export interface CreateDiseaseData {
  name: string
  scientific_name?: string
  description?: string
  symptoms: string
  treatment: string
  prevention?: string
  severity_level: number
  image_url?: string
}

export interface UpdateDiseaseData {
  name?: string
  scientific_name?: string
  description?: string
  symptoms?: string
  treatment?: string
  prevention?: string
  severity_level?: number
  image_url?: string
}

export interface DiseasesListParams {
  page?: number
  limit?: number
  search?: string
  severity_level?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface DiseaseStats {
  totalDiseases: number
  highSeverityDiseases: number
  totalDetections: number
  averageAccuracy: number
  diseaseDistribution: Array<{
    name: string
    value: number
    color: string
  }>
}

export interface GenerateTreatmentRequest {
  diseaseName: string
  symptoms?: string
  severity?: number
}

export interface GenerateTreatmentResponse {
  treatment: string
  prevention: string
  description: string
}

export class DiseasesService {
  async getDiseases(params: DiseasesListParams = {}): Promise<ApiResponse<Disease[]>> {
    return apiClient.get<Disease[]>(API_ENDPOINTS.DISEASES.LIST, params)
  }

  async getDiseaseById(id: number): Promise<ApiResponse<Disease>> {
    return apiClient.get<Disease>(API_ENDPOINTS.DISEASES.GET(id))
  }

  async createDisease(data: CreateDiseaseData): Promise<ApiResponse<Disease>> {
    return apiClient.post<Disease>(API_ENDPOINTS.DISEASES.CREATE, data)
  }

  async updateDisease(id: number, data: UpdateDiseaseData): Promise<ApiResponse<Disease>> {
    return apiClient.put<Disease>(API_ENDPOINTS.DISEASES.UPDATE(id), data)
  }

  async deleteDisease(id: number): Promise<ApiResponse> {
    return apiClient.delete(API_ENDPOINTS.DISEASES.DELETE(id))
  }

  async getDiseaseStats(): Promise<ApiResponse<DiseaseStats>> {
    return apiClient.get<DiseaseStats>(API_ENDPOINTS.DISEASES.STATS)
  }

  async generateTreatment(data: GenerateTreatmentRequest): Promise<ApiResponse<GenerateTreatmentResponse>> {
    return apiClient.post<GenerateTreatmentResponse>(API_ENDPOINTS.DISEASES.GENERATE_TREATMENT, data)
  }

  async uploadDiseaseImage(file: File, diseaseId?: number): Promise<ApiResponse<{ url: string }>> {
    return apiClient.uploadFile<{ url: string }>(
      API_ENDPOINTS.DISEASES.UPLOAD_IMAGE,
      file,
      diseaseId ? { diseaseId } : undefined,
    )
  }

  async bulkImportDiseases(file: File): Promise<ApiResponse<{ imported: number; errors: any[] }>> {
    return apiClient.uploadFile<{ imported: number; errors: any[] }>("/diseases/bulk-import", file)
  }
}

export const diseasesService = new DiseasesService()
