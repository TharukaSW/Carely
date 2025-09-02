import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DOCTOR_AVATAR = 'https://cdn-icons-png.flaticon.com/512/387/387561.png';
const SCHEDULE_DATES = [
  { key: '12', label: 'Sun' },
  { key: '15', label: 'Tue', active: true },
  { key: '16', label: 'Wed' },
  { key: '20', label: 'Mon' },
  { key: '23', label: 'Wed', month: 'July' },
];
const TIMES = [
  { key: '1', label: '06.00 - 08.00 PM', active: true },
  { key: '2', label: '07.00 - 09.00 AM' },
];
const LOCATIONS = [
  { key: '1', label: 'Asiri , Kandy', active: true },
  { key: '2', label: 'Suwasewana , Kandy' },
];

export default function DoctorDetailsScreen() {
  const [selectedDate, setSelectedDate] = useState('15');
  const [selectedTime, setSelectedTime] = useState('1');
  const [selectedLocation, setSelectedLocation] = useState('1');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Image source={{ uri: DOCTOR_AVATAR }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>Dr. Suresh Perera</Text>
            <Text style={styles.specialty}>Physician</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color="#FFD600" style={{ marginRight: 4 }} />
              <Text style={styles.ratingText}>4.7 <Text style={styles.reviewCount}>(1207)</Text></Text>
            </View>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Bio</Text>
        <Text style={styles.bioText}>
          Dr. Suresh Perera is a caring and skilled doctor specializing in [field, e.g., family medicine, pediatrics, Physician. With over 10 years of experience, Dr. Suresh is dedicated to providing personalized treatment and improving patients’ quality of life. Known for a patient-first approach, they focus on both prevention and treatment to support long-term health. Beyond clinical work, Dr. Suresh Perera is passionate about educating communities and promoting healthier lifestyles.
        </Text>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.rowWrap}>
          {SCHEDULE_DATES.map((d, i) => (
            <TouchableOpacity
              key={d.key}
              style={[styles.dateBtn, d.active || selectedDate === d.key ? styles.dateBtnActive : null]}
              onPress={() => setSelectedDate(d.key)}
            >
              <Text style={[styles.dateText, d.active || selectedDate === d.key ? styles.dateTextActive : null]}>{d.key}</Text>
              <Text style={[styles.dateLabel, d.active || selectedDate === d.key ? styles.dateTextActive : null]}>{d.label}{d.month ? `\n${d.month}` : ''}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Choose Time</Text>
        <View style={styles.rowWrap}>
          {TIMES.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.timeBtn, t.active || selectedTime === t.key ? styles.timeBtnActive : null]}
              onPress={() => setSelectedTime(t.key)}
            >
              <Text style={[styles.timeText, t.active || selectedTime === t.key ? styles.timeTextActive : null]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Locations</Text>
        <View style={styles.rowWrap}>
          {LOCATIONS.map(l => (
            <TouchableOpacity
              key={l.key}
              style={[styles.locationBtn, l.active || selectedLocation === l.key ? styles.locationBtnActive : null]}
              onPress={() => setSelectedLocation(l.key)}
            >
              <Text style={[styles.locationText, l.active || selectedLocation === l.key ? styles.locationTextActive : null]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  specialty: {
    fontSize: 15,
    color: '#888',
    fontWeight: '600',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 15,
  },
  reviewCount: {
    color: '#888',
    fontWeight: '400',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0090B7',
    marginTop: 18,
    marginBottom: 6,
  },
  bioText: {
    color: '#222',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dateBtn: {
    backgroundColor: '#F3FAFD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3E0F2',
    width: 60,
    alignItems: 'center',
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 6,
  },
  dateBtnActive: {
    backgroundColor: '#0090B7',
    borderColor: '#0090B7',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0090B7',
  },
  dateTextActive: {
    color: '#fff',
  },
  dateLabel: {
    fontSize: 13,
    color: '#0090B7',
    textAlign: 'center',
  },
  timeBtn: {
    backgroundColor: '#F3FAFD',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B3E0F2',
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 6,
  },
  timeBtnActive: {
    backgroundColor: '#0090B7',
    borderColor: '#0090B7',
  },
  timeText: {
    fontSize: 15,
    color: '#0090B7',
    fontWeight: '600',
  },
  timeTextActive: {
    color: '#fff',
  },
  locationBtn: {
    backgroundColor: '#F3FAFD',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B3E0F2',
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 6,
  },
  locationBtnActive: {
    backgroundColor: '#0090B7',
    borderColor: '#0090B7',
  },
  locationText: {
    fontSize: 15,
    color: '#0090B7',
    fontWeight: '600',
  },
  locationTextActive: {
    color: '#fff',
  },
  bookBtn: {
    backgroundColor: '#0090B7',
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: 18,
    paddingHorizontal: 32,
    paddingVertical: 12,
    width: '100%',
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center',
  },
});
