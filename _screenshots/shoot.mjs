import { chromium } from 'playwright-core';
import fs from 'node:fs';
const base = 'http://127.0.0.1:4173/';
const dir = new URL('.', import.meta.url).pathname;
const pages = { beranda: '#/', galeri: '#/galeri', detail: '#/fasad/GF-0009' };
const extra = ['#/gaya/bugis-kontemporer', '#/bandingkan?ids=GF-0001,GF-0002,GF-0003', '#/kontraktor', '#/tentang', '#/disimpan', '#/xyz', '#/galeri?tipe=90&lebar=12'];
const hs = fs.readdirSync(process.env.HOME + '/.cache/ms-playwright').find((d) => d.startsWith('chromium_headless_shell'));
const exe = `${process.env.HOME}/.cache/ms-playwright/${hs}/chrome-headless-shell-linux64/chrome-headless-shell`;
const browser = await chromium.launch({ executablePath: fs.existsSync(exe) ? exe : '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const report = [];
const cekOverflow = (pg) => pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
const cekTap = (pg) => pg.evaluate(() => [...document.querySelectorAll('a,button,input,label.check')].filter((e) => {
  const r = e.getBoundingClientRect(); const st = getComputedStyle(e);
  if (!r.width || st.visibility === 'hidden' || e.closest('.sr-only,.skip,.filters:not(.is-open)')) return false;
  if (e.tagName === 'INPUT' && e.closest('label')) return false;
  if (e.closest('.prose p, .footer__disclaimer, p.lead')) return false;
  return r.height < 44 || r.width < 44;
}).map((e) => `${e.tagName}.${e.className}:${(e.textContent||'').trim().slice(0,25)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`));
for (const w of [360, 375, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 800 : 900 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errs.push(m.text()));
  pg.on('pageerror', (e) => errs.push(String(e)));
  for (const [nama, h] of [...Object.entries(pages), ...extra.map((h) => [h, h])]) {
    await pg.goto(base + h); await pg.reload(); await pg.waitForTimeout(500);
    const o = await cekOverflow(pg); const tap = await cekTap(pg);
    report.push({ w, page: nama, overflow: o.sw > o.cw ? `${o.sw}>${o.cw}` : 'ok', smallTap: tap });
    if (pages[nama]) {
      // muat semua gambar lazy sebelum screenshot full-page
      await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await pg.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
      const broken = await pg.evaluate(() => [...document.images].filter((i) => i.complete && !i.naturalWidth).map((i) => i.src));
      const ph = await pg.locator('.img-placeholder').count();
      report.push({ w, page: nama + ' (gambar)', overflow: 'ok', smallTap: [], broken, placeholder: ph });
      await pg.screenshot({ path: `${dir}${nama}-${w}.png`, fullPage: true });
    }
  }
  if (w === 375) {
    await pg.goto(base + '#/'); await pg.waitForTimeout(300);
    await pg.click('.hamburger'); await pg.waitForTimeout(300);
    await pg.screenshot({ path: `${dir}menu-375.png` });
    await pg.goto(base + '#/galeri'); await pg.waitForTimeout(300);
    await pg.click('.toolbar__filter'); await pg.waitForTimeout(400);
    await pg.screenshot({ path: `${dir}filter-375.png` });
  }
  if (w === 360 || w === 1280) {
    // detail GF-0012 dengan varian warna asli: klik tiap palet, cek gambar, lalu screenshot palet Sage
    await pg.goto(base + '#/fasad/GF-0012'); await pg.reload(); await pg.waitForTimeout(600);
    const labels = await pg.$$eval('.swatch', (els) => els.map((e) => e.getAttribute('aria-label')));
    const rusak = [];
    for (const l of labels) {
      await pg.click(`.swatch[aria-label="${l}"]`); await pg.waitForTimeout(900);
      const ok = await pg.evaluate(() => { const i = document.querySelector('.img-layer:not(.is-prev)'); if (i instanceof HTMLImageElement) return i.complete && i.naturalWidth > 0 ? i.currentSrc : null; return i && i.classList.contains('is-siap') ? getComputedStyle(i).backgroundImage : null; /* build publik: background */ });
      if (!ok) rusak.push(l);
    }
    await pg.click('.swatch[aria-label*="Sage"]'); await pg.waitForTimeout(1000);
    const o = await cekOverflow(pg); const tap = await cekTap(pg);
    report.push({ w, page: 'GF-0012?palet=sage', overflow: o.sw > o.cw ? `${o.sw}>${o.cw}` : 'ok', smallTap: tap,
      swatch: labels, rusak, url: pg.url(), src: await pg.evaluate(() => document.querySelector('.img-layer:not(.is-prev)')?.currentSrc),
      wa: decodeURIComponent((await pg.getAttribute('.detail__wa', 'href')) || '').split('\n').slice(0, 3).join(' | ') });
    // screenshot dari halaman segar (link langsung ?palet=sage) agar render bersih
    const sp = await ctx.newPage();
    await sp.goto(base + '#/fasad/GF-0012?palet=sage'); await sp.waitForTimeout(800);
    await sp.locator('.detail .grid .card').first().scrollIntoViewIfNeeded(); await sp.waitForTimeout(1200);
    await sp.evaluate(() => window.scrollTo(0, 0)); await sp.waitForTimeout(300);
    await sp.screenshot({ path: `${dir}detail-GF-0012-sage-${w}.png`, fullPage: w !== 360 });
    if (w === 360) await sp.screenshot({ path: `${dir}detail-GF-0012-sage-360-full.png`, fullPage: true });
    await sp.close();
  }
  report.push({ w, errors: errs });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 1));
