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

import { COLORS } from '@/constants/colors';
import { useAuth } from '@/lib/auth';
import { getProfile, type Role } from '@/lib/profiles';
import {
  getAttendanceHistory,
  getTeacherEventAttendance,
  type AttendanceRecord,
  type TeacherEventAttendance,
} from '@/lib/attendance';

export default function HistoryScreen() {
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
      setLoading(false);
      return;
    }

    setLoading(true);

    const profile = await getProfile(user.id);
    const currentRole = profile?.role ?? 'student';

    setRole(currentRole);

    if (currentRole === 'teacher') {
      const events = await getTeacherEventAttendance(user.id);

      setTeacherEvents(events);
      setRecords([]);
    } else {
      const studentId = user.id;
      const rows = await getAttendanceHistory(studentId);

      setRecords(rows);
      setTeacherEvents([]);
    }

    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>ATTENDANCE</Text>
            <Text style={styles.title}>History</Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="time-outline"
              size={23}
              color={COLORS.primary}
            />
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
          <Text style={styles.loadingText}>
            Loading attendance records...
          </Text>
        </View>
      </View>
    );
  }

  if (role === 'teacher') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.eyebrow}>TEACHER</Text>
            <Text style={styles.title}>Attendance History</Text>
            <Text style={styles.subtitleHeader}>
              Events you created and their attendance
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="school-outline"
              size={23}
              color={COLORS.primary}
            />
          </View>
        </View>

        {teacherEvents.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No events yet"
            message="Create an event from the Teacher tab to see attendance records here."
          />
        ) : (
          <FlatList
            data={teacherEvents}
            keyExtractor={(item) => item.eventId}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={COLORS.primary}
              />
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                {/* Event Header */}
                <View style={styles.eventHeader}>
                  <View style={styles.eventIcon}>
                    <Ionicons
                      name="calendar-outline"
                      size={23}
                      color={COLORS.primary}
                    />
                  </View>

                  <View style={styles.eventInfo}>
                    <Text
                      style={styles.eventTitle}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>

                    <View style={styles.codeRow}>
                      <Ionicons
                        name="qr-code-outline"
                        size={13}
                        color={COLORS.textSecondary}
                      />

                      <Text style={styles.eventCode}>
                        {item.eventCode}
                      </Text>
                    </View>

                    <View style={styles.dateRow}>
                      <Ionicons
                        name="calendar-clear-outline"
                        size={13}
                        color={COLORS.textSecondary}
                      />

                      <Text style={styles.eventMeta}>
                        {formatDate(item.startTime)}
                      </Text>
                    </View>
                  </View>

                  {/* Attendee Count */}
                  <View style={styles.countBadge}>
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

                {/* Divider */}
                <View style={styles.divider} />

                {/* Students */}
                <View style={styles.studentsHeader}>
                  <View style={styles.studentsTitleRow}>
                    <Ionicons
                      name="people-outline"
                      size={17}
                      color={COLORS.textPrimary}
                    />

                    <Text style={styles.attendeesTitle}>
                      Students
                    </Text>
                  </View>

                  <Text style={styles.studentCount}>
                    {item.attendeeCount}
                  </Text>
                </View>

                {item.attendees.length === 0 ? (
                  <View style={styles.noAttendeesContainer}>
                    <Ionicons
                      name="person-remove-outline"
                      size={22}
                      color={COLORS.textSecondary}
                    />

                    <Text style={styles.noAttendees}>
                      No students have scanned this QR code yet.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.attendeesList}>
                    {item.attendees.map((attendee) => (
                      <View
                        key={`${item.eventId}-${attendee.studentId}-${attendee.scannedAt}`}
                        style={styles.attendeeRow}
                      >
                        <View style={styles.studentIcon}>
                          <Ionicons
                            name="person-outline"
                            size={16}
                            color={COLORS.primary}
                          />
                        </View>

                        <View style={styles.studentInfo}>
                          <Text style={styles.studentId}>
                            {shortId(attendee.studentId)}
                          </Text>

                          <Text style={styles.eventMeta}>
                            {formatDate(attendee.scannedAt)}
                          </Text>
                        </View>

                        <Ionicons
                          name="checkmark-circle"
                          size={21}
                          color="#2E7D32"
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>STUDENT</Text>
          <Text style={styles.title}>Attendance History</Text>
          <Text style={styles.subtitleHeader}>
            Your recent school event attendance
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="time-outline"
            size={23}
            color={COLORS.primary}
          />
        </View>
      </View>

      {records.length === 0 ? (
        <EmptyState
          icon="qr-code-outline"
          title="No attendance yet"
          message="Scan a QR code during a school event to register your attendance."
        />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.studentCardIcon}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={27}
                  color="#2E7D32"
                />
              </View>

              <View style={styles.studentCardInfo}>
                <Text
                  style={styles.eventTitle}
                  numberOfLines={2}
                >
                  {item.eventTitle}
                </Text>

                <View style={styles.codeRow}>
                  <Ionicons
                    name="qr-code-outline"
                    size={13}
                    color={COLORS.textSecondary}
                  />

                  <Text style={styles.eventMeta}>
                    {item.eventId}
                  </Text>
                </View>

                <View style={styles.dateRow}>
                  <Ionicons
                    name="time-outline"
                    size={13}
                    color={COLORS.textSecondary}
                  />

                  <Text style={styles.eventMeta}>
                    {formatDate(item.scannedAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.attendedBadge}>
                <Text style={styles.attendedText}>
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

/* -------------------------------------------------------
   Components
------------------------------------------------------- */

function EmptyState({
  icon,
  title,
  message,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name={icon}
          size={34}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.emptyTitle}>{title}</Text>

      <Text style={styles.emptyMessage}>
        {message}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

function shortId(id: string) {
  return id ? `…${id.slice(-8)}` : 'unknown';
}

function formatDate(iso: string | null) {
  if (!iso) {
    return 'No date set';
  }

  return new Date(iso).toLocaleString();
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

  headerTextContainer: {
    flex: 1,
    paddingRight: 15,
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

  subtitleHeader: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E6EC',

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    backgroundColor: '#EDF2F8',
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
    color: COLORS.textPrimary,
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
    color: COLORS.primary,
    letterSpacing: 0.4,
  },

  eventMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  countBadge: {
    minWidth: 62,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
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
    backgroundColor: '#E8EBF0',
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
    color: COLORS.textPrimary,
  },

  studentCount: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  attendeesList: {
    marginTop: 2,
  },

  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F3',
  },

  studentIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDF2F8',
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
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },

  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E6EC',

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  studentCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EAF4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  studentCardInfo: {
    flex: 1,
  },

  attendedBadge: {
    backgroundColor: '#EAF4EC',
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginLeft: 6,
  },

  attendedText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#2E7D32',
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
    backgroundColor: '#EAF0F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 7,
  },

  emptyMessage: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

