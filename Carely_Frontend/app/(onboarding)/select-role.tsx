import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const roles = [
  { label: 'Elders', route: '/(user-mgt)/elder-register' },
  { label: 'Guardians', route: '/(user-mgt)/guardian-register' },
  { label: 'Doctors', route: '/(user-mgt)/doctor-register' },
  { label: 'Caregivers', route: '/(user-mgt)/caregiver-register' },
];

export default function SelectRoleScreen() {
  const handleSelect = (route: string) => {
    router.replace(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tell Us Who You Are</Text>
      <View style={styles.list}>
        {roles.map(({ label, route }) => (
          <View key={label} style={styles.row}>
            <TouchableOpacity style={styles.roleBtn} onPress={() => handleSelect(route)}>
              <Text style={styles.roleText}>{label}</Text>
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
