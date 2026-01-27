// import { GoogleGenAI } from '@google/genai'; // client side removed
import { API_CONFIG } from '../constants/config';
import { AuthService } from './AuthService';

export const AIService = {

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
