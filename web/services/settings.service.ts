import { apiClient, type ApiResponse } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

export interface SystemSettings {
  site_name: string
  site_url: string
  admin_email: string
  support_email: string
  maintenance_mode: boolean
  registration_enabled: boolean
  email_verification: boolean
  max_file_size: number
  session_timeout: number
  backup_frequency: "hourly" | "daily" | "weekly" | "monthly"
  log_level: "debug" | "info" | "warning" | "error"
  smtp_settings: {
    host: string
    port: number
    username: string
    password: string
    secure: boolean
  }
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: "Super Admin" | "Admin" | "Modérateur"
  status: "Actif" | "Inactif"
  last_login?: string
  created_at: string
}

export interface CreateAdminData {
  name: string
  email: string
  password: string
  role: "Super Admin" | "Admin" | "Modérateur"
}

export interface UpdateAdminData {
  name?: string
  email?: string
  role?: "Super Admin" | "Admin" | "Modérateur"
  status?: "Actif" | "Inactif"
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface BackupInfo {
  id: string
  filename: string
  size: number
  created_at: string
  type: "manual" | "automatic"
  status: "completed" | "failed" | "in_progress"
}

export interface SystemInfo {
  version: string
  database: {
    type: string
    version: string
    size: string
  }
  server: {
    platform: string
    nodeVersion: string
    uptime: string
  }
  performance: {
    cpuUsage: number
    memoryUsage: {
      used: string
      total: string
      percentage: number
    }
    diskUsage: {
      used: string
      total: string
      percentage: number
    }
    activeConnections: number
  }
}

export class SettingsService {
  // System Settings
  async getSettings(): Promise<ApiResponse<SystemSettings>> {
    return apiClient.get<SystemSettings>(API_ENDPOINTS.SETTINGS.GET)
  }

  async updateSettings(settings: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> {
    return apiClient.put<SystemSettings>(API_ENDPOINTS.SETTINGS.UPDATE, settings)
  }

  async getSystemInfo(): Promise<ApiResponse<SystemInfo>> {
    return apiClient.get<SystemInfo>(API_ENDPOINTS.SETTINGS.SYSTEM_INFO)
  }

  // Admin Users
  async getAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
    return apiClient.get<AdminUser[]>("/settings/admins")
  }

  async createAdminUser(data: CreateAdminData): Promise<ApiResponse<AdminUser>> {
    return apiClient.post<AdminUser>("/settings/admins", data)
  }

  async updateAdminUser(id: number, data: UpdateAdminData): Promise<ApiResponse<AdminUser>> {
    return apiClient.put<AdminUser>(`/settings/admins/${id}`, data)
  }

  async deleteAdminUser(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/settings/admins/${id}`)
  }

  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return apiClient.post("/settings/change-password", data)
  }

  // Backup & Export
  async createBackup(): Promise<ApiResponse<BackupInfo>> {
    return apiClient.post<BackupInfo>(API_ENDPOINTS.SETTINGS.BACKUP)
  }

  async getBackups(): Promise<ApiResponse<BackupInfo[]>> {
    return apiClient.get<BackupInfo[]>(`${API_ENDPOINTS.SETTINGS.BACKUP}/list`)
  }

  async downloadBackup(backupId: string): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>(`${API_ENDPOINTS.SETTINGS.BACKUP}/${backupId}/download`)
  }

  async deleteBackup(backupId: string): Promise<ApiResponse> {
    return apiClient.delete(`${API_ENDPOINTS.SETTINGS.BACKUP}/${backupId}`)
  }

  async exportData(type: "users" | "scans" | "diseases" | "all"): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>(API_ENDPOINTS.SETTINGS.EXPORT, { type })
  }

  // System Operations
  async restartSystem(): Promise<ApiResponse> {
    return apiClient.post("/settings/restart")
  }

  async clearCache(): Promise<ApiResponse> {
    return apiClient.post("/settings/clear-cache")
  }

  async testEmailSettings(email: string): Promise<ApiResponse> {
    return apiClient.post("/settings/test-email", { email })
  }

  async getLogs(
    level?: string,
    limit = 100,
  ): Promise<
    ApiResponse<
      Array<{
        timestamp: string
        level: string
        message: string
        meta?: any
      }>
    >
  > {
    return apiClient.get("/settings/logs", { level, limit })
  }
}

export const settingsService = new SettingsService()
