import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard/index" />
        <Stack.Screen name="scanner/index" />
        <Stack.Screen name="diagnosis/index" />
        <Stack.Screen name="market/index" />
        <Stack.Screen name="history/index" />
        <Stack.Screen name="community/index" />
        <Stack.Screen name="assistant/index" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="notifications/index" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
