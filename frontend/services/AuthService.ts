import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

export interface User {
    userId: string;
    username: string; // same as userId
    password: string;
    displayName: string;
    createdAt: string;
    lastLogin: string;
    profileImage?: string;
    phone?: string;
    location?: string;
}

const STORAGE_KEYS = {
    // USERS_DB: 'users_db', // Deprecated: Moved to MongoDB
    CURRENT_USER: 'current_user',
};

// Use Shared API Config
const API_URL = API_CONFIG.API_BASE_URL;

export const AuthService = {

    // Generate unique user ID: name-based + random 4-digit number
    generateUserId: (name: string): string => {
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        return `${cleanName}_${randomNum}`;
    },

    // Register new user (Calls MongoDB Backend via Single Server API)
    register: async (displayName: string, password: string): Promise<User> => {
        try {
            // Validate
            if (!displayName || displayName.length < 2) {
                throw new Error('Name must be at least 2 characters');
            }
            if (!password || password.length < 4) {
                throw new Error('Password must be at least 4 characters');
            }

            // Generate unique ID
            const userId = AuthService.generateUserId(displayName);

            // CALL API
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, name: displayName, password })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Registration failed');
            }

            const backendUser = await response.json();

            const newUser: User = {
                userId: backendUser.userId,
                username: backendUser.userId,
                password: password, // Store locally for session logic
                displayName: backendUser.name,
                createdAt: backendUser.createdAt,
                lastLogin: new Date().toISOString()
            };

            // Set as current user (auto-login)
            await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

            console.log('[Auth] User registered via API:', newUser.userId);
            return newUser;

        } catch (error: any) {
            console.error('[Auth] Register error:', error.message);
            throw error;
        }
    },

    // Login (Calls MongoDB Backend via Single Server API)
    login: async (usernameOrId: string, password: string): Promise<User> => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: usernameOrId, password })
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const backendUser = await response.json();

            const user: User = {
                userId: backendUser.userId,
                username: backendUser.userId,
                password: backendUser.password,
                displayName: backendUser.name,
                createdAt: backendUser.createdAt,
                lastLogin: new Date().toISOString()
            };

            // Set as current user
            await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

            console.log('[Auth] User logged in via API:', user.userId);
            return user;

        } catch (error: any) {
            console.error('[Auth] Login error:', error.message);
            throw error;
        }
    },

    // Logout (Clear local session)
    logout: async (): Promise<void> => {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        console.log('[Auth] User logged out');
    },

    // Get current logged in user (Local Session)
    getCurrentUser: async (): Promise<User | null> => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    // Check if logged in
    isLoggedIn: async (): Promise<boolean> => {
        const user = await AuthService.getCurrentUser();
        return user !== null;
    },

    // Clear local data
    clearAllData: async (): Promise<void> => {
        await AsyncStorage.clear();
    },

    // --- Legacy / Unimplemented Methods for MongoDB Version ---

    updateProfile: async (updates: Partial<User>): Promise<User> => {
        // TODO: Implement /auth/update endpoint in backend
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) throw new Error('Not logged in');

        const updated = { ...currentUser, ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
        return updated;
    },

    getAllUsers: async (): Promise<User[]> => {
        return []; // Not supported via client API for security
    },

    changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
        // TODO: Implement backend password change
        throw new Error('Change password not supported in this version');
    }
};
