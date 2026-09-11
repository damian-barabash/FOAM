// Konwersja piennych ikon PNG (PROJEKTY/FOAM/IMG) → public/assets/icons/*.webp. Wymaga: npm i -D sharp
// UWAGA: w sharp resize wykonuje się PRZED trim/extend w jednym pipeline — dlatego trim jest osobnym przebiegiem, a resize ma fit:'contain'.
import sharp from 'sharp';
import fs from 'node:fs';
const src = '/Users/dmytrii/Desktop/PROJEKTY/FOAM/IMG/';
const out = new URL('../public/assets/icons/', import.meta.url).pathname;
const files = fs.readdirSync(src).filter(f => f.endsWith('.png')).sort();
const names = ['pie', 'gear', 'speech', 'target', 'cursor', 'shield', 'bulb', 'search', 'rocket', 'growth', 'bell', 'heart', 'bars'];
const T = { r: 0, g: 0, b: 0, alpha: 0 };
for (let i = 0; i < files.length; i++) {
  if (names[i] === 'bell') continue;
  // 1) przytnij po alfie (osobny przebieg — w sharp resize idzie PRZED extend/trim w jednym pipeline)
  const trimmed = await sharp(src + files[i]).trim({ threshold: 8 }).toBuffer();
  // 2) wpasuj (contain, bez kadrowania) w 680² i dodaj 20px marginesu → 720²
  await sharp(trimmed)
    .resize({ width: 680, height: 680, fit: 'contain', background: T })
    .extend({ top: 20, bottom: 20, left: 20, right: 20, background: T })
    .webp({ quality: 76, alphaQuality: 88 }).toFile(out + names[i] + '.webp');
  const m = await sharp(out + names[i] + '.webp').metadata();
  console.log(names[i].padEnd(7), m.width + 'x' + m.height, (fs.statSync(out + names[i] + '.webp').size / 1024).toFixed(0) + ' KB');
}
