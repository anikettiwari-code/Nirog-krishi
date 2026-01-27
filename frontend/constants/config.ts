import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
    GEMINI_API_KEY: 'AIzaSyBrj_UiI2AkY8DQLz9vlSl6mZoHDyQ1kDw',
    GEMINI_MODEL: 'gemini-2.5-flash',
    MONGODB_URI: 'mongodb+srv://mauryapankajchandrabali_db_user:wA5BYyLlK3G9VncB@cluster0.uheiaow.mongodb.net/nirogkrishi?retryWrites=true&w=majority',
    // Single Server URL
    API_BASE_URL: Platform.OS === 'web' ? '/api' : 'http://localhost:8081/api'
};
