import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { apiFetch } from '../api';

interface Doctor {
  fullName: string;
  specialization?: string;
  experience?: string;
  hospital?: string;
  phone?: string;
  email?: string;
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
        // Normalize to the Doctor shape expected by this UI
        const normalized = {
          fullName: res.fullName,
          specialization: res.healthcare?.profession || res.healthcare?.license || 'Healthcare',
          experience: undefined,
          hospital: res.healthcare?.location || undefined,
          phone: res.phone,
          email: res.email,
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
      <Text style={styles.label}>Specialization: <Text style={styles.value}>{doctor.specialization || 'N/A'}</Text></Text>
      <Text style={styles.label}>Experience: <Text style={styles.value}>{doctor.experience || 'N/A'}</Text></Text>
      <Text style={styles.label}>Hospital: <Text style={styles.value}>{doctor.hospital || 'N/A'}</Text></Text>
      <Text style={styles.label}>Phone: <Text style={styles.value}>{doctor.phone || 'N/A'}</Text></Text>
      <Text style={styles.label}>Email: <Text style={styles.value}>{doctor.email || 'N/A'}</Text></Text>
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
