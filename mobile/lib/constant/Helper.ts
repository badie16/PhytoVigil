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
    fileName: string,
    argName: string = "file"
): Promise<void> {
    if (Platform.OS === "web") {
        const base64Data = base64Uri.split(',')[1];
        const imageBlob = base64ToBlob(base64Data);
        formData.append(argName, imageBlob, fileName);
    } else {
        if (base64Uri.startsWith("data:")) {
            // ✅ Cas base64 URI
            const parts = base64Uri.split(",");
            if (parts.length !== 2) {
                throw new Error("Invalid base64 URI format");
            }
            const base64Data = parts[1];
            const tempFileUri = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(tempFileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });
            formData.append(argName, {
                uri: tempFileUri,
                name: fileName,
                type: "image/jpeg",
            } as any);

        } else if (base64Uri.startsWith("file://")) {
            // ✅ Cas chemin local (file://...) => on lit le contenu
            const base64Data = await FileSystem.readAsStringAsync(base64Uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const tempFileUri = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(tempFileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });

            formData.append(argName, {
                uri: tempFileUri,
                name: fileName,
                type: "image/jpeg",
            } as any);
        } else {
            throw new Error("Unsupported image URI format. Must be base64 or file URI.");
        }
    }
}
