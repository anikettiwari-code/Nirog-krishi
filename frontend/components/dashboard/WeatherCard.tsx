import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CloudRain, Droplets, MapPin, AlertTriangle } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

export const WeatherCard = () => {
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
          <Text style={styles.temperature}>28°C</Text>
          <View style={styles.weatherStats}>
            <View style={styles.statItem}>
              <Droplets color={COLORS.white} size={16} />
              <Text style={styles.statText}>Humidity{'\n'}85%</Text>
            </View>
            <View style={styles.statItem}>
              <MapPin color={COLORS.white} size={16} />
              <Text style={styles.statText}>Location{'\n'}Pune, MH</Text>
            </View>
          </View>
        </View>
        <CloudRain color={COLORS.white} size={64} style={{ opacity: 0.9 }} />
      </View>

      <View style={styles.alertBanner}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
            <AlertTriangle color={COLORS.white} size={18} fill={COLORS.white} />
            <Text style={styles.alertTitle}>High Fungal Risk Today</Text>
        </View>
        <Text style={styles.alertDesc}>High humidity detected. Check crops for early blight symptoms.</Text>
      </View>
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
