import { useEffect, useRef } from 'react';
import { GRUP_GAYA, LANTAI, LEBAR, TIPE } from '../data/taxonomy';
import { ATAP_TAMPIL, GAYA_TAMPIL, WARNA_TAMPIL } from '../lib/fasad';
import { KOSONG, type Filter } from '../lib/filters';

type Props = { value: Filter; onChange: (f: Filter) => void; open: boolean; onClose: () => void; hasil: number; sembunyikanGaya?: boolean };

function Grup<T extends string | number>({ judul, opsi, pilih, onToggle, sub }: { judul: string; opsi: readonly { value: T; label: string }[]; pilih: T[]; onToggle: (v: T) => void; sub?: boolean }) {
  if (!opsi.length) return null;
  return (
    <fieldset className={`fgroup${sub ? ' fgroup--sub' : ''}`}>
      <legend>{judul}</legend>
      <div className="chips">
        {opsi.map((o) => {
          const on = pilih.includes(o.value);
          return (
            <button key={String(o.value)} type="button" className={`chip${on ? ' chip--on' : ''}`} aria-pressed={on} onClick={() => onToggle(o.value)}>
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function FilterPanel({ value, onChange, open, onClose, hasil, sembunyikanGaya }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const tog = <K extends keyof Filter>(k: K, v: Filter[K][number]) => {
    const arr = value[k] as (string | number)[];
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    onChange({ ...value, [k]: next } as Filter);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    ref.current?.querySelector<HTMLElement>('button, [href]')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`drawer-backdrop${open ? ' is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside ref={ref} className={`filters${open ? ' is-open' : ''}`} aria-label="Filter fasad">
        <div className="filters__head">
          <h2>Filter</h2>
          <button type="button" className="btn btn-icon filters__close" onClick={onClose} aria-label="Tutup filter">
            ✕
          </button>
        </div>
        <div className="filters__body">
          {!sembunyikanGaya && (
            <>
              <Grup judul="Kelompok gaya" opsi={GRUP_GAYA} pilih={value.grup} onToggle={(v) => tog('grup', v)} />
              {GRUP_GAYA.filter((g) => !value.grup.length || value.grup.includes(g.value)).map((g) => (
                <Grup key={g.value} sub judul={`Gaya ${g.label}`} opsi={GAYA_TAMPIL.filter((x) => x.grup === g.value)} pilih={value.gaya} onToggle={(v) => tog('gaya', v)} />
              ))}
            </>
          )}
          <Grup judul="Tipe rumah" opsi={TIPE} pilih={value.tipe} onToggle={(v) => tog('tipe', v)} />
          <Grup judul="Jumlah lantai" opsi={LANTAI} pilih={value.lantai} onToggle={(v) => tog('lantai', v)} />
          <Grup judul="Lebar lahan" opsi={LEBAR} pilih={value.lebar} onToggle={(v) => tog('lebar', v)} />
          <Grup judul="Atap" opsi={ATAP_TAMPIL} pilih={value.atap} onToggle={(v) => tog('atap', v)} />
          <Grup judul="Warna dominan" opsi={WARNA_TAMPIL} pilih={value.warna} onToggle={(v) => tog('warna', v)} />
          <Grup judul="Varian warna" opsi={[{ value: 'ada', label: 'Punya varian warna' }]} pilih={value.varian} onToggle={(v) => tog('varian', v)} />
        </div>
        <div className="filters__foot">
          <button type="button" className="btn btn-ghost" onClick={() => onChange({ ...KOSONG, gaya: sembunyikanGaya ? value.gaya : [], grup: sembunyikanGaya ? value.grup : [] })}>
            Reset
          </button>
          <button type="button" className="btn btn-primary filters__apply" onClick={onClose}>
            Lihat {hasil} fasad
          </button>
        </div>
      </aside>
    </>
  );
}
