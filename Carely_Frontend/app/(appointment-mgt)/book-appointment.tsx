import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { createAppointment } from '../services/appointments';
import { getUser } from '../session';

import { apiFetch } from '../api';

const SCHEDULE = [
  { date: '12', day: 'Sun' },
  { date: '15', day: 'Tue' },
  { date: '16', day: 'Wed' },
  { date: '20', day: 'Mon' },
  { date: '23', day: 'Wed' },
];
const TIMES = ['06.00 - 08.00 PM', '07.00 - 09.00 AM'];

export default function BookAppointmentScreen() {
  const params = useLocalSearchParams();
  const doctorId = (params as any).doctorId || '';
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(SCHEDULE[1].date);
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);

  useEffect(() => {
    async function fetchDoctor() {
      setLoading(true);
      try {
        if (!doctorId) throw new Error('No doctor id provided');
        const res = await apiFetch(`/register/id/${doctorId}`);
        setDoctor({
          id: res.id,
          fullName: res.fullName,
          specialty: res.healthcare?.profession || res.healthcare?.license || 'Healthcare',
          rating: res.rating || 4.7,
          reviews: res.reviews || 0,
          bio: res.bio || '',
          locations: res.locations || [res.healthcare?.location || 'Unknown'],
        });
      } catch (err: any) {
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Loading doctor...</Text></View>;
  }
  if (!doctor) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Doctor not found.</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{doctor.fullName}</Text>
        <View style={{ width: 32 }} />
      </View>
      {/* Doctor Avatar and Info */}
      <View style={styles.avatarRow}>
        <View style={styles.avatarCircle}>
          <MaterialIcons name="medical-services" size={48} color="#007AFF" />
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.doctorName}>{doctor.fullName}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="star" size={18} color="#FFD600" />
            <Text style={styles.rating}>{doctor.rating} ({doctor.reviews})</Text>
          </View>
        </View>
      </View>
      {/* Bio */}
      <Text style={styles.sectionTitle}>Bio</Text>
      <Text style={styles.bio}>{doctor.bio}</Text>
      {/* Schedule */}
      <Text style={styles.sectionTitle}>Schedule</Text>
      <View style={styles.scheduleRow}>
        {SCHEDULE.map((s) => (
          <TouchableOpacity
            key={s.date}
            style={[styles.scheduleChip, selectedDate === s.date && styles.scheduleChipActive]}
            onPress={() => setSelectedDate(s.date)}
          >
            <Text style={[styles.scheduleDate, selectedDate === s.date && styles.scheduleDateActive]}>{s.date}</Text>
            <Text style={[styles.scheduleDay, selectedDate === s.date && styles.scheduleDayActive]}>{s.day}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.scheduleMonth}>July</Text>
      </View>
      {/* Choose Time */}
      <Text style={styles.sectionTitle}>Choose Time</Text>
      <View style={styles.timesRow}>
        {TIMES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.timeChip, selectedTime === t && styles.timeChipActive]}
            onPress={() => setSelectedTime(t)}
          >
            <Text style={[styles.timeText, selectedTime === t && styles.timeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Locations */}
      <Text style={styles.sectionTitle}>Locations</Text>
      <View style={styles.locationsRow}>
        {doctor.locations.map((loc: string) => (
          <View key={loc} style={styles.locationChip}>
            <Text style={styles.locationText}>{loc}</Text>
          </View>
        ))}
      </View>
      {/* Book Appointment Button */}
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={async () => {
          try {
            const user = await getUser();
            if (!user?.id) { alert('Please login first'); return; }
            const date = `2025-07-${selectedDate}`;
            const appt = await createAppointment({
              userId: String(user.id),
              doctorId: String(doctor.id),
              date,
              time: selectedTime,
              location: doctor.locations[0],
            });
            const amount = 2500; // sample amount
            router.push({ pathname: '/(finance-mgt)/payment', params: { appointmentId: appt.id, amount: String(amount) } });
          } catch (err: any) {
            alert(err?.message || 'Failed to book appointment');
          }
        }}
      > 
        <Text style={styles.bookBtnText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 40, paddingBottom: 8,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,122,255,0.08)'
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2c3e50' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center' },
  doctorName: { fontSize: 18, fontWeight: '700', color: '#2c3e50' },
  specialty: { fontSize: 15, color: '#8E8E93', marginTop: 2 },
  rating: { fontSize: 15, color: '#8E8E93', marginLeft: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#007AFF', marginTop: 18, marginBottom: 6 },
  bio: { fontSize: 14, color: '#374151', marginBottom: 8 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  scheduleChip: { backgroundColor: '#F5FAFF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', marginRight: 6 },
  scheduleChipActive: { backgroundColor: '#007AFF' },
  scheduleDate: { fontSize: 16, fontWeight: '700', color: '#007AFF' },
  scheduleDateActive: { color: '#fff' },
  scheduleDay: { fontSize: 13, color: '#8E8E93' },
  scheduleDayActive: { color: '#fff' },
  scheduleMonth: { fontSize: 15, color: '#007AFF', fontWeight: '700', marginLeft: 10 },
  timesRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  timeChip: { backgroundColor: '#F5FAFF', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8, marginRight: 8 },
  timeChipActive: { backgroundColor: '#007AFF' },
  timeText: { fontSize: 15, color: '#007AFF' },
  timeTextActive: { color: '#fff' },
  locationsRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  locationChip: { backgroundColor: '#E8E8E8', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  locationText: { fontSize: 14, color: '#007AFF' },
  bookBtn: { backgroundColor: '#007AFF', borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  bookBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
