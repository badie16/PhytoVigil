import Header from '@/components/ui/header'
import { useTips } from '@/hooks/useTips'
import { weatherService } from '@/services/remote/weatherService'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import { Droplets, Eye, Gauge, MapPin, Wind } from 'lucide-react-native'
import React from 'react'
import { Animated, Dimensions, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const { width } = Dimensions.get('window')

export default function WeatherDetailsScreen() {
    const { weather, loading } = useTips()
    const scrollY = new Animated.Value(0)

    // Handle loading or null weather state
    if (loading || !weather) {
        // You might want to show a loading spinner or fallback UI here
        return (
            <SafeAreaView className="flex-1 bg-white">
                <Header title="Weather Details" onBack={() => router.back()} />
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500">Loading weather data...</Text>
                </View>
            </SafeAreaView>
        )
    }
    const weatherIcon = weatherService.getWeatherIcon(weather.icon)
    const AnimatedIcon = weather.AnimatedIconComponent
    console.log("wa : ", weather)
    console.log("icon : ", AnimatedIcon)
    const risk = weatherService.getWeatherRisk(weather)

    const getRiskColors = () => {
        switch (risk.level) {
            case "high":
                return {
                    bg: ['#FEF2F2', '#FEE2E2', '#FCA5A5'],
                    border: '#FECACA',
                    text: '#991B1B'
                }
            case "medium":
                return {
                    bg: ['#FFFBEB', '#FEF3C7', '#FDE68A'],
                    border: '#FDE68A',
                    text: '#92400E'
                }
            case "low":
                return {
                    bg: ['#F0FDF4', '#DCFCE7', '#A7F3D0'],
                    border: '#BBF7D0',
                    text: '#166534'
                }
            default:
                return {
                    bg: ['#F9FAFB', '#F3F4F6', '#E5E7EB'],
                    border: '#E5E7EB',
                    text: '#374151'
                }
        }
    }
    const getHeaderGradientColors = () => {
        switch (risk.level) {
            case "high":
                return ['#EF4444', '#DC2626', '#B91C1C']; // Brighter reds
            case "medium":
                return ['#FACC15', '#EAB308', '#CA8A04']; // Brighter yellows/oranges
            case "low":
                return ['#10B981', '#059669', '#047857']; // Original green for low risk
            default:
                return ['#6B7280', '#4B5563', '#374151']; // Default grey
        }
    };
    const getPlantAdvice = () => {
        const temp = weather.temperature
        const humidity = weather.humidity
        const windSpeed = weather.windSpeed

        let advice = []

        if (temp > 30) {
            advice.push("🌡️ High temperature: Water plants early morning or evening")
        } else if (temp < 10) {
            advice.push("❄️ Cold weather: Protect sensitive plants from frost")
        }

        if (humidity > 80) {
            advice.push("💧 High humidity: Watch for fungal diseases")
        } else if (humidity < 40) {
            advice.push("🏜️ Low humidity: Increase watering frequency")
        }

        if (windSpeed > 10) {
            advice.push("💨 Strong winds: Secure tall plants and check for damage")
        }

        if (weather.description.includes('rain')) {
            advice.push("🌧️ Rainy conditions: Reduce watering schedule")
        } else if (weather.description.includes('sun')) {
            advice.push("☀️ Sunny weather: Perfect for photosynthesis and growth")
        }

        return advice.length > 0 ? advice : ["🌱 Current conditions are favorable for most plants"]
    }

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.8],
        extrapolate: 'clamp'
    })

    return (
        <SafeAreaView className='bg-white' style={{ flex: 1 }}>
            <Header
                onBack={() => router.back()}
                title='Weather Details'
            />
            <Animated.ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <Animated.View style={{ opacity: headerOpacity }}>
                    <LinearGradient
                        colors={getHeaderGradientColors() as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            paddingHorizontal: 24,
                            paddingTop: 48,
                            paddingBottom: 32,
                        }}
                    >
                        {/* Location */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 24,
                            marginTop: 16
                        }}>
                            <MapPin color="rgba(255,255,255,0.8)" size={18} />
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: 'white',
                                marginLeft: 8
                            }}>
                                {weather.location}
                            </Text>
                        </View>

                        {/* Main Weather Display */}
                        <View style={{ alignItems: 'center' }}>
                            <BlurView
                                intensity={20}
                                tint="light"
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 24,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 20,
                                    overflow: 'hidden'
                                }}
                            >
                                <LottieView
                                    source={AnimatedIcon}
                                    autoPlay
                                    loop
                                    style={{ width: 70, height: 70 }} 
                                    speed={4}
                                />
                            </BlurView>

                            <Text style={{
                                fontSize: 48,
                                fontWeight: 'bold',
                                color: 'white',
                                marginBottom: 8
                            }}>
                                {weather.temperature}°
                            </Text>

                            <Text style={{
                                fontSize: 20,
                                color: 'rgba(255,255,255,0.9)',
                                textTransform: 'capitalize',
                                marginBottom: 4
                            }}>
                                {weather.description}
                            </Text>

                            <Text style={{
                                fontSize: 16,
                                color: 'rgba(255,255,255,0.7)'
                            }}>
                                Feels like {weather.feelsLike}°
                            </Text>
                        </View>
                    </LinearGradient>
                </Animated.View>
                {/* Weather Details Grid */}
                <View style={{
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    marginTop: -16,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#1F2937',
                        marginBottom: 20
                    }}>
                        Weather Details
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        <WeatherDetailCard
                            icon={<Droplets color="#06B6D4" size={24} />}
                            title="Humidity"
                            value={`${weather.humidity}%`}
                            description="Moisture in air"
                        />
                        <WeatherDetailCard
                            icon={<Wind color="#3B82F6" size={24} />}
                            title="Wind Speed"
                            value={`${weather.windSpeed} m/s`}
                            description="Current wind"
                        />
                        <WeatherDetailCard
                            icon={<Eye color="#6B7280" size={24} />}
                            title="Visibility"
                            value={`${weather.visibility} km`}
                            description="Clear distance"
                        />
                        <WeatherDetailCard
                            icon={<Gauge color="#EF4444" size={24} />}
                            title="Pressure"
                            value={`${weather.pressure} hPa`}
                            description="Atmospheric"
                        />
                    </View>
                </View>

                {/* Plant Risk Assessment */}
                <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#1F2937',
                        marginBottom: 16
                    }}>
                        Plant Risk Assessment
                    </Text>

                    <LinearGradient
                        colors={getRiskColors().bg as [string, string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: 16,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: getRiskColors().border
                        }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: getRiskColors().text
                            }}>
                                Risk Level
                            </Text>
                            <View style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                borderRadius: 20
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                    color: getRiskColors().text
                                }}>
                                    {risk.level}
                                </Text>
                            </View>
                        </View>
                        <Text style={{
                            fontSize: 15,
                            lineHeight: 22,
                            color: getRiskColors().text
                        }}>
                            {risk.message}
                        </Text>
                    </LinearGradient>
                </View>

                {/* Plant Care Advice */}
                <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#1F2937',
                        marginBottom: 16
                    }}>
                        Plant Care Advice
                    </Text>

                    <View style={{ gap: 12 }}>
                        {getPlantAdvice().map((advice, index) => (
                            <Animated.View
                                key={index}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 16,
                                    padding: 16,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 8,
                                    elevation: 1
                                }}
                            >
                                <Text style={{
                                    fontSize: 15,
                                    lineHeight: 22,
                                    color: '#374151'
                                }}>
                                    {advice}
                                </Text>
                            </Animated.View>
                        ))}
                    </View>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}

function WeatherDetailCard({
    icon,
    title,
    value,
    description
}: {
    icon: React.ReactNode
    title: string
    value: string
    description: string
}) {
    return (
        <View style={{
            width: (width - 56) / 2,
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12
            }}>
                <View style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                }}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 12,
                        color: '#6B7280',
                        marginBottom: 2
                    }}>
                        {title}
                    </Text>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#1F2937'
                    }}>
                        {value}
                    </Text>
                </View>
            </View>
            <Text style={{
                fontSize: 12,
                color: '#6B7280'
            }}>
                {description}
            </Text>
        </View>
    )
}
