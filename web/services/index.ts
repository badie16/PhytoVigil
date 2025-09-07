// Export de tous les services
export { authService } from "./auth.service"
export { usersService } from "./users.service"
export { diseasesService } from "./diseases.service"
export { scansService } from "./scans.service"
export { dashboardService } from "./dashboard.service"
export { aiService } from "./ai.service"
export { mobileConfigService } from "./mobile-config.service"
export { settingsService } from "./settings.service"

// Export des types
export type { User, LoginCredentials, RegisterData, AuthResponse } from "./auth.service"
export type { User as UserType, CreateUserData, UpdateUserData, UsersListParams, UserStats } from "./users.service"
export type {
  Disease,
  CreateDiseaseData,
  UpdateDiseaseData,
  DiseasesListParams,
  DiseaseStats,
} from "./diseases.service"
export type { PlantScan, CreateScanData, UpdateScanData, ScansListParams, ScanStats } from "./scans.service"
export type { DashboardStats, ChartData } from "./dashboard.service"
export type {
  AIModelInfo,
  PredictionRequest,
  PredictionResponse,
  ModelMetrics,
  GeminiGenerateRequest,
  GeminiGenerateResponse,
  GeminiTemplate,
} from "./ai.service"
export type {
  MobileConfig,
  PushNotification,
  DynamicContent,
  CreateNotificationData,
  CreateContentData,
  DeploymentInfo,
} from "./mobile-config.service"
export type {
  SystemSettings,
  AdminUser,
  CreateAdminData,
  UpdateAdminData,
  ChangePasswordData,
  BackupInfo,
  SystemInfo,
} from "./settings.service"
