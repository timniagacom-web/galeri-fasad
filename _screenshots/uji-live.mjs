// Cek situs live (GitHub Pages) via IP 185.199.108.153: publik terproteksi, internal tanpa proteksi
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const token = fs.readFileSync(new URL('../.internal-token', import.meta.url), 'utf8').trim();
const H = 'https://galeri.gambarexpress.id/';
const hs = fs.readdirSync(process.env.HOME + '/.cache/ms-playwright').find((d) => d.startsWith('chromium_headless_shell'));
const b = await chromium.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/${hs}/chrome-headless-shell-linux64/chrome-headless-shell`, args: ['--no-sandbox', '--host-resolver-rules=MAP galeri.gambarexpress.id 185.199.108.153'] });
for (const [nama, url, w] of [['live-publik-detail-1280', H + '#/fasad/GF-0012?palet=sage', 1280], ['live-publik-galeri-360', H + '#/galeri', 360], ['live-internal-detail-1280', `${H}int-${token}/#/fasad/GF-0012?palet=sage`, 1280]]) {
  const p = await b.newPage({ viewport: { width: w, height: w < 600 ? 800 : 900 } });
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({ img: document.querySelectorAll('.img-wrap img').length, bg: document.querySelectorAll('.gf-bg.is-siap').length, shield: document.querySelectorAll('.gf-shield').length, banner: !!document.querySelector('.gf-internal-banner') }));
  console.log(nama, JSON.stringify(r));
  await p.screenshot({ path: `${dir}${nama}.png` });
  await p.close();
}
await b.close();
