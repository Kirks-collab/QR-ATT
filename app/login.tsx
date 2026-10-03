import { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { signIn } from '@/lib/auth';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // ANIMATION
  // ============================================================

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-40)).current;

  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTranslateY = useRef(new Animated.Value(40)).current;

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(60)).current;

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.85)).current;

  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      // Header
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1.3)),
          useNativeDriver: true,
        }),
      ]),

      // Welcome text
      Animated.parallel([
        Animated.timing(welcomeOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(welcomeTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),

      // Form
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),

      // Button
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 450,
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

      // Footer
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
    welcomeOpacity,
    welcomeTranslateY,
    formOpacity,
    formTranslateY,
    buttonOpacity,
    buttonScale,
    footerOpacity,
    footerTranslateY,
  ]);

  // ============================================================
  // LOGIN FUNCTIONALITY
  // ============================================================

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await signIn(
        email.trim(),
        password
      );

      if (authError) {
        setError(authError.message);
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
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
            {/* HEADER ANIMATION */}
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

            {/* WELCOME ANIMATION */}
            <Animated.View
              style={[
                styles.welcomeContainer,
                {
                  opacity: welcomeOpacity,
                  transform: [
                    {
                      translateY: welcomeTranslateY,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.welcomeBadge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>
                  SCHOOL EVENT SYSTEM
                </Text>
              </View>

              <Text style={styles.title}>Welcome Back</Text>

              <Text style={styles.subtitle}>
                Sign in to record your attendance
              </Text>
            </Animated.View>

            {/* FORM ANIMATION */}
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
                <Text style={styles.cardTitle}>Sign In</Text>
                <Text style={styles.cardSubtitle}>
                  Enter your account details below
                </Text>
              </View>

              {/* EMAIL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>

                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@school.edu"
                  placeholderTextColor={COLORS.textSecondary}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              {/* PASSWORD */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>

                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textSecondary}
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              {/* ERROR */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorIcon}>!</Text>

                  <Text style={styles.error}>
                    {error}
                  </Text>
                </View>
              )}

              {/* BUTTON ANIMATION */}
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
                      Signing in...
                    </Text>
                  </View>
                ) : (
                  <AppButton
                    theme="primary"
                    title="Sign In"
                    icon="log-in-outline"
                    onPress={handleLogin}
                  />
                )}
              </Animated.View>
            </Animated.View>

            {/* FOOTER ANIMATION */}
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
              <Text style={styles.footerText}>
                Don't have an account?
              </Text>

              <Link href="/register" style={styles.link}>
                Sign Up
              </Link>
            </Animated.View>

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

  // ----------------------------------------------------------
  // HEADER
  // ----------------------------------------------------------

  headerContainer: {
    marginBottom: 28,
  },

  // ----------------------------------------------------------
  // WELCOME
  // ----------------------------------------------------------

  welcomeContainer: {
    marginBottom: 28,
  },

  welcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 20,

    backgroundColor: COLORS.primary + '12',
    borderWidth: 1,
    borderColor: COLORS.primary + '25',

    marginBottom: 16,
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
    maxWidth: 310,
  },

  // ----------------------------------------------------------
  // FORM CARD
  // ----------------------------------------------------------

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
    marginBottom: 22,
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

  // ----------------------------------------------------------
  // INPUTS
  // ----------------------------------------------------------

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  input: {
    height: 54,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 14,

    backgroundColor: COLORS.background,

    paddingHorizontal: 16,

    fontSize: 15,
    color: COLORS.textPrimary,
  },

  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#EF444412',

    borderWidth: 1,
    borderColor: '#EF444425',

    borderRadius: 12,

    paddingHorizontal: 12,
    paddingVertical: 10,

    marginBottom: 18,
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

    color: '#DC2626',
    fontWeight: '600',
  },

  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  loadingContainer: {
    height: 54,

    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',

    borderRadius: 14,

    backgroundColor: COLORS.primary + '10',
  },

  loadingText: {
    marginLeft: 10,

    fontSize: 14,
    fontWeight: '700',

    color: COLORS.primary,
  },

  // ----------------------------------------------------------
  // FOOTER
  // ----------------------------------------------------------

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 26,
  },

  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  link: {
    marginLeft: 5,

    fontSize: 14,
    fontWeight: '800',

    color: COLORS.primary,
  },

  // ----------------------------------------------------------
  // BRAND
  // ----------------------------------------------------------

  bottomBrand: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 15,
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