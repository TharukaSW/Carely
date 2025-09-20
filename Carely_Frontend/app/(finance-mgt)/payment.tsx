import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function PaymentScreen() {
  const params = useLocalSearchParams() as { appointmentId?: string; amount?: string };
  const amount = Number(params.amount || 2500);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 32 }} />
      </View>
      {/* Payment UI */}
      <View style={styles.content}>
        <Text style={styles.title}>Pay for your appointment</Text>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.amount}>LKR {amount.toFixed(2)}</Text>
        <TouchableOpacity style={styles.payBtn} onPress={() => router.push({ pathname: '/(finance-mgt)/card-payment', params: { appointmentId: String(params.appointmentId||'') , amount: String(amount) } })}> 
          <Text style={styles.payBtnText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 40, paddingBottom: 8, paddingHorizontal: 20,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,122,255,0.08)'
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2c3e50' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#007AFF', marginBottom: 18 },
  label: { fontSize: 16, color: '#374151', marginBottom: 4 },
  amount: { fontSize: 28, fontWeight: '700', color: '#2c3e50', marginBottom: 24 },
  payBtn: { backgroundColor: '#007AFF', borderRadius: 28, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center', marginTop: 24 },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
