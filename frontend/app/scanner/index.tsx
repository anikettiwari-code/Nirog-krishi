import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScanFrame } from '../../components/scanner/ScanFrame';
import { CameraControls } from '../../components/scanner/CameraControls';

function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleCapture = () => {
    setIsScanning(true);
    // Simulate processing
    setTimeout(() => {
      setIsScanning(false);
      router.push('/diagnosis');
    }, 2000);
  };

  if (!permission || !permission.granted) {
    return <View style={styles.container} />; // Handle permission properly in UI if needed
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={flash}
      >
        <View style={styles.overlayInner}>
          <CameraControls
            onBack={() => router.back()}
            onFlashToggle={() => setFlash(!flash)}
            flash={flash}
            isScanning={isScanning}
            onCapture={handleCapture}
          />
          <View style={styles.frameWrapper}>
            <ScanFrame isScanning={isScanning} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

export default ScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  overlayInner: {
    flex: 1,
    justifyContent: 'center',
  },
  frameWrapper: {
    position: 'absolute',
    alignSelf: 'center',
  }
});
