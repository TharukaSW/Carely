import { Router } from 'express';
import { db } from '../config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

function wrap(handler: (req: any, res: any) => Promise<void>) {
  return async (req: any, res: any, _next: any) => {
    try {
      await handler(req, res);
    } catch (err: any) {
      if (typeof err?.message === 'string' && err.message.includes('Firestore not initialized')) {
        return res.status(500).json({ error: 'Backend not configured (Firestore)', detail: err.message });
      }
      const code = err?.code || err?.status || 500;
      const message = err?.message || 'Internal Server Error';
      console.error('[chat] error:', message, err?.stack || '');
      return res.status(500).json({ error: message });
    }
  };
}

// Create or find a conversation with specific participants
router.post('/conversations', wrap(async (req, res) => {
  const { participants } = req.body || {};
  if (!Array.isArray(participants) || participants.length < 2) {
    return res.status(400).json({ error: 'participants array (>=2) required' });
  }

  // Try to find an existing conversation with exactly these participants
  const participantsSorted = [...participants].sort();
  const existingSnap = await db.collection('conversations')
    .where('participantsSorted', '==', participantsSorted.join('|'))
    .limit(1)
    .get();
  if (!existingSnap.empty) {
    const doc = existingSnap.docs[0];
    return res.json({ id: doc.id, ...(doc.data() as any) });
  }

  const now = FieldValue.serverTimestamp();
  const docRef = await db.collection('conversations').add({
    participants,
    participantsSorted: participantsSorted.join('|'),
    createdAt: now,
    updatedAt: now,
    lastMessage: null,
  });
  const created = await docRef.get();
  res.status(201).json({ id: docRef.id, ...(created.data() as any) });
}));

// List conversations for a user
router.get('/conversations', wrap(async (req, res) => {
  const userId = (req.query.userId as string) || '';
  if (!userId) return res.status(400).json({ error: 'userId query required' });

  // Helper to safely get milliseconds from various Firestore timestamp shapes
  const toMillis = (v: any): number => {
    try {
      if (!v) return 0;
      if (typeof v.toMillis === 'function') return v.toMillis();
      if (v instanceof Date) return v.getTime();
      if (typeof v === 'number') return v;
      if (typeof v === 'object' && typeof v.seconds === 'number') {
        return v.seconds * 1000 + Math.floor((v.nanoseconds || 0) / 1_000_000);
      }
      return 0;
    } catch {
      return 0;
    }
  };

  let snap: FirebaseFirestore.QuerySnapshot;
  try {
    // Preferred query (requires composite index in Firestore)
    snap = await db.collection('conversations')
      .where('participants', 'array-contains', userId)
      .orderBy('updatedAt', 'desc')
      .limit(50)
      .get();
  } catch (err: any) {
    // Fallback without orderBy if index is missing
    const needsIndex = (err?.code === 9 /* FAILED_PRECONDITION */) ||
      (typeof err?.message === 'string' && /index/i.test(err.message));
    if (!needsIndex) throw err;
    console.warn('[chat] Missing composite index for conversations query; using fallback without orderBy(updatedAt).');
    snap = await db.collection('conversations')
      .where('participants', 'array-contains', userId)
      .limit(50)
      .get();
  }

  let conversations = await Promise.all(snap.docs.map(async (d: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = d.data() as any;
    const others: string[] = (data.participants || []).filter((p: string) => p !== userId);
    let otherUser: any = null;
    if (others[0]) {
      const otherDoc = await db.collection('users').doc(others[0]).get();
      otherUser = otherDoc.exists ? { id: otherDoc.id, ...(otherDoc.data() as any) } : null;
    }
    return { id: d.id, ...data, otherUser };
  }));

  // If we couldn't order by updatedAt at the query level, ensure stable sort here.
  conversations = conversations.sort((a: any, b: any) => toMillis(b.updatedAt) - toMillis(a.updatedAt));
  res.json(conversations);
}));

// List messages in a conversation
router.get('/conversations/:id/messages', wrap(async (req, res) => {
  const { id } = req.params;
  const limit = Number(req.query.limit || 50);
  const before = (req.query.before as string) || '';

  let query: FirebaseFirestore.Query = db.collection('conversations').doc(id).collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (before) {
    const beforeDate = new Date(before);
    if (!isNaN(beforeDate.getTime())) {
      query = query.where('createdAt', '<', beforeDate);
    }
  }

  const snap = await query.get();
  const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  // Return ascending order for UI convenience
  res.json(list.reverse());
}));

// Send a message in a conversation
router.post('/conversations/:id/messages', wrap(async (req, res) => {
  const { id } = req.params;
  const { senderId, text } = req.body || {};
  if (!senderId || !text) return res.status(400).json({ error: 'senderId and text required' });

  const now = new Date();
  const msgRef = await db.collection('conversations').doc(id).collection('messages').add({
    senderId,
    text,
    createdAt: now,
    status: 'sent',
  });

  await db.collection('conversations').doc(id).update({
    updatedAt: now,
    lastMessage: { senderId, text, createdAt: now },
  });

  const created = await msgRef.get();
  res.status(201).json({ id: msgRef.id, ...(created.data() as any) });
}));

export default router;
