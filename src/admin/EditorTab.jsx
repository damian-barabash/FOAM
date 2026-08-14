import React, { useEffect, useRef, useState } from 'react';
import { sbAuth } from '../lib/supabase.js';
import { CmsCtx, applyFlat, collectFlat } from '../lib/content.js';

import Home from '../pages/Home.jsx';
import Podejscie from '../pages/Podejscie.jsx';
import Oferta from '../pages/Oferta.jsx';
import Raport from '../pages/Raport.jsx';
import Ekosystem from '../pages/Ekosystem.jsx';
import ONas from '../pages/ONas.jsx';
import Kariera from '../pages/Kariera.jsx';
import Kontakt from '../pages/Kontakt.jsx';

// Wizualny edytor: renderuje realną stronę, pola data-edit → contenteditable,
// obrazy klikalne (upload do bucketu media), sekcje data-hideable z przełącznikiem.
const PAGES = [
  ['home', 'Start', Home],
  ['podejscie', 'Podejście', Podejscie],
  ['oferta', 'Oferta', Oferta],
  ['raport', 'Raport', Raport],
  ['ekosystem', 'Ekosystem', Ekosystem],
  ['o-nas', 'O nas', ONas],
  ['kariera', 'Kariera', Kariera],
  ['kontakt', 'Kontakt', Kontakt],
];

export default function EditorTab() {
  const [pageId, setPageId] = useState('home');
  const [status, setStatus] = useState('saved'); // saved | draft | dirty | saving
  const [toast, setToast] = useState('');
  const rootRef = useRef(null);
  const fileRef = useRef(null);
  const stRef = useRef({ baseline: '', loadedFrom: 'published', imgTarget: null });
  const Page = PAGES.find(([id]) => id === pageId)[2];

  const say = (msg) => { setToast(msg); clearTimeout(say._t); say._t = setTimeout(() => setToast(''), 2600); };

  function checkDirty() {
    const st = stRef.current;
    if (!rootRef.current) return;
    const now = JSON.stringify(collectFlat(rootRef.current));
    setStatus(now === st.baseline ? (st.loadedFrom === 'draft' ? 'draft' : 'saved') : 'dirty');
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const st = stRef.current;
    let alive = true;

    (async () => {
      const sb = sbAuth();
      let content = {};
      st.loadedFrom = 'published';
      try {
        const { data } = await sb.from('site_content').select('published,draft').eq('id', pageId).maybeSingle();
        if (data) {
          if (data.draft) { content = data.draft; st.loadedFrom = 'draft'; }
          else if (data.published) content = data.published;
        }
      } catch { /* pusta strona = defaulty z JSX */ }
      if (!alive) return;

      applyFlat(root, content, { editor: true });

      // pola tekstowe
      root.querySelectorAll('[data-edit]:not([data-edit-type="image"])').forEach((el) => {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
        el.addEventListener('input', checkDirty);
        if (el.tagName === 'A' || el.tagName === 'BUTTON') el.addEventListener('click', (e) => e.preventDefault());
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && el.getAttribute('data-edit-type') !== 'html') { e.preventDefault(); el.blur(); }
        });
        el.addEventListener('paste', (e) => {
          e.preventDefault();
          const t = (e.clipboardData || window.clipboardData).getData('text/plain');
          document.execCommand('insertText', false, t);
        });
      });
      // obrazy
      root.querySelectorAll('[data-edit-type="image"]').forEach((el) => {
        el.classList.add('adm-img-edit');
        el.addEventListener('click', (e) => { e.preventDefault(); st.imgTarget = el; fileRef.current.click(); });
      });
      // sekcje ukrywane
      root.querySelectorAll('[data-hideable]').forEach((el) => {
        if (el.querySelector(':scope > .adm-hide-tb')) return;
        const b = document.createElement('button');
        b.className = 'adm-hide-tb';
        b.type = 'button';
        b.textContent = el.classList.contains('foam-hidden') ? 'pokaż sekcję' : 'ukryj sekcję';
        b.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          el.classList.toggle('foam-hidden');
          b.textContent = el.classList.contains('foam-hidden') ? 'pokaż sekcję' : 'ukryj sekcję';
          checkDirty();
        });
        el.style.position = el.style.position || 'relative';
        el.appendChild(b);
      });
      // reveal: w edytorze wszystko widoczne od razu
      root.querySelectorAll('.rv').forEach((el) => el.classList.add('in'));

      st.baseline = JSON.stringify(collectFlat(root));
      setStatus(st.loadedFrom === 'draft' ? 'draft' : 'saved');
    })();

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  async function onFile(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    const st = stRef.current;
    if (!f || !st.imgTarget) return;
    const tgt = st.imgTarget; st.imgTarget = null;
    say('wgrywanie obrazu…');
    const ext = (f.name.split('.').pop() || 'png').toLowerCase();
    const key = tgt.getAttribute('data-edit') || 'img';
    const path = `cms/${key}-${Date.now()}.${ext}`;
    const sb = sbAuth();
    const up = await sb.storage.from('media').upload(path, f, { upsert: true, contentType: f.type || 'image/png' });
    if (up.error) { say('błąd wgrywania: ' + up.error.message); return; }
    tgt.src = sb.storage.from('media').getPublicUrl(path).data.publicUrl;
    checkDirty();
    say('obraz zaktualizowany ✓');
  }

  async function save(asDraft) {
    const st = stRef.current;
    setStatus('saving');
    const content = collectFlat(rootRef.current);
    const sb = sbAuth();
    const row = asDraft
      ? { id: pageId, draft: content, updated_at: new Date().toISOString() }
      : { id: pageId, published: content, draft: null, updated_at: new Date().toISOString() };
    const { error } = await sb.from('site_content').upsert(row);
    if (error) { say('błąd zapisu: ' + error.message); checkDirty(); return; }
    st.baseline = JSON.stringify(content);
    st.loadedFrom = asDraft ? 'draft' : 'published';
    setStatus(asDraft ? 'draft' : 'saved');
    say(asDraft ? 'zapisano wersję roboczą ✓' : 'opublikowano ✓');
  }

  const stText = { saved: 'Opublikowane', draft: 'Wersja robocza', dirty: 'Niezapisane zmiany', saving: 'Zapisywanie…' }[status];

  return (
    <div className="adm-editor">
      <div className="adm-ed-bar">
        <select value={pageId} onChange={(e) => setPageId(e.target.value)} className="adm-select">
          {PAGES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
        <span className={'adm-status ' + status}><i />{stText}</span>
        <span style={{ flex: 1 }} />
        <button className="adm-btn" onClick={() => save(true)}>Zapisz wersję roboczą</button>
        <button className="adm-btn primary" onClick={() => save(false)}>Opublikuj</button>
      </div>
      <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={onFile} />
      {toast ? <div className="adm-toast">{toast}</div> : null}
      <div className="adm-ed-canvas" ref={rootRef}>
        <CmsCtx.Provider value={{ editing: true }}>
          <Page key={pageId} />
        </CmsCtx.Provider>
      </div>
    </div>
  );
}
