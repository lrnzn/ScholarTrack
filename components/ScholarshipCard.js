import React, { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import { getCourseLabel } from '../data/dropdownOptions';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

export default function ScholarshipCard({ scholarship, isSaved = false, onToggleSave, showSaveAction = true }) {
  const [expanded, setExpanded] = useState(false);

  const isOpen = useMemo(() => {
    const deadline = new Date(`${scholarship.deadlineDate}T23:59:59`);
    return deadline >= new Date();
  }, [scholarship.deadlineDate]);

  const savedCount = scholarship.savedCount + (isSaved ? 1 : 0);
  const courseLabels = scholarship.eligibleCourses.map(getCourseLabel).join(' • ');

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
      <Pressable onPress={() => setExpanded((current) => !current)} style={({ pressed }) => [styles.infoArea, pressed && styles.pressed]}>
        <View style={styles.topRow}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{isSaved ? 'Saved' : 'Eligible'}</Text>
            </View>
            <View style={[styles.statusBadge, isOpen ? styles.openBadge : styles.closedBadge]}>
              <Text style={[styles.statusText, isOpen ? styles.openText : styles.closedText]}>{isOpen ? 'Open' : 'Closed'}</Text>
            </View>
          </View>
          <Text style={styles.deadline}>{scholarship.deadline}</Text>
        </View>
        <Text style={styles.title}>{scholarship.name}</Text>
        <Text style={styles.description}>{scholarship.description}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.savedCount}>{savedCount} users saved this</Text>
          <Text style={styles.expandText}>{expanded ? 'Hide details ^' : 'View details v'}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>Courses</Text>
          <Text style={styles.courses}>{courseLabels}</Text>
        </View>
        {expanded ? (
          <View style={styles.details}>
            <Text style={styles.detailTitle}>Summary</Text>
            <Text style={styles.detailBody}>{scholarship.summary}</Text>
            <Text style={styles.detailTitle}>Requirements</Text>
            {scholarship.requirements.map((requirement) => (
              <Text key={requirement} style={styles.requirement}>
                - {requirement}
              </Text>
            ))}
          </View>
        ) : null}
      </Pressable>
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
  infoArea: {
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 1,
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
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  openBadge: {
    backgroundColor: '#EEFDF3',
  },
  closedBadge: {
    backgroundColor: '#FFF1F2',
  },
  statusText: {
    ...typography.small,
    fontWeight: '800',
  },
  openText: {
    color: '#047857',
  },
  closedText: {
    color: '#BE123C',
  },
  deadline: {
    ...typography.small,
    color: colors.accent,
    textAlign: 'right',
    flexShrink: 0,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.mutedText,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  savedCount: {
    ...typography.small,
    color: colors.mutedText,
    flex: 1,
  },
  expandText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '800',
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
  details: {
    marginTop: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#EDF2FA',
    gap: spacing.xs,
  },
  detailTitle: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.xs,
  },
  detailBody: {
    ...typography.body,
    color: colors.mutedText,
  },
  requirement: {
    ...typography.body,
    color: colors.mutedText,
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
