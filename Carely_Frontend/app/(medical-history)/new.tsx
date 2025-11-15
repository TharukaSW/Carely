import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { createMedicalRecord } from '../services/medicalHistory';
import { getUser, SessionUser } from '../session';

export default function NewMedicalRecordScreen() {
  const params = useLocalSearchParams();
  const patientIdParam = (params as any).patientId ? String((params as any).patientId) : '';
  const appointmentId = (params as any).appointmentId ? String((params as any).appointmentId) : '';

  const [summary, setSummary] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const currentUser: SessionUser | null = await getUser();
      if (!currentUser?.id) {
        Alert.alert('Not signed in', 'Please login again to add medical records.');
        return;
      }
      const patientId = patientIdParam || String(currentUser.id);
      if (!patientId) {
        Alert.alert('Missing patient', 'Provide a patient identifier to create a record.');
        return;
      }
      await createMedicalRecord({
        patientId,
        appointmentId: appointmentId || undefined,
        doctorId: currentUser.role === 'doctor' ? String(currentUser.id) : undefined,
        caregiverId: currentUser.role === 'caregiver' ? String(currentUser.id) : undefined,
        guardianId: currentUser.role === 'guardian' ? String(currentUser.id) : undefined,
        summary,
        diagnosis,
        medications: medications ? medications.split(',').map((m) => m.trim()).filter(Boolean) : [],
        notes,
        createdById: String(currentUser.id),
        createdByRole: currentUser.role,
      });
      Alert.alert('Record Saved', 'Medical record added successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Failed', err?.message || 'Unable to save medical record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#F0F9FF']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={22} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Medical Record</Text>
            <View style={{ width: 32 }} />
          </View>

          <LinearGradient colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']} style={styles.card}>
            <Text style={styles.label}>Patient ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter patient identifier"
              placeholderTextColor="#7B8794"
              value={patientIdParam}
              editable={false}
            />
            <Text style={styles.label}>Visit Summary</Text>
            <TextInput
              style={styles.input}
              placeholder="Short summary of this visit"
              placeholderTextColor="#7B8794"
              value={summary}
              onChangeText={setSummary}
            />
            <Text style={styles.label}>Diagnosis (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Diagnosis details"
              placeholderTextColor="#7B8794"
              value={diagnosis}
              onChangeText={setDiagnosis}
            />
            <Text style={styles.label}>Medications (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Comma separated medications"
              placeholderTextColor="#7B8794"
              value={medications}
              onChangeText={setMedications}
            />
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              multiline
              numberOfLines={4}
              placeholder="Additional notes, care instructions, etc."
              placeholderTextColor="#7B8794"
              value={notes}
              onChangeText={setNotes}
            />
            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Save Record</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,122,255,0.08)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  card: {
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  input: {
    backgroundColor: '#F5FAFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1E2FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#1F2937',
    marginBottom: 8,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
