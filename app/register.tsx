import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';
import { signUp } from '@/lib/auth';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-40)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(40)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(70)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.82)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.back(1.3)),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(footerTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    headerOpacity,
    headerTranslateY,
    titleOpacity,
    titleTranslateY,
    formOpacity,
    formTranslateY,
    buttonOpacity,
    buttonScale,
    footerOpacity,
    footerTranslateY,
  ]);

  const handleRegister = async () => {
    setError(null);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await signUp(
        email.trim(),
        password,
        {
          full_name: fullName.trim(),
          role,
        }
      );

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        router.replace('/(tabs)');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const themedStyles = {
    screen: { backgroundColor: colors.background },
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: isDark ? '#000000' : '#64748B',
    },
    input: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      color: colors.textPrimary,
    },
    label: { color: colors.textPrimary },
    secondaryText: { color: colors.textSecondary },
    primaryText: { color: colors.primary },
    badge: {
      backgroundColor: isDark ? '#26374D' : '#E8EDF4',
      borderColor: colors.border,
    },
    roleChip: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    activeRoleChip: {
      backgroundColor: isDark ? '#26374D' : '#E8EDF4',
      borderColor: colors.primary,
    },
    errorText: { color: isDark ? '#FCA5A5' : '#B91C1C' },
    errorContainer: {
      backgroundColor: isDark ? '#3B2027' : '#FEF2F2',
      borderColor: isDark ? '#7F3038' : '#FECACA',
    },
    loadingContainer: {
      backgroundColor: isDark ? '#26374D' : '#E8EDF4',
    },
  };

  return (
    <View
      style={[
        styles.container,
        themedStyles.screen,
        { paddingTop: insets.top },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 30 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.headerContainer,
                {
                  opacity: headerOpacity,
                  transform: [{ translateY: headerTranslateY }],
                },
              ]}
            >
              <Header title="QR Attendance" />
            </Animated.View>

            <Animated.View
              style={[
                styles.titleContainer,
                {
                  opacity: titleOpacity,
                  transform: [{ translateY: titleTranslateY }],
                },
              ]}
            >
              <View style={[styles.badge, themedStyles.badge]}>
                <View
                  style={[
                    styles.badgeDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
                <Text
                  style={[
                    styles.badgeText,
                    { color: colors.primary },
                  ]}
                >
                  SCHOOL EVENT SYSTEM
                </Text>
              </View>

              <Text style={[styles.title, themedStyles.label]}>
                Create Account
              </Text>

              <Text style={[styles.subtitle, themedStyles.secondaryText]}>
                Register to start recording attendance
              </Text>
            </Animated.View>

            {success ? (
              <Animated.View
                style={[
                  styles.successContainer,
                  themedStyles.card,
                  {
                    opacity: formOpacity,
                    transform: [{ translateY: formTranslateY }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.successIconContainer,
                    { backgroundColor: isDark ? '#26374D' : '#E8EDF4' },
                  ]}
                >
                  <Text
                    style={[
                      styles.successIcon,
                      { color: colors.primary },
                    ]}
                  >
                    ✓
                  </Text>
                </View>

                <Text style={[styles.successTitle, themedStyles.label]}>
                  Check your email!
                </Text>

                <Text style={[styles.successText, themedStyles.secondaryText]}>
                  We sent a confirmation link to {email}. Click the link to
                  verify your account, then come back and sign in.
                </Text>

                <Link href="/login" style={[styles.successLink, themedStyles.primaryText]}>
                  Back to Sign In
                </Link>
              </Animated.View>
            ) : (
              <Animated.View
                style={[
                  styles.formCard,
                  themedStyles.card,
                  {
                    opacity: formOpacity,
                    transform: [{ translateY: formTranslateY }],
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, themedStyles.label]}>
                    Account Details
                  </Text>
                  <Text style={[styles.cardSubtitle, themedStyles.secondaryText]}>
                    Fill in your information below
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, themedStyles.label]}>
                    Full Name
                  </Text>
                  <TextInput
                    style={[styles.input, themedStyles.input]}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, themedStyles.label]}>
                    I am a...
                  </Text>

                  <View style={styles.roleRow}>
                    {(['student', 'teacher'] as const).map((item) => {
                      const active = role === item;

                      return (
                        <Pressable
                          key={item}
                          style={[
                            styles.roleChip,
                            themedStyles.roleChip,
                            active && themedStyles.activeRoleChip,
                          ]}
                          onPress={() => setRole(item)}
                          disabled={loading}
                        >
                          <View
                            style={[
                              styles.roleIndicator,
                              {
                                borderColor: active
                                  ? colors.primary
                                  : colors.textSecondary,
                                backgroundColor: active
                                  ? colors.primary
                                  : 'transparent',
                              },
                            ]}
                          />
                          <Text
                            style={[
                              styles.roleChipText,
                              { color: active ? colors.primary : colors.textPrimary },
                              active && styles.roleChipTextActive,
                            ]}
                          >
                            {item === 'student' ? 'Student' : 'Teacher'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, themedStyles.label]}>Email</Text>
                  <TextInput
                    style={[styles.input, themedStyles.input]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@school.edu"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, themedStyles.label]}>
                    Password
                  </Text>
                  <TextInput
                    style={[styles.input, themedStyles.input]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, themedStyles.label]}>
                    Confirm Password
                  </Text>
                  <TextInput
                    style={[styles.input, themedStyles.input]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter your password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    editable={!loading}
                  />
                </View>

                {error && (
                  <View style={[styles.errorContainer, themedStyles.errorContainer]}>
                    <Text style={[styles.errorIcon, themedStyles.errorText]}>
                      !
                    </Text>
                    <Text style={[styles.error, themedStyles.errorText]}>
                      {error}
                    </Text>
                  </View>
                )}

                <Animated.View
                  style={{
                    opacity: buttonOpacity,
                    transform: [{ scale: buttonScale }],
                  }}
                >
                  {loading ? (
                    <View style={[styles.loadingContainer, themedStyles.loadingContainer]}>
                      <ActivityIndicator size="large" color={colors.primary} />
                      <Text style={[styles.loadingText, themedStyles.primaryText]}>
                        Creating account...
                      </Text>
                    </View>
                  ) : (
                    <AppButton
                      theme="primary"
                      title="Sign Up"
                      icon="person-add-outline"
                      onPress={handleRegister}
                    />
                  )}
                </Animated.View>
              </Animated.View>
            )}

            <Animated.View
              style={[
                styles.footer,
                {
                  opacity: footerOpacity,
                  transform: [{ translateY: footerTranslateY }],
                },
              ]}
            >
              {!success && (
                <>
                  <Text style={[styles.footerText, themedStyles.secondaryText]}>
                    Already have an account?
                  </Text>
                  <Link href="/login" style={[styles.link, themedStyles.primaryText]}>
                    Sign In
                  </Link>
                </>
              )}
            </Animated.View>

            <Animated.View
              style={[styles.bottomBrand, { opacity: footerOpacity }]}
            >
              <Text style={[styles.brandText, themedStyles.secondaryText]}>
                QR ATTENDANCE
              </Text>
              <Text style={[styles.brandSubtext, themedStyles.secondaryText]}>
                School Event Attendance
              </Text>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  headerContainer: { marginBottom: 28 },
  titleContainer: { marginBottom: 26 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 15,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 320,
  },
  formCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 24,
  },
  cardHeader: { marginBottom: 20 },
  cardTitle: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 5,
  },
  cardSubtitle: { fontSize: 13 },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  roleRow: { flexDirection: 'row', gap: 12 },
  roleChip: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  roleIndicator: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  roleChipText: { fontSize: 14, fontWeight: '600' },
  roleChipTextActive: { fontWeight: '800' },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    fontWeight: '900',
    marginRight: 9,
  },
  error: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  loadingContainer: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '700',
  },
  successContainer: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 24,
  },
  successIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  successIcon: { fontSize: 28, fontWeight: '900' },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  successLink: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  footerText: { fontSize: 14 },
  link: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '800',
  },
  bottomBrand: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 10,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    opacity: 0.7,
  },
  brandSubtext: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.55,
  },
});