import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

export default function ScholarshipCard({ scholarship, isSaved = false, onToggleSave, showSaveAction = true }) {
  const openLink = async () => {
    try {
      const canOpen = await Linking.canOpenURL(scholarship.link);
      if (canOpen) {
        Alert.alert('Open scholarship page?', `You are leaving the app to view ${scholarship.name}.`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Link',
            onPress: () => Linking.openURL(scholarship.link),
          },
        ]);
        return;
      }

      Alert.alert('Link unavailable', 'This scholarship link cannot be opened on your device.');
    } catch (error) {
      Alert.alert('Link error', 'Unable to open this scholarship link right now.');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{isSaved ? 'Saved' : 'Eligible'}</Text>
        </View>
        <Text style={styles.deadline}>{scholarship.deadline}</Text>
      </View>
      <Text style={styles.title}>{scholarship.name}</Text>
      <Text style={styles.description}>{scholarship.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Courses</Text>
        <Text style={styles.courses}>{scholarship.eligibleCourses.join(' • ')}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={openLink} style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
          <Text style={styles.linkButtonText}>Open Link</Text>
        </Pressable>
        {showSaveAction ? (
          <AppButton
            title={isSaved ? 'Unsave' : 'Save'}
            variant={isSaved ? 'secondary' : 'primary'}
            onPress={() => onToggleSave?.(scholarship)}
            style={styles.saveButton}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E6EDF8',
    gap: spacing.sm,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.96,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: '#EAFBF4',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    ...typography.small,
    color: '#047857',
  },
  deadline: {
    ...typography.small,
    color: colors.accent,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.mutedText,
  },
  footer: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#EDF2FA',
    gap: 2,
  },
  footerLabel: {
    ...typography.small,
    color: colors.mutedText,
  },
  courses: {
    ...typography.label,
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  linkButton: {
    minHeight: 54,
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  linkButtonText: {
    ...typography.label,
    color: colors.primary,
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
  },
});
