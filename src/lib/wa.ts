import { WA_NUMBER } from '../config';
import type { Fasad } from '../data/fasad';
import { labelGaya } from '../data/taxonomy';
import { absUrl } from './fasad';
import type { Persona } from './store';

export const waAktif = () => WA_NUMBER.trim().length > 0;

const tipeTeks = (t: number) => (t >= 90 ? '90+' : String(t));

/** `varian` = label palet terpilih (mis. "Sage pastel"); hanya dipakai bila satu fasad. */
export function pesanWA(persona: Persona, list: Fasad[], route: string, varian?: string): string {
  const url = absUrl(route);
  const v = varian && list.length === 1 ? ` varian ${varian}` : '';
  if (list.length === 0) {
    return `Halo Gambar.Express, saya dari Galeri.Fasad dan ingin konsultasi gratis. Saya: ${persona === 'kontraktor' ? 'Kontraktor/developer' : 'Pemilik rumah'}. Lokasi lahan: [isi]\nLink: ${url}`;
  }
  const f = list[0];
  if (persona === 'kontraktor') {
    const acuan =
      list.length === 1
        ? `- Model acuan: ${f.id}${v} (${labelGaya(f.gaya)}, Tipe ${tipeTeks(f.tipe)}, Lebar ${f.lebarLahan} m)`
        : `- Model acuan: ${list.map((x) => `${x.id} (${labelGaya(x.gaya)}, Tipe ${tipeTeks(x.tipe)}, Lebar ${x.lebarLahan} m)`).join('; ')}`;
    return `Halo Gambar.Express, saya kontraktor/developer dari Galeri.Fasad.\n${acuan}\n- Jumlah unit: [isi] | Lokasi proyek: [isi] | Deadline: [isi]\nLink: ${url}`;
  }
  const idLine =
    list.length === 1
      ? `- ID fasad: ${f.id} (${labelGaya(f.gaya)})${v ? `\n- Varian warna: ${varian}` : ''}\n- Tipe: ${tipeTeks(f.tipe)} | Lantai: ${f.lantai} | Lebar lahan: ${f.lebarLahan} m`
      : `- ID fasad: ${list.map((x) => `${x.id} (${labelGaya(x.gaya)}, Tipe ${tipeTeks(x.tipe)}, ${x.lantai} lt, Lebar ${x.lebarLahan} m)`).join('; ')}`;
  return `Halo Gambar.Express, saya tertarik model ${list.length === 1 ? `${f.id}${v} ` : 'fasad '}dari Galeri.Fasad.\n${idLine}\n- Lokasi lahan: [isi]\n- Saya: Pemilik rumah\nLink: ${url}`;
}

export const linkWA = (pesan: string) => `https://wa.me/${WA_NUMBER.trim()}?text=${encodeURIComponent(pesan)}`;
