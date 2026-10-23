
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/lib/auth';
import { getProfile, type Role } from '@/lib/profiles';
import {
  getAttendanceHistory,
  getTeacherEventAttendance,
  type AttendanceRecord,
  type TeacherEventAttendance,
} from '@/lib/attendance';

export default function HistoryScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const [role, setRole] = useState<Role | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [teacherEvents, setTeacherEvents] = useState<
    TeacherEventAttendance[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user) {
      setRole(null);
      setRecords([]);
      setTeacherEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const profile = await getProfile(user.id);
      const currentRole = profile?.role ?? 'student';

      setRole(currentRole);

      if (currentRole === 'teacher') {
        const events = await getTeacherEventAttendance(user.id);
        setTeacherEvents(events);
        setRecords([]);
      } else {
        const rows = await getAttendanceHistory(user.id);
        setRecords(rows);
        setTeacherEvents([]);
      }
    } catch (error) {
      console.error('Failed to load attendance history:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadHistory();
    } finally {
      setRefreshing(false);
    }
  };

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
    />
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              ATTENDANCE
            </Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              History
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={23}
              color={colors.primary}
            />
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[styles.loadingText, { color: colors.textSecondary }]}
          >
            Loading attendance records...
          </Text>
        </View>
      </View>
    );
  }

  if (role === 'teacher') {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              TEACHER
            </Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Attendance History
            </Text>
            <Text
              style={[
                styles.subtitleHeader,
                { color: colors.textSecondary },
              ]}
            >
              Events you created and their attendance
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="school-outline"
              size={23}
              color={colors.primary}
            />
          </View>
        </View>

        {teacherEvents.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No events yet"
            message="Create an event from the Teacher tab to see attendance records here."
            colors={colors}
          />
        ) : (
          <FlatList
            data={teacherEvents}
            keyExtractor={(item) => item.eventId}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.eventHeader}>
                  <View
                    style={[
                      styles.eventIcon,
                      {
                        backgroundColor: isDark
                          ? '#26364B'
                          : '#EDF2F8',
                      },
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={23}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.eventInfo}>
                    <Text
                      style={[
                        styles.eventTitle,
                        { color: colors.textPrimary },
                      ]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>

                    <View style={styles.codeRow}>
                      <Ionicons
                        name="qr-code-outline"
                        size={13}
                        color={colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.eventCode,
                          { color: colors.primary },
                        ]}
                      >
                        {item.eventCode}
                      </Text>
                    </View>

                    <View style={styles.dateRow}>
                      <Ionicons
                        name="calendar-clear-outline"
                        size={13}
                        color={colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.eventMeta,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {formatDate(item.startTime)}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.countBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.countNumber}>
                      {item.attendeeCount}
                    </Text>
                    <Text style={styles.countLabel}>
                      {item.attendeeCount === 1
                        ? 'ATTENDEE'
                        : 'ATTENDEES'}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.border },
                  ]}
                />

                <View style={styles.studentsHeader}>
                  <View style={styles.studentsTitleRow}>
                    <Ionicons
                      name="people-outline"
                      size={17}
                      color={colors.textPrimary}
                    />
                    <Text
                      style={[
                        styles.attendeesTitle,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Students
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.studentCount,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.attendeeCount}
                  </Text>
                </View>

                {item.attendees.length === 0 ? (
                  <View style={styles.noAttendeesContainer}>
                    <Ionicons
                      name="person-remove-outline"
                      size={22}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.noAttendees,
                        { color: colors.textSecondary },
                      ]}
                    >
                      No students have scanned this QR code yet.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.attendeesList}>
                    {item.attendees.map((attendee) => (
                      <View
                        key={`${item.eventId}-${attendee.studentId}-${attendee.scannedAt}`}
                        style={[
                          styles.attendeeRow,
                          { borderTopColor: colors.border },
                        ]}
                      >
                        <View
                          style={[
                            styles.studentIcon,
                            {
                              backgroundColor: isDark
                                ? '#26364B'
                                : '#EDF2F8',
                            },
                          ]}
                        >
                          <Ionicons
                            name="person-outline"
                            size={16}
                            color={colors.primary}
                          />
                        </View>

                        <View style={styles.studentInfo}>
                          <Text
                            style={[
                              styles.studentId,
                              { color: colors.textPrimary },
                            ]}
                          >
                            {shortId(attendee.studentId)}
                          </Text>
                          <Text
                            style={[
                              styles.eventMeta,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {formatDate(attendee.scannedAt)}
                          </Text>
                        </View>

                        <Ionicons
                          name="checkmark-circle"
                          size={21}
                          color={isDark ? '#86D6A0' : '#2E7D32'}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            STUDENT
          </Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Attendance History
          </Text>
          <Text
            style={[
              styles.subtitleHeader,
              { color: colors.textSecondary },
            ]}
          >
            Your recent school event attendance
          </Text>
        </View>

        <View
          style={[
            styles.headerIcon,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="time-outline"
            size={23}
            color={colors.primary}
          />
        </View>
      </View>

      {records.length === 0 ? (
        <EmptyState
          icon="qr-code-outline"
          title="No attendance yet"
          message="Scan a QR code during a school event to register your attendance."
          colors={colors}
        />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          renderItem={({ item }) => (
            <View
              style={[
                styles.studentCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.studentCardIcon,
                  {
                    backgroundColor: isDark ? '#263B32' : '#EAF4EC',
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={27}
                  color={isDark ? '#86D6A0' : '#2E7D32'}
                />
              </View>

              <View style={styles.studentCardInfo}>
                <Text
                  style={[
                    styles.eventTitle,
                    { color: colors.textPrimary },
                  ]}
                  numberOfLines={2}
                >
                  {item.eventTitle}
                </Text>

                <View style={styles.codeRow}>
                  <Ionicons
                    name="qr-code-outline"
                    size={13}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.eventMeta,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.eventId}
                  </Text>
                </View>

                <View style={styles.dateRow}>
                  <Ionicons
                    name="time-outline"
                    size={13}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.eventMeta,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {formatDate(item.scannedAt)}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.attendedBadge,
                  { backgroundColor: isDark ? '#263B32' : '#EAF4EC' },
                ]}
              >
                <Text
                  style={[
                    styles.attendedText,
                    { color: isDark ? '#86D6A0' : '#2E7D32' },
                  ]}
                >
                  ATTENDED
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

function EmptyState({
  icon,
  title,
  message,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  colors: {
    background: string;
    card: string;
    primary: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    textLight: string;
  };
}) {
  return (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Ionicons name={icon} size={34} color={colors.primary} />
      </View>

      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>

      <Text
        style={[styles.emptyMessage, { color: colors.textSecondary }]}
      >
        {message}
      </Text>
    </View>
  );
}

function shortId(id: string) {
  return id ? `…${id.slice(-8)}` : 'unknown';
}

function formatDate(iso: string | null) {
  if (!iso) {
    return 'No date set';
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 5,
  },
  title: {
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitleHeader: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  list: {
    paddingBottom: 30,
  },
  card: {
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
    paddingRight: 8,
  },
  eventTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
    marginBottom: 6,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  eventCode: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  eventMeta: {
    fontSize: 12,
  },
  countBadge: {
    minWidth: 62,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNumber: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  countLabel: {
    marginTop: 2,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: 'rgba(255,255,255,0.8)',
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  studentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  studentsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  attendeesTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  studentCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  attendeesList: {
    marginTop: 2,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  studentIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  studentInfo: {
    flex: 1,
  },
  studentId: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  noAttendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  noAttendees: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  studentCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentCardInfo: {
    flex: 1,
  },
  attendedBadge: {
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginLeft: 6,
  },
  attendedText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 7,
  },
  emptyMessage: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
