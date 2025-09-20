import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { updateExpense, deleteExpense, EXPENSE_CATEGORIES, MedicalExpense } from '../services/medicalExpenses';
import { getUser } from '../session';

export default function EditExpenseScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // Pre-fill form with existing expense data
    if (params.expense) {
      try {
        const expense: MedicalExpense = JSON.parse(params.expense as string);
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setDescription(expense.description || '');
        setDate(expense.date);
      } catch (error) {
        Alert.alert('Error', 'Failed to load expense data');
        router.back();
      }
    }
  }, [params.expense]);

  const onSave = async () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Please fill in amount and category');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!params.id) {
      Alert.alert('Error', 'Expense ID not found');
      return;
    }

    try {
      setLoading(true);
      const user = await getUser();
      if (!user?.id) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      await updateExpense(params.id as string, {
        amount: Number(amount),
        category,
        description,
        date,
      });

      Alert.alert('Success', 'Expense updated successfully');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteExpense(params.id as string);
              Alert.alert('Success', 'Expense deleted successfully');
              router.back();
            } catch (e: any) {
              Alert.alert('Error', e?.message || 'Failed to delete expense');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient colors={["#007AFF", "#0051D5"]} style={styles.headerGradient}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Expense</Text>
              <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                <Ionicons name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
          
          <View style={styles.card}>
            <Text style={styles.label}>Amount ($)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              style={styles.input}
              placeholderTextColor="#8E8E93"
              keyboardType="decimal-pad"
            />
            
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.label}>Date</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              style={styles.input}
              placeholderTextColor="#8E8E93"
            />
            
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add notes about this expense..."
              style={[styles.input, styles.textArea]}
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => router.back()}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.saveBtn, loading && { opacity: 0.7 }]} 
                onPress={onSave} 
                disabled={loading}
              >
                <Text style={styles.saveText}>
                  {loading ? 'Saving...' : 'Update Expense'}
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
  deleteBtn: {
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255,255,255,0.18)'
  },
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    backgroundColor: '#F5FAFF',
  },
  categoryChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
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