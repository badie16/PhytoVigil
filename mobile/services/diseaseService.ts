import type { Disease } from "@/types/index" 
import { config } from "@/lib/config/env"

class DiseaseService {
    async getAllDisease(skip=0,limit=100): Promise<Disease[]>{
        const res = await fetch(`${config.API_URL}/api/diseases/?skip=${skip}&limit=${limit}`)
        if (!res.ok) {
            throw new Error("Erreur lors de la récupération des maladies")
        }
        return res.json()
    }
}
export default new DiseaseService()
