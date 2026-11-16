import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FasadImage from '../components/FasadImage';
import WaButton from '../components/WaButton';
import { MAX_COMPARE } from '../config';
import { FASAD, type Fasad } from '../data/fasad';
import { labelAtap, labelGaya, labelMaterial, labelTipe, labelWarna } from '../data/taxonomy';
import { useSeo } from '../lib/seo';
import { useStore } from '../lib/store';

const BARIS: [string, (f: Fasad) => string][] = [
  ['Gaya', (f) => labelGaya(f.gaya)],
  ['Tipe', (f) => labelTipe(f.tipe)],
  ['Lantai', (f) => `${f.lantai} lantai`],
  ['Lebar lahan', (f) => `${f.lebarLahan} m`],
  ['Atap', (f) => labelAtap(f.atap)],
  ['Warna', (f) => labelWarna(f.warna)],
  ['Material', (f) => f.material.map(labelMaterial).join(', ') || '-'],
];

export default function Bandingkan() {
  const { compare, removeCompare, clearCompare } = useStore();
  const [sp, setSp] = useSearchParams();
  const fromUrl = (sp.get('ids') ?? '').split(',').filter(Boolean);
  const ids = (fromUrl.length ? fromUrl : compare).slice(0, MAX_COMPARE);
  const list = ids.map((id) => FASAD.find((f) => f.id === id)).filter((f): f is Fasad => !!f);

  // jaga URL selaras dengan pilihan lokal agar link bisa dibagikan
  useEffect(() => {
    if (!fromUrl.length && compare.length) setSp({ ids: compare.join(',') }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useSeo({ title: 'Bandingkan fasad', description: 'Bandingkan hingga 3 fasad rumah berdampingan.', route: `/bandingkan${ids.length ? `?ids=${ids.join(',')}` : ''}` });

  const hapus = (id: string) => {
    removeCompare(id);
    const rest = ids.filter((x) => x !== id);
    setSp(rest.length ? { ids: rest.join(',') } : {}, { replace: true });
  };

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Bandingkan fasad</h1>
        <p className="lead">Pilih hingga {MAX_COMPARE} fasad dari galeri, lalu lihat perbedaannya di sini.</p>
      </div>
      {list.length ? (
        <>
          <div className="compare" style={{ ['--n' as string]: list.length }}>
            {list.map((f) => (
              <article key={f.id} className="compare__col">
                <Link to={`/fasad/${f.id}`}><FasadImage f={f} /></Link>
                <p className="card__id">{f.id}</p>
                <h2 className="compare__title"><Link to={`/fasad/${f.id}`}>{f.judul}</Link></h2>
                <dl className="attrs attrs--compact">
                  {BARIS.map(([k, fn]) => (
                    <div key={k}><dt>{k}</dt><dd>{fn(f)}</dd></div>
                  ))}
                </dl>
                <button type="button" className="btn btn-ghost" onClick={() => hapus(f.id)}>✕ Hapus</button>
              </article>
            ))}
          </div>
          <div className="compare__cta">
            <WaButton list={list} route={`/bandingkan?ids=${ids.join(',')}`} label="Konsultasikan pilihan ini via WhatsApp" />
            <button type="button" className="btn btn-ghost" onClick={() => { clearCompare(); setSp({}, { replace: true }); }}>Kosongkan</button>
          </div>
        </>
      ) : (
        <div className="empty">
          <p>Belum ada fasad untuk dibandingkan. Centang “Bandingkan” pada kartu fasad di galeri.</p>
          <div className="empty__actions"><Link to="/galeri" className="btn btn-primary">Buka galeri</Link></div>
        </div>
      )}
    </div>
  );
}
