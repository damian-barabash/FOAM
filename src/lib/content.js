// CMS: płaskie klucze data-edit na realnych stronach (wzorzec FIQ, uproszczony).
// site_content: wiersz per strona (id = pageId), kolumny published/draft (jsonb).
import { useEffect, useContext, createContext } from 'react';
import { SB_URL, SB_KEY } from './config.js';

export const CmsCtx = createContext(null); // {editing:true, content} w edytorze

const cache = new Map();

export async function fetchPublished(pageId, signal) {
  if (cache.has(pageId)) return cache.get(pageId);
  const r = await fetch(`${SB_URL}/rest/v1/site_content?id=eq.${pageId}&select=published`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    signal,
  });
  if (!r.ok) return null;
  const rows = await r.json();
  const pub = rows && rows[0] && rows[0].published;
  cache.set(pageId, pub || null);
  return pub || null;
}

// Zastosowanie treści do DOM: teksty / html / obrazy / ukrywane sekcje.
export function applyFlat(root, content, opts = {}) {
  if (!content || typeof content !== 'object') content = {};
  const ed = !!opts.editor;
  root.querySelectorAll('[data-edit]').forEach((el) => {
    const k = el.getAttribute('data-edit');
    if (k[0] === '_' || !(k in content)) return;
    const v = content[k];
    if (v == null) return;
    const t = el.getAttribute('data-edit-type');
    if (t === 'image') { if (el.tagName === 'IMG' && v) el.src = v; }
    else if (t === 'html') el.innerHTML = v;
    else el.textContent = v;
  });
  const hidden = new Set(content._hidden || []);
  root.querySelectorAll('[data-hideable]').forEach((el) => {
    const isH = hidden.has(el.getAttribute('data-hideable'));
    if (ed) { el.classList.toggle('foam-hidden', isH); el.style.display = ''; }
    else el.style.display = isH ? 'none' : '';
  });
}

// Zebranie treści z DOM (edytor).
export function collectFlat(root) {
  const o = {};
  root.querySelectorAll('[data-edit]').forEach((el) => {
    const k = el.getAttribute('data-edit');
    const t = el.getAttribute('data-edit-type');
    if (t === 'image') o[k] = el.tagName === 'IMG' ? (el.getAttribute('src') || '') : '';
    else if (t === 'html') o[k] = el.innerHTML.trim();
    else o[k] = el.textContent.trim();
  });
  const hid = [];
  root.querySelectorAll('[data-hideable]').forEach((el) => {
    if (el.classList.contains('foam-hidden')) hid.push(el.getAttribute('data-hideable'));
  });
  o._hidden = hid;
  return o;
}

// Hook stron publicznych: po montażu dociąga published i nakłada na DOM.
// W trybie edytora (CmsCtx) strona nic nie robi — edytor sam nakłada draft.
export function useCms(pageId) {
  const ctx = useContext(CmsCtx);
  useEffect(() => {
    if (ctx && ctx.editing) return;
    let alive = true;
    const ac = new AbortController();
    fetchPublished(pageId, ac.signal)
      .then((pub) => { if (alive && pub) applyFlat(document, pub); })
      .catch(() => {});
    return () => { alive = false; ac.abort(); };
  }, [pageId, ctx]);
  return ctx;
}
