import { config } from "../config/env"

import { storageService } from "@/services/local/storage"
export class Security {
    static async isAuthenticated(): Promise<boolean> {
        const token = await storageService.getSecureItem(config.TOKEN_KEY)
        return !!token
    }

    static async getToken(): Promise<string | null> {
        return await storageService.getSecureItem(config.TOKEN_KEY)
    }

    static async clearToken(): Promise<void> {
        await storageService.removeSecureItem(config.TOKEN_KEY)
    }
    static async getAuthHeaders() {
        const token = await this.getToken()
        return {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }
    }
}

