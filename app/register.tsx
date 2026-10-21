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
import { COLORS } from '@/constants/colors';
import { signUp } from '@/lib/auth';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // ANIMATIONS
  // ============================================================

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
      // Header animation
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

      // Title animation
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

      // Form animation
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

      // Button pop animation
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

      // Footer animation
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

  // ============================================================
  // REGISTRATION FUNCTIONALITY
  // ============================================================

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
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: insets.bottom + 30,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <Animated.View
              style={[
                styles.headerContainer,
                {
                  opacity: headerOpacity,
                  transform: [
                    {
                      translateY: headerTranslateY,
                    },
                  ],
                },
              ]}
            >
              <Header title="QR Attendance" />
            </Animated.View>

            {/* TITLE */}
            <Animated.View
              style={[
                styles.titleContainer,
                {
                  opacity: titleOpacity,
                  transform: [
                    {
                      translateY: titleTranslateY,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.badge}>
                <View style={styles.badgeDot} />

                <Text style={styles.badgeText}>
                  SCHOOL EVENT SYSTEM
                </Text>
              </View>

              <Text style={styles.title}>
                Create Account
              </Text>

              <Text style={styles.subtitle}>
                Register to start recording attendance
              </Text>
            </Animated.View>

            {success ? (
              /* ==================================================
                 SUCCESS
                 ================================================== */
              <Animated.View
                style={[
                  styles.successContainer,
                  {
                    opacity: formOpacity,
                    transform: [
                      {
                        translateY: formTranslateY,
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.successIconContainer}>
                  <Text style={styles.successIcon}>✓</Text>
                </View>

                <Text style={styles.successTitle}>
                  Check your email!
                </Text>

                <Text style={styles.successText}>
                  We sent a confirmation link to {email}. Click the
                  link to verify your account, then come back and
                  sign in.
                </Text>

                <Link href="/login" style={styles.successLink}>
                  Back to Sign In
                </Link>
              </Animated.View>
            ) : (
              /* ==================================================
                 FORM
                 ================================================== */
              <Animated.View
                style={[
                  styles.formCard,
                  {
                    opacity: formOpacity,
                    transform: [
                      {
                        translateY: formTranslateY,
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    Account Details
                  </Text>

                  <Text style={styles.cardSubtitle}>
                    Fill in your information below
                  </Text>
                </View>

                {/* FULL NAME */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Full Name
                  </Text>

                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor={COLORS.textSecondary}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>

                {/* ROLE */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    I am a...
                  </Text>

                  <View style={styles.roleRow}>
                    <Pressable
                      style={[
                        styles.roleChip,
                        role === 'student' &&
                          styles.roleChipActive,
                      ]}
                      onPress={() => setRole('student')}
                      disabled={loading}
                    >
                      <View
                        style={[
                          styles.roleIndicator,
                          role === 'student' &&
                            styles.roleIndicatorActive,
                        ]}
                      />

                      <Text
                        style={[
                          styles.roleChipText,
                          role === 'student' &&
                            styles.roleChipTextActive,
                        ]}
                      >
                        Student
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.roleChip,
                        role === 'teacher' &&
                          styles.roleChipActive,
                      ]}
                      onPress={() => setRole('teacher')}
                      disabled={loading}
                    >
                      <View
                        style={[
                          styles.roleIndicator,
                          role === 'teacher' &&
                            styles.roleIndicatorActive,
                        ]}
                      />

                      <Text
                        style={[
                          styles.roleChipText,
                          role === 'teacher' &&
                            styles.roleChipTextActive,
                        ]}
                      >
                        Teacher
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* EMAIL */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Email
                  </Text>

                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@school.edu"
                    placeholderTextColor={
                      COLORS.textSecondary
                    }
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                  />
                </View>

                {/* PASSWORD */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Password
                  </Text>

                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="At least 6 characters"
                    placeholderTextColor={
                      COLORS.textSecondary
                    }
                    secureTextEntry
                    editable={!loading}
                  />
                </View>

                {/* CONFIRM PASSWORD */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Confirm Password
                  </Text>

                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter your password"
                    placeholderTextColor={
                      COLORS.textSecondary
                    }
                    secureTextEntry
                    editable={!loading}
                  />
                </View>

                {/* ERROR */}
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>
                      !
                    </Text>

                    <Text style={styles.error}>
                      {error}
                    </Text>
                  </View>
                )}

                {/* BUTTON */}
                <Animated.View
                  style={{
                    opacity: buttonOpacity,
                    transform: [
                      {
                        scale: buttonScale,
                      },
                    ],
                  }}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator
                        size="large"
                        color={COLORS.primary}
                      />

                      <Text style={styles.loadingText}>
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

            {/* FOOTER */}
            <Animated.View
              style={[
                styles.footer,
                {
                  opacity: footerOpacity,
                  transform: [
                    {
                      translateY: footerTranslateY,
                    },
                  ],
                },
              ]}
            >
              {!success && (
                <>
                  <Text style={styles.footerText}>
                    Already have an account?
                  </Text>

                  <Link
                    href="/login"
                    style={styles.link}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </Animated.View>

            {/* BRAND */}
            <Animated.View
              style={[
                styles.bottomBrand,
                {
                  opacity: footerOpacity,
                },
              ]}
            >
              <Text style={styles.brandText}>
                QR ATTENDANCE
              </Text>

              <Text style={styles.brandSubtext}>
                School Event Attendance
              </Text>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },

  // ============================================================
  // HEADER
  // ============================================================

  headerContainer: {
    marginBottom: 28,
  },

  // ============================================================
  // TITLE
  // ============================================================

  titleContainer: {
    marginBottom: 26,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 20,

    backgroundColor: COLORS.primary + '12',

    borderWidth: 1,
    borderColor: COLORS.primary + '25',

    marginBottom: 15,
  },

  badgeDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: COLORS.primary,

    marginRight: 8,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '800',

    letterSpacing: 1.2,

    color: COLORS.primary,
  },

  title: {
    fontSize: 34,
    fontWeight: '900',

    color: COLORS.textPrimary,

    letterSpacing: -0.8,

    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,

    color: COLORS.textSecondary,

    maxWidth: 320,
  },

  // ============================================================
  // FORM CARD
  // ============================================================

  formCard: {
    backgroundColor: COLORS.surface,

    borderRadius: 24,

    padding: 22,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,

    elevation: 5,

    marginBottom: 24,
  },

  cardHeader: {
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: '800',

    color: COLORS.textPrimary,

    marginBottom: 5,
  },

  cardSubtitle: {
    fontSize: 13,

    color: COLORS.textSecondary,
  },

  // ============================================================
  // INPUTS
  // ============================================================

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',

    color: COLORS.textPrimary,

    marginBottom: 8,
  },

  input: {
    height: 54,

    backgroundColor: COLORS.background,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: COLORS.border,

    paddingHorizontal: 16,

    fontSize: 15,

    color: COLORS.textPrimary,
  },

  // ============================================================
  // ROLE
  // ============================================================

  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },

  roleChip: {
    flex: 1,

    height: 54,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: COLORS.border,

    backgroundColor: COLORS.background,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,
  },

  roleChipActive: {
    borderColor: COLORS.primary,

    backgroundColor: COLORS.primary + '12',
  },

  roleIndicator: {
    width: 9,
    height: 9,

    borderRadius: 5,

    borderWidth: 1.5,

    borderColor: COLORS.textSecondary,
  },

  roleIndicatorActive: {
    backgroundColor: COLORS.primary,

    borderColor: COLORS.primary,
  },

  roleChipText: {
    fontSize: 14,
    fontWeight: '600',

    color: COLORS.textPrimary,
  },

  roleChipTextActive: {
    color: COLORS.primary,

    fontWeight: '800',
  },

  // ============================================================
  // ERROR
  // ============================================================

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#EF444412',

    borderWidth: 1,
    borderColor: '#EF444425',

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

    color: '#EF4444',

    backgroundColor: '#EF444420',

    marginRight: 9,
  },

  error: {
    flex: 1,

    fontSize: 13,
    lineHeight: 19,

    color: COLORS.danger,

    fontWeight: '600',
  },

  // ============================================================
  // LOADING
  // ============================================================

  loadingContainer: {
    height: 54,

    borderRadius: 14,

    backgroundColor: COLORS.primary + '10',

    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',
  },

  loadingText: {
    marginLeft: 10,

    fontSize: 14,
    fontWeight: '700',

    color: COLORS.primary,
  },

  // ============================================================
  // SUCCESS
  // ============================================================

  successContainer: {
    backgroundColor: COLORS.surface,

    borderRadius: 24,

    padding: 24,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,

    elevation: 5,

    marginBottom: 24,
  },

  successIconContainer: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: COLORS.primary + '12',

    borderWidth: 1,
    borderColor: COLORS.primary + '25',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 18,
  },

  successIcon: {
    fontSize: 28,

    fontWeight: '900',

    color: COLORS.primary,
  },

  successTitle: {
    fontSize: 22,
    fontWeight: '800',

    color: COLORS.textPrimary,

    marginBottom: 8,
  },

  successText: {
    fontSize: 14,
    lineHeight: 21,

    color: COLORS.textSecondary,

    marginBottom: 20,
  },

  successLink: {
    fontSize: 14,

    color: COLORS.primary,

    fontWeight: '800',

    textAlign: 'center',
  },

  // ============================================================
  // FOOTER
  // ============================================================

  footer: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 24,
  },

  footerText: {
    fontSize: 14,

    color: COLORS.textSecondary,
  },

  link: {
    marginLeft: 5,

    fontSize: 14,

    color: COLORS.primary,

    fontWeight: '800',
  },

  // ============================================================
  // BRAND
  // ============================================================

  bottomBrand: {
    alignItems: 'center',

    marginTop: 'auto',

    paddingTop: 10,
  },

  brandText: {
    fontSize: 10,

    fontWeight: '900',

    letterSpacing: 2,

    color: COLORS.textSecondary,

    opacity: 0.7,
  },

  brandSubtext: {
    fontSize: 10,

    marginTop: 4,

    color: COLORS.textSecondary,

    opacity: 0.55,
  },
});