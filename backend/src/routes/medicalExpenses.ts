import { Router } from 'express';
import { db } from '../config/firebase';

const router = Router();

function wrap(handler: (req: any, res: any) => Promise<void>) {
  return async (req: any, res: any, next: any) => {
    try { await handler(req, res); } catch (err) { next(err); }
  };
}

// Create medical expense
router.post('/', wrap(async (req, res) => {
  const { userId, amount, category, description, date, receiptUrl } = req.body || {};
  if (!userId || !amount || !category) {
    return res.status(400).json({ error: 'userId, amount, and category are required' });
  }
  
  const now = new Date();
  const expenseData = {
    userId: String(userId),
    amount: Number(amount),
    category: String(category),
    description: String(description || ''),
    date: date ? String(date) : now.toISOString().split('T')[0], // Default to today
    receiptUrl: String(receiptUrl || ''),
    createdAt: now,
    updatedAt: now
  };
  
  const ref = await db.collection('medicalExpenses').add(expenseData);
  const snap = await ref.get();
  res.status(201).json({ id: ref.id, ...(snap.data() as any) });
}));

// List medical expenses for a user
router.get('/', wrap(async (req, res) => {
  const { userId } = req.query as any;
  if (!userId) return res.status(400).json({ error: 'userId query required' });
  
  const snap = await db.collection('medicalExpenses')
    .where('userId', '==', String(userId))
    .orderBy('date', 'desc')
    .limit(100)
    .get();
    
  const expenses = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({
    id: d.id,
    ...(d.data() as any)
  }));
  
  res.json(expenses);
}));

// Get single expense
router.get('/:id', wrap(async (req, res) => {
  const doc = await db.collection('medicalExpenses').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Expense not found' });
  res.json({ id: doc.id, ...(doc.data() as any) });
}));

// Update expense
router.put('/:id', wrap(async (req, res) => {
  const { amount, category, description, date, receiptUrl } = req.body || {};
  const updates: Record<string, any> = {};
  
  if (typeof amount !== 'undefined') updates.amount = Number(amount);
  if (typeof category !== 'undefined') updates.category = String(category);
  if (typeof description !== 'undefined') updates.description = String(description);
  if (typeof date !== 'undefined') updates.date = String(date);
  if (typeof receiptUrl !== 'undefined') updates.receiptUrl = String(receiptUrl);
  
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  updates.updatedAt = new Date();
  
  const docRef = db.collection('medicalExpenses').doc(req.params.id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: 'Expense not found' });
  
  await docRef.update(updates);
  const updated = await docRef.get();
  res.json({ id: updated.id, ...(updated.data() as any) });
}));

// Delete expense
router.delete('/:id', wrap(async (req, res) => {
  const doc = await db.collection('medicalExpenses').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Expense not found' });
  
  await db.collection('medicalExpenses').doc(req.params.id).delete();
  res.json({ message: 'Expense deleted successfully' });
}));

// Get expense summary/statistics for a user
router.get('/stats/:userId', wrap(async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query as any;
  
  let query = db.collection('medicalExpenses').where('userId', '==', String(userId));
  
  if (startDate) query = query.where('date', '>=', String(startDate));
  if (endDate) query = query.where('date', '<=', String(endDate));
  
  const snap = await query.get();
  const expenses = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as any);
  
  const total = expenses.reduce((sum: number, exp: any) => sum + Number(exp.amount || 0), 0);
  const byCategory = expenses.reduce((acc: Record<string, number>, exp: any) => {
    const cat = exp.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(exp.amount || 0);
    return acc;
  }, {} as Record<string, number>);
  
  res.json({
    total,
    count: expenses.length,
    byCategory,
    period: { startDate, endDate }
  });
}));

export default router;