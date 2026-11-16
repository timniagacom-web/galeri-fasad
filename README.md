# Galeri.Fasad — situs statis

Vite 5 + React 18 + TypeScript, HashRouter (`/#/fasad/GF-0001` bisa dibuka langsung di hosting statis mana pun). Tidak ada backend, login, formulir, harga, atau panggilan API.

## Menjalankan
```bash
cd /workspace/saaslab/galeri-fasad/site
npm install            # sekali saja
npm run dev            # mode pengembangan
npm run build          # hasil statis di dist/
npm run preview        # pratinjau dist/ di http://127.0.0.1:4173/
node _screenshots/shoot.mjs   # screenshot 360/375/1280 + cek overflow/target sentuh/gambar rusak (preview harus menyala)
```
`dist/` diunggah ke akar domain (Vite `base: '/'`). **Deploy hanya dengan persetujuan owner.**

## Konfigurasi — `src/config.ts`
- `WA_NUMBER` — nomor wa.me tanpa `+` (sekarang `12059971193`). Kosongkan → semua tombol jadi "WhatsApp segera tersedia".
- `SITE_URL` — sekarang `https://galeri.gambarexpress.id` (canonical/OG).

## Menambah fasad baru
1. Konversi gambar yang sudah disetujui owner: `python3 scripts/konversi-gambar.py <folder berisi GF-xxxx.jpeg>`. Hasilnya `public/fasad/GF-xxxx.webp` (1600×1200, crop tengah 4:3, kualitas 80) dan `public/fasad/thumb/GF-xxxx.webp` (640×480, untuk kartu via srcset).
2. Tambah satu objek di akhir array `FASAD` di `src/data/fasad.ts` (id unik berurutan; nilai gaya/atap/warna/material harus dari `src/data/taxonomy.ts`).
3. `npm run build`. Bila gambar belum ada, kartu otomatis menampilkan placeholder "Gambar menyusul".

## Rute
`#/` · `#/galeri?gaya=..&tipe=..&lantai=..&lebar=..&atap=..&warna=..` · `#/gaya/:slug` · `#/fasad/:id` · `#/disimpan` · `#/bandingkan?ids=GF-0001,GF-0002` · `#/kontraktor` · `#/tentang`

## Varian palet warna (ganti tema warna per model)
- 8 palet didefinisikan di `src/data/taxonomy.ts` (`PALET`: id, label, swatch hex).
- Tambah varian: simpan `public/fasad/GF-xxxx-<palet>.webp`, lalu di `src/data/fasad.ts` isi `varian: { sage: 'fasad/GF-xxxx-sage.webp' }`. Palet tanpa entri tidak tampil.
- Halaman detail menampilkan bulatan warna (radiogroup, bisa pakai panah keyboard). Pilihan masuk ke URL (`#/fasad/GF-0001?palet=sage`) dan ke pesan WhatsApp.
- Galeri punya filter "Punya varian warna".
- Konversi varian: `python3 scripts/konversi-gambar.py ../gambar/varian/<folder> [--skip bata] [--only sage,navy]` (nama sumber `GF-xxxx-<palet>.jpeg`; `-asli` dan file lain diabaikan). Skrip mencetak potongan `varian: {...}` untuk ditempel ke `src/data/fasad.ts`.
- Terpasang: GF-0012 (earth, gelap, putih, sage, navy, beton, mustard); `bata` belum (akan dibuat ulang).

## Publikasi (GitHub Pages) — pratinjau sementara

Disetujui owner 16 Nov 2026, 12:45 WITA. Hostinger dibatalkan (akun tanpa paket hosting).

