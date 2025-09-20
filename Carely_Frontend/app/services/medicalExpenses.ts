import { apiFetch } from '../api';

export type MedicalExpense = {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD format
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseInput = {
  userId: string;
  amount: number;
  category: string;
  description?: string;
  date?: string;
  receiptUrl?: string;
};

export type ExpenseUpdate = Partial<Pick<ExpenseInput, 'amount' | 'category' | 'description' | 'date' | 'receiptUrl'>>;

export type ExpenseStats = {
  total: number;
  count: number;
  byCategory: Record<string, number>;
  period: { startDate?: string; endDate?: string };
};

// Common expense categories
export const EXPENSE_CATEGORIES = [
  'Doctor Visit',
  'Medication',
  'Laboratory Tests',
  'X-Ray/Imaging',
  'Surgery',
  'Physical Therapy',
  'Dental Care',
  'Emergency Care',
  'Medical Equipment',
  'Insurance Premium',
  'Other'
];

export async function createExpense(input: ExpenseInput): Promise<MedicalExpense> {
  return apiFetch('/medical-expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function listExpenses(userId: string): Promise<MedicalExpense[]> {
  return apiFetch(`/medical-expenses?userId=${encodeURIComponent(userId)}`);
}

export async function getExpense(id: string): Promise<MedicalExpense> {
  return apiFetch(`/medical-expenses/${id}`);
}

export async function updateExpense(id: string, updates: ExpenseUpdate): Promise<MedicalExpense> {
  return apiFetch(`/medical-expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteExpense(id: string): Promise<{ message: string }> {
  return apiFetch(`/medical-expenses/${id}`, {
    method: 'DELETE',
  });
}

export async function getExpenseStats(userId: string, startDate?: string, endDate?: string): Promise<ExpenseStats> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/medical-expenses/stats/${encodeURIComponent(userId)}${query}`);
}