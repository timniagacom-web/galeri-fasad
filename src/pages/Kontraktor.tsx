import { Link } from 'react-router-dom';
import WaButton from '../components/WaButton';
import { useSeo } from '../lib/seo';

export default function Kontraktor() {
  useSeo({ title: 'Untuk kontraktor & developer', description: 'Pakai Galeri.Fasad sebagai katalog model untuk klien Anda. Konsultasi kebutuhan gambar proyek via WhatsApp.', route: '/kontraktor' });
  return (
    <div className="container page narrow">
      <div className="page__head">
        <h1>Untuk kontraktor &amp; developer</h1>
        <p className="lead">Tunjukkan pilihan fasad ke klien Anda, lalu kami bantu mengubahnya menjadi gambar kerja.</p>
      </div>
      <ul className="benefits">
        <li><h2>Katalog siap tunjuk</h2><p>Bagikan link fasad atau halaman Bandingkan ke klien agar keputusan gaya lebih cepat.</p></li>
        <li><h2>Kirim ID, bukan tangkapan layar</h2><p>Setiap fasad punya ID (mis. GF-0001) sehingga brief jelas dan tidak tertukar.</p></li>
        <li><h2>Banyak unit / proyek</h2><p>Ceritakan jumlah unit, lokasi, dan tenggat Anda. Kami diskusikan via WhatsApp.</p></li>
      </ul>
      <div className="cta-box">
        <h2>Diskusikan proyek Anda</h2>
        <p>Sertakan model acuan (ID fasad), jumlah unit, lokasi proyek, dan deadline.</p>
        <WaButton persona="kontraktor" route="/kontraktor" label="Chat WhatsApp sebagai kontraktor" />
        <p className="muted"><Link to="/galeri">Atau pilih model acuan dulu di galeri →</Link></p>
      </div>
    </div>
  );
}
