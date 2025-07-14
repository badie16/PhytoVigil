"use client"

import { useEffect, useRef } from "react"
import { View, Text, Animated, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Leaf, Sparkles } from "lucide-react-native"

const { width, height } = Dimensions.get("window")

export default function SplashScreen() {
    const router = useRouter()
    const fadeAnim = useRef(new Animated.Value(0)).current
    const scaleAnim = useRef(new Animated.Value(0.8)).current
    const slideAnim = useRef(new Animated.Value(50)).current

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
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
                duration: 800,
                delay: 300,
                useNativeDriver: true,
            }),
        ]).start()

        // Navigate to login after delay
        const timer = setTimeout(() => {
            router.replace("/auth/login")
        }, 3000)

        return () => clearTimeout(timer)
    }, [fadeAnim, scaleAnim, slideAnim, router])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#00C896" }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
                {/* Background Pattern */}
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                    }}
                >
                    {[...Array(20)].map((_, i) => (
                        <Animated.View
                            key={i}
                            style={{
                                position: "absolute",
                                left: Math.random() * width,
                                top: Math.random() * height,
                                transform: [
                                    {
                                        rotate: `${Math.random() * 360}deg`,
                                    },
                                ],
                            }}
                        >
                            <Leaf color="#FFFFFF" size={20 + Math.random() * 30} />
                        </Animated.View>
                    ))}
                </View>

                {/* Main Logo */}
                <Animated.View
                    style={{
                        alignItems: "center",
                        transform: [{ scale: scaleAnim }],
                        opacity: fadeAnim,
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
                            marginBottom: 24,
                            borderWidth: 3,
                            borderColor: "rgba(255, 255, 255, 0.3)",
                        }}
                    >
                        <Leaf color="#FFFFFF" size={60} strokeWidth={2} />
                    </View>

                    <Text
                        style={{
                            fontSize: 32,
                            fontWeight: "bold",
                            color: "#FFFFFF",
                            marginBottom: 8,
                            textAlign: "center",
                        }}
                    >
                        PhytoVigil
                    </Text>

                    <Animated.View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            transform: [{ translateY: slideAnim }],
                            opacity: fadeAnim,
                        }}
                    >
                        <Sparkles color="#FFFFFF" size={16} />
                        <Text
                            style={{
                                fontSize: 16,
                                color: "rgba(255, 255, 255, 0.9)",
                                marginLeft: 8,
                                fontWeight: "500",
                            }}
                        >
                            AI-Powered Plant Care
                        </Text>
                    </Animated.View>
                </Animated.View>

                {/* Features */}
                <Animated.View
                    style={{
                        position: "absolute",
                        bottom: 100,
                        left: 40,
                        right: 40,
                        transform: [{ translateY: slideAnim }],
                        opacity: fadeAnim,
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <Text
                            style={{
                                fontSize: 18,
                                color: "#FFFFFF",
                                fontWeight: "600",
                                marginBottom: 16,
                                textAlign: "center",
                            }}
                        >
                            Detect • Diagnose • Treat
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: "rgba(255, 255, 255, 0.8)",
                                textAlign: "center",
                                lineHeight: 20,
                            }}
                        >
                            Advanced AI technology to keep your plants healthy and thriving
                        </Text>
                    </View>
                </Animated.View>

                {/* Loading Indicator */}
                <Animated.View
                    style={{
                        position: "absolute",
                        bottom: 40,
                        opacity: fadeAnim,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "rgba(255, 255, 255, 0.6)",
                                marginHorizontal: 3,
                            }}
                        />
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                marginHorizontal: 3,
                            }}
                        />
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "#FFFFFF",
                                marginHorizontal: 3,
                            }}
                        />
                    </View>
                </Animated.View>
            </View>
        </SafeAreaView>
    )
}
