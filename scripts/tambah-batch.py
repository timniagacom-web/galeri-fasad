#!/usr/bin/env python3
"""
Tambah entri fasad dari CSV metadata sebuah batch ke src/data/fasad.ts (ID yang sudah ada dilewati).
  python3 scripts/tambah-batch.py <metadata.csv> 2
Judul & deskripsi disusun dari atribut (templat, sama dengan batch 1). Penyesuaian metadata agar cocok
dengan gambar diisi di KOREKSI (per ID) sebelum dijalankan.
"""
import csv, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FASAD_TS = ROOT / "src" / "data" / "fasad.ts"

ATAP = {'dak datar': 'dak-datar', 'kombinasi': 'kombinasi', 'miring satu arah': 'miring-satu-arah', 'pelana': 'pelana', 'limasan': 'limasan', "bugis timpa laja' berlapis": 'bugis-timpalaja',
        # batch 3
        'joglo': 'joglo', 'gonjong': 'gonjong', 'julang ngapak': 'julang-ngapak', 'atap kebaya': 'atap-kebaya', 'limas Melayu': 'limas-melayu',
        'limas bertingkat Palembang': 'limas-bertingkat', 'bubungan tinggi': 'bubungan-tinggi', 'atap bertingkat Bali': 'bali-bertingkat',
        'atap perahu tongkonan': 'tongkonan', 'pelana Batak bersuhul': 'pelana-batak', 'pelana curam Minahasa': 'pelana-curam'}
ATAPL = {'dak-datar': 'dak datar', 'kombinasi': 'kombinasi', 'miring-satu-arah': 'miring satu arah', 'pelana': 'pelana', 'limasan': 'limasan', 'bugis-timpalaja': "pelana curam bertimpa laja' berlapis",
         'joglo': 'joglo modern', 'gonjong': 'gonjong', 'julang-ngapak': 'julang ngapak', 'atap-kebaya': 'atap kebaya', 'limas-melayu': 'limas Melayu',
         'limas-bertingkat': 'limas bertingkat khas Palembang', 'bubungan-tinggi': 'bubungan tinggi', 'bali-bertingkat': 'bertingkat khas Bali',
         'tongkonan': 'berbentuk perahu khas tongkonan', 'pelana-batak': 'pelana curam bersuhul khas Batak', 'pelana-curam': 'pelana curam khas Minahasa'}
WARNA = {'abu': 'abu', 'putih': 'putih', 'hitam': 'hitam', 'earth tone': 'earth-tone', 'kayu natural': 'kayu-natural', 'krem': 'krem',
         'abu gelap': 'abu-gelap', 'hijau sage': 'hijau-sage', 'biru navy': 'biru-navy', 'terakota': 'terakota', 'merah bata': 'merah-bata', 'mustard': 'mustard'}
MAT = {'batu alam': 'batu-alam', 'kisi kayu': 'kisi-kayu', 'panel kayu': 'panel-kayu', 'kaca besar': 'kaca-besar', 'panel kaca besar': 'kaca-besar', 'roster': 'roster',
       'railing kayu bubut': 'railing-kayu-bubut', 'kayu': 'kayu', 'kayu terang': 'kayu-terang', 'kisi vertikal halus': 'kisi-vertikal', 'bata ekspos': 'bata-ekspos',
       'rangka besi hitam': 'rangka-besi', 'beton ekspos': 'beton-ekspos', 'kanopi besi': 'kanopi-besi', 'kayu muda': 'kayu-muda', 'list profil': 'list-profil',
       'kolom klasik': 'kolom-klasik', 'balkon railing klasik': 'railing-klasik',
       # batch 2
       'kayu gelap': 'kayu-gelap', 'bata putih': 'bata-putih', 'list putih': 'list-putih', 'list profil putih': 'list-profil',
       'kolom klasik sederhana': 'kolom-klasik', 'panel corten berkarat': 'panel-corten', 'kisi kayu gelap': 'kisi-kayu',
       # batch 3
       'kolom kayu sederhana': 'kolom-kayu', 'kolom soko kayu': 'kolom-soko', 'batu paras': 'batu-paras', 'roster batu': 'roster-batu', 'kosen kayu': 'kosen-kayu',
       'roster ukir': 'roster-ukir', 'lisplang ukir': 'lisplang-ukir', 'kolom sederhana': 'kolom-sederhana', 'sisik angin ukir': 'sisik-angin',
       'papan gable ukir': 'papan-gable-ukir', 'ornamen geometris sederhana': 'ornamen-geometris', 'papan kayu horizontal': 'papan-kayu-horizontal', 'papan kayu': 'papan-kayu'}
GAYAL = {'minimalis-modern': 'Minimalis Modern', 'tropis-modern': 'Tropis Modern', 'bugis-kontemporer': 'Bugis Kontemporer', 'japandi': 'Japandi', 'industrial': 'Industrial', 'skandinavia': 'Skandinavia', 'klasik-modern': 'Klasik Modern',
         'jawa-kontemporer': 'Jawa Kontemporer', 'bali-kontemporer': 'Bali Kontemporer', 'betawi-kontemporer': 'Betawi Kontemporer', 'sunda-kontemporer': 'Sunda Kontemporer',
         'minang-kontemporer': 'Minang Kontemporer', 'melayu-kontemporer': 'Melayu Kontemporer', 'batak-kontemporer': 'Batak Kontemporer', 'banjar-kontemporer': 'Banjar Kontemporer',
         'toraja-kontemporer': 'Toraja Kontemporer', 'manado-kontemporer': 'Manado Kontemporer'}
