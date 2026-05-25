import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import ScholarshipCard from '../components/ScholarshipCard';
import { scholarships } from '../data/scholarships';
import { getSavedScholarshipIds, unsaveScholarship } from '../utils/storage';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

export default function SavedScreen({ navigation }) {
  const [savedIds, setSavedIds] = useState([]);

  const loadSavedScholarships = useCallback(async () => {
    try {
      const storedSavedIds = await getSavedScholarshipIds();
      setSavedIds(storedSavedIds);
    } catch (error) {
      Alert.alert('Storage error', 'Unable to load your saved scholarships.');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSavedScholarships);
    return unsubscribe;
  }, [loadSavedScholarships, navigation]);

  const savedScholarships = useMemo(() => {
    return scholarships.filter((scholarship) => savedIds.includes(scholarship.id));
  }, [savedIds]);

  const handleUnsave = (scholarship) => {
    Alert.alert('Remove saved scholarship?', `${scholarship.name} will be removed from your saved list.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unsave',
        style: 'destructive',
        onPress: async () => {
          try {
            const nextIds = await unsaveScholarship(scholarship.id);
            setSavedIds(nextIds);
            Alert.alert('Scholarship removed', `${scholarship.name} was removed from your saved list.`);
          } catch (error) {
            Alert.alert('Storage error', 'Unable to update your saved scholarships.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <AppButton title="Back" variant="secondary" onPress={() => navigation.goBack()} style={styles.backButton} />
        </View>
        <Text style={styles.eyebrow}>Saved scholarships</Text>
        <Text style={styles.title}>Your application shortlist</Text>
        <Text style={styles.subtitle}>Keep track of scholarships you want to review or apply for later.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Text style={styles.summaryNumber}>{savedScholarships.length}</Text>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>Saved items</Text>
            <Text style={styles.summarySubtitle}>Tap Unsave to remove a scholarship from this page.</Text>
          </View>
        </View>

        {savedScholarships.length > 0 ? (
          savedScholarships.map((item) => (
            <ScholarshipCard key={item.id} scholarship={item} isSaved onToggleSave={handleUnsave} />
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No saved scholarships yet</Text>
            <Text style={styles.emptyBody}>Save scholarships from the Home page to build your personal application list.</Text>
            <AppButton title="Find Scholarships" onPress={() => navigation.navigate('Home')} style={styles.emptyButton} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: 58,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    ...shadows.soft,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 106,
  },
  eyebrow: {
    ...typography.label,
    color: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.surface,
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: '#DDE8FF',
    marginTop: spacing.sm,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E6EDF8',
    ...shadows.soft,
  },
  summaryNumber: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  summarySubtitle: {
    ...typography.body,
    color: colors.mutedText,
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.soft,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  emptyBody: {
    ...typography.body,
    color: colors.mutedText,
  },
  emptyButton: {
    marginTop: spacing.sm,
  },
});
