import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Leaf, AlertTriangle, CheckCircle, Shield, Stethoscope, Pill, Bug, Home, Camera } from 'lucide-react-native';

export default function DiagnosisReport() {
  const { analysis, imageBase64, scanId } = useLocalSearchParams<{ analysis: string; imageBase64?: string; scanId?: string }>();
  const router = useRouter();

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
          <Text style={styles.bannerTitle}>{isHealthy ? 'Healthy Plant!' : 'Disease Detected'}</Text>
          <Text style={styles.bannerSubtitle}>{plantType}</Text>
        </View>

        {/* Disease Details */}
        {disease && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Bug color="#EF4444" size={24} />
              <Text style={styles.cardTitle}>{disease.name}</Text>
            </View>

            <View style={[styles.badge, { backgroundColor: severityColor(disease.severity) + '20' }]}>
              <Text style={[styles.badgeText, { color: severityColor(disease.severity) }]}>
                {disease.severity} Severity {disease.confidence ? `(${disease.confidence}%)` : ''}
              </Text>
            </View>

            {disease.reasoning && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🤔 Why this diagnosis?</Text>
                <Text style={styles.paragraph}>{disease.reasoning}</Text>
              </View>
            )}

            {disease.symptoms?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><Stethoscope size={16} color={COLORS.primary} /> Symptoms</Text>
                {disease.symptoms.map((s: string, i: number) => <Text key={i} style={styles.bullet}>• {s}</Text>)}
              </View>
            )}

            {(disease.treatment_steps?.length > 0 || disease.treatment?.length > 0) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><Pill size={16} color="#22C55E" /> Treatment Steps</Text>
                {(disease.treatment_steps || disease.treatment).map((t: string, i: number) => (
                  <View key={i} style={styles.stepRow}>
                    <Text style={styles.stepNum}>{i + 1}.</Text>
                    <Text style={styles.stepText}>{t}</Text>
                  </View>
                ))}
              </View>
            )}

            {(disease.prevention_steps?.length > 0 || disease.prevention?.length > 0) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><Shield size={16} color="#8B5CF6" /> Prevention</Text>
                {(disease.prevention_steps || disease.prevention).map((p: string, i: number) => <Text key={i} style={styles.bullet}>• {p}</Text>)}
              </View>
            )}

            {disease.expert_insights?.length > 0 && (
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>💡 Expert Insights</Text>
                {disease.expert_insights.map((insight: string, i: number) => (
                  <Text key={i} style={styles.insightText}>• {insight}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Summary */}
        {data?.summary && (
          <View style={styles.summaryCard}>
            <Leaf color={COLORS.primary} size={20} />
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* No data fallback */}
        {!data && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No analysis data</Text>
            <Text style={styles.bullet}>Please scan a plant image first.</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/dashboard')}>
            <Home color="#fff" size={20} />
            <Text style={styles.btnText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/scanner')}>
            <Camera color={COLORS.primary} size={20} />
            <Text style={styles.secondaryBtnText}>Scan Again</Text>
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
  imageCard: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.md, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  scanImage: { width: '100%', height: 200, backgroundColor: '#E5E7EB' },
  banner: { borderRadius: RADIUS.xl, padding: 24, alignItems: 'center', marginBottom: SPACING.lg },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 10 },
  bannerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start', marginBottom: 12 },
  badgeText: { fontSize: 13, fontWeight: '600' },
  section: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 6 },
  bullet: { fontSize: 14, color: '#4B5563', marginVertical: 2, lineHeight: 20 },
  summaryCard: { flexDirection: 'row', backgroundColor: '#ECFDF5', borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', gap: 10, marginBottom: SPACING.lg },
  summaryText: { flex: 1, fontSize: 14, color: '#065F46', lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 12, marginTop: SPACING.md },
  primaryBtn: { flex: 1, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: RADIUS.lg, gap: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryBtn: { flex: 1, borderWidth: 2, borderColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: RADIUS.lg, gap: 8 },
  secondaryBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  paragraph: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginTop: 4 },
  stepRow: { flexDirection: 'row', gap: 8, marginTop: 6, alignItems: 'flex-start' },
  stepNum: { fontSize: 14, fontWeight: '700', color: COLORS.primary, width: 20 },
  stepText: { fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 },
  insightCard: { backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, marginTop: 16, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  insightTitle: { fontSize: 15, fontWeight: '700', color: '#B45309', marginBottom: 8 },
  insightText: { fontSize: 14, color: '#92400E', marginBottom: 4, lineHeight: 20 },
});
