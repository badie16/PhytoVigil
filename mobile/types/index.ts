export interface PlantScan {
  id: number
  plant_id: number
  diseaseName: string
  top_predictions: Array<{
    class_name: string
    confidence: number
    rank?: number
  }>
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
  processing_time?: number
  model_version?: string

}
export interface BackendPlantScan {
  plant_id: number
  image_url: string
  result_type: "healthy" | "diseased" | "unknown"
  confidence_score: string
  detected_diseases: Record<string, any>
  recommendations: string
  location_lat: string
  location_lng: string
  id: number
  user_id: number
  scan_date: string
  scan_diseases: any[]
}
export interface BackendPlant {
  name: string
  type: string
  variety: string
  planted_date: string
  location: string
  notes: string
  image_url: string
  id: number
  user_id: number
  created_at: string
  updated_at: string
}
export interface Plant {
  id: number
  name: string
  type: string
  variety?: string
  plantedDate?: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  image_url?: string
  health: "healthy" | "warning" | "danger" | "not scanned"
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


export interface PredictionRequest {
  image: string // base64 encoded image
  // plant_id?: number
  // location?: {
  //   latitude: number
  //   longitude: number
  //   address?: string
  // }
}

export interface PredictionResponse {
  diseaseName: string
  top_predictions: Array<{
    class_name: string
    confidence: number
    rank?: number
  }>
  confidence: number
  treatment: string
  // imageUri: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  processing_time?: number,
  model_version?: string
  status: "healthy" | "diseased" | "unknown"
  createdAt?: string
  // notes?: string
}

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