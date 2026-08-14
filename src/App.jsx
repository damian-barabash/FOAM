import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Bubbles from './components/Bubbles.jsx';
import { trackPageview } from './lib/analytics.js';

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
  useEffect(() => {
    trackPageview(pathname);
    // reveal-on-scroll dla świeżo wyrenderowanej strony
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.rv:not(.in)');
      if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      els.forEach((e) => io.observe(e));
      usePageFx._io && usePageFx._io.disconnect();
      usePageFx._io = io;
    }, 60);
    return () => clearTimeout(t);
  }, [pathname]);
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  usePageFx(pathname);

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
