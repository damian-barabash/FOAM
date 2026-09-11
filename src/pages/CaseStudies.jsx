import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { fetchRows } from '../lib/api.js';
import Obj from '../components/Obj.jsx';
import CaseRow from '../components/CaseRow.jsx';

export default function CaseStudies() {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);

  useEffect(() => {
    document.title = 'case studies — foam.media';
    fetchRows('case_studies', 'select=*&published=eq.true&order=ord.asc,created_at.desc').then(setItems);
  }, []);
  const go = (to) => (e) => { e.preventDefault(); wipeTo(navigate, to); };

  return (
    <div className="page-cases">
      <section className="page-hero brand-field on-brand">
        <div className="ph-mega ph-left" aria-hidden="true"><Obj name="target" /></div>
        <div className="wrap">
          <div className="eyebrow rv in">case studies / realizacje</div>
          <h1 className="h-xl rv in">kampanie, które wybrzmiały.</h1>
          <p className="lead rv in rv-d1">wybrane realizacje. każda zaczęła się od małych sygnałów — i każda została zmierzona rezonansem, nie zasięgiem.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {items === null ? (
            <div className="mono" style={{ color: 'var(--ink-3)' }}>ładowanie…</div>
          ) : items.length === 0 ? (
            <div className="mono" style={{ color: 'var(--ink-3)' }}>pierwsze case studies w drodze.</div>
          ) : (
            <div className="case-list">
              {items.map((c, i) => <CaseRow key={c.slug} c={c} i={i} full />)}
            </div>
          )}
        </div>
      </section>

      <section className="band brand-field on-brand">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="h-lg rv" style={{ margin: '0 auto' }}>twoja kampania może być następna.</h2>
          <div className="hero-ctas rv rv-d1" style={{ justifyContent: 'center' }}>
            <a className="btn btn-white" href="/kontakt" onClick={go('/kontakt')}>napisz do nas</a>
          </div>
        </div>
      </section>
    </div>
  );
}
