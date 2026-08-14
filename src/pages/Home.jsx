import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { useCms } from '../lib/content.js';
import { fetchRows } from '../lib/api.js';
import FoamArt from '../components/FoamArt.jsx';
import CaseBubble from '../components/CaseBubble.jsx';

export default function Home() {
  const navigate = useNavigate();
  const ctx = useCms('home');
  const editing = ctx && ctx.editing;
  const [posts, setPosts] = useState([]);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    if (editing) return;
    document.title = 'foam.media — siła przekazu to suma małych sygnałów';
    fetchRows('insights', 'select=slug,title,excerpt,cover,category&published=eq.true&order=created_at.desc&limit=3').then(setPosts);
    fetchRows('case_studies', 'select=slug,title,client,summary,cover,results&published=eq.true&order=ord.asc&limit=2').then(setCases);
  }, [editing]);

  const go = (to) => (e) => { e.preventDefault(); if (!editing) wipeTo(navigate, to); };

  return (
    <div className="page-home">
      {/* ===== hero ===== */}
      <section className="hero brand-field on-brand">
        <div className="wrap hero-in">
          <div className="hero-copy">
            <div className="eyebrow rv in" data-edit="home_hero_eyebrow">dom mediowy · warszawa</div>
            <h1 className="h-xl rv in" data-edit="home_hero_h">siła przekazu to suma małych sygnałów.</h1>
            <p className="lead hero-sub rv in rv-d1" data-edit="home_hero_p">łączymy je w całość, by nowoczesne kampanie mogły wybrzmiewać. media, kreacja i dane — w jednym instrumencie.</p>
            <div className="hero-ctas rv in rv-d2">
              <a className="btn btn-white" href="/raport" onClick={go('/raport')} data-edit="home_hero_cta1">pobierz raport</a>
              <a className="btn btn-ghost-brand" href="/kontakt" onClick={go('/kontakt')} data-edit="home_hero_cta2">napisz do nas</a>
            </div>
          </div>
          <div className="hero-mega rv in rv-d2">
            <img src="/assets/megafon.png" alt="megafon zbudowany z piany — sygnały, które składają się w przekaz" fetchpriority="high" data-edit="home_hero_img" data-edit-type="image" />
          </div>
        </div>
        <div className="hero-meta mono">
          <span data-edit="home_hero_meta1">foam.media</span>
          <span data-edit="home_hero_meta2">built on media connections</span>
        </div>
      </section>

      {/* ===== filary ===== */}
      <section className="section" data-hideable="home:filary">
        <span className="mark-word" aria-hidden="true">piana</span>
        <span className="side-label" aria-hidden="true">built on media connections</span>
        <FoamArt seed={5} n={150} shape="bolt" className="foam-deco fd-tr" />
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow rv" data-edit="home_fil_eyebrow">01 — na czym stoimy</div>
              <h2 className="h-lg rv" data-edit="home_fil_h">cztery filary. jedna piana.</h2>
            </div>
            <p className="lead rv rv-d1" data-edit="home_fil_p">pojedyncza bańka jest ulotna. miliony baniek to materiał, z którego budujemy megafon.</p>
          </div>
          <div className="mosaic m-4">
            {[
              ['połączenia', 'znamy ludzi, redakcje i platformy. przekaz płynie tam, gdzie ma płynąć — bo wiemy, kogo połączyć.', 1],
              ['lekkość', 'komunikacja, która nie ciąży. wchodzimy w kulturę feedu naturalnie, bez podnoszenia głosu.', 2],
              ['precyzja', 'każdy sygnał ma adres. dane mówią nam gdzie, kreacja — jak. nic nie leci w próżnię.', 3],
              ['impakt', 'suma sygnałów musi wybrzmieć. rozliczamy się z rezonansu, nie z hałasu.', 4],
            ].map(([h, p], i) => (
              <div className={'mo-card rv rv-d' + (i % 4) + (i === 1 ? ' mo-brand' : '')} key={h}>
                <span className="mo-num" data-edit={`home_fil${i + 1}_n`}>{'0' + (i + 1)}</span>
                {i === 1 ? <FoamArt seed={41} n={110} light className="mo-foam" /> : null}
                <h3 data-edit={`home_fil${i + 1}_h`}>{h}</h3>
                <p data-edit={`home_fil${i + 1}_p`}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== co robimy — zapowiedź ===== */}
      <section className="section section-tint" data-hideable="home:uslugi">
        <span className="mark-word mark-left mark-bottom" aria-hidden="true">sygnały</span>
        <FoamArt seed={6} n={150} shape="play" className="foam-deco fd-br" />
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow rv" data-edit="home_usl_eyebrow">02 — co robimy</div>
              <h2 className="h-lg rv" data-edit="home_usl_h">od pierwszego sygnału po pełny rezonans.</h2>
            </div>
            <a className="btn btn-ghost rv" href="/oferta" onClick={go('/oferta')} data-edit="home_usl_cta">zobacz pełną ofertę</a>
          </div>
          <div className="mosaic m-3">
            {[
              ['media & połączenia', 'planowanie i zakup mediów zbudowane na relacjach: digital, social, influencerzy, PR i formaty, których nie ma w cennikach.'],
              ['kampanie social-first', 'koncepty, które rodzą się w feedzie: kreacja, produkcja i dystrybucja pod TikTok, Reels, YouTube i newslettery.'],
              ['dane & rezonans', 'pomiar sygnałów w czasie rzeczywistym: brand lift, attention, sentyment. wiemy, co wybrzmiało — i dlaczego.'],
            ].map(([h, p], i) => (
              <div className={'mo-card rv rv-d' + i + (i === 0 ? ' mo-brand' : '')} key={h}>
                <span className="mo-num" data-edit={`home_usl${i + 1}_n`}>{'0' + (i + 1)}</span>
                {i === 0 ? <FoamArt seed={42} n={110} light className="mo-foam" /> : null}
                <h3 data-edit={`home_usl${i + 1}_h`}>{h}</h3>
                <p data-edit={`home_usl${i + 1}_p`}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== zdjęcia vibe ===== */}
      <section className="section" style={{ paddingTop: 0 }} data-hideable="home:zdjecia">
        <div className="wrap photo-strip">
          <div className="photo rv"><img src="/assets/photos/life-9.webp" alt="sygnały na żywo — koncert" loading="lazy" data-edit="home_ph1" data-edit-type="image" /></div>
          <div className="photo rv rv-d1"><img src="/assets/photos/life-8.webp" alt="publiczność festiwalu" loading="lazy" data-edit="home_ph2" data-edit-type="image" /></div>
          <div className="photo rv rv-d2"><img src="/assets/photos/life-10.webp" alt="tłum, który rezonuje" loading="lazy" data-edit="home_ph3" data-edit-type="image" /></div>
        </div>
      </section>

      {/* ===== raport band ===== */}
      <section className="band brand-field on-brand" data-hideable="home:raport">
        <span className="mark-word" aria-hidden="true">raport</span>
        <div className="wrap grid2">
          <div>
            <div className="eyebrow rv" data-edit="home_rap_eyebrow">raport 2026</div>
            <h2 className="h-lg rv" data-edit="home_rap_h">suma małych sygnałów. raport o tym, jak wybrzmiewają marki.</h2>
            <p className="lead rv rv-d1" data-edit="home_rap_p">dane z polskiego rynku mediów, 6 wniosków i rekomendacje na najbliższe 12 miesięcy. za darmo, za e-mail.</p>
            <div className="hero-ctas rv rv-d2">
              <a className="btn btn-white" href="/raport" onClick={go('/raport')} data-edit="home_rap_cta">pobierz raport</a>
            </div>
          </div>
          <FoamArt seed={12} n={300} light shape="bars" className="rv rv-d1" />
        </div>
      </section>

      {/* ===== insighty ===== */}
      {!editing && posts.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow rv">03 — insighty</div>
                <h2 className="h-lg rv">punkty widzenia.</h2>
              </div>
              <a className="btn btn-ghost rv" href="/insighty" onClick={go('/insighty')}>wszystkie insighty</a>
            </div>
            <div className="post-grid">
              {posts.map((p, i) => (
                <a key={p.slug} className={'card post-card rv rv-d' + i} href={`/insighty/${p.slug}`} onClick={go(`/insighty/${p.slug}`)}>
                  <div className="post-cover">{p.cover ? <img src={p.cover} alt="" loading="lazy" /> : null}</div>
                  <div className="post-body">
                    {p.category ? <div className="post-tags"><span className="pill">{p.category}</span></div> : null}
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== case studies ===== */}
      {!editing && cases.length > 0 && (
        <section className="section section-tint">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow rv">04 — realizacje</div>
                <h2 className="h-lg rv">kampanie, które wybrzmiały.</h2>
              </div>
              <a className="btn btn-ghost rv" href="/case-studies" onClick={go('/case-studies')}>wszystkie case studies</a>
            </div>
            <div className="post-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {cases.map((c, i) => (
                <CaseBubble key={c.slug} i={i} title={c.title} client={c.client}>
                <a className={'card post-card'} href="/case-studies" onClick={go('/case-studies')}>
                  <div className="post-cover">{c.cover ? <img src={c.cover} alt="" loading="lazy" /> : null}</div>
                  <div className="post-body">
                    <div className="post-tags"><span className="pill">{c.client}</span></div>
                    <h3>{c.title}</h3>
                    <p>{c.summary}</p>
                    {Array.isArray(c.results) && c.results.length > 0 && (
                      <div className="case-results">
                        {c.results.slice(0, 3).map((r) => (
                          <span key={r.label}><b>{r.num}</b><i>{r.label}</i></span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
                </CaseBubble>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== manifest quote ===== */}
      <section className="band brand-field on-brand" data-hideable="home:manifest">
        <span className="mark-word" aria-hidden="true">megafon</span>
        <FoamArt seed={7} n={150} light shape="mega" className="foam-deco fd-bl" />
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="h-lg rv" style={{ margin: '0 auto' }} data-edit="home_mq_h">łączymy sygnały w całość.</h2>
          <p className="lead rv rv-d1" style={{ margin: '20px auto 0' }} data-edit="home_mq_p">poznaj nasz sposób myślenia o mediach — manifest FOAM.</p>
          <div className="hero-ctas rv rv-d2" style={{ justifyContent: 'center' }}>
            <a className="btn btn-ghost-brand" href="/podejscie" onClick={go('/podejscie')} data-edit="home_mq_cta">przeczytaj manifest</a>
          </div>
        </div>
      </section>
    </div>
  );
}
