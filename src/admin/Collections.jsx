import React, { useEffect, useRef, useState } from 'react';
import { sbAuth } from '../lib/supabase.js';

// Generyczny CRUD kolekcji: Insighty / Case studies / Kariera.
const CONFIGS = {
  insights: {
    title: 'Insighty',
    order: { col: 'created_at', asc: false },
    empty: { slug: '', title: '', excerpt: '', body: '', category: '', tags: [], author: '', cover: '', published: false },
    fields: [
      ['title', 'Tytuł', 'text'],
      ['slug', 'Slug (URL)', 'slug'],
      ['category', 'Kategoria', 'text'],
      ['author', 'Autor', 'text'],
      ['tags', 'Tagi (po przecinku)', 'tags'],
      ['cover', 'Okładka', 'image'],
      ['excerpt', 'Zajawka', 'textarea'],
      ['body', 'Treść (HTML lub tekst)', 'body'],
      ['published', 'Opublikowany', 'check'],
    ],
    listRow: (r) => [r.title, r.category || '—', r.published ? '● publiczny' : '○ szkic'],
  },
  case_studies: {
    title: 'Case studies',
    order: { col: 'ord', asc: true },
    empty: { slug: '', title: '', client: '', summary: '', body: '', cover: '', tags: [], results: [], published: false, ord: 0 },
    fields: [
      ['title', 'Tytuł', 'text'],
      ['slug', 'Slug', 'slug'],
      ['client', 'Klient', 'text'],
      ['tags', 'Tagi (po przecinku)', 'tags'],
      ['cover', 'Okładka', 'image'],
      ['summary', 'Podsumowanie', 'textarea'],
      ['body', 'Opis', 'textarea'],
      ['results', 'Wyniki (liczba | etykieta, linia = wynik)', 'results'],
      ['ord', 'Kolejność', 'number'],
      ['published', 'Opublikowany', 'check'],
    ],
    listRow: (r) => [r.title, r.client || '—', r.published ? '● publiczny' : '○ szkic'],
  },
  careers: {
    title: 'Kariera — ogłoszenia',
    order: { col: 'ord', asc: true },
    empty: { title: '', dept: '', location: 'Warszawa / hybrydowo', type: 'pełny etat', body: '', active: true, ord: 0 },
    fields: [
      ['title', 'Stanowisko', 'text'],
      ['dept', 'Dział', 'text'],
      ['location', 'Lokalizacja', 'text'],
      ['type', 'Rodzaj (etat/b2b…)', 'text'],
      ['body', 'Opis ogłoszenia', 'body'],
      ['ord', 'Kolejność', 'number'],
      ['active', 'Aktywne', 'check'],
    ],
    listRow: (r) => [r.title, r.dept || '—', r.active ? '● aktywne' : '○ ukryte'],
  },
};

