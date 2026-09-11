import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import { useCms } from '../lib/content.js';
import FoamArt from '../components/FoamArt.jsx';
import Aura, { Tile } from '../components/Aura.jsx';

const FILARY = [
  ['połączenia', 'relacje z redakcjami, twórcami i platformami budowane latami. połączenie to najkrótsza droga sygnału.'],
  ['lekkość', 'nie przekrzykujemy internetu. wchodzimy w jego rytm — lekko, naturalnie, we właściwym kontekście.'],
  ['precyzja', 'sygnał bez adresu to szum. planujemy media na danych, nie na przyzwyczajeniach.'],
  ['impakt', 'sukces mierzymy rezonansem: co zostało w głowach, a nie tylko w raportach zasięgowych.'],
];
const KROKI = [
  ['nasłuch', 'zanim cokolwiek powiemy — słuchamy. dane o kategorii, kulturze i konkurencji zbieramy w jeden obraz.'],
  ['kompozycja', 'projektujemy przekaz i dobieramy sygnały: kanały, twórców, formaty, momenty. powstaje partytura kampanii.'],
  ['emisja', 'wypuszczamy sygnały w zaplanowanym rytmie i reagujemy na żywo — feed nie czeka na media plan.'],
  ['rezonans', 'mierzymy, co wybrzmiało. wnioski wracają do partytury — każda kampania uczy następną.'],
];

export default function Podejscie() {
  const navigate = useNavigate();
  const ctx = useCms('podejscie');
  const editing = ctx && ctx.editing;
  useEffect(() => { if (!editing) document.title = 'podejście — foam.media'; }, [editing]);
  const go = (to) => (e) => { e.preventDefault(); if (!editing) wipeTo(navigate, to); };

  return (
    <div className="page-podejscie">
      <section className="page-hero brand-field on-brand">
        <div className="ph-mega ph-right" aria-hidden="true"><FoamArt seed={61} n={330} light /></div>
        <div className="wrap">
          <div className="eyebrow rv in" data-edit="pod_hero_eyebrow">podejście / manifest</div>
          <h1 className="h-xl rv in" data-edit="pod_hero_h">pojedyncza bańka nie znaczy nic.</h1>
          <p className="lead rv in rv-d1" data-edit="pod_hero_p">miliony baniek to piana — materiał, z którego można zbudować megafon. tak myślimy o mediach.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap poster-grid">
          <div className="poster tone-dark rv">
            <Aura v="a3" />
            <div className="eyebrow" data-edit="pod_man_eyebrow">manifest</div>
            <h2 className="h-lg rv in" data-edit="pod_man_h">suma małych sygnałów.</h2>
          </div>
          <div className="poster-text lead rv rv-d1" data-edit="pod_man_p" data-edit-type="html">
            wielkie kampanie nie zaczynają się od wielkiego huku. zaczynają się od tysięcy małych sygnałów: wzmianki, udostępnienia, komentarza, sekundy uwagi w feedzie.
            osobno są ulotne jak bańki mydlane. połączone — składają się w przekaz, którego nie da się nie usłyszeć.
            naszą pracą jest łączenie. znamy media, ludzi i dane na tyle dobrze, by wiedzieć, które sygnały się przyciągają — i jak zbudować z nich całość, która wybrzmi.
          </div>
        </div>
        <div className="wrap photo-strip" style={{ marginTop: 'clamp(48px, 6vw, 100px)' }}>
          <div className="photo rv"><img src="/assets/photos/life-11.webp" alt="praca nad sygnałami" loading="lazy" data-edit="pod_ph1" data-edit-type="image" /></div>
          <div className="photo rv rv-d1"><img src="/assets/photos/life-6.webp" alt="zespół foam" loading="lazy" data-edit="pod_ph2" data-edit-type="image" /></div>
          <div className="photo rv rv-d2"><img src="/assets/photos/life-4.webp" alt="warsztat kreatywny" loading="lazy" data-edit="pod_ph3" data-edit-type="image" /></div>
        </div>
      </section>

      <section className="section section-tint" data-hideable="pod:filary">
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow rv" data-edit="pod_fil_eyebrow">filary</div>
            <h2 className="h-lg rv" data-edit="pod_fil_h">na czym stoi piana.</h2>
          </div>
          <div className="tiles t-4">
            {FILARY.map(([h, p], i) => (
              <Tile key={h} i={i} idx={'0' + (i + 1)} title={h} text={p} k={`pod_fil${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-hideable="pod:praca">
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow rv" data-edit="pod_way_eyebrow">sposób pracy</div>
            <h2 className="h-lg rv" data-edit="pod_way_h">jak łączymy sygnały.</h2>
            <p className="lead rv rv-d1" data-edit="pod_way_p">cztery kroki. zawsze w tej kolejności, zawsze razem z tobą.</p>
          </div>
          <div className="tiles t-4">
            {KROKI.map(([h, p], i) => (
              <Tile key={h} i={i + 4} idx={'0' + (i + 1)} title={h} text={p} k={`pod_way${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="band brand-field on-brand">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="h-lg rv" style={{ margin: '0 auto' }} data-edit="pod_cta_h">sprawdź, jak to brzmi w praktyce.</h2>
          <div className="hero-ctas rv rv-d1" style={{ justifyContent: 'center' }}>
            <a className="btn btn-white" href="/oferta" onClick={go('/oferta')} data-edit="pod_cta_b1">zobacz, co robimy</a>
            <a className="btn btn-ghost-brand" href="/kontakt" onClick={go('/kontakt')} data-edit="pod_cta_b2">napisz do nas</a>
          </div>
        </div>
      </section>
    </div>
  );
}
