import React, { useMemo } from 'react';

// Deterministyczna „piana" — klaster opalizujących baniek jako grafika sekcji.
// Zamiast fotografii stockowej: brand mówi bąbelkami (zob. design system).
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export default function FoamArt({ seed = 7, n = 14, className = '', light = false, style }) {
  const bubbles = useMemo(() => {
    const r = rng(seed * 7919);
    return Array.from({ length: n }, (_, i) => {
      const rad = 6 + r() * 26;
      return {
        cx: 12 + r() * 76,
        cy: 12 + r() * 76,
        r: rad,
        hue: 195 + r() * 80,
        o: 0.25 + r() * 0.5,
        hl: 0.3 + r() * 0.25,
        key: i,
      };
    });
  }, [seed, n]);
  const rim = light ? 'rgba(255,255,255,.75)' : 'rgba(79,135,216,.55)';

  return (
    <svg viewBox="0 0 100 100" className={'foam-art ' + className} style={style} aria-hidden="true">
      <defs>
        {bubbles.map((b) => (
          <radialGradient key={b.key} id={`fa${seed}-${b.key}`} cx="35%" cy="32%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,.85)" />
            <stop offset="35%" stopColor="rgba(255,255,255,.06)" />
            <stop offset="86%" stopColor={`hsla(${b.hue},80%,78%,.30)`} />
            <stop offset="100%" stopColor={`hsla(${b.hue + 90},75%,80%,.55)`} />
          </radialGradient>
        ))}
      </defs>
      {bubbles.map((b) => (
        <g key={b.key} opacity={b.o} className="fa-b" style={{ animationDelay: `${(b.key % 7) * 0.6}s` }}>
          <circle cx={b.cx} cy={b.cy} r={b.r} fill={`url(#fa${seed}-${b.key})`} stroke={rim} strokeWidth=".45" />
          <ellipse
            cx={b.cx - b.r * 0.36} cy={b.cy - b.r * 0.42}
            rx={b.r * 0.22} ry={b.r * 0.12}
            fill="rgba(255,255,255,.8)" opacity={b.hl}
            transform={`rotate(-32 ${b.cx - b.r * 0.36} ${b.cy - b.r * 0.42})`}
          />
        </g>
      ))}
    </svg>
  );
}
