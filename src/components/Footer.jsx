import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from './wipe.js';
import { postLead } from '../lib/api.js';

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [rodo, setRodo] = useState(false);
  const [state, setState] = useState('idle'); // idle | sending | done | error

  const go = (to) => (e) => { e.preventDefault(); wipeTo(navigate, to); };

  async function subscribe(e) {
    e.preventDefault();
    if (state === 'sending' || state === 'done') return;
    setState('sending');
    try {
      await postLead({ kind: 'newsletter', email, consent_rodo: rodo, consent_marketing: true, source: 'footer' });
      setState('done');
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3200);
    }
  }

  return (
    <footer className="footer brand-field on-brand">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-news">
            <div className="eyebrow">newsletter</div>
            <h2 className="h-md">the connections.</h2>
            <p className="foot-news-p">raz na jakiś czas — krótki sygnał o mediach, kampaniach i połączeniach, które robią różnicę. bez szumu.</p>
            {state === 'done' ? (
              <div className="foot-done mono">✓ jesteś na liście. do usłyszenia.</div>
            ) : (
              <form className="foot-form" onSubmit={subscribe}>
                <div className="foot-form-row">
                  <input
                    className="field" type="email" required placeholder="twój e-mail"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    aria-label="adres e-mail"
                  />
                  <button className="btn btn-ghost-brand" disabled={state === 'sending'}>
                    {state === 'sending' ? 'chwila…' : state === 'error' ? 'spróbuj znów' : 'zapisz mnie'}
                  </button>
                </div>
                <label className="check">
                  <input type="checkbox" required checked={rodo} onChange={(e) => setRodo(e.target.checked)} />
                  <span>wyrażam zgodę na przetwarzanie moich danych w celu otrzymywania newslettera „the connections" (RODO). zgodę mogę wycofać w każdej chwili.</span>
                </label>
              </form>
            )}
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <div className="foot-col-h mono">nawigacja</div>
              <a href="/podejscie" onClick={go('/podejscie')}>podejście</a>
              <a href="/oferta" onClick={go('/oferta')}>co robimy</a>
              <a href="/raport" onClick={go('/raport')}>raport</a>
              <a href="/insighty" onClick={go('/insighty')}>insighty</a>
              <a href="/case-studies" onClick={go('/case-studies')}>case studies</a>
            </div>
            <div className="foot-col">
              <div className="foot-col-h mono">firma</div>
              <a href="/ekosystem" onClick={go('/ekosystem')}>ekosystem</a>
              <a href="/o-nas" onClick={go('/o-nas')}>o nas</a>
              <a href="/kariera" onClick={go('/kariera')}>kariera</a>
              <a href="/kontakt" onClick={go('/kontakt')}>kontakt</a>
            </div>
            <div className="foot-col">
              <div className="foot-col-h mono">kontakt</div>
              <a href="mailto:info@foam.media">info@foam.media</a>
              <a href="/kontakt" onClick={go('/kontakt')}>kontakt prasowy</a>
              <div className="foot-soc">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                    <circle cx="12" cy="12" r="4.4" />
                    <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v15.5h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1v9.4h-4V15c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.5v8.64h-4V8z" />
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <img className="foot-wordmark" src="/assets/logo.svg" alt="" aria-hidden="true" loading="lazy" />
        <div className="foot-meta mono">
          <span>foam.media</span>
          <span>© {new Date().getFullYear()} · wszystkie sygnały zliczone</span>
          <span>built on media connections</span>
        </div>
      </div>
    </footer>
  );
}
