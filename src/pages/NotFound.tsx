import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  useSeo({ title: 'Halaman tidak ditemukan', description: 'Halaman tidak ditemukan.', route: '/404' });
  return (
    <div className="container page narrow empty">
      <h1>Halaman tidak ditemukan</h1>
      <p>Link mungkin salah atau fasad sudah tidak tersedia.</p>
      <div className="empty__actions">
        <Link to="/galeri" className="btn btn-primary">Buka galeri</Link>
        <Link to="/" className="btn btn-ghost">Beranda</Link>
      </div>
    </div>
  );
}
