import { Router } from 'express';
import { caregiverSchema, elderlySchema, familySchema, healthcareSchema, profileUpdateSchema, passwordChangeSchema } from '../utils/schemas';
import { registerCaregiver, registerElderly, registerFamily, registerHealthcare, getUserByEmail, updateUserProfile } from '../services/userService';
import { storageBucket } from '../config/firebase';
import crypto from 'crypto';
const safeUser = (u: any) => {
  if (!u) return u;
  const { passwordHash, ...rest } = u;
  return rest;
};
import { db } from '../config/firebase';
import bcrypt from 'bcryptjs';

const router = Router();

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

router.post('/elderly', wrap(async (req, res) => {
  console.log('[POST] /api/register/elderly body=', req.body);
  const parsed = elderlySchema.parse(req.body);
  const id = await registerElderly(parsed);
  res.status(201).json({ id });
}));

router.post('/_debug/elderly-validate', (req, res) => {
  try {
    const parsed = elderlySchema.parse(req.body);
    return res.json({ ok: true, parsed });
  } catch (err: any) {
    if (err?.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', issues: err.issues });
    return res.status(500).json({ error: err.message });
  }
});

router.post('/family', wrap(async (req, res) => {
  console.log('[POST] /api/register/family body=', req.body);
  const parsed = familySchema.parse(req.body);
  const id = await registerFamily(parsed);
  res.status(201).json({ id });
}));

router.post('/caregiver', wrap(async (req, res) => {
  console.log('[POST] /api/register/caregiver body=', req.body);
  const parsed = caregiverSchema.parse(req.body);
  const id = await registerCaregiver(parsed);
  res.status(201).json({ id });
}));

router.post('/healthcare', wrap(async (req, res) => {
  console.log('[POST] /api/register/healthcare body=', req.body);
  const parsed = healthcareSchema.parse(req.body);
  const id = await registerHealthcare(parsed);
  res.status(201).json({ id });
}));

router.get('/by-email/:email', wrap( async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { passwordHash, ...safe } = user as any;
  res.json(safe);
}));

router.get('/debug/all', wrap(async (_req, res) => {
  const snap = await db.collection('users').limit(50).get();
  const list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => {
    const { passwordHash, ...rest } = d.data() as any;
    return { id: d.id, ...rest };
  });
  res.json(list);
}));

router.get('/id/:id', wrap(async (req, res) => {
  const doc = await db.collection('users').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Not found' });
  const { passwordHash, ...safe } = doc.data() as any;
  res.json({ id: doc.id, ...safe });
}));

// List all registered doctors (healthcare role)
router.get('/doctors', wrap(async (_req, res) => {
  const snap = await db.collection('users').where('role','==','healthcare').limit(100).get();
  const list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => {
    const { passwordHash, ...rest } = d.data() as any;
    const hc = (rest as any).healthcare || {};
    return {
      id: d.id,
      name: rest.fullName,
      specialty: hc.profession || hc.license || 'Healthcare',
      location: hc.location || null,
      profileImage: rest.profileImage || null,
      email: rest.email,
    };
  });
  res.json(list);
}));

router.post('/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const { passwordHash, ...safe } = user as any;
  res.json(safe);
}));

router.get('/me', wrap(async (req, res) => {
  const email = req.query.email as string | undefined;
  if (!email) return res.status(400).json({ error: 'email query required' });
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { passwordHash, ...safe } = user as any;
  res.json(safe);
}));
router.put('/profile', wrap(async (req, res) => {
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
  await db.collection('users').doc(user.id).update({ passwordHash: newHash });
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
  await file.save(buffer, { contentType: 'image/jpeg', public: true, metadata: { cacheControl: 'public,max-age=3600' } });
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
  await db.collection('users').doc(user.id).update({ profileImage: publicUrl });
  res.json({ message: 'Uploaded', url: publicUrl });
}));

export default router;
