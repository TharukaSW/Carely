import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import {
  caregiverSchema,
  doctorSchema,
  elderSchema,
  guardianSchema,
  passwordChangeSchema,
  profileUpdateSchema,
} from '../utils/schemas';
import {
  getUserByEmail,
  registerCaregiver,
  registerDoctor,
  registerElder,
  registerGuardian,
  updateUserProfile,
} from '../services/userService';
import { db, storageBucket } from '../config/firebase';

const router = Router();

const safeUser = (raw: any) => {
  if (!raw) return raw;
  const { passwordHash, ...rest } = raw;
  return rest;
};

function wrap(handler: (req: any, res: any) => Promise<void>) {
  return async (req: any, res: any, next: any) => {
    try {
      await handler(req, res);
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', issues: err.issues });
      }
      if (err?.message === 'Passwords do not match') {
        return res.status(400).json({ error: err.message });
      }
      if (err?.message === 'Email already registered') {
        return res.status(409).json({ error: err.message });
      }
      if (typeof err?.message === 'string' && err.message.includes('Firestore not initialized')) {
        return res.status(500).json({ error: 'Backend not configured (Firestore)', detail: err.message });
      }
      console.error('[register] unhandled error', err?.message, err?.stack);
      next(err);
    }
  };
}

const registerElderHandler = wrap(async (req, res) => {
  console.log('[POST] /api/register/elder body=', req.body);
  const parsed = elderSchema.parse(req.body);
  const id = await registerElder(parsed);
  res.status(201).json({ id });
});
router.post('/elder', registerElderHandler);
// Backwards compatibility
router.post('/elderly', registerElderHandler);

router.post('/_debug/elder-validate', (req, res) => {
  try {
    const parsed = elderSchema.parse(req.body);
    return res.json({ ok: true, parsed });
  } catch (err: any) {
    if (err?.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', issues: err.issues });
    return res.status(500).json({ error: err.message });
  }
});

const registerGuardianHandler = wrap(async (req, res) => {
  console.log('[POST] /api/register/guardian body=', req.body);
  const parsed = guardianSchema.parse(req.body);
  const id = await registerGuardian(parsed);
  res.status(201).json({ id });
});
router.post('/guardian', registerGuardianHandler);
router.post('/family', registerGuardianHandler);

router.post('/caregiver', wrap(async (req, res) => {
  console.log('[POST] /api/register/caregiver body=', req.body);
  const parsed = caregiverSchema.parse(req.body);
  const id = await registerCaregiver(parsed);
  res.status(201).json({ id });
}));

const registerDoctorHandler = wrap(async (req, res) => {
  console.log('[POST] /api/register/doctor body=', req.body);
  const parsed = doctorSchema.parse(req.body);
  const id = await registerDoctor(parsed);
  res.status(201).json({ id });
});
router.post('/doctor', registerDoctorHandler);
router.post('/healthcare', registerDoctorHandler);

router.get('/by-email/:email', wrap(async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(safeUser(user));
}));

router.get('/debug/all', wrap(async (_req, res) => {
  const snap = await db.collection('users').limit(50).get();
  const list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({
    id: d.id,
    ...safeUser(d.data() as any),
  }));
  res.json(list);
}));

// List users (safe) - optional excludeId query to omit current user and optional role filter
router.get('/users', wrap(async (req, res) => {
  const excludeId = (req.query.excludeId as string) || '';
  const roleFilter = (req.query.role as string) || '';

  const snap = await db.collection('users').limit(200).get();
  const list = snap.docs
    .map((d: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = safeUser(d.data() as any);
      return { id: d.id, ...data };
    })
    .filter((u: any) => (excludeId ? u.id !== excludeId : true))
    .filter((u: any) => (roleFilter ? u.role === roleFilter : true));
  res.json(list);
}));

router.get('/id/:id', wrap(async (req, res) => {
  const doc = await db.collection('users').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Not found' });
  res.json({ id: doc.id, ...safeUser(doc.data() as any) });
}));

router.get('/doctors', wrap(async (req, res) => {
  const locationQuery = ((req.query.location as string) || '').toLowerCase();
  const snap = await db.collection('users').where('role', '==', 'doctor').limit(150).get();
  let list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = safeUser(d.data() as any);
    const docData = (data as any).doctor || {};
    return {
      id: d.id,
      name: data.fullName,
      specialty: docData.specialty || docData.licenseNumber || 'Doctor',
      licenseNumber: docData.licenseNumber || null,
      location: docData.location || data.location || null,
      hospital: docData.hospital || null,
      clinicAddress: docData.clinicAddress || null,
      profileImage: data.profileImage || null,
      email: data.email,
      phone: data.phone || null,
    };
  });
  if (locationQuery) {
    list = list.filter((doc: any) => ((doc.location || '') as string).toLowerCase().includes(locationQuery));
  }
  res.json(list);
}));

