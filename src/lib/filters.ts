import type { Fasad } from '../data/fasad';
import { grupGaya } from '../data/taxonomy';

/** varian: ['ada'] = hanya fasad yang punya varian palet warna */
export type Filter = { grup: string[]; gaya: string[]; tipe: number[]; lantai: number[]; lebar: number[]; atap: string[]; warna: string[]; varian: string[] };
export const KOSONG: Filter = { grup: [], gaya: [], tipe: [], lantai: [], lebar: [], atap: [], warna: [], varian: [] };
const KEYS = Object.keys(KOSONG) as (keyof Filter)[];
const NUMERIC: (keyof Filter)[] = ['tipe', 'lantai', 'lebar'];

export const parseFilter = (sp: URLSearchParams): Filter => {
  const f = { ...KOSONG } as Record<keyof Filter, (string | number)[]>;
  for (const k of KEYS) {
    const raw = (sp.get(k) ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    f[k] = NUMERIC.includes(k) ? raw.map(Number).filter((n) => !Number.isNaN(n)) : raw;
  }
  return f as Filter;
};

export const filterToParams = (f: Filter) => {
  const sp = new URLSearchParams();
  for (const k of KEYS) if (f[k].length) sp.set(k, f[k].join(','));
  return sp;
};

export const jumlahAktif = (f: Filter) => KEYS.reduce((n, k) => n + f[k].length, 0);

const cocokBucket = (nilai: number, pilihan: number[], batasAtas: number) =>
  pilihan.some((p) => (p >= batasAtas ? nilai >= batasAtas : nilai === p));

export const terapkan = (data: Fasad[], f: Filter) =>
  data.filter(
    (x) =>
      (!f.grup.length || f.grup.includes(grupGaya(x.gaya) ?? '')) &&
      (!f.gaya.length || f.gaya.includes(x.gaya)) &&
      (!f.tipe.length || cocokBucket(x.tipe, f.tipe, 90)) &&
      (!f.lantai.length || f.lantai.includes(x.lantai)) &&
      (!f.lebar.length || cocokBucket(x.lebarLahan, f.lebar, 12)) &&
      (!f.atap.length || f.atap.includes(x.atap)) &&
      (!f.warna.length || f.warna.includes(x.warna)) &&
      (!f.varian.includes('ada') || Object.values(x.varian ?? {}).some(Boolean)),
  );
