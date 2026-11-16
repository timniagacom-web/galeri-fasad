// Uji batch 2: jumlah galeri, filter warna baru, filter gabungan, detail batch-2 (publik & internal) di deploy-out (port 4175)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../src/data/fasad.ts', import.meta.url), 'utf8');
const dk = JSON.parse(fs.readFileSync(new URL('../src/data/dikecualikan.json', import.meta.url), 'utf8'));
const entri = src.split('\n').filter((l) => /^  \{ id: "GF-/.test(l)).map((l) => ({
  id: l.match(/id: "(GF-\d{4})"/)[1], batch: Number((l.match(/batch: (\d+)/) ?? [0, 1])[1]),
  gaya: l.match(/gaya: "([^"]+)"/)[1], lantai: Number(l.match(/lantai: (\d)/)[1]), warna: l.match(/warna: "([^"]+)"/)[1],
})).filter((e) => !dk.id.includes(e.id) && !dk.batch.includes(e.batch));
const token = fs.readFileSync(new URL('../.internal-token', import.meta.url), 'utf8').trim();
const BASE = 'http://127.0.0.1:4175/';
const INT = `http://127.0.0.1:4176/int-${token}/`;
const hs = fs.readdirSync(process.env.HOME + '/.cache/ms-playwright').find((d) => d.startsWith('chromium_headless_shell'));
const browser = await chromium.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/${hs}/chrome-headless-shell-linux64/chrome-headless-shell`, args: ['--no-sandbox'] });
const hasil = [];
const cek = (nama, ok, info = '') => hasil.push(`${ok ? 'LULUS' : 'GAGAL'}  ${nama}${info ? ' — ' + info : ''}`);
const hitung = (pg) => pg.textContent('.toolbar__count').then((t) => Number(t.match(/\d+/)[0]));
const dir = new URL('.', import.meta.url).pathname;

for (const [mode, root] of [['publik', BASE], ['internal', INT]]) {
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const err = [], gagal = [];
  pg.on('pageerror', (e) => err.push(e.message));
  pg.on('response', (r) => { if (r.status() >= 400) gagal.push(`${r.status()} ${r.url()}`); });
  await pg.goto(root + '#/galeri'); await pg.waitForSelector('.card');
  cek(`[${mode}] galeri menampilkan ${entri.length} model`, (await hitung(pg)) === entri.length, `${await hitung(pg)}`);
  const ids = await pg.$$eval('.card__id', (els) => els.map((e) => e.textContent.trim()));
  cek(`[${mode}] semua kartu batch 2 ada`, entri.filter((e) => e.batch === 2).every((e) => ids.includes(e.id)), `${ids.length} kartu`);
  // gulir supaya semua gambar lazy termuat, lalu cek tak ada yang 404
  for (let y = 0; y < 30; y++) { await pg.mouse.wheel(0, 1200); await pg.waitForTimeout(120); }
  await pg.waitForTimeout(1500);
  const termuat = mode === 'publik'
    ? await pg.$$eval('.card .gf-bg', (els) => els.filter((e) => /url\(/.test(getComputedStyle(e).backgroundImage)).length)
    : await pg.$$eval('.card img', (els) => els.filter((e) => e.complete && e.naturalWidth > 0).length);
  cek(`[${mode}] semua thumbnail termuat`, termuat === entri.length, `${termuat}/${entri.length}`);
  for (const w of ['abu-gelap', 'hijau-sage', 'biru-navy', 'terakota', 'merah-bata', 'mustard']) {
    const exp = entri.filter((e) => e.warna === w).length;
    await pg.goto(root + `#/galeri?warna=${w}`); await pg.waitForTimeout(400);
    cek(`[${mode}] filter warna=${w}`, (await hitung(pg)) === exp, `${await hitung(pg)} (harap ${exp})`);
  }
  const expG = entri.filter((e) => e.gaya === 'skandinavia' && e.lantai === 2).length;
  await pg.goto(root + '#/galeri?gaya=skandinavia&lantai=2'); await pg.waitForTimeout(400);
  cek(`[${mode}] filter gabungan skandinavia + 2 lantai`, (await hitung(pg)) === expG, `${await hitung(pg)} (harap ${expG})`);
  const labelOk = await pg.textContent('body').then((t) => ['Abu gelap', 'Hijau sage'].every((s) => t.includes(s)));
  cek(`[${mode}] label warna baru tampil di panel filter`, labelOk);
  const DETAIL = ['GF-0045', 'GF-0047', 'GF-0060'].filter((id) => entri.some((e) => e.id === id));
  if (!DETAIL.length) DETAIL.push(entri[entri.length - 1].id);
  for (const id of DETAIL) {
    await pg.goto(root + `#/fasad/${id}`); await pg.waitForSelector('.detail__title'); await pg.waitForTimeout(1200);
    const idOk = (await pg.textContent('.detail__id')).trim() === id;
    const info = await pg.textContent('.detail__info');
    const slugMentah = /\b(kayu-gelap|bata-putih|list-putih|panel-corten|abu-gelap|hijau-sage|biru-navy|merah-bata)\b/.test(info);
    const gbr = mode === 'publik'
      ? await pg.$eval('.detail__media .gf-bg', (e) => getComputedStyle(e).backgroundImage).catch(() => '')
      : await pg.$eval('.detail__media img', (e) => (e.complete && e.naturalWidth > 0 ? e.currentSrc : '')).catch(() => '');
    const pola = mode === 'publik' ? /g\/[0-9a-f]{20}\.webp/ : new RegExp(`img/${id}\\.webp`);
    cek(`[${mode}] detail ${id}: judul, label, gambar`, idOk && !slugMentah && pola.test(gbr), `${gbr.slice(-45)}${slugMentah ? ' SLUG MENTAH' : ''}`);
    if (id === DETAIL[0]) await pg.screenshot({ path: `${dir}batch2-detail-${id}-${mode}.png` });
  }
  cek(`[${mode}] tidak ada respons 4xx/5xx`, !gagal.length, gagal.slice(0, 3).join(' | '));
  cek(`[${mode}] tanpa error JS`, !err.length, err.slice(0, 2).join(' | '));
  await pg.close();
}
await browser.close();
console.log(hasil.join('\n'));
console.log(`\n${hasil.filter((h) => h.startsWith('LULUS')).length}/${hasil.length} lulus`);
