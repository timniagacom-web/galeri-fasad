// Uji proteksi build publik vs internal pada folder deploy-out (npm run preview:deploy → http://127.0.0.1:4175)
import { chromium } from 'playwright-core';
const _fs = await import('node:fs');
const _dk = JSON.parse(_fs.readFileSync(new URL('../src/data/dikecualikan.json', import.meta.url), 'utf8'));
const N_JAPANDI = _fs.readFileSync(new URL('../src/data/fasad.ts', import.meta.url), 'utf8').split('\n')
  .filter((l) => /^  \{ id: "GF-/.test(l) && l.includes('gaya: "japandi"'))
  .filter((l) => !_dk.id.includes(l.match(/GF-\d{4}/)[0]) && !_dk.batch.includes(Number((l.match(/batch: (\d+)/) ?? [0, 1])[1]))).length;
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const token = fs.readFileSync(new URL('../.internal-token', import.meta.url), 'utf8').trim();
const BASE = 'http://127.0.0.1:4175/';
const INT = `http://127.0.0.1:4176/int-${token}/`;
const hs = fs.readdirSync(process.env.HOME + '/.cache/ms-playwright').find((d) => d.startsWith('chromium_headless_shell'));
const browser = await chromium.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/${hs}/chrome-headless-shell-linux64/chrome-headless-shell`, args: ['--no-sandbox'] });
const hasil = [];
const cek = (nama, ok, info = '') => hasil.push(`${ok ? 'LULUS' : 'GAGAL'}  ${nama}${info ? ' — ' + info : ''}`);

const tunggu = (pg) => pg.waitForFunction(() => document.querySelectorAll('.gf-bg.is-siap, .img-wrap img').length > 0, null, { timeout: 15000 });
const prevented = (pg, js) => pg.evaluate(js);
const evKey = (key, opt = {}) => `(() => { const e = new KeyboardEvent('keydown', { key: ${JSON.stringify(key)}, bubbles: true, cancelable: true, ...${JSON.stringify(opt)} }); window.dispatchEvent(e); return e.defaultPrevented; })()`;
const evCtx = `(() => { const t = document.querySelector('.img-wrap .gf-shield') || document.querySelector('.img-wrap img'); const e = new MouseEvent('contextmenu', { bubbles: true, cancelable: true }); t.dispatchEvent(e); return e.defaultPrevented; })()`;
const evDrag = `(() => { const t = document.querySelector('.img-wrap .gf-shield') || document.querySelector('.img-wrap img'); const e = new DragEvent('dragstart', { bubbles: true, cancelable: true }); t.dispatchEvent(e); return e.defaultPrevented; })()`;
const overflow = (pg) => pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

for (const w of [1280, 360]) {
  // ---------- PUBLIK ----------
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 800 : 900 } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push(String(e)));
  await pg.goto(BASE + '#/galeri'); await tunggu(pg); await pg.waitForTimeout(800);
  const imgPolos = await pg.locator('.img-wrap img').count();
  const bg = await pg.evaluate(() => getComputedStyle(document.querySelector('.gf-bg.is-siap')).backgroundImage);
  cek(`[publik ${w}] gambar sebagai background, tanpa <img>`, imgPolos === 0 && /\/g\/[a-f0-9]{20}\.webp/.test(bg), `img=${imgPolos}, bg=${bg.replace(BASE, '/')}`);
  cek(`[publik ${w}] klik kanan di gambar diblokir`, await prevented(pg, evCtx));
  cek(`[publik ${w}] drag gambar diblokir`, await prevented(pg, evDrag));
  for (const [k, o, n] of [['s', { ctrlKey: true }, 'Ctrl+S'], ['u', { ctrlKey: true }, 'Ctrl+U'], ['p', { ctrlKey: true }, 'Ctrl+P'], ['F12', {}, 'F12'], ['i', { ctrlKey: true, shiftKey: true }, 'Ctrl+Shift+I'], ['s', { metaKey: true }, 'Cmd+S']])
    cek(`[publik ${w}] ${n} diblokir`, await prevented(pg, evKey(k, o)));
  cek(`[publik ${w}] lapisan transparan + watermark overlay ada`, (await pg.locator('.img-wrap .gf-shield').count()) > 0 && (await pg.locator('.img-wrap .gf-wm').count()) > 0);
  cek(`[publik ${w}] tanpa scroll horizontal`, !(await overflow(pg)));
  if (w === 1280) await pg.screenshot({ path: `${dir}proteksi-publik-galeri-1280.png` });
  // filter tetap jalan
  await pg.goto(BASE + '#/galeri?gaya=japandi'); await pg.waitForTimeout(500);
  cek(`[publik ${w}] filter tetap berfungsi`, new RegExp(`\\b${N_JAPANDI} fasad`).test(await pg.textContent('.toolbar__count')), await pg.textContent('.toolbar__count'));
  // klik kartu (lewat lapisan pelindung) membuka detail
  await pg.locator('.card .card__link').first().click(); await pg.waitForTimeout(500);
  cek(`[publik ${w}] klik gambar kartu tetap membuka detail`, /#\/fasad\/GF-/.test(pg.url()), pg.url().replace(BASE, '/'));
  // detail + PaletPicker
  await pg.goto(BASE + '#/fasad/GF-0012'); await tunggu(pg); await pg.waitForTimeout(600);
  const bg1 = await pg.evaluate(() => getComputedStyle(document.querySelector('.img-layer:not(.is-prev)')).backgroundImage);
  await pg.click('.swatch[aria-label*="Sage"]'); await pg.waitForTimeout(1200);
  const bg2 = await pg.evaluate(() => getComputedStyle(document.querySelector('.img-layer:not(.is-prev)')).backgroundImage);
  cek(`[publik ${w}] PaletPicker mengganti gambar`, bg1 !== bg2 && /\/g\//.test(bg2) && pg.url().includes('palet=sage'));
  const wa = decodeURIComponent((await pg.getAttribute('.detail__wa', 'href')) || '');
  cek(`[publik ${w}] CTA WhatsApp utuh`, wa.startsWith('https://wa.me/12059971193') && wa.includes('varian Sage pastel'));
  cek(`[publik ${w}] tanpa scroll horizontal (detail)`, !(await overflow(pg)));
  await pg.screenshot({ path: `${dir}proteksi-publik-detail-${w}.png` });
  // blur saat jendela tidak fokus
  await pg.evaluate(() => window.dispatchEvent(new Event('blur'))); await pg.waitForTimeout(400);
  const blurOn = await pg.evaluate(() => document.body.classList.contains('gf-blur') && getComputedStyle(document.querySelector('.img-layer:not(.is-prev)')).filter.includes('blur'));
  cek(`[publik ${w}] gambar disamarkan saat jendela blur`, blurOn);
  if (w === 1280) await pg.screenshot({ path: `${dir}proteksi-blur-1280.png` });
  await pg.evaluate(() => window.dispatchEvent(new Event('focus'))); await pg.waitForTimeout(300);
  cek(`[publik ${w}] kembali normal saat fokus`, !(await pg.evaluate(() => document.body.classList.contains('gf-blur'))));
  // PrintScreen
  await pg.evaluate(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'PrintScreen', bubbles: true }))); await pg.waitForTimeout(200);
  const hideOn = await pg.evaluate(() => getComputedStyle(document.querySelector('.img-layer:not(.is-prev)')).visibility === 'hidden');
  cek(`[publik ${w}] PrintScreen → gambar disembunyikan sementara`, hideOn);
  if (w === 1280) await pg.screenshot({ path: `${dir}proteksi-printscreen-1280.png` });
  await pg.waitForTimeout(2800);
  // Cmd+Shift
  await pg.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '4', metaKey: true, shiftKey: true, bubbles: true }))); await pg.waitForTimeout(150);
  cek(`[publik ${w}] Cmd+Shift → gambar disembunyikan sementara`, await pg.evaluate(() => document.body.classList.contains('gf-hide')));
  await pg.waitForTimeout(3200);
  // @media print
  await pg.emulateMedia({ media: 'print' }); await pg.waitForTimeout(200);
  cek(`[publik ${w}] @media print menyembunyikan gambar`, await pg.evaluate(() => getComputedStyle(document.querySelector('.img-layer')).display === 'none'));
  if (w === 1280) await pg.screenshot({ path: `${dir}proteksi-print-1280.png` });
  await pg.emulateMedia({ media: 'screen' });
  // tidak ada jejak internal di halaman publik
  const html = await pg.content();
  cek(`[publik ${w}] tidak ada token/tautan internal di DOM`, !html.includes(token) && !html.includes('int-'));
  cek(`[publik ${w}] tanpa error JS`, errs.length === 0, errs.join(' | '));
  await ctx.close();

  // ---------- INTERNAL ----------
  const ic = await browser.newContext({ viewport: { width: w, height: w < 600 ? 800 : 900 } });
  const ip = await ic.newPage();
  const ierrs = [];
  ip.on('pageerror', (e) => ierrs.push(String(e)));
  await ip.goto(INT + '#/fasad/GF-0012'); await tunggu(ip); await ip.waitForTimeout(800);
  const src = await ip.evaluate(() => document.querySelector('.img-wrap img')?.currentSrc ?? '');
  cek(`[internal ${w}] <img> asli tanpa watermark (img/GF-*)`, /\/img\/(thumb\/)?GF-0012\.webp$/.test(src), src.replace(token, '<token>'));
  cek(`[internal ${w}] banner internal tampil`, (await ip.locator('.gf-internal-banner').count()) === 1);
  cek(`[internal ${w}] klik kanan TIDAK diblokir`, !(await prevented(ip, evCtx)));
  cek(`[internal ${w}] Ctrl+S TIDAK diblokir`, !(await prevented(ip, evKey('s', { ctrlKey: true }))));
  cek(`[internal ${w}] tanpa overlay/watermark CSS`, (await ip.locator('.gf-shield, .gf-wm').count()) === 0);
  await ip.click('.swatch[aria-label*="Sage"]'); await ip.waitForTimeout(1000);
  cek(`[internal ${w}] PaletPicker jalan`, /GF-0012-sage\.webp$/.test(await ip.evaluate(() => document.querySelector('.img-layer:not(.is-prev)')?.currentSrc ?? '')));
  const robots = await ip.getAttribute('meta[name="robots"]', 'content');
  cek(`[internal ${w}] meta noindex`, /noindex/.test(robots ?? ''), robots ?? '');
  await ip.screenshot({ path: `${dir}internal-detail-${w}.png` });
  if (w === 1280) { await ip.goto(INT + '#/galeri'); await ip.waitForTimeout(1200); await ip.screenshot({ path: `${dir}internal-galeri-1280.png` }); }
  cek(`[internal ${w}] tanpa error JS`, ierrs.length === 0, ierrs.join(' | '));
  await ic.close();
}
await browser.close();
console.log(hasil.join('\n'));
console.log(`\n${hasil.filter((h) => h.startsWith('LULUS')).length}/${hasil.length} lulus`);
