import React, { useEffect, useRef } from 'react';

// Latające bańki mydlane — globalna warstwa canvas.
// Sprite'y (opalizujący rim + highlight) rysowane raz do offscreen-canvasów,
// potem tylko drawImage — tanio nawet na mobile. Klik = pęknięcie bańki.
function makeSprite(hue) {
  const S = 160, c = document.createElement('canvas');
  c.width = S; c.height = S;
  const x = c.getContext('2d');
  const cx = S / 2, cy = S / 2, r = S / 2 - 6;

  // wypełnienie: prawie przezroczysty środek, jaśniejszy brzeg
  const g = x.createRadialGradient(cx, cy, r * .2, cx, cy, r);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(.78, 'rgba(255,255,255,0.04)');
  g.addColorStop(.94, `hsla(${hue},80%,82%,0.28)`);
  g.addColorStop(1, 'rgba(255,255,255,0.42)');
  x.fillStyle = g;
  x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();

  // opalizujące segmenty rimu (film mydlany)
  const segs = [
    [hue + 140, -0.6, 1.5], [hue + 40, 1.4, 1.2], [hue - 60, 3.1, 1.6], [hue + 220, 4.9, 1.0],
  ];
  segs.forEach(([h, a0, len]) => {
    x.beginPath();
    x.arc(cx, cy, r - 1.5, a0, a0 + len);
    x.strokeStyle = `hsla(${h},85%,78%,0.5)`;
    x.lineWidth = 2.6;
    x.stroke();
  });

  // cienki biały rim
  x.beginPath(); x.arc(cx, cy, r, 0, 7);
  x.strokeStyle = 'rgba(255,255,255,0.65)'; x.lineWidth = 1.4; x.stroke();

  // highlight u góry po lewej
  x.save();
  x.translate(cx - r * .38, cy - r * .42);
  x.rotate(-0.7);
  x.scale(1, .55);
  const hg = x.createRadialGradient(0, 0, 0, 0, 0, r * .34);
  hg.addColorStop(0, 'rgba(255,255,255,0.85)');
  hg.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = hg;
  x.beginPath(); x.arc(0, 0, r * .34, 0, 7); x.fill();
  x.restore();

  // mały refleks na dole po prawej
  x.beginPath(); x.arc(cx + r * .42, cy + r * .4, r * .07, 0, 7);
  x.fillStyle = 'rgba(255,255,255,0.5)'; x.fill();
  return c;
}

export default function Bubbles({ density = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sprites = [makeSprite(215), makeSprite(255), makeSprite(190)];
    let W = 0, H = 0, dpr = 1, raf = 0, last = 0, running = true;
    let bubbles = [], bursts = [];
    const ptr = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }
    function spawn(fromBottom) {
      const r = 7 + Math.random() * (innerWidth < 720 ? 34 : 52);
      return {
        x: Math.random() * W,
        y: fromBottom ? H + r + Math.random() * H * .3 : Math.random() * H,
        r,
        vy: 9 + Math.random() * 22,       // px/s w górę
        ph: Math.random() * 6.28,          // faza chybotania
        fq: .4 + Math.random() * .7,
        amp: 8 + Math.random() * 22,
        sp: (Math.random() * 3) | 0,
        a: .35 + Math.random() * .45,
        px: 0,
      };
    }
    function seed() {
      const target = Math.max(6, Math.min(26, Math.round((W * H) / 90000 * density)));
      bubbles = Array.from({ length: target }, () => spawn(false));
    }
    function draw(t) {
      const dt = Math.min((t - last) / 1000, .05); last = t;
      ctx.clearRect(0, 0, W, H);
      for (const b of bubbles) {
        b.y -= b.vy * dt;
        b.ph += b.fq * dt;
        const wob = Math.sin(b.ph) * b.amp * .01 * b.r;
        // delikatne odpychanie od kursora
        const dx = (b.x + wob) - ptr.x, dy = b.y - ptr.y;
        const d2 = dx * dx + dy * dy, R = 140 + b.r;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 60 * dt;
          b.px += (dx / d) * f;
        }
        b.px *= .94;
        if (b.y < -b.r * 2) Object.assign(b, spawn(true));
        const s = sprites[b.sp], sz = b.r * 2;
        ctx.globalAlpha = b.a;
        ctx.drawImage(s, b.x + wob + b.px - b.r, b.y - b.r, sz, sz);
      }
      // pęknięcia
      for (let i = bursts.length - 1; i >= 0; i--) {
        const p = bursts[i];
        p.t += dt;
        const k = p.t / .45;
        if (k >= 1) { bursts.splice(i, 1); continue; }
        ctx.globalAlpha = (1 - k) * .8;
        ctx.strokeStyle = 'rgba(255,255,255,.9)';
        ctx.lineWidth = 1.6;
        for (let j = 0; j < 7; j++) {
          const a = j / 7 * 6.28 + p.seed;
          const rr = p.r * (0.6 + k * 1.5);
          ctx.beginPath();
          ctx.arc(p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr, Math.max(.8, p.r * .09 * (1 - k)), 0, 7);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      if (running && !reduced) raf = requestAnimationFrame(draw);
    }
    function onMove(e) { ptr.x = e.clientX; ptr.y = e.clientY; }
    function onClick(e) {
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        const dx = e.clientX - b.x, dy = e.clientY - b.y;
        if (dx * dx + dy * dy < b.r * b.r * 1.4) {
          bursts.push({ x: b.x, y: b.y, r: b.r, t: 0, seed: Math.random() * 6 });
          Object.assign(b, spawn(true));
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
    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('click', onClick);
    document.addEventListener('visibilitychange', onVis);
    last = performance.now();
    if (reduced) draw(last + 16); // jedna statyczna klatka
    else raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density]);

  return <canvas id="foam-bubbles" ref={ref} aria-hidden="true" />;
}
