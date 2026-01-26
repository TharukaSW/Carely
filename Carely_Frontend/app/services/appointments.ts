import { apiFetch } from '../api';

export type AppointmentInput = {
  patientId: string;
  doctorId: string;
  createdById?: string;
  createdByRole?: string;
  caregiverId?: string | null;
  guardianId?: string | null;
  date: string;
  time: string;
  location?: string | null;
  reason?: string;
  notes?: string;
};

export async function createAppointment(input: AppointmentInput) {
  return apiFetch('/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

type AppointmentQuery =
  | string
  | {
      patientId?: string;
      createdById?: string;
      guardianId?: string;
      caregiverId?: string;
      status?: string;
    };

const toQueryString = (params: Record<string, string | undefined>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

export async function listAppointments(query: AppointmentQuery) {
  if (typeof query === 'string') {
    return apiFetch(`/appointments?patientId=${encodeURIComponent(query)}`);
  }
  const qs = toQueryString({
    patientId: query.patientId,
    createdById: query.createdById,
    guardianId: query.guardianId,
    caregiverId: query.caregiverId,
    status: query.status,
  });
  return apiFetch(`/appointments${qs ? `?${qs}` : ''}`);
}

export async function listDoctorAppointments(doctorId: string, status?: string) {
  const qs = toQueryString({ doctorId, status });
  return apiFetch(`/appointments/for-doctor?${qs}`);
}

export async function getAppointment(id: string) {
  return apiFetch(`/appointments/${id}`);
}

export async function updateAppointmentStatus(
  id: string,
  status: string,
  options: { updatedById?: string; updatedByRole?: string; note?: string } = {},
) {
  return apiFetch(`/appointments/${id}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, ...options }),
  });
}

export type AppointmentUpdate = Partial<
  Pick<AppointmentInput, 'date' | 'time' | 'location' | 'doctorId' | 'caregiverId' | 'guardianId' | 'reason' | 'notes'>
>;
export async function editAppointment(id: string, updates: AppointmentUpdate) {
  return apiFetch(`/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteAppointment(id: string) {
  return apiFetch(`/appointments/${id}`, { method: 'DELETE' });
}
