import { API_CONFIG } from '../constants/config';
import * as Location from 'expo-location';

export interface WeatherData {
    temp_c: number;
    condition: {
        text: string;
        icon: string;
        code: number;
    };
    humidity: number;
    location: {
        name: string;
        region: string;
    };
}

export const WeatherService = {
    getWeather: async (): Promise<WeatherData | null> => {
        try {
            // Get Location
            let { status } = await Location.requestForegroundPermissionsAsync();
            let query = 'Pune'; // Default

            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                query = `${location.coords.latitude},${location.coords.longitude}`;
            }

            // Fetch Weather
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${API_CONFIG.WEATHER_API_KEY}&q=${query}&aqi=no`
            );

            if (!response.ok) throw new Error('Weather API Failed');

            const data = await response.json();

            return {
                temp_c: data.current.temp_c,
                condition: data.current.condition,
                humidity: data.current.humidity,
                location: {
                    name: data.location.name,
                    region: data.location.region
                }
            };
        } catch (error) {
            console.error('[WeatherService] Error:', error);
            // Default Fallback
            return {
                temp_c: 28,
                condition: { text: 'Sunny', icon: '', code: 1000 },
                humidity: 65,
                location: { name: 'Pune', region: 'Maharashtra' }
            };
        }
    }
};
