"use client"
import React from "react"

import { AuthProvider } from "@/contexts/auth-context"
import { databaseService } from "@/services/database"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import "../assets/style/global.css"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize database
        await databaseService.init()

        // Simulate minimum splash time for better UX
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Any other initialization tasks can go here
        console.log("App initialization complete")
      } catch (e) {
        console.warn("App initialization error:", e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen once the app is ready
      SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    // Keep showing the native splash screen
    return null
  }

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#00C896" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#00C896",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  )
}
