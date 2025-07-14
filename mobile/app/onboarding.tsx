import { useEffect, useRef, useState } from "react"
import { View, Text, Animated, Dimensions, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Leaf, Camera, Shield, TrendingUp, ChevronRight } from "lucide-react-native"

const { width, height } = Dimensions.get("window")

interface OnboardingScreenProps {
    onComplete: () => void
}

const onboardingData = [
    {
        id: 1,
        icon: <Leaf color="#FFFFFF" size={60} />,
        title: "Welcome to PhytoVigil",
        subtitle: "AI-Powered Plant Care",
        description: "Your intelligent companion for plant health monitoring and disease detection",
    },
    {
        id: 2,
        icon: <Camera color="#FFFFFF" size={60} />,
        title: "Scan & Detect",
        subtitle: "Advanced AI Analysis",
        description: "Simply take a photo of your plant and get instant disease detection with treatment recommendations",
    },
    {
        id: 3,
        icon: <Shield color="#FFFFFF" size={60} />,
        title: "Protect & Treat",
        subtitle: "Expert Guidance",
        description: "Receive personalized treatment plans and preventive care tips to keep your plants healthy",
    },
    {
        id: 4,
        icon: <TrendingUp color="#FFFFFF" size={60} />,
        title: "Track & Monitor",
        subtitle: "Health Analytics",
        description: "Monitor your plant collection's health over time with detailed analytics and insights",
    },
]

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const scaleAnim = useRef(new Animated.Value(0.8)).current
    const slideAnim = useRef(new Animated.Value(50)).current

    useEffect(() => {
        animateIn()
    }, [currentIndex])

    const animateIn = () => {
        // Reset animations
        fadeAnim.setValue(0)
        scaleAnim.setValue(0.8)
        slideAnim.setValue(50)

        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start()
    }

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            handleGetStarted()
        }
    }

    const handleSkip = () => {
        handleGetStarted()
    }

    const handleGetStarted = () => {
        onComplete()
    }

    const currentData = onboardingData[currentIndex]

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#00C896" }}>
            <View style={{ flex: 1 }}>
                {/* Skip Button */}
                {currentIndex < onboardingData.length - 1 && (
                    <View style={{ alignItems: "flex-end", paddingHorizontal: 24, paddingTop: 16 }}>
                        <TouchableOpacity onPress={handleSkip}>
                            <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 16, fontWeight: "500" }}>Skip</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Content */}
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
                    {/* Icon */}
                    <Animated.View
                        style={{
                            alignItems: "center",
                            transform: [{ scale: scaleAnim }],
                            opacity: fadeAnim,
                            marginBottom: 40,
                        }}
                    >
                        <View
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 3,
                                borderColor: "rgba(255, 255, 255, 0.3)",
                            }}
                        >
                            {currentData.icon}
                        </View>
                    </Animated.View>

                    {/* Text Content */}
                    <Animated.View
                        style={{
                            alignItems: "center",
                            transform: [{ translateY: slideAnim }],
                            opacity: fadeAnim,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 28,
                                fontWeight: "bold",
                                color: "#FFFFFF",
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            {currentData.title}
                        </Text>

                        <Text
                            style={{
                                fontSize: 16,
                                color: "rgba(255, 255, 255, 0.9)",
                                fontWeight: "600",
                                textAlign: "center",
                                marginBottom: 20,
                            }}
                        >
                            {currentData.subtitle}
                        </Text>

                        <Text
                            style={{
                                fontSize: 16,
                                color: "rgba(255, 255, 255, 0.8)",
                                textAlign: "center",
                                lineHeight: 24,
                                maxWidth: 300,
                            }}
                        >
                            {currentData.description}
                        </Text>
                    </Animated.View>
                </View>

                {/* Bottom Section */}
                <View style={{ paddingHorizontal: 40, paddingBottom: 50 }}>
                    {/* Page Indicators */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 40,
                        }}
                    >
                        {onboardingData.map((_, index) => (
                            <View
                                key={index}
                                style={{
                                    width: index === currentIndex ? 24 : 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: index === currentIndex ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
                                    marginHorizontal: 4,
                                }}
                            />
                        ))}
                    </View>

                    {/* Next/Get Started Button */}
                    <TouchableOpacity
                        onPress={handleNext}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            paddingVertical: 16,
                            paddingHorizontal: 24,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={{
                                color: "#00C896",
                                fontSize: 16,
                                fontWeight: "600",
                                marginRight: 8,
                            }}
                        >
                            {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
                        </Text>
                        <ChevronRight color="#00C896" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
