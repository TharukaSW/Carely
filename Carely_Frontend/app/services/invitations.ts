import { apiFetch } from '../api';

export type CaregiverInvitationInput = {
  guardianId: string;
  caregiverId: string;
  elderId: string;
  message?: string;
  locationPreference?: string;
  createdById?: string;
};

export async function createInvitation(input: CaregiverInvitationInput) {
  return apiFetch('/invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function listInvitations(query: {
  guardianId?: string;
  caregiverId?: string;
  elderId?: string;
  status?: string;
}) {
  const qs = new URLSearchParams();
  if (query.guardianId) qs.append('guardianId', query.guardianId);
  if (query.caregiverId) qs.append('caregiverId', query.caregiverId);
  if (query.elderId) qs.append('elderId', query.elderId);
  if (query.status) qs.append('status', query.status);
  const suffix = qs.toString();
  return apiFetch(`/invitations${suffix ? `?${suffix}` : ''}`);
}

export async function respondToInvitation(id: string, status: 'pending' | 'accepted' | 'declined' | 'cancelled', options: { responderId?: string; note?: string } = {}) {
  return apiFetch(`/invitations/${id}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, ...options }),
  });
}

export async function updateInvitation(id: string, updates: { message?: string; locationPreference?: string }) {
  return apiFetch(`/invitations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteInvitation(id: string) {
  return apiFetch(`/invitations/${id}`, { method: 'DELETE' });
}
