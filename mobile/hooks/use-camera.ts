import { useState } from "react"
import * as ImagePicker from "expo-image-picker"
import { Alert } from "react-native"

export interface CameraHookResult {
  isLoading: boolean
  openCamera: () => Promise<string | null>
  openImagePicker: () => Promise<string | null>
  requestPermissions: () => Promise<boolean>
}

export function useCamera(): CameraHookResult {
  const [isLoading, setIsLoading] = useState(false)

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!cameraPermission.granted || !mediaPermission.granted) {
        Alert.alert("Permissions Required", "Camera and photo library access are required to scan plants.", [
          { text: "OK" },
        ])
        return false
      }

      return true
    } catch (error) {
      console.error("Error requesting permissions:", error)
      return false
    }
  }

  const openCamera = async (): Promise<string | null> => {
    try {
      setIsLoading(true)

      const hasPermissions = await requestPermissions()
      if (!hasPermissions) {
        return null
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
       
        base64: false,
      })

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri
      }

      return null
    } catch (error) {
      console.error("Error opening camera:", error)
      Alert.alert("Error", "Failed to open camera. Please try again.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const openImagePicker = async (): Promise<string | null> => {
    try {
      setIsLoading(true)

      const hasPermissions = await requestPermissions()
      if (!hasPermissions) {
        return null
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      })

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri
      }

      return null
    } catch (error) {
      console.error("Error opening image picker:", error)
      Alert.alert("Error", "Failed to open photo library. Please try again.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    openCamera,
    openImagePicker,
    requestPermissions,
  }
}
