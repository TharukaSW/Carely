import { Router } from 'express';
import { db } from '../config/firebase';

const router = Router();

function wrap(handler: (req: any, res: any) => Promise<void>) {
  return async (req: any, res: any, next: any) => {
    try { await handler(req, res); } catch (err) { next(err); }
  };
}

// Mock charge endpoint
router.post('/charge', wrap(async (req, res) => {
  const { appointmentId, amount, currency = 'LKR', method = 'card' } = req.body || {};
  if (!appointmentId || !amount) return res.status(400).json({ error: 'appointmentId and amount required' });

  // Record payment
  const now = new Date();
  const payRef = await db.collection('payments').add({ appointmentId, amount, currency, method, status: 'success', createdAt: now });

  // Update appointment status to Confirmed
  await db.collection('appointments').doc(appointmentId).update({ status: 'Approved', updatedAt: now });

  const snap = await payRef.get();
  return res.status(201).json({ id: payRef.id, ...(snap.data() as any) });
}));

router.get('/:id', wrap(async (req, res) => {
  const doc = await db.collection('payments').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Not found' });
  res.json({ id: doc.id, ...(doc.data() as any) });
}));

export default router;
