import type { LoginCredentials, RegisterCredentials, User } from "@/types/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"

const API_BASE_URL = "http://192.168.1.100:8000" // ⚠️ Remplace par l'IP locale de ton PC

class AuthService {
  private readonly TOKEN_KEY = "auth_token"
  private readonly USER_KEY = "user_data"

  async login(credentials: LoginCredentials): Promise<User> {
    const form = new URLSearchParams()
    form.append("username", credentials.email)
    form.append("password", credentials.password)

    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || "Login failed")

    await SecureStore.setItemAsync(this.TOKEN_KEY, data.access_token)

    const user = await this.getCurrentUser()
    if (user) {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user))
      return user
    } else {
      throw new Error("Failed to fetch user")
    }
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || "Registration failed")

    return data
  }

  async getCurrentUser(): Promise<User | null> {
    const token = await SecureStore.getItemAsync(this.TOKEN_KEY)
    if (!token) return null

    const res = await fetch(`${API_BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    if (!res.ok) return null

    return data
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(this.TOKEN_KEY)
    await AsyncStorage.removeItem(this.USER_KEY)
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync(this.TOKEN_KEY)
    return !!token
  }
}

export const authService = new AuthService()
