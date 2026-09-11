import React from 'react';

// Pienne obiekty 3D (PNG od usera → public/assets/icons/*.webp, 720px, alpha) —
// zastępują dawną SVG-pianę (FoamArt): hero podstron, pasy brandowe, venn, 404.
// 12 sztuk: pie gear speech target cursor shield bulb search rocket growth heart bars
export default function Obj({ name, className = '', style }) {
  return <img className={'obj ' + className} src={`/assets/icons/${name}.webp`} alt="" loading="lazy" decoding="async" aria-hidden="true" style={style} />;
}
