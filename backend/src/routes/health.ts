import { Router } from 'express';
import { firebaseReady } from '../config/firebase';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', firebase: firebaseReady ? 'ready' : 'not-initialized' });
});

export default router;
