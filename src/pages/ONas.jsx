import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { useCms } from '../lib/content.js';
import FoamArt from '../components/FoamArt.jsx';

const TEAM = [
  ['Maja Kowalik', 'managing director'],
  ['Tomasz Zieliński', 'head of connections'],
  ['Ola Nowicka', 'creative lead'],
  ['Piotr Adamski', 'head of data'],
  ['Kasia Wilk', 'social & creators lead'],
  ['Marek Osa', 'pr & media relations'],
];

export default function ONas() {
  const navigate = useNavigate();
  const ctx = useCms('o-nas');
  const editing = ctx && ctx.editing;
  useEffect(() => { if (!editing) document.title = 'o nas — foam.media'; }, [editing]);
  const go = (to) => (e) => { e.preventDefault(); if (!editing) wipeTo(navigate, to); };

  return (
    <div className="page-onas">
      <section className="page-hero brand-field on-brand">
        <div className="ph-mega ph-left" aria-hidden="true"><FoamArt seed={65} n={330} light shape="heart" /></div>
        <div className="wrap">
          <div className="eyebrow rv in" data-edit="on_hero_eyebrow">o nas / zespół</div>
          <h1 className="h-xl rv in" data-edit="on_hero_h">ludzie od łączenia.</h1>
          <p className="lead rv in rv-d1" data-edit="on_hero_p">jesteśmy małym zespołem z dużą siecią połączeń. każde z nas przyszło z innego świata mediów — razem składamy je w całość.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid2">
          <div>
            <div className="eyebrow rv" data-edit="on_kul_eyebrow">kultura</div>
            <h2 className="h-lg rv" data-edit="on_kul_h">mówimy cicho, słychać daleko.</h2>
          </div>
          <div className="lead rv rv-d1" data-edit="on_kul_p" data-edit-type="html">
            nie wierzymy w krzyk — ani w kampaniach, ani w biurze. wierzymy w rzemiosło, ciekawość i lekkość.
            pracujemy hybrydowo, jesteśmy z warszawy, a nasze spotkania zaczynają się od danych i kończą na pomysłach, nie odwrotnie.
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} data-hideable="on:zdjecia">
        <div className="wrap">
          <div className="photo-strip">
            <div className="photo rv"><img src="/assets/photos/life-3.webp" alt="praca zespołu foam" loading="lazy" data-edit="on_ph1" data-edit-type="image" /></div>
            <div className="photo rv rv-d1"><img src="/assets/photos/life-4.webp" alt="biuro foam.media" loading="lazy" data-edit="on_ph2" data-edit-type="image" /></div>
            <div className="photo rv rv-d2"><img src="/assets/photos/life-5.webp" alt="spotkanie kreatywne" loading="lazy" data-edit="on_ph3" data-edit-type="image" /></div>
          </div>
        </div>
      </section>

      <section className="section section-tint" data-hideable="on:zespol">
        <span className="mark-word" aria-hidden="true">zespół</span>
        <span className="side-label" aria-hidden="true">foam.media · warszawa</span>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow rv" data-edit="on_team_eyebrow">zespół</div>
              <h2 className="h-lg rv" data-edit="on_team_h">twarze piany.</h2>
            </div>
            <p className="lead rv rv-d1" data-edit="on_team_p">zdjęcia? wolimy bańki. poznamy się na spotkaniu.</p>
          </div>
          <div className="grid3">
            {TEAM.map(([name, role], i) => (
              <div className={'card team-card rv rv-d' + (i % 3)} key={name}>
                <div className="team-ava">
                  <FoamArt seed={i + 51} n={100} light />
                  <span>{name.split(' ').map((w) => w[0]).join('')}</span>
                </div>
                <h3 data-edit={`on_t${i + 1}_name`}>{name}</h3>
                <span className="mono" data-edit={`on_t${i + 1}_role`}>{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-hideable="on:wartosci">
        <span className="mark-word mark-left mark-bottom" aria-hidden="true">kultura</span>
        <FoamArt seed={16} n={150} shape="heart" className="foam-deco fd-tr" />
        <div className="wrap">
          <div className="mosaic m-4">
            {[
              ['ciekawość', 'feed zmienia się co tydzień. my razem z nim.'],
              ['rzemiosło', 'małe sygnały wymagają dużej staranności.'],
              ['szczerość', 'mówimy klientom to, co mówią dane. też gdy boli.'],
              ['lekkość', 'dobra robota nie musi być ciężka.'],
            ].map(([h, p], i) => (
              <div className={'mo-card rv rv-d' + (i % 4) + (i === 3 ? ' mo-brand' : '')} key={h}>
                <span className="mo-num" data-edit={`on_v${i + 1}_n`}>{'0' + (i + 1)}</span>
                {i === 3 ? <FoamArt seed={47} n={110} light className="mo-foam" /> : null}
                <h3 data-edit={`on_v${i + 1}_h`}>{h}</h3>
                <p data-edit={`on_v${i + 1}_p`}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band brand-field on-brand">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="h-lg rv" style={{ margin: '0 auto' }} data-edit="on_cta_h">chcesz dołączyć do piany?</h2>
          <div className="hero-ctas rv rv-d1" style={{ justifyContent: 'center' }}>
            <a className="btn btn-white" href="/kariera" onClick={go('/kariera')} data-edit="on_cta_b">zobacz oferty pracy</a>
          </div>
        </div>
      </section>
    </div>
  );
}
