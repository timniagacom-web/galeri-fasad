#!/usr/bin/env python3
"""
Konversi gambar fasad yang SUDAH DISETUJUI OWNER ke format situs.

  python3 scripts/konversi-gambar.py ../gambar/batch-01/raw                       # gambar utama GF-xxxx.jpeg
  python3 scripts/konversi-gambar.py ../gambar/varian/pilot --skip bata          # varian GF-xxxx-<palet>.jpeg
  python3 scripts/konversi-gambar.py ../gambar/varian/batch-02 --only sage,navy  # hanya palet tertentu

Konvensi nama file sumber (.jpeg/.jpg/.png/.webp):
  GF-xxxx.<ext>          → gambar utama
  GF-xxxx-<palet>.<ext>  → varian warna; <palet> harus salah satu id PALET di src/data/taxonomy.ts
  GF-xxxx-asli.<ext>     → diabaikan (gambar asli sudah dipasang sebagai GF-xxxx.webp)
File lain (mis. review-*.jpg) diabaikan.

Keluaran:
  media/fasad/<nama>.webp         1600x1200 (crop tengah ke 4:3), kualitas 80
  media/fasad/thumb/<nama>.webp    640x480, kualitas 75 (kartu galeri / layar kecil via srcset)
Setelah konversi varian, daftarkan di src/data/fasad.ts: varian: { sage: 'fasad/GF-xxxx-sage.webp', ... }.
Skrip mencetak potongan entri itu untuk disalin.
"""
import argparse
import re
from collections import defaultdict
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
# gambar ASLI disimpan di media/ (BUKAN public/) agar tidak ikut ter-deploy di build publik
OUT, THUMB = ROOT / "media" / "fasad", ROOT / "media" / "fasad" / "thumb"
# samakan dengan PALET di src/data/taxonomy.ts
PALET = ["earth", "gelap", "putih", "sage", "navy", "beton", "mustard", "bata"]
POLA = re.compile(r"^(GF-\d{4})(?:-([a-z]+))?$")


def crop43(im):
    w, h = im.size
    if w / h > 4 / 3:
        nw = round(h * 4 / 3); x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w * 3 / 4); y = (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src", nargs="?", default=str(ROOT.parent / "gambar" / "batch-01" / "raw"))
    ap.add_argument("--skip", default="", help="palet yang dilewati, pisahkan koma (mis. bata)")
    ap.add_argument("--only", default="", help="hanya palet ini, pisahkan koma")
    ap.add_argument("--tanpa-utama", action="store_true", help="lewati gambar utama GF-xxxx (hanya varian)")
    a = ap.parse_args()
    skip = {s for s in a.skip.split(",") if s}
    only = {s for s in a.only.split(",") if s}
    for s in skip | only:
        if s not in PALET:
            ap.error(f"palet tidak dikenal: {s}")

    OUT.mkdir(parents=True, exist_ok=True); THUMB.mkdir(parents=True, exist_ok=True)
    varian = defaultdict(list); n = 0
    for p in sorted(Path(a.src).iterdir()):
        if p.suffix.lower() not in {".jpeg", ".jpg", ".png", ".webp"}:
            continue
        m = POLA.match(p.stem)
        if not m:
            print("lewati (nama tidak sesuai konvensi):", p.name); continue
        fid, pal = m.groups()
        if pal == "asli":
            print("lewati (asli):", p.name); continue
        if pal and pal not in PALET:
            print("lewati (palet tidak dikenal):", p.name); continue
        if pal and (pal in skip or (only and pal not in only)):
            print("lewati (--skip/--only):", p.name); continue
        if not pal and (a.tanpa_utama or only):
            continue
        im = crop43(ImageOps.exif_transpose(Image.open(p)).convert("RGB"))
        im.resize((1600, 1200), Image.LANCZOS).save(OUT / f"{p.stem}.webp", quality=80, method=6)
        im.resize((640, 480), Image.LANCZOS).save(THUMB / f"{p.stem}.webp", quality=75, method=6)
        print(p.stem, "ok"); n += 1
        if pal:
            varian[fid].append(pal)
    print(n, "gambar dikonversi")
    for fid, pals in varian.items():
        pals.sort(key=PALET.index)
        print(f"{fid}: varian: {{ " + ", ".join(f"{x}: 'fasad/{fid}-{x}.webp'" for x in pals) + " },")


if __name__ == "__main__":
    main()
