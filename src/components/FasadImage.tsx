import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import type { Fasad } from '../data/fasad';
import { altFasad, gambarFasad, infoDariUrl } from '../lib/fasad';
import { PROTEKSI } from '../lib/proteksi';

type Props = { f: Fasad; eager?: boolean; besar?: boolean; src?: string; alt?: string; label?: string };

const cegah = (e: SyntheticEvent) => e.preventDefault();

/**
 * Gambar fasad.
 * - Build publik (PROTEKSI): dirender sebagai background-image (bukan <img>), dengan lapisan pelindung transparan
 *   dan watermark tiled; file sudah ber-watermark & beresolusi rendah dari build.
 * - Build internal: <img> biasa dengan srcset (file asli).
 * Bila `src` berganti (ganti varian palet), gambar baru dimuat dulu lalu di-crossfade.
 */
export default function FasadImage({ f, eager = false, besar = false, src, alt, label }: Props) {
  const target = src ?? gambarFasad(f);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(target);
  const [prev, setPrev] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, 'ok' | 'err'>>({});
  const [terlihat, setTerlihat] = useState(eager || !PROTEKSI);
  const first = useRef(true);

  const sizes = besar ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 1200px) 380px, (min-width: 900px) 30vw, (min-width: 600px) 50vw, 100vw';
  const srcSetFor = (s: string) => {
    const i = infoDariUrl(s);
    return i && i.thumb !== i.full ? `${i.thumb} ${i.tw}w, ${i.full} ${i.w}w` : undefined;
  };
  /** URL yang benar-benar dimuat di mode proteksi: kartu → thumbnail, detail → penuh (sudah dibatasi 1200px) */
  const urlProteksi = (s: string) => {
    const i = infoDariUrl(s);
    if (!i) return s;
    if (besar) return window.innerWidth < 600 && (window.devicePixelRatio || 1) < 1.5 ? i.thumb : i.full;
    return i.thumb;
  };
  const urlMuat = (s: string) => (PROTEKSI ? urlProteksi(s) : s);

  // lazy-load untuk background (tidak ada loading="lazy" bawaan)
  useEffect(() => {
    if (terlihat || !wrapRef.current) return;
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && (setTerlihat(true), io.disconnect()), { rootMargin: '300px' });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [terlihat]);

  // mode proteksi: muat dulu untuk tahu berhasil/gagal (placeholder)
  useEffect(() => {
    if (!PROTEKSI || !terlihat || status[cur]) return;
    const img = new Image();
    img.onload = () => setStatus((s) => ({ ...s, [cur]: 'ok' }));
    img.onerror = () => setStatus((s) => ({ ...s, [cur]: 'err' }));
    img.src = urlMuat(cur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, terlihat]);

  // ganti sumber (varian): preload lalu crossfade
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (target === cur) return;
    let batal = false;
    const img = new Image();
    const ganti = (err: boolean) => {
      if (batal) return;
      setStatus((s) => ({ ...s, [target]: err ? 'err' : 'ok' }));
      setPrev(cur);
      setCur(target);
    };
    img.onload = () => ganti(false);
    img.onerror = () => ganti(true);
    if (!PROTEKSI) {
      const ss = srcSetFor(target);
      if (ss) { img.sizes = sizes; img.srcset = ss; }
    }
    img.src = urlMuat(target);
    return () => { batal = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const altText = alt ?? altFasad(f);
  const placeholder = (s: string, kelas: string, onEnd?: () => void) => (
    <div key={s} className={`img-placeholder ${kelas}`} role="img" aria-label={altText} onAnimationEnd={onEnd}>
      <svg viewBox="0 0 64 48" aria-hidden="true" className="img-placeholder__icon">
        <path d="M8 26 32 8l24 18v18H8z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <rect x="27" y="30" width="10" height="14" fill="currentColor" opacity=".5" />
      </svg>
      <strong>{f.id}</strong>
      <span>Gambar menyusul</span>
    </div>
  );
  const prevLayer = (k: string) => k.includes('is-prev');

  const layer = (s: string, kelas: string, onEnd?: () => void) => {
    if (status[s] === 'err') return placeholder(s, kelas, onEnd);
    if (PROTEKSI) {
      const siap = terlihat && status[s] === 'ok';
      return (
        <div
          key={s}
          className={`${kelas} gf-bg${siap ? ' is-siap' : ''}`}
          role={prevLayer(kelas) ? undefined : 'img'}
          aria-label={prevLayer(kelas) ? undefined : altText}
          aria-hidden={prevLayer(kelas) || undefined}
          style={siap ? { backgroundImage: `url("${urlMuat(s)}")` } : undefined}
          onAnimationEnd={onEnd}
        />
      );
    }
    return (
      <img
        key={s}
        className={kelas}
        src={s}
        srcSet={srcSetFor(s)}
        sizes={srcSetFor(s) ? sizes : undefined}
        alt={prevLayer(kelas) ? '' : altText}
        aria-hidden={prevLayer(kelas) || undefined}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        width={1600}
        height={1200}
        onError={() => setStatus((g) => ({ ...g, [s]: 'err' }))}
        onAnimationEnd={onEnd}
      />
    );
  };

  return (
    <div
      ref={wrapRef}
      className={`img-wrap${besar ? ' img-wrap--besar' : ''}${PROTEKSI ? ' is-proteksi' : ''}`}
      onContextMenu={PROTEKSI ? cegah : undefined}
      onDragStart={PROTEKSI ? cegah : undefined}
    >
      {prev && prev !== cur && layer(prev, 'img-layer is-prev')}
      {layer(cur, `img-layer${prev ? ' is-in' : ''}`, () => setPrev(null))}
      {PROTEKSI && (
        <>
          <div className="gf-wm" aria-hidden="true" />
          <div className="gf-shield" aria-hidden="true" />
          <div className="gf-note" aria-hidden="true">Gambar disamarkan · klik untuk menampilkan</div>
        </>
      )}
      <span className="badge-konsep">Desain konsep{label ? ` · ${label}` : ''}</span>
    </div>
  );
}
