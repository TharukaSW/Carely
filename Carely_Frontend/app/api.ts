// Central API utility for Carely Frontend
// Update the baseURL to your backend server address

const BASE_URL = 'http://localhost:4000/api'; // If using a device replace localhost with your machine LAN IP

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  console.log('API Request:', { url, options });
  const res = await fetch(url, options);
  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    // Non-JSON response
    data = { error: 'Invalid JSON response' };
  }
  console.log('API Response:', { status: res.status, data });
  if (!res.ok) throw new Error(data?.error || `API Error: ${res.status}`);
  return data;
}

export { BASE_URL };
