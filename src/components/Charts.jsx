import React, { useRef, useState } from 'react';

// Wykresy SVG — jedna seria, brandowy niebieski, mono-cyfry, tooltip na hover.
// (Monochromatyczny brand → bez palety kategorialnej; tożsamość niosą podpisy.)

const BLUE = '#4168ee';
const GRID = '#e6edf9';

export function LineChart({ data, labels, height = 220, unit = '', ariaLabel = 'wykres liniowy' }) {
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  const W = 600, H = height, P = { t: 16, r: 14, b: 26, l: 40 };
  const max = Math.max(...data, 1);
  const nice = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / nice) * nice;
  const x = (i) => P.l + (i / (data.length - 1 || 1)) * (W - P.l - P.r);
  const y = (v) => P.t + (1 - v / top) * (H - P.t - P.b);
  const path = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const area = `${path}L${x(data.length - 1)},${y(0)}L${x(0)},${y(0)}Z`;
  const ticks = [0, top / 2, top];

  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let best = 0, bd = 1e9;
    data.forEach((_, i) => { const d = Math.abs(x(i) - px); if (d < bd) { bd = d; best = i; } });
    setHover(best);
  }

  return (
    <div className="chart-box" role="img" aria-label={ariaLabel}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={BLUE} stopOpacity=".18" />
            <stop offset="1" stopColor={BLUE} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
            <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="ch-tick">{t >= 1000 ? (t / 1000) + 'k' : t}</text>
          </g>
        ))}
        {labels.map((l, i) => (
          (i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1) &&
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="ch-tick">{l}</text>
        ))}
        <path d={area} fill="url(#lc-fill)" />
        <path d={path} fill="none" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="4" fill={BLUE} stroke="#fff" strokeWidth="2" />
        {hover != null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={P.t} y2={H - P.b} stroke={BLUE} strokeWidth="1" strokeDasharray="3 3" opacity=".5" />
            <circle cx={x(hover)} cy={y(data[hover])} r="5" fill="#fff" stroke={BLUE} strokeWidth="2" />
          </g>
        )}
      </svg>
      {hover != null && (
        <div className="ch-tip mono" style={{ left: `${(x(hover) / W) * 100}%`, top: 0 }}>
          {labels[hover]} · {data[hover].toLocaleString('pl-PL')}{unit}
        </div>
      )}
    </div>
  );
}

export function BarsH({ items, unit = '', ariaLabel = 'wykres słupkowy' }) {
  const max = Math.max(...items.map((i) => i.v), 1);
  return (
    <div className="barsh" role="img" aria-label={ariaLabel}>
      {items.map((it) => (
        <div className="barsh-row" key={it.label} title={`${it.label}: ${it.v.toLocaleString('pl-PL')}${unit}`}>
          <span className="barsh-label">{it.label}</span>
          <span className="barsh-track">
            <span className="barsh-fill" style={{ width: `${(it.v / max) * 100}%` }} />
          </span>
          <span className="barsh-val mono">{it.v.toLocaleString('pl-PL')}{unit}</span>
        </div>
      ))}
    </div>
  );
}

export function StatTile({ num, label, sub }) {
  return (
    <div className="stat-tile">
      <div className="stat-num mono">{num}</div>
      <div className="stat-label">{label}</div>
      {sub ? <div className="stat-sub">{sub}</div> : null}
    </div>
  );
}
