import { router } from 'expo-router';
import React from 'react';
import { Image, PanResponder, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingOneScreen() {
  const handleSkip = () => router.replace('/get-start');

  // PanResponder for left swipe
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          // Swiped left
          router.replace('/onboarding_two');
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip &gt;&gt;</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('@/assets/images/onboard1_img.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.iconRow}>
            <View style={[styles.personIcon, styles.personPrimary]} />
            <View style={[styles.personIcon, styles.personSecondary]} />
          </View>
          <Text style={styles.title}>Stay Connected & Supported</Text>
          <Text style={styles.description}>
            Stay close to family and caregivers with easy communication and daily support
          </Text>
        </View>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', paddingTop: 40, paddingHorizontal: 32 },
  skipBtn: { position: 'absolute', top: 42, right: 24, zIndex: 10 },
  skipText: { color: '#006C84', fontSize: 14, fontWeight: '600' },
  imageWrapper: { width: '80%', maxWidth: 330, backgroundColor: '#F1F7F9', marginTop: 80, borderRadius: 28, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 306/277 },
  title: { marginTop: 32, textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#006C84', lineHeight: 30 },
  description: { marginTop: 20, textAlign: 'center', fontSize: 14, lineHeight: 20, color: '#004B59', maxWidth: 320 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 48 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#8cb6c1' },
  dotActive: { backgroundColor: '#006C84' },
  iconRow: { flexDirection: 'row', gap: 8, marginTop: 20 },
  personIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#8cb6c1' },
  personPrimary: { backgroundColor: '#006C84' },
  personSecondary: { opacity: 0.9 },
});
