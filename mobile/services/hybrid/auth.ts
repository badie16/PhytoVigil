// services/hybrid/authHybridService.ts
import { storageService } from "@/services/local/storage"
import type { User } from "@/types/auth"
import { authService } from "@/services/remote/auth"

class AuthHybridService {
    private USER_KEY = "current_user"

    /**
     * Récupération hybride de l'utilisateur :
     * - Si online (via paramètre) → remote + sauvegarde local
     * - Si offline → local
     */
    async getCurrentUser(isOnline: boolean): Promise<User | null> {
        if (isOnline) {
            try {
                const user = await authService.getCurrentUser()
                if (user) {
                    await storageService.setSecureItem(this.USER_KEY, JSON.stringify(user))
                }
                return user
            } catch (err) {
                console.error("Erreur remote getCurrentUser:", err)
                return this.getLocalUser()
            }
        }

        // Mode offline
        return this.getLocalUser()
    }

    private async getLocalUser(): Promise<User | null> {
        const userStr = await storageService.getSecureItem(this.USER_KEY)
        if (!userStr) return null
        try {
            return JSON.parse(userStr) as User
        } catch {
            return null
        }
    }
}

export const authHybridService = new AuthHybridService()
