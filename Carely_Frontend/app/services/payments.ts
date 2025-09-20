import { apiFetch } from '../api';

export async function chargePayment(appointmentId: string, amount: number, currency = 'LKR') {
  return apiFetch('/payments/charge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointmentId, amount, currency, method: 'card' })
  });
}
