import React, { useEffect } from 'react';
import { LineChart, BarsH, StatTile } from '../components/Charts.jsx';
import FoamArt from '../components/FoamArt.jsx';

// Pełny raport online (link z maila po zostawieniu adresu). noindex.
const INDEX_2025 = [42, 48, 47, 55, 61, 58, 67, 74, 79, 88, 96, 108];
const MONTHS = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
const ATTENTION = [
  { label: 'short-video (feed)', v: 63 },
  { label: 'twórcy / influencerzy', v: 48 },
  { label: 'podcasty i audio', v: 31 },
  { label: 'newslettery / DM', v: 27 },
  { label: 'display / programmatic', v: 14 },
  { label: 'tv linearna', v: 11 },
];
const RELACYJNE = [
  { label: 'zapamiętanie przekazu', v: 42 },
  { label: 'deklarowane zaufanie', v: 37 },
  { label: 'CTR / interakcje', v: 29 },
  { label: 'koszt dotarcia (spadek)', v: 24 },
];

export default function RaportPelny() {
  useEffect(() => {
    document.title = 'raport: suma małych sygnałów — foam.media';
    const m = document.createElement('meta');
    m.name = 'robots'; m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  return (
    <div className="page-raport-pelny">
      <section className="page-hero brand-field on-brand">
        <div className="wrap">
          <div className="eyebrow rv in">raport foam.media · edycja 2026 · wersja online</div>
          <h1 className="h-xl rv in">suma małych sygnałów.</h1>
          <p className="lead rv in rv-d1">jak wybrzmiewają marki w polskich mediach. dane: 120 kampanii, 2024–2025. wersja przykładowa — pełne wydanie w przygotowaniu.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid4">
            <div className="card rv"><StatTile num="+157%" label="wzrost indeksu rezonansu" sub="marki „signal-first” r/r" /></div>
            <div className="card rv rv-d1"><StatTile num="63%" label="uwagi z małych formatów" sub="ekspozycja < 15 sekund" /></div>
            <div className="card rv rv-d2"><StatTile num="4,2×" label="zwrot z mediów relacyjnych" sub="vs zakup programmatic" /></div>
            <div className="card rv rv-d3"><StatTile num="120" label="kampanii w próbie" sub="polski rynek" /></div>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow rv">rozdział 01</div>
              <h2 className="h-lg rv">indeks rezonansu 2025.</h2>
            </div>
            <p className="lead rv rv-d1">indeks łączy brand lift, attention i sentyment w jedną miarę (100 = mediana rynku w styczniu). marki planujące media jako sumę małych sygnałów rosły przez cały rok.</p>
          </div>
          <div className="card rv" style={{ padding: 28 }}>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 14 }}>indeks rezonansu · średnia dla marek „signal-first” · 2025</div>
            <LineChart data={INDEX_2025} labels={MONTHS} height={260} ariaLabel="indeks rezonansu rósł z 42 w styczniu do 108 w grudniu 2025" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid2" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow rv">rozdział 02</div>
            <h2 className="h-lg rv">gdzie mieszka uwaga.</h2>
            <p className="lead rv rv-d1" style={{ marginTop: 16 }}>udział kanałów w budowaniu zapamiętanej uwagi (attention share, %). małe sygnały — short-video, twórcy, DM-y — niosą dziś większość rezonansu.</p>
          </div>
          <div className="card rv rv-d1" style={{ padding: 28 }}>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 16 }}>attention share · % zapamiętanej uwagi</div>
            <BarsH items={ATTENTION} unit="%" ariaLabel="short-video 63%, twórcy 48%, podcasty 31%, newslettery 27%, display 14%, tv 11%" />
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap grid2" style={{ alignItems: 'flex-start' }}>
          <div className="card rv" style={{ padding: 28, order: 0 }}>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 16 }}>media relacyjne vs programmatic · przewaga w %</div>
            <BarsH items={RELACYJNE} unit="%" ariaLabel="zapamiętanie +42%, zaufanie +37%, interakcje +29%, koszt dotarcia -24%" />
          </div>
          <div>
            <div className="eyebrow rv">rozdział 03</div>
            <h2 className="h-lg rv">siła połączeń.</h2>
            <p className="lead rv rv-d1" style={{ marginTop: 16 }}>kampanie, w których media kupowano relacyjnie (bezpośrednie partnerstwa z redakcjami i twórcami), wygrywają z czystym programmatic w każdej mierzonej kategorii.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap article">
          <div className="eyebrow rv">wnioski</div>
          <div className="article-body rv rv-d1">
            <h2>sześć rzeczy, które warto zabrać z tego raportu</h2>
            <p><b>1. planuj sygnały, nie spoty.</b> pojedyncza duża emisja przegrywa z sekwencją małych, dobrze zaadresowanych sygnałów — w zapamiętaniu i w koszcie.</p>
            <p><b>2. lekkość wygrywa.</b> formaty poniżej 15 sekund odpowiadają za 63% zapamiętanej uwagi. przekaz musi umieć mówić szeptem.</p>
            <p><b>3. połączenia to media.</b> relacyjny zakup mediów daje 4,2× wyższy zwrot niż zakup czysto programatyczny.</p>
            <p><b>4. twórcy są kanałem, nie dodatkiem.</b> planuj ich jak media: z zasięgiem, częstotliwością i pomiarem.</p>
            <p><b>5. mierz rezonans.</b> zasięg mówi, że coś poleciało. rezonans — że coś zostało.</p>
            <p><b>6. rytm > moment.</b> marki obecne stale małymi sygnałami rosną szybciej niż te od kampanii do kampanii.</p>
            <blockquote>siła przekazu to suma małych sygnałów. łączymy je w całość, by nowoczesne kampanie mogły wybrzmiewać.</blockquote>
            <p className="mono" style={{ color: 'var(--ink-3)' }}>metodologia: indeks rezonansu foam.media łączy wyniki badań brand lift (n=120 kampanii), pomiar attention (eye-tracking panelowy) i analizę sentymentu. dane przykładowe do celów poglądowych — pełna metodologia w wydaniu drukowanym.</p>
          </div>
        </div>
      </section>

      <section className="band brand-field on-brand">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <FoamArt seed={9} n={10} light style={{ width: 130, margin: '0 auto 18px' }} />
          <h2 className="h-lg rv" style={{ margin: '0 auto' }}>porozmawiajmy o twoich sygnałach.</h2>
          <div className="hero-ctas rv rv-d1" style={{ justifyContent: 'center' }}>
            <a className="btn btn-white" href="/kontakt">napisz do nas</a>
          </div>
        </div>
      </section>
    </div>
  );
}
