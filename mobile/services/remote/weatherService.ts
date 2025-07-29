import { config } from "@/lib/config/env"
import { WeatherAnimationMap } from "@/lib/constant/WeatherIcon" 
type LottieAnimationSource = any;

export interface WeatherData {
    temperature: number
    humidity: number
    uvIndex: number 
    windSpeed: number
    condition: string // Main weather condition (e.g., "Clouds", "Rain")
    description: string // Detailed weather description (e.g., "overcast clouds")
    icon: string // OpenWeatherMap icon code (e.g., "04d")
    iconUrl: string // URL for a traditional OpenWeatherMap icon image 
    AnimatedIconComponent: LottieAnimationSource; // The Lottie JSON object for the animation
    location: string
    sunrise: string
    sunset: string
    feelsLike: number
    visibility: number // in km
    pressure: number
}

export interface WeatherForecast {
    date: string
    temperature: {
        min: number
        max: number
    }
    AnimatedIconComponent: LottieAnimationSource; // The Lottie JSON object for the animation
    condition: string
    icon: string
    humidity: number
    windSpeed: number
}

class WeatherService {
    private readonly API_KEY = config.WEATHER_API_KEY
    private readonly BASE_URL = "https://api.openweathermap.org/data/2.5"
    private readonly ICON_BASE_URL = "https://openweathermap.org/img/wn" // For standard PNG icons

    async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
        try {
            const response = await fetch(`${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric&lang=fr`) // Added lang=fr for French descriptions

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`)
            }

            const data = await response.json()
            const iconCode = data.weather[0].icon;

            return {
                temperature: Math.round(data.main.temp),
                humidity: data.main.humidity,
                uvIndex: 0, // Will be updated by getUVIndex 
                windSpeed: data.wind.speed,
                condition: data.weather[0].main,
                description: data.weather[0].description,
                icon: iconCode,
                iconUrl: this.getOpenWeatherMapIconUrl(iconCode),
                AnimatedIconComponent: WeatherAnimationMap[iconCode] || WeatherAnimationMap["04d"], // Fallback to 'cloudy' animation
                location: data.name,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                feelsLike: Math.round(data.main.feels_like),
                visibility: data.visibility / 1000, // Convert to km
                pressure: data.main.pressure,
            }
        } catch (error) {
            console.error("Error fetching current weather data:", error)
            throw new Error("Failed to fetch current weather data. Please check your API key and network connection.")
        }
    }

    async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
        try {
            // OpenWeatherMap's /forecast endpoint provides 5-day / 3-hour forecast
            const response = await fetch(`${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric&lang=fr`)

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`)
            }

            const data = await response.json()

            const dailyForecasts: WeatherForecast[] = []
            const processedDates = new Set<string>() // Explicitly type the Set

            for (const item of data.list) {
                const date = new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', month: 'numeric', day: 'numeric' }); // Formatted date
                const iconCode = item.weather[0].icon;

                // Simple logic to get one forecast per day (the first one for that day)
                if (!processedDates.has(date) && dailyForecasts.length < 5) { // Limit to 5 days
                    processedDates.add(date)
                    dailyForecasts.push({
                        date: date,
                        temperature: {
                            min: Math.round(item.main.temp_min),
                            max: Math.round(item.main.temp_max),
                        },
                        // Use WeatherAnimationMap for forecast icons as well
                        AnimatedIconComponent: WeatherAnimationMap[iconCode] || WeatherAnimationMap["04d"], // Fallback
                        condition: item.weather[0].main,
                        icon: iconCode, // The original icon code from OpenWeatherMap
                        humidity: item.main.humidity,
                        windSpeed: item.wind.speed,
                    })
                }
            }

            return dailyForecasts
        } catch (error) {
            console.error("Error fetching weather forecast:", error)
            throw new Error("Failed to fetch weather forecast. Please check your API key and network connection.")
        }
    }

    // This method is for getting the traditional OpenWeatherMap PNG icon URL
    getOpenWeatherMapIconUrl(iconCode: string): string {
        return `${this.ICON_BASE_URL}/${iconCode}@2x.png`;
    }

 
    async getUVIndex(lat: number, lon: number): Promise<number> {
        try {
            const response = await fetch(`${this.BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`)

            if (!response.ok) {
                // If UVI endpoint gives 404, it might be removed or require different access
                if (response.status === 404) {
                    console.warn("UV Index API endpoint might be deprecated or unavailable. Returning 0.");
                    return 0;
                }
                throw new Error(`UV API error: ${response.status}`)
            }

            const data = await response.json()
            return Math.round(data.value)
        } catch (error) {
            console.error("Error fetching UV index:", error)
            // It's often safer to return a default value like 0 or null on error for UI
            return 0
        }
    }

    // This method returns an emoji string.
    getWeatherIcon(iconCode: string): string {
        const iconMap: { [key: string]: string } = {
            "01d": "☀️", // clear sky day
            "01n": "🌙", // clear sky night
            "02d": "⛅", // few clouds day
            "02n": "☁️", // few clouds night
            "03d": "☁️", // scattered clouds
            "03n": "☁️",
            "04d": "☁️", // broken clouds
            "04n": "☁️",
            "09d": "🌧️", // shower rain
            "09n": "🌧️",
            "10d": "🌦️", // rain day
            "10n": "🌧️", // rain night
            "11d": "⛈️", // thunderstorm
            "11n": "⛈️",
            "13d": "❄️", // snow
            "13n": "❄️",
            "50d": "🌫️", // mist
            "50n": "🌫️",
        }

        return iconMap[iconCode] || "🌤️" // Default fallback emoji
    }

    isGoodWeatherForScanning(weather: WeatherData): boolean {
        // Good conditions: moderate temperature, low humidity, clear/partly cloudy
        const goodTemp = weather.temperature >= 15 && weather.temperature <= 30
        const lowHumidity = weather.humidity < 70
        const goodConditions = ["Clear", "Clouds"].includes(weather.condition)
        const lowWind = weather.windSpeed < 10

        return goodTemp && lowHumidity && goodConditions && lowWind
    }

    getWeatherRisk(weather: WeatherData): {
        level: "low" | "medium" | "high"
        message: string
    } {
        if (weather.temperature > 35) {
            return { level: "high", message: "Chaleur extrême - protégez les plantes du soleil." }
        }
        if (weather.temperature < 0) {
            return { level: "high", message: "Température de congélation - protégez du gel." }
        }
        if (weather.humidity > 85) {
            return { level: "medium", message: "Forte humidité - surveillez les maladies fongiques." }
        }
        if (weather.windSpeed > 15) {
            return { level: "medium", message: "Vents forts - sécurisez les plantes hautes." }
        }

        return { level: "low", message: "Bonnes conditions pour l'entretien des plantes." }
    }
}

export const weatherService = new WeatherService()
export default weatherService