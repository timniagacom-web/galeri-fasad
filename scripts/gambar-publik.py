#!/usr/bin/env python3
"""
Membuat gambar PUBLIK yang diproteksi dari gambar asli di media/fasad/:
  - resolusi diturunkan: penuh 1200x900 (q72), thumbnail 480x360 (q68)
  - watermark 'galeri.gambarexpress.id' TERTANAM di piksel (tile diagonal semi-transparan + tanda pojok)
  - nama file = hash isi (tidak bisa ditebak dari ID), tanpa metadata
Keluaran: .build/publik/g/<hash>.webp dan .build/publik/manifest.json
Juga menulis .build/internal/manifest.json (gambar asli, untuk build internal).
Dijalankan otomatis oleh `npm run build`.
"""
import hashlib
import json
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "media" / "fasad"
OUT = ROOT / ".build" / "publik"
INT = ROOT / ".build" / "internal"
TEKS = "galeri.gambarexpress.id"
VERSI = "wm-v2"  # ubah bila desain watermark diubah → semua hash ikut berubah
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(size):
    try:
        return ImageFont.truetype(FONT, size)
    except OSError:
        return ImageFont.load_default(size)


def watermark(im: Image.Image) -> Image.Image:
    w, h = im.size
    base = im.convert("RGBA")
    # 1) tile diagonal tipis di seluruh gambar
    fs = max(14, w // 34)
    f = font(fs)
    tw = int(f.getlength(TEKS))
    tile = Image.new("RGBA", (tw + fs * 4, fs * 5), (0, 0, 0, 0))
    d = ImageDraw.Draw(tile)
    d.text((fs * 2 + 1, fs * 2 + 1), TEKS, font=f, fill=(0, 0, 0, 40))
    d.text((fs * 2, fs * 2), TEKS, font=f, fill=(255, 255, 255, 52))
    big = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0))
    for yi, y in enumerate(range(0, h * 2, tile.height)):
        off = (tile.width // 2) * (yi % 2)
        for x in range(-off, w * 2, tile.width):
            big.alpha_composite(tile, (max(x, 0), y)) if x >= 0 else big.alpha_composite(tile.crop((-x, 0, tile.width, tile.height)), (0, y))
    big = big.rotate(28, resample=Image.BICUBIC)
    big = big.crop((w // 2, h // 2, w // 2 + w, h // 2 + h))
    base.alpha_composite(big)
    # 2) tanda pojok kanan bawah lebih jelas
    f2 = font(max(12, w // 48))
    d2 = ImageDraw.Draw(base)
    t2 = f"© {TEKS}"
    l = int(f2.getlength(t2)); pad = max(6, w // 160); hh = f2.size + pad * 2
    box = Image.new("RGBA", (l + pad * 2, hh), (0, 0, 0, 90))
    base.alpha_composite(box, (w - box.width - pad, h - hh - pad))
    d2.text((w - box.width, h - hh - pad + pad - 1), t2, font=f2, fill=(255, 255, 255, 210))
    return base.convert("RGB")


def simpan(im: Image.Image, q: int) -> str:
    import io
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=q, method=6)  # tanpa EXIF/XMP
    data = buf.getvalue()
    nama = hashlib.sha256((VERSI + "|").encode() + data).hexdigest()[:20] + ".webp"
    (OUT / "g" / nama).write_bytes(data)
    return nama


def dikecualikan() -> set:
    """GF-ID yang dikecualikan (src/data/dikecualikan.json: 'id' + semua ID pada 'batch' tertentu)."""
    import re
    cfg = json.loads((ROOT / "src" / "data" / "dikecualikan.json").read_text())
    ids = set(cfg.get("id", []))
    batch = set(cfg.get("batch", []))
    if batch:
        for m in re.finditer(r'\{ id: "(GF-\d{4})"(?:, batch: (\d+))?', (ROOT / "src" / "data" / "fasad.ts").read_text()):
            if int(m.group(2) or 1) in batch:
                ids.add(m.group(1))
    return ids


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "g").mkdir(parents=True)
    INT.mkdir(parents=True, exist_ok=True)
    pub, inter = {}, {}
    kecuali = dikecualikan()
    lewat = []
    for p in sorted(SRC.glob("GF-*.webp")):
        key = p.stem
        if key[:7] in kecuali:  # 'GF-0033' dan varian 'GF-0033-sage'
            lewat.append(key); continue
        im = Image.open(p).convert("RGB")
        full = watermark(im.resize((1200, 900), Image.LANCZOS))
        thumb = watermark(im.resize((480, 360), Image.LANCZOS))
        pub[key] = {"full": "g/" + simpan(full, 72), "thumb": "g/" + simpan(thumb, 68), "w": 1200, "tw": 480}
        t = SRC / "thumb" / p.name
        inter[key] = {"full": f"img/{p.name}", "thumb": f"img/thumb/{p.name}" if t.exists() else f"img/{p.name}", "w": 1600, "tw": 640}
    (OUT / "manifest.json").write_text(json.dumps(pub, indent=0))
    (INT / "manifest.json").write_text(json.dumps(inter, indent=0))
    print(f"{len(pub)} gambar publik (watermark, 1200px) → {OUT / 'g'}")
    if lewat:
        print(f"dikecualikan ({len(lewat)}): {', '.join(lewat)}")


if __name__ == "__main__":
    main()
