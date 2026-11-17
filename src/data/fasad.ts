import type { GayaSlug, PaletId } from './taxonomy';

/**
 * DATA FASAD — satu-satunya tempat menambah fasad.
 * Cara menambah: salin satu objek, ganti id (GF-xxxx urut), isi atribut, lalu taruh gambar di
 * public/fasad/<id>.webp. Bila gambar belum ada, situs otomatis menampilkan placeholder.
 * Hanya masukkan fasad yang statusnya approved_by_owner di sheet metadata.
 * Batch 1 (GF-0001..GF-0030): disetujui owner 2026-11-16 10:49 WITA; sumber gambar/batch-01/raw.
 * Gambar dikonversi dengan: python3 scripts/konversi-gambar.py ../gambar/batch-01/raw
 */
export type Fasad = {
  id: string;
  /** nomor batch produksi gambar (default 1) */
  batch?: number;
  judul: string;
  gaya: GayaSlug;
  tipe: number; // 36 | 45 | 54 | 70 | 90+ (luas bangunan m²)
  lantai: 1 | 2;
  lebarLahan: number; // meter
  atap: string; // slug ATAP
  warna: string; // slug WARNA
  material: string[]; // slug MATERIAL
  deskripsi: string;
  /** opsional; default: fasad/<id>.webp */
  gambar?: string;
  /** opsional; dibuat otomatis bila kosong */
  alt?: string;
  /**
   * opsional; varian palet warna dari gambar yang sama (gambar asli = "Asli").
   * Path relatif terhadap public/, konvensi: 'fasad/GF-xxxx-<palet>.webp'. Palet tanpa entri tidak ditampilkan.
   */
  varian?: Partial<Record<PaletId, string>>;
};

