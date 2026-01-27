import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertTriangle, MapPin, TrendingUp, Bell, CheckCircle } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { NotificationTabs } from '../../components/notifications/NotificationTabs';

// Mock Data
const NOTIFICATIONS = [
  {
    id: '1',
    type: 'alert',
    title: 'High Fungal Risk Alert',
    message: 'Current weather conditions (85% humidity, 28°C) are favorable for fungal diseases. Check your crops regularly.',
    time: '2 hours ago',
    unread: true,
    icon: AlertTriangle,
    color: COLORS.danger,
    bgColor: '#fef2f2',
  },
  {
    id: '2',
    type: 'outbreak',
    title: 'Late Blight Outbreak Nearby',
    message: '8 reports of Late Blight detected 2.5 km North of your location. Stay vigilant.',
    time: '5 hours ago',
    unread: true,
    icon: MapPin,
    color: COLORS.accentOrange,
    bgColor: '#fff7ed',
  },
  {
    id: '3',
    type: 'market',
    title: 'Potato Prices Rising',
    message: 'Potato prices increased by 10% to ₹1,450 per quintal. Good time to sell!',
    time: '1 day ago',
    unread: false,
    icon: TrendingUp,
    color: COLORS.primary,
    bgColor: '#f0fdf4',
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Treatment Reminder',
    message: 'Time to apply the second round of organic neem spray for your potato field.',
    time: '1 day ago',
    unread: false,
    icon: Bell,
    color: COLORS.secondary,
    bgColor: '#eff6ff',
  },
  {
    id: '5',
    type: 'success',
    title: 'Treatment Effective',
    message: 'Your Early Blight treatment in Field B is showing positive results. Keep monitoring.',
    time: '2 days ago',
    unread: false,
    icon: CheckCircle,
    color: COLORS.primary,
    bgColor: '#f0fdf4',
  },
];

const TABS = [
  { id: 'all', label: 'All', count: 8 },
  { id: 'unread', label: 'Unread', count: 2 },
  { id: 'alerts', label: 'Alerts', count: 3 },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = NOTIFICATIONS.filter(item => {
    if (activeTab === 'unread') return item.unread;
    if (activeTab === 'alerts') return item.type === 'alert' || item.type === 'outbreak';
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={COLORS.white} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2 New</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Actions Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.markReadButton}>
            <Text style={styles.markReadText}>Mark All as Read</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <NotificationTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        {/* List */}
        <FlatList
          data={filteredNotifications}
          renderItem={({ item }) => <NotificationItem {...item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    flex: 1,
    fontFamily: 'Inter_700Bold',
  },
  badge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  markReadButton: {
    borderWidth: 1,
    borderColor: COLORS.neutral100,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.white,
  },
  markReadText: {
    fontSize: 12,
    color: COLORS.neutral900,
    fontWeight: '600',
  },
  clearAllText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
});
