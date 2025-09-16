"use client"

import type { ApiError } from "@/lib/api-client"
import { authService, type User } from "@/services/auth.service"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getCurrentUserFromStorage()
          if (storedUser) {
            setUser(storedUser)
            // Vérifier si le token est toujours valide
            try {
              const response = await authService.getCurrentUser()
              if (response.success && response.data) {
                setUser(response.data)
              }
            } catch (error) {
              // Token invalide, déconnecter
              await logout()
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authService.login({ username: email, password })
      if (response.success && response.data) {
        const responseuser = await authService.getCurrentUser()
        if (responseuser.success && responseuser.data && responseuser.data.role == "admin") {
          setUser(responseuser.data)
          return { success: true }
        }

      }
      return { success: false, error: response.error || "Erreur de connexion" }
    } catch (error) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || "Erreur de connexion",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken()
      if (response.success && response.data) {
        // setUser(response.data.user)
      }
    } catch (error) {
      console.error("Token refresh error:", error)
      await logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
