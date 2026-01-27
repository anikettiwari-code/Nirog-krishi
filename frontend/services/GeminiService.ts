import { Platform } from 'react-native';
import { API_CONFIG } from '../constants/config';
import { AuthService } from './AuthService';

export const GeminiService = {
    analyzeImage: async (imageUri: string) => {
        try {
            const formData = new FormData();

            // Determine file type and name
            const filename = imageUri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            if (Platform.OS === 'web') {
                // Web: Fetch the URI to get a Blob, then append
                const response = await fetch(imageUri);
                const blob = await response.blob();
                formData.append('image', blob, filename);
            } else {
                // Native: Use the { uri, name, type } object signature
                // @ts-ignore: React Native FormData signature difference
                formData.append('image', { uri: imageUri, name: filename, type });
            }

            // Add User ID if available
            const user = await AuthService.getCurrentUser();
            if (user?.userId) {
                formData.append('userId', user.userId);
            }

            console.log(`[GeminiService] Sending image to ${API_CONFIG.API_BASE_URL}/analyze`);

            const response = await fetch(`${API_CONFIG.API_BASE_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // 'Content-Type': 'multipart/form-data', // Let browser/fetch set boundary
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server Error: ${response.status}`);
            }

            const data = await response.json();
            // Return full structure to match previous AIService signature
            return {
                result: data.result,
                analysis: data.analysis,
                scanId: data.scanId
            };

        } catch (error) {
            console.error('[GeminiService] Error:', error);
            throw error;
        }
    }
};
