
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { editAppointment, getAppointment } from '../services/appointments';

export default function EditAppointmentScreen() {
  const params = useLocalSearchParams();
  const id = (params as any).id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const appt = await getAppointment(id);
        setDate(String(appt.date || ''));
        setTime(String(appt.time || ''));
        setLocation(String(appt.location || ''));
      } catch (e: any) {
        setError(e?.message || 'Failed to load appointment');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSave = async () => {
    try {
      setSaving(true);
      await editAppointment(id, { date, time, location });
      Alert.alert('Updated', 'Appointment updated successfully');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}><Text style={styles.saveText}>Back</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient colors={["#007AFF", "#0051D5"]} style={styles.headerGradient}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Appointment</Text>
              <View style={{ width: 32 }} />
            </View>
          </LinearGradient>
          <View style={styles.card}>
            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput value={date} onChangeText={setDate} placeholder="2025-07-15" style={styles.input} placeholderTextColor="#8E8E93" />
            <Text style={styles.label}>Time</Text>
            <TextInput value={time} onChangeText={setTime} placeholder="06.00 - 08.00 PM" style={styles.input} placeholderTextColor="#8E8E93" />
            <Text style={styles.label}>Location</Text>
            <TextInput value={location} onChangeText={setLocation} placeholder="Clinic" style={styles.input} placeholderTextColor="#8E8E93" />
            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={onSave} disabled={saving}>
              <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingBottom: 18 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 44, paddingBottom: 8,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)'
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 32,
    padding: 22,
    shadowColor: '#007AFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: { color: '#007AFF', marginTop: 12, marginBottom: 6, fontWeight: '700', fontSize: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F5FAFF',
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  saveBtn: { backgroundColor: '#007AFF', marginTop: 20, borderRadius: 12, paddingVertical: 14, alignItems: 'center', shadowColor: '#007AFF', shadowOpacity: 0.12, shadowRadius: 8, elevation: 2 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
