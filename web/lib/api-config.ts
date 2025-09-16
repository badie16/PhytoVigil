// Configuration API centralisée
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/users/me",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Users
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    STATS: "/users/stats",
    EXPORT: "/users/export",
  },

  // Diseases
  DISEASES: {
    LIST: "/diseases",
    CREATE: "/diseases",
    GET: (id: number) => `/diseases/${id}`,
    UPDATE: (id: number) => `/diseases/${id}`,
    DELETE: (id: number) => `/diseases/${id}`,
    STATS: "/diseases/stats",
    GENERATE_TREATMENT: "/diseases/generate-treatment",
    UPLOAD_IMAGE: "/diseases/upload-image",
  },

  // Plant Scans
  SCANS: {
    LIST: "/plant-scans",
    CREATE: "/plant-scans",
    GET: (id: number) => `/plant-scans/${id}`,
    UPDATE: (id: number) => `/plant-scans/${id}`,
    DELETE: (id: number) => `/plant-scans/${id}`,
    STATS: "/plant-scans/stats",
    VALIDATE: (id: number) => `/plant-scans/${id}/validate`,
    EXPORT: "/plant-scans/export",
  },

  // Plants
  PLANTS: {
    LIST: "/plants",
    CREATE: "/plants",
    GET: (id: number) => `/plants/${id}`,
    UPDATE: (id: number) => `/plants/${id}`,
    DELETE: (id: number) => `/plants/${id}`,
  },

  // Activities
  ACTIVITIES: {
    LIST: "/activities",
    CREATE: "/activities",
    GET: (id: string) => `/activities/${id}`,
    UPDATE: (id: string) => `/activities/${id}`,
    DELETE: (id: string) => `/activities/${id}`,
    USER_ACTIVITIES: (userId: number) => `/activities/user/${userId}`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
    CHARTS: "/dashboard/charts",
    RECENT_ACTIVITY: "/dashboard/recent-activity",
  },

  // AI Model
  AI_MODEL: {
    INFO: "/ai-model/info",
    PREDICT: "/ai-model/predict",
    RETRAIN: "/ai-model/retrain",
    METRICS: "/ai-model/metrics",
    UPDATE: "/ai-model/update",
  },

  // Gemini API
  GEMINI: {
    GENERATE: "/gemini/generate",
    TEMPLATES: "/gemini/templates",
    HISTORY: "/gemini/history",
  },

  // Mobile Config
  MOBILE_CONFIG: {
    GET: "/mobile-config",
    UPDATE: "/mobile-config",
    NOTIFICATIONS: "/mobile-config/notifications",
    CONTENT: "/mobile-config/content",
    DEPLOY: "/mobile-config/deploy",
  },

  // System Settings
  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings",
    BACKUP: "/settings/backup",
    EXPORT: "/settings/export",
    SYSTEM_INFO: "/settings/system-info",
  },

  // File Upload
  UPLOAD: {
    IMAGE: "/upload/image",
    FILE: "/upload/file",
    BULK: "/upload/bulk",
  },
}
