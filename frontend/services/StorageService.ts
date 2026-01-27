import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from './AuthService';
import { API_CONFIG } from '../constants/config';

// ==================== TYPES ====================
export interface ScanRecord {
    id: string;
    userId: string;
    plantType?: string;
    diseaseName?: string;
    severity?: string;
    isHealthy?: boolean;
    analysisResult: string;
    imageBase64: string;
    imageMimeType: string;
    createdAt: string;
}

export interface ChatMessage {
    id: string;
    userId: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// ==================== STORAGE SERVICE (CLOUD SYNCED) ====================
export const StorageService = {

    // ============ SCAN HISTORY ============

    // Save scan: Now handled by API calls in Scanner/GeminiService. 
    // This method is kept for compatibility but does nothing persistent locally.
    saveScan: async (data: any): Promise<ScanRecord | null> => {
        // The ScannerScreen already called the API to save.
        // We just return a mock object to satisfy UI flow if needed.
        return {
            id: 'temp_id', // ID comes from API list on reload
            userId: (await AuthService.getCurrentUser())?.userId || '',
            ...data,
            createdAt: new Date().toISOString()
        };
    },

    // Get scans from Cloud API
    getScanHistory: async (): Promise<ScanRecord[]> => {
        try {
            const user = await AuthService.getCurrentUser();
            if (!user?.userId) return [];

            const response = await fetch(`${API_CONFIG.API_BASE_URL}/analyze?userId=${user.userId}`);
            if (!response.ok) return [];

            const scans = await response.json();

            // Map MongoDB documents to UI ScanRecord format
            return scans.map((s: any) => ({
                id: s._id,
                userId: s.userId,
                plantType: s.plantType,
                diseaseName: s.diseaseName,
                severity: s.severity,
                isHealthy: s.isHealthy,
                analysisResult: s.analysisResult, // Or parse if needed
                imageBase64: s.imageBase64 || '', // Now retrieved from cloud
                imageMimeType: s.mimeType,
                createdAt: s.createdAt
            }));
        } catch (error) {
            console.error('[Storage] Get history error:', error);
            return [];
        }
    },

    getUserStats: async (): Promise<{ total: number; healthy: number; diseased: number }> => {
        const scans = await StorageService.getScanHistory();
        return {
            total: scans.length,
            healthy: scans.filter(s => s.isHealthy).length,
            diseased: scans.filter(s => !s.isHealthy && s.diseaseName).length,
        };
    },

    // ============ CHAT HISTORY ============

    // Save chat: Handled by API POST interaction. No local save needed.
    saveChatMessage: async (role: 'user' | 'assistant', content: string): Promise<void> => {
        // No-op. API saves it.
    },

    // Get chats from Cloud API
    getChatHistory: async (): Promise<ChatMessage[]> => {
        try {
            const user = await AuthService.getCurrentUser();
            if (!user?.userId) return [];

            const response = await fetch(`${API_CONFIG.API_BASE_URL}/chat?userId=${user.userId}`);
            if (!response.ok) return [];

            const chats = await response.json();

            return chats.map((c: any) => ({
                id: c._id,
                userId: c.userId,
                role: c.role,
                content: c.content,
                timestamp: c.createdAt
            }));
        } catch (error) {
            console.error('[Storage] Get chat error:', error);
            return [];
        }
    },

    // Clear history: Not supported via API yet (User didn't ask), but implementing clear local cache?
    // User asked for "Data management". Deleting from DB requires DELETE endpoint.
    // For now, these functions do nothing or could call DELETE API if we implement it.
    clearScanHistory: async (): Promise<void> => {
        // TODO: Implement DELETE /api/analyze?userId=...
        console.log('Clearing cloud history not implemented yet');
    },

    clearChatHistory: async (): Promise<void> => {
        // TODO: Implement DELETE /api/chat?userId=...
    },

    // Helpers
    getScan: async (id: string) => null, // Unused
    getAllScans: async () => [],
    getAllChats: async () => [],
};

