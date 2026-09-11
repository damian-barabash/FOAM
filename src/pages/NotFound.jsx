import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wipeTo } from '../components/wipe.js';
import Obj from '../components/Obj.jsx';

export default function NotFound() {
  const navigate = useNavigate();
  useEffect(() => { document.title = '404 — foam.media'; }, []);
  return (
    <section className="nf brand-field on-brand">
      <Obj name="search" style={{ width: 180 }} />
      <h1>404</h1>
      <p className="lead" style={{ textAlign: 'center' }}>ta bańka pękła — strony nie ma.<br />ale sygnał dotarł: wracaj na start.</p>
      <a className="btn btn-ghost-brand" href="/" onClick={(e) => { e.preventDefault(); wipeTo(navigate, '/'); }}>na start</a>
    </section>
  );
}
