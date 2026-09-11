import React from 'react';

// „Aura" = zernista, rozmyta plama brandowego błękitu (public/assets/aura/a1..a8.webp,
// generowane skryptem sharp). tone: light = ciemny tekst na jasnym dole,
// dark = biały tekst, split = aura tylko w górnej części, dół biały.
export const AURA = { a1: 'light', a2: 'split', a3: 'dark', a4: 'light', a5: 'light', a6: 'dark', a7: 'light', a8: 'light' };
const ORDER = ['a1', 'a2', 'a3', 'a5', 'a4', 'a7', 'a6', 'a8'];
export const auraFor = (i) => ORDER[i % ORDER.length];

export default function Aura({ v = 'a1', className = '' }) {
  return (
    <div className={'aura ' + className} aria-hidden="true">
      <img src={`/assets/aura/${v}.webp`} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

// Kafel-poster: indeks, aura, tytuł w szklanej pigułce, opis.
export function Tile({ i, v, idx, title, text, k, className = '' }) {
  const a = v || auraFor(i);
  return (
    <div className={`tile tile-${AURA[a]} rv rv-d${i % 4} ${className}`}>
      <Aura v={a} />
      {idx ? <span className="t-idx" data-edit={k ? `${k}_n` : undefined}>{idx}</span> : null}
      <div className="tile-body">
        <h3 className="t-pill" data-edit={k ? `${k}_h` : undefined}>{title}</h3>
        <p data-edit={k ? `${k}_p` : undefined}>{text}</p>
      </div>
    </div>
  );
}
