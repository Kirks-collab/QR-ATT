import Ionicons from '@expo/vector-icons/Ionicons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  theme?: 'primary';
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function AppButton({
  title,
  icon,
  theme,
  onPress,
  loading = false,
  disabled = false,
}: Props) {
  const isPrimary = theme === 'primary';
  const isDisabled = disabled || loading;

  return (
    <View
      style={[
        styles.buttonOuter,
        isPrimary && {
          borderWidth: 1,
          borderColor: COLORS.primary,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.buttonInner,
          isPrimary && { backgroundColor: COLORS.primary },
          pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isPrimary ? COLORS.textLight : COLORS.textSecondary}
            style={styles.icon}
          />
        ) : (
          <Ionicons
            name={icon}
            size={22}
            color={isPrimary ? COLORS.textLight : COLORS.textSecondary}
            style={styles.icon}
          />
        )}

        <Text
          style={[
            styles.label,
            isPrimary && {
              color: COLORS.textLight,
              fontWeight: '700',
            },
          ]}
        >
          {loading ? 'Please wait...' : title}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    width: '100%',
    marginBottom: 14,
    borderRadius: 10,
  },
  buttonInner: {
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
});
