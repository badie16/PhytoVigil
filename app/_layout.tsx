import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React from "react"
import "../assets/style/global.css"
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#00796b",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
