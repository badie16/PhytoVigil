import { config } from "@/lib/config/env";
import { storageService } from "../local/storage";

export interface ScanStats {
    total_scans: number;
    total_plantScaned: number;
    healthy_scans: number;
    diseased_scans: number;
    unknown_scans: number;
    most_common_disease?: string;
    last_scan_date?: string;
    [key: string]: any;
}

export interface PlantStats {
    plant_id: number;
    plant_name: string;
    total_scans: number;
    healthy_scans: number;
    diseased_scans: number;
    unknown_scans: number;
    last_scan_date?: string;
    [key: string]: any;
}
export interface DiseaseStats {
    disease_name: string;
    occurrence_count: number;
    percentage?: number;
}
class StatsService {
    private async getAuthHeaders() {
        const token = await storageService.getSecureItem(config.TOKEN_KEY)
        return {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }
    }

    // Récupérer les statistiques globales de scan
    async getGlobalScanStats(): Promise<ScanStats> {
        const headers = await this.getAuthHeaders();
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
        const headers = await this.getAuthHeaders();
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
        const headers = await this.getAuthHeaders();
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
