import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import FasadImage from '../components/FasadImage';
import PaletPicker from '../components/PaletPicker';
import Grid from '../components/Grid';
import WaButton from '../components/WaButton';
import { DISCLAIMER } from '../config';
import { isPaletId, labelAtap, labelGaya, labelMaterial, labelPalet, labelTipe, labelWarna, type PaletId } from '../data/taxonomy';
import { absUrl, altFasad, byId, gambarFasad, gambarVarian, paletTersedia, serupa } from '../lib/fasad';
import { useSeo } from '../lib/seo';
import { useStore } from '../lib/store';
import NotFound from './NotFound';

export default function Detail() {
  const { id } = useParams();
  const f = byId(id);
  const { saved, compare, toggleSaved, toggleCompare, setNotice } = useStore();
  const [copied, setCopied] = useState(false);
  const [sp, setSp] = useSearchParams();
  const tersedia = f ? paletTersedia(f) : [];
  const q = sp.get('palet');
  const palet: PaletId | 'asli' = isPaletId(q) && tersedia.includes(q) ? q : 'asli';
  const labelVarian = palet === 'asli' ? undefined : labelPalet(palet);
  const routeIni = `/fasad/${id ?? ''}${palet !== 'asli' ? `?palet=${palet}` : ''}`;
  const pilihPalet = (p: PaletId | 'asli') => setSp(p === 'asli' ? {} : { palet: p }, { replace: true });

  const jsonLd = useMemo(
    () =>
      f
        ? [
            { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Beranda', item: absUrl('/') },
              { '@type': 'ListItem', position: 2, name: labelGaya(f.gaya), item: absUrl(`/gaya/${f.gaya}`) },
              { '@type': 'ListItem', position: 3, name: f.id, item: absUrl(`/fasad/${f.id}`) } ] },
            { '@context': 'https://schema.org', '@type': 'ImageObject', name: f.judul, contentUrl: new URL(gambarFasad(f), window.location.href).href,
              description: `Desain konsep: ${f.deskripsi}`, creditText: 'Galeri.Fasad — Gambar.Express' },
          ]
        : [],
    [f],
  );
  useSeo({
    title: f ? `Fasad ${f.judul} (${f.id})` : 'Fasad tidak ditemukan',
    description: f ? `${f.id}: ${f.deskripsi.slice(0, 150)}` : 'Fasad tidak ditemukan.',
    image: f ? gambarVarian(f, palet) : undefined,
    route: routeIni,
    jsonLd,
  });
  if (!f) return <NotFound />;

  const isSaved = saved.includes(f.id);
  const inCompare = compare.includes(f.id);
  const bagikan = async () => {
    const url = absUrl(routeIni);
    try {
      if (navigator.share) {
        await navigator.share({ title: f.judul, text: `${f.id}${labelVarian ? ` varian ${labelVarian}` : ''} — ${f.judul} (desain konsep)`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setNotice('Link disalin.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* dibatalkan pengguna */
    }
  };

  const atribut: [string, string][] = [
    ['ID', f.id], ['Gaya', labelGaya(f.gaya)], ['Tipe', labelTipe(f.tipe)], ['Lantai', `${f.lantai} lantai`],
    ['Lebar lahan', `${f.lebarLahan} m`], ['Atap', labelAtap(f.atap)], ['Warna dominan', labelWarna(f.warna)],
    ['Material aksen', f.material.map(labelMaterial).join(', ') || '-'],
  ];

  return (
    <div className="container page detail">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Beranda</Link> <span aria-hidden="true">/</span> <Link to={`/gaya/${f.gaya}`}>{labelGaya(f.gaya)}</Link> <span aria-hidden="true">/</span> <span aria-current="page">{f.id}</span>
      </nav>
      <div className="detail__grid">
        <div className="detail__media">
          <FasadImage f={f} eager besar src={gambarVarian(f, palet)} alt={altFasad(f, palet)} label={labelVarian} />
          {tersedia.length > 0 && <PaletPicker tersedia={tersedia} value={palet} onChange={pilihPalet} fasadId={f.id} />}
        </div>
        <div className="detail__info">
          <p className="detail__id">{f.id}</p>
          <h1 className="detail__title">{f.judul}</h1>
          <p>{f.deskripsi}</p>
          <dl className="attrs">
            {atribut.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <div className="detail__actions">
            <WaButton list={[f]} route={routeIni} varian={labelVarian} className="btn-block detail__wa" />
            <div className="detail__secondary">
              <button type="button" className={`btn btn-ghost${isSaved ? ' is-on' : ''}`} aria-pressed={isSaved} onClick={() => toggleSaved(f.id)}>
                <span aria-hidden="true">{isSaved ? '♥' : '♡'}</span> {isSaved ? 'Tersimpan' : 'Simpan'}
              </button>
              <button type="button" className={`btn btn-ghost${inCompare ? ' is-on' : ''}`} aria-pressed={inCompare} onClick={() => toggleCompare(f.id)}>
                ⇄ {inCompare ? 'Di bandingkan' : 'Tambah ke Bandingkan'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={bagikan}>↗ {copied ? 'Disalin' : 'Bagikan'}</button>
            </div>
          </div>
          <p className="disclaimer" role="note"><strong>Desain konsep.</strong> {DISCLAIMER}</p>
          <p className="sr-only">{altFasad(f, palet)}</p>
        </div>
      </div>
      <section className="section" aria-labelledby="serupa-h">
        <h2 id="serupa-h">Fasad serupa</h2>
        <Grid list={serupa(f, 4)} eagerCount={0} />
      </section>
    </div>
  );
}
