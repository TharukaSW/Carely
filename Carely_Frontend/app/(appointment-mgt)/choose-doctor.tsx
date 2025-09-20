import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { apiFetch } from '../api';
import NavigationBar from '@/components/NavigationBar';

interface DoctorItem {
  id: string;
  name: string;
  specialty?: string;
  location?: string | null;
  email?: string;
}

export default function ChooseDoctorScreen() {
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const list = await apiFetch('/register/doctors');
        setDoctors(list);
      } catch (err: any) {
        setError(err.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={['#E3F2FD', '#F0F9FF']} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading doctors...</Text>
          </View>
          <NavigationBar />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#E3F2FD', '#F0F9FF']} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => window.location.reload()}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
          <NavigationBar />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#E3F2FD', '#F0F9FF']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
        {/* Header */}
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.headerContainer}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#007AFF" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Choose Doctor</Text>
              <Text style={styles.headerSubtitle}>Select a healthcare professional</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Doctors List */}
        <FlatList
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          data={doctors}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.cardContainer}
              onPress={() => router.push({ pathname: '/(appointment-mgt)/book-appointment', params: { doctorId: item.id } })}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                style={styles.doctorCard}
              >
                <View style={styles.doctorImageContainer}>
                  <LinearGradient
                    colors={['#007AFF', '#0051D5']}
                    style={styles.doctorImageBorder}
                  >
                    <Image 
                      source={require('@/assets/images/doctor1.png')} 
                      style={styles.doctorImage} 
                    />
                  </LinearGradient>
                  <LinearGradient
                    colors={['#34C759', '#28A745']}
                    style={styles.statusBadge}
                  >
                    <MaterialIcons name="verified" size={14} color="#fff" />
                  </LinearGradient>
                </View>
                
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{item.name}</Text>
                  <View style={styles.specialtyContainer}>
                    <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.specialtyIcon}>
                      <MaterialIcons name="medical-services" size={16} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.doctorSpecialty}>{item.specialty || 'Healthcare Professional'}</Text>
                  </View>
                  {item.location && (
                    <View style={styles.locationContainer}>
                      <Ionicons name="location" size={16} color="#8E8E93" />
                      <Text style={styles.doctorLocation}>{item.location}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.actionContainer}>
                  <LinearGradient
                    colors={['#007AFF', '#0051D5']}
                    style={styles.selectButton}
                  >
                    <MaterialIcons name="chevron-right" size={24} color="#fff" />
                  </LinearGradient>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
        
        <NavigationBar />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header Styles
  headerContainer: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },

  // List Styles
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Doctor Card Styles
  cardContainer: {
    marginBottom: 16,
  },
  doctorCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  doctorImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  doctorImageBorder: {
    padding: 3,
    borderRadius: 30,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  doctorImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // Doctor Info Styles
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  specialtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  specialtyIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  doctorLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 6,
    fontWeight: '500',
  },

  // Action Styles
  actionContainer: {
    marginLeft: 12,
  },
  selectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});