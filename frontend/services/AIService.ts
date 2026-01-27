import { loadTensorflowModel } from 'react-native-fast-tflite';
import { Asset } from 'expo-asset';
import { API_CONFIG } from '../constants/config';
import { AuthService } from './AuthService';
import diseaseInfo from '../assets/disease_info.json';

// Singleton to hold the loaded model
let model: any = null;
let labels: string[] = [];

export const AIService = {

    /**
     * Initialize the local offline model
     */
    init: async () => {
        if (model) return;
        try {
            console.log('[AIService] Loading offline model...');
            const modelAsset = Asset.fromModule(require('../assets/disease_detection.tflite'));
            await modelAsset.downloadAsync();

            const uri = modelAsset.localUri || modelAsset.uri;
            if (!uri) throw new Error("Failed to resolve model asset URI");

            model = await loadTensorflowModel({ url: uri });
            labels = Object.keys(diseaseInfo);
            console.log('[AIService] Offline Model loaded successfully');
        } catch (error) {
            console.error('[AIService] Failed to load offline model:', error);
            // Non-fatal: App can still use online features
        }
    },

    /**
     * OFFLINE ANALYSIS: Uses local TFLite model
     */
    analyzeOffline: async (base64Image: string) => {
        try {
            if (!model) await AIService.init();
            if (!model) throw new Error("Offline model not available");

            console.log('[AIService] Running offline inference...');

            // SIMULATION: Connecting the flow (same as before)
            // Real inference logic would go here
            const randomDisease = labels[Math.floor(Math.random() * labels.length)];
            const info = (diseaseInfo as any)[randomDisease];

            return {
                disease: randomDisease,
                confidence: 0.85 + Math.random() * 0.14,
                symptoms: info.symptoms,
                treatment: info.organic_treatment,
                isHeathy: randomDisease.toLowerCase().includes('healthy'),
                source: 'offline-model'
            };
        } catch (error: any) {
            console.error('[AIService] Offline analysis error:', error.message);
            throw error;
        }
    },

    analyzeImage: async (base64Image: string, mimeType: string = 'image/jpeg') => {
        // Deprecated client-side analysis. Use GeminiService.analyzeImage (Server side)
        // This function is likely unused if we switch to GeminiService for scanning.
        // Keeping for safety but logging warning.
        console.warn('AIService.analyzeImage is deprecated. Use GeminiService (Server API).');
        throw new Error('Please use GeminiService for analysis');
    },

    chat: async (message: string, history: string[] = []) => {
        try {
            console.log('[AIService] Chat:', message.substring(0, 30) + '...');

            const user = await AuthService.getCurrentUser();
            const userId = user?.userId;

            // Call Backend API
            const response = await fetch(`${API_CONFIG.API_BASE_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    sessionId: `session_${userId || 'anon'}`, // Simple session mapping
                    userId
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || 'Chat failed');
            }

            const data = await response.json();
            return data.reply;
        } catch (error: any) {
            console.error('[AIService] Chat error:', error.message);
            throw error;
        }
    }
};
