import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CloudRain, Droplets, MapPin, AlertTriangle } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

import { WeatherService, WeatherData } from '../../services/WeatherService';
import { useEffect, useState } from 'react';
import { Image, ActivityIndicator } from 'react-native';

export const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    const data = await WeatherService.getWeather();
    setWeather(data);
    setLoading(false);
  };

  if (!weather) return null;

  return (
    <LinearGradient
      colors={['#3b82f6', '#2563eb']}
      style={styles.weatherCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.weatherMain}>
        <View>
          <Text style={styles.weatherTitle}>Current Weather</Text>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.temperature}>{weather.temp_c}°C</Text>
          )}

          <View style={styles.weatherStats}>
            <View style={styles.statItem}>
              <Droplets color={COLORS.white} size={16} />
              <Text style={styles.statText}>Humidity{'\n'}{weather.humidity}%</Text>
            </View>
            <View style={styles.statItem}>
              <MapPin color={COLORS.white} size={16} />
              <Text style={styles.statText}>Location{'\n'}{weather.location.name}, {weather.location.region.substring(0, 2).toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Weather Icon */}
        {weather.condition.icon ? (
          <Image
            source={{ uri: `https:${weather.condition.icon}` }}
            style={{ width: 64, height: 64 }}
          />
        ) : (
          <CloudRain color={COLORS.white} size={64} style={{ opacity: 0.9 }} />
        )}
      </View>

      {/* Dynamic Alert based on Humidity */}
      {weather.humidity > 80 && (
        <View style={styles.alertBanner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <AlertTriangle color={COLORS.white} size={18} fill={COLORS.white} />
            <Text style={styles.alertTitle}>High Fungal Risk Today</Text>
          </View>
          <Text style={styles.alertDesc}>Humidity is {weather.humidity}%. Check crops for early blight.</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  weatherCard: {
    borderRadius: RADIUS.xl,
    padding: 0,
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
    overflow: 'hidden',
  },
  weatherMain: {
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weatherTitle: {
    color: '#dbeafe',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  temperature: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.md,
    fontFamily: 'Inter_700Bold',
  },
  weatherStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  statText: {
    color: COLORS.white,
    marginLeft: SPACING.xs,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  alertBanner: {
    backgroundColor: '#f59e0b', // Amber-500
    padding: SPACING.md,
    margin: SPACING.md,
    marginTop: 0,
    borderRadius: RADIUS.lg,
  },
  alertTitle: {
    color: COLORS.white,
    marginLeft: SPACING.xs,
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  alertDesc: {
    color: '#fffbeb', // Amber-50
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
});
