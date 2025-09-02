
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';

import NavigationBar from '@/components/NavigationBar';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useRouter } from 'expo-router';

const DOCTOR_AVATAR = 'https://cdn-icons-png.flaticon.com/512/387/387561.png';

const DOCTORS = [
  { id: 1, name: 'Dr. Suresh Perera', specialty: 'Physician', rating: 4.7, reviews: 1207, avatar: DOCTOR_AVATAR },
  { id: 2, name: 'Dr. Suresh Perera', specialty: 'Physician', rating: 4.7, reviews: 1207, avatar: DOCTOR_AVATAR },
  { id: 3, name: 'Dr. Suresh Perera', specialty: 'Physician', rating: 4.7, reviews: 1207, avatar: DOCTOR_AVATAR },
];

export default function ChooseDoctor() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredDoctors = DOCTORS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Choose Your Doctor</Text>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#0090B7" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#0090B7"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredDoctors}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD600" style={{ marginRight: 4 }} />
              <Text style={styles.ratingText}>{item.rating} <Text style={styles.reviewCount}>({item.reviews})</Text></Text>
            </View>
            <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/(apponintment-mgt)/doctor-details')}>
              <Text style={styles.bookBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0090B7',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0090B7',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 18,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#0090B7',
    fontSize: 16,
  },
  grid: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#F3FAFD',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B3E0F2',
    width: 160,
    margin: 10,
    alignItems: 'center',
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0090B7',
    textAlign: 'center',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
    color: '#7A7A7A',
    marginBottom: 6,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 13,
  },
  reviewCount: {
    color: '#888',
    fontWeight: '400',
    fontSize: 12,
  },
  bookBtn: {
    backgroundColor: '#0090B7',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 7,
    marginTop: 4,
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
});
