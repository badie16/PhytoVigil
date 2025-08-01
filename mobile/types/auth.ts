export interface User {
  id: number
  name: string
  email: string
  role: string
  token: string
  createdAt: string
  isOfflineUser?: boolean
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

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface OfflineUser {
  id: number
  name: string
  email: string
  password: string
  role: string
  createdAt: string
}
