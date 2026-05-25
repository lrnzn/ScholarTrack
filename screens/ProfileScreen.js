import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppButton from '../components/AppButton';
import DropdownInput from '../components/DropdownInput';
import AppInput from '../components/AppInput';
import { provinceOptions, sexOptions } from '../data/dropdownOptions';
import { getUser, saveUser } from '../utils/storage';
import { normalizeCourse, validateProfile } from '../utils/validation';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({
    fullName: '',
    age: '',
    sex: '',
    address: '',
    course: '',
    photoUri: '',
  });

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await getUser();
      if (!storedUser) {
        navigation.replace('Login');
        return;
      }
      setUser(storedUser);
      setValues({
        fullName: storedUser.fullName,
        age: storedUser.age,
        sex: storedUser.sex,
        address: storedUser.address,
        course: storedUser.course,
        photoUri: storedUser.photoUri || '',
      });
    } catch (error) {
      Alert.alert('Storage error', 'Unable to load your profile.');
    }
  }, [navigation]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Profile loading', 'Please wait until your profile finishes loading.');
      return;
    }

    const validationMessage = validateProfile(values);
    if (validationMessage) {
      Alert.alert('Check your profile', validationMessage);
      return;
    }

    try {
      const updatedUser = {
        ...user,
        ...values,
        fullName: values.fullName.trim(),
        age: values.age.trim(),
        sex: values.sex.trim(),
        address: values.address.trim(),
        course: normalizeCourse(values.course),
        photoUri: values.photoUri,
      };
      await saveUser(updatedUser);
      setUser(updatedUser);
      setEditing(false);
      Alert.alert('Profile updated', 'Your scholarship matches will refresh automatically.');
    } catch (error) {
      Alert.alert('Storage error', 'Unable to save your profile.');
    }
  };

  const handleCancelEdit = () => {
    if (!user) {
      Alert.alert('Profile loading', 'Please wait until your profile finishes loading.');
      return;
    }

    Alert.alert('Discard changes?', 'Your unsaved profile edits will be removed.', [
      { text: 'Keep Editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setValues({
            fullName: user.fullName,
            age: user.age,
            sex: user.sex,
            address: user.address,
            course: user.course,
            photoUri: user.photoUri || '',
          });
          setEditing(false);
          Alert.alert('Changes discarded', 'Your saved profile information was kept.');
        },
      },
    ]);
  };

  const handleEditPress = () => {
    if (!user) {
      Alert.alert('Profile loading', 'Please wait until your profile finishes loading.');
      return;
    }

    if (editing) {
      handleCancelEdit();
      return;
    }

    setEditing(true);
    Alert.alert('Edit profile', 'You can now update your personal information.');
  };

  const handleBackPress = () => {
    if (!editing) {
      navigation.goBack();
      return;
    }

    Alert.alert('Leave without saving?', 'Your profile edits have not been saved.', [
      { text: 'Stay', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log out?', 'You will return to the login screen. Your local account will stay saved on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Logged out', 'You have been signed out successfully.', [
            {
              text: 'OK',
              onPress: () => navigation.replace('Login'),
            },
          ]);
        },
      },
    ]);
  };

  const handlePickPhoto = async () => {
    if (!user) {
      Alert.alert('Profile loading', 'Please wait until your profile finishes loading.');
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow photo library access to upload a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.82,
      });

      if (result.canceled) {
        return;
      }

      const photoUri = result.assets?.[0]?.uri;
      if (!photoUri) {
        Alert.alert('Photo error', 'Unable to use the selected image.');
        return;
      }

      const updatedUser = { ...user, photoUri };
      await saveUser(updatedUser);
      setUser(updatedUser);
      setValues((current) => ({ ...current, photoUri }));
      Alert.alert('Profile photo updated', 'Your new profile picture has been saved.');
    } catch (error) {
      Alert.alert('Photo error', 'Unable to update your profile picture right now.');
    }
  };

  const handleRemovePhoto = () => {
    if (!user?.photoUri) {
      Alert.alert('No photo yet', 'Upload a profile picture first.');
      return;
    }

    Alert.alert('Remove profile photo?', 'Your current profile picture will be removed from this app.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedUser = { ...user, photoUri: '' };
            await saveUser(updatedUser);
            setUser(updatedUser);
            setValues((current) => ({ ...current, photoUri: '' }));
            Alert.alert('Photo removed', 'Your profile picture was removed.');
          } catch (error) {
            Alert.alert('Storage error', 'Unable to remove your profile picture.');
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <AppButton title="Back" variant="secondary" onPress={handleBackPress} style={styles.navButton} />
          <AppButton title={editing ? 'Cancel' : 'Edit'} variant="secondary" onPress={handleEditPress} style={styles.navButton} />
          <AppButton title="Settings" variant="secondary" onPress={() => navigation.navigate('Settings')} style={styles.navButton} />
        </View>

        <View style={styles.headerCard}>
          <Pressable onPress={handlePickPhoto} style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}>
            {user?.photoUri ? (
              <Image source={{ uri: user.photoUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}</Text>
            )}
          </Pressable>
          <Text style={styles.name}>{user?.fullName || 'Student'}</Text>
          <Text style={styles.course}>{user?.course || 'Course'}</Text>
          <View style={styles.photoActions}>
            <Pressable onPress={handlePickPhoto} style={({ pressed }) => [styles.photoButton, pressed && styles.avatarPressed]}>
              <Text style={styles.photoButtonText}>{user?.photoUri ? 'Change Photo' : 'Upload Photo'}</Text>
            </Pressable>
            {user?.photoUri ? (
              <Pressable onPress={handleRemovePhoto} style={({ pressed }) => [styles.photoButton, styles.removePhotoButton, pressed && styles.avatarPressed]}>
                <Text style={styles.removePhotoText}>Remove</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {editing ? (
            <View style={styles.form}>
              <AppInput label="Full Name" value={values.fullName} onChangeText={(text) => updateField('fullName', text)} placeholder="Full Name" />
              <AppInput label="Age" value={values.age} onChangeText={(text) => updateField('age', text)} placeholder="Age" keyboardType="number-pad" />
              <DropdownInput label="Sex" value={values.sex} onSelect={(item) => updateField('sex', item)} placeholder="Select sex" options={sexOptions} />
              <DropdownInput label="Province" value={values.address} onSelect={(item) => updateField('address', item)} placeholder="Select province" options={provinceOptions} />
              <AppInput label="Course/Program" value={values.course} onChangeText={(text) => updateField('course', text)} placeholder="BSIT" />
              <AppButton title="Save Changes" onPress={handleSave} style={styles.saveButton} />
            </View>
          ) : (
            <View style={styles.details}>
              <ProfileRow label="Age" value={user?.age} />
              <ProfileRow label="Sex" value={user?.sex} />
              <ProfileRow label="Province" value={user?.address} />
              <ProfileRow label="Email" value={user?.email} />
            </View>
          )}
        </View>

        <AppButton title="Log Out" variant="secondary" onPress={handleLogout} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ProfileRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '-'}</Text>
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
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.soft,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  avatarPressed: {
    opacity: 0.86,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0,
  },
  name: {
    ...typography.title,
    color: colors.surface,
    textAlign: 'center',
  },
  course: {
    ...typography.label,
    color: '#DDE8FF',
    marginTop: spacing.xs,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  photoButton: {
    minHeight: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoButton: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.42)',
  },
  photoButtonText: {
    ...typography.small,
    color: colors.primary,
  },
  removePhotoText: {
    ...typography.small,
    color: colors.surface,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.soft,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  details: {
    gap: spacing.sm,
  },
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2FA',
  },
  rowLabel: {
    ...typography.small,
    color: colors.mutedText,
  },
  rowValue: {
    ...typography.body,
    color: colors.text,
    marginTop: 2,
  },
});
