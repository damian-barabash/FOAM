// Płynny scroll (Lenis). Wyłączony przy prefers-reduced-motion i w panelu.
import Lenis from 'lenis';

let lenis = null;

export function initSmooth() {
  if (lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis;
  lenis = new Lenis({ duration: 1.3, smoothWheel: true, touchMultiplier: 1.4 });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  return lenis;
}

export function setSmoothEnabled(on) {
  if (!lenis) return;
  if (on) lenis.start();
  else lenis.stop();
}
