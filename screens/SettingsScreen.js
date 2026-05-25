import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import { clearSavedScholarships, getSettings, getUser, saveSettings } from '../utils/storage';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    notifications: true,
    deadlineReminders: true,
    profileVisibility: false,
    dataSaver: false,
  });
  const [user, setUser] = useState(null);

  const loadSettings = useCallback(async () => {
    try {
      const [storedSettings, storedUser] = await Promise.all([getSettings(), getUser()]);
      setSettings(storedSettings);
      setUser(storedUser);
    } catch (error) {
      Alert.alert('Storage error', 'Unable to load settings.');
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSetting = async (key, value) => {
    try {
      const nextSettings = { ...settings, [key]: value };
      setSettings(nextSettings);
      await saveSettings(nextSettings);
      Alert.alert('Setting updated', 'Your preference has been saved.');
    } catch (error) {
      Alert.alert('Storage error', 'Unable to save this setting.');
    }
  };

  const handleClearSaved = () => {
    Alert.alert('Clear saved scholarships?', 'This removes all scholarships from your saved list.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearSavedScholarships();
            Alert.alert('Saved list cleared', 'All saved scholarships were removed.');
          } catch (error) {
            Alert.alert('Storage error', 'Unable to clear saved scholarships.');
          }
        },
      },
    ]);
  };

  const handleHelp = () => {
    Alert.alert(
      'Help Center',
      'Use Home to search eligible scholarships, Saved to manage your shortlist, and Profile to update your student information.'
    );
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy', 'This Snack version stores your account, profile photo URI, saved scholarships, and settings locally on this device only.');
  };

  const handleAbout = () => {
    Alert.alert('About Scholarship Finder PH', 'A local-only scholarship matching app for students in the Philippines.\n\nDeveloped by: De los Reyes, Ilon, Gonzales J.');
  };

  const handleLogout = () => {
    Alert.alert('Log out?', 'You will return to the login screen. Your account remains saved locally.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => navigation.replace('Login'),
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <AppButton title="Back" variant="secondary" onPress={() => navigation.goBack()} style={styles.backButton} />
        </View>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>Account settings</Text>
          <Text style={styles.title}>Manage your app preferences</Text>
          <Text style={styles.subtitle}>{user?.email || 'Local student account'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingSwitch
            title="Scholarship Notifications"
            description="Receive local reminders about scholarship updates."
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
          />
          <SettingSwitch
            title="Deadline Reminders"
            description="Keep deadline reminders enabled for saved scholarships."
            value={settings.deadlineReminders}
            onValueChange={(value) => updateSetting('deadlineReminders', value)}
          />
          <SettingSwitch
            title="Profile Visibility"
            description="Allow your profile card to show more student details."
            value={settings.profileVisibility}
            onValueChange={(value) => updateSetting('profileVisibility', value)}
          />
          <SettingSwitch
            title="Data Saver"
            description="Reduce image-heavy screens when browsing scholarships."
            value={settings.dataSaver}
            onValueChange={(value) => updateSetting('dataSaver', value)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingsRow title="Privacy & Data" description="Review what is stored locally." onPress={handlePrivacy} />
          <SettingsRow title="Help Center" description="Learn how to use the app." onPress={handleHelp} />
          <SettingsRow title="About App" description="Version, purpose, and credits." onPress={handleAbout} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>
          <AppButton title="Clear Saved Scholarships" variant="secondary" onPress={handleClearSaved} />
          <AppButton title="Log Out" variant="secondary" onPress={handleLogout} style={styles.accountButton} />
        </View>
      </ScrollView>
    </View>
  );
}

function SettingSwitch({ title, description, value, onValueChange }) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D6DEEB', true: '#BFD4FF' }}
        thumbColor={value ? colors.primary : '#F8FAFF'}
      />
    </View>
  );
}

function SettingsRow({ title, description, onPress }) {
  return (
    <View style={styles.linkRow}>
      <View style={styles.settingText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <AppButton title="Open" variant="secondary" onPress={onPress} style={styles.openButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 58,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
  },
  backButton: {
    width: 106,
  },
  header: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.soft,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.soft,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#EDF2FA',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#EDF2FA',
  },
  settingText: {
    flex: 1,
  },
  rowTitle: {
    ...typography.label,
    color: colors.text,
  },
  rowDescription: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: 2,
  },
  openButton: {
    width: 86,
  },
  accountButton: {
    marginTop: spacing.xs,
  },
});