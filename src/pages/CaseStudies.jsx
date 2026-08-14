import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { fetchRows } from '../lib/api.js';
import FoamArt from '../components/FoamArt.jsx';

// Case = bańka. Desktop: najazd myszą przebija bańkę i odsłania kartę.
// Dotyk/tablet: bańka pęka sama, gdy wjedzie w kadr (scroll-driven, bez klikania).
function CaseBubble({ i, title, client, children }) {
  const [popped, setPopped] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!matchMedia('(hover: none)').matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (en.isIntersecting) {
          setTimeout(() => setPopped(true), 450 + (i % 2) * 300);
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [i]);

  return (
    <div
      ref={ref}
      className={'cb' + (popped ? ' cb-popped' : '')}
      onMouseEnter={() => setPopped(true)}
      onFocus={() => setPopped(true)}
      tabIndex={0}
      aria-label={`case study: ${title}`}
    >
      <div className="cb-bubble">
        <span className="pill">{client}</span>
        <div className="cb-title">{title}</div>
        <div className="mono cb-hint">najedź, żeby przebić bańkę →</div>
      </div>
      {children}
    </div>
  );
}

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
        <div className="ph-mega ph-left" aria-hidden="true"><img src="/assets/megafon.png" alt="" /></div>
        <div className="wrap">
          <div className="eyebrow rv in">case studies / realizacje</div>
          <h1 className="h-xl rv in">kampanie, które wybrzmiały.</h1>
          <p className="lead rv in rv-d1">wybrane realizacje. każda zaczyna się jak bańka — przebij ją, żeby zobaczyć, co wybrzmiało.</p>
        </div>
      </section>

      <section className="section">
        <span className="mark-word" aria-hidden="true">case</span>
        <FoamArt seed={14} n={150} shape="play" className="foam-deco fd-tr" />
        <div className="wrap">
          {items === null ? (
            <div className="mono" style={{ color: 'var(--ink-3)' }}>ładowanie…</div>
          ) : items.length === 0 ? (
            <div className="mono" style={{ color: 'var(--ink-3)' }}>pierwsze case studies w drodze.</div>
          ) : (
            <div className="post-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {items.map((c, i) => (
                <CaseBubble key={c.slug} i={i} title={c.title} client={c.client}>
                  <div className="card post-card">
                    <div className="post-cover">{c.cover ? <img src={c.cover} alt="" loading="lazy" /> : null}</div>
                    <div className="post-body">
                      <div className="post-tags">
                        <span className="pill">{c.client}</span>
                        {(c.tags || []).slice(0, 2).map((t) => <span className="pill" key={t}>{t}</span>)}
                      </div>
                      <h3>{c.title}</h3>
                      <p>{c.summary}</p>
                      {c.body ? <p style={{ color: 'var(--ink-2)' }}>{c.body}</p> : null}
                      {Array.isArray(c.results) && c.results.length > 0 && (
                        <div className="case-results">
                          {c.results.slice(0, 3).map((r) => (
                            <span key={r.label}><b>{r.num}</b><i>{r.label}</i></span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CaseBubble>
              ))}
            </div>
          )}
          <div className="band" style={{ textAlign: 'center', paddingBottom: 0 }}>
            <a className="btn btn-solid rv" href="/kontakt" onClick={go('/kontakt')}>twoja kampania może być następna</a>
          </div>
        </div>
      </section>
    </div>
  );
}
