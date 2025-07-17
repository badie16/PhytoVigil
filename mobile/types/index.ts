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
  id: number
  name: string
  scientific_name?: string
  description: string
  symptoms: string[] | string
  treatment: string
  prevention: string
  severity_level: number
  affectedPlants?: string[]   
  image_url?: string
  created_at?: string
}

export interface AppSettings {
  notifications: boolean
  locationServices: boolean
  autoSave: boolean
  imageQuality: "low" | "medium" | "high"
  language: string
  theme: "light" | "dark" | "auto"
}
