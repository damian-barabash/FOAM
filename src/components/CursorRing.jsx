import React, { useEffect, useRef } from 'react';

// Kursor-bańka (lerp za myszą, rośnie nad interakcjami) + magnetyczne przyciski.
// Tylko desktop (hover: hover); mix-blend-difference → widoczny na każdym tle.
export default function CursorRing() {
  const ref = useRef(null);

  useEffect(() => {
    if (matchMedia('(hover: none)').matches) return;
    const el = ref.current;
    if (!el) return;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    let lastBtn = null;
    let ranges = [];
    const computeRanges = () => {
      ranges = Array.from(document.querySelectorAll('.brand-field')).map((s) => {
        const r = s.getBoundingClientRect();
        return [r.top + scrollY, r.bottom + scrollY];
      });
    };
    computeRanges();
    const rangeTimer = setInterval(computeRanges, 900);

    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      // magnes: przycisk delikatnie ciągnie się do kursora
      const btn = e.target.closest ? e.target.closest('.btn') : null;
      if (lastBtn && lastBtn !== btn) { lastBtn.style.transform = ''; lastBtn = null; }
      if (btn) {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = `translate(${(dx * 10).toFixed(1)}px, ${(dy * 7).toFixed(1)}px)`;
        lastBtn = btn;
      }
    };
    const onOver = (e) => {
      const hot = e.target.closest && e.target.closest('a, button, .cb-bubble, .rl-row, [contenteditable="true"]');
      el.classList.toggle('big', !!hot);
    };
    const loop = () => {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      el.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`;
      // na niebieskim polu biały, na białym — niebieski
      const yDoc = cy + scrollY;
      let brand = false;
      for (const [a, b] of ranges) if (yDoc >= a && yDoc <= b) { brand = true; break; }
      el.classList.toggle('on-white', !brand);
      raf = requestAnimationFrame(loop);
    };
    // klik gdziekolwiek = pęknięcie i ponowne "narodziny" pierścienia
    const onClick = () => {
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
      clearTimeout(onClick._t);
      onClick._t = setTimeout(() => el.classList.remove('pop'), 560);
    };
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerover', onOver, true);
    addEventListener('click', onClick, true);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(rangeTimer);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerover', onOver, true);
      removeEventListener('click', onClick, true);
      if (lastBtn) lastBtn.style.transform = '';
    };
  }, []);

  return (
    <div id="cursor-ring" ref={ref} aria-hidden="true">
      <span />
      {Array.from({ length: 8 }, (_, k) => <i key={k} style={{ '--a': `${k * 45}deg` }} />)}
    </div>
  );
}
