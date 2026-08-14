import React, { useEffect, useRef, useState } from 'react';

// Case = bańka. Desktop: najazd myszą przebija bańkę i odsłania kartę.
// Dotyk/tablet: bańka pęka sama, gdy wjedzie w kadr (scroll-driven).
export default function CaseBubble({ i, title, client, children }) {
  const [popped, setPopped] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!matchMedia('(hover: none)').matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (en.isIntersecting) {
          setTimeout(() => setPopped(true), 450 + (i % 2) * 300);
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [i]);

  return (
    <div
      ref={ref}
      className={'cb' + (popped ? ' cb-popped' : '')}
      onMouseEnter={() => setPopped(true)}
      onMouseLeave={() => { if (matchMedia('(hover: hover)').matches) setPopped(false); }}
      onFocus={() => setPopped(true)}
      onBlur={() => { if (matchMedia('(hover: hover)').matches) setPopped(false); }}
      tabIndex={0}
      aria-label={`case study: ${title}`}
    >
      <div className="cb-bubble">
        <span className="pill">{client}</span>
        <div className="cb-title">{title}</div>
        <div className="mono cb-hint">najedź, żeby przebić bańkę →</div>
      </div>
      {children}
    </div>
  );
}
