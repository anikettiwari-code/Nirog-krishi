import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
    // Backend API (Supabase + Node.js)
    API_BASE_URL: Platform.OS === 'web' ? 'http://localhost:5000' : 'http://192.168.0.102:5000',

    // External APIs
    WEATHER_API_KEY: '315b6495afa54175b6d84401262801',
    MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoicGFua2FqMDciLCJhIjoiY21reHJ2aWJ5MDIyajNjc2R4NmZ0Nm9qdyJ9.jByCUQcUGdwtGzgUbcMa-w',
    GEMINI_API_KEY: 'AIzaSyDyyTQA6CuxR6SMzsqrV0d1M__6-ayz_28',
};
