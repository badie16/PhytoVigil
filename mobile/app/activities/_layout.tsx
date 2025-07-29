import { Stack } from "expo-router"

export default function ActivitiesLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // Cache le header pour toutes les pages dans /activities
            }}
        />
    )
}
