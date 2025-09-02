import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CaregiverRegisterScreen() {
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    nic: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = () => {
    router.replace('/login');
  };

  const handleLogin = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Caregiver Register</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#1593B5" value={form.fullName} onChangeText={t => handleChange('fullName', t)} />
        <TextInput style={styles.input} placeholder="Address" placeholderTextColor="#1593B5" value={form.address} onChangeText={t => handleChange('address', t)} />
        <TextInput style={styles.input} placeholder="NIC Number" placeholderTextColor="#1593B5" value={form.nic} onChangeText={t => handleChange('nic', t)} />
        <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#1593B5" keyboardType="phone-pad" value={form.phone} onChangeText={t => handleChange('phone', t)} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#1593B5" keyboardType="email-address" value={form.email} onChangeText={t => handleChange('email', t)} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#1593B5" secureTextEntry value={form.password} onChangeText={t => handleChange('password', t)} />
        <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#1593B5" secureTextEntry value={form.confirmPassword} onChangeText={t => handleChange('confirmPassword', t)} />
        <TextInput style={styles.input} placeholder="Upload your Image" placeholderTextColor="#1593B5" value={form.image} onChangeText={t => handleChange('image', t)} />
      </View>
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.bottomRow}>
        <Text style={styles.accountText}>Do You Have An Account</Text>
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
