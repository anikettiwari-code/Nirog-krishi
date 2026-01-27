import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../constants/theme';
import { Header } from '../../components/navigation/Header';
import { WeatherCard } from '../../components/dashboard/WeatherCard';
import { GridMenu } from '../../components/dashboard/GridMenu';
import { BottomBar } from '../../components/navigation/BottomBar';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header Section */}
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Weather Card */}
        <WeatherCard />

        {/* Grid Menu */}
        <GridMenu />

        {/* Spacer for FAB and Bottom Bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Action Button & Bottom Navigation Bar */}
      <BottomBar activePage="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  scrollContent: {
    paddingHorizontal: 24, // SPACING.lg
    paddingTop: 24,
  },
});
