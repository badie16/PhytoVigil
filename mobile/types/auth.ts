export interface User {
  id: number
  email: string
  name: string
  role: string
  createdAt: string
}
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}
export interface TokenResponse {
  access_token: string
  token_type: string
}