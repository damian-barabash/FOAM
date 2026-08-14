import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { useCms } from '../lib/content.js';
import FoamArt from '../components/FoamArt.jsx';

export default function Ekosystem() {
  const navigate = useNavigate();
  const ctx = useCms('ekosystem');
  const editing = ctx && ctx.editing;
  useEffect(() => { if (!editing) document.title = 'ekosystem — foam.media'; }, [editing]);
  const go = (to) => (e) => { e.preventDefault(); if (!editing) wipeTo(navigate, to); };

  return (
    <div className="page-eko">
      <section className="page-hero brand-field on-brand">
        <div className="ph-mega ph-right" aria-hidden="true"><FoamArt seed={64} n={330} light shape="venn" /></div>
        <div className="wrap">
          <div className="eyebrow rv in" data-edit="eko_hero_eyebrow">ekosystem</div>
          <h1 className="h-xl rv in" data-edit="eko_hero_h">bańki łączą się w pianę.</h1>
          <p className="lead rv in rv-d1" data-edit="eko_hero_p">FOAM nie działa w próżni. jesteśmy częścią ekosystemu mediów, zasięgów i serc — i to z tych połączeń bierze się nasza siła.</p>
        </div>
      </section>

      <section className="section">
        <span className="mark-word" aria-hidden="true">ekosystem</span>
        <div className="wrap">
          <div className="eco-venn rv in" aria-hidden="true">
            <FoamArt seed={17} n={340} shape="venn" style={{ width: 'min(420px, 78vw)' }} /></div>
          <div className="grid3">
            <div className="card eco-card rv">
              <div className="eco-logo" data-edit="eko_c1_logo">foam.media</div>
              <span className="pill" style={{ width: 'fit-content' }} data-edit="eko_c1_tag">dom mediowy</span>
              <p className="lead" style={{ fontSize: 15 }} data-edit="eko_c1_p">serce ekosystemu: strategia, media, kreacja i dane. tu małe sygnały składają się w kampanie.</p>
            </div>
            <div className="card eco-card rv rv-d1">
              <div className="eco-logo" data-edit="eko_c2_logo">donald.pl</div>
              <span className="pill" style={{ width: 'fit-content' }} data-edit="eko_c2_tag">zasięgi & kultura feedu</span>
              <p className="lead" style={{ fontSize: 15 }} data-edit="eko_c2_p">jedno z największych społecznościowych mediów młodego internetu w polsce. stąd znamy puls feedu z pierwszej ręki — i wiemy, co naprawdę niesie.</p>
            </div>
            <div className="card eco-card rv rv-d2">
              <div className="eco-logo" data-edit="eko_c3_logo">serca</div>
              <span className="pill" style={{ width: 'fit-content' }} data-edit="eko_c3_tag">creator management</span>
              <p className="lead" style={{ fontSize: 15 }} data-edit="eko_c3_p">zaplecze twórców i talentów. dzięki serca sygnały mają twarze, głosy i społeczności, które im ufają.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tint" data-hideable="eko:jak">
        <FoamArt seed={15} n={150} shape="venn" className="foam-deco fd-tr" />
        <div className="wrap grid2">
          <div>
            <div className="eyebrow rv" data-edit="eko_how_eyebrow">co to daje markom</div>
            <h2 className="h-lg rv" data-edit="eko_how_h">jeden brief, cały ekosystem.</h2>
          </div>
          <div className="lead rv rv-d1" data-edit="eko_how_p" data-edit-type="html">
            wchodzisz jednym briefem, a pracuje dla ciebie całość: zasięgi własne, sieć twórców, relacje z mediami i zespół, który wie, jak to połączyć.
            mniej pośredników, krótsza droga sygnału, lepsza cena uwagi.
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 'clamp(44px, 5vw, 80px)' }}>
          <div className="photo rv"><img src="/assets/photos/life-2.webp" alt="ekosystem foam przy pracy" loading="lazy" data-edit="eko_ph1" data-edit-type="image" style={{ aspectRatio: '21/9' }} /></div>
        </div>
      </section>

      <section className="band brand-field on-brand">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="h-lg rv" style={{ margin: '0 auto' }} data-edit="eko_cta_h">sprawdź, jak ekosystem zagra dla ciebie.</h2>
          <div className="hero-ctas rv rv-d1" style={{ justifyContent: 'center' }}>
            <a className="btn btn-white" href="/kontakt" onClick={go('/kontakt')} data-edit="eko_cta_b">napisz do nas</a>
          </div>
        </div>
      </section>
    </div>
  );
}
