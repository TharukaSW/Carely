# Carely Backend

Simple Node/Express + Firestore backend for registration endpoints.

## Setup
1. Copy `.env.example` to `.env` and fill Firebase service account values.
2. Install dependencies:
```bash
npm install
```
3. Run in dev (TSX watcher):
```bash
npm run dev
```
Backend will listen on `http://localhost:4000` (override with `PORT`).

## Endpoints
Base: `http://localhost:4000/api/register`

| Endpoint | Body fields (subset) | Description |
|----------|----------------------|-------------|
| POST /elderly | fullName,email,password,confirmPassword,dob,gender,address,phone,familyContact | Register elderly user |
| POST /family | fullName,email,password,confirmPassword,relationship,phone,elderlyId | Register family member |
| POST /caregiver | fullName,email,password,confirmPassword,address,nic,phone,image | Register caregiver |
| POST /healthcare | fullName,email,password,confirmPassword,profession,license,location,phone | Register healthcare professional |
| GET /by-email/:email | (none) | Lookup (debug) user basic info by email |

All responses: `{ id: '<firestore_doc_id>' }` on success.
Errors: `{ error: string }` or validation `{ error: 'Validation failed', issues: [...] }`.

## Firestore Data Model
Collection: `users`
Document example:
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1555123456",
  "role": "elderly",
  "passwordHash": "...",
  "createdAt": "<timestamp>",
  "elderly": {
    "dob": "1950-01-01",
    "gender": "female",
    "address": "...",
    "familyContact": "..."
  }
}
```
Role-specific object key equals role name.

## Frontend Integration Example
```ts
async function registerFamily(form) {
  const res = await fetch('http://localhost:4000/api/register/family', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed');
  return data.id;
}
```

## Notes
- Ensure emulator/device can reach `localhost` (use your PC IP: replace `localhost` with e.g. `http://192.168.x.x:4000`).
- Password reset / auth tokens not implemented—this is a minimal registration storage service.
- If data not appearing: verify `.env` exists (not only `.env.example`), check `/health` firebase status, watch server logs (should log `[register] created user`). Use `GET /api/register/by-email/<encoded email>` to confirm.
