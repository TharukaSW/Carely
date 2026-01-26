import { apiFetch } from '../api';

export type MedicalRecordInput = {
  patientId: string;
  doctorId?: string;
  caregiverId?: string;
  guardianId?: string;
  appointmentId?: string;
  summary: string;
  diagnosis?: string;
  medications?: string[] | string;
  notes?: string;
  attachments?: string[];
  createdById: string;
  createdByRole?: string;
};

const toQuery = (params: Record<string, string | undefined>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

export async function createMedicalRecord(input: MedicalRecordInput) {
  return apiFetch('/medical-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function updateMedicalRecord(
  id: string,
  updates: Partial<Omit<MedicalRecordInput, 'patientId' | 'createdById'>>,
) {
  return apiFetch(`/medical-history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteMedicalRecord(id: string) {
  return apiFetch(`/medical-history/${id}`, { method: 'DELETE' });
}

export async function listMedicalRecords(query: {
  patientId?: string;
  doctorId?: string;
  caregiverId?: string;
  guardianId?: string;
  viewerId?: string;
  limit?: number;
}) {
  const qs = toQuery({
    patientId: query.patientId,
    doctorId: query.doctorId,
    caregiverId: query.caregiverId,
    guardianId: query.guardianId,
    viewerId: query.viewerId,
    limit: query.limit ? String(query.limit) : undefined,
  });
  return apiFetch(`/medical-history${qs ? `?${qs}` : ''}`);
}

export async function getMedicalRecord(id: string) {
  return apiFetch(`/medical-history/${id}`);
}
