import React, { useEffect, useState } from 'react';
import { useCms } from '../lib/content.js';
import { postLead } from '../lib/api.js';
import FoamArt from '../components/FoamArt.jsx';
import Aura from '../components/Aura.jsx';

const TOPICS = [
  ['biznes', 'współpraca / kampania'],
  ['prasa', 'kontakt prasowy'],
  ['kariera', 'praca w foam'],
  ['inne', 'coś innego'],
];

export default function Kontakt() {
  const ctx = useCms('kontakt');
  const editing = ctx && ctx.editing;
  useEffect(() => { if (!editing) document.title = 'kontakt — foam.media'; }, [editing]);

  const [f, setF] = useState({ name: '', email: '', company: '', message: '' });
  const [topic, setTopic] = useState('biznes');
  const [rodo, setRodo] = useState(false);
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending'); setErr('');
    try {
      await postLead({ kind: 'kontakt', ...f, topic, consent_rodo: rodo, source: 'kontakt' });
      setState('done');
    } catch {
      setState('idle');
      setErr('nie wysłało się — spróbuj ponownie albo napisz wprost na info@foam.media');
    }
  }

  return (
    <div className="page-kontakt">
      <section className="page-hero brand-field on-brand">
        <div className="ph-mega ph-left" aria-hidden="true"><FoamArt seed={67} n={330} light shape="speech" /></div>
        <div className="wrap">
          <div className="eyebrow rv in" data-edit="kon_hero_eyebrow">kontakt</div>
          <h1 className="h-xl rv in" data-edit="kon_hero_h">napisz do nas.</h1>
          <p className="lead rv in rv-d1" data-edit="kon_hero_p">pierwszy sygnał wystarczy — resztą połączeń zajmiemy się my.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid2" style={{ alignItems: 'flex-start' }}>
          <div className="card raport-form rv">
            {state === 'done' ? (
              <div className="form-ok">
                <div className="fo-big">🫧</div>
                <h3 data-edit="kon_ok_h">sygnał odebrany.</h3>
                <p className="form-note" data-edit="kon_ok_p">wracamy do ciebie najpóźniej następnego dnia roboczego.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 data-edit="kon_form_h" style={{ marginBottom: 14 }}>formularz</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="post-tags" role="radiogroup" aria-label="temat wiadomości">
                    {TOPICS.map(([val, label]) => (
                      <button
                        type="button" key={val} className="pill"
                        onClick={() => setTopic(val)}
                        style={topic === val ? { background: 'var(--foam-600)', color: '#fff', borderColor: 'var(--foam-600)' } : {}}
                        role="radio" aria-checked={topic === val}
                      >{label}</button>
                    ))}
                  </div>
                  <div className="form-row2">
                    <input className="field" placeholder="imię i nazwisko" required value={f.name} onChange={set('name')} aria-label="imię i nazwisko" />
                    <input className="field" placeholder="firma (opcjonalnie)" value={f.company} onChange={set('company')} aria-label="firma" />
                  </div>
                  <input className="field" type="email" placeholder="e-mail" required value={f.email} onChange={set('email')} aria-label="e-mail" />
                  <textarea className="field" placeholder="o czym chcesz porozmawiać?" required value={f.message} onChange={set('message')} aria-label="wiadomość" />
                  <label className="check">
                    <input type="checkbox" required checked={rodo} onChange={(e) => setRodo(e.target.checked)} />
                    <span data-edit="kon_form_rodo">wyrażam zgodę na przetwarzanie moich danych w celu obsługi zapytania (RODO).</span>
                  </label>
                  {err ? <div className="form-err">{err}</div> : null}
                  <button className="btn btn-solid" disabled={state === 'sending'} style={{ justifyContent: 'center' }}>
                    {state === 'sending' ? 'wysyłanie…' : 'wyślij sygnał'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="contact-side">
            <div className="photo rv rv-d1"><img src="/assets/photos/life-12.webp" alt="foam — zawsze przy kawie" loading="lazy" data-edit="kon_ph1" data-edit-type="image" /></div>
            <div className="card contact-card has-aura rv rv-d1">
              <Aura v="a8" className="aura-soft" />
              <div className="eyebrow" data-edit="kon_d1_h">napisz wprost</div>
              <a href="mailto:info@foam.media" className="big" data-edit="kon_d1_mail">info@foam.media</a>
              <p className="form-note" style={{ marginTop: 10 }} data-edit="kon_d1_p">na maile odpowiadamy szybciej niż na cokolwiek innego.</p>
            </div>
            <div className="card contact-card has-aura rv rv-d2">
              <Aura v="a5" className="aura-soft" />
              <div className="eyebrow" data-edit="kon_d2_h">kontakt prasowy</div>
              <a href="mailto:press@foam.media" className="mid" data-edit="kon_d2_mail">press@foam.media</a>
              <p className="form-note" style={{ marginTop: 10 }} data-edit="kon_d2_p">materiały prasowe, wypowiedzi eksperckie, dane z raportów.</p>
            </div>
            <div className="card contact-card has-aura rv rv-d3">
              <Aura v="a7" className="aura-soft" />
              <div className="eyebrow" data-edit="kon_d3_h">biuro</div>
              <p style={{ fontWeight: 600, fontSize: 16 }} data-edit="kon_d3_a">foam.media sp. z o.o.</p>
              <p className="form-note" style={{ marginTop: 6 }} data-edit="kon_d3_p">warszawa · pracujemy hybrydowo, spotykamy się tam, gdzie ty.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
