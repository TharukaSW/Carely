// Central API utility for Carely Frontend
// Update the baseURL to your backend server address

const BASE_URL = 'http://localhost:3000/api'; // Change to your LAN IP for physical device testing

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API Error');
  return data;
}

export { BASE_URL };
