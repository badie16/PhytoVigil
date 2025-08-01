import { config } from "@/lib/config/env";
import type { DiseaseStats, PlantStats, ScanStats } from "@/types";
import { Security } from "@/lib/guards/security";
class StatsService {
    // Récupérer les statistiques globales de scan
    async getGlobalScanStats(): Promise<ScanStats> {
        const headers = await Security.getAuthHeaders();
        const response = await fetch(`${config.API_URL}/api/stats/scans`, {
            method: "GET",
            headers,
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des statistiques de scan");
        }
        return await response.json();
    }

    // Récupérer les statistiques de scan pour une plante spécifique
    async getPlantScanStats(plantId: number): Promise<PlantStats> {
        const headers = await Security.getAuthHeaders();
        const response = await fetch(`${config.API_URL}/api/stats/plants/${plantId}`, {
            method: "GET",
            headers,
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des statistiques de la plante");
        }
        return await response.json();
    }

    // Récupérer les statistiques de scan par maladie
    async getDiseaseStats(): Promise<DiseaseStats[]> {
        const headers = await Security.getAuthHeaders();
        const response = await fetch(`${config.API_URL}/api/stats/diseases`, {
            method: "GET",
            headers,
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des statistiques de maladies");
        }
        return await response.json();
    }
}

export default new StatsService();
