import { apiClient, type ApiResponse } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

export interface AIModelInfo {
  name: string
  version: string
  accuracy: number
  status: "active" | "training" | "inactive"
  lastUpdate: string
  size: string
  architecture: string
  framework: string
  classes: number
  trainingData: string
  description?: string
}

export interface PredictionRequest {
  image: string // base64 encoded image
  confidence_threshold?: number
}

export interface PredictionResponse {
  predictions: Array<{
    disease_id: number
    disease_name: string
    confidence: number
    symptoms: string[]
    treatment: string
    prevention: string
  }>
  confidence: number
  processing_time: number
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  inferenceTime: number
  performanceHistory: Array<{
    date: string
    accuracy: number
    precision: number
    recall: number
  }>
}

export interface GeminiGenerateRequest {
  prompt: string
  template?: string
  context?: Record<string, any>
}

export interface GeminiGenerateResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface GeminiTemplate {
  id: string
  name: string
  description: string
  prompt: string
  variables: string[]
}

export class AIService {
  // AI Model methods
  async getModelInfo(): Promise<ApiResponse<AIModelInfo>> {
    return apiClient.get<AIModelInfo>(API_ENDPOINTS.AI_MODEL.INFO)
  }

  async predict(data: PredictionRequest): Promise<ApiResponse<PredictionResponse>> {
    return apiClient.post<PredictionResponse>(API_ENDPOINTS.AI_MODEL.PREDICT, data)
  }

  async getModelMetrics(): Promise<ApiResponse<ModelMetrics>> {
    return apiClient.get<ModelMetrics>(API_ENDPOINTS.AI_MODEL.METRICS)
  }

  async retrainModel(config?: {
    epochs?: number
    batchSize?: number
    learningRate?: number
  }): Promise<ApiResponse<{ jobId: string }>> {
    return apiClient.post<{ jobId: string }>(API_ENDPOINTS.AI_MODEL.RETRAIN, config)
  }

  async updateModel(file: File): Promise<ApiResponse<AIModelInfo>> {
    return apiClient.uploadFile<AIModelInfo>(API_ENDPOINTS.AI_MODEL.UPDATE, file)
  }

  // Gemini API methods
  async generateWithGemini(data: GeminiGenerateRequest): Promise<ApiResponse<GeminiGenerateResponse>> {
    return apiClient.post<GeminiGenerateResponse>(API_ENDPOINTS.GEMINI.GENERATE, data)
  }

  async getGeminiTemplates(): Promise<ApiResponse<GeminiTemplate[]>> {
    return apiClient.get<GeminiTemplate[]>(API_ENDPOINTS.GEMINI.TEMPLATES)
  }

  async getGeminiHistory(limit = 50): Promise<
    ApiResponse<
      Array<{
        id: string
        prompt: string
        response: string
        timestamp: string
        usage: GeminiGenerateResponse["usage"]
      }>
    >
  > {
    return apiClient.get(API_ENDPOINTS.GEMINI.HISTORY, { limit })
  }

  async createGeminiTemplate(template: Omit<GeminiTemplate, "id">): Promise<ApiResponse<GeminiTemplate>> {
    return apiClient.post<GeminiTemplate>(API_ENDPOINTS.GEMINI.TEMPLATES, template)
  }

  async updateGeminiTemplate(id: string, template: Partial<GeminiTemplate>): Promise<ApiResponse<GeminiTemplate>> {
    return apiClient.put<GeminiTemplate>(`${API_ENDPOINTS.GEMINI.TEMPLATES}/${id}`, template)
  }

  async deleteGeminiTemplate(id: string): Promise<ApiResponse> {
    return apiClient.delete(`${API_ENDPOINTS.GEMINI.TEMPLATES}/${id}`)
  }
}

export const aiService = new AIService()
