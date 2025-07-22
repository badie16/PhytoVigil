import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Helper function to convert Base64 to a Blob for web uploads
const base64ToBlob = (base64: string, contentType: string = 'image/jpeg') => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
};
/**
 * Appends an image from a Base64 URI to FormData, handling platform differences.
 * @param formData The FormData object to append to.
 * @param base64Uri The Base64 data URI of the image.
 * @param fileName The desired filename for the upload.
 */
export async function appendImageToFormData(
    formData: FormData,
    base64Uri: string,
    fileName: string
): Promise<void> {
    const base64Data = base64Uri.split(',')[1];

    if (Platform.OS === 'web') {
        // WEB: Convert Base64 to Blob and append.
        const imageBlob = base64ToBlob(base64Data);
        formData.append('file', imageBlob, fileName);
    } else {
        // NATIVE (iOS/Android): Save to a temporary file and append its path.
        const tempFileUri = FileSystem.cacheDirectory + fileName;
        await FileSystem.writeAsStringAsync(tempFileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
        });
        formData.append("file", {
            uri: tempFileUri,
            name: fileName,
            type: "image/jpeg",
        } as any);
    }
}