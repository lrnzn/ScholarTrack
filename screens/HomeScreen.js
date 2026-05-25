import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, ImageBackground, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../components/AppButton';
import ScholarshipCard from '../components/ScholarshipCard';
import { scholarships } from '../data/scholarships';
import { getSavedScholarshipIds, getUser, saveScholarship, unsaveScholarship } from '../utils/storage';
import { colors, spacing, typography } from '../theme/theme';

const HOME_IMAGE =
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1400&q=80';

export default function HomeScreen({ navigation, route }) {
  const fade = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState(route.params?.user || null);
  const [savedIds, setSavedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadScreenData = useCallback(async () => {
    try {
      const storedUser = await getUser();
      if (!storedUser) {
        navigation.replace('Login');
        return;
      }
      setUser(storedUser);
      const storedSavedIds = await getSavedScholarshipIds();
      setSavedIds(storedSavedIds);
    } catch (error) {
      Alert.alert('Storage error', 'Unable to load your account.');
    }
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadScreenData);
    return unsubscribe;
  }, [loadScreenData, navigation]);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const matchedScholarships = useMemo(() => {
    if (!user?.course) {
      return [];
    }
    return scholarships.filter((item) => item.eligibleCourses.includes(user.course));
  }, [user]);

  const visibleScholarships = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return matchedScholarships;
    }

    return matchedScholarships.filter((item) => {
      const searchableText = [
        item.name,
        item.description,
        item.deadline,
        item.eligibleCourses.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [matchedScholarships, searchQuery]);

  const handleToggleSave = async (scholarship) => {
    try {
      if (savedIds.includes(scholarship.id)) {
        const nextIds = await unsaveScholarship(scholarship.id);
        setSavedIds(nextIds);
        Alert.alert('Scholarship removed', `${scholarship.name} was removed from your saved list.`);
        return;
      }

      const nextIds = await saveScholarship(scholarship.id);
      setSavedIds(nextIds);
      Alert.alert('Scholarship saved', `${scholarship.name} was added to your saved list.`);
    } catch (error) {
      Alert.alert('Storage error', 'Unable to update your saved scholarships.');
    }
  };

  return (
    <View style={styles.screen}>
      <ImageBackground source={{ uri: HOME_IMAGE }} resizeMode="cover" style={styles.hero}>
        <LinearGradient colors={['rgba(9,21,52,0.86)', 'rgba(9,21,52,0.58)', 'rgba(244,247,251,1)']} style={styles.heroOverlay}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>Matched for {user?.course || 'your course'}</Text>
              <Text style={styles.title}>Scholarships you can apply for</Text>
            </View>
            <View style={styles.headerActions}>
              <AppButton title="Saved" variant="secondary" onPress={() => navigation.navigate('Saved')} />
              <AppButton title="Profile" variant="secondary" onPress={() => navigation.navigate('Profile')} />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      <Animated.View style={[styles.feed, { opacity: fade }]}>
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          <View style={styles.summary}>
            <Text style={styles.summaryNumber}>{visibleScholarships.length}</Text>
            <View style={styles.summaryText}>
              <Text style={styles.summaryTitle}>Eligible scholarships</Text>
              <Text style={styles.summarySubtitle}>
                {searchQuery.trim() ? 'Search results within your eligible scholarships.' : 'Filtered automatically using your saved course/program.'}
              </Text>
            </View>
          </View>

          <View style={styles.searchBox}>
            <Text style={styles.searchLabel}>Search Scholarships</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name, deadline, or course"
              placeholderTextColor="#8B98AA"
              style={styles.searchInput}
            />
          </View>

          {visibleScholarships.length > 0 ? (
            visibleScholarships.map((item) => (
              <ScholarshipCard
                key={item.id}
                scholarship={item}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={handleToggleSave}
              />
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>{searchQuery.trim() ? 'No search results' : 'No matches yet'}</Text>
              <Text style={styles.emptyBody}>
                {searchQuery.trim()
                  ? 'Try another keyword, scholarship name, deadline, or course code.'
                  : 'Update your profile course using common codes such as BSIT, BSHM, BSEd, BSBA, BSA, or BSN.'}
              </Text>
              {searchQuery.trim() ? (
                <AppButton title="Clear Search" onPress={() => setSearchQuery('')} style={styles.emptyButton} />
              ) : (
                <AppButton title="Edit Profile" onPress={() => navigation.navigate('Profile')} style={styles.emptyButton} />
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    height: 250,
  },
  heroOverlay: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: 62,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
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
  headerActions: {
    width: 106,
    gap: spacing.sm,
  },
  feed: {
    flex: 1,
    marginTop: -44,
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
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.lg,
  },
  summaryNumber: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '900',
    color: colors.surface,
    letterSpacing: 0,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    ...typography.subtitle,
    color: colors.surface,
  },
  summarySubtitle: {
    ...typography.body,
    color: '#DDE8FF',
  },
  searchBox: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E6EDF8',
  },
  searchLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  searchInput: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#D9E2F2',
    paddingHorizontal: spacing.md,
    color: colors.text,
    ...typography.body,
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'flex-start',
    gap: spacing.sm,
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
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
});
