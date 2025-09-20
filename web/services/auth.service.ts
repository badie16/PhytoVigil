import { apiClient, type ApiResponse } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

export interface LoginCredentials {
  username: string
  password: string
}
export interface RegisterData {
  name: string
  email: string
  password: string
  role?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  last_login?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}


export class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.postForm<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      { username: credentials.username, password: credentials.password }
    )
    console.log(response)
    if (response.success && response.data) {
      // Stocker le token
      localStorage.setItem("auth_token", response.data.access_token)
      localStorage.setItem("token_type", response.data.token_type)
    }
    return response
  }
  async logout(): Promise<ApiResponse> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      // Continuer même si l'API échoue
      console.warn("Logout API failed:", error)
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem("auth_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")
    }
    return { success: true }
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data)
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    })

    if (response.success && response.data) {
      localStorage.setItem("auth_token", response.data.access_token)
      // localStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME)

    const user = response.data as User

    if (!user) {
      throw new Error("Impossible de récupérer l'utilisateur")
    }
    if (user.role !== "admin") {
      throw new Error("Utilisateur non autorisé")
    } else {
      localStorage.setItem("user", JSON.stringify(user))
    }
    return response
  }


  async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password })
  }

  getCurrentUserFromStorage(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("auth_token")
    }
    return false
  }
}

export const authService = new AuthService()
