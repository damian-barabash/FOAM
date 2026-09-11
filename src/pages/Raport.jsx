import React, { useEffect, useState } from 'react';
import { useCms } from '../lib/content.js';
import { postLead } from '../lib/api.js';
import { LineChart, StatTile } from '../components/Charts.jsx';
import Obj from '../components/Obj.jsx';
import Aura, { Tile } from '../components/Aura.jsx';

const PREVIEW = [42, 48, 47, 55, 61, 58, 67, 74, 79, 88, 96, 108];
const MONTHS = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

export default function Raport() {
  const ctx = useCms('raport');
  const editing = ctx && ctx.editing;
  useEffect(() => { if (!editing) document.title = 'raport — suma małych sygnałów — foam.media'; }, [editing]);

  const [f, setF] = useState({ name: '', email: '', company: '', role: '' });
  const [rodo, setRodo] = useState(false);
  const [mkt, setMkt] = useState(false);
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending'); setErr('');
    try {
      await postLead({ kind: 'raport', ...f, consent_rodo: rodo, consent_marketing: mkt, source: 'raport-landing' });
      setState('done');
    } catch (ex) {
      setState('idle');
      setErr('coś poszło nie tak — spróbuj ponownie albo napisz na info@foam.media');
    }
  }

  return (
    <div className="page-raport">
      <section className="page-hero brand-field on-brand" style={{ paddingBottom: 0 }}>
        <div className="wrap hero-in" style={{ paddingBottom: 84 }}>
          <div>
            <div className="eyebrow rv in" data-edit="rap_hero_eyebrow">raport foam.media · edycja 2026</div>
            <h1 className="h-xl rv in" data-edit="rap_hero_h">suma małych sygnałów.</h1>
            <p className="lead rv in rv-d1" data-edit="rap_hero_p">jak wybrzmiewają marki w polskich mediach: dane z 120 kampanii, 6 wniosków i rekomendacje na 12 miesięcy. pobierz — w zamian prosimy tylko o e-mail.</p>
            <div className="hero-ctas rv in rv-d2">
              <span className="pill" data-edit="rap_hero_p1">48 stron</span>
              <span className="pill" data-edit="rap_hero_p2">120 kampanii</span>
              <span className="pill" data-edit="rap_hero_p3">6 wniosków</span>
            </div>
          </div>

          {/* gated form */}
          <div className="card raport-form rv in rv-d1">
            {state === 'done' ? (
              <div className="form-ok">
                <div className="fo-big">🫧</div>
                <h3 data-edit="rap_ok_h">raport płynie do ciebie.</h3>
                <p className="form-note" data-edit="rap_ok_p">sprawdź skrzynkę (i folder „oferty") — link do raportu właśnie wyleciał. do usłyszenia w the connections.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 data-edit="rap_form_h" style={{ marginBottom: 14 }}>pobierz raport</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="form-row2">
                    <input className="field" placeholder="imię i nazwisko" required value={f.name} onChange={set('name')} aria-label="imię i nazwisko" />
                    <input className="field" placeholder="firma" value={f.company} onChange={set('company')} aria-label="firma" />
                  </div>
                  <div className="form-row2">
                    <input className="field" type="email" placeholder="służbowy e-mail" required value={f.email} onChange={set('email')} aria-label="e-mail" />
                    <input className="field" placeholder="rola (np. brand manager)" value={f.role} onChange={set('role')} aria-label="rola" />
                  </div>
                  <label className="check">
                    <input type="checkbox" required checked={rodo} onChange={(e) => setRodo(e.target.checked)} />
                    <span data-edit="rap_form_rodo">wyrażam zgodę na przetwarzanie moich danych w celu udostępnienia raportu (RODO). administratorem danych jest FOAM.MEDIA.</span>
                  </label>
                  <label className="check">
                    <input type="checkbox" checked={mkt} onChange={(e) => setMkt(e.target.checked)} />
                    <span data-edit="rap_form_mkt">chcę też dostawać newsletter „the connections" (opcjonalnie).</span>
                  </label>
                  {err ? <div className="form-err">{err}</div> : null}
                  <button className="btn btn-solid" disabled={state === 'sending'} style={{ justifyContent: 'center' }}>
                    {state === 'sending' ? 'wysyłanie…' : 'wyślij mi raport'}
                  </button>
                  <div className="form-note" data-edit="rap_form_note">zero spamu. jeden raport, zero łańcuszków.</div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <Obj name="shield" className="sec-obj rv" />
            <div className="eyebrow rv" data-edit="rap_prev_eyebrow">podgląd danych</div>
            <h2 className="h-lg rv" data-edit="rap_prev_h">indeks rezonansu rośnie.</h2>
            <p className="lead rv rv-d1" data-edit="rap_prev_p">średni indeks rezonansu marek, które planują media jako sumę małych sygnałów — vs. rynek. pełne dane w raporcie.</p>
          </div>
          <div className="grid2" style={{ alignItems: 'stretch' }}>
            <div className="card rv" style={{ padding: 30 }}>
              <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 14 }}>indeks rezonansu · 2025, próba: 120 kampanii</div>
              <LineChart data={PREVIEW} labels={MONTHS} ariaLabel="indeks rezonansu w 2025 roku, wzrost z 42 do 108 punktów" />
            </div>
            <div className="grid3" style={{ gridTemplateColumns: '1fr 1fr', alignContent: 'stretch' }}>
              <div className="card has-aura rv rv-d1"><Aura v="a8" className="aura-soft" /><StatTile num="+157%" label="wzrost indeksu r/r" sub="marki „signal-first” vs rynek" /></div>
              <div className="card has-aura rv rv-d2"><Aura v="a5" className="aura-soft" /><StatTile num="63%" label="uwagi z małych formatów" sub="sygnały < 15 s ekspozycji" /></div>
              <div className="card has-aura rv rv-d1"><Aura v="a7" className="aura-soft" /><StatTile num="4,2×" label="zwrot z połączeń" sub="media kupione relacyjnie" /></div>
              <div className="card has-aura rv rv-d2"><Aura v="a1" className="aura-soft" /><StatTile num="120" label="kampanii w próbie" sub="polski rynek, 2024–2025" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tint" data-hideable="rap:spis">
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow rv" data-edit="rap_toc_eyebrow">w środku</div>
            <h2 className="h-lg rv" data-edit="rap_toc_h">sześć rozdziałów, zero lania wody.</h2>
          </div>
          <div className="tiles t-3">
            {[
              ['mapa sygnałów', 'gdzie dziś naprawdę powstaje uwaga: feed, DM-y, podcasty, komentarze.'],
              ['ekonomia lekkości', 'dlaczego formaty poniżej 15 sekund niosą 63% zapamiętania.'],
              ['siła połączeń', 'media kupowane relacyjnie vs programmatic — liczby, nie anegdoty.'],
              ['kreacja natywna', 'jak wygląda przekaz, którego feed nie wypluwa.'],
              ['pomiar rezonansu', 'brand lift, attention i sentyment w jednym indeksie.'],
              ['plan na 12 miesięcy', 'rekomendacje krok po kroku dla marek każdej wielkości.'],
            ].map(([h, p], i) => (
              <Tile key={h} i={i + 1} idx={'0' + (i + 1)} title={h} text={p} k={`rap_toc${i + 1}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
