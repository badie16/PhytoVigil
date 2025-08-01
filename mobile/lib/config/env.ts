import Constants from 'expo-constants';
const ENV = Constants.expoConfig?.extra ?? {};
type AppConfig = {
    API_URL: string;
    TOKEN_KEY: string
    WEATHER_API_KEY: string
    LOCATION_TIMEOUT:number
    TIPS_REFRESH_INTERVAL:number
    MAX_TIPS_COUNT:number
    EXPO_PUBLIC_PROJECT_ID:string
};

const getEnv = (): AppConfig => ({
    API_URL: ENV.API_URL ?? "http://192.168.100.138:8000",
    TOKEN_KEY: ENV.TOKEN_KEY ?? "auth_token",
    WEATHER_API_KEY: ENV.WEATHER_API_KEY ?? "579cf214a40b14f1487d7332d696f09e",
    LOCATION_TIMEOUT: ENV.LOCATION_TIMEOUT ?? 10000, // 10 seconds

    // Tips
    TIPS_REFRESH_INTERVAL: 60 * 60 * 1000, // 1 hour
    MAX_TIPS_COUNT: 5,
    EXPO_PUBLIC_PROJECT_ID: ENV.EXPO_PUBLIC_PROJECT_ID ?? "phytovigil-app",
});

export const config: AppConfig = getEnv();

