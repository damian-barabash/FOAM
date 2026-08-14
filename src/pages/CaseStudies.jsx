import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { fetchRows } from '../lib/api.js';
import FoamArt from '../components/FoamArt.jsx';
import CaseBubble from '../components/CaseBubble.jsx';

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
        <div className="ph-mega ph-left" aria-hidden="true"><FoamArt seed={63} n={330} light shape="target" /></div>
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
            <div className="post-grid pg-2">
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
