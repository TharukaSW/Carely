import { z } from 'zod';

const baseUser = {
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5).optional(),
  password: z.string().min(6),
};

export const elderlySchema = z.object({
  ...baseUser,
  dob: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  familyContact: z.string().optional(),
  confirmPassword: z.string().min(6),
});

export const familySchema = z.object({
  ...baseUser,
  relationship: z.string().optional(),
  elderlyId: z.string().optional(),
  confirmPassword: z.string().min(6),
});

export const caregiverSchema = z.object({
  ...baseUser,
  address: z.string().optional(),
  nic: z.string().optional(),
  image: z.string().optional(),
  confirmPassword: z.string().min(6),
});

export const healthcareSchema = z.object({
  ...baseUser,
  profession: z.string().optional(),
  license: z.string().optional(),
  location: z.string().optional(),
  confirmPassword: z.string().min(6),
});

export type ElderlyInput = z.infer<typeof elderlySchema>;
export type FamilyInput = z.infer<typeof familySchema>;
export type CaregiverInput = z.infer<typeof caregiverSchema>;
export type HealthcareInput = z.infer<typeof healthcareSchema>;

export const profileUpdateSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  fullName: z.string().min(2).optional(),
  phone: z.string().min(5).optional(),
  address: z.string().optional(),
  profileImage: z.string().url().optional(),
});

export const passwordChangeSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});
