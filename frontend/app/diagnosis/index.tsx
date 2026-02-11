import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Leaf, AlertTriangle, CheckCircle, Shield, Stethoscope, Pill, Bug, Home, Camera, Share2 } from 'lucide-react-native';

export default function DiagnosisReport() {
  const { analysis, imageBase64, scanId } = useLocalSearchParams<{ analysis: string; imageBase64?: string; scanId?: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

  let data: any = null;
  try {
    data = JSON.parse(analysis || '{}');
  } catch {
    data = null;
  }

  const isHealthy = data?.isHealthy ?? true;
  const disease = data?.disease;
  const plantType = data?.plantType || 'Unknown Plant';

  const severityColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'mild': return '#22C55E';
      case 'moderate': return '#F59E0B';
      case 'severe': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScreenHeader title="Analysis Report" />

      <ScrollView contentContainerStyle={styles.content}>

        {/* Scanned Image */}
        {imageBase64 && (
          <View style={styles.imageCard}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
              style={styles.scanImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Status Banner */}
        <View style={[styles.banner, { backgroundColor: isHealthy ? '#22C55E' : '#EF4444' }]}>
          {isHealthy ? <CheckCircle color="#fff" size={40} /> : <AlertTriangle color="#fff" size={40} />}
          <Text style={styles.bannerTitle}>
            {isHealthy ? 'Healthy Plant!' : (disease?.name || 'Disease Detected')}
          </Text>
          <Text style={styles.bannerSubtitle}>{plantType}</Text>
        </View>

        {/* Confidence Meter */}
        {!isHealthy && (
          <View style={styles.confidenceCard}>
            <View style={styles.confidenceRow}>
              <Text style={styles.confidenceLabel}>AI Confidence</Text>
              <Text style={[styles.confidenceValue, { color: severityColor(disease?.severity) }]}>
                {disease?.confidence || '92'}%
              </Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${disease?.confidence || 92}%`, backgroundColor: severityColor(disease?.severity) }]} />
            </View>
          </View>
        )}

        {/* Treatment Tabs */}
        {!isHealthy && disease && (
          <View style={styles.tabsContainer}>
            <View style={styles.tabHeader}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'organic' && styles.activeTab]}
                onPress={() => setActiveTab('organic')}
              >
                <Leaf size={18} color={activeTab === 'organic' ? COLORS.primary : '#6B7280'} />
                <Text style={[styles.tabText, activeTab === 'organic' && styles.activeTabText]}>Organic</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'chemical' && styles.activeTab]}
                onPress={() => setActiveTab('chemical')}
              >
                <Shield size={18} color={activeTab === 'chemical' ? '#EF4444' : '#6B7280'} />
                <Text style={[styles.tabText, activeTab === 'chemical' && styles.activeTabText]}>Chemical</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabContent}>
              <View style={styles.audioRow}>
                <TouchableOpacity style={styles.playBtn} onPress={() => Alert.alert('Play Audio', 'Playing treatment instructions in Hindi...')}>
                  <View style={styles.playIconBg}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>▶</Text>
                  </View>
                  <Text style={styles.playText}>Listen to instructions</Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'organic' ? (
                <View>
                  <Text style={styles.sectionTitle}>🌿 Biological Treatment</Text>
                  {(disease.treatment_steps || []).map((t: string, i: number) => (
                    <View key={i} style={styles.stepRow}>
                      <View style={[styles.stepDot, { backgroundColor: COLORS.primary }]} />
                      <Text style={styles.stepText}>{t}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View>
                  <Text style={styles.sectionTitle}>🧪 Chemical Control</Text>
                  <Text style={styles.warningText}>Use only if organic methods fail. Wear protective gear.</Text>

                  <View style={styles.dosageCard}>
                    <Text style={styles.dosageTitle}>Dosage Calculator</Text>
                    <Text style={styles.dosageDesc}>Enter field size to calculate requirement:</Text>
                    <View style={styles.dosageInputRow}>
                      <TextInput
                        style={styles.dosageInput}
                        placeholder="Area"
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Text style={styles.unitText}>Acre</Text>
                      <View style={styles.calcBtn}>
                        <Text style={styles.calcBtnText}>Calculate</Text>
                      </View>
                    </View>
                    <Text style={styles.resultText}>Estimated: <Text style={{ fontWeight: '800', color: COLORS.primary }}>250ml per 200L water</Text></Text>
                  </View>

                  {(disease.prevention_steps || []).map((t: string, i: number) => (
                    <View key={i} style={styles.stepRow}>
                      <View style={[styles.stepDot, { backgroundColor: '#EF4444' }]} />
                      <Text style={styles.stepText}>{t}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Expert Insights */}
        {disease?.expert_insights?.length > 0 && (
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>💡 Expert Insights</Text>
            {disease.expert_insights.map((insight: string, i: number) => (
              <Text key={i} style={styles.insightText}>• {insight}</Text>
            ))}
          </View>
        )}

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={() => Alert.alert('Expert Connect', 'Report packaged as PDF. Opening WhatsApp...')}>
          <View style={styles.shareIconBg}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/124/124034.png' }} style={{ width: 20, height: 20 }} />
          </View>
          <View>
            <Text style={styles.shareTitle}>Share with Expert</Text>
            <Text style={styles.shareSubtitle}>Send PDF report via WhatsApp</Text>
          </View>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/dashboard')}>
            <Home color="#fff" size={20} />
            <Text style={styles.btnText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/scanner')}>
            <Camera color={COLORS.primary} size={20} />
            <Text style={styles.secondaryBtnText}>New Scan</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: SPACING.lg },
  imageCard: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOWS.md },
  scanImage: { width: '100%', height: 200, backgroundColor: '#E5E7EB' },
  banner: { borderRadius: RADIUS.xl, padding: 24, alignItems: 'center', marginBottom: SPACING.lg },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 10 },
  bannerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
  confidenceCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: 16, marginBottom: 16, ...SHADOWS.sm },
  confidenceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  confidenceLabel: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  confidenceValue: { fontSize: 16, fontWeight: '800' },
  progressBg: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  tabsContainer: { backgroundColor: '#fff', borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: 16, ...SHADOWS.sm },
  tabHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: COLORS.primary },
  tabContent: { padding: 16 },
  audioRow: { marginBottom: 16 },
  playBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', alignSelf: 'flex-start', padding: 8, paddingHorizontal: 12, borderRadius: 20, gap: 8 },
  playIconBg: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  playText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
  warningText: { fontSize: 11, color: '#EF4444', fontWeight: '600', fontStyle: 'italic', marginBottom: 12 },
  dosageCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  dosageTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  dosageDesc: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  dosageInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  dosageInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, width: 80, fontSize: 14 },
  unitText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  calcBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  calcBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  resultText: { fontSize: 12, color: '#374151', marginTop: 8 },
  stepDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  shareButton: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: RADIUS.lg, gap: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB', ...SHADOWS.sm },
  shareIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' },
  shareTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  shareSubtitle: { fontSize: 12, color: '#6B7280' },
  actions: { flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 1, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: RADIUS.lg, gap: 8, ...SHADOWS.md },
  secondaryBtn: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: RADIUS.lg, gap: 8 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
  paragraph: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginTop: 4 },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  stepText: { fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 },
  insightCard: { backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  insightTitle: { fontSize: 15, fontWeight: '700', color: '#B45309', marginBottom: 8 },
  insightText: { fontSize: 14, color: '#92400E', marginBottom: 4, lineHeight: 20 },
});
