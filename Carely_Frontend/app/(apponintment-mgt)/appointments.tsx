

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '@/components/NavigationBar';
import { useRouter } from 'expo-router';

const APPOINTMENT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/387/387561.png';

const APPOINTMENT_DATA = [
  {
    id: 1,
    doctor: 'Dr. Suresh Perera',
    specialty: 'Physician',
    date: 'Sunday, 12 July',
    time: '06.00 PM - 08.00 PM',
    location: 'Suwasewana, Kandy',
    status: 'pending',
    avatar: APPOINTMENT_AVATAR,
  },
  {
    id: 2,
    doctor: 'Dr. Suresh Perera',
    specialty: 'Physician',
    date: 'Sunday, 12 July',
    time: '06.00 PM - 08.00 PM',
    location: 'Suwasewana, Kandy',
    status: 'pending',
    avatar: APPOINTMENT_AVATAR,
  },
];

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'all', label: 'All' },
];

export default function AppointmentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const router = useRouter();

  // Filter logic placeholder (all are upcoming in mock)
  const filteredAppointments = APPOINTMENT_DATA;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Your Appointment</Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterBtn, selectedFilter === f.key && styles.filterBtnActive]}
              onPress={() => setSelectedFilter(f.key)}
            >
              <Text style={[styles.filterBtnText, selectedFilter === f.key && styles.filterBtnTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Appointment Cards */}
        {filteredAppointments.map(appointment => (
          <View key={appointment.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <Image source={{ uri: appointment.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.doctorName}>{appointment.doctor}</Text>
                <Text style={styles.specialty}>{appointment.specialty}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardDetailsRow}>
              <View style={styles.detailCol}>
                <Ionicons name="calendar" size={18} color="#8A8A8A" style={styles.detailIcon} />
                <Text style={styles.detailText}>{appointment.date}</Text>
              </View>
              <View style={styles.detailCol}>
                <Ionicons name="time" size={18} color="#8A8A8A" style={styles.detailIcon} />
                <Text style={styles.detailText}>{appointment.time}</Text>
              </View>
            </View>
            <View style={styles.cardDetailsRow}>
              <View style={styles.detailCol}>
                <Ionicons name="location" size={18} color="#8A8A8A" style={styles.detailIcon} />
                <Text style={styles.detailText}>{appointment.location}</Text>
              </View>
              <View style={styles.detailCol}>
                <Ionicons name="hourglass" size={18} color="#8A8A8A" style={styles.detailIcon} />
                <Text style={styles.detailText}>Pending</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.detailsBtn}>
              <Text style={styles.detailsBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(apponintment-mgt)/choose-doctor')}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  headerRow: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0090B7',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: '#0090B7',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 7,
    marginHorizontal: 6,
    backgroundColor: '#fff',
  },
  filterBtnActive: {
    backgroundColor: '#0090B7',
  },
  filterBtnText: {
    color: '#0090B7',
    fontWeight: '600',
    fontSize: 16,
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#F3FAFD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0090B7',
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  specialty: {
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6EEF2',
    marginVertical: 6,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  detailCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  detailsBtn: {
    backgroundColor: '#0090B7',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 32,
    paddingVertical: 7,
  },
  detailsBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 90,
    backgroundColor: '#0090B7',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
