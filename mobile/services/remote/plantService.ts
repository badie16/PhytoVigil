import { config } from "@/lib/config/env";
import type { BackendPlant, BackendPlantScan, Plant, PlantScan } from "@/types/index";
import { storageService } from "../local/storage";

class PlantService {
    async getUserPlants(skip = 0, limit = 100): Promise<Plant[]> {
        const token = await storageService.getSecureItem(config.TOKEN_KEY);
        if (!token) {
            throw new Error("Token manquant ou utilisateur non authentifié");
        }
        const response = await fetch(`${config.API_URL}/api/plants?skip=${skip}&limit=${limit}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la récupération des plantes : ${response.status} - ${errorText}`);
        }

        const data: BackendPlant[] = await response.json();
        console.log(data)
        return Promise.all(data.map(this.transformBackendPlantToPlant.bind(this)));
    }
    async getPlantById(id: number): Promise<Plant> {
        const token = await storageService.getSecureItem(config.TOKEN_KEY);

        if (!token) {
            throw new Error("Token manquant ou utilisateur non authentifié");
        }

        const response = await fetch(`${config.API_URL}/api/plants/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });


        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la récupération de la plante : ${response.status} - ${errorText}`);
        }

        const data: BackendPlant = await response.json();
        return this.transformBackendPlantToPlant(data);
    }
    async getScansByPlantId(plantId: number): Promise<PlantScan[]> {
        const token = await storageService.getSecureItem(config.TOKEN_KEY);
        if (!token) {
            throw new Error("Token manquant ou utilisateur non authentifié");
        }
        const response = await fetch(`${config.API_URL}/api/scans/plants/${plantId}/scans`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la récupération des scans : ${response.status} - ${errorText}`);
        }
        // const plant = await this.getPlantById(plantId);
        const data: BackendPlantScan[] = await response.json();
        return Promise.all(data.map(scan => this.transformBackendScanToPlantScan(scan, '')));
    }

    async getScanById(scanId: number): Promise<PlantScan> {
        const token = await storageService.getSecureItem(config.TOKEN_KEY);
        if (!token) {
            throw new Error("Token manquant ou utilisateur non authentifié");
        }
        const response = await fetch(`${config.API_URL}/api/scans/${scanId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la récupération des scans : ${response.status} - ${errorText}`);
        }
        const data: BackendPlantScan = await response.json();
        return this.transformBackendScanToPlantScan(data);
    }
    // Transformer les données backend en format frontend pour Plant
    private async transformBackendPlantToPlant(backendPlant: BackendPlant): Promise<Plant> {
        let lastScanned: string | undefined = undefined;
        try {
            const scans = await this.getScansByPlantId(backendPlant.id);
            if (scans && scans.length > 0) {
                // On prend la date la plus récente
                lastScanned = scans
                    .map(scan => scan.createdAt)
                    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
            }
        } catch (e) {
            // En cas d'erreur, on laisse lastScanned à undefined
        }
        return {
            id: backendPlant.id,
            name: backendPlant.name,
            type: backendPlant.type,
            variety: backendPlant.variety,
            plantedDate: backendPlant.planted_date,
            location: backendPlant.location ? {
                latitude: 0, // Vous devrez parser la location si elle contient lat/lng
                longitude: 0,
                address: backendPlant.location
            } : undefined,
            image_url: backendPlant.image_url,
            health: await this.determineHealthFromScans(backendPlant.id),
            lastScanned: lastScanned,
            notes: backendPlant.notes,
            createdAt: backendPlant.created_at,
            updatedAt: backendPlant.updated_at
        };
    }
    // Transformer les données backend en format frontend pour PlantScan
    private transformBackendScanToPlantScan(backendScan: BackendPlantScan, plantName?: string): PlantScan {
        const confidence = parseFloat(backendScan.confidence_score) || 0;
        const hasDisease = Object.keys(backendScan.detected_diseases).length > 0;

        return {
            id: backendScan.id,
            plant_id: backendScan.plant_id,
            diseaseName: hasDisease ? backendScan.detected_diseases[0].class_name : 'Healthy',
            confidence: Number((confidence * 100).toFixed(2)),
            treatment: backendScan.recommendations,
            imageUri: backendScan.image_url,
            location: backendScan.location_lat && backendScan.location_lng ? {
                latitude: parseFloat(backendScan.location_lat),
                longitude: parseFloat(backendScan.location_lng)
            } : undefined,
            createdAt: backendScan.scan_date,
            updatedAt: backendScan.scan_date,
            status: backendScan.result_type,
            notes: undefined
        };
    }

    // Déterminer la santé globale d'une plante (vous devrez implémenter cette logique)
    private async determineHealthFromScans(plantId: number): Promise<"healthy" | "warning" | "danger"> {
        const scans = await this.getScansByPlantId(plantId);
        if (!scans.length) {
            return "warning"; // Pas de scan : alerte légère
        }
        console.log("scanc", scans)
        let diseasedCount = 0;
        let unknownCount = 0;

        for (const scan of scans) {
            if (scan.status === "diseased") {
                diseasedCount++;
            } else if (scan.status === "unknown") {
                unknownCount++;
            }
        }

        if (diseasedCount > 0) {
            return "danger";
        }
        if (unknownCount > 0) {
            return "warning";
        }
        return "healthy";
    }
}
export default new PlantService()
