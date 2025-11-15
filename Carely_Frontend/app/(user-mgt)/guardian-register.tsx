import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { apiFetch } from '../api';

export default function GuardianRegisterScreen() {
  const [form, setForm] = useState({
    fullName: '',
    relationship: '',
    address: '',
    phone: '',
    email: '',
    elderEmail: '',
    elderName: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    try {
      const payload = Object.entries(form).reduce<Record<string, any>>((acc, [key, value]) => {
        if (value !== '') acc[key] = value;
        return acc;
      }, {});

      await apiFetch('/register/guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      Alert.alert('Success', 'Guardian account created! You can sign in now.');
      router.replace('/login');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Something went wrong');
    }
  };

  const handleLogin = () => router.replace('/login');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Guardian Registration</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#1593B5" value={form.fullName} onChangeText={(t) => handleChange('fullName', t)} />
        <TextInput style={styles.input} placeholder="Relationship to Elder" placeholderTextColor="#1593B5" value={form.relationship} onChangeText={(t) => handleChange('relationship', t)} />
        <TextInput style={styles.input} placeholder="Address" placeholderTextColor="#1593B5" value={form.address} onChangeText={(t) => handleChange('address', t)} />
        <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#1593B5" keyboardType="phone-pad" value={form.phone} onChangeText={(t) => handleChange('phone', t)} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#1593B5" keyboardType="email-address" value={form.email} onChangeText={(t) => handleChange('email', t)} />
        <TextInput style={styles.input} placeholder="Elder Email (optional)" placeholderTextColor="#1593B5" keyboardType="email-address" value={form.elderEmail} onChangeText={(t) => handleChange('elderEmail', t)} />
        <TextInput style={styles.input} placeholder="Elder Name (optional)" placeholderTextColor="#1593B5" value={form.elderName} onChangeText={(t) => handleChange('elderName', t)} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#1593B5" secureTextEntry value={form.password} onChangeText={(t) => handleChange('password', t)} />
        <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#1593B5" secureTextEntry value={form.confirmPassword} onChangeText={(t) => handleChange('confirmPassword', t)} />
      </View>
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.bottomRow}>
        <Text style={styles.accountText}>Already have an account?</Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1593B5',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  input: {
    width: '85%',
    backgroundColor: '#F1F8FC',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1593B5',
    marginBottom: 16,
  },
  registerBtn: {
    backgroundColor: '#0593B5',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 32,
  },
  accountText: {
    color: '#1593B5',
    fontSize: 13,
  },
  loginText: {
    color: '#0593B5',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 16,
  },
});
