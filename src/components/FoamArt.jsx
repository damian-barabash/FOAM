import React, { useMemo } from 'react';

// Gęsta „piana" z małych baniek. shape decyduje, w co układa się chmura:
//  cloud  — organiczna chmura (domyślnie)
//  bars   — rosnące słupki wykresu (raport / dane)
//  arrow  — strzałka wzrostu
//  speech — dymek wypowiedzi (insighty / komunikacja)
//  venn   — dwa przecinające się koła (motyw logo / połączenia)
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const inRect = (x, y, x0, y0, x1, y1) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
function inTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const s = (ax - cx) * (py - cy) - (ay - cy) * (px - cx);
  const t = (bx - ax) * (py - ay) - (by - ay) * (px - ax);
  const u = (cx - bx) * (py - by) - (cy - by) * (px - bx);
  return (s >= 0 && t >= 0 && u >= 0) || (s <= 0 && t <= 0 && u <= 0);
}

const SHAPES = {
  bars: (x, y) =>
    inRect(x, y, 10, 58, 28, 86) ||
    inRect(x, y, 39, 40, 57, 86) ||
    inRect(x, y, 68, 16, 86, 86),
  arrow: (x, y) =>
    inRect(x, y, 43, 42, 59, 86) ||
    inTriangle(x, y, 27, 46, 75, 46, 51, 12),
  speech: (x, y) =>
    inRect(x, y, 12, 18, 88, 62) ||
    inCircle(x, y, 20, 26, 8) || inCircle(x, y, 80, 26, 8) ||
    inCircle(x, y, 20, 54, 8) || inCircle(x, y, 80, 54, 8) ||
    inTriangle(x, y, 28, 60, 46, 60, 34, 80),
  venn: (x, y) => inCircle(x, y, 36, 50, 25) || inCircle(x, y, 64, 50, 25),
};

export default function FoamArt({ seed = 7, n = 220, className = '', style, light = false, shape = 'cloud' }) {
  const { circles, gid } = useMemo(() => {
    const r = rng(seed * 7919 + shape.length);
    const g3 = () => (r() + r() + r()) / 3;
    const circles = [];
    const test = SHAPES[shape];

    if (!test) {
      // organiczna chmura
      const centers = Array.from({ length: 4 }, () => ({ x: 24 + r() * 52, y: 24 + r() * 52 }));
      for (let i = 0; i < n; i++) {
        const c = centers[i % centers.length];
        const x = c.x + (g3() - 0.5) * 58;
        const y = c.y + (g3() - 0.5) * 58;
        const big = r() < 0.07;
        circles.push({ x, y, r: big ? 4 + r() * 6 : 1.2 + r() * 3.2, o: 0.35 + r() * 0.55, hl: big || r() < 0.28 });
      }
    } else {
      // piana wypełniająca sylwetkę (rejection sampling)
      let placed = 0, guard = 0;
      const target = Math.max(n, 260);
      while (placed < target && guard < target * 40) {
        guard++;
        const x = r() * 100, y = r() * 100;
        if (!test(x, y)) continue;
        const big = r() < 0.05;
        circles.push({ x, y, r: big ? 3.2 + r() * 3 : 1 + r() * 2.4, o: 0.38 + r() * 0.55, hl: big || r() < 0.26 });
        placed++;
      }
    }
    // kilka baniek „uciekających"
    for (let i = 0; i < 7; i++) circles.push({ x: 4 + r() * 92, y: 4 + r() * 92, r: 0.9 + r() * 2, o: 0.5 + r() * 0.4, hl: false });
    return { circles, gid: `fg${seed}${shape}${light ? 'l' : 'd'}` };
  }, [seed, n, light, shape]);

  const stroke = light ? 'rgba(255,255,255,.55)' : 'rgba(112,152,222,.5)';
  const hlFill = 'rgba(255,255,255,.9)';

  return (
    <svg viewBox="0 0 100 100" className={'foam-art ' + className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={gid} cx="38%" cy="34%" r="66%">
          {light ? (
            <>
              <stop offset="0%" stopColor="rgba(255,255,255,.5)" />
              <stop offset="45%" stopColor="rgba(255,255,255,.07)" />
              <stop offset="100%" stopColor="rgba(255,255,255,.55)" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="rgba(255,255,255,.85)" />
              <stop offset="45%" stopColor="rgba(228,238,252,.3)" />
              <stop offset="100%" stopColor="rgba(112,152,222,.5)" />
            </>
          )}
        </radialGradient>
      </defs>
      {/* bańki w ~10 podgrupach — każda faluje własnym rytmem (żywa piana) */}
      {Array.from({ length: 10 }, (_, gi) => (
        <g
          key={gi}
          className="fa-g"
          style={{ '--fd': `${5.5 + (gi % 5) * 1.1}s`, animationDelay: `${gi * 0.45}s` }}
        >
          {circles.filter((_, i) => i % 10 === gi).map((b, i) => (
            <g
              key={i}
              opacity={b.o}
              className={i % 3 === 0 ? 'fa-p' : undefined}
              style={i % 3 === 0 ? { '--o': b.o, animationDelay: `${(i % 9) * 0.5}s`, animationDuration: `${3 + (i % 4)}s` } : undefined}
            >
              <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#${gid})`} stroke={stroke} strokeWidth=".28" />
              {b.hl && b.r > 2 ? (
                <circle cx={b.x - b.r * 0.32} cy={b.y - b.r * 0.36} r={b.r * 0.17} fill={hlFill} />
              ) : null}
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
