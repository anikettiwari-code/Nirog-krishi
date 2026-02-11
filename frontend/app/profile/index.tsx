import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { BottomBar } from '../../components/navigation/BottomBar';
import { User, LogOut, Edit2, Save, X, Key, MapPin, Phone, Calendar, Shield, Leaf, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { AuthService, User as UserType } from '../../services/AuthService';
import { StorageService } from '../../services/StorageService';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState({ total: 0, healthy: 0, diseased: 0 });

    // Edit fields
    const [editName, setEditName] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editPhone, setEditPhone] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadUser();
        }, [])
    );

    const loadUser = async () => {
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
            // Should not happen with guest mode active
            return;
        }
        setUser(currentUser);
        setEditName(currentUser.displayName);
        setEditLocation(currentUser.location || '');
        setEditPhone(currentUser.phone || '');

        // Load user stats
        const userStats = await StorageService.getUserStats();
        setStats(userStats);

        setIsLoading(false);
    };

    const handleSave = async () => {
        try {
            const updated = await AuthService.updateProfile({
                userId: user?.userId,
                username: user?.userId,
                displayName: editName,
                location: editLocation,
                phone: editPhone,
            });
            setUser(updated);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            console.log('[Profile] Logging out...');
            await AuthService.logout();
            console.log('[Profile] Logout successful, redirecting...');
            router.replace('/');
        } catch (error) {
            console.error('[Profile] Logout error:', error);
            // Force redirect anyway
            router.replace('/');
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScreenHeader title="Profile" />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <User color="#fff" size={40} />
                    </View>
                    <Text style={styles.displayName}>{user?.displayName}</Text>
                    <Text style={styles.userId}>@{user?.userId}</Text>
                </View>

                {/* Stats Card */}
                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Your Scan Stats</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Leaf color={COLORS.primary} size={24} />
                            <Text style={styles.statNum}>{stats.total}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={styles.statItem}>
                            <CheckCircle color="#22C55E" size={24} />
                            <Text style={[styles.statNum, { color: '#22C55E' }]}>{stats.healthy}</Text>
                            <Text style={styles.statLabel}>Healthy</Text>
                        </View>
                        <View style={styles.statItem}>
                            <AlertTriangle color="#EF4444" size={24} />
                            <Text style={[styles.statNum, { color: '#EF4444' }]}>{stats.diseased}</Text>
                            <Text style={styles.statLabel}>Diseased</Text>
                        </View>
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Account Info</Text>
                        {!isEditing ? (
                            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
                                <Edit2 color={COLORS.primary} size={18} />
                                <Text style={styles.editBtnText}>Edit</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.editActions}>
                                <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelBtn}>
                                    <X color="#EF4444" size={18} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                                    <Save color="#fff" size={18} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Username (Editable) */}
                    <View style={styles.infoRow}>
                        <User color="#6B7280" size={18} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>User ID</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.editInput}
                                    value={user?.userId}
                                    onChangeText={(text) => setUser(prev => prev ? { ...prev, userId: text, username: text } : null)}
                                    placeholder="Set User ID"
                                />
                            ) : (
                                <Text style={styles.infoValue}>@{user?.userId}</Text>
                            )}
                        </View>
                    </View>

                    {/* Display Name */}
                    <View style={styles.infoRow}>
                        <User color="#6B7280" size={18} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Display Name</Text>
                            {isEditing ? (
                                <TextInput style={styles.editInput} value={editName} onChangeText={setEditName} placeholder="Your name" />
                            ) : (
                                <Text style={styles.infoValue}>{user?.displayName}</Text>
                            )}
                        </View>
                    </View>

                    {/* Location */}
                    <View style={styles.infoRow}>
                        <MapPin color="#6B7280" size={18} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Location</Text>
                            {isEditing ? (
                                <TextInput style={styles.editInput} value={editLocation} onChangeText={setEditLocation} placeholder="City, State" />
                            ) : (
                                <Text style={styles.infoValue}>{user?.location || 'Not set'}</Text>
                            )}
                        </View>
                    </View>

                    {/* Phone */}
                    <View style={styles.infoRow}>
                        <Phone color="#6B7280" size={18} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Phone</Text>
                            {isEditing ? (
                                <TextInput style={styles.editInput} value={editPhone} onChangeText={setEditPhone} placeholder="Your phone" keyboardType="phone-pad" />
                            ) : (
                                <Text style={styles.infoValue}>{user?.phone || 'Not set'}</Text>
                            )}
                        </View>
                    </View>

                    {/* Member Since */}
                    <View style={styles.infoRow}>
                        <Calendar color="#6B7280" size={18} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Member Since</Text>
                            <Text style={styles.infoValue}>{formatDate(user?.createdAt)}</Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsCard}>
                    <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/history')}>
                        <Leaf color={COLORS.primary} size={20} />
                        <Text style={styles.actionText}>View Scan History</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/settings')}>
                        <Shield color={COLORS.primary} size={20} />
                        <Text style={styles.actionText}>Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionRow, styles.logoutRow]} onPress={handleLogout}>
                        <LogOut color="#EF4444" size={20} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <BottomBar activePage="profile" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: SPACING.lg },

    profileHeader: { alignItems: 'center', marginBottom: SPACING.lg },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    displayName: { fontSize: 22, fontWeight: '700', color: '#111827' },
    userId: { fontSize: 14, color: '#6B7280', marginTop: 2 },

    statsCard: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    statsTitle: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: SPACING.md, textAlign: 'center' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statNum: { fontSize: 24, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
    statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },

    card: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md, paddingBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    editBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
    editActions: { flexDirection: 'row', gap: 8 },
    cancelBtn: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 },
    saveBtn: { padding: 8, backgroundColor: COLORS.primary, borderRadius: 8 },

    infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
    infoContent: { flex: 1, marginLeft: 12 },
    infoLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
    infoValue: { fontSize: 15, color: '#374151', fontWeight: '500' },
    editInput: { fontSize: 15, color: '#111827', backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },

    actionsCard: { backgroundColor: '#fff', borderRadius: RADIUS.xl, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    actionRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 12 },
    actionText: { fontSize: 15, color: '#374151', fontWeight: '500' },
    logoutRow: { borderBottomWidth: 0 },
    logoutText: { fontSize: 15, color: '#EF4444', fontWeight: '600' },
});
