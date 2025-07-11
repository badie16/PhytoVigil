export interface PlantScan {
  id: string
  plantName: string
  diseaseName: string
  confidence: number
  treatment: string
  imageUri: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  createdAt: string
  updatedAt: string
  status: "healthy" | "diseased" | "unknown"
  notes?: string
}

export interface Plant {
  id: string
  name: string
  type: string
  variety?: string
  plantedDate?: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  imageUri?: string
  health: "healthy" | "warning" | "danger"
  lastScanned?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Disease {
  id: string
  name: string
  scientificName?: string
  description: string
  symptoms: string[]
  treatment: string
  prevention: string
  severity: "low" | "medium" | "high"
  affectedPlants: string[]
  imageUri?: string
}

export interface AppSettings {
  notifications: boolean
  locationServices: boolean
  autoSave: boolean
  imageQuality: "low" | "medium" | "high"
  language: string
  theme: "light" | "dark" | "auto"
}
