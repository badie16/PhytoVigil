import { Tabs } from "expo-router"
import { Camera, History, Book, User } from "lucide-react-native"

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#00bfa5",
                tabBarInactiveTintColor: "#90a4ae",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopColor: "#f0f0f0",
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 70,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
                headerStyle: {
                    backgroundColor: "#ffffff",
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f0f0f0",
                },
                headerTitleStyle: {
                    color: "#00796b",
                    fontSize: 20,
                    fontWeight: "bold",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Scanner",
                    tabBarIcon: ({ color, size }) => <Camera color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="diseases"
                options={{
                    title: "Diseases",
                    tabBarIcon: ({ color, size }) => <Book color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
        </Tabs>
    )
}
