import { storageService } from "./storage"
import type { User, LoginCredentials, RegisterCredentials } from "@/types/auth"

class OfflineAuthService {
  private readonly USER_KEY = "offline_user"
  private readonly USERS_KEY = "offline_users"
  private readonly CURRENT_USER_KEY = "current_offline_user"

  // Offline login - check against locally stored users
  async loginOffline(credentials: LoginCredentials): Promise<User | null> {
    try {
      const users = await this.getStoredUsers()
      const user = users.find(
        (u: any) => u.email === credentials.email && u.password === credentials.password, // In real app, this would be hashed
      )

      if (user) {
        // Set as current user
        await storageService.setSecureItem(this.CURRENT_USER_KEY, JSON.stringify(user))
        return user
      }

      return null
    } catch (error) {
      console.error("Offline login failed:", error)
      return null
    }
  }

  // Register user offline
  // async registerOffline(credentials: RegisterCredentials): Promise<User> {
  //   try {
  //     const users = await this.getStoredUsers()

  //     // Check if user already exists
  //     const existingUser = users.find((u) => u.email === credentials.email)
  //     if (existingUser) {
  //       throw new Error("User already exists")
  //     }

  //     // Create new user
  //     const newUser: User = {
  //       id: Date.now().toString(),
  //       email: credentials.email,
  //       name: credentials.name,
  //       password: credentials.password, // In real app, this would be hashed
  //       createdAt: new Date().toISOString(),
  //       isOfflineUser: true,
  //     }

  //     // Add to users list
  //     users.push(newUser)
  //     await storageService.setSecureItem(this.USERS_KEY, JSON.stringify(users))

  //     // Set as current user
  //     await storageService.setSecureItem(this.CURRENT_USER_KEY, JSON.stringify(newUser))

  //     return newUser
  //   } catch (error) {
  //     console.error("Offline registration failed:", error)
  //     throw error
  //   }
  // }

  // Get current offline user
  async getCurrentOfflineUser(): Promise<User | null> {
    try {
      const userData = await storageService.getSecureItem(this.CURRENT_USER_KEY)
      if (userData) {
        return JSON.parse(userData)
      }
      return null
    } catch (error) {
      console.error("Failed to get current offline user:", error)
      return null
    }
  }

  // Logout offline user
  async logoutOffline(): Promise<void> {
    try {
      await storageService.removeSecureItem(this.CURRENT_USER_KEY)
    } catch (error) {
      console.error("Offline logout failed:", error)
      throw error
    }
  }

  // Check if user is authenticated offline
  async isAuthenticatedOffline(): Promise<boolean> {
    const user = await this.getCurrentOfflineUser()
    return !!user
  }

  // Get all stored users
  private async getStoredUsers(): Promise<User[]> {
    try {
      const usersData = await storageService.getSecureItem(this.USERS_KEY)
      if (usersData) {
        return JSON.parse(usersData)
      }
      return []
    } catch (error) {
      console.error("Failed to get stored users:", error)
      return []
    }
  }

  // Create demo user for offline testing
  // async createDemoUser(): Promise<User> {
  //   const demoUser: User = {
  //     id: "demo_user",
  //     email: "demo@phytovigil.com",
  //     name: "Demo User",
  //     password: "demo123",
  //     createdAt: new Date().toISOString(),
  //     isOfflineUser: true,
  //   }

  //   const users = await this.getStoredUsers()
  //   const existingDemo = users.find((u) => u.id === "demo_user")

  //   if (!existingDemo) {
  //     users.push(demoUser)
  //     await storageService.setSecureItem(this.USERS_KEY, JSON.stringify(users))
  //   }

  //   return demoUser
  // }
}

export const offlineAuthService = new OfflineAuthService()
