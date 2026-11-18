export type Opsi<T extends string | number = string> = { value: T; label: string };

export const GAYA = [
  { value: 'minimalis-modern', label: 'Minimalis Modern', grup: 'modern', intro: 'Garis tegas, bidang kotak, dak beton, dan jendela kaca besar. Cocok untuk lahan sempit karena tampil rapi dan lapang.' },
  { value: 'tropis-modern', label: 'Tropis Modern', grup: 'modern', intro: 'Atap miring dengan overstek lebar, kisi kayu, roster, dan banyak tanaman. Dirancang untuk panas dan hujan iklim tropis.' },
  { value: 'bugis-kontemporer', label: 'Bugis Kontemporer', grup: 'nusantara', intro: "Interpretasi kontemporer rumah Bugis: atap pelana curam dengan timpa laja' berlapis, teras ditinggikan, kisi dan railing kayu, dipadukan material modern." },
  { value: 'japandi', label: 'Japandi', grup: 'modern', intro: 'Perpaduan Jepang dan Skandinavia: atap pelana rendah, kayu warna terang, kisi vertikal halus, dan suasana tenang.' },
  { value: 'industrial', label: 'Industrial', grup: 'modern', intro: 'Bata dan beton ekspos, rangka besi hitam, serta panel kaca besar untuk kesan kokoh dan jujur material.' },
  { value: 'skandinavia', label: 'Skandinavia', grup: 'modern', intro: 'Atap pelana curam, dinding putih bersih, dan aksen kayu muda. Sederhana, hangat, dan terang.' },
  { value: 'klasik-modern', label: 'Klasik Modern', grup: 'modern', intro: 'Komposisi simetris, kolom klasik sederhana, dan list profil. Kesan elegan tanpa ornamen berlebihan.' },
  // Nusantara (batch 3)
  { value: 'jawa-kontemporer', label: 'Jawa Kontemporer', grup: 'nusantara', intro: 'Interpretasi modern rumah Jawa: atap limasan atau joglo yang disederhanakan, teras emper, dan kolom kayu, dipadu dinding plester.' },
  { value: 'bali-kontemporer', label: 'Bali Kontemporer', grup: 'nusantara', intro: 'Rumah tinggal bergaya Bali: batu paras, overstek lebar, dan atap bertingkat rendah.' },
  { value: 'betawi-kontemporer', label: 'Betawi Kontemporer', grup: 'nusantara', intro: 'Atap kebaya atau limasan, selasar depan, dan aksen ukir yang ditahan, cocok untuk perumahan Jabodetabek.' },
  { value: 'sunda-kontemporer', label: 'Sunda Kontemporer', grup: 'nusantara', intro: 'Atap julang ngapak seperti sayap yang merentang, dipadu material modern.' },
  { value: 'minang-kontemporer', label: 'Minang Kontemporer', grup: 'nusantara', intro: 'Satu atau dua puncak gonjong sebagai aksen atap pada rumah tinggal biasa, bukan rumah gadang adat.' },
  { value: 'melayu-kontemporer', label: 'Melayu Kontemporer', grup: 'nusantara', intro: 'Atap limas Riau atau limas bertingkat Palembang, selasar, dan panel ventilasi ukir.' },
  { value: 'batak-kontemporer', label: 'Batak Kontemporer', grup: 'nusantara', intro: 'Pelana curam Batak Toba dengan suhul bersilangan di puncak, dinding plester modern.' },
  { value: 'banjar-kontemporer', label: 'Banjar Kontemporer', grup: 'nusantara', intro: 'Atap bubungan tinggi yang curam dan menjulang, diterjemahkan ke rumah perumahan.' },
  { value: 'toraja-kontemporer', label: 'Toraja Kontemporer', grup: 'nusantara', intro: 'Satu atap berbentuk perahu khas tongkonan pada rumah kota.' },
  { value: 'manado-kontemporer', label: 'Manado Kontemporer', grup: 'nusantara', intro: 'Pelana curam Minahasa, aksen papan kayu, dan panggung rendah berkolong tertutup.' },
  // Tren 2026 (batch 5)
  { value: 'farmhouse-modern', label: 'Farmhouse Modern', grup: 'modern', intro: 'Tafsir ulang farmhouse: dinding papan kayu putih, atap pelana, teras depan beratap, dan pagar kayu rendah.' },
  { value: 'inggris-country', label: 'English Country', grup: 'modern', intro: 'Gaya pedesaan Inggris: bata ekspos, batu alam, atap pelana curam dengan dormer, dan komposisi simetris.' },
  { value: 'organik-modern', label: 'Organik Modern', grup: 'modern', intro: 'Fasad biomorphic: bentuk melengkung dan dinamis, dinding earth tone, atap kombinasi, dan banyak tanaman.' },
  { value: 'resort-modern', label: 'Resort Modern', grup: 'modern', intro: 'Suasana vila resort: overstek lebar, batu alam, kaca besar dari lantai ke langit-langit, dan teras deck kayu.' },
  // Sederhana Modern (batch 8, dari foto referensi owner)
  { value: 'sederhana-modern', label: 'Sederhana Modern', grup: 'modern', intro: 'Rumah sederhana modern: dinding putih, atap pelana genteng merah, teras berkolom ramping, dan carport di samping.' },
  // Ruko (batch 7)
  { value: 'ruko-modern', label: 'Ruko Modern', grup: 'ruko', intro: 'Ruko modern: etalase kaca besar di lantai dasar, hunian atau kantor di lantai atas, atap dak datar.' },
  { value: 'ruko-minimalis', label: 'Ruko Minimalis', grup: 'ruko', intro: 'Ruko minimalis: garis tegas, bidang kotak, beton ekspos, dan jendela kaca besar.' },
  { value: 'ruko-tropis', label: 'Ruko Tropis', grup: 'ruko', intro: 'Ruko tropis: atap miring satu arah dengan overstek lebar, kisi kayu, dan batu alam.' },
  { value: 'ruko-klasik', label: 'Ruko Klasik', grup: 'ruko', intro: 'Ruko klasik: kolom klasik, list profil, dan balkon railing klasik, komposisi simetris.' },
] as const;
export type GayaSlug = (typeof GAYA)[number]['value'];
/** Kelompok gaya untuk filter tingkat pertama (Modern / Nusantara). */
export const GRUP_GAYA = [
  { value: 'modern', label: 'Modern' },
  { value: 'nusantara', label: 'Nusantara' },
  { value: 'ruko', label: 'Ruko' },
] as const;
export type GrupGaya = (typeof GRUP_GAYA)[number]['value'];
export const grupGaya = (slug: string): GrupGaya | undefined => GAYA.find((g) => g.value === slug)?.grup;

