// app/(tabs)/_layout.tsx

import { Tabs, useRouter } from "expo-router"
import { Camera, Home, Leaf, Shield, User } from "lucide-react-native"
import { View, ActivityIndicator } from "react-native"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import "../../assets/style/global.css"

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login") 
    }
  }, [isAuthenticated, isLoading])

  if (isLoading || !isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00C896" />
      </View>
    )
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00C896",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#F2F2F7",
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          elevation: 8,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          boxShadow: 'none',
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: "#00C896",
          fontSize: 20,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="diagnose"
        options={{
          title: "Diagnose",
          tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#00C896",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                elevation: 8,
                boxShadow: '0 4px 8px rgba(0, 200, 150, 0.3)',
              }}
            >
              <Camera color="#FFFFFF" size={24} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="plants"
        options={{
          title: "My Plants",
          tabBarIcon: ({ color, size }) => <Leaf color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
