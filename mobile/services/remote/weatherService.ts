import { config } from "@/lib/config/env"
import { WeatherIconMap } from "@/lib/constant/WeatherIcon"
import React from 'react';
type SvgComponent = React.FC<any>;
export interface WeatherData {
    temperature: number
    humidity: number
    uvIndex: number
    windSpeed: number
    condition: string
    description: string
    icon: string
    iconUrl: string 
    AnimatedIconComponent: SvgComponent;
    location: string
    sunrise: string
    sunset: string
    feelsLike: number
    visibility: number
    pressure: number
}

export interface WeatherForecast {
    date: string
    temperature: {
        min: number
        max: number
    }
    AnimatedIconComponent: SvgComponent;
    condition: string
    icon: string
    humidity: number
    windSpeed: number
}

class WeatherService {
    private readonly API_KEY = config.WEATHER_API_KEY
    private readonly BASE_URL = "https://api.openweathermap.org/data/2.5"
    private readonly ICON_BASE_URL = "https://openweathermap.org/img/wn"
    async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
        try {
            const response = await fetch(`${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`)

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`)
            }

            const data = await response.json()
            const iconCode = data.weather[0].icon;        
            return {
                temperature: Math.round(data.main.temp),
                humidity: data.main.humidity,
                uvIndex: 0, // UV index requires separate API call
                windSpeed: data.wind.speed,
                condition: data.weather[0].main,
                description: data.weather[0].description,
                icon: iconCode, 
                iconUrl: this.getAnimatedWeatherIconName(iconCode),
                AnimatedIconComponent: WeatherIconMap[iconCode] || WeatherIconMap["04d"], // Fallback par défaut
                location: data.name,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
                feelsLike: Math.round(data.main.feels_like),
                visibility: data.visibility / 1000, // Convert to km
                pressure: data.main.pressure,
            }
        } catch (error) {
            console.error("Error fetching weather data:", error)
            throw new Error("Failed to fetch weather data")
        }
    }

    async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
        try {
            const response = await fetch(`${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`)

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`)
            }

            const data = await response.json()

            // Group by day and get daily forecasts
            const dailyForecasts: WeatherForecast[] = []
            const processedDates = new Set()

            for (const item of data.list) {
                const date = new Date(item.dt * 1000).toDateString()
                const iconCode = item.weather[0].icon;
                if (!processedDates.has(date) && dailyForecasts.length < 5) {
                    processedDates.add(date)
                    dailyForecasts.push({
                        date: date,
                        temperature: {
                            min: Math.round(item.main.temp_min),
                            max: Math.round(item.main.temp_max),
                        },
                        AnimatedIconComponent: WeatherIconMap[iconCode] || WeatherIconMap["04d"], // Fallback par défaut
                        condition: item.weather[0].main,
                        icon: iconCode,
                        humidity: item.main.humidity,
                        windSpeed: item.wind.speed,
                    })
                }
            }

            return dailyForecasts
        } catch (error) {
            console.error("Error fetching weather forecast:", error)
            throw new Error("Failed to fetch weather forecast")
        }
    }
    private getAnimatedWeatherIconName(iconCode: string): string {
        return WeatherIconMap[iconCode]
    }
    async getUVIndex(lat: number, lon: number): Promise<number> {
        try {
            const response = await fetch(`${this.BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`)

            if (!response.ok) {
                throw new Error(`UV API error: ${response.status}`)
            }

            const data = await response.json()
            return Math.round(data.value)
        } catch (error) {
            console.error("Error fetching UV index:", error)
            return 0
        }
    }

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

        return iconMap[iconCode] || "🌤️"
    }

    isGoodWeatherForScanning(weather: WeatherData): boolean {
        // Good conditions: moderate temperature, low humidity, clear/partly cloudy
        const goodTemp = weather.temperature >= 15 && weather.temperature <= 30
        const lowHumidity = weather.humidity < 70
        const goodConditions = ["Clear", "Clouds"].includes(weather.condition)
        const lowWind = weather.windSpeed < 10

        return goodTemp && lowHumidity && goodConditions && lowWind
    }
    getOpenWeatherMapIconUrl(iconCode: string): string {
        return `${this.ICON_BASE_URL}/${iconCode}@2x.png`;
    }
    getWeatherRisk(weather: WeatherData): {
        level: "low" | "medium" | "high"
        message: string
    } {
        if (weather.temperature > 35) {
            return { level: "high", message: "Extreme heat - protect plants from sun" }
        }
        if (weather.temperature < 0) {
            return { level: "high", message: "Freezing temperature - protect from frost" }
        }
        if (weather.humidity > 85) {
            return { level: "medium", message: "High humidity - watch for fungal diseases" }
        }
        if (weather.windSpeed > 15) {
            return { level: "medium", message: "Strong winds - secure tall plants" }
        }

        return { level: "low", message: "Good conditions for plant care" }
    }
}

export const weatherService = new WeatherService()
export default weatherService
