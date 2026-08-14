import React, { useEffect, useMemo, useState } from 'react';
import { sbAuth } from '../lib/supabase.js';
import { LineChart, BarsH } from '../components/Charts.jsx';

// Analityka: odsłony z analytics_events, agregacja po stronie klienta.
const RANGES = [[7, '7 dni'], [30, '30 dni'], [90, '90 dni']];

export default function AnalyticsTab() {
  const [days, setDays] = useState(30);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    setEvents(null);
    const since = new Date(Date.now() - days * 864e5).toISOString();
    sbAuth().from('analytics_events')
      .select('path,ref,mobile,vid,created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true })
      .limit(20000)
      .then(({ data }) => setEvents(data || []));
  }, [days]);

  const agg = useMemo(() => {
    if (!events) return null;
    const perDay = new Map();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      perDay.set(d.toISOString().slice(0, 10), 0);
    }
    const pages = new Map(), refs = new Map(), uniq = new Set();
    let mobile = 0;
    events.forEach((e) => {
      const day = e.created_at.slice(0, 10);
      if (perDay.has(day)) perDay.set(day, perDay.get(day) + 1);
      pages.set(e.path, (pages.get(e.path) || 0) + 1);
      if (e.ref) refs.set(e.ref, (refs.get(e.ref) || 0) + 1);
      if (e.vid) uniq.add(e.vid);
      if (e.mobile) mobile++;
    });
    const labels = [...perDay.keys()].map((d) => d.slice(8) + '.' + d.slice(5, 7));
    const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, v]) => ({ label, v }));
    return {
      total: events.length,
      uniq: uniq.size,
      mobilePct: events.length ? Math.round((mobile / events.length) * 100) : 0,
      series: [...perDay.values()],
      labels,
      pages: top(pages, 8),
      refs: top(refs, 6),
    };
  }, [events, days]);

  return (
    <div className="adm-ana">
      <div className="adm-filters">
        {RANGES.map(([d, l]) => (
          <button key={d} className={'adm-btn' + (days === d ? ' primary' : '')} onClick={() => setDays(d)}>{l}</button>
        ))}
      </div>
      {!agg ? <div className="mono adm-dim">ładowanie…</div> : (
        <>
          <div className="adm-crm-stats">
            <div className="adm-stat"><b>{agg.total.toLocaleString('pl-PL')}</b><span>odsłon</span></div>
            <div className="adm-stat"><b>{agg.uniq.toLocaleString('pl-PL')}</b><span>unikalnych gości</span></div>
            <div className="adm-stat"><b>{agg.mobilePct}%</b><span>ruchu z mobile</span></div>
            <div className="adm-stat"><b>{agg.pages.length ? agg.pages[0].label : '—'}</b><span>najczęstsza strona</span></div>
          </div>
          <div className="adm-card">
            <div className="mono adm-dim" style={{ marginBottom: 12 }}>odsłony dziennie · ostatnie {days} dni</div>
            <LineChart data={agg.series} labels={agg.labels} height={200} ariaLabel={`odsłony dziennie za ${days} dni`} />
          </div>
          <div className="adm-ana-grid">
            <div className="adm-card">
              <div className="mono adm-dim" style={{ marginBottom: 12 }}>najpopularniejsze strony</div>
              {agg.pages.length ? <BarsH items={agg.pages} ariaLabel="odsłony per strona" /> : <div className="mono adm-dim">brak danych</div>}
            </div>
            <div className="adm-card">
              <div className="mono adm-dim" style={{ marginBottom: 12 }}>źródła (referrer)</div>
              {agg.refs.length ? <BarsH items={agg.refs} ariaLabel="wejścia per źródło" /> : <div className="mono adm-dim">wejścia bezpośrednie</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
