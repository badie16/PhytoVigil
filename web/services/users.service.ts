import { apiClient, type ApiResponse } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  created_at: string
  last_login?: string
  phone?: string
  location?: string
  scan_count?: number
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: string
  phone?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: string
  status?: string
  phone?: string
}

export interface UsersListParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  premiumUsers: number
  newUsersThisMonth: number
  userGrowth: Array<{
    month: string
    users: number
  }>
}

export class UsersService {
  async getUsers(params: UsersListParams = {}): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST, params)
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.USERS.GET(id))
  }

  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    return apiClient.post<User>(API_ENDPOINTS.USERS.CREATE, data)
  }

  async updateUser(id: number, data: UpdateUserData): Promise<ApiResponse<User>> {
    return apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data)
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    return apiClient.delete(API_ENDPOINTS.USERS.DELETE(id))
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return apiClient.get<UserStats>(API_ENDPOINTS.USERS.STATS)
  }

  async exportUsers(params: UsersListParams = {}): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>(API_ENDPOINTS.USERS.EXPORT, params)
  }

  async bulkUpdateUsers(userIds: number[], data: UpdateUserData): Promise<ApiResponse> {
    return apiClient.post("/users/bulk-update", { userIds, data })
  }

  async bulkDeleteUsers(userIds: number[]): Promise<ApiResponse> {
    return apiClient.post("/users/bulk-delete", { userIds })
  }
}

export const usersService = new UsersService()
