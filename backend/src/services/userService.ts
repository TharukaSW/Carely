import bcrypt from 'bcryptjs';
import { FieldValue } from 'firebase-admin/firestore';

import { db } from '../config/firebase';
import {
  CaregiverInput,
  DoctorInput,
  ElderInput,
  GuardianInput,
} from '../utils/schemas';

type RoleKey = 'elder' | 'guardian' | 'caregiver' | 'doctor';

interface BaseUserDoc {
  fullName: string;
  email: string;
  phone?: string;
  role: RoleKey;
  passwordHash: string;
  createdAt: FirebaseFirestore.FieldValue;
  emergencyContact?: string;
  location?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  primaryGuardianEmail?: string;
}

const usersCol = () => db.collection('users');
const clean = <T>(val: T) => (val === undefined || val === null || val === '' ? undefined : val);

function normaliseRolePayload(role: RoleKey, payload: Record<string, any>) {
  const roleData: Record<string, any> = {};
  const basePatch: Partial<BaseUserDoc> & Record<string, any> = {};

  switch (role) {
    case 'elder': {
      const dateOfBirth = payload.dateOfBirth || payload.dob;
      const guardianContact =
        payload.guardianContact || payload.familyContact || payload.emergencyContact;
      const guardianEmail = payload.guardianEmail || payload.familyEmail;
      const address = payload.address;

      roleData.dateOfBirth = clean(dateOfBirth);
      roleData.gender = clean(payload.gender);
      roleData.address = clean(address);
      roleData.guardianContact = clean(guardianContact);
      roleData.guardianEmail = clean(guardianEmail);
      roleData.sosNote = clean(payload.sosNote);
      roleData.caregiverPreference =
        clean(payload.caregiverPreference || payload.preferredCaregiverId || payload.caregiverIdPreference);

      basePatch.emergencyContact = clean(guardianContact);
      basePatch.guardianContact = clean(guardianContact);
      basePatch.primaryGuardianEmail = clean(guardianEmail);
      basePatch.address = clean(address);
      basePatch.dateOfBirth = clean(dateOfBirth);
      break;
    }
    case 'guardian': {
      roleData.relationship = clean(payload.relationship);
      roleData.elderId = clean(payload.elderId || payload.elderlyId);
      roleData.elderEmail = clean(payload.elderEmail || payload.elderlyEmail);
      roleData.elderName = clean(payload.elderName || payload.elderlyName);
      roleData.address = clean(payload.address);
      basePatch.address = clean(payload.address);
      break;
    }
    case 'caregiver': {
      const location = payload.location || payload.address;
      const experience =
        payload.experienceYears ?? payload.experience ?? payload.yearsOfExperience;
      const skillsRaw = payload.skills || payload.skillset || payload.specializations;

      roleData.nic = clean(payload.nic);
      roleData.address = clean(payload.address);
      roleData.location = clean(location);
      roleData.availability = clean(payload.availability);
      roleData.bio = clean(payload.bio || payload.about);
      roleData.image = clean(payload.image);
      roleData.preferredElderGender = clean(payload.preferredElderGender || payload.preferredGender);

      if (experience !== undefined && experience !== '') {
        roleData.experienceYears = Number(experience);
      }
      if (skillsRaw) {
        const skills = Array.isArray(skillsRaw)
          ? skillsRaw
          : String(skillsRaw)
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
        roleData.skills = skills;
      }
      basePatch.location = clean(location);
      if (payload.image) basePatch.profileImage = clean(payload.image);
      break;
    }
    case 'doctor': {
      const location = payload.location || payload.clinicAddress || payload.hospital;
      roleData.specialty = clean(payload.specialty || payload.profession);
      roleData.licenseNumber = clean(payload.licenseNumber || payload.license);
      roleData.hospital = clean(payload.hospital || payload.hospitalName);
      roleData.clinicAddress = clean(payload.clinicAddress || payload.clinic);
      roleData.location = clean(location);
      roleData.bio = clean(payload.bio || payload.about);
      basePatch.location = clean(location);
      break;
    }
    default:
      break;
  }

  Object.keys(roleData).forEach((key) => {
    if (roleData[key] === undefined) delete roleData[key];
  });
  Object.keys(basePatch).forEach((key) => {
    if (basePatch[key] === undefined) delete basePatch[key];
  });

  return { roleData, basePatch };
}

export async function emailExists(email: string) {
  const snap = await usersCol().where('email', '==', email).limit(1).get();
  return !snap.empty;
}

export async function getUserByEmail(email: string) {
  const snap = await usersCol().where('email', '==', email).limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...(snap.docs[0].data() as any) };
}

export async function createUser(role: RoleKey, data: any) {
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
    email: data.email.toLowerCase(),
    phone: clean(data.phone),
    role,
    passwordHash,
    createdAt: FieldValue.serverTimestamp() as any,
  };

  const { roleData, basePatch } = normaliseRolePayload(role, rest);
  const doc = await usersCol().add({
    ...base,
    ...basePatch,
    [role]: roleData,
    updatedAt: FieldValue.serverTimestamp() as any,
  });
  console.log(`[register] created user docId=${doc.id}`);
  return doc.id;
}

export async function registerElder(data: ElderInput) {
  return createUser('elder', data);
}
export async function registerGuardian(data: GuardianInput) {
  return createUser('guardian', data);
}
export async function registerCaregiver(data: CaregiverInput) {
  return createUser('caregiver', data);
}
export async function registerDoctor(data: DoctorInput) {
  return createUser('doctor', data);
}

type UpdateProfileInput = {
  id?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  emergencyContact?: string;
  dateOfBirth?: string;
  guardianContact?: string;
  role?: RoleKey;
  roleDetails?: Record<string, any>;
};

export async function updateUserProfile(update: UpdateProfileInput) {
  if (!update.id && !update.email) throw new Error('id or email required');
  let docRef: FirebaseFirestore.DocumentReference;
  if (update.id) {
    docRef = usersCol().doc(update.id);
  } else {
    const snap = await usersCol().where('email', '==', update.email).limit(1).get();
    if (snap.empty) throw new Error('User not found');
    docRef = snap.docs[0].ref;
  }

  const patch: Record<string, any> = {};
  ['fullName', 'phone', 'address', 'profileImage', 'bio', 'location', 'emergencyContact', 'dateOfBirth', 'guardianContact'].forEach(
    (k) => {
      if ((update as any)[k] !== undefined) patch[k] = (update as any)[k];
    },
  );

  let rolePatch: Record<string, any> | null = null;
  if (update.role && update.roleDetails) {
    const snapshot = await docRef.get();
    if (!snapshot.exists) throw new Error('User not found');
    const current = snapshot.data() || {};
    const existingRole = (current as any)[update.role] || {};
    rolePatch = { ...existingRole };
    Object.entries(update.roleDetails).forEach(([key, value]) => {
      if (value === undefined) return;
      if (value === null) {
        delete rolePatch![key];
      } else {
        rolePatch![key] = value;
      }
    });
    patch[update.role] = rolePatch;
  }

  if (!Object.keys(patch).length) throw new Error('No updatable fields provided');
  patch.updatedAt = FieldValue.serverTimestamp();

  await docRef.update(patch);
  const fresh = await docRef.get();
  return { id: fresh.id, ...(fresh.data() as any) };
}
