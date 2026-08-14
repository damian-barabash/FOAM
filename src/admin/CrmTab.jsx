import React, { useEffect, useMemo, useState } from 'react';
import { sbAuth } from '../lib/supabase.js';

// CRM: leady z raportu / newslettera / kontaktu. Filtry + eksport CSV.
const KINDS = [['', 'wszystkie typy'], ['raport', 'raport'], ['newsletter', 'newsletter'], ['kontakt', 'kontakt']];
const STATUSES = ['nowy', 'w toku', 'zamknięty'];
const KIND_BADGE = { raport: '📄 raport', newsletter: '💌 newsletter', kontakt: '✉️ kontakt' };

function toCsv(rows) {
  const cols = ['created_at', 'kind', 'status', 'name', 'email', 'company', 'role', 'topic', 'message', 'consent_rodo', 'consent_marketing', 'source', 'note'];
  const head = cols.join(';');
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return /[;"\n]/.test(s) ? `"${s}"` : s;
  };
  const body = rows.map((r) => cols.map((c) => esc(c === 'created_at' ? new Date(r[c]).toLocaleString('pl-PL') : r[c])).join(';')).join('\n');
  return '﻿' + head + '\n' + body; // BOM dla Excela
}
function download(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function CrmTab() {
  const [rows, setRows] = useState(null);
  const [kind, setKind] = useState('');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sel, setSel] = useState(null);
  const [toast, setToast] = useState('');
  const say = (m) => { setToast(m); clearTimeout(say._t); say._t = setTimeout(() => setToast(''), 2400); };

  async function load() {
    const { data, error } = await sbAuth().from('leads').select('*').order('created_at', { ascending: false }).limit(3000);
    if (!error) setRows(data || []);
  }
  useEffect(() => { load(); }, []);

  const shown = useMemo(() => {
    if (!rows) return [];
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (kind && r.kind !== kind) return false;
      if (status && r.status !== status) return false;
      if (from && new Date(r.created_at) < new Date(from)) return false;
      if (to && new Date(r.created_at) > new Date(to + 'T23:59:59')) return false;
      if (ql && !`${r.email} ${r.name} ${r.company} ${r.message} ${r.topic}`.toLowerCase().includes(ql)) return false;
      return true;
    });
  }, [rows, kind, status, q, from, to]);

  async function patch(id, fields) {
    const { error } = await sbAuth().from('leads').update(fields).eq('id', id);
    if (error) { say('błąd: ' + error.message); return; }
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...fields } : r)));
    setSel((s) => (s && s.id === id ? { ...s, ...fields } : s));
  }
  async function del(id) {
    if (!confirm('Usunąć lead bezpowrotnie?')) return;
    const { error } = await sbAuth().from('leads').delete().eq('id', id);
    if (error) { say('błąd: ' + error.message); return; }
    setRows((rs) => rs.filter((r) => r.id !== id));
    setSel(null);
  }

  const counts = useMemo(() => {
    const c = { raport: 0, newsletter: 0, kontakt: 0 };
    (rows || []).forEach((r) => { c[r.kind] = (c[r.kind] || 0) + 1; });
    return c;
  }, [rows]);

  return (
    <div className="adm-crm">
      {toast ? <div className="adm-toast">{toast}</div> : null}
      <div className="adm-crm-stats">
        <div className="adm-stat"><b>{rows ? rows.length : '…'}</b><span>leadów łącznie</span></div>
        <div className="adm-stat"><b>{counts.raport}</b><span>pobrania raportu</span></div>
        <div className="adm-stat"><b>{counts.newsletter}</b><span>newsletter</span></div>
        <div className="adm-stat"><b>{counts.kontakt}</b><span>wiadomości</span></div>
      </div>

      <div className="adm-filters">
        <select className="adm-select" value={kind} onChange={(e) => setKind(e.target.value)}>
          {KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="adm-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">każdy status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="field adm-search" placeholder="szukaj: e-mail, nazwa, firma…" value={q} onChange={(e) => setQ(e.target.value)} />
        <input className="field" type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="od" />
        <input className="field" type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="do" />
        <span style={{ flex: 1 }} />
        <button className="adm-btn" onClick={() => download(`foam-leady-filtr-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(shown))}>
          ⬇ CSV (filtr: {shown.length})
        </button>
        <button className="adm-btn" onClick={() => download(`foam-leady-wszystko-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows || []))}>
          ⬇ CSV (całość)
        </button>
      </div>

      <div className="adm-crm-body">
        <div className="adm-table">
          <div className="adm-tr adm-th">
            <span>data</span><span>typ</span><span>kto</span><span>e-mail</span><span>status</span>
          </div>
          {rows === null ? <div className="mono adm-dim" style={{ padding: 14 }}>ładowanie…</div>
            : shown.length === 0 ? <div className="mono adm-dim" style={{ padding: 14 }}>brak leadów dla tych filtrów</div>
            : shown.map((r) => (
              <button key={r.id} className={'adm-tr' + (sel && sel.id === r.id ? ' on' : '')} onClick={() => setSel(r)}>
                <span className="mono">{new Date(r.created_at).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}</span>
                <span>{KIND_BADGE[r.kind] || r.kind}</span>
                <span>{r.name || '—'}{r.company ? <i className="adm-dim"> · {r.company}</i> : null}</span>
                <span className="mono">{r.email}</span>
                <span><i className={'adm-badge st-' + (r.status || 'nowy').replace(' ', '-')}>{r.status}</i></span>
              </button>
            ))}
        </div>

        {sel && (
          <div className="adm-lead">
            <div className="adm-coll-head">
              <h2>{KIND_BADGE[sel.kind]}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="adm-btn danger" onClick={() => del(sel.id)}>Usuń</button>
                <button className="adm-btn" onClick={() => setSel(null)}>Zamknij</button>
              </div>
            </div>
            <div className="adm-lead-grid">
              <div><span className="adm-dim mono">data</span>{new Date(sel.created_at).toLocaleString('pl-PL')}</div>
              <div><span className="adm-dim mono">e-mail</span><a href={`mailto:${sel.email}`}>{sel.email}</a></div>
              <div><span className="adm-dim mono">imię i nazwisko</span>{sel.name || '—'}</div>
              <div><span className="adm-dim mono">firma</span>{sel.company || '—'}</div>
              <div><span className="adm-dim mono">rola</span>{sel.role || '—'}</div>
              <div><span className="adm-dim mono">temat</span>{sel.topic || '—'}</div>
              <div><span className="adm-dim mono">źródło</span>{sel.source || '—'}</div>
              <div><span className="adm-dim mono">zgody</span>RODO: {sel.consent_rodo ? 'tak' : 'nie'} · marketing: {sel.consent_marketing ? 'tak' : 'nie'}</div>
            </div>
            {sel.message ? <div className="adm-lead-msg">{sel.message}</div> : null}
            <label className="adm-field">
              <span>Status</span>
              <select className="adm-select" value={sel.status || 'nowy'} onChange={(e) => patch(sel.id, { status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="adm-field">
              <span>Notatka</span>
              <textarea className="field" rows={3} defaultValue={sel.note || ''} onBlur={(e) => patch(sel.id, { note: e.target.value })} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
