import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { useCms } from '../lib/content.js';
import { fetchRows } from '../lib/api.js';
import FoamArt from '../components/FoamArt.jsx';
import CaseRow from '../components/CaseRow.jsx';
import { Tile } from '../components/Aura.jsx';

const FILARY = [
  ['połączenia', 'znamy ludzi, redakcje i platformy. przekaz płynie tam, gdzie ma płynąć — bo wiemy, kogo połączyć.'],
  ['lekkość', 'komunikacja, która nie ciąży. wchodzimy w kulturę feedu naturalnie, bez podnoszenia głosu.'],
  ['precyzja', 'każdy sygnał ma adres. dane mówią nam gdzie, kreacja — jak. nic nie leci w próżnię.'],
  ['impakt', 'suma sygnałów musi wybrzmieć. rozliczamy się z rezonansu, nie z hałasu.'],
];

export default function Home() {
  const navigate = useNavigate();
  const ctx = useCms('home');
  const editing = ctx && ctx.editing;
  const [cases, setCases] = useState([]);

  useEffect(() => {
    if (editing) return;
    document.title = 'foam.media — siła przekazu to suma małych sygnałów';
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
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow rv" data-edit="home_fil_eyebrow">na czym stoimy</div>
            <h2 className="h-lg rv" data-edit="home_fil_h">cztery filary. jedna piana.</h2>
            <p className="lead rv rv-d1" data-edit="home_fil_p">pojedyncza bańka jest ulotna. miliony baniek to materiał, z którego budujemy megafon.</p>
          </div>
          <div className="tiles t-4">
            {FILARY.map(([h, p], i) => (
              <Tile key={h} i={i} idx={'0' + (i + 1)} title={h} text={p} k={`home_fil${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== zdjęcia ===== */}
      <section className="section" style={{ paddingTop: 0 }} data-hideable="home:zdjecia">
        <div className="wrap photo-strip">
          <div className="photo rv"><img src="/assets/photos/life-9.webp" alt="sygnały na żywo — koncert" loading="lazy" data-edit="home_ph1" data-edit-type="image" /></div>
          <div className="photo rv rv-d1"><img src="/assets/photos/life-8.webp" alt="publiczność festiwalu" loading="lazy" data-edit="home_ph2" data-edit-type="image" /></div>
          <div className="photo rv rv-d2"><img src="/assets/photos/life-10.webp" alt="tłum, który rezonuje" loading="lazy" data-edit="home_ph3" data-edit-type="image" /></div>
        </div>
      </section>

      {/* ===== raport ===== */}
      <section className="band brand-field on-brand" data-hideable="home:raport">
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

      {/* ===== case studies ===== */}
      {!editing && cases.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="sec-head">
              <div className="eyebrow rv">realizacje</div>
              <h2 className="h-lg rv">kampanie, które wybrzmiały.</h2>
            </div>
            <div className="case-list">
              {cases.map((c, i) => (
                <CaseRow key={c.slug} c={c} i={i} href="/case-studies" onClick={go('/case-studies')} />
              ))}
            </div>
            <div className="case-more">
              <a className="btn btn-ghost rv" href="/case-studies" onClick={go('/case-studies')}>wszystkie case studies</a>
            </div>
          </div>
        </section>
      )}

      {/* ===== manifest ===== */}
      <section className="band brand-field on-brand" data-hideable="home:manifest">
        <FoamArt seed={7} n={150} light shape="mega" className="band-foam" />
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
