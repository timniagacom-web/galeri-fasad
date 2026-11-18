import manifest from 'virtual:gambar-manifest';
import { FASAD, type Fasad } from '../data/fasad';
import { ATAP, GAYA, PALET, WARNA, labelGaya, labelPalet, labelTipe, type PaletId } from '../data/taxonomy';
import { SITE_URL } from '../config';

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const slugFasad = (f: Fasad) => slugify(f.judul);
/**
 * Gambar diambil dari manifest build (virtual:gambar-manifest):
 *  - build publik: file watermark 1200px bernama hash (g/<hash>.webp)
 *  - build internal: file asli (img/GF-xxxx.webp)
 * Kunci manifest = nama file sumber tanpa ekstensi, mis. 'GF-0012' atau 'GF-0012-sage'.
 */
const B = import.meta.env.BASE_URL;
export type InfoGambar = { full: string; thumb: string; w: number; tw: number };
const info = (key: string): InfoGambar | undefined => {
  const m = manifest[key];
  return m && { full: B + m.full, thumb: B + m.thumb, w: m.w, tw: m.tw };
};
// peta full → info, untuk srcset/thumbnail dari sebuah URL penuh
const PER_URL = new Map<string, InfoGambar>(Object.keys(manifest).map((k) => [B + manifest[k].full, info(k)!]));
export const infoDariUrl = (url: string) => PER_URL.get(url);
/** URL tidak dikenal → dipakai apa adanya (akan tampil placeholder bila 404). */
const kosong = (key: string) => `${B}g/tidak-ada-${key}.webp`;

export const gambarFasad = (f: Fasad) => f.gambar ?? info(f.id)?.full ?? kosong(f.id);
export const thumbFasad = (f: Fasad) => (f.gambar ? undefined : info(f.id)?.thumb);
export const altFasad = (f: Fasad, palet?: PaletId | 'asli') =>
  (f.alt ?? `Desain konsep fasad ${f.gaya.startsWith('ruko') ? 'ruko' : (f.gaya.startsWith('gudang') || f.gaya === 'structural-shed') ? 'gudang' : 'rumah'} ${labelGaya(f.gaya).toLowerCase()} ${labelTipe(f.tipe).toLowerCase()} lebar lahan ${f.lebarLahan} meter ${f.lantai} lantai`) +
  (palet && palet !== 'asli' ? `, varian palet ${labelPalet(palet).toLowerCase()}` : '');

/** Palet yang punya gambar untuk fasad ini, urut sesuai PALET. */
export const paletTersedia = (f: Fasad): PaletId[] => PALET.map((p) => p.id).filter((id) => !!f.varian?.[id]);

/** Path gambar untuk palet tertentu; 'asli' atau palet tanpa gambar → gambar asli. */
export const gambarVarian = (f: Fasad, palet: PaletId | 'asli') => {
  const v = palet === 'asli' ? undefined : f.varian?.[palet];
  if (!v) return gambarFasad(f);
  if (/^(https?:)?\/\//.test(v) || v.startsWith('/')) return v;
  const key = v.replace(/^.*\//, '').replace(/\.webp$/, ''); // 'fasad/GF-0012-sage.webp' → 'GF-0012-sage'
  return info(key)?.full ?? kosong(key);
};

export const byId = (id?: string) => FASAD.find((f) => f.id.toLowerCase() === (id ?? '').toLowerCase());

/** URL absolut ke sebuah route (hash router). */
export const absUrl = (route: string) => {
  const base = SITE_URL ? SITE_URL.replace(/\/$/, '') + '/' : window.location.origin + window.location.pathname;
  return `${base}#${route}`;
};

/** Fasad serupa: gaya sama dulu, lalu jarak tipe + lebar terdekat. */
export const serupa = (f: Fasad, n = 4) =>
  FASAD.filter((x) => x.id !== f.id)
    .map((x) => ({ x, skor: (x.gaya === f.gaya ? 0 : 1000) + Math.abs(x.tipe - f.tipe) + Math.abs(x.lebarLahan - f.lebarLahan) * 5 + (x.lantai === f.lantai ? 0 : 10) }))
    .sort((a, b) => a.skor - b.skor)
    .slice(0, n)
    .map((s) => s.x);

/** Fasad terbaru = ID terbesar. */
export const terbaru = (n = 8) => [...FASAD].sort((a, b) => b.id.localeCompare(a.id)).slice(0, n);

/** Hanya opsi yang punya minimal satu fasad tampil (gaya/atap/warna dari fasad yang dikecualikan tidak muncul di UI). */
const ADA_GAYA = new Set(FASAD.map((f) => f.gaya as string));
const ADA_ATAP = new Set(FASAD.map((f) => f.atap));
const ADA_WARNA = new Set(FASAD.map((f) => f.warna));
export const GAYA_TAMPIL = GAYA.filter((g) => ADA_GAYA.has(g.value));
export const ATAP_TAMPIL = ATAP.filter((a) => ADA_ATAP.has(a.value));
export const WARNA_TAMPIL = WARNA.filter((w) => ADA_WARNA.has(w.value));
export const gayaTampil = (slug: string) => ADA_GAYA.has(slug);
