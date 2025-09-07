import { apiClient, type ApiResponse } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

export interface DashboardStats {
  totalScans: number
  totalUsers: number
  totalDiseases: number
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
  monthlyGrowth: Array<{
    month: string
    users: number
    scans: number
  }>
  recentActivity: Array<{
    id: string
    title: string
    description: string
    time: string
    type: "scan" | "user" | "disease" | "system"
  }>
}

export interface ChartData {
  scansOverTime: Array<{
    date: string
    scans: number
    accuracy: number
  }>
  userGrowth: Array<{
    date: string
    users: number
    activeUsers: number
  }>
  diseaseDetections: Array<{
    disease: string
    count: number
    accuracy: number
  }>
  systemMetrics: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    activeConnections: number
  }
}

export class DashboardService {
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS)
  }

  async getChartData(timeRange: "7d" | "30d" | "90d" | "1y" = "30d"): Promise<ApiResponse<ChartData>> {
    return apiClient.get<ChartData>(API_ENDPOINTS.DASHBOARD.CHARTS, { timeRange })
  }

  async getRecentActivity(limit = 10): Promise<ApiResponse<DashboardStats["recentActivity"]>> {
    return apiClient.get<DashboardStats["recentActivity"]>(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITY, { limit })
  }

  async getSystemHealth(): Promise<
    ApiResponse<{
      status: "healthy" | "warning" | "critical"
      services: Array<{
        name: string
        status: "up" | "down" | "degraded"
        responseTime: number
        lastCheck: string
      }>
      alerts: Array<{
        id: string
        level: "info" | "warning" | "error"
        message: string
        timestamp: string
      }>
    }>
  > {
    return apiClient.get("/dashboard/system-health")
  }
}

export const dashboardService = new DashboardService()
