import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Zap, ZapOff, Camera as CameraIcon, Image as ImageIcon, X, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AIService } from '../../services/AIService';
import { GeminiService } from '../../services/GeminiService';
import { StorageService } from '../../services/StorageService';

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState(false);
  const [status, setStatus] = useState('Ready to scan');
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    setStatus('Capturing...');
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
        // Read as base64
        if (Platform.OS !== 'web') {
          const base64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: 'base64' });
          setPhotoBase64(base64);
        }
        setStatus('Photo captured! Tap Analyze.');
      }
    } catch (error: any) {
      setStatus('Capture failed');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setCapturedPhoto(result.assets[0].uri);
        // Read as base64
        if (Platform.OS !== 'web') {
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
          setPhotoBase64(base64);
        }
        setStatus('Image selected! Tap Analyze.');
      }
    } catch (error: any) {
      setStatus('Gallery error');
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setPhotoBase64(null);
    setStatus('Ready to scan');
  };

  const handleAnalyze = async () => {
    if (!capturedPhoto) return;
    setIsProcessing(true);
    setStatus('Analyzing with AI...');

    try {
      // Get base64 image
      let base64Image: string;
      if (Platform.OS === 'web') {
        const response = await fetch(capturedPhoto);
        const blob = await response.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(blob);
        });
      } else {
        base64Image = photoBase64 || await FileSystem.readAsStringAsync(capturedPhoto, { encoding: 'base64' });
      }

      // Analyze with AI (Server API)
      const { analysis } = await GeminiService.analyzeImage(capturedPhoto); // Pass URI directly, Service handles conversion

      // Save to history WITH IMAGE
      const savedScan = await StorageService.saveScan({
        plantType: analysis?.plantType,
        diseaseName: analysis?.disease?.name,
        severity: analysis?.disease?.severity,
        isHealthy: analysis?.isHealthy,
        analysisResult: JSON.stringify(analysis),
        imageBase64: base64Image,
        imageMimeType: 'image/jpeg',
      });

      setStatus('Analysis complete!');

      // Navigate to diagnosis with scan ID
      router.push({
        pathname: '/diagnosis',
        params: {
          scanId: savedScan?.id,
          analysis: JSON.stringify(analysis),
          imageBase64: base64Image,
        }
      });

    } catch (error: any) {
      console.error('Analysis error:', error);
      setStatus('Error: ' + error.message);
      Alert.alert('Analysis Failed', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return <View style={styles.container}><Text style={styles.statusText}>Loading...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission needed</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryButton} onPress={handlePickImage}>
          <ImageIcon color="#fff" size={24} />
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Photo Preview
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
        <View style={styles.statusBar}><Text style={styles.statusText}>{status}</Text></View>
        <View style={styles.previewControls}>
          {isProcessing ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#22C55E" />
              <Text style={styles.loadingText}>Analyzing...</Text>
            </View>
          ) : (
            <View style={styles.previewButtons}>
              <TouchableOpacity onPress={handleRetake} style={styles.retakeButton}>
                <X color="#fff" size={28} />
                <Text style={styles.btnLabel}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAnalyze} style={styles.analyzeButton}>
                <Check color="#fff" size={28} />
                <Text style={styles.btnLabel}>Analyze</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Camera View
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraView ref={cameraRef} style={styles.camera} facing="back" enableTorch={flash} />
      <View style={styles.statusBar}><Text style={styles.statusText}>{status}</Text></View>

      <View style={styles.topControls}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFlash(!flash)} style={styles.iconBtn}>
          {flash ? <Zap color="#FFD700" size={24} /> : <ZapOff color="#fff" size={24} />}
        </TouchableOpacity>
      </View>

      <View style={styles.frameContainer} pointerEvents="none">
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>
        <Text style={styles.frameText}>Position leaf in frame</Text>
      </View>

      <View style={styles.bottomControls}>
        <TouchableOpacity onPress={handlePickImage} style={styles.secondaryBtn}>
          <ImageIcon color="#fff" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCapture} style={styles.captureBtn}>
          <CameraIcon color="#fff" size={32} />
        </TouchableOpacity>
        <View style={{ width: 50 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { ...StyleSheet.absoluteFillObject },
  previewImage: { ...StyleSheet.absoluteFillObject, resizeMode: 'contain' },
  statusBar: { position: 'absolute', top: 100, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 8, alignItems: 'center', zIndex: 20 },
  statusText: { color: '#00FF00', fontSize: 14, fontWeight: 'bold' },
  topControls: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, zIndex: 10 },
  iconBtn: { padding: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 25 },
  frameContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#00FF00', borderWidth: 4 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 12 },
  frameText: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 20 },
  bottomControls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, zIndex: 10 },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff', marginHorizontal: 30 },
  secondaryBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  previewControls: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center', zIndex: 10 },
  previewButtons: { flexDirection: 'row', gap: 40 },
  retakeButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  analyzeButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  btnLabel: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  loadingBox: { alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 10, fontSize: 16 },
  permissionContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 40, gap: 20 },
  permissionText: { color: '#fff', fontSize: 18 },
  permissionButton: { backgroundColor: '#22C55E', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10 },
  galleryButton: { backgroundColor: '#333', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
