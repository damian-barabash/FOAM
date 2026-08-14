import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Bubbles from './components/Bubbles.jsx';
import { trackPageview } from './lib/analytics.js';
import { initSmooth, setSmoothEnabled } from './lib/smooth.js';

import Home from './pages/Home.jsx';
import Podejscie from './pages/Podejscie.jsx';
import Oferta from './pages/Oferta.jsx';
import Raport from './pages/Raport.jsx';
import RaportPelny from './pages/RaportPelny.jsx';
import Insighty from './pages/Insighty.jsx';
import InsightPost from './pages/InsightPost.jsx';
import CaseStudies from './pages/CaseStudies.jsx';
import Ekosystem from './pages/Ekosystem.jsx';
import ONas from './pages/ONas.jsx';
import Kariera from './pages/Kariera.jsx';
import Kontakt from './pages/Kontakt.jsx';
import NotFound from './pages/NotFound.jsx';

const Admin = lazy(() => import('./admin/Admin.jsx'));

function usePageFx(pathname) {
  useEffect(() => { trackPageview(pathname); }, [pathname]);

  // reveal-on-scroll: JEDEN globalny observer + MutationObserver — sekcje
  // renderowane później (fetch insightów/case'ów) też są łapane. Bez tego
  // dynamiczne bloki zostawały z opacity:0 („puste bloki").
  // Nagłówki h1/h2 dzielimy na słowa (wjazd spod maski ze staggerem);
  // elementy z gotowym .in (hero) są „przezbrajane", żeby wejście zagrało po load.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.rv').forEach((e) => e.classList.add('in'));
      return;
    }
    const splitWords = (el) => {
      if ([...el.childNodes].some((n) => n.nodeType !== 3)) return; // tylko czysty tekst
      const words = el.textContent.split(/\s+/).filter(Boolean);
      if (!words.length || words.length > 14) return;
      el.textContent = '';
      words.forEach((w, i) => {
        const s = document.createElement('span');
        s.className = 'split-w';
        s.style.setProperty('--wi', i);
        const inner = document.createElement('i');
        inner.textContent = w;
        s.appendChild(inner);
        el.appendChild(s);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    const arm = (el) => {
      // część jednorazowa (split + snap-hide) za flagą; obserwacja ZAWSZE —
      // efekt potrafi się przemontować (StrictMode/dev) i nowy observer musi
      // przejąć już uzbrojone, wciąż ukryte elementy, inaczej zostają niewidoczne
      if (!el.dataset.rvArmed) {
        el.dataset.rvArmed = '1';
        if (el.closest('.adm')) { el.classList.add('in'); return; } // panel: bez teatru
        // ukrycie MUSI być natychmiastowe (bez transition) — inaczej przy
        // odświeżeniu strony gra "animacja chowania" na elementach z gotowym .in
        el.classList.add('rv-snap');
        if (el.matches('h1, h2')) splitWords(el);
        el.classList.remove('in');
        void el.offsetWidth; // reflow: stan ukryty aplikuje się od razu
        el.classList.remove('rv-snap');
      }
      if (!el.classList.contains('in')) io.observe(el);
    };
    const scan = () => document.querySelectorAll('.rv').forEach(arm);
    scan();
    let t = 0;
    const mo = new MutationObserver(() => { clearTimeout(t); t = setTimeout(scan, 60); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { clearTimeout(t); io.disconnect(); mo.disconnect(); };
  }, []);
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  usePageFx(pathname);

  // bardzo płynny scroll (Lenis); w panelu wyłączony
  useEffect(() => {
    if (!isAdmin) initSmooth();
    setSmoothEnabled(!isAdmin);
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="admin-loading mono">ładowanie panelu…</div>}>
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <Bubbles />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/podejscie" element={<Podejscie />} />
          <Route path="/oferta" element={<Oferta />} />
          <Route path="/raport" element={<Raport />} />
          <Route path="/raport/pelny" element={<RaportPelny />} />
          <Route path="/insighty" element={<Insighty />} />
          <Route path="/insighty/:slug" element={<InsightPost />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/ekosystem" element={<Ekosystem />} />
          <Route path="/o-nas" element={<ONas />} />
          <Route path="/kariera" element={<Kariera />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
