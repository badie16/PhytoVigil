import type { LoginCredentials, RegisterCredentials, User } from "@/types/auth"

import { config } from "@/lib/config/env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { storageService } from "./local/storage"
class AuthService {
  private readonly TOKEN_KEY = "auth_token"
  private readonly USER_KEY = "user_data"

  async login(credentials: LoginCredentials): Promise<User> {
    const form = new URLSearchParams()
    form.append("username", credentials.email)
    form.append("password", credentials.password)
    console.log(config.API_URL + "/api/auth/login")
    const res = await fetch(`${config.API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    })

    const data = await res.json()
    console.log("data:", data)
    if (!res.ok) throw new Error(data.detail || "Login failed")
    console.log("yes 1")
    await storageService.setSecureItem(this.TOKEN_KEY, data.access_token)
    console.log("yes 2")
    const user = await this.getCurrentUser()
    console.log(user)
    if (user) {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user))
      return user
    } else {
      throw new Error("Failed to fetch user")
    }
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    const res = await fetch(`${config.API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || "Registration failed")

    return data
  }

  async getCurrentUser(): Promise<User | null> {
    const token = await storageService.getSecureItem(this.TOKEN_KEY)
    if (!token) return null

    const res = await fetch(`${config.API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    if (!res.ok) return null

    return data
  }

  async logout(): Promise<void> {
    await storageService.removeSecureItem(this.TOKEN_KEY)
    await AsyncStorage.removeItem(this.USER_KEY)
  }

  async isAuthenticated(): Promise<boolean> {
    console.log("wdf")
    const token = await storageService.getSecureItem(this.TOKEN_KEY)
    return !!token
  }
}

export const authService = new AuthService()
