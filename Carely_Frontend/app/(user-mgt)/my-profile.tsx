import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUser, clearUser, SessionUser } from '../session';
import { apiFetch } from '../api';
import { deleteUserProfile } from '../services/profile';
import { listInvitations, respondToInvitation } from '../services/invitations';
import { listMedicalRecords } from '../services/medicalHistory';
import { router } from 'expo-router';
import NavigationBar from '@/components/NavigationBar';

export default function MyProfileScreen() {
  const [user, setUserState] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [eventsError, setEventsError] = useState<string>('');

  const loadAssociatedData = async (profile: SessionUser) => {
    if (!profile?.id) {
      setInvitations([]);
      setMedicalRecords([]);
      return;
    }
    const id = String(profile.id);
    setEventsError('');
    try {
      setInvitesLoading(true);
      if (profile.role === 'guardian') {
        const list = await listInvitations({ guardianId: id });
        setInvitations(list);
      } else if (profile.role === 'caregiver') {
        const list = await listInvitations({ caregiverId: id });
        setInvitations(list);
      } else {
        setInvitations([]);
      }
    } catch (err: any) {
      setEventsError(err?.message || 'Failed to load invitations');
      setInvitations([]);
    } finally {
      setInvitesLoading(false);
    }
    try {
      const records = await listMedicalRecords({
        viewerId: id,
        patientId: profile.role === 'elder' ? id : undefined,
        guardianId: profile.role === 'guardian' ? id : undefined,
        caregiverId: profile.role === 'caregiver' ? id : undefined,
        doctorId: profile.role === 'doctor' ? id : undefined,
        limit: 5,
      });
      setMedicalRecords(records || []);
    } catch (err: any) {
      setEventsError((prev) => prev || err?.message || 'Failed to load medical history');
      setMedicalRecords([]);
    }
  };

  const handleInvitationResponse = async (invitationId: string, status: 'accepted' | 'declined') => {
    if (!user?.id) return;
    try {
      await respondToInvitation(invitationId, status, { responderId: String(user.id) });
      await loadAssociatedData(user);
      Alert.alert('Invitation Updated', `Invitation ${status}.`);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Unable to update invitation');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const local = await getUser();
        if (!local) {
          setLoading(false);
          return;
        }
        setUserState(local);
        let profile = local;
        // Optional: refresh from backend for latest profile
        try {
          const fresh = await apiFetch(`/register/me?email=${encodeURIComponent(local.email)}`);
          setUserState(fresh);
          profile = fresh;
        } catch {}
        await loadAssociatedData(profile);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await clearUser();
    router.replace('/login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.email) return;
              await deleteUserProfile(user.email);
              await clearUser();
              Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
              router.replace('/login');
            } catch (e: any) {
              Alert.alert('Error', e?.message || 'Failed to delete account');
            }
          }
        }
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1593B5"/>;
  if (!user) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', marginTop: 40 }}>
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text style={{ color:'#1593B5' }}>You are not logged in.</Text>
        <TouchableOpacity onPress={() => router.replace('/login')} style={{ marginTop: 12, padding: 10, borderWidth:1, borderColor:'#1593B5', borderRadius: 8 }}>
          <Text style={{ color:'#1593B5' }}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <LinearGradient
      colors={['#E3F2FD', '#F0F9FF']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header with gradient background */}
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
            style={styles.headerContainer}
          >
            <Text style={styles.header}>My Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account settings</Text>
          </LinearGradient>

          {/* Main Profile Card */}
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
            style={styles.profileCard}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#007AFF', '#0051D5']}
                style={styles.avatarBorder}
              >
                <Image source={require('@/assets/images/doctor1.png')} style={styles.avatar} />
              </LinearGradient>
              <LinearGradient
                colors={['#007AFF', '#0051D5']}
                style={styles.statusBadge}
              >
                <MaterialIcons name="verified" size={16} color="#fff" />
              </LinearGradient>
            </View>
            
            <Text style={styles.name}>{user.fullName || user.email}</Text>
            
            <LinearGradient
              colors={['#007AFF', '#0051D5']}
              style={styles.roleBadge}
            >
              <Text style={styles.roleText}>
                {user.role ? `${user.role[0].toUpperCase()}${user.role.slice(1)}` : 'User'}
              </Text>
            </LinearGradient>
          </LinearGradient>

          {/* Contact Information Cards */}
          <View style={styles.infoSection}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.infoCard}
            >
              <View style={styles.infoHeader}>
                <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.infoIcon}>
                  <Ionicons name="mail" size={20} color="#fff" />
                </LinearGradient>
                <Text style={styles.infoLabel}>Email Address</Text>
              </View>
              <Text style={styles.infoValue}>{user.email}</Text>
            </LinearGradient>

            {user.phone && (
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                style={styles.infoCard}
              >
                <View style={styles.infoHeader}>
                  <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.infoIcon}>
                    <Ionicons name="call" size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                </View>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </LinearGradient>
            )}

            {user.address && (
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                style={styles.infoCard}
              >
                <View style={styles.infoHeader}>
                  <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.infoIcon}>
                    <Ionicons name="location" size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.infoLabel}>Address</Text>
                </View>
                <Text style={styles.infoValue}>{user.address}</Text>
              </LinearGradient>
            )}
          </View>
          {/* Account Actions Section */}
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.sectionIcon}>
                <MaterialIcons name="account-circle" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Account</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => router.push('/(user-mgt)/edit-profile')}
            >
              <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.actionIcon}>
                <FontAwesome name="edit" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.actionContent}>
                <Text style={styles.actionText}>Edit Profile</Text>
                <Text style={styles.actionSubtext}>Update your personal information</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => Alert.alert('TODO','Change password to be implemented')}
            >
              <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.actionIcon}>
                <Ionicons name="lock-closed" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.actionContent}>
                <Text style={styles.actionText}>Change Password</Text>
                <Text style={styles.actionSubtext}>Update your security credentials</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={handleDeleteAccount}
            >
              <LinearGradient colors={['#FF3B30', '#D70015']} style={styles.actionIcon}>
                <MaterialIcons name="delete-forever" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.actionContent}>
                <Text style={[styles.actionText, { color: '#FF3B30' }]}>Delete Account</Text>
                <Text style={styles.actionSubtext}>Permanently remove your account</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </LinearGradient>

          {(user.role === 'guardian' || user.role === 'caregiver') && (
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <LinearGradient colors={['#FF8A65', '#FF7043']} style={styles.sectionIcon}>
                  <MaterialIcons name="group-add" size={22} color="#fff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Caregiver Invitations</Text>
              </View>
              {invitesLoading ? (
                <Text style={styles.helperText}>Loading invitations...</Text>
              ) : invitations.length === 0 ? (
                <Text style={styles.helperText}>
                  {user.role === 'guardian'
                    ? 'You have not sent any caregiver invitations yet.'
                    : 'No guardian invitations at the moment.'}
                </Text>
              ) : (
                invitations.map((inv: any) => (
                  <View key={inv.id} style={styles.invitationCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.invitationTitle}>
                        Caregiver {inv.caregiverId || 'N/A'}
                      </Text>
                      <Text style={styles.invitationMeta}>
                        Elder: {inv.elderId || 'N/A'} • Status:{' '}
                        {String(inv.status || 'pending').toUpperCase()}
                      </Text>
                      {inv.message ? (
                        <Text style={styles.invitationMessage}>{inv.message}</Text>
                      ) : null}
                    </View>
                    {user.role === 'caregiver' &&
                      String(inv.status || '').toLowerCase() === 'pending' && (
                        <View style={styles.invitationActions}>
                          <TouchableOpacity
                            style={[styles.invitationActionBtn, styles.acceptBtn]}
                            onPress={() => handleInvitationResponse(inv.id, 'accepted')}
                          >
                            <Text style={styles.invitationActionText}>Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.invitationActionBtn, styles.declineBtn]}
                            onPress={() => handleInvitationResponse(inv.id, 'declined')}
                          >
                            <Text style={styles.invitationActionText}>Decline</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                  </View>
                ))
              )}
            </LinearGradient>
          )}

          {medicalRecords.length > 0 && (
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <LinearGradient colors={['#34D399', '#059669']} style={styles.sectionIcon}>
                  <MaterialIcons name="medical-services" size={22} color="#fff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Recent Medical Records</Text>
              </View>
              {medicalRecords.map((record: any) => {
                const createdAt =
                  record.createdAt?.seconds
                    ? new Date(record.createdAt.seconds * 1000)
                    : record.createdAt
                    ? new Date(record.createdAt)
                    : null;
                const displayDate = createdAt
                  ? createdAt.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A';
                return (
                  <View key={record.id} style={styles.recordCard}>
                    <Text style={styles.recordTitle}>{record.summary || 'Visit Summary'}</Text>
                    <Text style={styles.recordMeta}>
                      Doctor: {record.doctorId || 'N/A'} • Date: {displayDate}
                    </Text>
                    {record.diagnosis ? (
                      <Text style={styles.recordMeta}>Diagnosis: {record.diagnosis}</Text>
                    ) : null}
                    {Array.isArray(record.medications) && record.medications.length > 0 ? (
                      <Text style={styles.recordMeta}>
                        Medications: {record.medications.join(', ')}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
              {eventsError ? <Text style={styles.helperText}>{eventsError}</Text> : null}
            </LinearGradient>
          )}

          {/* Settings Section */}
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.sectionIcon}>
                <MaterialIcons name="settings" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Settings</Text>
            </View>
            
            <TouchableOpacity style={styles.actionItem}>
              <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.actionIcon}>
                <Ionicons name="notifications" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.actionContent}>
                <Text style={styles.actionText}>Notifications</Text>
                <Text style={styles.actionSubtext}>Manage your notification preferences</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#007AFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.actionIcon}>
                <Ionicons name="help-circle" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.actionContent}>
                <Text style={styles.actionText}>Help & Support</Text>
                <Text style={styles.actionSubtext}>Get assistance and contact support</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#007AFF" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Logout Button */}
          <TouchableOpacity onPress={logout} style={styles.logoutContainer}>
            <LinearGradient
              colors={['#FF3B30', '#D70015']}
              style={styles.logoutBtn}
            >
              <Ionicons name="log-out-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Navigation Bar */}
        <NavigationBar />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40,
    paddingTop: 10,
  },
  
  // Header Styles
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#2c3e50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },

  // Profile Card Styles
  profileCard: { 
    borderRadius: 24, 
    alignItems: 'center', 
    padding: 30, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 60,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: { 
    fontWeight: '800', 
    fontSize: 24, 
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  roleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Info Section Styles
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  infoValue: {
    fontSize: 15,
    color: '#7f8c8d',
    marginLeft: 48,
    fontWeight: '500',
  },

  // Section Styles
  section: { 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: { 
    color: '#2c3e50', 
    fontWeight: '700', 
    fontSize: 20,
  },
  helperText: {
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  invitationCard: {
    borderWidth: 1,
    borderColor: 'rgba(255,138,101,0.35)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  invitationTitle: {
    color: '#2c3e50',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  invitationMeta: {
    color: '#7f8c8d',
    fontSize: 13,
    marginBottom: 6,
  },
  invitationMessage: {
    color: '#4b5563',
    fontSize: 14,
  },
  invitationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  invitationActionBtn: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invitationActionText: {
    color: '#fff',
    fontWeight: '600',
  },
  acceptBtn: {
    backgroundColor: '#10B981',
  },
  declineBtn: {
    backgroundColor: '#EF4444',
  },
  recordCard: {
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.35)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  recordTitle: {
    color: '#064E3B',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  recordMeta: {
    color: '#047857',
    fontSize: 13,
    marginBottom: 4,
  },

  // Action Item Styles
  actionItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 73, 94, 0.1)',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionText: { 
    color: '#2c3e50', 
    fontSize: 16, 
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtext: {
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '500',
  },

  // Logout Button Styles
  logoutContainer: {
    marginTop: 20,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 20, 
    justifyContent: 'center', 
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoutText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 18,
  },
});
