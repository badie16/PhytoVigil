import { API_CONFIG } from "./api-config"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

class ApiClient {
  private baseURL: string
  private timeout: number
  private retryAttempts: number
  private retryDelay: number

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS
    this.retryDelay = API_CONFIG.RETRY_DELAY
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}, attempt = 1): Promise<ApiResponse<T>> {
    const token = this.getAuthToken()
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        // Si token expiré, rediriger vers login
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token")
            window.location.href = "/admin/login"
          }
        }

        throw {
          message: errorData.message || `HTTP ${response.status}`,
          status: response.status,
          code: errorData.code,
          details: errorData.details,
        } as ApiError
      }

      const data = await response.json()
      return data
    } catch (error) {
      // Retry logic pour les erreurs réseau
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        await this.delay(this.retryDelay * attempt)
        return this.makeRequest<T>(endpoint, options, attempt + 1)
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw {
          message: "Request timeout",
          status: 408,
        } as ApiError
      }

      throw error
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry pour les erreurs réseau, pas pour les erreurs 4xx
    return !error.status || error.status >= 500
  }

  // Méthodes HTTP de base
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint
    return this.makeRequest<T>(url, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" })
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const token = this.getAuthToken()

    return this.makeRequest<T>(endpoint, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
  }
}

export const apiClient = new ApiClient()
