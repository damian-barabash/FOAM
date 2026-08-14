import { SB_URL, SB_KEY } from './config.js';

// Publiczne formularze → edge `lead` (insert do CRM + maile Resend).
export async function postLead(payload) {
  const r = await fetch(`${SB_URL}/functions/v1/lead`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', apikey: SB_KEY },
    body: JSON.stringify(payload),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.error) throw new Error(d.error || 'network');
  return d;
}

// Publiczny odczyt kolekcji (REST, anon).
export async function fetchRows(table, query) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  });
  if (!r.ok) return [];
  return r.json();
}
