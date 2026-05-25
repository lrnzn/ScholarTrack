import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthBackground({ children, source }) {
  return (
    <ImageBackground source={{ uri: source }} resizeMode="cover" style={styles.background}>
      <LinearGradient colors={['rgba(7,16,39,0.82)', 'rgba(14,38,88,0.72)', 'rgba(244,247,251,0.96)']} style={styles.overlay}>
        <View style={styles.content}>{children}</View>
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
  content: {
    flex: 1,
  },
});