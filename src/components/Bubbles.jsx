import React, { useEffect, useRef } from 'react';

// Bańki tła: same obwódki (cienki stroke), dryf we wszystkich kierunkach,
// klik = pęknięcie. Kolor zależny od tła pod bańką: białe na polach brandowych
// (.brand-field), błękitne na białych sekcjach. Warstwa NAD tłem sekcji,
// ale POD treścią (.wrap ma wyższy z-index) — nie nachodzi na tekst i karty.
export default function Bubbles({ density = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, raf = 0, last = 0, running = true;
    let bubbles = [], bursts = [];
    let brandRanges = [];
    const ptr = { x: -9999, y: -9999 };

    function computeRanges() {
      brandRanges = Array.from(document.querySelectorAll('.brand-field')).map((el) => {
        const r = el.getBoundingClientRect();
        return [r.top + scrollY, r.bottom + scrollY];
      });
    }
    const onBrand = (yView) => {
      const y = yView + scrollY;
      for (const [a, b] of brandRanges) if (y >= a && y <= b) return true;
      return false;
    };

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeRanges();
      seed();
    }
    function spawn() {
      const a = Math.random() * 6.28;
      const sp = 7 + Math.random() * 24; // px/s, dowolny kierunek
      const big = Math.random() < 0.3;
      const rMax = innerWidth < 720 ? 70 : 130;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: big ? rMax * (0.5 + Math.random() * 0.5) : 8 + Math.random() * rMax * 0.4,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        wa: Math.random() * 6.28,
        wf: 0.1 + Math.random() * 0.3,
        a: 0.3 + Math.random() * 0.4,
        px: 0, py: 0,
      };
    }
    function seed() {
      const target = Math.max(12, Math.min(44, Math.round((W * H) / 42000 * density)));
      bubbles = Array.from({ length: target }, spawn);
    }
    function strokeFor(y, alpha) {
      return onBrand(y)
        ? `rgba(255,255,255,${alpha})`
        : `rgba(126,164,224,${Math.min(1, alpha + 0.12)})`;
    }
    function draw(t) {
      const dt = Math.min((t - last) / 1000, .05); last = t;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1.2;
      for (const b of bubbles) {
        b.wa += (Math.random() - .5) * b.wf;
        b.vx += Math.cos(b.wa) * 6 * dt;
        b.vy += Math.sin(b.wa) * 6 * dt;
        const v = Math.hypot(b.vx, b.vy), vmax = 36;
        if (v > vmax) { b.vx *= vmax / v; b.vy *= vmax / v; }
        b.x += b.vx * dt; b.y += b.vy * dt;
        const dx = b.x - ptr.x, dy = b.y - ptr.y;
        const d2 = dx * dx + dy * dy, R = 130 + b.r;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 50 * dt;
          b.px += (dx / d) * f; b.py += (dy / d) * f;
        }
        b.px *= .94; b.py *= .94;
        if (b.x < -b.r * 2) b.x = W + b.r;
        if (b.x > W + b.r * 2) b.x = -b.r;
        if (b.y < -b.r * 2) b.y = H + b.r;
        if (b.y > H + b.r * 2) b.y = -b.r;
        ctx.strokeStyle = strokeFor(b.y, b.a);
        ctx.beginPath();
        ctx.arc(b.x + b.px, b.y + b.py, b.r, 0, 7);
        ctx.stroke();
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const p = bursts[i];
        p.t += dt;
        const k = p.t / .45;
        if (k >= 1) { bursts.splice(i, 1); continue; }
        ctx.strokeStyle = strokeFor(p.y, (1 - k) * .85);
        for (let j = 0; j < 8; j++) {
          const a = j / 8 * 6.28 + p.seed;
          const rr = p.r * (0.5 + k * 1.6);
          ctx.beginPath();
          ctx.arc(p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr, Math.max(1.2, p.r * .09 * (1 - k)), 0, 7);
          ctx.stroke();
        }
      }
      if (running && !reduced) raf = requestAnimationFrame(draw);
    }
    function onMove(e) { ptr.x = e.clientX; ptr.y = e.clientY; }
    function onClick(e) {
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        const dx = e.clientX - b.x, dy = e.clientY - b.y;
        if (dx * dx + dy * dy < b.r * b.r * 1.3) {
          bursts.push({ x: b.x, y: b.y, r: b.r, t: 0, seed: Math.random() * 6 });
          Object.assign(bubbles[i], spawn());
          break;
        }
      }
    }
    function onVis() {
      running = !document.hidden;
      if (running && !reduced) { last = performance.now(); raf = requestAnimationFrame(draw); }
      else cancelAnimationFrame(raf);
    }

    resize();
    // układ strony zmienia się po dociągnięciu treści/obrazów — odświeżaj zakresy pól
    const rangeTimer = setInterval(computeRanges, 900);
    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('click', onClick);
    document.addEventListener('visibilitychange', onVis);
    last = performance.now();
    if (reduced) { computeRanges(); draw(last + 16); }
    else raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearInterval(rangeTimer);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density]);

  return <canvas id="foam-bubbles" ref={ref} aria-hidden="true" />;
}
