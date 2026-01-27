import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { DetectionCard } from '../../components/diagnosis/DetectionCard';
import { TreatmentSection } from '../../components/diagnosis/TreatmentSection';

export default function DiagnosisReport() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScreenHeader title="Diagnosis Report" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Detection Card */}
        <DetectionCard
          diseaseName="Potato Late Blight"
          confidence={98}
          weatherConfirmed={true}
        />

        {/* Treatment Section */}
        <TreatmentSection />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  content: {
    padding: SPACING.lg,
  },
});
