import React from 'react';

// Animowane piktogramy outline (stroke-only) do kart mozaiki.
// kind: wave | nodes | signal | pulse | chart | target | orbit
const CONTENT = {
  wave: (
    <g>
      <circle cx="14" cy="32" r="3.4" className="od-dot" />
      <path d="M24 22a14 14 0 0 1 0 20" className="od-fade od-f1" />
      <path d="M32 15a24 24 0 0 1 0 34" className="od-fade od-f2" />
      <path d="M40 8a35 35 0 0 1 0 48" className="od-fade od-f3" />
    </g>
  ),
  nodes: (
    <g>
      <path d="M14 46 L30 20 L48 38 L14 46" className="od-draw" />
      <path d="M30 20 L52 14" className="od-draw od-f2" />
      <circle cx="14" cy="46" r="3.6" className="od-dot" />
      <circle cx="30" cy="20" r="3.6" className="od-dot od-f2" />
      <circle cx="48" cy="38" r="3.6" className="od-dot od-f3" />
      <circle cx="52" cy="14" r="2.6" className="od-dot od-f1" />
    </g>
  ),
  signal: (
    <g>
      <circle cx="32" cy="32" r="3.2" className="od-dot" />
      <circle cx="32" cy="32" r="10" className="od-ring od-f1" />
      <circle cx="32" cy="32" r="17" className="od-ring od-f2" />
      <circle cx="32" cy="32" r="24" className="od-ring od-f3" />
    </g>
  ),
  pulse: (
    <g>
      <path d="M6 34 H20 L26 20 L34 46 L40 28 L44 34 H58" className="od-draw od-long" />
      <circle cx="58" cy="34" r="2.8" className="od-dot" />
    </g>
  ),
  chart: (
    <g>
      <path d="M10 8 V54 H56" />
      <path d="M16 46 L28 36 L38 40 L52 20" className="od-draw" />
      <circle cx="52" cy="20" r="3" className="od-dot" />
    </g>
  ),
  target: (
    <g>
      <circle cx="32" cy="32" r="22" className="od-spin" strokeDasharray="6 7" />
      <circle cx="32" cy="32" r="12" />
      <circle cx="32" cy="32" r="3.4" className="od-dot" />
    </g>
  ),
  orbit: (
    <g>
      <circle cx="32" cy="32" r="9" />
      <g className="od-orbit">
        <circle cx="32" cy="32" r="22" strokeDasharray="2 5" />
        <circle cx="54" cy="32" r="3.4" className="od-sat" />
      </g>
    </g>
  ),
};

export default function OutlineDiagram({ kind = 'wave', className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`od od-${kind} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {CONTENT[kind] || CONTENT.wave}
    </svg>
  );
}
