import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function PaymentSuccessScreen() {
  useEffect(() => {
    const t = setTimeout(() => router.push({ pathname: '/(tabs)' }), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={80} color="#34C759" style={{ marginBottom: 24 }} />
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Your appointment has been booked and payment processed.</Text>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.push({ pathname: '/(tabs)' })}>
          <Text style={styles.homeBtnText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 32 },
  title: { fontSize: 24, fontWeight: '700', color: '#34C759', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#374151', marginBottom: 32, textAlign: 'center' },
  homeBtn: { backgroundColor: '#007AFF', borderRadius: 28, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center' },
  homeBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
