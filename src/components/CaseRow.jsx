import React from 'react';
import Aura from './Aura.jsx';

// Case study = spokojny wiersz: zdjęcie + treść; wyniki jako liczby.
export default function CaseRow({ c, i, href, onClick, full = false }) {
  const Tag = href ? 'a' : 'div';
  return (
    <Tag className={'case-row rv rv-d' + (i % 2)} href={href} onClick={onClick}>
      <div className="case-media">{c.cover ? <img src={c.cover} alt="" loading="lazy" /> : <Aura v={i % 2 ? 'a5' : 'a1'} />}</div>
      <div className="case-body">
        <div className="post-tags">
          <span className="pill">{c.client}</span>
          {full ? (c.tags || []).slice(0, 2).map((t) => <span className="pill" key={t}>{t}</span>) : null}
        </div>
        <h3>{c.title}</h3>
        <p>{c.summary}</p>
        {full && c.body ? <p>{c.body}</p> : null}
        {Array.isArray(c.results) && c.results.length > 0 && (
          <div className="case-results">
            {c.results.slice(0, 3).map((r) => (
              <span key={r.label}><b>{r.num}</b><i>{r.label}</i></span>
            ))}
          </div>
        )}
      </div>
    </Tag>
  );
}
