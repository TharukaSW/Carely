import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';

dotenv.config();

let app: App | null = null;
export let firebaseReady = false;
const haveEnv = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
export let storageBucket: ReturnType<typeof getStorage> | null = null;

if (haveEnv) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');
  if (!getApps().length) {
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey,
      }),
      storageBucket: bucketName,
    });
    firebaseReady = true;
  } else {
    app = getApps()[0]!;
    firebaseReady = true;
  }
}

export const db = app ? getFirestore(app) : ({
  collection() {
    throw new Error('Firestore not initialized: missing Firebase env vars');
  },
} as any);

if (app) {
  try {
    storageBucket = getStorage(app);
  } catch {}
}
