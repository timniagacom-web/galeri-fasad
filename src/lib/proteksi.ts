/**
 * Proteksi gambar (best effort) — aktif hanya di build publik (__GF_INTERNAL__ === false).
 * Tidak ada proteksi web yang mutlak: ini mempersulit unduh/screenshot iseng, bukan mencegah total.
 */
export const PROTEKSI = !__GF_INTERNAL__;

let pasang = false;
let timerSembunyi: number | undefined;

const di = (t: EventTarget | null, sel: string) => t instanceof Element && !!t.closest(sel);

/** sembunyikan gambar sementara (mis. setelah PrintScreen / Cmd+Shift terdeteksi) */
function sembunyikan(ms = 2500) {
  document.body.classList.add('gf-hide');
  window.clearTimeout(timerSembunyi);
  timerSembunyi = window.setTimeout(() => document.body.classList.remove('gf-hide'), ms);
}
const blur = () => document.body.classList.add('gf-blur');
const unblur = () => document.body.classList.remove('gf-blur');

export function pasangProteksi() {
  if (!PROTEKSI || pasang || typeof window === 'undefined') return;
  pasang = true;

  // klik kanan: diblokir di area gambar; di tempat lain tetap normal kecuali pada elemen media
  document.addEventListener('contextmenu', (e) => {
    if (di(e.target, '.img-wrap, img, canvas, [data-gf-protect]')) e.preventDefault();
  });
  // drag gambar
  document.addEventListener('dragstart', (e) => {
    if (di(e.target, '.img-wrap, img, canvas, [data-gf-protect]')) e.preventDefault();
  });
  // seleksi yang dimulai di area gambar
  document.addEventListener('selectstart', (e) => {
    if (di(e.target, '.img-wrap, [data-gf-protect]')) e.preventDefault();
  });

  // shortcut: Ctrl/Cmd+S, U, P, F12, DevTools (Ctrl+Shift+I/J/C, Cmd+Opt+I/J/C) — best effort
  window.addEventListener(
    'keydown',
    (e) => {
      const k = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      if (k === 'printscreen') {
        sembunyikan();
        return;
      }
      // macOS screenshot: Cmd+Shift(+3/4/5); Windows Win+Shift+S (bila sampai ke browser)
      if (e.metaKey && e.shiftKey) sembunyikan(3000);
      const blokir =
        k === 'f12' ||
        (mod && !e.shiftKey && !e.altKey && ['s', 'u', 'p'].includes(k)) ||
        (mod && (e.shiftKey || e.altKey) && ['i', 'j', 'c'].includes(k));
      if (blokir) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
  window.addEventListener(
    'keyup',
    (e) => {
      if (e.key === 'PrintScreen') {
        sembunyikan();
        // timpa clipboard (hanya berhasil bila browser mengizinkan)
        navigator.clipboard?.writeText?.('Gambar dilindungi — galeri.gambarexpress.id').catch(() => {});
      }
    },
    true,
  );

  // samarkan saat tab/jendela tidak aktif (alat screenshot & snipping tool biasanya mencuri fokus)
  document.addEventListener('visibilitychange', () => (document.hidden ? blur() : unblur()));
  window.addEventListener('blur', blur);
  window.addEventListener('focus', unblur);
  window.addEventListener('pointerdown', unblur, true);

  // cetak
  window.addEventListener('beforeprint', () => document.body.classList.add('gf-hide'));
  window.addEventListener('afterprint', () => document.body.classList.remove('gf-hide'));
}
