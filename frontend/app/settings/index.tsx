import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Globe, Bell, HelpCircle, FileText, Shield, LogOut } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ProfileCard } from '../../components/settings/ProfileCard';
import { SettingToggle } from '../../components/settings/SettingToggle';
import { SettingMenuItem } from '../../components/settings/SettingMenuItem';
import { BottomBar } from '../../components/navigation/BottomBar';
import { AuthService, User } from '../../services/AuthService';

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState('en');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [outbreakEnabled, setOutbreakEnabled] = useState(true);
  const [priceEnabled, setPriceEnabled] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  const loadUser = async () => {
    const currentUser = await AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.replace('/');
    }
  };

  const handleLogout = async () => {
    try {
      console.log('[Settings] Logging out...');
      await AuthService.logout();
      console.log('[Settings] Logout successful, redirecting...');
      router.replace('/');
    } catch (error) {
      console.error('[Settings] Logout error:', error);
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={COLORS.white} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings & Profile</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Card - Click to edit */}
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <ProfileCard
            name={user?.displayName || 'Loading...'}
            phone={user?.phone || '+91 98765 XXXXX'}
            location={user?.location || 'India'}
            isVerified={true}
          />
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Preferences</Text>

        {/* Preferences Card */}
        <View style={styles.card}>
          {/* Language */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconRow}>
              <Globe color={COLORS.neutral600} size={20} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingSubtitle}>Select Language</Text>
              </View>
            </View>
            <View style={styles.langToggle}>
              <TouchableOpacity
                style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langBtn, language === 'hi' && styles.langBtnActive]}
                onPress={() => setLanguage('hi')}
              >
                <Text style={[styles.langText, language === 'hi' && styles.langTextActive]}>हिंदी</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Notifications Section */}
          <SettingToggle
            title="Push Notifications"
            subtitle="Receive app notifications"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <SettingToggle
            title="Outbreak Alerts"
            subtitle="Nearby disease alerts"
            value={outbreakEnabled}
            onValueChange={setOutbreakEnabled}
            activeTrackColor={COLORS.neutral900}
          />
          <SettingToggle
            title="Price Updates"
            subtitle="Market price changes"
            value={priceEnabled}
            onValueChange={setPriceEnabled}
            activeTrackColor={COLORS.neutral900}
          />
        </View>

        <Text style={styles.sectionHeader}>Support & Help</Text>

        {/* Support Card */}
        <View style={styles.card}>
          <SettingMenuItem icon={HelpCircle} title="Help Center" showDivider />
          <SettingMenuItem icon={FileText} title="Tutorial Videos" showDivider />
          <SettingMenuItem icon={Shield} title="Privacy Policy" />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color={COLORS.white} size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomBar activePage="settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: 'Inter_700Bold',
  },
  content: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.neutral900,
    marginBottom: SPACING.md,
    fontFamily: 'Inter_700Bold',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  settingIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTextContainer: {
    marginLeft: SPACING.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.neutral900,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.neutral600,
  },
  langToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.neutral100,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
  },
  langBtnActive: {
    backgroundColor: COLORS.primary,
  },
  langText: {
    fontSize: 12,
    color: COLORS.neutral600,
  },
  langTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral100,
    marginVertical: SPACING.md,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '700',
    marginLeft: SPACING.sm,
    fontSize: 16,
  },
});
