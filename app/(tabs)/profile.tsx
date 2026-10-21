import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';
import { useAuth, signOut } from '@/lib/auth';
import { getProfile, updateProfile, Profile } from '@/lib/profiles';

export default function ProfileScreen() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [draftName, setDraftName] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const loadProfile = useCallback(async () => {
    if (!user) return;

    const p = await getProfile(user.id);

    setProfile(p);
    setDraftName(p?.full_name ?? '');
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleSaveName = async () => {
    if (!user) return;

    const trimmedName = draftName.trim();

    if (!trimmedName) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }

    setSaving(true);

    const { error } = await updateProfile(user.id, {
      full_name: trimmedName,
    });

    setSaving(false);

    if (error) {
      Alert.alert('Error', error);
      return;
    }

    setProfile((prev) =>
      prev
        ? {
            ...prev,
            full_name: trimmedName,
          }
        : prev
    );

    setDraftName(trimmedName);
    setEditing(false);
  };

  const handleSignOut = async () => {
    setLoading(true);

    try {
      await signOut();
      router.replace('/login');
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.message || 'Failed to sign out.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = profile?.role === 'teacher';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ACCOUNT</Text>
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.subtitle}>
            Manage your account information
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="person-outline"
            size={23}
            color={COLORS.primary}
          />
        </View>
      </View>

      {user && (
        <>
          {/* Profile Identity */}
          <View style={styles.profileHero}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(profile?.full_name, user.email)}
              </Text>
            </View>

            <View style={styles.profileHeroInfo}>
              <Text
                style={styles.profileName}
                numberOfLines={1}
              >
                {profile?.full_name || 'Your Name'}
              </Text>

              <Text
                style={styles.profileEmail}
                numberOfLines={1}
              >
                {user.email}
              </Text>

              <View
                style={[
                  styles.roleBadge,
                  isTeacher
                    ? styles.teacherBadge
                    : styles.studentBadge,
                ]}
              >
                <Ionicons
                  name={
                    isTeacher
                      ? 'school-outline'
                      : 'person-outline'
                  }
                  size={12}
                  color="#FFFFFF"
                />

                <Text style={styles.roleBadgeText}>
                  {isTeacher ? 'TEACHER' : 'STUDENT'}
                </Text>
              </View>
            </View>
          </View>

          {/* Account Information */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Account Information
            </Text>
          </View>

          <View style={styles.infoCard}>
            {/* Name */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="person-outline"
                  size={19}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>FULL NAME</Text>

                {editing ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.nameInput}
                      value={draftName}
                      onChangeText={setDraftName}
                      placeholder="Enter your name"
                      placeholderTextColor={
                        COLORS.textSecondary
                      }
                      editable={!saving}
                      autoFocus
                    />

                    <View style={styles.editButtons}>
                      <Pressable
                        style={styles.cancelButton}
                        onPress={() => {
                          setDraftName(
                            profile?.full_name ?? ''
                          );
                          setEditing(false);
                        }}
                        disabled={saving}
                      >
                        <Text style={styles.cancelText}>
                          Cancel
                        </Text>
                      </Pressable>

                      <Pressable
                        style={styles.saveButton}
                        onPress={handleSaveName}
                        disabled={saving}
                      >
                        {saving ? (
                          <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                          />
                        ) : (
                          <Text style={styles.saveText}>
                            Save
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.valueRow}>
                    <Text
                      style={[
                        styles.value,
                        !profile?.full_name &&
                          styles.placeholderValue,
                      ]}
                    >
                      {profile?.full_name ||
                        'Tap edit to add your name'}
                    </Text>

                    <Pressable
                      onPress={() => setEditing(true)}
                      style={styles.editButton}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={15}
                        color={COLORS.primary}
                      />

                      <Text style={styles.editText}>
                        Edit
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Role */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={19}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>ACCOUNT ROLE</Text>

                <Text style={styles.value}>
                  {isTeacher ? 'Teacher' : 'Student'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Email */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>

                <Text
                  style={styles.value}
                  numberOfLines={1}
                >
                  {user.email}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* User ID */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="finger-print-outline"
                  size={19}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>USER ID</Text>

                <Text
                  style={styles.valueSmall}
                  numberOfLines={1}
                >
                  {user.id}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Sign Out */}
      <Pressable
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.pressed,
        ]}
        onPress={handleSignOut}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#C62828"
          />
        ) : (
          <Ionicons
            name="log-out-outline"
            size={21}
            color="#C62828"
          />
        )}

        <Text style={styles.signOutText}>
          {loading ? 'Signing out...' : 'Sign Out'}
        </Text>
      </Pressable>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />

        <Text style={styles.footerText}>
          QR Attendance • Account Settings
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

function getInitials(
  name: string | null | undefined,
  email: string | null | undefined
) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return (
        parts[0][0] + parts[parts.length - 1][0]
      ).toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  }

  if (email) {
    return email.slice(0, 2).toUpperCase();
  }

  return 'QR';
}

/* -------------------------------------------------------
   Styles
------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 22,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: COLORS.primary,
    marginBottom: 5,
  },

  title: {
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E6EC',

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  profileHeroInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },

  profileEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  teacherBadge: {
    backgroundColor: COLORS.primary,
  },

  studentBadge: {
    backgroundColor: COLORS.textSecondary,
  },

  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#FFFFFF',
  },

  sectionHeader: {
    marginTop: 24,
    marginBottom: 9,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E6EC',

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 15,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },

  label: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },

  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  value: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  placeholderValue: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  valueSmall: {
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.textSecondary,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EDF2F8',
  },

  editText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },

  editContainer: {
    width: '100%',
  },

  nameInput: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 9,
  },

  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: '#EEF0F3',
  },

  cancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  saveButton: {
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
  },

  saveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  divider: {
    height: 1,
    backgroundColor: '#E9ECF0',
  },

  signOutButton: {
    marginTop: 18,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7CACA',
    backgroundColor: '#FFF8F8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  signOutText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#C62828',
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 15,
  },

  footerLine: {
    width: 40,
    height: 3,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginBottom: 7,
    opacity: 0.7,
  },

  footerText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
});

