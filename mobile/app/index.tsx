"use client"

import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { useAuth } from "@/contexts/auth-context"
import { storageService } from "@/services/storage"
import OnboardingScreen from "./onboarding"

export default function IndexScreen() {
    const router = useRouter()
    const { isAuthenticated, isLoading } = useAuth()
    const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null)

    useEffect(() => {
        checkFirstLaunch()
    }, [])
    useEffect(() => {
        if (!isLoading && showOnboarding !== null) {
            if (showOnboarding) {
                // Show onboarding for first-time users
                return
            }
            if (isAuthenticated) {
                router.replace("/(tabs)")
            } else {
                router.replace("/auth/login")
            }
        }
    }, [isAuthenticated, isLoading, showOnboarding, router])

    const checkFirstLaunch = async () => {
        try {
            const preferences = await storageService.getUserPreferences()
            const hasSeenOnboarding = preferences.hasSeenOnboarding

            setShowOnboarding(!hasSeenOnboarding)
        } catch (error) {
            console.error("Error checking first launch:", error)
            setShowOnboarding(true) // Default to showing onboarding on error
        }
    }

    const handleOnboardingComplete = async () => {
        try {
            await storageService.saveUserPreference("hasSeenOnboarding", true)
            setShowOnboarding(false)
        } catch (error) {
            console.error("Error saving onboarding preference:", error)
            setShowOnboarding(false)
        }
    }

    if (showOnboarding === null || isLoading) {
        // Still loading, keep showing nothing (splash screen is still visible)
        
        return null
    }

    if (showOnboarding) {
        return <OnboardingScreen onComplete={handleOnboardingComplete} />
    }

    // This will trigger the navigation in useEffect
    return null
}
