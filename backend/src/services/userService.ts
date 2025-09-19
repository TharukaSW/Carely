import { db } from '../config/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';
import { ElderlyInput, FamilyInput, CaregiverInput, HealthcareInput } from '../utils/schemas';

interface BaseUserDoc {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  passwordHash: string;
  createdAt: FirebaseFirestore.FieldValue;
}

const usersCol = () => db.collection('users');

export async function emailExists(email: string) {
  const snap = await usersCol().where('email', '==', email).limit(1).get();
  return !snap.empty;
}

export async function getUserByEmail(email: string) {
  const snap = await usersCol().where('email', '==', email).limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...(snap.docs[0].data() as any) };
}

export async function createUser(role: string, data: any) {
  const { password, confirmPassword, ...rest } = data;
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  if (await emailExists(data.email)) {
    throw new Error('Email already registered');
  }
  console.log(`[register] creating user role=${role} email=${data.email}`);
  const passwordHash = await bcrypt.hash(password, 10);
  const base: BaseUserDoc = {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    role,
    passwordHash,
    createdAt: FieldValue.serverTimestamp() as any,
  };
  const doc = await usersCol().add({ ...base, [role]: rest });
  console.log(`[register] created user docId=${doc.id}`);
  return doc.id;
}

export async function registerElderly(data: ElderlyInput) {
  return createUser('elderly', data);
}
export async function registerFamily(data: FamilyInput) {
  return createUser('family', data);
}
export async function registerCaregiver(data: CaregiverInput) {
  return createUser('caregiver', data);
}
export async function registerHealthcare(data: HealthcareInput) {
  return createUser('healthcare', data);
}

export async function updateUserProfile(update: { id?: string; email?: string; fullName?: string; phone?: string; address?: string; profileImage?: string; }) {
  if (!update.id && !update.email) throw new Error('id or email required');
  let docRef;
  if (update.id) {
    docRef = usersCol().doc(update.id);
  } else {
    const snap = await usersCol().where('email','==',update.email).limit(1).get();
    if (snap.empty) throw new Error('User not found');
    docRef = snap.docs[0].ref;
  }
  const patch: any = {};
  ['fullName','phone','address','profileImage'].forEach(k => {
    if ((update as any)[k] !== undefined) patch[k] = (update as any)[k];
  });
  if (!Object.keys(patch).length) throw new Error('No updatable fields provided');
  await docRef.update(patch);
  const fresh = await docRef.get();
  return { id: fresh.id, ...(fresh.data() as any) };
}