/** SEMUA entri, termasuk yang dikecualikan. Halaman situs memakai FASAD (sudah difilter). */
export const SEMUA_FASAD: Fasad[] = [
  { id: "GF-0001", judul: "Minimalis Modern Tipe 45, Lebar 7 m, 1 Lantai", gaya: "minimalis-modern", tipe: 45, lantai: 1, lebarLahan: 7, atap: "dak-datar", warna: "abu", material: ["batu-alam", "kisi-kayu"],
    deskripsi: "Fasad minimalis modern dengan garis tegas, bidang kotak, dan jendela kaca besar berkusen gelap. Rumah 1 lantai tipe 45 untuk lahan lebar muka 7 m, beratap dak datar, dengan warna dominan abu dan aksen batu alam dan kisi kayu." },
  { id: "GF-0002", judul: "Minimalis Modern Tipe 70, Lebar 8 m, 2 Lantai", gaya: "minimalis-modern", tipe: 70, lantai: 2, lebarLahan: 8, atap: "dak-datar", warna: "putih", material: ["panel-kayu", "kaca-besar"],
    deskripsi: "Fasad minimalis modern dengan garis tegas, bidang kotak, dan jendela kaca besar berkusen gelap. Rumah 2 lantai tipe 70 untuk lahan lebar muka 8 m, beratap dak datar, dengan warna dominan putih dan aksen panel kayu dan kaca besar." },
  { id: "GF-0003", judul: "Minimalis Modern Tipe 90+, Lebar 10 m, 2 Lantai", gaya: "minimalis-modern", tipe: 90, lantai: 2, lebarLahan: 10, atap: "kombinasi", warna: "hitam", material: ["batu-alam", "kaca-besar"],
    deskripsi: "Fasad minimalis modern dengan garis tegas, bidang kotak, dan jendela kaca besar berkusen gelap. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 10 m, beratap kombinasi, dengan warna dominan hitam dan aksen batu alam dan kaca besar." },
  { id: "GF-0004", judul: "Minimalis Modern Tipe 54, Lebar 10 m, 1 Lantai", gaya: "minimalis-modern", tipe: 54, lantai: 1, lebarLahan: 10, atap: "miring-satu-arah", warna: "putih", material: ["roster", "batu-alam"],
    deskripsi: "Fasad minimalis modern dengan garis tegas, bidang kotak, dan jendela kaca besar berkusen gelap. Rumah 1 lantai tipe 54 untuk lahan lebar muka 10 m, beratap miring satu arah, dengan warna dominan putih dan aksen roster dan batu alam." },
  { id: "GF-0005", judul: "Tropis Modern Tipe 36, Lebar 6 m, 1 Lantai", gaya: "tropis-modern", tipe: 36, lantai: 1, lebarLahan: 6, atap: "miring-satu-arah", warna: "kayu-natural", material: ["kisi-kayu"],
    deskripsi: "Fasad tropis modern dengan overstek lebar yang meneduhi dinding dari panas dan hujan, dipadu tanaman tropis di halaman depan. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap miring satu arah, dengan warna dominan kayu natural dan aksen kisi kayu." },
  { id: "GF-0006", judul: "Tropis Modern Tipe 70, Lebar 8 m, 2 Lantai", gaya: "tropis-modern", tipe: 70, lantai: 2, lebarLahan: 8, atap: "limasan", warna: "earth-tone", material: ["roster", "kisi-kayu"], // disesuaikan dengan gambar — CSV: pelana; gambar atap limasan
    deskripsi: "Fasad tropis modern dengan overstek lebar yang meneduhi dinding dari panas dan hujan, dipadu tanaman tropis di halaman depan. Rumah 2 lantai tipe 70 untuk lahan lebar muka 8 m, beratap limasan, dengan warna dominan earth tone dan aksen roster dan kisi kayu." },
  { id: "GF-0007", judul: "Tropis Modern Tipe 54, Lebar 10 m, 1 Lantai", gaya: "tropis-modern", tipe: 54, lantai: 1, lebarLahan: 10, atap: "limasan", warna: "krem", material: ["batu-alam", "kisi-kayu"], // disesuaikan dengan gambar — CSV: pelana; gambar atap limasan
    deskripsi: "Fasad tropis modern dengan overstek lebar yang meneduhi dinding dari panas dan hujan, dipadu tanaman tropis di halaman depan. Rumah 1 lantai tipe 54 untuk lahan lebar muka 10 m, beratap limasan, dengan warna dominan krem dan aksen batu alam dan kisi kayu." },
  { id: "GF-0008", judul: "Tropis Modern Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "tropis-modern", tipe: 90, lantai: 2, lebarLahan: 12, atap: "miring-satu-arah", warna: "earth-tone", material: ["kisi-kayu", "batu-alam"],
    deskripsi: "Fasad tropis modern dengan overstek lebar yang meneduhi dinding dari panas dan hujan, dipadu tanaman tropis di halaman depan. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap miring satu arah, dengan warna dominan earth tone dan aksen kisi kayu dan batu alam." },
  { id: "GF-0009", judul: "Bugis Kontemporer Tipe 45, Lebar 8 m, 2 Lantai", gaya: "bugis-kontemporer", tipe: 45, lantai: 2, lebarLahan: 8, atap: "bugis-timpalaja", warna: "kayu-natural", material: ["kisi-kayu", "railing-kayu-bubut"], // disesuaikan dengan gambar — CSV: 1 lantai; gambar tampak 2 lantai
    deskripsi: "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad. Rumah 2 lantai tipe 45 untuk lahan lebar muka 8 m, beratap pelana curam bertimpa laja' berlapis, dengan warna dominan kayu natural dan aksen kisi kayu dan railing kayu bubut." },
  { id: "GF-0010", judul: "Bugis Kontemporer Tipe 54, Lebar 10 m, 1 Lantai", gaya: "bugis-kontemporer", tipe: 54, lantai: 1, lebarLahan: 10, atap: "bugis-timpalaja", warna: "krem", material: ["kayu", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad. Rumah 1 lantai tipe 54 untuk lahan lebar muka 10 m, beratap pelana curam bertimpa laja' berlapis, dengan warna dominan krem dan aksen kayu dan batu alam." },
  { id: "GF-0011", judul: "Bugis Kontemporer Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "bugis-kontemporer", tipe: 90, lantai: 2, lebarLahan: 12, atap: "bugis-timpalaja", warna: "kayu-natural", material: ["kayu", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap pelana curam bertimpa laja' berlapis, dengan warna dominan kayu natural dan aksen kayu dan batu alam." },
  { id: "GF-0012", judul: "Bugis Kontemporer Tipe 70, Lebar 8 m, 2 Lantai", gaya: "bugis-kontemporer", tipe: 70, lantai: 2, lebarLahan: 8, atap: "bugis-timpalaja", warna: "putih", material: ["kisi-kayu", "railing-kayu-bubut"],
    // varian warna dari pilot gambar/varian/pilot (disetujui owner)
    varian: { earth: 'fasad/GF-0012-earth.webp', gelap: 'fasad/GF-0012-gelap.webp', putih: 'fasad/GF-0012-putih.webp', sage: 'fasad/GF-0012-sage.webp', navy: 'fasad/GF-0012-navy.webp', beton: 'fasad/GF-0012-beton.webp', mustard: 'fasad/GF-0012-mustard.webp', bata: 'fasad/GF-0012-bata.webp' },
    deskripsi: "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad. Rumah 2 lantai tipe 70 untuk lahan lebar muka 8 m, beratap pelana curam bertimpa laja' berlapis, dengan warna dominan putih dan aksen kisi kayu dan railing kayu bubut." },
  { id: "GF-0013", judul: "Japandi Tipe 36, Lebar 6 m, 1 Lantai", gaya: "japandi", tipe: 36, lantai: 1, lebarLahan: 6, atap: "pelana", warna: "putih", material: ["kayu-terang"],
    deskripsi: "Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap pelana, dengan warna dominan putih dan aksen kayu terang." },
  { id: "GF-0014", judul: "Japandi Tipe 54, Lebar 8 m, 1 Lantai", gaya: "japandi", tipe: 54, lantai: 1, lebarLahan: 8, atap: "pelana", warna: "kayu-natural", material: ["kayu-terang", "kisi-vertikal"],
    deskripsi: "Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih. Rumah 1 lantai tipe 54 untuk lahan lebar muka 8 m, beratap pelana, dengan warna dominan kayu natural dan aksen kayu terang dan kisi vertikal halus." },
  { id: "GF-0015", judul: "Japandi Tipe 70, Lebar 10 m, 2 Lantai", gaya: "japandi", tipe: 70, lantai: 2, lebarLahan: 10, atap: "pelana", warna: "putih", material: ["kayu-terang", "batu-alam"],
    deskripsi: "Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap pelana, dengan warna dominan putih dan aksen kayu terang dan batu alam." },
  { id: "GF-0016", judul: "Japandi Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "japandi", tipe: 90, lantai: 2, lebarLahan: 12, atap: "pelana", warna: "krem", material: ["kayu-terang", "kisi-vertikal"],
    deskripsi: "Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap pelana, dengan warna dominan krem dan aksen kayu terang dan kisi vertikal halus." },
  { id: "GF-0017", judul: "Industrial Tipe 45, Lebar 7 m, 1 Lantai", gaya: "industrial", tipe: 45, lantai: 1, lebarLahan: 7, atap: "pelana", warna: "abu", material: ["bata-ekspos", "rangka-besi"], // disesuaikan dengan gambar — CSV: miring satu arah; gambar atap pelana
    deskripsi: "Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar. Rumah 1 lantai tipe 45 untuk lahan lebar muka 7 m, beratap pelana, dengan warna dominan abu dan aksen bata ekspos dan rangka besi hitam." },
  { id: "GF-0018", judul: "Industrial Tipe 70, Lebar 8 m, 2 Lantai", gaya: "industrial", tipe: 70, lantai: 2, lebarLahan: 8, atap: "dak-datar", warna: "hitam", material: ["beton-ekspos", "kaca-besar"],
    deskripsi: "Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar. Rumah 2 lantai tipe 70 untuk lahan lebar muka 8 m, beratap dak datar, dengan warna dominan hitam dan aksen beton ekspos dan panel kaca besar." },
  { id: "GF-0019", judul: "Industrial Tipe 90+, Lebar 10 m, 2 Lantai", gaya: "industrial", tipe: 90, lantai: 2, lebarLahan: 10, atap: "dak-datar", warna: "abu", material: ["bata-ekspos", "kanopi-besi"],
    deskripsi: "Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 10 m, beratap dak datar, dengan warna dominan abu dan aksen bata ekspos dan kanopi besi." },
  { id: "GF-0020", judul: "Industrial Tipe 54, Lebar 10 m, 1 Lantai", gaya: "industrial", tipe: 54, lantai: 1, lebarLahan: 10, atap: "miring-satu-arah", warna: "hitam", material: ["beton-ekspos", "kayu"],
    deskripsi: "Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar. Rumah 1 lantai tipe 54 untuk lahan lebar muka 10 m, beratap miring satu arah, dengan warna dominan hitam dan aksen beton ekspos dan kayu." },
  { id: "GF-0021", judul: "Skandinavia Tipe 36, Lebar 6 m, 1 Lantai", gaya: "skandinavia", tipe: 36, lantai: 1, lebarLahan: 6, atap: "pelana", warna: "putih", material: ["kayu-muda"],
    deskripsi: "Fasad skandinavia dengan atap pelana curam, dinding terang, dan aksen kayu muda yang hangat. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap pelana, dengan warna dominan putih dan aksen kayu muda." },
  { id: "GF-0022", judul: "Skandinavia Tipe 45, Lebar 8 m, 1 Lantai", gaya: "skandinavia", tipe: 45, lantai: 1, lebarLahan: 8, atap: "pelana", warna: "putih", material: ["kayu-muda"],
    deskripsi: "Fasad skandinavia dengan atap pelana curam, dinding terang, dan aksen kayu muda yang hangat. Rumah 1 lantai tipe 45 untuk lahan lebar muka 8 m, beratap pelana, dengan warna dominan putih dan aksen kayu muda." },
  { id: "GF-0023", judul: "Skandinavia Tipe 70, Lebar 8 m, 2 Lantai", gaya: "skandinavia", tipe: 70, lantai: 2, lebarLahan: 8, atap: "pelana", warna: "krem", material: ["kayu-muda"],
    deskripsi: "Fasad skandinavia dengan atap pelana curam, dinding terang, dan aksen kayu muda yang hangat. Rumah 2 lantai tipe 70 untuk lahan lebar muka 8 m, beratap pelana, dengan warna dominan krem dan aksen kayu muda." },
  { id: "GF-0024", judul: "Skandinavia Tipe 90+, Lebar 10 m, 2 Lantai", gaya: "skandinavia", tipe: 90, lantai: 2, lebarLahan: 10, atap: "pelana", warna: "putih", material: ["kayu-muda", "batu-alam"],
    deskripsi: "Fasad skandinavia dengan atap pelana curam, dinding terang, dan aksen kayu muda yang hangat. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 10 m, beratap pelana, dengan warna dominan putih dan aksen kayu muda dan batu alam." },
  { id: "GF-0025", judul: "Klasik Modern Tipe 45, Lebar 8 m, 1 Lantai", gaya: "klasik-modern", tipe: 45, lantai: 1, lebarLahan: 8, atap: "limasan", warna: "krem", material: ["list-profil", "kolom-klasik"],
    deskripsi: "Fasad klasik modern dengan komposisi simetris, kolom sederhana, dan list profil di dinding serta jendela. Rumah 1 lantai tipe 45 untuk lahan lebar muka 8 m, beratap limasan, dengan warna dominan krem dan aksen list profil dan kolom klasik." },
  { id: "GF-0026", judul: "Klasik Modern Tipe 54, Lebar 10 m, 1 Lantai", gaya: "klasik-modern", tipe: 54, lantai: 1, lebarLahan: 10, atap: "limasan", warna: "putih", material: ["list-profil", "kolom-klasik"],
    deskripsi: "Fasad klasik modern dengan komposisi simetris, kolom sederhana, dan list profil di dinding serta jendela. Rumah 1 lantai tipe 54 untuk lahan lebar muka 10 m, beratap limasan, dengan warna dominan putih dan aksen list profil dan kolom klasik." },
  { id: "GF-0027", judul: "Klasik Modern Tipe 70, Lebar 10 m, 2 Lantai", gaya: "klasik-modern", tipe: 70, lantai: 2, lebarLahan: 10, atap: "limasan", warna: "krem", material: ["list-profil", "railing-klasik"],
    deskripsi: "Fasad klasik modern dengan komposisi simetris, kolom sederhana, dan list profil di dinding serta jendela. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap limasan, dengan warna dominan krem dan aksen list profil dan balkon railing klasik." },
  { id: "GF-0028", judul: "Klasik Modern Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "klasik-modern", tipe: 90, lantai: 2, lebarLahan: 12, atap: "limasan", warna: "putih", material: ["kolom-klasik", "list-profil"],
    deskripsi: "Fasad klasik modern dengan komposisi simetris, kolom sederhana, dan list profil di dinding serta jendela. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap limasan, dengan warna dominan putih dan aksen kolom klasik dan list profil." },
  { id: "GF-0029", judul: "Minimalis Modern Tipe 36, Lebar 6 m, 1 Lantai", gaya: "minimalis-modern", tipe: 36, lantai: 1, lebarLahan: 6, atap: "miring-satu-arah", warna: "krem", material: ["roster"],
    deskripsi: "Fasad minimalis modern dengan garis tegas, bidang kotak, dan jendela kaca besar berkusen gelap. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap miring satu arah, dengan warna dominan krem dan aksen roster." },
  { id: "GF-0030", judul: "Tropis Modern Tipe 45, Lebar 7 m, 1 Lantai", gaya: "tropis-modern", tipe: 45, lantai: 1, lebarLahan: 7, atap: "pelana", warna: "kayu-natural", material: ["roster", "kisi-kayu"],
    deskripsi: "Fasad tropis modern dengan overstek lebar yang meneduhi dinding dari panas dan hujan, dipadu tanaman tropis di halaman depan. Rumah 1 lantai tipe 45 untuk lahan lebar muka 7 m, beratap pelana, dengan warna dominan kayu natural dan aksen roster dan kisi kayu." },
  // ---- batch 2 ----
  { id: "GF-0031", batch: 2, judul: "Bugis Kontemporer Tipe 36, Lebar 6 m, 1 Lantai", gaya: "bugis-kontemporer", tipe: 36, lantai: 1, lebarLahan: 6, atap: "bugis-timpalaja", warna: "hijau-sage", material: ["kisi-kayu"],
    deskripsi: "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap pelana curam bertimpa laja' berlapis, dengan warna dominan hijau sage dan aksen kisi kayu." },
  { id: "GF-0032", batch: 2, judul: "Bugis Kontemporer Tipe 90+, Lebar 10 m, 2 Lantai", gaya: "bugis-kontemporer", tipe: 90, lantai: 2, lebarLahan: 10, atap: "bugis-timpalaja", warna: "kayu-natural", material: ["kayu", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 10 m, beratap pelana curam bertimpa laja' berlapis, dengan warna dominan kayu natural dan aksen kayu dan batu alam." },
  { id: "GF-0033", batch: 2, judul: "Bugis Kontemporer Tipe 45, Lebar 8 m, 2 Lantai", gaya: "bugis-kontemporer", tipe: 45, lantai: 2, lebarLahan: 8, atap: "bugis-timpalaja", warna: "abu-gelap", material: ["kisi-kayu", "railing-kayu-bubut"],
    deskripsi: "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad. Rumah 2 lantai tipe 45 untuk lahan lebar muka 8 m, beratap pelana curam bertimpa laja' berlapis, dengan warna dominan abu gelap dan aksen kisi kayu dan railing kayu bubut." },
  { id: "GF-0034", batch: 2, judul: "Bugis Kontemporer Tipe 70, Lebar 12 m, 1 Lantai", gaya: "bugis-kontemporer", tipe: 70, lantai: 1, lebarLahan: 12, atap: "bugis-timpalaja", warna: "terakota", material: ["kayu", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad. Rumah 1 lantai tipe 70 untuk lahan lebar muka 12 m, beratap pelana curam bertimpa laja' berlapis, dengan warna dominan terakota dan aksen kayu dan batu alam." },
  { id: "GF-0035", batch: 2, judul: "Bugis Kontemporer Tipe 54, Lebar 7 m, 2 Lantai", gaya: "bugis-kontemporer", tipe: 54, lantai: 2, lebarLahan: 7, atap: "bugis-timpalaja", warna: "putih", material: ["kayu-gelap", "railing-kayu-bubut"],
    deskripsi: "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad. Rumah 2 lantai tipe 54 untuk lahan lebar muka 7 m, beratap pelana curam bertimpa laja' berlapis, dengan warna dominan putih dan aksen kayu gelap dan railing kayu bubut." },
  { id: "GF-0036", batch: 2, judul: "Skandinavia Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "skandinavia", tipe: 90, lantai: 2, lebarLahan: 12, atap: "pelana", warna: "abu-gelap", material: ["kayu-muda", "kaca-besar"],
    deskripsi: "Fasad skandinavia dengan dinding terang atau berwarna, aksen kayu muda yang hangat, dan bentuk sederhana. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap pelana, dengan warna dominan abu gelap dan aksen kayu muda dan kaca besar." },
  { id: "GF-0037", batch: 2, judul: "Skandinavia Tipe 54, Lebar 10 m, 1 Lantai", gaya: "skandinavia", tipe: 54, lantai: 1, lebarLahan: 10, atap: "pelana", warna: "hijau-sage", material: ["kayu-muda"],
    deskripsi: "Fasad skandinavia dengan dinding terang atau berwarna, aksen kayu muda yang hangat, dan bentuk sederhana. Rumah 1 lantai tipe 54 untuk lahan lebar muka 10 m, beratap pelana, dengan warna dominan hijau sage dan aksen kayu muda." },
  { id: "GF-0038", batch: 2, judul: "Skandinavia Tipe 54, Lebar 6 m, 2 Lantai", gaya: "skandinavia", tipe: 54, lantai: 2, lebarLahan: 6, atap: "pelana", warna: "biru-navy", material: ["kayu-muda"],
    deskripsi: "Fasad skandinavia dengan dinding terang atau berwarna, aksen kayu muda yang hangat, dan bentuk sederhana. Rumah 2 lantai tipe 54 untuk lahan lebar muka 6 m, beratap pelana, dengan warna dominan biru navy dan aksen kayu muda." },
  { id: "GF-0039", batch: 2, judul: "Skandinavia Tipe 45, Lebar 7 m, 1 Lantai", gaya: "skandinavia", tipe: 45, lantai: 1, lebarLahan: 7, atap: "pelana", warna: "merah-bata", material: ["kayu-muda", "list-putih", "kaca-besar"],
    deskripsi: "Fasad skandinavia dengan dinding terang atau berwarna, aksen kayu muda yang hangat, dan bentuk sederhana. Rumah 1 lantai tipe 45 untuk lahan lebar muka 7 m, beratap pelana, dengan warna dominan merah bata dan aksen kayu muda dan list putih." },
  { id: "GF-0040", batch: 2, judul: "Skandinavia Tipe 70, Lebar 10 m, 2 Lantai", gaya: "skandinavia", tipe: 70, lantai: 2, lebarLahan: 10, atap: "pelana", warna: "abu", material: ["kayu-muda", "bata-putih"],
    deskripsi: "Fasad skandinavia dengan dinding terang atau berwarna, aksen kayu muda yang hangat, dan bentuk sederhana. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap pelana, dengan warna dominan abu dan aksen kayu muda dan bata putih." },
  { id: "GF-0041", batch: 2, judul: "Japandi Tipe 36, Lebar 7 m, 1 Lantai", gaya: "japandi", tipe: 36, lantai: 1, lebarLahan: 7, atap: "limasan", warna: "abu", material: ["kayu-terang", "kisi-vertikal"],
    deskripsi: "Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih. Rumah 1 lantai tipe 36 untuk lahan lebar muka 7 m, beratap limasan, dengan warna dominan abu dan aksen kayu terang dan kisi vertikal halus." },
  { id: "GF-0042", batch: 2, judul: "Japandi Tipe 54, Lebar 8 m, 2 Lantai", gaya: "japandi", tipe: 54, lantai: 2, lebarLahan: 8, atap: "miring-satu-arah", warna: "hitam", material: ["kayu-terang"],
    deskripsi: "Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih. Rumah 2 lantai tipe 54 untuk lahan lebar muka 8 m, beratap miring satu arah, dengan warna dominan hitam dan aksen kayu terang." },
  { id: "GF-0043", batch: 2, judul: "Japandi Tipe 45, Lebar 8 m, 1 Lantai", gaya: "japandi", tipe: 45, lantai: 1, lebarLahan: 8, atap: "pelana", warna: "earth-tone", material: ["kayu-terang", "batu-alam"],
    deskripsi: "Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih. Rumah 1 lantai tipe 45 untuk lahan lebar muka 8 m, beratap pelana, dengan warna dominan earth tone dan aksen kayu terang dan batu alam." },
  { id: "GF-0044", batch: 2, judul: "Japandi Tipe 90+, Lebar 10 m, 2 Lantai", gaya: "japandi", tipe: 90, lantai: 2, lebarLahan: 10, atap: "kombinasi", warna: "putih", material: ["kayu-terang", "batu-alam"],
    deskripsi: "Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 10 m, beratap kombinasi, dengan warna dominan putih dan aksen kayu terang dan batu alam." },
  { id: "GF-0045", batch: 2, judul: "Japandi Tipe 70, Lebar 12 m, 2 Lantai", gaya: "japandi", tipe: 70, lantai: 2, lebarLahan: 12, atap: "pelana", warna: "kayu-natural", material: ["kayu-terang", "kisi-vertikal"],
    deskripsi: "Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih. Rumah 2 lantai tipe 70 untuk lahan lebar muka 12 m, beratap pelana, dengan warna dominan kayu natural dan aksen kayu terang dan kisi vertikal halus." },
  { id: "GF-0046", batch: 2, judul: "Industrial Tipe 36, Lebar 6 m, 1 Lantai", gaya: "industrial", tipe: 36, lantai: 1, lebarLahan: 6, atap: "miring-satu-arah", warna: "abu", material: ["beton-ekspos", "rangka-besi"],
    deskripsi: "Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap miring satu arah, dengan warna dominan abu dan aksen beton ekspos dan rangka besi hitam." },
  { id: "GF-0047", batch: 2, judul: "Industrial Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "industrial", tipe: 90, lantai: 2, lebarLahan: 12, atap: "dak-datar", warna: "merah-bata", material: ["bata-ekspos", "rangka-besi"],
    deskripsi: "Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap dak datar, dengan warna dominan merah bata dan aksen bata ekspos dan rangka besi hitam." },
  { id: "GF-0048", batch: 2, judul: "Industrial Tipe 54, Lebar 7 m, 2 Lantai", gaya: "industrial", tipe: 54, lantai: 2, lebarLahan: 7, atap: "miring-satu-arah", warna: "hitam", material: ["kaca-besar", "kayu"],
    deskripsi: "Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar. Rumah 2 lantai tipe 54 untuk lahan lebar muka 7 m, beratap miring satu arah, dengan warna dominan hitam dan aksen panel kaca besar dan kayu." },
  { id: "GF-0049", batch: 2, judul: "Industrial Tipe 70, Lebar 10 m, 2 Lantai", gaya: "industrial", tipe: 70, lantai: 2, lebarLahan: 10, atap: "kombinasi", warna: "abu-gelap", material: ["beton-ekspos", "kanopi-besi"],
    deskripsi: "Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap kombinasi, dengan warna dominan abu gelap dan aksen beton ekspos dan kanopi besi." },
  { id: "GF-0050", batch: 2, judul: "Industrial Tipe 45, Lebar 8 m, 1 Lantai", gaya: "industrial", tipe: 45, lantai: 1, lebarLahan: 8, atap: "pelana", warna: "earth-tone", material: ["panel-corten", "bata-ekspos"],
    deskripsi: "Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar. Rumah 1 lantai tipe 45 untuk lahan lebar muka 8 m, beratap pelana, dengan warna dominan earth tone dan aksen panel corten berkarat dan bata ekspos." },
  { id: "GF-0051", batch: 2, judul: "Klasik Modern Tipe 90+, Lebar 10 m, 2 Lantai", gaya: "klasik-modern", tipe: 90, lantai: 2, lebarLahan: 10, atap: "kombinasi", warna: "mustard", material: ["kolom-klasik", "list-profil"],
    deskripsi: "Fasad klasik modern dengan komposisi simetris, kolom sederhana, dan list profil di dinding serta jendela. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 10 m, beratap kombinasi, dengan warna dominan mustard dan aksen kolom klasik dan list profil putih." },
  { id: "GF-0052", batch: 2, judul: "Klasik Modern Tipe 45, Lebar 7 m, 1 Lantai", gaya: "klasik-modern", tipe: 45, lantai: 1, lebarLahan: 7, atap: "limasan", warna: "biru-navy", material: ["list-profil", "kolom-klasik"],
    deskripsi: "Fasad klasik modern dengan komposisi simetris, kolom sederhana, dan list profil di dinding serta jendela. Rumah 1 lantai tipe 45 untuk lahan lebar muka 7 m, beratap limasan, dengan warna dominan biru navy dan aksen list profil putih dan kolom klasik." },
  { id: "GF-0053", batch: 2, judul: "Klasik Modern Tipe 70, Lebar 8 m, 2 Lantai", gaya: "klasik-modern", tipe: 70, lantai: 2, lebarLahan: 8, atap: "limasan", warna: "earth-tone", material: ["railing-klasik", "list-profil"],
    deskripsi: "Fasad klasik modern dengan komposisi simetris, kolom sederhana, dan list profil di dinding serta jendela. Rumah 2 lantai tipe 70 untuk lahan lebar muka 8 m, beratap limasan, dengan warna dominan earth tone dan aksen balkon railing klasik dan list profil." },
  { id: "GF-0054", batch: 2, judul: "Klasik Modern Tipe 36, Lebar 6 m, 1 Lantai", gaya: "klasik-modern", tipe: 36, lantai: 1, lebarLahan: 6, atap: "limasan", warna: "krem", material: ["list-profil", "kolom-klasik"],
    deskripsi: "Fasad klasik modern dengan komposisi simetris, kolom sederhana, dan list profil di dinding serta jendela. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap limasan, dengan warna dominan krem dan aksen list profil dan kolom klasik sederhana." },
  { id: "GF-0055", batch: 2, judul: "Minimalis Modern Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "minimalis-modern", tipe: 90, lantai: 2, lebarLahan: 12, atap: "dak-datar", warna: "hitam", material: ["kayu", "kaca-besar"],
    deskripsi: "Fasad minimalis modern dengan garis tegas, bidang kotak, dan jendela kaca besar berkusen gelap. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap dak datar, dengan warna dominan hitam dan aksen kayu dan kaca besar." },
  { id: "GF-0056", batch: 2, judul: "Minimalis Modern Tipe 54, Lebar 6 m, 2 Lantai", gaya: "minimalis-modern", tipe: 54, lantai: 2, lebarLahan: 6, atap: "kombinasi", warna: "terakota", material: ["roster", "kaca-besar"],
    deskripsi: "Fasad minimalis modern dengan garis tegas, bidang kotak, dan jendela kaca besar berkusen gelap. Rumah 2 lantai tipe 54 untuk lahan lebar muka 6 m, beratap kombinasi, dengan warna dominan terakota dan aksen roster dan kaca besar." },
  { id: "GF-0057", batch: 2, judul: "Minimalis Modern Tipe 36, Lebar 7 m, 1 Lantai", gaya: "minimalis-modern", tipe: 36, lantai: 1, lebarLahan: 7, atap: "miring-satu-arah", warna: "biru-navy", material: ["roster", "batu-alam"],
    deskripsi: "Fasad minimalis modern dengan garis tegas, bidang kotak, dan jendela kaca besar berkusen gelap. Rumah 1 lantai tipe 36 untuk lahan lebar muka 7 m, beratap miring satu arah, dengan warna dominan biru navy dan aksen roster dan batu alam." },
  { id: "GF-0058", batch: 2, judul: "Tropis Modern Tipe 90+, Lebar 10 m, 2 Lantai", gaya: "tropis-modern", tipe: 90, lantai: 2, lebarLahan: 10, atap: "limasan", warna: "abu-gelap", material: ["kayu", "batu-alam"],
    deskripsi: "Fasad tropis modern dengan overstek lebar yang meneduhi dinding dari panas dan hujan, dipadu tanaman tropis di halaman depan. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 10 m, beratap limasan, dengan warna dominan abu gelap dan aksen kayu dan batu alam." },
  { id: "GF-0059", batch: 2, judul: "Tropis Modern Tipe 45, Lebar 8 m, 1 Lantai", gaya: "tropis-modern", tipe: 45, lantai: 1, lebarLahan: 8, atap: "kombinasi", warna: "terakota", material: ["roster", "kisi-kayu"],
    deskripsi: "Fasad tropis modern dengan overstek lebar yang meneduhi dinding dari panas dan hujan, dipadu tanaman tropis di halaman depan. Rumah 1 lantai tipe 45 untuk lahan lebar muka 8 m, beratap kombinasi, dengan warna dominan terakota dan aksen roster dan kisi kayu." },
  { id: "GF-0060", batch: 2, judul: "Tropis Modern Tipe 54, Lebar 7 m, 2 Lantai", gaya: "tropis-modern", tipe: 54, lantai: 2, lebarLahan: 7, atap: "pelana", warna: "putih", material: ["kisi-kayu", "roster"],
    deskripsi: "Fasad tropis modern dengan overstek lebar yang meneduhi dinding dari panas dan hujan, dipadu tanaman tropis di halaman depan. Rumah 2 lantai tipe 54 untuk lahan lebar muka 7 m, beratap pelana, dengan warna dominan putih dan aksen kisi kayu gelap dan roster." },
  // ---- batch 3 ----
  { id: "GF-0061", batch: 3, judul: "Jawa Kontemporer Tipe 45, Lebar 8 m, 1 Lantai", gaya: "jawa-kontemporer", tipe: 45, lantai: 1, lebarLahan: 8, atap: "limasan", warna: "putih", material: ["kolom-kayu", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Jawa dengan teras emper dan kolom kayu yang disederhanakan, dipadu dinding plester. Rumah 1 lantai tipe 45 untuk lahan lebar muka 8 m, beratap limasan, dengan warna dominan putih dan aksen kolom kayu sederhana dan batu alam." },
  { id: "GF-0062", batch: 3, judul: "Jawa Kontemporer Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "jawa-kontemporer", tipe: 90, lantai: 2, lebarLahan: 12, atap: "joglo", warna: "earth-tone", material: ["kolom-soko", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Jawa dengan teras emper dan kolom kayu yang disederhanakan, dipadu dinding plester. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap joglo modern, dengan warna dominan earth tone dan aksen kolom soko kayu dan batu alam." },
  { id: "GF-0063", batch: 3, judul: "Bali Kontemporer Tipe 54, Lebar 10 m, 1 Lantai", gaya: "bali-kontemporer", tipe: 54, lantai: 1, lebarLahan: 10, atap: "kombinasi", warna: "krem", material: ["batu-paras", "roster-batu"],
    deskripsi: "Rumah tinggal bergaya Bali kontemporer dengan batu paras, overstek lebar, dan detail kayu yang hangat. Rumah 1 lantai tipe 54 untuk lahan lebar muka 10 m, beratap kombinasi, dengan warna dominan krem dan aksen batu paras dan roster batu." },
  { id: "GF-0064", batch: 3, judul: "Bali Kontemporer Tipe 70, Lebar 8 m, 2 Lantai", gaya: "bali-kontemporer", tipe: 70, lantai: 2, lebarLahan: 8, atap: "bali-bertingkat", warna: "terakota", material: ["batu-paras", "kosen-kayu"],
    deskripsi: "Rumah tinggal bergaya Bali kontemporer dengan batu paras, overstek lebar, dan detail kayu yang hangat. Rumah 2 lantai tipe 70 untuk lahan lebar muka 8 m, beratap bertingkat khas Bali, dengan warna dominan terakota dan aksen batu paras dan kosen kayu." },
  { id: "GF-0065", batch: 3, judul: "Betawi Kontemporer Tipe 36, Lebar 6 m, 1 Lantai", gaya: "betawi-kontemporer", tipe: 36, lantai: 1, lebarLahan: 6, atap: "atap-kebaya", warna: "hijau-sage", material: ["roster-ukir", "kisi-kayu"],
    deskripsi: "Interpretasi kontemporer rumah Betawi dengan selasar depan dan aksen ukir yang ditahan. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap atap kebaya, dengan warna dominan hijau sage dan aksen roster ukir dan kisi kayu." },
  { id: "GF-0066", batch: 3, judul: "Betawi Kontemporer Tipe 70, Lebar 10 m, 2 Lantai", gaya: "betawi-kontemporer", tipe: 70, lantai: 2, lebarLahan: 10, atap: "limasan", warna: "mustard", material: ["lisplang-ukir", "kolom-sederhana"],
    deskripsi: "Interpretasi kontemporer rumah Betawi dengan selasar depan dan aksen ukir yang ditahan. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap limasan, dengan warna dominan mustard dan aksen lisplang ukir dan kolom sederhana." },
  { id: "GF-0067", batch: 3, judul: "Sunda Kontemporer Tipe 45, Lebar 7 m, 1 Lantai", gaya: "sunda-kontemporer", tipe: 45, lantai: 1, lebarLahan: 7, atap: "julang-ngapak", warna: "abu", material: ["kayu", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Sunda dengan atap julang ngapak yang melebar seperti sayap. Rumah 1 lantai tipe 45 untuk lahan lebar muka 7 m, beratap julang ngapak, dengan warna dominan abu dan aksen kayu dan batu alam." },
  { id: "GF-0068", batch: 3, judul: "Sunda Kontemporer Tipe 90+, Lebar 10 m, 2 Lantai", gaya: "sunda-kontemporer", tipe: 90, lantai: 2, lebarLahan: 10, atap: "julang-ngapak", warna: "hitam", material: ["kayu-gelap", "kaca-besar"],
    deskripsi: "Interpretasi kontemporer rumah Sunda dengan atap julang ngapak yang melebar seperti sayap. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 10 m, beratap julang ngapak, dengan warna dominan hitam dan aksen kayu gelap dan kaca besar." },
  { id: "GF-0069", batch: 3, judul: "Minang Kontemporer Tipe 54, Lebar 8 m, 1 Lantai", gaya: "minang-kontemporer", tipe: 54, lantai: 1, lebarLahan: 8, atap: "gonjong", warna: "merah-bata", material: ["lisplang-ukir", "batu-alam"],
    deskripsi: "Rumah tinggal kontemporer dengan puncak gonjong khas Minangkabau sebagai aksen atap. Rumah 1 lantai tipe 54 untuk lahan lebar muka 8 m, beratap gonjong, dengan warna dominan merah bata dan aksen lisplang ukir dan batu alam." },
  { id: "GF-0070", batch: 3, judul: "Minang Kontemporer Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "minang-kontemporer", tipe: 90, lantai: 2, lebarLahan: 12, atap: "gonjong", warna: "abu-gelap", material: ["lisplang-ukir", "kayu"],
    deskripsi: "Rumah tinggal kontemporer dengan puncak gonjong khas Minangkabau sebagai aksen atap. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap gonjong, dengan warna dominan abu gelap dan aksen lisplang ukir dan kayu." },
  { id: "GF-0071", batch: 3, judul: "Melayu Kontemporer Tipe 36, Lebar 7 m, 1 Lantai", gaya: "melayu-kontemporer", tipe: 36, lantai: 1, lebarLahan: 7, atap: "limas-melayu", warna: "biru-navy", material: ["sisik-angin", "kisi-kayu"],
    deskripsi: "Interpretasi kontemporer rumah Melayu dengan atap limas dan ornamen ukir yang sederhana. Rumah 1 lantai tipe 36 untuk lahan lebar muka 7 m, beratap limas Melayu, dengan warna dominan biru navy dan aksen sisik angin ukir dan kisi kayu." },
  { id: "GF-0072", batch: 3, judul: "Melayu Kontemporer Tipe 36, Lebar 6 m, 2 Lantai", gaya: "melayu-kontemporer", tipe: 36, lantai: 2, lebarLahan: 6, atap: "limas-bertingkat", warna: "mustard", material: ["lisplang-ukir", "kisi-kayu"],
    deskripsi: "Interpretasi kontemporer rumah Melayu dengan atap limas dan ornamen ukir yang sederhana. Rumah 2 lantai tipe 36 untuk lahan lebar muka 6 m, beratap limas bertingkat khas Palembang, dengan warna dominan mustard dan aksen lisplang ukir dan kisi kayu." },
  { id: "GF-0073", batch: 3, judul: "Batak Kontemporer Tipe 45, Lebar 7 m, 1 Lantai", gaya: "batak-kontemporer", tipe: 45, lantai: 1, lebarLahan: 7, atap: "pelana-batak", warna: "merah-bata", material: ["papan-gable-ukir", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Batak dengan atap pelana curam bersuhul dan gable berukir minimal. Rumah 1 lantai tipe 45 untuk lahan lebar muka 7 m, beratap pelana curam bersuhul khas Batak, dengan warna dominan merah bata dan aksen papan gable ukir dan batu alam." },
  { id: "GF-0074", batch: 3, judul: "Batak Kontemporer Tipe 70, Lebar 8 m, 2 Lantai", gaya: "batak-kontemporer", tipe: 70, lantai: 2, lebarLahan: 8, atap: "pelana-batak", warna: "abu", material: ["papan-gable-ukir", "kisi-kayu"],
    deskripsi: "Interpretasi kontemporer rumah Batak dengan atap pelana curam bersuhul dan gable berukir minimal. Rumah 2 lantai tipe 70 untuk lahan lebar muka 8 m, beratap pelana curam bersuhul khas Batak, dengan warna dominan abu dan aksen papan gable ukir dan kisi kayu." },
  { id: "GF-0075", batch: 3, judul: "Banjar Kontemporer Tipe 54, Lebar 12 m, 1 Lantai", gaya: "banjar-kontemporer", tipe: 54, lantai: 1, lebarLahan: 12, atap: "bubungan-tinggi", warna: "terakota", material: ["lisplang-ukir", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Banjar dengan atap bubungan tinggi yang curam dan menjulang. Rumah 1 lantai tipe 54 untuk lahan lebar muka 12 m, beratap bubungan tinggi, dengan warna dominan terakota dan aksen lisplang ukir dan batu alam." },
  { id: "GF-0076", batch: 3, judul: "Banjar Kontemporer Tipe 90+, Lebar 12 m, 2 Lantai", gaya: "banjar-kontemporer", tipe: 90, lantai: 2, lebarLahan: 12, atap: "bubungan-tinggi", warna: "earth-tone", material: ["lisplang-ukir", "kayu"],
    deskripsi: "Interpretasi kontemporer rumah Banjar dengan atap bubungan tinggi yang curam dan menjulang. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap bubungan tinggi, dengan warna dominan earth tone dan aksen lisplang ukir dan kayu." },
  { id: "GF-0077", batch: 3, judul: "Toraja Kontemporer Tipe 36, Lebar 6 m, 1 Lantai", gaya: "toraja-kontemporer", tipe: 36, lantai: 1, lebarLahan: 6, atap: "tongkonan", warna: "abu-gelap", material: ["kayu", "ornamen-geometris"],
    deskripsi: "Rumah tinggal kontemporer dengan satu atap berbentuk perahu khas tongkonan Toraja. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap berbentuk perahu khas tongkonan, dengan warna dominan abu gelap dan aksen kayu dan ornamen geometris sederhana." },
  { id: "GF-0078", batch: 3, judul: "Toraja Kontemporer Tipe 54, Lebar 7 m, 2 Lantai", gaya: "toraja-kontemporer", tipe: 54, lantai: 2, lebarLahan: 7, atap: "tongkonan", warna: "hitam", material: ["kayu", "batu-alam"],
    deskripsi: "Rumah tinggal kontemporer dengan satu atap berbentuk perahu khas tongkonan Toraja. Rumah 2 lantai tipe 54 untuk lahan lebar muka 7 m, beratap berbentuk perahu khas tongkonan, dengan warna dominan hitam dan aksen kayu dan batu alam." },
  { id: "GF-0079", batch: 3, judul: "Manado Kontemporer Tipe 45, Lebar 6 m, 1 Lantai", gaya: "manado-kontemporer", tipe: 45, lantai: 1, lebarLahan: 6, atap: "pelana-curam", warna: "biru-navy", material: ["papan-kayu-horizontal", "roster"],
    deskripsi: "Interpretasi kontemporer rumah Minahasa dengan pelana curam dan aksen papan kayu. Rumah 1 lantai tipe 45 untuk lahan lebar muka 6 m, beratap pelana curam khas Minahasa, dengan warna dominan biru navy dan aksen papan kayu horizontal dan roster." },
  { id: "GF-0080", batch: 3, judul: "Manado Kontemporer Tipe 70, Lebar 10 m, 2 Lantai", gaya: "manado-kontemporer", tipe: 70, lantai: 2, lebarLahan: 10, atap: "pelana-curam", warna: "hijau-sage", material: ["papan-kayu", "kaca-besar"],
    deskripsi: "Interpretasi kontemporer rumah Minahasa dengan pelana curam dan aksen papan kayu. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap pelana curam khas Minahasa, dengan warna dominan hijau sage dan aksen papan kayu dan kaca besar." },
  { id: "GF-0081", batch: 4, judul: "Jawa Kontemporer Tipe 70, Lebar 10 m, 2 Lantai", gaya: "jawa-kontemporer", tipe: 70, lantai: 2, lebarLahan: 10, atap: "limasan", warna: "krem", material: ["kolom-kayu", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Jawa dengan teras emper dan kolom kayu yang disederhanakan, dipadu dinding plester. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap limasan, dengan warna dominan krem dan aksen kolom kayu sederhana dan batu alam." },
  { id: "GF-0082", batch: 4, judul: "Sunda Kontemporer Tipe 70, Lebar 8 m, 2 Lantai", gaya: "sunda-kontemporer", tipe: 70, lantai: 2, lebarLahan: 8, atap: "julang-ngapak", warna: "putih", material: ["kayu", "batu-alam"],
    deskripsi: "Interpretasi kontemporer rumah Sunda dengan atap julang ngapak yang melebar seperti sayap. Rumah 2 lantai tipe 70 untuk lahan lebar muka 8 m, beratap julang ngapak, dengan warna dominan putih dan aksen kayu dan batu alam." },
  { id: "GF-0083", batch: 4, judul: "Bali Kontemporer Tipe 36, Lebar 6 m, 1 Lantai", gaya: "bali-kontemporer", tipe: 36, lantai: 1, lebarLahan: 6, atap: "kombinasi", warna: "putih", material: ["batu-paras", "roster-batu"],
    deskripsi: "Rumah tinggal bergaya Bali kontemporer dengan batu paras, overstek lebar, dan detail kayu yang hangat. Rumah 1 lantai tipe 36 untuk lahan lebar muka 6 m, beratap kombinasi, dengan warna dominan putih dan aksen batu paras dan roster batu." },
  { id: "GF-0084", batch: 4, judul: "Minang Kontemporer Tipe 70, Lebar 10 m, 2 Lantai", gaya: "minang-kontemporer", tipe: 70, lantai: 2, lebarLahan: 10, atap: "gonjong", warna: "krem", material: ["lisplang-ukir", "batu-alam"],
    deskripsi: "Rumah tinggal kontemporer dengan puncak gonjong khas Minangkabau sebagai aksen atap. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap gonjong, dengan warna dominan krem dan aksen lisplang ukir dan batu alam." },
  { id: "GF-0085", batch: 5, judul: "Farmhouse Modern Tipe 70, Lebar 10 m, 2 Lantai", gaya: "farmhouse-modern", tipe: 70, lantai: 2, lebarLahan: 10, atap: "pelana", warna: "putih", material: ["papan-kayu", "kaca-besar"],
    deskripsi: "Tafsir ulang farmhouse: dinding papan kayu putih, atap pelana curam, teras depan beratap, dan pagar kayu rendah. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap pelana, dengan warna dominan putih dan aksen papan kayu dan kaca besar." },
  { id: "GF-0086", batch: 5, judul: "English Country Tipe 90, Lebar 12 m, 2 Lantai", gaya: "inggris-country", tipe: 90, lantai: 2, lebarLahan: 12, atap: "pelana-curam", warna: "krem", material: ["bata-ekspos", "batu-alam"],
    deskripsi: "Gaya pedesaan Inggris: bata ekspos, batu alam, atap pelana curam dengan dormer, dan komposisi simetris. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap pelana curam, dengan warna dominan krem dan aksen bata ekspos dan batu alam." },
  { id: "GF-0087", batch: 5, judul: "Organik Modern Tipe 70, Lebar 10 m, 2 Lantai", gaya: "organik-modern", tipe: 70, lantai: 2, lebarLahan: 10, atap: "kombinasi", warna: "earth-tone", material: ["batu-alam", "kayu"],
    deskripsi: "Fasad biomorphic: bentuk melengkung dan dinamis, dinding earth tone, atap kombinasi, dan banyak tanaman. Rumah 2 lantai tipe 70 untuk lahan lebar muka 10 m, beratap kombinasi, dengan warna dominan earth tone dan aksen batu alam dan kayu." },
  { id: "GF-0088", batch: 5, judul: "Resort Modern Tipe 90, Lebar 12 m, 2 Lantai", gaya: "resort-modern", tipe: 90, lantai: 2, lebarLahan: 12, atap: "limasan", warna: "krem", material: ["batu-alam", "kaca-besar"],
    deskripsi: "Suasana vila resort: overstek lebar, batu alam, kaca besar dari lantai ke langit-langit, dan teras deck kayu. Rumah 2 lantai tipe 90+ untuk lahan lebar muka 12 m, beratap limasan, dengan warna dominan krem dan aksen batu alam dan kaca besar." },
];

/**
 * Pengecualian: GF-ID atau batch di src/data/dikecualikan.json tidak tampil di situs,
 * dan gambarnya juga tidak ikut build (scripts/gambar-publik.py & vite.config.ts membaca file yang sama).
 */
// Pengecualian: entri yang tercantum di src/data/dikecualikan.json dibuang dari sumber
// file ini saat build/dev oleh plugin 'gf-kecuali' di vite.config.ts (tidak ada jejak di bundle).
export const FASAD: Fasad[] = SEMUA_FASAD;