export const TIPE: Opsi<number>[] = [
  { value: 36, label: 'Tipe 36' }, { value: 45, label: 'Tipe 45' }, { value: 54, label: 'Tipe 54' },
  { value: 70, label: 'Tipe 70' }, { value: 90, label: 'Tipe 90+' },
];
export const LANTAI: Opsi<number>[] = [{ value: 1, label: '1 lantai' }, { value: 2, label: '2 lantai' }, { value: 3, label: '3 lantai' }];
export const LEBAR: Opsi<number>[] = [
  { value: 6, label: '6 m' }, { value: 7, label: '7 m' }, { value: 8, label: '8 m' },
  { value: 10, label: '10 m' }, { value: 12, label: '12 m+' },
];
export const ATAP: Opsi[] = [
  { value: 'dak-datar', label: 'Dak datar' }, { value: 'pelana', label: 'Pelana' },
  { value: 'limasan', label: 'Limasan' }, { value: 'miring-satu-arah', label: 'Miring satu arah' },
  { value: 'kombinasi', label: 'Kombinasi' }, { value: 'bugis-timpalaja', label: "Bugis (timpa laja')" },
  // Nusantara (batch 3)
  { value: 'joglo', label: 'Joglo' }, { value: 'gonjong', label: 'Gonjong' }, { value: 'julang-ngapak', label: 'Julang ngapak' },
  { value: 'atap-kebaya', label: 'Atap kebaya' }, { value: 'limas-melayu', label: 'Limas Melayu' }, { value: 'limas-bertingkat', label: 'Limas bertingkat' },
  { value: 'bubungan-tinggi', label: 'Bubungan tinggi' }, { value: 'bali-bertingkat', label: 'Atap bertingkat Bali' },
  { value: 'tongkonan', label: 'Atap perahu Tongkonan' }, { value: 'pelana-batak', label: 'Pelana Batak (suhul)' }, { value: 'pelana-curam', label: 'Pelana curam' },
];
export const WARNA: Opsi[] = [
  { value: 'putih', label: 'Putih' }, { value: 'abu', label: 'Abu' }, { value: 'hitam', label: 'Hitam' },
  { value: 'earth-tone', label: 'Earth tone' }, { value: 'kayu-natural', label: 'Kayu natural' }, { value: 'krem', label: 'Krem' },
  // batch 2
  { value: 'abu-gelap', label: 'Abu gelap' }, { value: 'hijau-sage', label: 'Hijau sage' }, { value: 'biru-navy', label: 'Biru navy' },
  { value: 'terakota', label: 'Terakota' }, { value: 'merah-bata', label: 'Merah bata' }, { value: 'mustard', label: 'Mustard' },
];
export const MATERIAL: Record<string, string> = {
  'batu-alam': 'Batu alam', 'kayu-conwood': 'Kayu/conwood', roster: 'Roster', 'bata-ekspos': 'Bata ekspos',
  'beton-ekspos': 'Beton ekspos', 'kaca-besar': 'Kaca besar', 'besi-hollow': 'Besi hollow', 'kisi-vertikal': 'Kisi vertikal halus',
  kayu: 'Kayu', 'kisi-kayu': 'Kisi kayu', 'panel-kayu': 'Panel kayu', 'kayu-terang': 'Kayu terang', 'kayu-muda': 'Kayu muda',
  'railing-kayu-bubut': 'Railing kayu bubut', 'rangka-besi': 'Rangka besi hitam', 'kanopi-besi': 'Kanopi besi',
  'list-profil': 'List profil', 'kolom-klasik': 'Kolom klasik', 'railing-klasik': 'Balkon railing klasik',
  // batch 2
  'kayu-gelap': 'Kayu gelap', 'bata-putih': 'Bata putih', 'list-putih': 'List putih', 'panel-corten': 'Panel corten',
  // batch 3
  'kolom-kayu': 'Kolom kayu', 'kolom-soko': 'Kolom soko kayu', 'batu-paras': 'Batu paras', 'roster-batu': 'Roster batu', 'kosen-kayu': 'Kosen kayu',
  'roster-ukir': 'Roster ukir', 'lisplang-ukir': 'Lisplang ukir', 'kolom-sederhana': 'Kolom sederhana', 'sisik-angin': 'Sisik angin ukir',
  'papan-gable-ukir': 'Papan gable ukir', 'ornamen-geometris': 'Ornamen geometris', 'papan-kayu-horizontal': 'Papan kayu horizontal', 'papan-kayu': 'Papan kayu',
};

