export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || "PhytoVigil",
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === "true",
  MOCK_API: process.env.NEXT_PUBLIC_MOCK_API === "true",
}

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(",") || ["image/jpeg", "image/png", "image/webp"],
  MAX_FILES: 5,
}

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

export const FEATURE_FLAGS = {
  ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === "true",
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA === "true",
}

export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: "#00C896",
    SECONDARY_COLOR: "#10B981",
    SUCCESS_COLOR: "#22C55E",
    WARNING_COLOR: "#F59E0B",
    ERROR_COLOR: "#EF4444",
    INFO_COLOR: "#3B82F6",
  },
  ANIMATION: {
    DURATION: 200,
    EASING: "ease-in-out",
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
}

export const API_CONFIG_CONSTANTS = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  PHONE: {
    PATTERN: /^(\+33|0)[1-9](\d{8})$/,
  },
}

export const DISEASE_SEVERITY_LEVELS = {
  1: { label: "Très faible", color: "green" },
  2: { label: "Faible", color: "yellow" },
  3: { label: "Moyenne", color: "orange" },
  4: { label: "Élevée", color: "red" },
  5: { label: "Critique", color: "red-dark" },
}

export const USER_ROLES = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MODERATOR: "Modérateur",
  USER: "Utilisateur",
  PREMIUM: "Premium",
}

export const SCAN_STATUSES = {
  PENDING: "pending",
  VALIDATED: "validated",
  REJECTED: "rejected",
}

export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
}
