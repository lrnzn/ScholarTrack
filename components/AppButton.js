import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

export default function AppButton({ title, onPress, variant = 'primary', style, disabled }) {
  const isSecondary = variant === 'secondary';
  const pressHandled = useRef(false);

  const handlePress = () => {
    if (disabled) {
      return;
    }

    pressHandled.current = true;
    onPress?.();
  };

  const handleTouchEnd = () => {
    if (disabled) {
      return;
    }

    setTimeout(() => {
      if (!pressHandled.current) {
        onPress?.();
      }
      pressHandled.current = false;
    }, 120);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={handlePress}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
      style={[styles.button, isSecondary ? styles.secondary : styles.primary, disabled && styles.disabled, style]}
    >
      <Text style={[styles.text, isSecondary && styles.secondaryText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.button,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    ...typography.label,
    color: colors.surface,
    fontSize: 15,
  },
  secondaryText: {
    color: colors.primary,
  },
  disabled: {
    opacity: 0.55,
  },
});
