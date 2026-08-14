import { SB_URL, SB_KEY } from './config.js';

// Lekki pageview-beacon. Admin (zalogowany kiedykolwiek) nie jest liczony.
let vid = null;
function visitorId() {
  if (vid) return vid;
  try {
    vid = localStorage.getItem('foam-vid');
    if (!vid) {
      vid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('foam-vid', vid);
    }
  } catch { vid = 'anon'; }
  return vid;
}

export function trackPageview(path) {
  try {
    if (path.startsWith('/admin')) return;
    if (localStorage.getItem('foam-admin-auth')) return; // przeglądarka admina
    const body = JSON.stringify({
      path,
      ref: document.referrer ? new URL(document.referrer).hostname : null,
      mobile: matchMedia('(max-width: 768px)').matches,
      vid: visitorId(),
    });
    fetch(`${SB_URL}/rest/v1/analytics_events`, {
      method: 'POST',
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        'content-type': 'application/json',
        Prefer: 'return=minimal',
      },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch { /* nie blokuj strony */ }
}
