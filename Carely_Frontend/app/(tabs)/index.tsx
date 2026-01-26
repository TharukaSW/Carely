import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import NavigationBar from '@/components/NavigationBar';
import { clearUser, getUser, SessionUser } from '../session';

export default function HomeScreen() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    (async () => {
      const currentUser = await getUser();
      setUser(currentUser);
    })();
  }, []);

  const handleLogout = async () => {
    await clearUser();
    router.replace('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleEmergencyCall = () => {
    const emergencyNumber =
      (user as any)?.emergencyContact ||
      (user as any)?.guardianContact ||
      (user as any)?.elder?.guardianContact ||
      (user as any)?.guardian?.phone ||
      '';
    if (!emergencyNumber) {
      Alert.alert('No Emergency Contact', 'Add a guardian contact in your profile to enable SOS calls.');
      return;
    }
    const formatted = emergencyNumber.startsWith('tel:') ? emergencyNumber : `tel:${emergencyNumber}`;
    Linking.openURL(formatted).catch(() => {
      Alert.alert('Call Failed', 'Unable to initiate the emergency call on this device.');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E3F2FD', '#F8F9FA', '#FFFFFF']}
        style={styles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header with Gradient Background */}
          <LinearGradient
            colors={['#1593B5', '#0891A6']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.greetingText}>{getGreeting()}</Text>
                <Text style={styles.welcomeText}>
                  {user?.fullName ? user.fullName.split(' ')[0] : 'Welcome to Carely'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <LinearGradient colors={['#4CAF50', '#45A049']} style={[styles.statCard, styles.statCardGreen]}>
                <Ionicons name="heart" size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>98</Text>
                <Text style={styles.statLabel}>Health Score</Text>
              </LinearGradient>
              <LinearGradient colors={['#2196F3', '#1976D2']} style={[styles.statCard, styles.statCardBlue]}>
                <Ionicons name="calendar" size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Appointments</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={[styles.actionCard, styles.actionCardHealth]}>
                <LinearGradient colors={['#FF5722', '#E64A19']} style={styles.actionGradient}>
                  <Ionicons name="medical" size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.actionText}>Health Monitor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionCard, styles.actionCardEmergency]} onPress={handleEmergencyCall}>
                <LinearGradient colors={['#F44336', '#D32F2F']} style={styles.actionGradient}>
                  <Ionicons name="call" size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.actionText}>Emergency Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionCard, styles.actionCardAppointment]} onPress={() => router.push('/(appointment-mgt)/appointments')}>
                <LinearGradient colors={['#3F51B5', '#303F9F']} style={styles.actionGradient}>
                  <Ionicons name="calendar" size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.actionText}>Appointments</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionCard, styles.actionCardMeds]}>
                <LinearGradient colors={['#9C27B0', '#7B1FA2']} style={styles.actionGradient}>
                  <Ionicons name="medical-outline" size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.actionText}>Medications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionCard, styles.actionCardDoctors]} onPress={() => router.push('/(appointment-mgt)/choose-doctor')}>
                <LinearGradient colors={['#009688', '#00796B']} style={styles.actionGradient}>
                  <Ionicons name="medkit" size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.actionText}>Find Doctors</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionCard, styles.actionCardProfile]} onPress={() => router.push('/(user-mgt)/my-profile')}>
                <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.actionGradient}>
                  <Ionicons name="person" size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.actionText}>My Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionCard, styles.actionCardExpenses]} onPress={() => router.push('/(expense-mgt)/medical-expenses')}>
                <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.actionGradient}>
                  <Ionicons name="card" size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.actionText}>Medical Expenses</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today’s Overview</Text>
            <View style={styles.overviewCard}>
              <View style={styles.overviewItem}>
                <View style={styles.overviewIconContainer}>
                  <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
                </View>
                <View style={styles.overviewContent}>
                  <Text style={styles.overviewText}>2 medications taken</Text>
                  <Text style={styles.overviewSubtext}>Keep up the good work!</Text>
                </View>
              </View>
              <View style={styles.overviewItem}>
                <View style={styles.overviewIconContainer}>
                  <Ionicons name="time" size={22} color="#FF9800" />
                </View>
                <View style={styles.overviewContent}>
                  <Text style={styles.overviewText}>1 appointment at 2:00 PM</Text>
                  <Text style={styles.overviewSubtext}>Dr. Smith - Checkup</Text>
                </View>
              </View>
              <View style={styles.overviewItem}>
                <View style={styles.overviewIconContainer}>
                  <Ionicons name="heart" size={22} color="#E91E63" />
                </View>
                <View style={styles.overviewContent}>
                  <Text style={styles.overviewText}>Health check reminder</Text>
                  <Text style={styles.overviewSubtext}>Blood pressure due</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityIconContainer}>
                  <Ionicons name="analytics" size={18} color="#1593B5" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Blood pressure logged - 120/80</Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
              </View>
            </View>
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityIconContainer}>
                  <Ionicons name="notifications" size={18} color="#FF9800" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Medication reminder sent</Text>
                  <Text style={styles.activityTime}>4 hours ago</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      
      {/* Custom Navigation Bar */}
      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for custom navigation bar
  },
  headerGradient: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
  },
  greetingText: {
    fontSize: 14,
    color: '#E3F2FD',
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statCardGreen: {},
  statCardBlue: {},
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#E3F2FD',
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '31%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionCardHealth: {},
  actionCardEmergency: {},
  actionCardAppointment: {},
  actionCardMeds: {},
  actionCardDoctors: {},
  actionCardProfile: {},
  actionCardExpenses: {},
  actionGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 16,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  overviewContent: {
    flex: 1,
  },
  overviewText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  overviewSubtext: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 2,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 2,
  },
});
