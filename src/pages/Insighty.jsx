import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { fetchRows } from '../lib/api.js';

export default function Insighty() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [cat, setCat] = useState('wszystkie');

  useEffect(() => {
    document.title = 'insighty — foam.media';
    fetchRows('insights', 'select=slug,title,excerpt,cover,category,author,created_at&published=eq.true&order=created_at.desc').then(setPosts);
  }, []);

  const cats = useMemo(() => {
    const s = new Set((posts || []).map((p) => p.category).filter(Boolean));
    return ['wszystkie', ...s];
  }, [posts]);
  const shown = (posts || []).filter((p) => cat === 'wszystkie' || p.category === cat);
  const go = (to) => (e) => { e.preventDefault(); wipeTo(navigate, to); };

  return (
    <div className="page-insighty">
      <section className="page-hero brand-field on-brand">
        <div className="wrap">
          <div className="eyebrow rv in">insighty / punkty widzenia</div>
          <h1 className="h-xl rv in">sygnały, które łowimy.</h1>
          <p className="lead rv in rv-d1">obserwacje o mediach, uwadze i kulturze feedu — pisane przez ludzi, którzy planują kampanie, nie tylko o nich czytają.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {cats.length > 1 && (
            <div className="post-tags rv in" style={{ marginBottom: 30 }}>
              {cats.map((c) => (
                <button
                  key={c}
                  className="pill"
                  onClick={() => setCat(c)}
                  style={c === cat ? { background: 'var(--foam-600)', color: '#fff', borderColor: 'var(--foam-600)' } : {}}
                  aria-pressed={c === cat}
                >{c}</button>
              ))}
            </div>
          )}
          {posts === null ? (
            <div className="mono" style={{ color: 'var(--ink-3)' }}>ładowanie…</div>
          ) : shown.length === 0 ? (
            <div className="mono" style={{ color: 'var(--ink-3)' }}>pierwsze insighty już się piszą — wróć niedługo.</div>
          ) : (
            <div className="post-grid">
              {shown.map((p, i) => (
                <a key={p.slug} className={'card post-card rv rv-d' + (i % 3)} href={`/insighty/${p.slug}`} onClick={go(`/insighty/${p.slug}`)}>
                  <div className="post-cover">{p.cover ? <img src={p.cover} alt="" loading="lazy" /> : null}</div>
                  <div className="post-body">
                    {p.category ? <div className="post-tags"><span className="pill">{p.category}</span></div> : null}
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <div className="post-meta mono">
                      <span>{p.author || 'foam.media'}</span>
                      <span>{new Date(p.created_at).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
