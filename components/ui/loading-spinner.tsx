import { View, ActivityIndicator, Text } from "react-native"

interface LoadingSpinnerProps {
    message?: string
    size?: "small" | "large"
}

export default function LoadingSpinner({ message = "Loading...", size = "large" }: LoadingSpinnerProps) {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" }}>
            <ActivityIndicator size={size} color="#00bfa5" style={{ marginBottom: 16 }} />
            <Text style={{ color: "#90a4ae", fontSize: 16, textAlign: "center" }}>{message}</Text>
        </View>
    )
}
