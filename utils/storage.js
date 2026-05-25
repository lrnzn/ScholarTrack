import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@scholarship_finder_user';
const SAVED_SCHOLARSHIPS_KEY = '@scholarship_finder_saved_ids';
const SETTINGS_KEY = '@scholarship_finder_settings';

const defaultSettings = {
  notifications: true,
  deadlineReminders: true,
  profileVisibility: false,
  dataSaver: false,
};

export async function saveUser(user) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser() {
  const value = await AsyncStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) : null;
}

export async function getSavedScholarshipIds() {
  const value = await AsyncStorage.getItem(SAVED_SCHOLARSHIPS_KEY);
  return value ? JSON.parse(value) : [];
}

export async function saveScholarshipIds(ids) {
  await AsyncStorage.setItem(SAVED_SCHOLARSHIPS_KEY, JSON.stringify(ids));
}

export async function clearSavedScholarships() {
  await AsyncStorage.removeItem(SAVED_SCHOLARSHIPS_KEY);
}

export async function saveScholarship(id) {
  const currentIds = await getSavedScholarshipIds();
  if (currentIds.includes(id)) {
    return currentIds;
  }

  const nextIds = [...currentIds, id];
  await saveScholarshipIds(nextIds);
  return nextIds;
}

export async function unsaveScholarship(id) {
  const currentIds = await getSavedScholarshipIds();
  const nextIds = currentIds.filter((savedId) => savedId !== id);
  await saveScholarshipIds(nextIds);
  return nextIds;
}

export async function getSettings() {
  const value = await AsyncStorage.getItem(SETTINGS_KEY);
  return value ? { ...defaultSettings, ...JSON.parse(value) } : defaultSettings;
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