router.get('/caregivers', wrap(async (req, res) => {
  const locationQuery = ((req.query.location as string) || '').toLowerCase();
  const snap = await db.collection('users').where('role', '==', 'caregiver').limit(200).get();
  let list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = safeUser(d.data() as any);
    const cg = (data as any).caregiver || {};
    return {
      id: d.id,
      name: data.fullName,
      location: cg.location || data.location || null,
      availability: cg.availability || null,
      experienceYears: cg.experienceYears || null,
      skills: cg.skills || [],
      phone: data.phone || null,
      email: data.email,
      profileImage: data.profileImage || cg.image || null,
    };
  });
  if (locationQuery) {
    list = list.filter((item: any) => ((item.location || '') as string).toLowerCase().includes(locationQuery));
  }
  res.json(list);
}));

router.get('/guardians', wrap(async (_req, res) => {
  const snap = await db.collection('users').where('role', '==', 'guardian').limit(100).get();
  const list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = safeUser(d.data() as any);
    const guardian = (data as any).guardian || {};
    return {
      id: d.id,
      name: data.fullName,
      relationship: guardian.relationship || null,
      elderId: guardian.elderId || null,
      elderEmail: guardian.elderEmail || null,
      phone: data.phone || null,
      email: data.email,
    };
  });
  res.json(list);
}));

router.get('/elders', wrap(async (_req, res) => {
  const snap = await db.collection('users').where('role', '==', 'elder').limit(150).get();
  const list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = safeUser(d.data() as any);
    const elder = (data as any).elder || {};
    return {
      id: d.id,
      name: data.fullName,
      guardianContact: elder.guardianContact || data.guardianContact || data.emergencyContact || null,
      guardianEmail: elder.guardianEmail || data.primaryGuardianEmail || null,
      caregiverPreference: elder.caregiverPreference || null,
      phone: data.phone || null,
      email: data.email,
      dateOfBirth: elder.dateOfBirth || data.dateOfBirth || null,
    };
  });
  res.json(list);
}));

router.post('/login', wrap(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  res.json(safeUser(user));
}));

router.get('/me', wrap(async (req, res) => {
  const email = req.query.email as string | undefined;
  if (!email) return res.status(400).json({ error: 'email query required' });
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(safeUser(user));
}));

router.put('/profile', wrap(async (req, res) => {
  const parsed = profileUpdateSchema.parse(req.body || {});
  const updated = await updateUserProfile(parsed);
  res.json({ message: 'Profile updated', user: safeUser(updated) });
}));
router.put('/profile/enhanced', wrap(async (req, res) => {
  const parsed = profileUpdateSchema.parse(req.body || {});
  const updated = await updateUserProfile(parsed);
  res.json({ message: 'Profile updated', user: safeUser(updated) });
}));

router.post('/change-password', wrap(async (req, res) => {
  const { email, currentPassword, newPassword } = passwordChangeSchema.parse(req.body || {});
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Current password incorrect' });
  const newHash = await bcrypt.hash(newPassword, 10);
  await db.collection('users').doc(user.id).update({ passwordHash: newHash, updatedAt: new Date() });
  res.json({ message: 'Password changed' });
}));

router.post('/profile/image', wrap(async (req, res) => {
  const { email, base64 } = req.body || {};
  if (!email || !base64) return res.status(400).json({ error: 'email and base64 required' });
  if (!storageBucket) return res.status(500).json({ error: 'Storage not configured' });
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const buffer = Buffer.from(base64, 'base64');
  const filename = `profile-images/${user.id || crypto.randomUUID()}.jpg`;
  const bucket = storageBucket.bucket();
  const file = bucket.file(filename);
  await file.save(buffer, {
    contentType: 'image/jpeg',
    public: true,
    metadata: { cacheControl: 'public,max-age=3600' },
  });
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
  await db.collection('users').doc(user.id).update({ profileImage: publicUrl, updatedAt: new Date() });
  res.json({ message: 'Uploaded', url: publicUrl });
}));

router.delete('/profile', wrap(async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  await db.collection('users').doc(user.id).update({
    deleted: true,
    deletedAt: new Date(),
    email: `deleted_${user.id}@deleted.com`,
    phone: null,
    primaryGuardianEmail: null,
    emergencyContact: null,
  });
  res.json({ message: 'Account deleted successfully' });
}));

export default router;
