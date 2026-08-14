import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { wipeTo } from './wipe.js';

const LINKS = [
  ['/podejscie', 'podejście'],
  ['/oferta', 'co robimy'],
  ['/insighty', 'insighty'],
  ['/case-studies', 'case studies'],
  ['/ekosystem', 'ekosystem'],
  ['/o-nas', 'o nas'],
  ['/kariera', 'kariera'],
  ['/kontakt', 'kontakt'],
];
const PRIMARY = LINKS.slice(0, 4).concat([LINKS[5]]);

// Morfing przy scrollu: na górze pełne menu; niżej logo płynie na środek,
// linki składają się do burgera (z lewej), CTA wlatuje z prawej.
export default function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 60);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (to) => (e) => { e.preventDefault(); setOpen(false); wipeTo(navigate, to); };

  return (
    <>
      <header className={'nav' + (scrolled ? ' scrolled' : '') + (open ? ' menu-open' : '')}>
        <div className="nav-in">
          <button
            className="nav-burger"
            aria-label={open ? 'zamknij menu' : 'otwórz menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span /><span />
          </button>
          <a className="nav-logo" href="/" onClick={go('/')} aria-label="foam.media — start">
            <img src="/assets/logo.svg" alt="FOAM.MEDIA" />
          </a>
          <nav className="nav-links" aria-label="menu główne">
            {PRIMARY.map(([to, label]) => (
              <a key={to} href={to} onClick={go(to)} className={pathname.startsWith(to) ? 'on' : ''}>{label}</a>
            ))}
          </nav>
          <div className="nav-cta">
            <a className="btn btn-ghost-brand nav-raport" href="/raport" onClick={go('/raport')}>pobierz raport</a>
          </div>
        </div>
      </header>

      <div className={'menu-full' + (open ? ' open' : '')} aria-hidden={!open}>
        <div className="menu-bubbles" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => <span key={i} className={'mb mb' + i} />)}
        </div>
        <nav className="menu-links" aria-label="pełne menu">
          {[['/', 'start'], ...LINKS, ['/raport', 'raport →']].map(([to, label], i) => (
            <a key={to} href={to} onClick={go(to)} style={{ transitionDelay: (0.05 + i * 0.035) + 's' }}
              className={pathname === to ? 'on' : ''}>{label}</a>
          ))}
        </nav>
        <div className="menu-meta mono">
          <span>info@foam.media</span>
          <span>built on media connections</span>
        </div>
      </div>
    </>
  );
}