const find = <T extends string | number>(list: readonly Opsi<T>[], v: T) => list.find((o) => o.value === v)?.label ?? String(v);
export const labelGaya = (v: string) => GAYA.find((g) => g.value === v)?.label ?? v;
export const labelTipe = (v: number) => (v >= 90 ? 'Tipe 90+' : `Tipe ${v}`);
export const labelLebar = (v: number) => (v >= 12 ? `${v} m` : `${v} m`);
export const labelAtap = (v: string) => find(ATAP, v);
export const labelWarna = (v: string) => find(WARNA, v);
export const labelMaterial = (v: string) => MATERIAL[v] ?? v;

/**
 * PALET VARIAN WARNA — dipakai untuk tombol "ganti tema warna" di halaman detail.
 * `swatch` = 2–3 warna hex untuk bulatan pilihan (hanya representasi, bukan kode cat).
 * File gambar varian: media/fasad/<ID>-<id palet>.webp, mis. media/fasad/GF-0012-sage.webp
 */
export const PALET = [
  { id: 'earth', label: 'Earth tone', swatch: ['#b5603c', '#e9dcc4', '#6b4a32'] },
  { id: 'gelap', label: 'Gelap elegan', swatch: ['#1e1e1e', '#4a4d50', '#9a6a3f'] },
  { id: 'putih', label: 'Putih bersih', swatch: ['#f7f7f5', '#b9bcbf', '#6e7276'] },
  { id: 'sage', label: 'Sage pastel', swatch: ['#a9b8a0', '#e4e9df', '#7d8f74'] },
  { id: 'navy', label: 'Navy + putih', swatch: ['#1f3352', '#f5f5f2', '#8a9bb3'] },
  { id: 'beton', label: 'Abu beton monokrom', swatch: ['#8d8f8e', '#c3c4c2', '#4f5150'] },
  { id: 'mustard', label: 'Hangat mustard + kayu terang', swatch: ['#d4a337', '#f1e6cc', '#c9a27a'] },
  { id: 'bata', label: 'Merah bata ekspos + putih tulang', swatch: ['#a5462f', '#f2ece0', '#7a3324'] },
] as const;
export type PaletId = (typeof PALET)[number]['id'];
export const labelPalet = (id: string) => PALET.find((p) => p.id === id)?.label ?? id;
export const isPaletId = (v: string | null | undefined): v is PaletId => !!v && PALET.some((p) => p.id === v);
