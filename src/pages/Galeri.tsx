import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import Grid from '../components/Grid';
import WaButton from '../components/WaButton';
import { FASAD } from '../data/fasad';
import { KOSONG, filterToParams, jumlahAktif, parseFilter, terapkan, type Filter } from '../lib/filters';
import { useSeo } from '../lib/seo';

type Props = { kunciGaya?: string; judul?: string; intro?: string; route?: string };

export default function Galeri({ kunciGaya, judul = 'Galeri fasad rumah', intro, route = '/galeri' }: Props) {
  const [sp, setSp] = useSearchParams();
  const [open, setOpen] = useState(false);
  const filter = useMemo(() => {
    const f = parseFilter(sp);
    return kunciGaya ? { ...f, gaya: [kunciGaya] } : f;
  }, [sp, kunciGaya]);
  const hasil = useMemo(() => terapkan(FASAD, filter), [filter]);
  const aktif = jumlahAktif(filter) - (kunciGaya ? 1 : 0);

  const onChange = useCallback(
    (f: Filter) => {
      const p = filterToParams(kunciGaya ? { ...f, gaya: [] } : f);
      setSp(p, { replace: false });
    },
    [setSp, kunciGaya],
  );
  const close = useCallback(() => setOpen(false), []);

  useSeo({
    title: judul,
    description: intro ?? 'Galeri contoh desain fasad rumah. Filter gaya, tipe, lantai, lebar lahan, atap, dan warna, lalu konsultasi gratis via WhatsApp.',
    route: route + (sp.toString() ? `?${sp}` : ''),
  });

  return (
    <div className="container page">
      <div className="page__head">
        <h1>{judul}</h1>
        {intro && <p className="lead">{intro}</p>}
      </div>
      <div className="galeri">
        <FilterPanel value={filter} onChange={onChange} open={open} onClose={close} hasil={hasil.length} sembunyikanGaya={!!kunciGaya} />
        <div className="galeri__main">
          <div className="toolbar">
            <p className="toolbar__count" aria-live="polite"><strong>{hasil.length}</strong> fasad ditemukan</p>
            <button type="button" className="btn btn-ghost toolbar__filter" onClick={() => setOpen(true)} aria-haspopup="dialog">
              ☰ Filter{aktif > 0 ? ` (${aktif})` : ''}
            </button>
          </div>
          {hasil.length ? (
            <Grid list={hasil} />
          ) : (
            <div className="empty">
              <p>Belum ada fasad yang cocok dengan semua filter ini.</p>
              <p>Coba kurangi filter, atau ceritakan kebutuhan Anda langsung kepada kami.</p>
              <div className="empty__actions">
                <button type="button" className="btn btn-ghost" onClick={() => onChange(KOSONG)}>Reset filter</button>
                <WaButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
