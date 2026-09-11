import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { fetchRows } from '../lib/api.js';
import Obj from '../components/Obj.jsx';

export default function InsightPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(undefined); // undefined = ładowanie, null = brak

  useEffect(() => {
    fetchRows('insights', `select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`)
      .then((rows) => {
        const p = rows[0] || null;
        setPost(p);
        if (p) document.title = `${p.title} — foam.media`;
      });
  }, [slug]);

  const go = (to) => (e) => { e.preventDefault(); wipeTo(navigate, to); };

  if (post === undefined) return <div className="page-hero brand-field" style={{ minHeight: '60vh' }} />;
  if (post === null) {
    return (
      <section className="nf brand-field on-brand">
        <h1>404</h1>
        <p>tego sygnału nie ma — może już wybrzmiał.</p>
        <a className="btn btn-ghost-brand" href="/insighty" onClick={go('/insighty')}>wróć do insightów</a>
      </section>
    );
  }

  return (
    <div className="page-insight-post">
      <section className="page-hero brand-field on-brand">
        <div className="ph-mega ph-right" aria-hidden="true"><Obj name="speech" /></div>
        <div className="wrap article-head">
          <div className="eyebrow rv in">{post.category || 'insight'}</div>
          <h1 className="h-lg rv in">{post.title}</h1>
          <div className="mono rv in rv-d1" style={{ color: 'var(--w-70)', marginTop: 18, display: 'flex', gap: 18 }}>
            <span>{post.author || 'foam.media'}</span>
            <span>{new Date(post.created_at).toLocaleDateString('pl-PL')}</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap article">
          {post.cover ? (
            <div className="post-cover card rv in" style={{ marginBottom: 34, borderRadius: 'var(--r-lg)' }}>
              <img src={post.cover} alt="" />
            </div>
          ) : null}
          <div className="article-body rv in rv-d1" dangerouslySetInnerHTML={{ __html: post.body || '' }} />
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="post-tags" style={{ marginTop: 30 }}>
              {post.tags.map((t) => <span className="pill" key={t}>#{t}</span>)}
            </div>
          )}
          <div style={{ marginTop: 44 }}>
            <a className="btn btn-ghost" href="/insighty" onClick={go('/insighty')}>← wszystkie insighty</a>
          </div>
        </div>
      </section>
    </div>
  );
}
