// Generator „aura": zernistye razmytye sinie gradienty (styl referencji ZERONODE) → public/assets/aura/a1..a8.webp
// Generator aur: npm i -D sharp (albo npx -y -p sharp node scripts/gen-aura.mjs)
import sharp from "sharp";
const W = 720, H = 900, OUT = new URL("../public/assets/aura/", import.meta.url).pathname;
const BG = '#f4f7fd', D = '#2340c4', M = '#4168ee', L = '#5ea0c6';
// kształty: [svg-shapes, tone, blur]
const V = {
  a1: { tone: 'light', blur: 55, s: `<ellipse cx="380" cy="330" rx="230" ry="230" fill="${D}"/><ellipse cx="300" cy="260" rx="330" ry="300" fill="${M}" opacity=".55"/><ellipse cx="520" cy="470" rx="150" ry="110" fill="${L}" opacity=".6"/>` },
  a2: { tone: 'light', blur: 48, s: `<path d="M-40 900 C 40 620, 160 560, 250 470 C 330 380, 300 250, 420 210 C 540 170, 600 300, 560 400 C 520 520, 430 560, 470 700 L 520 900 Z" fill="${D}"/><ellipse cx="420" cy="230" rx="120" ry="130" fill="${M}"/>` },
  a3: { tone: 'dark', blur: 60, s: `<rect width="${W}" height="${H}" fill="${D}"/><ellipse cx="420" cy="260" rx="170" ry="120" fill="#ffffff"/><ellipse cx="180" cy="420" rx="90" ry="70" fill="#ffffff" opacity=".9"/><ellipse cx="600" cy="500" rx="80" ry="60" fill="#ffffff" opacity=".8"/><ellipse cx="330" cy="90" rx="260" ry="90" fill="${L}" opacity=".5"/>` },
  a4: { tone: 'light', blur: 70, s: `<path d="M-100 700 C 150 600, 350 350, 820 250 L 820 -50 L -100 -50 Z" fill="${M}" opacity=".9"/><ellipse cx="560" cy="120" rx="240" ry="160" fill="${D}"/>` },
  a5: { tone: 'light', blur: 58, s: `<ellipse cx="200" cy="230" rx="170" ry="190" fill="${D}"/><ellipse cx="540" cy="380" rx="160" ry="150" fill="${M}"/><ellipse cx="380" cy="320" rx="90" ry="90" fill="${L}" opacity=".7"/>` },
  a6: { tone: 'dark', blur: 75, s: `<rect y="380" width="${W}" height="${H}" fill="${D}"/><ellipse cx="360" cy="430" rx="500" ry="180" fill="${M}"/><ellipse cx="200" cy="640" rx="160" ry="90" fill="${L}" opacity=".7"/><ellipse cx="560" cy="300" rx="140" ry="80" fill="#ffffff" opacity=".55"/>` },
  a7: { tone: "light", blur: 50, s: `<circle cx="360" cy="300" r="230" fill="${D}"/><circle cx="360" cy="300" r="110" fill="${BG}"/><ellipse cx="360" cy="300" rx="280" ry="270" fill="${L}" opacity=".35"/>` },
  a8: { tone: 'light', blur: 65, s: `<ellipse cx="640" cy="140" rx="300" ry="260" fill="${D}"/><ellipse cx="520" cy="60" rx="240" ry="160" fill="${M}" opacity=".8"/><ellipse cx="120" cy="760" rx="150" ry="110" fill="${L}" opacity=".55"/>` },
};
// ziarno: 1 kanał, wokół 128 (soft-light → subtelne)
function grain(amp) {
  const b = Buffer.alloc(W * H);
  for (let i = 0; i < b.length; i++) b[i] = Math.max(0, Math.min(255, 128 + (Math.random() - .5) * amp));
  return sharp(b, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
}
for (const [k, v] of Object.entries(V)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${BG}"/>${v.s}</svg>`;
  const base = await sharp(Buffer.from(svg)).blur(v.blur).toBuffer();
  const g = await grain(v.tone === 'dark' ? 120 : 95);
  await sharp(base).composite([{ input: g, blend: 'soft-light' }]).webp({ quality: 74 }).toFile(OUT + k + '.webp');
}
console.log('aura ok');
