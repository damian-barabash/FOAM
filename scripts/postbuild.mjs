// SPA-fallback dla GitHub Pages: 404.html = kopia index.html
import { copyFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
console.log('postbuild: dist/404.html created');
