import { createClient } from '@supabase/supabase-js';
import { SB_URL, SB_KEY } from './config.js';

let auth = null;

// Klient panelu admina — trwała sesja (Supabase Auth).
export function sbAuth() {
  if (!auth) {
    auth = createClient(SB_URL, SB_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'foam-admin-auth' },
    });
  }
  return auth;
}
