
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

import { COLORS } from '@/constants/colors';
import { signOut } from '@/lib/auth';

export default function AdminDashboard() {


 async function handleLogout() {
  await signOut();
  router.replace('/login');
}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>
        Welcome, Administrator!
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>User Management</Text>
        <Text style={styles.description}>
          Manage student and teacher accounts.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Event Management</Text>
        <Text style={styles.description}>
          Oversee attendance events.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Attendance Records</Text>
        <Text style={styles.description}>
          Review attendance information.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
