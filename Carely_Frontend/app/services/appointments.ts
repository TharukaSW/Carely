import { apiFetch } from '../api';

export type AppointmentInput = {
  userId: string;
  doctorId: string;
  date: string; // ISO date or label
  time: string;
  location?: string | null;
}

export async function createAppointment(input: AppointmentInput) {
  return apiFetch('/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function listAppointments(userId: string) {
  return apiFetch(`/appointments?userId=${encodeURIComponent(userId)}`);
}

export async function getAppointment(id: string) {
  return apiFetch(`/appointments/${id}`);
}

export async function updateAppointmentStatus(id: string, status: string) {
  return apiFetch(`/appointments/${id}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export type AppointmentUpdate = Partial<Pick<AppointmentInput, 'date' | 'time' | 'location' | 'doctorId'>>;
export async function editAppointment(id: string, updates: AppointmentUpdate) {
  return apiFetch(`/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}
