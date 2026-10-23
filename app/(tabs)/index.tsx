
import { router } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';

export default function Index() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.header}>
          <View style={styles.welcomeText}>
            <Text
              style={[
                styles.greeting,
                { color: colors.textSecondary },
              ]}
            >
              Welcome back!
            </Text>

            <Text
              style={[
                styles.title,
                { color: colors.textPrimary },
              ]}
            >
              QR Attendance
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: colors.textSecondary },
              ]}
            >
              Developed by Kirk Selwyn Bahena.
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              { backgroundColor: colors.card },
            ]}
          >
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={28}
              color={colors.primary}
            />
          </View>
        </View>

        {/* Attendance Summary */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary },
          ]}
        >
          Attendance Overview
        </Text>

        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: isDark ? '#263B32' : '#E5F3E8' },
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={25}
                color={isDark ? '#86D6A0' : '#3F7658'}
              />
            </View>

            <Text
              style={[
                styles.statNumber,
                { color: colors.textPrimary },
              ]}
            >
              --
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: colors.textSecondary },
              ]}
            >
              Attendance Records
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: isDark ? '#3A3023' : '#F5EBD9' },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={25}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.statNumber,
                { color: colors.textPrimary },
              ]}
            >
              --
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: colors.textSecondary },
              ]}
            >
              Available Events
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary },
          ]}
        >
          Quick Actions
        </Text>

        <Pressable
          onPress={() => router.push('/scan')}
          style={({ pressed }) => [
            styles.actionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="qr-code-outline"
              size={26}
              color={colors.textLight}
            />
          </View>

          <View style={styles.actionText}>
            <Text
              style={[
                styles.actionTitle,
                { color: colors.textPrimary },
              ]}
            >
              Scan QR Code
            </Text>

            <Text
              style={[
                styles.actionDescription,
                { color: colors.textSecondary },
              ]}
            >
              Record your attendance at an event.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={colors.textSecondary}
          />
        </Pressable>

        <Pressable
          onPress={() => router.push('/history')}
          style={({ pressed }) => [
            styles.actionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: isDark ? '#374151' : '#E8EDF5' },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={26}
              color={colors.primary}
            />
          </View>

          <View style={styles.actionText}>
            <Text
              style={[
                styles.actionTitle,
                { color: colors.textPrimary },
              ]}
            >
              Attendance History
            </Text>

            <Text
              style={[
                styles.actionDescription,
                { color: colors.textSecondary },
              ]}
            >
              Review your previous attendance records.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={colors.textSecondary}
          />
        </Pressable>

        {/* Footer */}
        <Text
          style={[
            styles.footer,
            { color: colors.textSecondary },
          ]}
        >
          QR Attendance System
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 30,
  },
  welcomeText: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    minHeight: 145,
    borderRadius: 16,
    borderWidth: 1,
    padding: 15,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 25,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 5,
    lineHeight: 17,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  actionDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
});
