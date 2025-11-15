import { Router } from 'express';
import { db } from '../config/firebase';

const router = Router();

const ALLOWED_STATUSES = ['Pending', 'Approved', 'Declined', 'Cancelled', 'Completed'] as const;

function wrap(handler: (req: any, res: any) => Promise<void>) {
  return async (req: any, res: any, next: any) => {
    try {
      await handler(req, res);
    } catch (err: any) {
      if (typeof err?.message === 'string' && err.message.includes('Firestore not initialized')) {
        return res.status(500).json({ error: 'Backend not configured (Firestore)', detail: err.message });
      }
      console.error('[appointments] error', err?.message, err?.stack);
      next(err);
    }
  };
}

const toMillis = (value: any): number => {
  try {
    if (!value) return 0;
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && typeof value.seconds === 'number') {
      return value.seconds * 1_000 + Math.floor((value.nanoseconds || 0) / 1_000_000);
    }
  } catch {
    return 0;
  }
  return 0;
};

const participantsFrom = (values: (string | null | undefined)[]) =>
  Array.from(new Set(values.filter(Boolean).map((v) => String(v)))) as string[];

// Create appointment
router.post(
  '/',
  wrap(async (req, res) => {
    const {
      patientId,
      userId,
      doctorId,
      date,
      time,
      location,
      createdById,
      createdByRole,
      caregiverId,
      guardianId,
      reason,
      notes,
    } = req.body || {};

    const patient = patientId || userId;
    if (!patient || !doctorId || !date || !time) {
      return res.status(400).json({ error: 'patientId/userId, doctorId, date, and time are required' });
    }

    const now = new Date();
    const participants = participantsFrom([patient, doctorId, caregiverId, guardianId, createdById]);

    const record = {
      patientId: String(patient),
      doctorId: String(doctorId),
      caregiverId: caregiverId ? String(caregiverId) : null,
      guardianId: guardianId ? String(guardianId) : null,
      createdById: createdById ? String(createdById) : String(patient),
      createdByRole: createdByRole ? String(createdByRole) : null,
      date: String(date),
      time: String(time),
      location: location ? String(location) : null,
      reason: reason ? String(reason) : '',
      notes: notes ? String(notes) : '',
      status: 'Pending',
      participants,
      createdAt: now,
      updatedAt: now,
      rescheduleHistory: [],
    };

    const ref = await db.collection('appointments').add(record);
    const snap = await ref.get();
    res.status(201).json({ id: ref.id, ...(snap.data() as any) });
  }),
);

// List appointments (by patient / creator / caregiver / guardian)
router.get(
  '/',
  wrap(async (req, res) => {
    const { patientId, userId, createdById, caregiverId, guardianId, status } = req.query as any;
    const targetPatient = patientId || userId;
    let query: FirebaseFirestore.Query = db.collection('appointments');

    if (targetPatient) {
      query = query.where('patientId', '==', String(targetPatient));
    } else if (createdById) {
      query = query.where('createdById', '==', String(createdById));
    } else if (caregiverId) {
      query = query.where('caregiverId', '==', String(caregiverId));
    } else if (guardianId) {
      query = query.where('guardianId', '==', String(guardianId));
    }

    const snap = await query.limit(150).get();
    let list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    if (status) {
      list = list.filter(
        (item: any) => String(item.status || '').toLowerCase() === String(status).toLowerCase(),
      );
    }
    list.sort((a: any, b: any) => toMillis(b.createdAt) - toMillis(a.createdAt));
    res.json(list);
  }),
);

// List appointments by doctor
router.get(
  '/for-doctor',
  wrap(async (req, res) => {
    const { doctorId, status } = req.query as any;
    if (!doctorId) return res.status(400).json({ error: 'doctorId query required' });
    const snap = await db
      .collection('appointments')
      .where('doctorId', '==', String(doctorId))
      .limit(150)
      .get();
    let list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    if (status) {
      list = list.filter(
        (item: any) => String(item.status || '').toLowerCase() === String(status).toLowerCase(),
      );
    }
    list.sort((a: any, b: any) => toMillis(b.createdAt) - toMillis(a.createdAt));
    res.json(list);
  }),
);

// Get one
router.get(
  '/:id',
  wrap(async (req, res) => {
    const doc = await db.collection('appointments').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...(doc.data() as any) });
  }),
);

// Update status
router.post(
  '/:id/status',
  wrap(async (req, res) => {
    const { status, updatedById, updatedByRole, note } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status required' });
    const normalized =
      typeof status === 'string'
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : status;
    if (!ALLOWED_STATUSES.includes(normalized as any)) {
      return res.status(400).json({ error: `Status must be one of ${ALLOWED_STATUSES.join(', ')}` });
    }

    const docRef = db.collection('appointments').doc(req.params.id);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });

    await docRef.update({
      status: normalized,
      decisionNote: note ? String(note) : null,
      decisionById: updatedById ? String(updatedById) : null,
      decisionByRole: updatedByRole ? String(updatedByRole) : null,
      decisionAt: new Date(),
      updatedAt: new Date(),
    });
    const updated = await docRef.get();
    res.json({ id: updated.id, ...(updated.data() as any) });
  }),
);

// Edit appointment (date/time/location/doctorId) only before approval/decline
router.put(
  '/:id',
  wrap(async (req, res) => {
    const { date, time, location, doctorId, caregiverId, guardianId, reason, notes } = req.body || {};
    const updates: Record<string, any> = {};
    if (date !== undefined) updates.date = String(date);
    if (time !== undefined) updates.time = String(time);
    if (location !== undefined) updates.location = location ? String(location) : null;
    if (doctorId !== undefined) updates.doctorId = doctorId ? String(doctorId) : null;
    if (caregiverId !== undefined) updates.caregiverId = caregiverId ? String(caregiverId) : null;
    if (guardianId !== undefined) updates.guardianId = guardianId ? String(guardianId) : null;
    if (reason !== undefined) updates.reason = reason ? String(reason) : '';
    if (notes !== undefined) updates.notes = notes ? String(notes) : '';

    if (!Object.keys(updates).length) return res.status(400).json({ error: 'No fields to update' });

    const docRef = db.collection('appointments').doc(req.params.id);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });

    const data = snap.data() as any;
    const participants = participantsFrom([
      data.patientId,
      updates.doctorId ?? data.doctorId,
      updates.caregiverId ?? data.caregiverId,
      updates.guardianId ?? data.guardianId,
      data.createdById,
    ]);
    updates.participants = participants;
    updates.updatedAt = new Date();
    updates.status = 'Pending';
    updates.decisionNote = null;
    updates.decisionById = null;
    updates.decisionByRole = null;
    updates.decisionAt = null;

    await docRef.update(updates);
    const updated = await docRef.get();
    res.json({ id: updated.id, ...(updated.data() as any) });
  }),
);

// Delete appointment (only if pending)
router.delete(
  '/:id',
  wrap(async (req, res) => {
    const rawId = String(req.params.id || '').trim();
    if (!rawId) return res.status(400).json({ error: 'Appointment id required' });
    const docRef = db.collection('appointments').doc(rawId);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });
    await docRef.update({
      status: 'Cancelled',
      cancelledAt: new Date(),
      updatedAt: new Date(),
    });
    res.json({ message: 'Appointment cancelled' });
  }),
);

export default router;