const slugify = (s) => s.toLowerCase()
  .replace(/[ąàá]/g, 'a').replace(/[ćč]/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l')
  .replace(/[ńñ]/g, 'n').replace(/[óò]/g, 'o').replace(/ś/g, 's').replace(/[żź]/g, 'z')
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function Collections({ kind }) {
  const cfg = CONFIGS[kind];
  const [rows, setRows] = useState(null);
  const [sel, setSel] = useState(null); // edytowany rekord (kopia)
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const fileRef = useRef(null);
  const say = (m) => { setToast(m); clearTimeout(say._t); say._t = setTimeout(() => setToast(''), 2600); };

  async function load() {
    const { data, error } = await sbAuth().from(kind).select('*')
      .order(cfg.order.col, { ascending: cfg.order.asc });
    if (!error) setRows(data || []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [kind]);

  const set = (k) => (e) => {
    const v = e && e.target
      ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value)
      : e;
    setSel((s) => ({ ...s, [k]: v }));
  };

  async function uploadCover(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    say('wgrywanie…');
    const ext = (f.name.split('.').pop() || 'png').toLowerCase();
    const path = `${kind}/${Date.now()}.${ext}`;
    const sb = sbAuth();
    const up = await sb.storage.from('media').upload(path, f, { upsert: true, contentType: f.type });
    if (up.error) { say('błąd: ' + up.error.message); return; }
    set('cover')(sb.storage.from('media').getPublicUrl(path).data.publicUrl);
    say('okładka wgrana ✓');
  }

  async function save() {
    if (busy) return;
    setBusy(true);
    const row = { ...sel };
    if ('slug' in row && !row.slug && row.title) row.slug = slugify(row.title);
    if ('body' in row && kind === 'insights' && row.body && !/<[a-z]/i.test(row.body)) {
      // czysty tekst → akapity
      row.body = row.body.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    }
    if ('ord' in row) row.ord = parseInt(row.ord, 10) || 0;
    const { error } = await sbAuth().from(kind).upsert(row);
    setBusy(false);
    if (error) { say('błąd zapisu: ' + error.message); return; }
    say('zapisano ✓');
    setSel(null);
    load();
  }

  async function del(id) {
    if (!confirm('Usunąć bezpowrotnie?')) return;
    const { error } = await sbAuth().from(kind).delete().eq('id', id);
    if (error) { say('błąd: ' + error.message); return; }
    setSel(null);
    load();
  }

  const resultsText = (arr) => (arr || []).map((r) => `${r.num} | ${r.label}`).join('\n');
  const parseResults = (t) => t.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [num, ...rest] = l.split('|');
    return { num: (num || '').trim(), label: rest.join('|').trim() };
  });

  return (
    <div className="adm-coll">
      {toast ? <div className="adm-toast">{toast}</div> : null}
      <div className="adm-coll-list">
        <div className="adm-coll-head">
          <h2>{cfg.title}</h2>
          <button className="adm-btn primary" onClick={() => setSel({ ...cfg.empty })}>+ Dodaj</button>
        </div>
        {rows === null ? <div className="mono">ładowanie…</div> : rows.length === 0 ? (
          <div className="mono adm-dim">pusto — dodaj pierwszy wpis</div>
        ) : rows.map((r) => (
          <button key={r.id} className={'adm-row' + (sel && sel.id === r.id ? ' on' : '')} onClick={() => setSel({ ...r })}>
            {cfg.listRow(r).map((c, i) => <span key={i} className={i ? 'adm-dim' : ''}>{c}</span>)}
          </button>
        ))}
      </div>

      {sel && (
        <div className="adm-coll-form">
          <div className="adm-coll-head">
            <h2>{sel.id ? 'Edycja' : 'Nowy wpis'}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {sel.id ? <button className="adm-btn danger" onClick={() => del(sel.id)}>Usuń</button> : null}
              <button className="adm-btn" onClick={() => setSel(null)}>Anuluj</button>
              <button className="adm-btn primary" disabled={busy} onClick={save}>{busy ? '…' : 'Zapisz'}</button>
            </div>
          </div>
          {cfg.fields.map(([k, label, type]) => (
            <label key={k} className="adm-field">
              <span>{label}</span>
              {type === 'text' || type === 'slug' ? (
                <input className="field" value={sel[k] || ''} onChange={set(k)}
                  placeholder={type === 'slug' ? 'zostaw puste = z tytułu' : ''} />
              ) : type === 'number' ? (
                <input className="field" type="number" value={sel[k] ?? 0} onChange={set(k)} />
              ) : type === 'textarea' ? (
                <textarea className="field" rows={3} value={sel[k] || ''} onChange={set(k)} />
              ) : type === 'body' ? (
                <textarea className="field" rows={12} value={sel[k] || ''} onChange={set(k)} />
              ) : type === 'check' ? (
                <span className="adm-checkline"><input type="checkbox" checked={!!sel[k]} onChange={set(k)} /> tak</span>
              ) : type === 'tags' ? (
                <input className="field" value={(sel[k] || []).join(', ')}
                  onChange={(e) => set(k)(e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} />
              ) : type === 'results' ? (
                <textarea className="field" rows={3} value={resultsText(sel[k])}
                  onChange={(e) => set(k)(parseResults(e.target.value))}
                  placeholder={'+38% | wzrost rozpoznawalności\n4,2 mln | zasięg'} />
              ) : type === 'image' ? (
                <span className="adm-cover">
                  {sel[k] ? <img src={sel[k]} alt="" /> : <span className="adm-dim mono">brak okładki</span>}
                  <span style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="adm-btn" onClick={() => fileRef.current.click()}>Wgraj</button>
                    {sel[k] ? <button type="button" className="adm-btn" onClick={() => set(k)('')}>Usuń</button> : null}
                  </span>
                </span>
              ) : null}
            </label>
          ))}
          <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={uploadCover} />
        </div>
      )}
    </div>
  );
}
