import React, { useEffect, useState } from 'react';
import { sbAuth } from '../lib/supabase.js';
import EditorTab from './EditorTab.jsx';
import Collections from './Collections.jsx';
import CrmTab from './CrmTab.jsx';
import AnalyticsTab from './AnalyticsTab.jsx';
import '../styles/admin.css';

const TABS = [
  ['strona', 'Strona'],
  ['insighty', 'Insighty'],
  ['case', 'Case studies'],
  ['kariera', 'Kariera'],
  ['crm', 'CRM'],
  ['analityka', 'Analityka'],
];

function Login({ onOk }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr('');
    const { error } = await sbAuth().auth.signInWithPassword({ email, password: pass });
    setBusy(false);
    if (error) { setErr('nieprawidłowy login lub hasło'); return; }
    onOk();
  }

  return (
    <div className="adm-login brand-field on-brand">
      <form className="adm-login-card" onSubmit={submit}>
        <img src="/assets/logo.svg" alt="FOAM.MEDIA" style={{ width: 130, marginBottom: 8 }} />
        <div className="mono" style={{ color: 'var(--w-70)' }}>panel — logowanie</div>
        <input className="field" type="email" placeholder="e-mail" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field" type="password" placeholder="hasło" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} required />
        {err ? <div className="form-err">{err}</div> : null}
        <button className="btn btn-white" disabled={busy} style={{ justifyContent: 'center' }}>{busy ? 'chwila…' : 'zaloguj'}</button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined);
  const [tab, setTab] = useState('strona');

  useEffect(() => {
    document.title = 'panel — foam.media';
    const m = document.createElement('meta');
    m.name = 'robots'; m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    const sb = sbAuth();
    sb.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); m.remove(); };
  }, []);

  if (session === undefined) return <div className="admin-loading mono">ładowanie panelu…</div>;
  if (!session) return <Login onOk={() => {}} />;

  return (
    <div className="adm">
      <header className="adm-top">
        <img src="/assets/logo.svg" alt="" className="adm-logo" />
        <nav className="adm-tabs">
          {TABS.map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>
        <div className="adm-top-right">
          <a href="/" target="_blank" rel="noreferrer" className="mono">podgląd strony ↗</a>
          <span className="mono adm-user">{session.user.email}</span>
          <button className="adm-logout" onClick={() => sbAuth().auth.signOut()}>wyloguj</button>
        </div>
      </header>
      <main className="adm-main">
        {tab === 'strona' && <EditorTab />}
        {tab === 'insighty' && <Collections kind="insights" key="insights" />}
        {tab === 'case' && <Collections kind="case_studies" key="case_studies" />}
        {tab === 'kariera' && <Collections kind="careers" key="careers" />}
        {tab === 'crm' && <CrmTab />}
        {tab === 'analityka' && <AnalyticsTab />}
      </main>
    </div>
  );
}
