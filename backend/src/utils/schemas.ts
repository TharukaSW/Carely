import { z } from 'zod';

const baseUser = {
  fullName: z.string().min(2, 'Full name is too short'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(5, 'Phone number is too short').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
};

export const elderSchema = z.object({
  ...baseUser,
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  guardianContact: z.string().min(5).optional(),
  guardianEmail: z.string().email().optional(),
  sosNote: z.string().optional(),
  caregiverPreference: z.string().optional(),
});

export const guardianSchema = z.object({
  ...baseUser,
  relationship: z.string().optional(),
  elderEmail: z.string().email().optional(),
  elderName: z.string().optional(),
  address: z.string().optional(),
});

export const caregiverSchema = z.object({
  ...baseUser,
  address: z.string().optional(),
  nic: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  experienceYears: z.coerce.number().min(0).optional(),
  skills: z.array(z.string()).optional(),
  preferredElderGender: z.enum(['male', 'female', 'any']).optional(),
  bio: z.string().optional(),
});

export const doctorSchema = z.object({
  ...baseUser,
  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
  hospital: z.string().optional(),
  clinicAddress: z.string().optional(),
  location: z.string().optional(),
});

export type ElderInput = z.infer<typeof elderSchema>;
export type GuardianInput = z.infer<typeof guardianSchema>;
export type CaregiverInput = z.infer<typeof caregiverSchema>;
export type DoctorInput = z.infer<typeof doctorSchema>;

export const profileUpdateSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  fullName: z.string().min(2).optional(),
  phone: z.string().min(5).optional(),
  address: z.string().optional(),
  profileImage: z.string().url().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  emergencyContact: z.string().optional(),
  dateOfBirth: z.string().optional(),
  guardianContact: z.string().optional(),
  role: z.enum(['elder', 'guardian', 'caregiver', 'doctor']).optional(),
  roleDetails: z.record(z.any()).optional(),
});

export const passwordChangeSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});
