import { Link } from 'react-router-dom';
import type { Fasad } from '../data/fasad';
import { labelGaya, labelTipe } from '../data/taxonomy';
import { useStore } from '../lib/store';
import { paletTersedia } from '../lib/fasad';
import FasadImage from './FasadImage';

export default function FasadCard({ f, eager }: { f: Fasad; eager?: boolean }) {
  const { saved, compare, toggleSaved, toggleCompare } = useStore();
  const isSaved = saved.includes(f.id);
  const inCompare = compare.includes(f.id);
  const nVarian = paletTersedia(f).length;
  return (
    <article className="card">
      <Link to={`/fasad/${f.id}`} className="card__link" aria-label={`Lihat detail ${f.id}: ${f.judul}`}>
        <FasadImage f={f} eager={eager} />
      </Link>
      <div className="card__body">
        <p className="card__id">{f.id}</p>
        <h3 className="card__title">
          <Link to={`/fasad/${f.id}`}>{f.judul}</Link>
        </h3>
        <ul className="tags" aria-label="Atribut">
          <li>{labelGaya(f.gaya)}</li>
          <li>{labelTipe(f.tipe)}</li>
          <li>{f.lantai} lantai</li>
          <li>Lebar {f.lebarLahan} m</li>
          {nVarian > 0 && <li className="tag--varian">+{nVarian} varian warna</li>}
        </ul>
        <div className="card__actions">
          <button type="button" className={`btn btn-ghost${isSaved ? ' is-on' : ''}`} aria-pressed={isSaved} onClick={() => toggleSaved(f.id)}>
            <span aria-hidden="true">{isSaved ? '♥' : '♡'}</span> {isSaved ? 'Tersimpan' : 'Simpan'}
          </button>
          <label className={`check${inCompare ? ' is-on' : ''}`}>
            <input type="checkbox" checked={inCompare} onChange={() => toggleCompare(f.id)} />
            Bandingkan
          </label>
        </div>
      </div>
    </article>
  );
}
