import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';

import AppButton from '@/components/AppButton';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/lib/auth';
import { createEvent } from '@/lib/events';
import { getProfile, type Role } from '@/lib/profiles';
import { buildQRPayload } from '@/lib/qr';

function toLocalISO(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

function formatDateTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });

  return `${month} ${pad(date.getDate())}, ${date.getFullYear()} at ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

const QUICK_END_OPTIONS = [
  { label: '+30 min', ms: 30 * 60 * 1000 },
  { label: '+1 hour', ms: 60 * 60 * 1000 },
  { label: '+2 hours', ms: 2 * 60 * 60 * 1000 },
];

type EditTarget = 'start' | 'end';

export default function TeacherScreen() {
  const { user } = useAuth();

  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [eventId, setEventId] = useState('');

  const [startDate, setStartDate] = useState(() => new Date());

  const [endDate, setEndDate] = useState(
    () => new Date(Date.now() + 60 * 60 * 1000)
  );

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editingPart, setEditingPart] = useState<'date' | 'time'>('date');

  const [payload, setPayload] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isAndroid = Platform.OS === 'android';

  useFocusEffect(
    useCallback(() => {
      let active = true;

      setRoleLoading(true);

      if (!user) {
        setRole(null);
        setRoleLoading(false);

        return () => {
          active = false;
        };
      }

      getProfile(user.id).then((profile) => {
        if (!active) return;

        setRole(profile?.role ?? 'student');
        setRoleLoading(false);
      });

      return () => {
        active = false;
      };
    }, [user])
  );

  const openPicker = (target: EditTarget) => {
    setMessage(null);
    setEditTarget(target);
    setEditingPart('date');
  };

  const onPickerChange = (
    event: DateTimePickerEvent,
    selected?: Date
  ) => {
    if (!editTarget) return;

    if (event.type === 'dismissed' || !selected) {
      setEditTarget(null);
      setEditingPart('date');
      return;
    }

    const current =
      editTarget === 'start' ? startDate : endDate;

    const next = new Date(current);

    next.setFullYear(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate()
    );

    next.setHours(
      selected.getHours(),
      selected.getMinutes(),
      0,
      0
    );

    if (editTarget === 'start') {
      setStartDate(next);
    } else {
      setEndDate(next);
    }

    if (isAndroid && editingPart === 'date') {
      setEditingPart('time');
    } else {
      setEditTarget(null);
      setEditingPart('date');
    }
  };

  const handleQuickEnd = (ms: number) => {
    setMessage(null);
    setEndDate(
      new Date(startDate.getTime() + ms)
    );
  };

  const handleCreateEvent = () => {
    const event = {
      eventId: eventId.trim(),
      title: title.trim(),
      start: toLocalISO(startDate),
      end: toLocalISO(endDate),
    };

    if (!event.eventId || !event.title) {
      setMessage('Event title and code are required.');
      return;
    }

    if (endDate.getTime() <= startDate.getTime()) {
      setMessage('End time must be after start time.');
      return;
    }

    createEvent(event).then(({ error }) => {
      if (error) {
        setMessage(error);
        return;
      }

      setMessage(
        'Event saved! Scan the QR with the Scan tab to test it.'
      );

      setPayload(buildQRPayload(event));
    });
  };

  if (roleLoading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.stateIcon}>
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.centerTitle}>
          Checking your account...
        </Text>

        <Text style={styles.centerSubtitle}>
          Please wait while we verify your teacher access.
        </Text>
      </View>
    );
  }

  if (role !== 'teacher') {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.stateIcon}>
          <Ionicons
            name="lock-closed-outline"
            size={28}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.centerTitle}>
          Teachers Only
        </Text>

        <Text style={styles.centerSubtitle}>
          Only teacher accounts can create events.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            TEACHER PANEL
          </Text>

          <Text style={styles.title}>
            Create Event QR
          </Text>

          <Text style={styles.subtitle}>
            Fill in the event details, then generate a QR
            code for student attendance.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="qr-code-outline"
            size={24}
            color={COLORS.primary}
          />
        </View>
      </View>

      {/* EVENT DETAILS */}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          EVENT DETAILS
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            Event Title
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="text-outline"
              size={19}
              color={COLORS.textSecondary}
            />

            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Founders Day Assembly"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <Text style={styles.label}>
            Event Code
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="key-outline"
              size={19}
              color={COLORS.textSecondary}
            />

            <TextInput
              style={styles.input}
              value={eventId}
              onChangeText={setEventId}
              placeholder="e.g. EVT-2026-0002"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="characters"
            />
          </View>
        </View>
      </View>

      {/* EVENT SCHEDULE */}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          EVENT SCHEDULE
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            Starts
          </Text>

          <PickerField
            value={formatDateTime(startDate)}
            icon="sunny-outline"
            onPress={() => openPicker('start')}
          />

          <Text style={styles.label}>
            Ends
          </Text>

          <PickerField
            value={formatDateTime(endDate)}
            icon="moon-outline"
            onPress={() => openPicker('end')}
          />

          <Text style={styles.quickLabel}>
            QUICK END TIME
          </Text>

          <View style={styles.chipRow}>
            {QUICK_END_OPTIONS.map((option) => (
              <Pressable
                key={option.label}
                style={({ pressed }) => [
                  styles.chip,
                  pressed && styles.chipPressed,
                ]}
                onPress={() =>
                  handleQuickEnd(option.ms)
                }
              >
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={COLORS.primary}
                />

                <Text style={styles.chipText}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.hint}>
            Tap a chip to set the end time from start.
          </Text>
        </View>
      </View>

      {/* MESSAGE */}

      {message && (
        <View style={styles.messageCard}>
          <Ionicons
            name={
              message.startsWith('Event saved')
                ? 'checkmark-circle-outline'
                : 'alert-circle-outline'
            }
            size={20}
            color={COLORS.primary}
          />

          <Text style={styles.message}>
            {message}
          </Text>
        </View>
      )}

      {/* CREATE BUTTON */}

      <View style={styles.buttonSection}>
        <AppButton
          theme="primary"
          title="Create Event"
          icon="add-circle-outline"
          onPress={handleCreateEvent}
        />
      </View>

      {/* DATE PICKER */}

      {editTarget && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={
              editTarget === 'start'
                ? startDate
                : endDate
            }
            mode={
              isAndroid
                ? editingPart
                : 'datetime'
            }
            display={
              isAndroid
                ? 'default'
                : 'spinner'
            }
            onChange={onPickerChange}
          />
        </View>
      )}

      {/* QR RESULT */}

      {payload && (
        <View style={styles.qrSection}>
          <View style={styles.qrSectionHeader}>
            <View style={styles.qrHeaderText}>
              <Text style={styles.sectionLabel}>
                ATTENDANCE QR
              </Text>

              <Text style={styles.qrTitle}>
                Ready to Scan
              </Text>
            </View>

            <View style={styles.readyBadge}>
              <View style={styles.readyDot} />

              <Text style={styles.readyText}>
                READY
              </Text>
            </View>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              Scan this QR code with the Scan tab
            </Text>

            <Text style={styles.resultSubtitle}>
              Students can scan this code to record
              their attendance for this event.
            </Text>

            <View style={styles.qrBox}>
              <QRCode
                value={payload}
                size={200}
              />
            </View>

            <View style={styles.eventInfo}>
              <InfoRow
                icon="calendar-outline"
                label="Starts"
                value={formatDateTime(startDate)}
              />

              <InfoRow
                icon="time-outline"
                label="Ends"
                value={formatDateTime(endDate)}
              />

              <InfoRow
                icon="key-outline"
                label="Event Code"
                value={eventId || '—'}
              />
            </View>

            <View style={styles.payloadBox}>
              <Text style={styles.payloadLabel}>
                QR PAYLOAD
              </Text>

              <Text style={styles.payloadText}>
                {payload}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* FOOTER */}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          QR Attendance • Teacher Panel
        </Text>
      </View>
    </ScrollView>
  );
}

type PickerFieldProps = {
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function PickerField({
  value,
  icon,
  onPress,
}: PickerFieldProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.pickerField,
        pressed && styles.pickerFieldPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.pickerIcon}>
        <Ionicons
          name={icon}
          size={19}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.pickerValue}>
        {value}
      </Text>

      <Ionicons
        name="chevron-forward-outline"
        size={18}
        color={COLORS.textSecondary}
      />
    </Pressable>
  );
}

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={16}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  headerText: {
    flex: 1,
    paddingRight: 18,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.primary,
    marginBottom: 7,
  },

  title: {
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
    marginTop: 7,
    maxWidth: 330,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* SECTIONS */

  section: {
    marginBottom: 22,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },

  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 17,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },

  /* INPUTS */

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 2,
  },

  inputContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 0,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  /* PICKER */

  pickerField: {
    minHeight: 55,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 11,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  pickerFieldPressed: {
    opacity: 0.7,
  },

  pickerIcon: {
    width: 37,
    height: 37,
    borderRadius: 11,
    backgroundColor: `${COLORS.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  pickerValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },

  /* QUICK END */

  quickLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
    marginTop: 1,
    marginBottom: 9,
  },

  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },

  chip: {
    flex: 1,
    minHeight: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 7,
  },

  chipPressed: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },

  hint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 9,
  },

  /* MESSAGE */

  messageCard: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
    backgroundColor: `${COLORS.primary}0D`,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },

  message: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  /* BUTTON */

  buttonSection: {
    marginTop: 1,
  },

  /* PICKER */

  pickerContainer: {
    marginTop: 14,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 8,
  },

  /* QR SECTION */

  qrSection: {
    marginTop: 30,
  },

  qrSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 11,
  },

  qrHeaderText: {
    flex: 1,
  },

  qrTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: `${COLORS.primary}0D`,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  readyText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: COLORS.primary,
  },

  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },

  resultTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  resultSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 290,
  },

  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  /* EVENT INFO */

  eventInfo: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 18,
    paddingTop: 16,
    gap: 13,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: `${COLORS.primary}0D`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  /* PAYLOAD */

  payloadBox: {
    width: '100%',
    marginTop: 17,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  payloadLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },

  payloadText: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textSecondary,
    textAlign: 'left',
  },

  /* STATES */

  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  stateIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  centerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  centerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginTop: 7,
    textAlign: 'center',
    maxWidth: 300,
  },

  /* FOOTER */

  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  footerText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});