
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import AppButton from '@/components/AppButton';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/lib/auth';
import { registerAttendance } from '@/lib/attendance';

export default function ScanScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastData, setLastData] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned || submitting) return;

    setScanned(true);
    setLastData(data);
    setMessage(null);
    setSubmitting(true);

    try {
      if (!user?.id) {
        setMessage('Please log in before recording attendance.');
        setSuccess(false);
        return;
      }

      const result = await registerAttendance(data, user.id);
      setMessage(result.message);
      setSuccess(result.success);
    } catch (error) {
      console.error('Attendance registration failed:', error);
      setMessage('Could not record attendance. Please try again.');
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setLastData(null);
    setMessage(null);
    setSuccess(false);
    setSubmitting(false);
  };

  if (!permission) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Checking camera permission...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.permissionIcon,
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={{ color: colors.primary, fontSize: 36 }}>
            QR
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Camera Permission Needed
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We need access to your camera to scan QR codes and record your
          attendance.
        </Text>

        <AppButton
          theme="primary"
          title="Grant Permission"
          icon="camera"
          onPress={requestPermission}
        />
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
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={
          scanned || submitting ? undefined : handleBarcodeScanned
        }
      />

      <View style={styles.cameraHeader}>
        <Text style={styles.cameraHeaderTitle}>QR Attendance Scanner</Text>
        <Text style={styles.cameraHeaderSubtitle}>
          Position the QR code inside your camera view.
        </Text>
      </View>

      <View
        style={[
          styles.overlay,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.overlayText,
            { color: colors.textPrimary },
          ]}
        >
          {scanned
            ? 'QR Code detected!'
            : 'Point your camera at a QR code'}
        </Text>

        {!scanned && (
          <Text
            style={[
              styles.helperText,
              { color: colors.textSecondary },
            ]}
          >
            Keep the code steady until it is recognized.
          </Text>
        )}

        {submitting && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text
              style={[
                styles.helperText,
                { color: colors.textSecondary, marginBottom: 0 },
              ]}
            >
              Recording attendance...
            </Text>
          </View>
        )}

        {scanned && message && (
          <Text
            style={[
              styles.scanResult,
              {
                color: success
                  ? isDark
                    ? '#86D6A0'
                    : '#2E7D32'
                  : isDark
                    ? '#FCA5A5'
                    : '#C62828',
              },
            ]}
          >
            {message}
          </Text>
        )}

        {scanned && lastData && (
          <View
            style={[
              styles.dataContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <Text
              style={[
                styles.dataLabel,
                { color: colors.textSecondary },
              ]}
            >
              Scanned QR data
            </Text>
            <Text
              selectable
              style={[
                styles.scanData,
                { color: colors.textPrimary },
              ]}
            >
              {lastData}
            </Text>
          </View>
        )}

        {scanned && !submitting && (
          <View style={styles.buttonContainer}>
            <AppButton
              theme="primary"
              title="Scan Again"
              icon="refresh"
              onPress={handleScanAgain}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  permissionIcon: {
    width: 76,
    height: 76,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  cameraHeader: {
    position: 'absolute',
    top: 24,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
  },
  cameraHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  cameraHeaderSubtitle: {
    color: '#F3F4F6',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  overlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 30,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    maxHeight: '55%',
  },
  overlayText: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  helperText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  scanResult: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  dataContainer: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  dataLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 5,
  },
  scanData: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
});
