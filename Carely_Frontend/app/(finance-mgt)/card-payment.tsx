import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { chargePayment } from '@/app/services/payments';

export default function CardPaymentScreen() {
  const params = useLocalSearchParams() as { appointmentId?: string; amount?: string };
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Payment</Text>
        <View style={{ width: 32 }} />
      </View>
      {/* Card Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          keyboardType="number-pad"
          value={cardNumber}
          onChangeText={setCardNumber}
          maxLength={19}
        />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Expiry</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={expiry}
              onChangeText={setExpiry}
              maxLength={5}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              keyboardType="number-pad"
              value={cvv}
              onChangeText={setCvv}
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={async () => {
            try {
              const appointmentId = String(params.appointmentId || '');
              const amount = Number(params.amount || 2500);
              const res = await chargePayment(appointmentId, amount, 'LKR');
              router.push({ pathname: '/(finance-mgt)/payment-success', params: { paymentId: String(res.id || '') } });
            } catch (err: any) {
              alert(err?.message || 'Payment failed');
            }
          }}
        >
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
  form: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  label: { fontSize: 15, color: '#374151', marginBottom: 4 },
  input: { width: '100%', borderWidth: 1, borderColor: '#E5E5E7', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12, backgroundColor: '#F5FAFF' },
  row: { flexDirection: 'row', width: '100%' },
  payBtn: { backgroundColor: '#007AFF', borderRadius: 28, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center', marginTop: 24 },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
