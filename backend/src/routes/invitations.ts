import { Router } from 'express';
import { db } from '../config/firebase';

const router = Router();

function wrap(handler: (req: any, res: any) => Promise<void>) {
  return async (req: any, res: any, next: any) => {
    try {
      await handler(req, res);
    } catch (err: any) {
      if (typeof err?.message === 'string' && err.message.includes('Firestore not initialized')) {
        return res.status(500).json({ error: 'Backend not configured (Firestore)', detail: err.message });
      }
      console.error('[invitations] error', err?.message, err?.stack);
      next(err);
    }
  };
}

const ALLOWED_STATUSES = ['pending', 'accepted', 'declined', 'cancelled'] as const;

router.post(
  '/',
  wrap(async (req, res) => {
    const { guardianId, caregiverId, elderId, message, locationPreference, createdById } = req.body || {};
    if (!guardianId || !caregiverId || !elderId) {
      return res.status(400).json({ error: 'guardianId, caregiverId, and elderId are required' });
    }
    const now = new Date();
    const record = {
      guardianId: String(guardianId),
      caregiverId: String(caregiverId),
      elderId: String(elderId),
      message: message ? String(message) : '',
      locationPreference: locationPreference ? String(locationPreference) : null,
      createdById: createdById ? String(createdById) : String(guardianId),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      responders: [],
    };

    const ref = await db.collection('caregiverInvitations').add(record);
    const snap = await ref.get();
    res.status(201).json({ id: ref.id, ...(snap.data() as any) });
  }),
);

router.get(
  '/',
  wrap(async (req, res) => {
    const { guardianId, caregiverId, elderId, status } = req.query as any;
    let query: FirebaseFirestore.Query = db.collection('caregiverInvitations');
    if (guardianId) query = query.where('guardianId', '==', String(guardianId));
    if (caregiverId) query = query.where('caregiverId', '==', String(caregiverId));
    if (elderId) query = query.where('elderId', '==', String(elderId));
    if (status) query = query.where('status', '==', String(status).toLowerCase());

    const snap = await query.orderBy('createdAt', 'desc').limit(100).get().catch(async (err: any) => {
      const needsIndex =
        err?.code === 9 ||
        (typeof err?.message === 'string' && /index/i.test(err.message ?? ''));
      if (!needsIndex) throw err;
      // Fallback without ordering to avoid index requirement
      const fallback = await (db.collection('caregiverInvitations') as FirebaseFirestore.Query).get();
      return fallback;
    });

    const docs = 'docs' in snap ? snap.docs : (snap as any).docs;
    const list = docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    res.json(list);
  }),
);

router.post(
  '/:id/respond',
  wrap(async (req, res) => {
    const { status, responderId, note } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status required' });
    const normalized = String(status).toLowerCase();
    if (!ALLOWED_STATUSES.includes(normalized as any)) {
      return res.status(400).json({ error: `status must be one of ${ALLOWED_STATUSES.join(', ')}` });
    }
    const docRef = db.collection('caregiverInvitations').doc(req.params.id);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Invitation not found' });

    const data = snap.data() as any;
    const responders = Array.isArray(data.responders) ? data.responders : [];
    if (responderId) {
      const responderStr = String(responderId);
      if (!responders.includes(responderStr)) responders.push(responderStr);
    }

    await docRef.update({
      status: normalized,
      responders,
      responseNote: note ? String(note) : null,
      respondedAt: new Date(),
      updatedAt: new Date(),
    });
    const updated = await docRef.get();
    res.json({ id: updated.id, ...(updated.data() as any) });
  }),
);

router.put(
  '/:id',
  wrap(async (req, res) => {
    const updates: Record<string, any> = {};
    const { message, locationPreference } = req.body || {};
    if (message !== undefined) updates.message = String(message);
    if (locationPreference !== undefined)
      updates.locationPreference = locationPreference ? String(locationPreference) : null;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    updates.updatedAt = new Date();

    const docRef = db.collection('caregiverInvitations').doc(req.params.id);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Invitation not found' });

    await docRef.update(updates);
    const updated = await docRef.get();
    res.json({ id: updated.id, ...(updated.data() as any) });
  }),
);

router.delete(
  '/:id',
  wrap(async (req, res) => {
    const docRef = db.collection('caregiverInvitations').doc(req.params.id);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Invitation not found' });
    await docRef.delete();
    res.json({ message: 'Invitation deleted' });
  }),
);

export default router;
