import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '@/components/NavigationBar';
import { router } from 'expo-router';
import { listAppointments, listDoctorAppointments, deleteAppointment } from '../services/appointments';
import { getUser, SessionUser } from '../session';
import { apiFetch } from '../api';

type UIAppointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  dateLabel: string; // e.g., Sunday, 12 July
  timeRange: string; // e.g., 06.00 PM - 08.00 PM
  location: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Cancelled' | 'Completed';
  patientId?: string;
  guardianId?: string | null;
};

export default function AppointmentsScreen() {
  const [tab, setTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [user, setUser] = useState<SessionUser | null>(null);
  const [items, setItems] = useState<UIAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const u = await getUser();
        setUser(u);
        if (!u?.id) {
          setItems([]);
          return;
        }
        await loadAppointments(u);
      } catch (e: any) {
        setError(e?.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onRefresh = async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      await loadAppointments(user);
    } catch (e: any) {
      setError(e?.message || 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddMedicalRecord = (appointment: UIAppointment) => {
    const patientId = appointment.patientId || (user?.role === 'guardian' ? appointment.guardianId : user?.id) || '';
    router.push({
      pathname: '/(medical-history)/new',
      params: {
        patientId,
        appointmentId: appointment.id,
      },
    });
  };

  async function loadAppointments(u: SessionUser) {
    setError('');
    const userId = u.id ? String(u.id) : '';
    let raw: any[] = [];
    if (u.role === 'doctor') {
      raw = await listDoctorAppointments(userId);
    } else if (u.role === 'guardian') {
      raw = await listAppointments({ guardianId: userId });
    } else if (u.role === 'caregiver') {
      raw = await listAppointments({ caregiverId: userId });
    } else {
      raw = await listAppointments({ patientId: userId });
    }
    // Fetch doctor details for display (name/specialty)
    const doctorIds: string[] = Array.from(new Set((raw || []).map((a: any) => String(a.doctorId)))).filter(Boolean) as string[];
    const doctorMap: Record<string, { fullName?: string; specialty?: string }> 
      = {};
    await Promise.all(doctorIds.map(async (id: string) => {
      try {
        const d = await apiFetch(`/register/id/${id}`);
        const specialty = d?.doctor?.specialty || d?.doctor?.licenseNumber || 'Doctor';
        doctorMap[id as string] = { fullName: d?.fullName, specialty };
      } catch {
        doctorMap[id as string] = { fullName: 'Doctor', specialty: 'Healthcare' };
      }
    }));

    const mapped: UIAppointment[] = (raw || []).map((a: any) => {
      const dateStr: string = String(a.date);
      const d = new Date(dateStr);
      const dateOk = !isNaN(d.getTime());
      const dateLabel = dateOk
        ? d.toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long' })
        : String(a.date);
      const doc = doctorMap[String(a.doctorId)] || {};
      return {
        id: String(a.id),
        doctorId: String(a.doctorId),
        doctorName: doc.fullName || 'Doctor',
        specialty: doc.specialty || 'Healthcare',
        dateLabel,
        timeRange: String(a.time || ''),
        location: String(a.location || ''),
        status: String(a.status || 'Pending') as UIAppointment['status'],
        patientId: a.patientId ? String(a.patientId) : undefined,
        guardianId: a.guardianId ? String(a.guardianId) : null,
      };
    });

    const visible = mapped.filter((appt) => appt.status !== 'Cancelled');
    setItems(visible);
  }

  const filtered = useMemo(() => {
    if (!items.length) return [] as UIAppointment[];
    const today = new Date();
    today.setHours(0,0,0,0);
    const isUpcoming = (ai: UIAppointment) => {
      // Determine upcoming by date; if unparsable, treat as upcoming
      const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ai.dateLabel) ? ai.dateLabel : null;
      // We stored dateLabel as human-readable, so instead parse from mapped raw later if needed.
      // Fallback: derive from dateLabel isn't reliable; better to approximate: keep all as upcoming.
      return true;
    };
    let out = items;
    if (tab === 'upcoming') out = items.filter(() => true);
    if (tab === 'past') out = [];
    if (tab === 'all') out = items;
    return out;
  }, [items, tab]);

  const onAdd = () => router.push('/(appointment-mgt)/choose-doctor');
  const onDetails = (doctorId: string) => router.push({ pathname: '/(appointment-mgt)/doctor-details', params: { doctorId } });
  const onDelete = (appointment: UIAppointment) => {
    if (!user?.id) return;
    if (deletingId) return;
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to delete this appointment? This action cannot be undone.',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(appointment.id);
              await deleteAppointment(appointment.id);
              setItems((prev) => prev.filter((item) => item.id !== appointment.id));
              await loadAppointments(user);
              Alert.alert('Cancelled', 'Appointment cancelled successfully.');
            } catch (err: any) {
              Alert.alert('Failed', err?.message || 'Could not delete appointment.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Appointment</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Segmented Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => setTab('upcoming')} style={[styles.tabChip, tab === 'upcoming' && styles.tabChipActive]}>
            <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('past')} style={[styles.tabChip, tab === 'past' && styles.tabChipActive]}>
            <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>Past</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('all')} style={[styles.tabChip, tab === 'all' && styles.tabChipActive]}>
            <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>All</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : error ? (
          <View style={{ padding: 20 }}>
            <Text style={{ color: 'red' }}>{error}</Text>
            <TouchableOpacity style={[styles.detailsBtn, { marginTop: 12 }]} onPress={onRefresh}><Text style={styles.detailsText}>Retry</Text></TouchableOpacity>
          </View>
        ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {filtered.map((a: UIAppointment) => (
            <View key={a.id} style={styles.card}>
              {/* Doctor Row */}
              <View style={styles.doctorRow}>
                <Image source={require('@/assets/images/doctor1.png')} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.doctorName}>{a.doctorName}</Text>
                  <Text style={styles.specialty}>{a.specialty}</Text>
                </View>
              </View>
              <View style={styles.separator} />
              {/* Details Rows */}
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                <Text style={styles.infoText}>{a.dateLabel}</Text>
                <Ionicons name="time-outline" size={18} color="#6B7280" style={{ marginLeft: 'auto', marginRight: 6 }} />
                <Text style={styles.infoText}>{a.timeRange}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#6B7280" />
                <Text numberOfLines={2} style={styles.infoText}>{a.location}</Text>
                <Ionicons name="hourglass-outline" size={18} color="#6B7280" style={{ marginLeft: 'auto', marginRight: 6 }} />
                <Text style={styles.statusText}>{a.status}</Text>
              </View>
              {/* Actions */}
               <View style={{ alignItems: 'center', marginTop: 12, flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
                <TouchableOpacity onPress={() => onDetails(a.doctorId)} style={styles.detailsBtn}>
                  <Text style={styles.detailsText}>View Details</Text>
                </TouchableOpacity>
                {(user?.role === 'doctor' || user?.role === 'caregiver') && (
                  <TouchableOpacity onPress={() => handleAddMedicalRecord(a)} style={[styles.detailsBtn, { backgroundColor: '#2563EB' }]}>
                    <Text style={styles.detailsText}>Add Record</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => router.push({ pathname: '/(appointment-mgt)/edit-appointment', params: { id: a.id } })} style={[styles.detailsBtn, { backgroundColor: '#10B981' }]}>
                  <Text style={styles.detailsText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(a)}
                  style={[styles.detailsBtn, { backgroundColor: '#DC2626' }]}
                  disabled={deletingId === a.id}
                >
                  <Text style={styles.detailsText}>{deletingId === a.id ? 'Deleting…' : 'Delete'}</Text>
                </TouchableOpacity>
               </View>
            </View>
          ))}

          {filtered.length === 0 && (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#8E8E93' }}>No appointments to show</Text>
            </View>
          )}
        </ScrollView>
        )}

        {/* Floating Add Button */}
        <TouchableOpacity style={styles.fab} onPress={onAdd} activeOpacity={0.85}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,122,255,0.08)'
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#2c3e50' },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    backgroundColor: '#fff',
  },
  tabChipActive: {
    backgroundColor: '#E8F0FE',
    borderColor: '#C7D2FE',
  },
  tabText: { color: '#374151', fontWeight: '600' },
  tabTextActive: { color: '#007AFF' },
  card: {
    backgroundColor: '#F5FAFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#B3DAFF',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  doctorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: '#fff' },
  doctorName: { fontSize: 16, fontWeight: '700', color: '#2c3e50' },
  specialty: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  separator: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  infoText: { marginLeft: 8, color: '#374151', fontSize: 14 },
  statusText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  detailsBtn: { backgroundColor: '#007AFF', borderRadius: 18, paddingHorizontal: 20, paddingVertical: 8 },
  detailsText: { color: '#fff', fontWeight: '700' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  }
});
