import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { User, Mail, Lock, Eye, EyeOff, Leaf, UserPlus, LogIn, ArrowRight } from 'lucide-react-native';
import { AuthService } from '../services/AuthService';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Check if already logged in
  useFocusEffect(
    React.useCallback(() => {
      const checkLogin = async () => {
        const user = await AuthService.getCurrentUser();
        if (user) {
          router.replace('/dashboard');
        } else {
          setCheckingAuth(false);
        }
      };
      checkLogin();
    }, [])
  );

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter User ID and password');
      return;
    }

    setIsLoading(true);
    try {
      const user = await AuthService.login(username.trim(), password);
      Alert.alert('Welcome Back!', `Logged in as ${user.displayName}`);
      router.replace('/dashboard');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!displayName.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Adjusted based on new AuthService signature: register(displayName, password)
      const user = await AuthService.register(displayName.trim(), password);

      Alert.alert(
        'Account Created Successfully! 🎉',
        `Your UNIQUE User ID is:\n\n${user.userId}\n\nPlease save this ID. You will need it to login.`,
        [
          {
            text: 'Copy & Login',
            onPress: () => {
              // Auto-fill username for convenience, though usually we might want them to type it
              setUsername(user.userId);
              router.replace('/dashboard');
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = () => {
    Alert.alert('Coming Soon', 'Email login is being worked on. Please use User ID/password for now.');
  };

  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#15803d', '#22c55e', '#4ade80']} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Leaf color="#fff" size={40} />
              </View>
              <Text style={styles.appName}>निरोग कृषि</Text>
              <Text style={styles.tagline}>Smart Farming Assistant</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              {/* Toggle */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity style={[styles.toggleBtn, isLogin && styles.toggleActive]} onPress={() => setIsLogin(true)}>
                  <LogIn color={isLogin ? '#fff' : COLORS.primary} size={18} />
                  <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleBtn, !isLogin && styles.toggleActive]} onPress={() => setIsLogin(false)}>
                  <UserPlus color={!isLogin ? '#fff' : COLORS.primary} size={18} />
                  <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Register</Text>
                </TouchableOpacity>
              </View>

              {/* Form */}
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <User color="#9CA3AF" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name (e.g., Ramesh Kumar)"
                    placeholderTextColor="#9CA3AF"
                    value={displayName}
                    onChangeText={setDisplayName}
                  />
                </View>
              )}

              {isLogin && (
                <View style={styles.inputContainer}>
                  <User color="#9CA3AF" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="User ID (e.g. ramesh_1234)"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Lock color="#9CA3AF" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? <EyeOff color="#9CA3AF" size={20} /> : <Eye color="#9CA3AF" size={20} />}
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                onPress={isLogin ? handleLogin : handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>{isLogin ? 'Login' : 'Create Account'}</Text>
                    <ArrowRight color="#fff" size={20} />
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Email Login (Coming Soon) */}
              <TouchableOpacity style={styles.emailBtn} onPress={handleEmailLogin}>
                <Mail color={COLORS.primary} size={20} />
                <Text style={styles.emailBtnText}>Continue with Email</Text>
              </TouchableOpacity>
              <Text style={styles.comingSoon}>⚙️ Email login coming soon</Text>

            </View>

            {/* Footer */}
            <Text style={styles.footer}>Built with 💚 for Farmers</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  gradient: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },

  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  appName: { fontSize: 28, fontWeight: '800', color: '#fff' },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  card: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },

  toggleContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: RADIUS.lg, padding: 4, marginBottom: SPACING.lg },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: RADIUS.md, gap: 6 },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
  toggleTextActive: { color: '#fff' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: RADIUS.md, marginBottom: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#111827' },
  eyeBtn: { padding: 8 },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.lg, gap: 8, marginTop: 8 },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, color: '#9CA3AF', fontSize: 14 },

  emailBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.primary, paddingVertical: 14, borderRadius: RADIUS.lg, gap: 8 },
  emailBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },

  comingSoon: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 8 },

  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginTop: 30, fontSize: 13 },
});
