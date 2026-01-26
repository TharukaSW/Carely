import { apiFetch } from '../api';

export type ProfileUpdate = {
  email: string;
  fullName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
};

export async function editUserProfile(updates: ProfileUpdate) {
  return apiFetch('/register/profile/enhanced', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteUserProfile(email: string) {
  return apiFetch('/register/profile', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}