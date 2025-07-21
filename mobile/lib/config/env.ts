import Constants from 'expo-constants';
const ENV = Constants.expoConfig?.extra ?? {};
type AppConfig = {
    API_URL: string;
    TOKEN_KEY: string
};

const getEnv = (): AppConfig => ({
    API_URL: "http://127.0.0.1:8000",
    TOKEN_KEY: ENV.TOKEN_KEY ?? "auth_token"
});

export const config: AppConfig = getEnv();

