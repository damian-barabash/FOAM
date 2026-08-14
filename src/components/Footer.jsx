import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from './wipe.js';
import { postLead } from '../lib/api.js';
import FoamArt from './FoamArt.jsx';

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
      <FoamArt seed={20} n={150} light className="foam-deco fd-tr" />
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
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">tt</a>
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
