import AsyncStorage from "@react-native-async-storage/async-storage"
import type { AppSettings } from "@/types"

class StorageService {
  private readonly SETTINGS_KEY = "app_settings"
  private readonly USER_PREFERENCES_KEY = "user_preferences"

  // Settings
  async getSettings(): Promise<AppSettings> {
    try {
      const settings = await AsyncStorage.getItem(this.SETTINGS_KEY)
      if (settings) {
        return JSON.parse(settings)
      }

      // Default settings
      const defaultSettings: AppSettings = {
        notifications: true,
        locationServices: true,
        autoSave: true,
        imageQuality: "medium",
        language: "en",
        theme: "auto",
      }

      await this.saveSettings(defaultSettings)
      return defaultSettings
    } catch (error) {
      console.error("Error getting settings:", error)
      throw error
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Error saving settings:", error)
      throw error
    }
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings()
      const newSettings = { ...currentSettings, ...updates }
      await this.saveSettings(newSettings)
    } catch (error) {
      console.error("Error updating settings:", error)
      throw error
    }
  }

  // User Preferences
  async getUserPreferences(): Promise<Record<string, any>> {
    try {
      const preferences = await AsyncStorage.getItem(this.USER_PREFERENCES_KEY)
      return preferences ? JSON.parse(preferences) : {}
    } catch (error) {
      console.error("Error getting user preferences:", error)
      return {}
    }
  }

  async saveUserPreference(key: string, value: any): Promise<void> {
    try {
      const preferences = await this.getUserPreferences()
      preferences[key] = value
      await AsyncStorage.setItem(this.USER_PREFERENCES_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.error("Error saving user preference:", error)
      throw error
    }
  }

  // Cache Management
  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const cacheKeys = keys.filter((key) => key.startsWith("cache_"))
      await AsyncStorage.multiRemove(cacheKeys)
    } catch (error) {
      console.error("Error clearing cache:", error)
      throw error
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const cacheKeys = keys.filter((key) => key.startsWith("cache_"))
      let totalSize = 0

      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key)
        if (value) {
          totalSize += new Blob([value]).size
        }
      }

      return totalSize
    } catch (error) {
      console.error("Error calculating cache size:", error)
      return 0
    }
  }

  // Export/Import Data
  async exportData(): Promise<string> {
    try {
      const allKeys = await AsyncStorage.getAllKeys()
      const allData: Record<string, string | null> = {}

      for (const key of allKeys) {
        allData[key] = await AsyncStorage.getItem(key)
      }

      return JSON.stringify(allData, null, 2)
    } catch (error) {
      console.error("Error exporting data:", error)
      throw error
    }
  }

  async importData(data: string): Promise<void> {
    try {
      const parsedData = JSON.parse(data)
      const pairs: [string, string][] = []

      for (const [key, value] of Object.entries(parsedData)) {
        if (value !== null) {
          pairs.push([key, value as string])
        }
      }

      await AsyncStorage.multiSet(pairs)
    } catch (error) {
      console.error("Error importing data:", error)
      throw error
    }
  }
}

export const storageService = new StorageService()
