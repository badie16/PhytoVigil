import AnalysisOptionsScreen from "@/components/analysis-options-screen"
import LinkToPlantScreen from "@/components/link-to-plant-screen"
import CameraButton from "@/components/ui/camera-button"
import CameraScreen from "@/components/ui/camera-screen"
import LoadingSpinner from "@/components/ui/loading-spinner"
import PhotoPreview from "@/components/ui/photo-preview"
// import ScanResultScreen from "@/components/ui/scan-result-screen"
import AddPlantForm from "@/components/add-plant-form"
import ScanResultScreen from "@/components/scan-result-screen"
import { useCamera } from "@/hooks/use-camera"
import { scanService } from "@/services/remote/scanService"
import type React from "react"
import { useState } from "react"
import { Image, Modal, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { PlantScan } from "@/types"

export type ScanFlow = 'scanner' | 'camera' | 'preview' | 'options' | 'linking' | 'addPlant' | 'result' | 'analyzing'

export interface ScanData {
    imageUri: string
    linkedPlantId?: number
    plantName?: string
    isNewPlant?: boolean
    analysisType?: 'quick' | 'save'
    scanResult?: PlantScan
}

export default function ScannerScreen() {
    const [currentFlow, setCurrentFlow] = useState<ScanFlow>('scanner')
    const [scanData, setScanData] = useState<ScanData | null>(null)
    const { isLoading, openCamera, openImagePicker } = useCamera()

    const handleGalleryPress = async () => {
        const uri = await openImagePicker()
        if (uri) {
            setScanData({ imageUri: uri })
            setCurrentFlow('preview')
        }
    }
    const handlePhotoTaken = (uri: string) => {
        setScanData({ imageUri: uri })
        setCurrentFlow('preview')
    }
    const handleAnalyzePhoto = () => {
        setCurrentFlow('options')
    }
    const handleQuickAnalysis = () => {
        if (scanData) {
            setScanData({
                ...scanData,
                analysisType: 'quick'
            })
        }
        setCurrentFlow('analyzing')
        StartAnalysis()
    }

    const handleLinkToExistingPlant = () => {
        if (scanData) {
            setScanData({
                ...scanData,
                analysisType: 'save'
            })
        }
        setCurrentFlow('linking')
    }

    const handleAddNewPlant = () => {
        // Navigate to add plant screen with the image
        // router.push({
        //     pathname: '/plants/add',
        //     params: { imageUri: scanData?.imageUri }
        // })
        setCurrentFlow('addPlant')
    }

    const handleStartAnalysis = (linkingData: { linkedPlantId?: number, plantName?: string, isNewPlant?: boolean, skipLinking?: boolean }) => {
        if (scanData) {
            setScanData({
                ...scanData,
                ...linkingData,
                analysisType: 'save'
            })
        }
        console.log("yes")
        StartAnalysis(linkingData.linkedPlantId)
        setCurrentFlow('analyzing')
    }

    const StartAnalysis = (linkedPlantId?: number) => {
        if (!scanData?.imageUri) {
            console.error("No image to analyze");
            return;
        }
        (async () => {
            try {
                let data;
                console.log("id : ", linkedPlantId)
                if (linkedPlantId) {
                    data = await scanService.predictAndSaveScan({
                        image: scanData.imageUri,
                        plantId: linkedPlantId,
                        // locationLat: scanData.location?.lat,
                        // locationLng: scanData.location?.lng,
                    });
                } else {
                    data = await scanService.predictDisease({
                        image: scanData.imageUri,
                    });
                }
                console.log("Prediction result:", data);
                setScanData(prev => prev ? { ...prev, scanResult: data as any } : prev)
                setCurrentFlow('result')
            } catch (error) {
                console.error("Error during analysis:", error);
                setCurrentFlow('options')
                // TODO : handle error (e.g., show error message to user)
            } finally {
                setCurrentFlow('result')
            }
        })();
    }

    const handleRetakePhoto = () => {
        setScanData(null)
        setCurrentFlow('camera')
    }

    const handleClosePreview = () => {
        setScanData(null)
        setCurrentFlow('scanner')
    }

    const handleCloseCamera = () => {
        setCurrentFlow('scanner')
    }

    const handleBackToScanner = () => {
        setScanData(null)
        setCurrentFlow('scanner')
    }

    const handleBackToOptions = () => {
        setCurrentFlow('options')
    }

    const handleBackToLinking = () => {
        setCurrentFlow('linking')
    }

    const handleNewScan = () => {
        setScanData(null)
        setCurrentFlow('scanner')
    }

    if (currentFlow === 'analyzing') {
        return <LoadingSpinner message="Analyzing your plant with AI..." size="large" />
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            {currentFlow === 'scanner' && (
                <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                        <View style={{
                            width: 96,
                            height: 96,
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: 48,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16
                        }}>
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={{ width: 72, height: 72 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                            Plant Disease Scanner
                        </Text>
                        <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 }}>
                            Take a photo of your plant to detect diseases and get treatment recommendations
                        </Text>
                    </View>

                    {/* Camera Options */}
                    <View style={{ alignItems: 'center', marginBottom: 32 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                            <CameraButton onPress={() => setCurrentFlow('camera')} size="lg" variant="camera" disabled={isLoading} />
                            <CameraButton onPress={handleGalleryPress} size="md" variant="gallery" disabled={isLoading} />
                        </View>

                        <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 8 }}>
                            Tap camera to take photo or gallery to choose existing image
                        </Text>

                        {isLoading && <Text style={{ fontSize: 14, color: '#10B981', fontWeight: '500' }}>Opening camera...</Text>}
                    </View>

                    {/* Instructions */}
                    <View style={{ backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, marginBottom: 24 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 }}>📸 Photography Tips:</Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 24 }}>
                            • Use natural daylight for best results{"\n"}• Focus on affected leaves or plant parts{"\n"}• Keep the plant
                            centered in frame{"\n"}• Avoid shadows and reflections{"\n"}• Hold camera steady for sharp images
                        </Text>
                    </View>

                    {/* Supported Plants */}
                    <View style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 32
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 }}>🌱 Supported Plants:</Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 24 }}>
                            Tomatoes • Potatoes • Peppers • Corn • Wheat • Rice • Soybeans • Cotton • Grapes • Apples • And many more...
                        </Text>
                    </View>
                </ScrollView>
            )}

            {/* Camera Modal */}
            <Modal visible={currentFlow === 'camera'} animationType="slide" presentationStyle="fullScreen">

                <CameraScreen onClose={handleCloseCamera} onPhotoTaken={handlePhotoTaken} />
            </Modal>

            {/* Photo Preview Modal */}
            <Modal visible={currentFlow === 'preview'} animationType="slide" presentationStyle="fullScreen">
                {scanData && (
                    <PhotoPreview
                        uri={scanData.imageUri}
                        onRetake={handleRetakePhoto}
                        onConfirm={handleAnalyzePhoto}
                        onClose={handleClosePreview}
                    />
                )}
            </Modal>

            {/* Analysis Options Modal */}
            <Modal visible={currentFlow === 'options'} animationType="slide" presentationStyle="fullScreen">
                {scanData && (
                    <AnalysisOptionsScreen
                        imageUri={scanData.imageUri}
                        onBack={handleBackToScanner}
                        onQuickAnalysis={handleQuickAnalysis}
                        onLinkToExistingPlant={handleLinkToExistingPlant}
                        onAddNewPlant={handleAddNewPlant}
                    />
                )}
            </Modal>

            {/* Link to Plant Modal */}
            <Modal visible={currentFlow === 'linking'} animationType="slide" presentationStyle="fullScreen">
                {scanData && (
                    <LinkToPlantScreen
                        imageUri={scanData.imageUri}
                        onStartAnalysis={handleStartAnalysis}
                        onBack={handleBackToOptions}
                    />
                )}
            </Modal>
            {/* Add new  Plant Modal */}
            <Modal visible={currentFlow === 'addPlant'} animationType="slide" presentationStyle="fullScreen">
                {scanData && (
                    <AddPlantForm
                        defaultImage={scanData.imageUri}
                        onSuccess={handleLinkToExistingPlant}
                        onBack={handleBackToOptions}
                    />
                )}
            </Modal>
            {/* Scan Result Modal */}
            <Modal visible={currentFlow === 'result'} animationType="slide" presentationStyle="fullScreen">
                {scanData?.scanResult && (
                    <ScanResultScreen
                        scanData={scanData}
                        onNewScan={handleNewScan}
                        onBack={handleBackToOptions}
                    />
                )}
            </Modal>
        </SafeAreaView>
    )
}