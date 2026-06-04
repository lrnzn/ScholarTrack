import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../components/AppButton';
import DropdownInput from '../components/DropdownInput';
import AppInput from '../components/AppInput';
import { courseOptions, provinceOptions, sexOptions } from '../data/dropdownOptions';
import { saveUser } from '../utils/storage';
import { normalizeCourse, validateSignUp } from '../utils/validation';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

const SIGNUP_IMAGE =
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80';

const initialValues = {
  fullName: '',
  age: '',
  sex: '',
  address: '',
  course: '',
  email: '',
  password: '',
};

export default function SignUpScreen({ navigation }) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSignUp = async () => {
    setMessage('');

    const validationMessage = validateSignUp(values);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setMessage('Creating account...');
    setSaving(true);
    try {
      const user = {
        ...values,
        fullName: values.fullName.trim(),
        age: values.age.trim(),
        sex: values.sex.trim(),
        address: values.address.trim(),
        course: normalizeCourse(values.course),
        email: values.email.trim(),
      };
      await saveUser(user);
      navigation.replace('Login');
    } catch (error) {
      setMessage(`Unable to save your account. Please try again. ${error?.message || ''}`.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <ImageBackground source={{ uri: SIGNUP_IMAGE }} resizeMode="cover" style={styles.background}>
      <LinearGradient colors={['rgba(7,16,39,0.78)', 'rgba(244,247,251,0.98)', '#F4F7FB']} style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>Create profile</Text>
              <Text style={styles.title}>Tell us what scholarship fits you.</Text>
            </View>

            <View style={styles.card}>
              <AppInput label="Full Name" value={values.fullName} onChangeText={(text) => updateField('fullName', text)} placeholder="Juan Dela Cruz" />
              <AppInput label="Age" value={values.age} onChangeText={(text) => updateField('age', text)} placeholder="20" keyboardType="number-pad" />
              <DropdownInput label="Sex" value={values.sex} onSelect={(item) => updateField('sex', item)} placeholder="Select sex" options={sexOptions} />
              <DropdownInput
                label="Province"
                value={values.address}
                onSelect={(item) => updateField('address', item)}
                placeholder="Select province"
                options={provinceOptions}
                searchable
                searchPlaceholder="Search province"
              />
              <DropdownInput
                label="Course/Program"
                value={values.course}
                onSelect={(item) => updateField('course', item)}
                placeholder="Select course/program"
                options={courseOptions}
                searchable
                searchPlaceholder="Search course or program"
              />
              <AppInput label="Email" value={values.email} onChangeText={(text) => updateField('email', text)} placeholder="student@email.com" keyboardType="email-address" />
              <AppInput label="Password" value={values.password} onChangeText={(text) => updateField('password', text)} placeholder="At least 6 characters" secureTextEntry />

              <AppButton title={saving ? 'Saving...' : 'Create Account'} onPress={handleSignUp} disabled={saving} style={styles.button} />
              {message ? <Text style={styles.message}>{message}</Text> : null}
              <AppButton title="Back to Login" variant="secondary" onPress={() => navigation.goBack()} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 72,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
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
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.soft,
  },
  button: {
    marginTop: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.danger,
    textAlign: 'center',
  },
});
