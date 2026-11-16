import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { PALET, labelPalet, type PaletId } from '../data/taxonomy';

type Pilihan = PaletId | 'asli';
type Props = { tersedia: PaletId[]; value: Pilihan; onChange: (p: Pilihan) => void; fasadId: string };

/**
 * Baris bulatan warna (radiogroup). Hanya palet yang punya gambar yang ditampilkan.
 * Keyboard: Tab masuk ke pilihan aktif, panah kiri/kanan/atas/bawah + Home/End untuk berpindah.
 */
export default function PaletPicker({ tersedia, value, onChange, fasadId }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const opsi: Pilihan[] = ['asli', ...tersedia];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = opsi.indexOf(value);
    let n = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % opsi.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + opsi.length) % opsi.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = opsi.length - 1;
    else return;
    e.preventDefault();
    onChange(opsi[n]);
    requestAnimationFrame(() => ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[n]?.focus());
  };

  const label = value === 'asli' ? 'Asli' : labelPalet(value);
  return (
    <div className="palet">
      <p className="palet__head" id={`palet-h-${fasadId}`}>
        Varian warna: <strong aria-live="polite">{label}</strong>
      </p>
      <div ref={ref} className="palet__row" role="radiogroup" aria-labelledby={`palet-h-${fasadId}`} onKeyDown={onKey}>
        {opsi.map((p) => {
          const on = p === value;
          const meta = p === 'asli' ? null : PALET.find((x) => x.id === p)!;
          const nama = p === 'asli' ? 'Asli (warna gambar utama)' : meta!.label;
          const sw = meta ? `linear-gradient(135deg, ${meta.swatch.map((c, i, a) => `${c} ${(i / a.length) * 100}% ${((i + 1) / a.length) * 100}%`).join(', ')})` : undefined;
          return (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`Varian warna ${nama}`}
              title={nama}
              tabIndex={on ? 0 : -1}
              className={`swatch${p === 'asli' ? ' swatch--asli' : ''}`}
              style={sw ? ({ ['--sw' as string]: sw } as CSSProperties) : undefined}
              onClick={() => onChange(p)}
            >
              {p === 'asli' ? <span aria-hidden="true">Asli</span> : null}
            </button>
          );
        })}
      </div>
      <p className="palet__note">Warna hanya perkiraan; warna cat sebenarnya bisa berbeda.</p>
    </div>
  );
}
