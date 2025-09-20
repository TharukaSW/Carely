import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { listExpenses, deleteExpense, getExpenseStats, MedicalExpense, ExpenseStats } from '../services/medicalExpenses';
import { getUser, SessionUser } from '../session';
import NavigationBar from '@/components/NavigationBar';

export default function MedicalExpenseTracker() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [expenses, setExpenses] = useState<MedicalExpense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const currentUser = await getUser();
      if (!currentUser?.id) {
        setError('Please login first');
        return;
      }
      setUser(currentUser);
      
      const [expenseList, expenseStats] = await Promise.all([
        listExpenses(currentUser.id),
        getExpenseStats(currentUser.id)
      ]);
      
      setExpenses(expenseList);
      setStats(expenseStats);
    } catch (e: any) {
      setError(e?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (expense: MedicalExpense) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete this ${expense.category} expense of $${expense.amount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
              await loadData(); // Refresh the list
            } catch (e: any) {
              Alert.alert('Error', e?.message || 'Failed to delete expense');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const renderExpenseItem = ({ item }: { item: MedicalExpense }) => (
    <TouchableOpacity 
      style={styles.expenseCard}
      onPress={() => router.push({ 
        pathname: '/(expense-mgt)/edit-expense', 
        params: { 
          id: item.id, 
          expense: JSON.stringify(item) 
        } 
      })}
    >
      <LinearGradient colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.9)"]} style={styles.cardGradient}>
        <View style={styles.cardHeader}>
          <View style={styles.categoryContainer}>
            <LinearGradient colors={["#007AFF", "#0051D5"]} style={styles.categoryIcon}>
              <MaterialIcons name="medical-services" size={18} color="#fff" />
            </LinearGradient>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryText}>{item.category}</Text>
              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
        {item.description ? (
          <Text style={styles.descriptionText} numberOfLines={2}>{item.description}</Text>
        ) : null}
      </LinearGradient>
    </TouchableOpacity>
  );

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
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
        {/* Header */}
        <LinearGradient colors={["#007AFF", "#0051D5"]} style={styles.headerGradient}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Medical Expenses</Text>
            <TouchableOpacity 
              style={styles.addBtn} 
              onPress={() => router.push('/(expense-mgt)/add-expense')}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Card */}
        {stats && (
          <View style={styles.statsContainer}>
            <LinearGradient colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.9)"]} style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>${stats.total.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Total Spent</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.count}</Text>
                  <Text style={styles.statLabel}>Expenses</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {stats.count > 0 ? `$${(stats.total / stats.count).toFixed(0)}` : '$0'}
                  </Text>
                  <Text style={styles.statLabel}>Average</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Expense List */}
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="receipt-long" size={64} color="#C7D2FE" />
              <Text style={styles.emptyTitle}>No Expenses Yet</Text>
              <Text style={styles.emptySubtitle}>Start tracking your medical expenses</Text>
              <TouchableOpacity 
                style={styles.emptyBtn}
                onPress={() => router.push('/(expense-mgt)/add-expense')}
              >
                <Text style={styles.emptyBtnText}>Add First Expense</Text>
              </TouchableOpacity>
            </View>
          }
        />

        <NavigationBar />
      </SafeAreaView>
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
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)'
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  statsContainer: { paddingHorizontal: 20, marginTop: 20 },
  statsCard: {
    borderRadius: 18,
    padding: 20,
    shadowColor: '#007AFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#8E8E93', marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: '#E5E7EB', marginHorizontal: 10 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 20 },
  expenseCard: { marginBottom: 12 },
  cardGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryInfo: { flex: 1 },
  categoryText: { fontSize: 16, fontWeight: '700', color: '#2c3e50' },
  dateText: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  amountContainer: { flexDirection: 'row', alignItems: 'center' },
  amountText: { fontSize: 18, fontWeight: '800', color: '#007AFF', marginRight: 12 },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
  },
  descriptionText: { marginTop: 8, fontSize: 14, color: '#6B7280', lineHeight: 18 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#2c3e50', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#8E8E93', marginTop: 4, textAlign: 'center' },
  emptyBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  errorText: { color: '#FF3B30', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  retryBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});