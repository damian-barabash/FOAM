// Przejście między stronami: gradientowa fala + bańki + logo (wzorzec FIQ wipe).
let busy = false;

function ensureOverlay() {
  let el = document.getElementById('foam-wipe');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'foam-wipe';
  el.innerHTML = `<div class="wipe-bubbles"></div><img class="wipe-logo" src="/assets/logo.svg" alt="">`;
  document.body.appendChild(el);
  return el;
}

export function wipeTo(navigate, to) {
  if (busy) return;
  if (location.pathname === to) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { navigate(to); return; }
  busy = true;
  const el = ensureOverlay();
  const bl = el.querySelector('.wipe-bubbles');
  bl.innerHTML = Array.from({ length: 12 }, () => {
    const s = 14 + Math.random() * 70;
    return `<span class="wb" style="left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-delay:${Math.random() * .25}s;animation-duration:${.7 + Math.random() * .5}s"></span>`;
  }).join('');
  el.classList.remove('leave');
  el.classList.add('cover');
  setTimeout(() => {
    navigate(to);
    scrollTo(0, 0);
    setTimeout(() => {
      el.classList.add('leave');
      el.classList.remove('cover');
      setTimeout(() => { el.classList.remove('leave'); busy = false; }, 460);
    }, 240);
  }, 430);
}
