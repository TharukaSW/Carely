import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { apiFetch } from '../api';

interface Doctor {
  fullName: string;
  specialty?: string;
  hospital?: string | null;
  clinicAddress?: string | null;
  phone?: string | null;
  email?: string;
  bio?: string;
}

interface RouteProps {
  params?: {
    doctorId?: string;
  };
}

export default function DoctorDetailsScreen({ route }: { route: RouteProps }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const doctorId = route?.params?.doctorId;

  useEffect(() => {
    async function fetchDoctor() {
      setLoading(true);
      setError('');
      try {
        if (!doctorId) throw new Error('No doctor id provided');
        const res = await apiFetch(`/register/id/${doctorId}`);
        const profile = res.doctor || {};
        const normalized: Doctor = {
          fullName: res.fullName,
          specialty: profile.specialty || profile.licenseNumber || 'Doctor',
          hospital: profile.hospital || null,
          clinicAddress: profile.clinicAddress || profile.location || null,
          phone: res.phone || null,
          email: res.email,
          bio: profile.bio || res.bio || '',
        };
        setDoctor(normalized);
      } catch (err: any) {
        setError(err.message || 'Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    }
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1593B5" />;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }
  if (!doctor) {
    return <View style={styles.center}><Text>No doctor found.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{doctor.fullName}</Text>
      <Text style={styles.label}>Specialty: <Text style={styles.value}>{doctor.specialty || 'N/A'}</Text></Text>
      <Text style={styles.label}>Hospital: <Text style={styles.value}>{doctor.hospital || 'N/A'}</Text></Text>
      <Text style={styles.label}>Clinic: <Text style={styles.value}>{doctor.clinicAddress || 'N/A'}</Text></Text>
      <Text style={styles.label}>Phone: <Text style={styles.value}>{doctor.phone || 'N/A'}</Text></Text>
      <Text style={styles.label}>Email: <Text style={styles.value}>{doctor.email || 'N/A'}</Text></Text>
      {doctor.bio ? (
        <Text style={styles.label}>
          Bio: <Text style={styles.value}>{doctor.bio}</Text>
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1593B5',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  value: {
    fontWeight: '400',
    color: '#333',
  },
});
