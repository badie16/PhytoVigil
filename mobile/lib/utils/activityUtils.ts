import type { Activity } from "@/services/remote/activityService"
export function getActivityIcon(type: Activity["type"]) {
    switch (type) {
        case "scan":
            return "camera"
        case "plant_added":
            return "plus-circle"
        case "treatment":
            return "shield"
        case "watering":
            return "droplets"
        case "fertilizing":
            return "leaf"
        case "note_added":
            return "edit-3"
        default:
            return "activity"
    }
}

export function getActivityColor(status?: Activity["status"]) {
    switch (status) {
        case "healthy":
            return "#00C896"
        case "diseased":
            return "#FF6B6B"
        case "warning":
            return "#FFB347"
        case "info":
        default:
            return "#4ECDC4"
    }
}

export function generateActivityFromScan(scan: any): Omit<Activity, "id" | "timestamp"> {
    const isHealthy = scan.status === "healthy"
    const diseaseName = scan.diseaseName || "Unknown issue"

    return {
        type: "scan",
        title: `${scan.plantName || "Plant"} - ${isHealthy ? "Healthy" : diseaseName}`,
        description: isHealthy ? "Scan completed successfully" : `${Math.round(scan.confidence)}% confidence`,
        plantId: scan.plant_id,
        plantName: scan.plantName,
        scanId: scan.id,
        status: isHealthy ? "healthy" : "diseased",
        meta_data: {
            diseaseName: scan.diseaseName,
            confidence: scan.confidence,
            treatment: scan.treatment,
        },
    }
}

export function generateActivityFromPlant(plant: any): Omit<Activity, "id" | "timestamp"> {
    return {
        type: "plant_added",
        title: `Added ${plant.name}`,
        description: `New ${plant.type} plant added to your garden`,
        plantId: plant.id,
        plantName: plant.name,
        status: "info",
        meta_data: {
            plantType: plant.type,
            variety: plant.variety,
            location: plant.location?.address,
        },
    }
}

export function generateWateringActivity(plantName: string, plantId: number): Omit<Activity, "id" | "timestamp"> {
    return {
        type: "watering",
        title: "Watering reminder sent",
        description: `For ${plantName}`,
        plantId,
        plantName,
        status: "info",
    }
}

export function generateTreatmentActivity(
    plantName: string,
    plantId: number,
    treatment: string,
): Omit<Activity, "id" | "timestamp"> {
    return {
        type: "treatment",
        title: `Treatment applied to ${plantName}`,
        description: treatment,
        plantId,
        plantName,
        status: "warning",
        meta_data: {
            treatment,
        },
    }
}
