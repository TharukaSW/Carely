import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  const handleRegister = () => {
    router.replace('/(onboarding)/select-role');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#1593B5" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#1593B5" secureTextEntry value={password} onChangeText={setPassword} />
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setRemember(!remember)} style={styles.checkboxContainer}>
          <View style={[styles.checkbox, remember && styles.checkboxChecked]} />
        </TouchableOpacity>
        <Text style={styles.remember}>Remember Me</Text>
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgot}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1593B5',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#D2EDF7',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1593B5',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1593B5',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1593B5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1593B5',
  },
  checkboxChecked: {
    backgroundColor: '#1593B5',
  },
  remember: {
    color: '#1593B5',
    fontSize: 13,
    marginLeft: 4,
  },
  forgotBtn: {
    marginLeft: 'auto',
  },
  forgot: {
    color: '#1593B5',
    fontSize: 13,
    fontWeight: '400',
  },
  loginBtn: {
    backgroundColor: '#0083A6',
    borderRadius: 20,
    paddingVertical: 14,
    width: '90%',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  registerBtn: {
    borderWidth: 1,
    borderColor: '#0083A6',
    borderRadius: 20,
    paddingVertical: 14,
    width: '90%',
    alignItems: 'center',
  },
  registerText: {
    color: '#0083A6',
    fontSize: 18,
    fontWeight: '700',
  },
});