- **Repo:** `https://github.com/timniagacom-web/galeri-fasad` (publik, hanya isi situs; `node_modules/`, `.env`, dan folder `gambar/raw` tidak di-push).
- **Domain kustom:** `https://galeri.gambarexpress.id` — file `public/CNAME` berisi `galeri.gambarexpress.id`. DNS (CNAME) diatur owner di DomaiNesia; target CNAME: `timniagacom-web.github.io`.
- **URL sementara GitHub Pages (sebelum DNS hidup):** `https://timniagacom-web.github.io/galeri-fasad/` — aset mungkin tidak lengkap di URL ini karena `base` Vite adalah `/` (untuk domain kustom di akar). Setelah DNS CNAME aktif, pakai `https://galeri.gambarexpress.id/`.
- **Branch Pages:** `gh-pages` (hanya hasil `dist/` + `.nojekyll` + `CNAME`).
- **SEO pratinjau:** `index.html` punya `<meta name="robots" content="noindex, nofollow">` dan `public/robots.txt` berisi `Disallow: /`. **Hapus keduanya saat peluncuran resmi**, lalu pastikan sitemap mengarah ke domain final.

Redeploy: `npm run build`, lalu push isi `dist/` ke branch `gh-pages`.

## Proteksi gambar & build internal (16 Nov 2026)

**Gambar asli** sekarang di `media/fasad/` (BUKAN `public/`), jadi tidak ikut ter-deploy di build publik. `scripts/konversi-gambar.py` menulis ke sana.

| Perintah | Hasil |
|---|---|
| `npm run build` | build **publik** → `dist/` (gambar watermark 1200px/480px, nama hash `g/<hash>.webp`, dibuat oleh `scripts/gambar-publik.py`) |
| `npm run build:internal` | build **internal** → `dist-internal/`, base `/int-<token>/`, gambar asli tanpa proteksi, noindex, banner merah |
| `npm run build:semua` | keduanya + rakit `deploy-out/` (HANYA publik + `.nojekyll`, `CNAME`) dan `deploy-internal/int-<token>/` (TIDAK untuk GitHub Pages) + cek kebocoran (gagal bila ada gambar asli, token baru/lama, folder `int-*`, atau ID yang dikecualikan di `deploy-out/`) |
| `npm run preview:deploy` | sajikan `deploy-out/` di http://127.0.0.1:4175/ (meniru GitHub Pages) |
| `npm run preview:internal` | sajikan `deploy-internal/` di http://127.0.0.1:4176/int-<token>/ |
| `node _screenshots/uji-proteksi.mjs` | uji otomatis proteksi publik vs internal (butuh `preview:deploy`) |

- Token internal ada di `.internal-token` (jangan dibagikan/di-commit). Token lama disimpan di `.internal-token.lama` hanya untuk cek kebocoran. **Sejak 16 Nov 2026 build internal TIDAK lagi diunggah ke GitHub Pages**; hanya dibuka lokal atau di host yang memakai login.
- Proteksi publik (aktif hanya bila `__GF_INTERNAL__` false): `src/lib/proteksi.ts`, `src/components/FasadImage.tsx`, CSS bagian "Proteksi gambar".
- **Deploy** (dari laptop owner, gh sudah login): salin isi `deploy-out/` (mis. sebagai zip) ke clone branch `gh-pages` di `C:\Users\Hajar\galeri-fasad-publish\pages`, hapus isi lama kecuali `.git`, ekstrak, `git add -A; git commit; git push origin gh-pages`.
- Riwayat repo ditulis ulang 16 Nov 2026 (orphan commit) untuk membuang gambar asli & token lama. `.gitignore` menolak semua file gambar raster, `media/`, token, dan hasil build.

## Mengecualikan fasad (mis. minta diulang)
Edit `src/data/dikecualikan.json`:
- `"id": ["GF-0033","GF-0034","GF-0039"]` → hanya ID itu yang dikeluarkan;
- `"batch": [2]` → seluruh batch 2 dikeluarkan.
Lalu `npm run build:semua`. Entri dibuang dari bundle JS (plugin `gf-kecuali`), gambarnya tidak ikut build publik/internal,
dan `rakit-deploy.mjs` gagal bila ID yang dikecualikan masih tersisa di `deploy-out/`.
Untuk memasang batch berikutnya: `python3 scripts/tambah-batch.py <metadata.csv> <nomor-batch>` lalu `python3 scripts/konversi-gambar.py <folder-raw>`.
