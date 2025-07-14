import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "expo-router"
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native"
import { useState } from "react"
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"


export default function LoginScreen() {
    const router = useRouter()
    const { login, isLoading, error, clearError } = useAuth()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const errors: Record<string, string> = {}

        if (!formData.email.trim()) {
            errors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email"
        }

        if (!formData.password.trim()) {
            errors.password = "Password is required"
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters"
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleLogin = async () => {
        clearError()

        if (!validateForm()) {
            return
        }

        try {
            await login(formData)
            router.replace("/(tabs)")
        } catch (error) {
            // Error is handled by the auth context
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView
                    className="justify-center"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6">
                        {/* Header */}
                        <View className="items-center mb-10">
                            <View className="w-120 h-120 rounded-full items-center justify-center mb-4">
                                {/* App Logo */}
                                <Image
                                    source={require('../../assets/images/logo.png')}
                                    style={{ width: 120, height: 120, resizeMode: 'contain' }}
                                />

                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</Text>
                            <Text className="text-sm text-secondary text-center">Sign in to continue monitoring your plants</Text>
                        </View>

                        {/* Error Message */}
                        {error && (
                            <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6">
                                <Text className="text-red-600 text-sm text-center">{error}</Text>
                            </View>
                        )}
                        {/* Form */}
                        <View className="mb-8">
                            {/* Email Input */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
                                <View
                                    className={`flex-row items-center bg-gray-50 rounded-xl px-3 py-3 border ${fieldErrors.email ? "border-red-500" : "border-gray-200"}`}
                                >
                                    <Mail color="#9CA3AF" size={18} />
                                    <TextInput
                                        className="flex-1 ml-3 text-sm text-gray-900"
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9CA3AF"
                                        value={formData.email}
                                        onChangeText={(value) => handleInputChange("email", value)}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={{ fontSize: 14 }}
                                    />
                                </View>
                                {fieldErrors.email && <Text className="text-red-500 text-xs mt-1">{fieldErrors.email}</Text>}
                            </View>

                            {/* Password Input */}
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
                                <View
                                    className={`flex-row items-center bg-gray-50 rounded-xl px-3 py-3 border ${fieldErrors.password ? "border-red-500" : "border-gray-200"}`}
                                >
                                    <Lock color="#9CA3AF" size={18} />
                                    <TextInput
                                        className="flex-1 ml-3 text-sm text-gray-900"
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        value={formData.password}
                                        onChangeText={(value) => handleInputChange("password", value)}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={{ fontSize: 14 }}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff color="#9CA3AF" size={18} /> : <Eye color="#9CA3AF" size={18} />}
                                    </TouchableOpacity>
                                </View>
                                {fieldErrors.password && <Text className="text-red-500 text-xs mt-1">{fieldErrors.password}</Text>}
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={isLoading}
                                className={`bg-primary rounded-xl py-3 items-center ${isLoading ? "opacity-70" : ""}`}
                            >
                                <Text className="text-white text-sm font-semibold">{isLoading ? "Signing In..." : "Sign In"}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Footer */}
                        <View className="items-center mt-auto pb-8">
                            <Text className="text-secondary text-sm mb-3">Don't have an account?</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    clearError()
                                    router.push("/auth/register")
                                }}
                            >
                                <Text className="text-primary text-sm font-semibold">Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