GS = {'minimalis-modern': 'Fasad minimalis modern dengan garis tegas, bidang kotak, dan jendela kaca besar berkusen gelap.',
      'tropis-modern': 'Fasad tropis modern dengan overstek lebar yang meneduhi dinding dari panas dan hujan, dipadu tanaman tropis di halaman depan.',
      'bugis-kontemporer': "Interpretasi kontemporer rumah Bugis dengan timpa laja' berlapis di puncak atap sebagai aksen utama fasad.",
      'japandi': 'Fasad Japandi yang tenang: kayu warna terang dan komposisi sederhana tanpa ornamen berlebih.',
      'industrial': 'Fasad industrial yang jujur material dengan rangka besi gelap dan bidang kaca lebar.',
      'skandinavia': 'Fasad skandinavia dengan dinding terang atau berwarna, aksen kayu muda yang hangat, dan bentuk sederhana.',
      'klasik-modern': 'Fasad klasik modern dengan komposisi simetris, kolom sederhana, dan list profil di dinding serta jendela.',
      'jawa-kontemporer': 'Interpretasi kontemporer rumah Jawa dengan teras emper dan kolom kayu yang disederhanakan, dipadu dinding plester.',
      'bali-kontemporer': 'Rumah tinggal bergaya Bali kontemporer dengan batu paras, overstek lebar, dan detail kayu yang hangat.',
      'betawi-kontemporer': 'Interpretasi kontemporer rumah Betawi dengan selasar depan dan aksen ukir yang ditahan.',
      'sunda-kontemporer': 'Interpretasi kontemporer rumah Sunda dengan atap julang ngapak yang melebar seperti sayap.',
      'minang-kontemporer': 'Rumah tinggal kontemporer dengan puncak gonjong khas Minangkabau sebagai aksen atap.',
      'melayu-kontemporer': 'Interpretasi kontemporer rumah Melayu dengan atap limas dan ornamen ukir yang sederhana.',
      'batak-kontemporer': 'Interpretasi kontemporer rumah Batak dengan atap pelana curam bersuhul dan gable berukir minimal.',
      'banjar-kontemporer': 'Interpretasi kontemporer rumah Banjar dengan atap bubungan tinggi yang curam dan menjulang.',
      'toraja-kontemporer': 'Rumah tinggal kontemporer dengan satu atap berbentuk perahu khas tongkonan Toraja.',
      'manado-kontemporer': 'Interpretasi kontemporer rumah Minahasa dengan pelana curam dan aksen papan kayu.'}
WARNAT = {'earth-tone': 'earth tone', 'kayu-natural': 'kayu natural', 'abu-gelap': 'abu gelap', 'hijau-sage': 'hijau sage', 'biru-navy': 'biru navy', 'merah-bata': 'merah bata'}
KOREKSI: dict = {}  # mis. {'GF-0059': {'atap': 'miring satu arah'}} — nilai mentah seperti di CSV


def main(csv_path, batch):
    ts = FASAD_TS.read_text()
    ada = set(l.split('"')[3] for l in ts.splitlines() if l.strip().startswith('{ id: "GF-'))
    q = lambda s: json.dumps(s, ensure_ascii=False)
    out = []
    for r in csv.DictReader(open(csv_path)):
        if r['id'] in ada:
            continue
        r.update(KOREKSI.get(r['id'], {}))
        g, l, t, w = r['gaya'], int(r['lantai']), int(r['tipe']), int(r['lebar'])
        a, c = ATAP[r['atap']], WARNA[r['warna']]
        mats = [MAT[m.strip()] for m in r['material'].split(' dan ')]
        tl = '90+' if t >= 90 else str(t)
        judul = f"{GAYAL[g]} Tipe {tl}, Lebar {w} m, {l} Lantai"
        desk = f"{GS[g]} Rumah {l} lantai tipe {tl} untuk lahan lebar muka {w} m, beratap {ATAPL[a]}, dengan warna dominan {WARNAT.get(c, c)} dan aksen {r['material']}."
        out.append(f"  {{ id: {q(r['id'])}, batch: {batch}, judul: {q(judul)}, gaya: {q(g)}, tipe: {t}, lantai: {l}, lebarLahan: {w}, atap: {q(a)}, warna: {q(c)}, material: {q(mats)},\n    deskripsi: {q(desk)} }},")
    if not out:
        print("tidak ada entri baru"); return
    i = ts.rindex('];')
    ts = ts[:i] + f"  // ---- batch {batch} ----\n" + "\n".join(out) + "\n" + ts[i:]
    FASAD_TS.write_text(ts)
    print(f"{len(out)} entri ditambahkan (batch {batch})")


if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]))
