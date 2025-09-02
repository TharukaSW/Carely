import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const roles = [
  'Elderly Users',
  'Family Members',
  'Healthcare Professionals',
  'Caregivers',
];

export default function SelectRoleScreen() {
  const handleSelect = (role: string) => {
    if (role === 'Family Members') {
      router.replace('/(user-mgt)/family-register');
    } else if (role === 'Elderly Users') {
      router.replace('/(user-mgt)/elderly-register');
    } else if (role === 'Healthcare Professionals') {
      router.replace('/(user-mgt)/healthcare-register');
    } else if (role === 'Caregivers') {
      router.replace('/(user-mgt)/caregiver-register');
    }
    // Add navigation for other roles as needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tell Us Who You Are</Text>
      <View style={styles.list}>
        {roles.map((role) => (
          <View key={role} style={styles.row}>
            <TouchableOpacity style={styles.roleBtn} onPress={() => handleSelect(role)}>
              <Text style={styles.roleText}>{role}</Text>
            </TouchableOpacity>
            <View style={styles.iconCircle}>
              <Ionicons name="arrow-forward" size={24} color="#1593B5" />
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1593B5',
    marginBottom: 36,
    textAlign: 'center',
  },
  list: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  roleBtn: {
    backgroundColor: '#F1F8FC',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    minWidth: 220,
    marginRight: 16,
  },
  roleText: {
    color: '#1593B5',
    fontSize: 16,
    fontWeight: '600',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F8FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
