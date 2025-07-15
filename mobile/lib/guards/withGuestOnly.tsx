import { useRouter } from "expo-router"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

export const withGuestOnly = (Component: React.FC) => {
    return function WrappedComponent(props: any) {
        const { user, isLoading } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!isLoading && user) {
                router.replace("/(tabs)")
            }
        }, [user, isLoading])

        if (isLoading || user) return null

        return <Component {...props} />
    }
}
