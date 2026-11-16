import { Link } from 'react-router-dom';
import Grid from '../components/Grid';
import WaButton from '../components/WaButton';
import { FASAD } from '../data/fasad';
import { useSeo } from '../lib/seo';
import { useStore } from '../lib/store';

export default function Disimpan() {
  const { saved } = useStore();
  const list = saved.map((id) => FASAD.find((f) => f.id === id)).filter((f): f is (typeof FASAD)[number] => !!f);
  useSeo({ title: 'Fasad disimpan', description: 'Daftar fasad favorit yang Anda simpan di perangkat ini.', route: '/disimpan' });
  return (
    <div className="container page">
      <div className="page__head">
        <h1>Fasad disimpan</h1>
        <p className="lead">Tersimpan di perangkat ini saja (tanpa akun).</p>
      </div>
      {list.length ? (
        <>
          <div className="toolbar">
            <p className="toolbar__count"><strong>{list.length}</strong> fasad</p>
            <WaButton list={list} route="/disimpan" label="Kirim semua ke WhatsApp" />
          </div>
          <Grid list={list} />
        </>
      ) : (
        <div className="empty">
          <p>Belum ada fasad yang disimpan. Tekan “♡ Simpan” pada fasad yang Anda suka.</p>
          <div className="empty__actions"><Link to="/galeri" className="btn btn-primary">Jelajahi galeri</Link></div>
        </div>
      )}
    </div>
  );
}
