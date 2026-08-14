import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { useCms } from '../lib/content.js';

export default function Ekosystem() {
  const navigate = useNavigate();
  const ctx = useCms('ekosystem');
  const editing = ctx && ctx.editing;
  useEffect(() => { if (!editing) document.title = 'ekosystem — foam.media'; }, [editing]);
  const go = (to) => (e) => { e.preventDefault(); if (!editing) wipeTo(navigate, to); };

  return (
    <div className="page-eko">
      <section className="page-hero brand-field on-brand">
        <div className="wrap">
          <div className="eyebrow rv in" data-edit="eko_hero_eyebrow">ekosystem</div>
          <h1 className="h-xl rv in" data-edit="eko_hero_h">bańki łączą się w pianę.</h1>
          <p className="lead rv in rv-d1" data-edit="eko_hero_p">FOAM nie działa w próżni. jesteśmy częścią ekosystemu mediów, zasięgów i serc — i to z tych połączeń bierze się nasza siła.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="eco-venn rv in" aria-hidden="true">
            <svg viewBox="0 0 300 160" style={{ width: 'min(460px, 80vw)' }}>
              <circle cx="105" cy="80" r="62" fill="none" stroke="var(--foam-600)" strokeWidth="1.4" />
              <circle cx="195" cy="80" r="62" fill="none" stroke="var(--foam-300)" strokeWidth="1.4" />
              <circle cx="150" cy="80" r="3.4" fill="var(--foam-600)" />
              <text x="72" y="84" textAnchor="middle" className="ch-tick" style={{ fontSize: 12 }}>media</text>
              <text x="228" y="84" textAnchor="middle" className="ch-tick" style={{ fontSize: 12 }}>ludzie</text>
              <text x="150" y="30" textAnchor="middle" className="ch-tick" style={{ fontSize: 11 }}>foam</text>
            </svg>
          </div>
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
