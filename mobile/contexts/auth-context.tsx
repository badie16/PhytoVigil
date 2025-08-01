"use client"

import { useOffline } from "@/hooks/useOffline"
import { offlineAuthService } from "@/services/local/authService.offline"
import { authService } from "@/services/remote/auth"
import type { AuthState, LoginCredentials, RegisterCredentials, User } from "@/types/auth"
import type React from "react"
import { createContext, useContext, useEffect, useReducer } from "react"

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>
    register: (credentials: RegisterCredentials) => Promise<void>
    logout: () => Promise<void>
    clearError: () => void
    // loginOffline: (credentials: LoginCredentials) => Promise<void>
    // registerOffline: (credentials: RegisterCredentials) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_USER"; payload: User | null }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "CLEAR_ERROR" }
    | { type: "LOGOUT" }

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, isLoading: action.payload }
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                isLoading: false,
                error: null,
            }
        case "SET_ERROR":
            return { ...state, error: action.payload, isLoading: false }
        case "CLEAR_ERROR":
            return { ...state, error: null }
        case "LOGOUT":
            return { ...initialState, isLoading: false }
        default:
            return state
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState)
    const { isOffline } = useOffline()

    useEffect(() => {
        checkAuthStatus()
    }, [isOffline])

    const checkAuthStatus = async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })

            let user: User | null = null

            if (isOffline) {
                // Check offline authentication
                user = await offlineAuthService.getCurrentOfflineUser()
                if (!user) {
                    // Create demo user for offline testing
                    console.log('dddddddddddddddddddddddddddddddddddddd  no user hhhhhhhhhh')
                    // await offlineAuthService.createDemoUser()
                }
            } else {
                
                // Check online authentication first
                user = await authService.getCurrentUser()

                // If no online user, check offline user
                if (!user) {
                    user = await offlineAuthService.getCurrentOfflineUser()
                }
            }

            dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
            console.error("Auth check failed:", error)
            dispatch({ type: "SET_ERROR", payload: "Failed to check authentication status" })
        }
    }

    const login = async (credentials: LoginCredentials) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })
            dispatch({ type: "CLEAR_ERROR" })

            let user: User | null = null

            if (isOffline) {
                // Try offline login
                user = await offlineAuthService.loginOffline(credentials)
                if (!user) {
                    throw new Error("Invalid credentials or user not found offline")
                }
            } else {
                // Try online login first
                try {
                    user = await authService.login(credentials)
                } catch (onlineError) {
                    // If online login fails, try offline
                    console.log("Online login failed, trying offline...")
                    user = await offlineAuthService.loginOffline(credentials)
                    if (!user) {
                        throw onlineError
                    }
                }
            }

            dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Login failed" })
            throw error
        }
    }

    const loginOffline = async (credentials: LoginCredentials) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })
            dispatch({ type: "CLEAR_ERROR" })

            const user = await offlineAuthService.loginOffline(credentials)
            if (!user) {
                throw new Error("Invalid credentials")
            }

            dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Offline login failed" })
            throw error
        }
    }

    const register = async (credentials: RegisterCredentials) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })
            dispatch({ type: "CLEAR_ERROR" })

            let user: User

            if (isOffline) {
                // Register offline
                // user = await offlineAuthService.registerOffline(credentials)
            } else {
                // Try online registration first
                try {
                    user = await authService.register(credentials)
                    dispatch({ type: "SET_USER", payload: user })
                } catch (onlineError) {
                    // If online registration fails, register offline
                    console.log("Online registration failed, registering offline...")
                    // user = await offlineAuthService.registerOffline(credentials)
                }
                
            }
            
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Registration failed" })
            throw error
        }
    }

    // const registerOffline = async (credentials: RegisterCredentials) => {
    //     try {
    //         dispatch({ type: "SET_LOADING", payload: true })
    //         dispatch({ type: "CLEAR_ERROR" })

    //         const user = await offlineAuthService.registerOffline(credentials)
    //         dispatch({ type: "SET_USER", payload: user })
    //     } catch (error) {
    //         dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Offline registration failed" })
    //         throw error
    //     }
    // }

    const logout = async () => {
        try {
            if (state.user?.isOfflineUser) {
                await offlineAuthService.logoutOffline()
            } else {
                await authService.logout()
                // Also logout offline user if exists
                await offlineAuthService.logoutOffline()
            }
            dispatch({ type: "LOGOUT" })
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Logout failed" })
            throw error
        }
    }

    const clearError = () => {
        dispatch({ type: "CLEAR_ERROR" })
    }

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        // loginOffline,
        // registerOffline,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
