import { TouchableOpacity } from "react-native"
import { Camera, Image } from "lucide-react-native"

interface CameraButtonProps {
    onPress: () => void
    variant?: "camera" | "gallery"
    disabled?: boolean
    size?: "sm" | "md" | "lg"
}

export default function CameraButton({
    onPress,
    variant = "camera",
    disabled = false,
    size = "lg",
}: CameraButtonProps) {
    const getSizeStyle = () => {
        switch (size) {
            case "sm":
                return { width: 48, height: 48 }
            case "md":
                return { width: 64, height: 64 }
            case "lg":
                return { width: 80, height: 80 }
        }
    }

    const getIconSize = () => {
        switch (size) {
            case "sm":
                return 20
            case "md":
                return 24
            case "lg":
                return 28
        }
    }

    const getBackgroundColor = () => {
        if (disabled) return "#8E8E9380"
        return variant === "camera" ? "#00C896" : "#4ECDC4"
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                getSizeStyle(),
                {
                    borderRadius: size === "lg" ? 40 : size === "md" ? 32 : 24,
                    backgroundColor: getBackgroundColor(),
                    alignItems: "center",
                    justifyContent: "center",
                    elevation: 8,
                    shadowColor: "#00C896",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                },
            ]}
            activeOpacity={0.8}
        >
            {variant === "camera" ? (
                <Camera color="#ffffff" size={getIconSize()} strokeWidth={2} />
            ) : (
                <Image color="#ffffff" size={getIconSize()} strokeWidth={2} />
            )}
        </TouchableOpacity>
    )
}
