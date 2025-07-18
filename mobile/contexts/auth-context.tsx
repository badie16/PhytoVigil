import { authService } from "@/services/remote/auth"
import type { AuthState, LoginCredentials, RegisterCredentials, User } from "@/types/auth"
import type React from "react"
import { createContext, useContext, useEffect, useReducer } from "react"

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>
    register: (credentials: RegisterCredentials) => Promise<void>
    logout: () => Promise<void>
    clearError: () => void
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

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })
            const user = await authService.getCurrentUser()
            dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Failed to check authentication status" })
        }
    }

    const login = async (credentials: LoginCredentials) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })
            dispatch({ type: "CLEAR_ERROR" })
            const user = await authService.login(credentials)
            dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Login failed" })
            throw error
        }
    }

    const register = async (credentials: RegisterCredentials) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })
            dispatch({ type: "CLEAR_ERROR" })
            const user = await authService.register(credentials)
            dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Registration failed" })
            throw error
        }
    }

    const logout = async () => {
        try {
            await authService.logout()
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
