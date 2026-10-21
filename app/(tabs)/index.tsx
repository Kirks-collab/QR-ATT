import { router } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>QR ATTENDANCE</Text>
          <Text style={styles.developer}>Developed by Kirk Selwyn Bahena</Text>
        </View>

        <Pressable
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Ionicons
            name="person-outline"
            size={21}
            color={COLORS.textPrimary}
          />
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.welcomeBadge}>
          <Ionicons
            name="school-outline"
            size={16}
            color={COLORS.primary}
          />
          <Text style={styles.badgeText}>SCHOOL EVENT SYSTEM</Text>
        </View>

        <Text style={styles.mainTitle}>
          School Event{'\n'}
          <Text style={styles.titleAccent}>Attendance</Text>
        </Text>

        <Text style={styles.subtitle}>
          Scan QR codes quickly and securely to record your
          attendance during school activities.
        </Text>

        {/* Scan Card */}
        <Pressable
          style={({ pressed }) => [
            styles.scanCard,
            pressed && styles.cardPressed,
          ]}
          onPress={() => router.push('/scan')}
        >
          <View style={styles.scanIconContainer}>
            <Ionicons
              name="qr-code-outline"
              size={38}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.scanTextContainer}>
            <Text style={styles.scanTitle}>Scan QR Code</Text>
            <Text style={styles.scanDescription}>
              Record your attendance
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={22}
            color="#FFFFFF"
          />
        </Pressable>

        {/* Secondary Actions */}
        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push('/history')}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="time-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.actionTitle}>History</Text>
            <Text style={styles.actionSubtitle}>
              View attendance
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push('/profile')}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="person-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.actionTitle}>Profile</Text>
            <Text style={styles.actionSubtitle}>
              Account details
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>
          QR Attendance • School Activity System
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brand: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.textPrimary,
  },

  developer: {
    marginTop: 4,
    fontSize: 11,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D9DEE7',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 45,
  },

  welcomeBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#EAF0F8',
    marginBottom: 18,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.primary,
  },

  mainTitle: {
    fontSize: 38,
    lineHeight: 43,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },

  titleAccent: {
    color: COLORS.primary,
  },

  subtitle: {
    marginTop: 14,
    maxWidth: 340,
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.textSecondary,
  },

  scanCard: {
    marginTop: 32,
    minHeight: 105,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  scanIconContainer: {
    width: 66,
    height: 66,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanTextContainer: {
    flex: 1,
    marginLeft: 15,
  },

  scanTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  scanDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
  },

  actionCard: {
    flex: 1,
    minHeight: 125,
    padding: 16,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5EB',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  actionSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 18,
  },

  footerLine: {
    width: 45,
    height: 3,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginBottom: 9,
    opacity: 0.7,
  },

  footerText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 0.4,
  },
});

