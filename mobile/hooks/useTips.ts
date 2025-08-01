"use client"

import { weatherService, type WeatherData } from "@/services/remote/weatherService"
import { tipsService, type Tip } from "@/services/tipsService"
import * as Location from "expo-location"
import { useCallback, useEffect, useState } from "react"
import { AppState } from "react-native"

export function useTips() {
    const [tips, setTips] = useState<Tip[]>([])
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

    const loadTips = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            // Get location permission
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                throw new Error("Location permission is required for weather-based tips")
            }

            // Get current location
            const location = await Location.getCurrentPositionAsync({})

            // Get weather data
            const weatherData = await weatherService.getCurrentWeather(location.coords.latitude, location.coords.longitude)
            setWeather(weatherData)

            // Generate tips
            const generatedTips = await tipsService.generateTips()
            setTips(generatedTips)
            setLastRefresh(new Date())
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load tips"
            setError(errorMessage)
            console.error("Error loading tips:", err)

            // Set fallback tips
            setTips([
                {
                    id: "fallback",
                    title: "Scan Your Plants",
                    description: "Regular scanning helps detect plant diseases early and maintain healthy plants.",
                    icon: "📱",
                    priority: "medium",
                    category: "general",
                    action: { type: "scan" },
                    dismissible: true,
                    createdAt: new Date().toISOString(),
                },
            ])
        } finally {
            setLoading(false)
        }
    }, [])

    const refreshTips = useCallback(async () => {
        await loadTips()
    }, [loadTips])

    const dismissTip = useCallback((tipId: string) => {
        setTips((prevTips) => prevTips.filter((tip) => tip.id !== tipId))
    }, [])

    const executeTipAction = useCallback(async (tip: Tip) => {
        if (!tip.action) return

        try {
            switch (tip.action.type) {
                case "scan":
                    // Navigation will be handled by the component
                    console.log("Executing scan action")
                    break
                case "navigate":
                    // Navigation will be handled by the component
                    console.log("Executing navigate action:", tip.action.data)
                    break
                case "external":
                    // Handle external actions (like opening URLs)
                    console.log("Executing external action:", tip.action.data)
                    break
            }
        } catch (err) {
            console.error("Error executing tip action:", err)
        }
    }, [])

    // Auto-refresh tips every hour
    useEffect(() => {
        loadTips()
        const interval = setInterval(loadTips, 60 * 60 * 1000)
        return () => clearInterval(interval)
    }, [loadTips])


    // Refresh tips when app comes to foreground
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active" && lastRefresh) {
                const timeSinceLastRefresh = Date.now() - lastRefresh.getTime()
                if (timeSinceLastRefresh > 30 * 60 * 1000) {
                    loadTips()
                }
            }
        })

        return () => subscription.remove()
    }, [lastRefresh, loadTips])

    return {
        tips,
        weather,
        loading,
        error,
        lastRefresh,
        refreshTips,
        dismissTip,
        executeTipAction,
    }
}
