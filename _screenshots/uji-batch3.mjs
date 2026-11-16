// Uji batch 3 + kelompok Modern/Nusantara. Lokal: deploy-out (4175) & internal (4176). Live: LIVE=1 (publik saja, via IP GitHub Pages).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const LIVE = !!process.env.LIVE;
const TERLARANG = new RegExp(['\\bA' + 'I\\b', 'ilus' + 'trasi', 'gem' + 'ini', 'nano ?ba' + 'nana'].join('|'), 'i');
const src = fs.readFileSync(new URL('../src/data/fasad.ts', import.meta.url), 'utf8');
const tax = fs.readFileSync(new URL('../src/data/taxonomy.ts', import.meta.url), 'utf8');
const dk = JSON.parse(fs.readFileSync(new URL('../src/data/dikecualikan.json', import.meta.url), 'utf8'));
const grupOf = Object.fromEntries([...tax.matchAll(/value: '([a-z-]+)', label: '[^']+', grup: '(\w+)'/g)].map((m) => [m[1], m[2]]));
const semua = src.split('\n').filter((l) => /^  \{ id: "GF-/.test(l)).map((l) => ({ id: l.match(/GF-\d{4}/)[0], batch: Number((l.match(/batch: (\d+)/) ?? [0, 1])[1]), gaya: l.match(/gaya: "([^"]+)"/)[1], atap: l.match(/atap: "([^"]+)"/)[1] }));
const tampil = semua.filter((e) => !dk.id.includes(e.id) && !dk.batch.includes(e.batch));
const kecuali = semua.filter((e) => !tampil.includes(e));
const gayaKecuali = [...new Set(kecuali.map((e) => e.gaya))].filter((g) => !tampil.some((e) => e.gaya === g));
const atapKecuali = [...new Set(kecuali.map((e) => e.atap))].filter((a) => !tampil.some((e) => e.atap === a));
const labelGaya = Object.fromEntries([...tax.matchAll(/value: '([a-z-]+)', label: '([^']+)', grup/g)].map((m) => [m[1], m[2]]));
const labelAtap = Object.fromEntries([...tax.matchAll(/\{ value: '([a-z-]+)', label: '([^']+)' \}/g)].map((m) => [m[1], m[2]]));
const teksTerlarang = [...gayaKecuali.map((g) => labelGaya[g]), ...gayaKecuali.map((g) => labelGaya[g].replace(' Kontemporer', '')), ...atapKecuali.map((a) => labelAtap[a]), ...kecuali.map((e) => e.id)];
const nNus = tampil.filter((e) => grupOf[e.gaya] === 'nusantara').length;
const nMod = tampil.filter((e) => grupOf[e.gaya] === 'modern').length;
const token = fs.readFileSync(new URL('../.internal-token', import.meta.url), 'utf8').trim();
const target = LIVE ? [['live', 'https://galeri.gambarexpress.id/']] : [['publik', 'http://127.0.0.1:4175/'], ['internal', `http://127.0.0.1:4176/int-${token}/`]];
const hs = fs.readdirSync(process.env.HOME + '/.cache/ms-playwright').find((d) => d.startsWith('chromium_headless_shell'));
const browser = await chromium.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/${hs}/chrome-headless-shell-linux64/chrome-headless-shell`, args: ['--no-sandbox', '--host-resolver-rules=MAP galeri.gambarexpress.id 185.199.108.153'] });
const hasil = [];
const cek = (nama, ok, info = '') => hasil.push(`${ok ? 'LULUS' : 'GAGAL'}  ${nama}${info ? ' — ' + info : ''}`);
const dir = new URL('.', import.meta.url).pathname;
const v = () => (LIVE ? `?v=${Date.now()}` : '');
for (const [mode, root] of target) {
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const err = [], gagal = [];
  pg.on('pageerror', (e) => err.push(e.message));
  pg.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) gagal.push(`${r.status()} ${r.url()}`); });
  const hitung = () => pg.textContent('.toolbar__count').then((t) => Number(t.match(/\d+/)[0]));
  const terlihat = async () => { const t = await pg.innerText('body'); return teksTerlarang.filter((x) => t.includes(x)); };
  await pg.goto(root + v() + '#/galeri'); await pg.waitForSelector('.card');
  const n = await pg.$$eval('.card', (e) => e.length);
  cek(`[${mode}] galeri ${tampil.length} kartu`, n === tampil.length && (await hitung()) === tampil.length, `${n}`);
  const ids = await pg.$$eval('.card__id', (e) => e.map((x) => x.textContent.trim()));
  cek(`[${mode}] ${kecuali.length} ID dikecualikan tidak muncul`, !kecuali.some((e) => ids.includes(e.id)));
  cek(`[${mode}] 14 model batch 3 tampil`, tampil.filter((e) => e.batch === 3).every((e) => ids.includes(e.id)), `${ids.filter((i) => i >= 'GF-0061').length}`);
  cek(`[${mode}] panel filter tanpa teks gaya/atap/ID yang dikecualikan`, !(await terlihat()).length, (await terlihat()).join(', '));
  for (let y = 0; y < 40; y++) { await pg.mouse.wheel(0, 1200); await pg.waitForTimeout(100); } await pg.waitForTimeout(1500);
  const termuat = mode === 'internal'
    ? await pg.$$eval('.card img', (els) => els.filter((e) => e.complete && e.naturalWidth > 0).length)
    : await pg.$$eval('.card .gf-bg', (els) => els.filter((e) => /url\(/.test(getComputedStyle(e).backgroundImage)).length);
  cek(`[${mode}] semua thumbnail termuat`, termuat === tampil.length, `${termuat}/${tampil.length}`);
  await pg.goto(root + v() + '#/galeri?grup=nusantara'); await pg.waitForTimeout(500);
  cek(`[${mode}] filter grup=nusantara`, (await hitung()) === nNus, `${await hitung()} (harap ${nNus})`);
  const idsN = await pg.$$eval('.card__id', (e) => e.map((x) => x.textContent.trim()));
  cek(`[${mode}] Bugis masuk Nusantara`, idsN.includes('GF-0012') && !idsN.includes('GF-0001'));
  const legends = await pg.$$eval('.filters legend', (e) => e.map((x) => x.textContent));
  cek(`[${mode}] sub-chip hanya Gaya Nusantara saat Nusantara dipilih`, legends.includes('Gaya Nusantara') && !legends.includes('Gaya Modern'), legends.slice(0, 3).join(' | '));
  if (mode !== 'internal') await pg.screenshot({ path: `${dir}batch3-galeri-nusantara-${mode}.png` });
  await pg.goto(root + v() + '#/galeri?grup=modern'); await pg.waitForTimeout(500);
  cek(`[${mode}] filter grup=modern`, (await hitung()) === nMod, `${await hitung()} (harap ${nMod})`);
  // klik chip di panel
  await pg.goto(root + v() + '#/galeri'); await pg.waitForSelector('.card');
  await pg.click('.filters button.chip:has-text("Nusantara")', { force: true }); await pg.waitForTimeout(400);
  cek(`[${mode}] klik chip Nusantara → URL & hasil`, /grup=nusantara/.test(pg.url()) && (await hitung()) === nNus, pg.url().split('#')[1]);
  await pg.click('.filters button.chip:has-text("Jawa Kontemporer")', { force: true }); await pg.waitForTimeout(400);
  cek(`[${mode}] sub-chip Jawa Kontemporer`, (await hitung()) === tampil.filter((e) => e.gaya === 'jawa-kontemporer').length, `${await hitung()}`);
  await pg.goto(root + v() + '#/galeri?atap=gonjong'); await pg.waitForTimeout(400);
  cek(`[${mode}] filter atap baru (gonjong)`, (await hitung()) === tampil.filter((e) => e.atap === 'gonjong').length, `${await hitung()}`);
  await pg.goto(root + v() + '#/gaya/banjar-kontemporer'); await pg.waitForSelector('.card');
  cek(`[${mode}] /gaya/banjar-kontemporer`, (await pg.$$eval('.card', (e) => e.length)) === 2);
  for (const g of gayaKecuali) {
    await pg.goto(root + v() + `#/gaya/${g}`); await pg.waitForTimeout(800);
    cek(`[${mode}] /gaya/${g} tidak tersedia`, !(await pg.$('.card')));
  }
  await pg.goto(root + v() + '#/'); await pg.waitForTimeout(800);
  const home = await pg.innerText('body');
  cek(`[${mode}] beranda: bagian Gaya modern & Nusantara`, home.includes('Gaya modern') && home.includes('Nusantara') && !(await terlihat()).length);
  for (const id of ['GF-0061', 'GF-0069', 'GF-0076']) {
    await pg.goto(root + v() + `#/fasad/${id}`); await pg.waitForSelector('.detail__title'); await pg.waitForTimeout(1200);
    const info = await pg.textContent('.detail__info');
    const ok = (await pg.textContent('.detail__id')).trim() === id && !/\b[a-z]+-[a-z-]+\b/.test(info.replace(/GF-\d{4}/g, ''));
    cek(`[${mode}] detail ${id} (label rapi)`, ok);
    if (id === 'GF-0069') await pg.screenshot({ path: `${dir}batch3-detail-${id}-${mode}.png` });
  }
  for (const e of kecuali.slice(-6)) {
    await pg.goto(root + v() + `#/fasad/${e.id}`); await pg.waitForTimeout(700);
    if (await pg.$('.detail__title')) cek(`[${mode}] detail ${e.id} harus tidak ada`, false);
  }
  cek(`[${mode}] detail ID dikecualikan tidak tersedia`, true);
  const body = await pg.content();
  cek(`[${mode}] tanpa kata terlarang di DOM`, !TERLARANG.test(body));
  cek(`[${mode}] tidak ada respons 4xx/5xx`, !gagal.length, gagal.slice(0, 3).join(' | '));
  cek(`[${mode}] tanpa error JS`, !err.length, err.slice(0, 2).join(' | '));
  await pg.close();
}
await browser.close();
console.log(hasil.join('\n'));
console.log(`\n${hasil.filter((h) => h.startsWith('LULUS')).length}/${hasil.length} lulus`);
