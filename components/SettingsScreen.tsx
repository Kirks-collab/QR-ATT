
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  adminMode?: boolean;
};

export default function SettingsScreen({ adminMode = false }: Props) {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          {adminMode ? 'Admin Settings' : 'Settings'}
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manage your app preferences.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          APPEARANCE
        </Text>

        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={24}
            color={colors.primary}
          />

          <View style={styles.details}>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Change the app's appearance
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: colors.primary }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Toggle dark mode"
          />
        </View>

        <Text style={[styles.note, { color: colors.textSecondary }]}>
          Your selected theme is saved on this device.
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
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 14,
    gap: 12,
  },
  details: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    marginTop: 5,
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
  },
});
