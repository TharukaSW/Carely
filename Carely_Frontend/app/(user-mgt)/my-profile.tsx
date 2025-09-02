import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function MyProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff',marginTop: 40 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>My Profile</Text>
        </View>
        <View style={styles.profileCard}>
          <Image source={require('@/assets/images/doctor1.png')} style={styles.avatar} />
          <Text style={styles.name}>Suresh Perera</Text>
          <Text style={styles.role}>Elderly User</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={18} color="#1593B5" />
            <Text style={styles.infoText}>suresh.perera@email.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color="#1593B5" />
            <Text style={styles.infoText}>+94 77 123 4567</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#1593B5" />
            <Text style={styles.infoText}>Kandy, Sri Lanka</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.sectionItem}>
            <FontAwesome name="edit" size={18} color="#1593B5" style={{ marginRight: 12 }} />
            <Text style={styles.sectionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionItem}>
            <Ionicons name="lock-closed" size={18} color="#1593B5" style={{ marginRight: 12 }} />
            <Text style={styles.sectionText}>Change Password</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.sectionItem}>
            <Ionicons name="notifications" size={18} color="#1593B5" style={{ marginRight: 12 }} />
            <Text style={styles.sectionText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionItem}>
            <Ionicons name="help-circle" size={18} color="#1593B5" style={{ marginRight: 12 }} />
            <Text style={styles.sectionText}>Help & Support</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 18, paddingBottom: 40 },
  headerRow: { alignItems: 'center', marginTop: 18, marginBottom: 10 },
  header: { fontSize: 22, fontWeight: '700', color: '#1593B5' },
  profileCard: { backgroundColor: '#F1F8FC', borderRadius: 18, alignItems: 'center', padding: 20, marginBottom: 18, borderWidth: 1, borderColor: '#BEE3F2' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10, backgroundColor: '#fff' },
  name: { fontWeight: '700', fontSize: 18, color: '#1593B5', marginBottom: 2 },
  role: { color: '#888', fontSize: 15, fontWeight: '500', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { color: '#1593B5', fontSize: 15, marginLeft: 8 },
  section: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#BEE3F2' },
  sectionTitle: { color: '#1593B5', fontWeight: '700', fontSize: 16, marginBottom: 8 },
  sectionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  sectionText: { color: '#1593B5', fontSize: 15, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1186A6', borderRadius: 18, justifyContent: 'center', paddingVertical: 12, marginTop: 10 },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
