import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { editUserProfile, ProfileUpdate } from '../services/profile';
import { getUser, setUser, SessionUser } from '../session';

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setCurrentUser] = useState<SessionUser | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getUser();
        if (!currentUser?.email) {
          Alert.alert('Error', 'Please login first');
          router.back();
          return;
        }
        setCurrentUser(currentUser);
        setFullName(String(currentUser.fullName || ''));
        setPhone(String(currentUser.phone || ''));
        setBio(String(currentUser.bio || ''));
        setLocation(String(currentUser.location || ''));
        setDateOfBirth(String(currentUser.dateOfBirth || ''));
      } catch (e: any) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async () => {
    if (!user?.email) return;
    try {
      setSaving(true);
      setError('');
      const updates: ProfileUpdate = {
        email: user.email,
        fullName,
        phone,
        bio,
        location,
        dateOfBirth,
      };
      const response = await editUserProfile(updates);
      
      // Update local session with new data
      if (response?.user) {
        await setUser(response.user);
        setCurrentUser(response.user);
      }
      
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (e: any) {
      setError(e?.message || 'Failed to update profile');
      Alert.alert('Error', e?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </LinearGradient>
    );
  }

  if (error && !user) {
    return (
      <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveText}>Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient colors={["#007AFF", "#0051D5"]} style={styles.headerGradient}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Profile</Text>
              <View style={{ width: 32 }} />
            </View>
          </LinearGradient>
          
          <View style={styles.card}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              value={fullName} 
              onChangeText={setFullName} 
              placeholder="Enter your full name" 
              style={styles.input} 
              placeholderTextColor="#8E8E93" 
            />
            
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              value={phone} 
              onChangeText={setPhone} 
              placeholder="+1 234 567 8900" 
              style={styles.input} 
              placeholderTextColor="#8E8E93"
              keyboardType="phone-pad"
            />
            
            <Text style={styles.label}>Bio</Text>
            <TextInput 
              value={bio} 
              onChangeText={setBio} 
              placeholder="Tell us about yourself..." 
              style={[styles.input, styles.textArea]} 
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.label}>Location</Text>
            <TextInput 
              value={location} 
              onChangeText={setLocation} 
              placeholder="City, Country" 
              style={styles.input} 
              placeholderTextColor="#8E8E93" 
            />
            
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput 
              value={dateOfBirth} 
              onChangeText={setDateOfBirth} 
              placeholder="YYYY-MM-DD" 
              style={styles.input} 
              placeholderTextColor="#8E8E93" 
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.cancelBtn]} 
                onPress={() => router.back()}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
                onPress={onSave} 
                disabled={saving}
              >
                <Text style={styles.saveText}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerGradient: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingBottom: 18 },
  headerRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 44, 
    paddingBottom: 8,
  },
  backBtn: {
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255,255,255,0.18)'
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 32,
    padding: 22,
    shadowColor: '#007AFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: '#DC2626', fontSize: 14 },
  label: { 
    color: '#007AFF', 
    marginTop: 12, 
    marginBottom: 6, 
    fontWeight: '700', 
    fontSize: 15 
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F5FAFF',
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 16,
  },
  saveBtn: { 
    flex: 1,
    backgroundColor: '#007AFF', 
    borderRadius: 12, 
    paddingVertical: 14, 
    alignItems: 'center', 
    shadowColor: '#007AFF', 
    shadowOpacity: 0.12, 
    shadowRadius: 8, 
    elevation: 2 
  },
  saveText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16 
  },
});