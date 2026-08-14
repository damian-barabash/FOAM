import React, { useEffect, useState } from 'react';
import { useCms } from '../lib/content.js';
import { fetchRows } from '../lib/api.js';

export default function Kariera() {
  const ctx = useCms('kariera');
  const editing = ctx && ctx.editing;
  const [jobs, setJobs] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (editing) return;
    document.title = 'kariera — foam.media';
    fetchRows('careers', 'select=*&active=eq.true&order=ord.asc,created_at.desc').then(setJobs);
  }, [editing]);

  return (
    <div className="page-kariera">
      <section className="page-hero brand-field on-brand">
        <div className="wrap">
          <div className="eyebrow rv in" data-edit="kar_hero_eyebrow">kariera</div>
          <h1 className="h-xl rv in" data-edit="kar_hero_h">dodaj swoją bańkę.</h1>
          <p className="lead rv in rv-d1" data-edit="kar_hero_p">szukamy ludzi, którzy czują feed, liczby albo relacje — najlepiej dwa z trzech. reszty nauczymy się od siebie nawzajem.</p>
        </div>
      </section>

      <section className="section">
        <span className="mark-word" aria-hidden="true">kariera</span>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow rv" data-edit="kar_list_eyebrow">otwarte role</div>
              <h2 className="h-lg rv" data-edit="kar_list_h">kogo teraz słuchamy.</h2>
            </div>
          </div>
          {editing ? (
            <div className="mono" style={{ color: 'var(--ink-3)' }}>[ogłoszenia zarządzane w zakładce „Kariera" panelu]</div>
          ) : jobs === null ? (
            <div className="mono" style={{ color: 'var(--ink-3)' }}>ładowanie…</div>
          ) : jobs.length === 0 ? (
            <div className="mono" style={{ color: 'var(--ink-3)' }}>w tej chwili brak otwartych rekrutacji — ale dobre CV czytamy zawsze: kariera@foam.media</div>
          ) : (
            <div className="jobs-list">
              {jobs.map((j, i) => (
                <div key={j.id}>
                  <div
                    className={'card job-row rv rv-d' + (i % 3)}
                    role="button" tabIndex={0}
                    onClick={() => setOpen(open === j.id ? null : j.id)}
                    onKeyDown={(e) => e.key === 'Enter' && setOpen(open === j.id ? null : j.id)}
                    aria-expanded={open === j.id}
                  >
                    <h3>{j.title}</h3>
                    <span className="pill">{j.dept}</span>
                    <span className="pill">{j.location}</span>
                    <span className="pill">{j.type}</span>
                  </div>
                  {open === j.id && (
                    <div className="card" style={{ padding: '22px 26px', marginTop: -6, borderTop: 0, borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
                      <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--ink-2)', fontSize: 14.5 }}>{j.body}</p>
                      <a className="btn btn-solid" style={{ marginTop: 16 }} href={`mailto:kariera@foam.media?subject=${encodeURIComponent(j.title)}`}>aplikuj — kariera@foam.media</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section-tint" data-hideable="kar:benefity">
        <div className="wrap grid2" style={{ alignItems: 'stretch' }}>
          <div className="photo rv">
            <img src="/assets/photos/life-1.webp" alt="zespół foam przy pracy" loading="lazy" data-edit="kar_ben_img" data-edit-type="image" style={{ height: '100%' }} />
          </div>
          <div>
            <div className="eyebrow rv" data-edit="kar_ben_eyebrow">jak się u nas pracuje</div>
            <h2 className="h-lg rv" data-edit="kar_ben_h">lekko, ale na serio.</h2>
            <div className="grid3" style={{ gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 34 }}>
              {[
                ['hybrydowo', 'warszawa + zdalnie. liczy się rezonans, nie obecność.'],
                ['budżet na eksperymenty', 'w każdym planie mediowym jest linia „przetestujmy coś dziwnego".'],
                ['sprzęt i opieka', 'macbook, prywatna opieka medyczna, multisport.'],
                ['realny wpływ', 'mały zespół — twoje sygnały słychać od pierwszego tygodnia.'],
              ].map(([h, p], i) => (
                <div className={'card num-card rv rv-d' + (i % 2)} key={h} style={{ padding: '24px 24px 26px' }}>
                  <h3 data-edit={`kar_ben${i + 1}_h`} style={{ fontSize: 17, marginBottom: 6 }}>{h}</h3>
                  <p data-edit={`kar_ben${i + 1}_p`} style={{ fontSize: 13.5 }}>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="band brand-field on-brand" data-hideable="kar:spont">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="h-lg rv" style={{ margin: '0 auto' }} data-edit="kar_cta_h">nie ma roli dla ciebie?</h2>
          <p className="lead rv rv-d1" style={{ margin: '16px auto 0' }} data-edit="kar_cta_p">napisz i tak. najlepsze osoby w zespole przyszły „z niczego" — po prostu miały sygnał.</p>
          <div className="hero-ctas rv rv-d2" style={{ justifyContent: 'center' }}>
            <a className="btn btn-ghost-brand" href="mailto:kariera@foam.media" data-edit="kar_cta_b">kariera@foam.media</a>
          </div>
        </div>
      </section>
    </div>
  );
}
