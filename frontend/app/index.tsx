import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Leaf } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { LoginHeader } from '../components/auth/LoginHeader';
import { LoginCard } from '../components/auth/LoginCard';
import { FeaturesList } from '../components/auth/FeaturesList';

function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.primary, '#166534', '#14532d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* Decorative Icons */}
      <Leaf color={COLORS.white} size={180} style={[styles.decorativeIcon, { top: -40, left: -40, opacity: 0.1, transform: [{ rotate: '-30deg' }] }]} />
      <Leaf color={COLORS.white} size={200} style={[styles.decorativeIcon, { bottom: -50, right: -50, opacity: 0.1, transform: [{ rotate: '15deg' }] }]} />

      <View style={styles.content}>
        <LoginHeader />

        <LoginCard onLogin={handleLogin} />

        <FeaturesList />

        <View style={styles.footerContainer}>
          <Text style={styles.version}>CropGuard AI v1.0.0 - Powered by TensorFlow Lite</Text>
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeIcon: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  footerContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    alignItems: 'center',
  },
  version: {
    color: '#bbf7d0',
    opacity: 0.8,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
