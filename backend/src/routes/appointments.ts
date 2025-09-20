import { Router } from 'express';
import { db } from '../config/firebase';

const router = Router();

function wrap(handler: (req: any, res: any) => Promise<void>) {
  return async (req: any, res: any, next: any) => {
    try { await handler(req, res); } catch (err) { next(err); }
  };
}

// Create appointment
router.post('/', wrap(async (req, res) => {
  const { userId, doctorId, date, time, location } = req.body || {};
  if (!userId || !doctorId || !date || !time) return res.status(400).json({ error: 'userId, doctorId, date, time required' });
  const now = new Date();
  const ref = await db.collection('appointments').add({ userId, doctorId, date, time, location: location || null, status: 'Pending', createdAt: now, updatedAt: now });
  const snap = await ref.get();
  res.status(201).json({ id: ref.id, ...(snap.data() as any) });
}));

// List appointments (by user)
router.get('/', wrap(async (req, res) => {
  const { userId } = req.query as any;
  if (!userId) return res.status(400).json({ error: 'userId query required' });
  try {
    const snap = await db
      .collection('appointments')
      .where('userId', '==', String(userId))
      .limit(100)
      .get();
    const list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: d.id, ...(d.data() as any) }));
    // Sort in-memory by createdAt desc if available
    list.sort((a: any, b: any) => {
      const av = a?.createdAt?.toMillis ? a.createdAt.toMillis() : (a?.createdAt?._seconds ? a.createdAt._seconds * 1000 : 0);
      const bv = b?.createdAt?.toMillis ? b.createdAt.toMillis() : (b?.createdAt?._seconds ? b.createdAt._seconds * 1000 : 0);
      return bv - av;
    });
    return res.json(list);
  } catch (err: any) {
    console.error('[appointments] list error:', err?.message);
    // Return empty list instead of 500 to avoid breaking the app UI
    return res.json([]);
  }
}));

// Get one
router.get('/:id', wrap(async (req, res) => {
  const doc = await db.collection('appointments').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Not found' });
  res.json({ id: doc.id, ...(doc.data() as any) });
}));

// Update status
router.post('/:id/status', wrap(async (req, res) => {
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'status required' });
  await db.collection('appointments').doc(req.params.id).update({ status, updatedAt: new Date() });
  res.json({ message: 'updated' });
}));

// Edit appointment (date/time/location/doctorId)
router.put('/:id', wrap(async (req, res) => {
  const { date, time, location, doctorId } = req.body || {};
  const updates: Record<string, any> = {};
  if (typeof date !== 'undefined') updates.date = date;
  if (typeof time !== 'undefined') updates.time = time;
  if (typeof location !== 'undefined') updates.location = location;
  if (typeof doctorId !== 'undefined') updates.doctorId = doctorId;
  if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });
  updates.updatedAt = new Date();

  const docRef = db.collection('appointments').doc(req.params.id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });
  await docRef.update(updates);
  const updated = await docRef.get();
  res.json({ id: updated.id, ...(updated.data() as any) });
}));

export default router;
