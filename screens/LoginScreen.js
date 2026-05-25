import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import AuthBackground from '../components/AuthBackground';
import { getUser } from '../utils/storage';
import { isValidEmail } from '../utils/validation';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

const LOGIN_IMAGE =
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80';

export default function LoginScreen({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 520,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const user = await getUser();
      if (!user || user.email.toLowerCase() !== email.trim().toLowerCase() || user.password !== password) {
        Alert.alert('Login failed', 'Email or password is incorrect.');
        return;
      }
      Alert.alert('Login successful', `Welcome back, ${user.fullName}!`, [
        {
          text: 'Continue',
          onPress: () => navigation.replace('Home', { user }),
        },
      ]);
    } catch (error) {
      Alert.alert('Storage error', 'Unable to log in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground source={LOGIN_IMAGE}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Animated.View style={[styles.panel, { opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) }] }]}>
          <Text style={styles.eyebrow}>Scholarship Finder PH</Text>
          <Text style={styles.title}>Find grants that fit your course.</Text>
          <Text style={styles.subtitle}>Log in to see scholarships matched to your program.</Text>

          <View style={styles.form}>
            <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="juan@email.com" keyboardType="email-address" />
            <AppInput label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
          </View>

          <AppButton title={loading ? 'Checking...' : 'Log In'} onPress={handleLogin} disabled={loading} />
          <AppButton title="Create an Account" variant="secondary" onPress={() => navigation.navigate('SignUp')} style={styles.secondaryButton} />
          <Text style={styles.credit}>Developed by: De los Reyes, Ilon, Gonzales J.</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.soft,
  },
  eyebrow: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
  credit: {
    ...typography.small,
    color: colors.mutedText,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
