import { apiClient, type ApiResponse } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

export interface MobileConfig {
  app_name: string
  version: string
  min_confidence_threshold: number
  max_scan_per_day: number
  enable_notifications: boolean
  enable_location: boolean
  enable_offline_mode: boolean
  default_language: string
  theme: "auto" | "light" | "dark"
  api_endpoints: Record<string, string>
  feature_flags: Record<string, boolean>
}

export interface PushNotification {
  id: number
  title: string
  message: string
  type: "info" | "reminder" | "update" | "alert"
  enabled: boolean
  schedule: "daily" | "weekly" | "monthly" | "on_demand"
  target_audience: "all" | "free" | "premium" | "new"
  created_at: string
}

export interface DynamicContent {
  id: number
  type: "tip" | "alert" | "news" | "promo"
  title: string
  content: string
  priority: 1 | 2 | 3
  enabled: boolean
  target_audience: "all" | "free" | "premium" | "new"
  start_date?: string
  end_date?: string
  created_at: string
}

export interface CreateNotificationData {
  title: string
  message: string
  type: "info" | "reminder" | "update" | "alert"
  schedule: "daily" | "weekly" | "monthly" | "on_demand"
  target_audience?: "all" | "free" | "premium" | "new"
}

export interface CreateContentData {
  type: "tip" | "alert" | "news" | "promo"
  title: string
  content: string
  priority: 1 | 2 | 3
  target_audience: "all" | "free" | "premium" | "new"
  start_date?: string
  end_date?: string
}

export interface DeploymentInfo {
  version: string
  status: "pending" | "deploying" | "deployed" | "failed"
  environment: "development" | "staging" | "production"
  deployed_at?: string
  rollback_available: boolean
}

export class MobileConfigService {
  async getConfig(): Promise<ApiResponse<MobileConfig>> {
    return apiClient.get<MobileConfig>(API_ENDPOINTS.MOBILE_CONFIG.GET)
  }

  async updateConfig(config: Partial<MobileConfig>): Promise<ApiResponse<MobileConfig>> {
    return apiClient.put<MobileConfig>(API_ENDPOINTS.MOBILE_CONFIG.UPDATE, config)
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<PushNotification[]>> {
    return apiClient.get<PushNotification[]>(API_ENDPOINTS.MOBILE_CONFIG.NOTIFICATIONS)
  }

  async createNotification(data: CreateNotificationData): Promise<ApiResponse<PushNotification>> {
    return apiClient.post<PushNotification>(API_ENDPOINTS.MOBILE_CONFIG.NOTIFICATIONS, data)
  }

  async updateNotification(id: number, data: Partial<PushNotification>): Promise<ApiResponse<PushNotification>> {
    return apiClient.put<PushNotification>(`${API_ENDPOINTS.MOBILE_CONFIG.NOTIFICATIONS}/${id}`, data)
  }

  async deleteNotification(id: number): Promise<ApiResponse> {
    return apiClient.delete(`${API_ENDPOINTS.MOBILE_CONFIG.NOTIFICATIONS}/${id}`)
  }

  async sendTestNotification(id: number): Promise<ApiResponse> {
    return apiClient.post(`${API_ENDPOINTS.MOBILE_CONFIG.NOTIFICATIONS}/${id}/test`)
  }

  // Dynamic Content
  async getContent(): Promise<ApiResponse<DynamicContent[]>> {
    return apiClient.get<DynamicContent[]>(API_ENDPOINTS.MOBILE_CONFIG.CONTENT)
  }

  async createContent(data: CreateContentData): Promise<ApiResponse<DynamicContent>> {
    return apiClient.post<DynamicContent>(API_ENDPOINTS.MOBILE_CONFIG.CONTENT, data)
  }

  async updateContent(id: number, data: Partial<DynamicContent>): Promise<ApiResponse<DynamicContent>> {
    return apiClient.put<DynamicContent>(`${API_ENDPOINTS.MOBILE_CONFIG.CONTENT}/${id}`, data)
  }

  async deleteContent(id: number): Promise<ApiResponse> {
    return apiClient.delete(`${API_ENDPOINTS.MOBILE_CONFIG.CONTENT}/${id}`)
  }

  // Deployment
  async deploy(environment: "staging" | "production"): Promise<ApiResponse<DeploymentInfo>> {
    return apiClient.post<DeploymentInfo>(API_ENDPOINTS.MOBILE_CONFIG.DEPLOY, { environment })
  }

  async getDeploymentStatus(): Promise<ApiResponse<DeploymentInfo[]>> {
    return apiClient.get<DeploymentInfo[]>(`${API_ENDPOINTS.MOBILE_CONFIG.DEPLOY}/status`)
  }

  async rollback(version: string): Promise<ApiResponse<DeploymentInfo>> {
    return apiClient.post<DeploymentInfo>(`${API_ENDPOINTS.MOBILE_CONFIG.DEPLOY}/rollback`, { version })
  }
}

export const mobileConfigService = new MobileConfigService()
