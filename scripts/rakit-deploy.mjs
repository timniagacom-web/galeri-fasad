// Merakit folder siap-unggah:
//   deploy-out/                      ← HANYA build publik (dist/) untuk branch gh-pages (+ .nojekyll, CNAME)
//   deploy-internal/int-<token>/     ← build internal (dist-internal/), TIDAK untuk GitHub Pages;
//                                      hanya untuk dibuka lokal / host ber-login.
// Lalu memeriksa kebocoran di deploy-out:
//   1) tidak ada file gambar asli (media/fasad), 2) token internal (baru & lama) tidak muncul,
//   3) tidak ada folder int-*, 4) ID yang dikecualikan tidak muncul
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'deploy-out');
const token = fs.readFileSync(path.join(ROOT, '.internal-token'), 'utf8').trim();
const INT_DIR = `int-${token}`;

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

const OUT_INT = path.join(ROOT, 'deploy-internal');
const tokenLama = fs.existsSync(path.join(ROOT, '.internal-token.lama')) ? fs.readFileSync(path.join(ROOT, '.internal-token.lama'), 'utf8').split(/\s+/).filter(Boolean) : [];
fs.rmSync(OUT, { recursive: true, force: true });
fs.rmSync(OUT_INT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'dist'), OUT, { recursive: true });
fs.cpSync(path.join(ROOT, 'dist-internal'), path.join(OUT_INT, INT_DIR), { recursive: true });
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
if (!fs.existsSync(path.join(OUT, 'CNAME'))) throw new Error('CNAME hilang dari build publik');

const asli = new Set(walk(path.join(ROOT, 'media', 'fasad')).filter((f) => f.endsWith('.webp')).map(sha));
const publik = walk(OUT);
const folderInt = fs.readdirSync(OUT).filter((n) => /^int-/.test(n));
if (folderInt.length) { console.error({ folderInt }); process.exit(1); }
const bocorGambar = publik.filter((f) => f.endsWith('.webp') && asli.has(sha(f)));
const bocorToken = publik.filter((f) => /\.(html|js|css|txt|xml|json|svg)$/.test(f) && [token, ...tokenLama].some((t) => fs.readFileSync(f, 'utf8').includes(t)));
const bocorNamaAsli = publik.filter((f) => /GF-\d{4}.*\.webp$/.test(f));
if (bocorGambar.length || bocorToken.length || bocorNamaAsli.length) {
  console.error({ bocorGambar, bocorToken, bocorNamaAsli });
  process.exit(1);
}
// 3) fasad yang dikecualikan (src/data/dikecualikan.json) tidak muncul di mana pun (publik & internal)
const dk = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/dikecualikan.json'), 'utf8'));
const srcFasad = fs.readFileSync(path.join(ROOT, 'src/data/fasad.ts'), 'utf8');
const kecuali = [...srcFasad.matchAll(/\{ id: "(GF-\d{4})"(?:, batch: (\d+))?/g)]
  .filter(([, id, b]) => (dk.id ?? []).includes(id) || (dk.batch ?? []).includes(Number(b ?? 1)))
  .map(([, id]) => id);
const semua = [...walk(OUT), ...walk(OUT_INT)];
const bocorKecuali = semua.filter((f) => kecuali.some((id) => path.basename(f).startsWith(id)) ||
  (/\.(html|js|css|txt|xml|json|svg)$/.test(f) && kecuali.some((id) => fs.readFileSync(f, 'utf8').includes(id))));
if (bocorKecuali.length) { console.error({ kecuali, bocorKecuali }); process.exit(1); }
if (kecuali.length) console.log(`dikecualikan & terverifikasi absen (${kecuali.length}): ${kecuali.join(', ')}`);
const intIdx = fs.readFileSync(path.join(OUT_INT, INT_DIR, 'index.html'), 'utf8');
if (!intIdx.includes('noindex')) throw new Error('index internal tanpa noindex');
console.log(`OK: deploy-out = ${publik.length} file publik (tanpa gambar asli, tanpa token, tanpa int-*); build internal (${walk(OUT_INT).length} file) di deploy-internal/ — JANGAN diunggah ke GitHub Pages`);
