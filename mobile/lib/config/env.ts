import Constants from 'expo-constants';
const ENV = Constants.expoConfig?.extra ?? {};
type AppConfig = {
    API_URL: string;
};

const getEnv = (): AppConfig => ({
    API_URL: ENV.API_URL ?? "http://127.0.0.1:8000",
});

export const config: AppConfig = getEnv();

