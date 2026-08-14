import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { useCms } from '../lib/content.js';
import FoamArt from '../components/FoamArt.jsx';

const SERVICES = [
  ['media & połączenia', 'planowanie i zakup mediów na relacjach, nie na cennikach: digital, DOOH, audio, prasa i formaty szyte na miarę. wiemy, do kogo zadzwonić.'],
  ['kampanie social-first', 'koncepty rodzące się w feedzie: TikTok, Reels, Shorts, memy i formaty natywne. kreacja, produkcja i dystrybucja w jednym rytmie.'],
  ['influencer & creator economy', 'dobór twórców po danych i wyczuciu: od nano po gwiazdy. brief, prawa, rozliczenia i pomiar — po naszej stronie.'],
  ['pr & komunikacja', 'historie, które media chcą opowiadać same. relacje z redakcjami, komunikacja produktowa i kryzysowa, biuro prasowe marki.'],
  ['dane & rezonans', 'pomiar sygnałów w czasie rzeczywistym: brand lift, attention, sentyment, atrybucja. dashboard zamiast miesięcznego PDF-a.'],
  ['strategia & brand', 'platformy komunikacji, architektura przekazu, ton głosu. fundament, na którym sygnały składają się w jedną markę.'],
];

export default function Oferta() {
  const navigate = useNavigate();
  const ctx = useCms('oferta');
  const editing = ctx && ctx.editing;
  useEffect(() => { if (!editing) document.title = 'co robimy — foam.media'; }, [editing]);
  const go = (to) => (e) => { e.preventDefault(); if (!editing) wipeTo(navigate, to); };

  return (
    <div className="page-oferta">
      <section className="page-hero brand-field on-brand">
        <div className="ph-mega ph-left" aria-hidden="true"><img src="/assets/megafon.png" alt="" /></div>
        <div className="wrap">
          <div className="eyebrow rv in" data-edit="of_hero_eyebrow">co robimy / oferta</div>
          <h1 className="h-xl rv in" data-edit="of_hero_h">każdy sygnał w dobrych rękach.</h1>
          <p className="lead rv in rv-d1" data-edit="of_hero_p">sześć obszarów, jeden zespół i jedna zasada: przekaz ma wybrzmieć, nie tylko się wyemitować.</p>
        </div>
      </section>

      <section className="section">
        <span className="mark-word" aria-hidden="true">oferta</span>
        <FoamArt seed={10} n={150} shape="mega" className="foam-deco fd-bl" />
        <div className="wrap">
          <div className="mosaic m-6">
            {SERVICES.map(([h, p], i) => (
              <div className={'mo-card rv rv-d' + (i % 3) + ((i === 0 || i === 4) ? ' mo-brand' : '')} key={h}>
                <span className="mo-num" data-edit={`of_s${i + 1}_n`}>{'0' + (i + 1)}</span>
                {(i === 0 || i === 4) ? <FoamArt seed={45} n={110} light className="mo-foam" /> : null}
                <h3 data-edit={`of_s${i + 1}_h`}>{h}</h3>
                <p data-edit={`of_s${i + 1}_p`}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint" data-hideable="of:model">
        <span className="mark-word mark-left mark-bottom" aria-hidden="true">model</span>
        <div className="wrap grid2">
          <div>
            <div className="eyebrow rv" data-edit="of_mod_eyebrow">model współpracy</div>
            <h2 className="h-lg rv" data-edit="of_mod_h">od sprintu po orkiestrę.</h2>
            <p className="lead rv rv-d1" data-edit="of_mod_p">wchodzimy w pojedynczą kampanię, prowadzimy media marki w modelu ciągłym albo budujemy cały ekosystem komunikacji. zakres rośnie razem z zaufaniem.</p>
            <div className="photo rv rv-d2" style={{ marginTop: 38 }}>
              <img src="/assets/photos/life-7.webp" alt="wspólna praca nad kampanią" loading="lazy" data-edit="of_mod_img" data-edit-type="image" />
            </div>
          </div>
          <div className="rowlist">
            {[
              ['sprint', 'jedna kampania, jeden cel, 6–10 tygodni. szybki dowód, że sygnały potrafią się składać.'],
              ['retainer', 'media i komunikacja marki w trybie ciągłym — z jednym zespołem i jednym dashboardem.'],
              ['orkiestra', 'pełny ekosystem: strategia, media, twórcy, PR i dane pod jedną batutą.'],
            ].map(([h, p], i) => (
              <div className={'rl-row rv rv-d' + i} key={h}>
                <span className="rl-num mono">{'0' + (i + 1)}</span>
                <h3 data-edit={`of_mod${i + 1}_h`}>{h}</h3>
                <p data-edit={`of_mod${i + 1}_p`}>{p}</p>
                <span className="rl-arrow" aria-hidden="true">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band brand-field on-brand">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="h-lg rv" style={{ margin: '0 auto' }} data-edit="of_cta_h">opowiedz nam o swoim wyzwaniu.</h2>
          <p className="lead rv rv-d1" style={{ margin: '18px auto 0' }} data-edit="of_cta_p">wrócimy z pierwszą partyturą sygnałów w 5 dni roboczych.</p>
          <div className="hero-ctas rv rv-d2" style={{ justifyContent: 'center' }}>
            <a className="btn btn-white" href="/kontakt" onClick={go('/kontakt')} data-edit="of_cta_b">napisz do nas</a>
          </div>
        </div>
      </section>
    </div>
  );
}
