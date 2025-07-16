import { AuthProvider } from "@/contexts/auth-context"
import { Stack } from "expo-router"
import * as Splash from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { Platform } from "react-native"
import "../assets/style/global.css"
import SplashScreen from "./splash"

if (Platform.OS !== "web") {
  Splash.preventAutoHideAsync()
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false)
  useEffect(() => {
    const prepare = async () => {
      try {
        // Initialize database
        // await databaseService.init()

        // Simulate minimum splash time for better UX
        await new Promise((resolve) => setTimeout(resolve, 2500))

        // Any other initialization tasks can go here
        console.log("App initialization complete")
      } catch (e) {
        console.warn("App initialization error:", e)
      } finally {
        setAppIsReady(true)
        if (Platform.OS !== "web") {
          await Splash.hideAsync()
        }
      }
    }
    prepare()
  }, [])

  if (!appIsReady) {
    return (
      <SplashScreen></SplashScreen>
    )
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
