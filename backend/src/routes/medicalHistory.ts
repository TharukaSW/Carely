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
      console.error('[medicalHistory] error', err?.message, err?.stack);
      next(err);
    }
  };
}

const parseArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v));
  return String(value)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const toMillis = (ts: any): number => {
  try {
    if (!ts) return 0;
    if (typeof ts.toMillis === 'function') return ts.toMillis();
    if (ts instanceof Date) return ts.getTime();
    if (typeof ts === 'number') return ts;
    if (typeof ts === 'object' && typeof ts.seconds === 'number') {
      return ts.seconds * 1_000 + Math.floor((ts.nanoseconds || 0) / 1_000_000);
    }
  } catch {
    return 0;
  }
  return 0;
};

router.post(
  '/',
  wrap(async (req, res) => {
    const {
      patientId,
      doctorId,
      caregiverId,
      guardianId,
      appointmentId,
      summary,
      diagnosis,
      medications,
      notes,
      createdById,
      createdByRole,
      attachments,
    } = req.body || {};

    if (!patientId) return res.status(400).json({ error: 'patientId required' });
    if (!createdById) return res.status(400).json({ error: 'createdById required' });
    if (!summary) return res.status(400).json({ error: 'summary required' });

    const now = new Date();
    const viewers = new Set<string>();
    [patientId, doctorId, caregiverId, guardianId, createdById]
      .filter((v) => v)
      .forEach((v) => viewers.add(String(v)));

    const record: Record<string, any> = {
      patientId: String(patientId),
      doctorId: doctorId ? String(doctorId) : null,
      caregiverId: caregiverId ? String(caregiverId) : null,
      guardianId: guardianId ? String(guardianId) : null,
      appointmentId: appointmentId ? String(appointmentId) : null,
      summary: String(summary),
      diagnosis: diagnosis ? String(diagnosis) : null,
      medications: parseArray(medications),
      notes: notes ? String(notes) : '',
      attachments: Array.isArray(attachments) ? attachments : [],
      createdById: String(createdById),
      createdByRole: createdByRole ? String(createdByRole) : null,
      viewers: Array.from(viewers),
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection('medicalHistory').add(record);
    const snap = await ref.get();
    res.status(201).json({ id: ref.id, ...(snap.data() as any) });
  }),
);

router.get(
  '/',
  wrap(async (req, res) => {
    const { patientId, doctorId, caregiverId, guardianId, viewerId, limit = '100' } = req.query as any;

    let query: FirebaseFirestore.Query = db.collection('medicalHistory');
    if (patientId) {
      query = query.where('patientId', '==', String(patientId));
    } else if (viewerId) {
      query = query.where('viewers', 'array-contains', String(viewerId));
    } else if (doctorId) {
      query = query.where('doctorId', '==', String(doctorId));
    } else if (caregiverId) {
      query = query.where('caregiverId', '==', String(caregiverId));
    } else if (guardianId) {
      query = query.where('guardianId', '==', String(guardianId));
    }

    const snap = await query.limit(Number(limit) || 100).get();
    const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    list.sort((a: any, b: any) => toMillis(b.updatedAt) - toMillis(a.updatedAt));
    res.json(list);
  }),
);

router.get(
  '/:id',
  wrap(async (req, res) => {
    const doc = await db.collection('medicalHistory').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...(doc.data() as any) });
  }),
);

router.put(
  '/:id',
  wrap(async (req, res) => {
    const updates: Record<string, any> = {};
    const { summary, diagnosis, medications, notes, attachments, viewers } = req.body || {};
    if (summary !== undefined) updates.summary = String(summary);
    if (diagnosis !== undefined) updates.diagnosis = diagnosis ? String(diagnosis) : null;
    if (medications !== undefined) updates.medications = parseArray(medications);
    if (notes !== undefined) updates.notes = notes ? String(notes) : '';
    if (attachments !== undefined) updates.attachments = Array.isArray(attachments) ? attachments : [];
    if (viewers !== undefined) {
      const arr = Array.isArray(viewers) ? viewers : [viewers];
      updates.viewers = Array.from(new Set(arr.map((v: any) => String(v))));
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    updates.updatedAt = new Date();

    const docRef = db.collection('medicalHistory').doc(req.params.id);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });
    await docRef.update(updates);
    const updated = await docRef.get();
    res.json({ id: updated.id, ...(updated.data() as any) });
  }),
);

router.delete(
  '/:id',
  wrap(async (req, res) => {
    const docRef = db.collection('medicalHistory').doc(req.params.id);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });
    await docRef.delete();
    res.json({ message: 'Deleted' });
  }),
);

export default router;
