import WaButton from '../components/WaButton';
import { DISCLAIMER } from '../config';
import { useSeo } from '../lib/seo';

export default function Tentang() {
  useSeo({ title: 'Tentang & disclaimer', description: 'Tentang Galeri.Fasad dan catatan penggunaan gambar desain konsep.', route: '/tentang' });
  return (
    <div className="container page narrow prose">
      <h1>Tentang Galeri.Fasad</h1>
      <p>Galeri.Fasad adalah galeri inspirasi fasad rumah gratis yang didukung Gambar.Express. Tujuannya membantu Anda menemukan gaya rumah yang disukai sebelum berdiskusi soal gambar rumah Anda.</p>
      <h2>Semua gambar adalah desain konsep</h2>
      <p>{DISCLAIMER}</p>
      <p>Setiap gambar ditinjau dan disetujui oleh tim sebelum ditampilkan. Gambar tidak diambil dari situs lain.</p>
      <h2>Privasi</h2>
      <p>Situs ini tidak memakai akun dan tidak memiliki formulir. Daftar “Disimpan”, “Bandingkan”, dan pilihan “Saya” hanya tersimpan di browser Anda (localStorage). Saat Anda menekan tombol WhatsApp, pesan baru dikirim bila Anda sendiri menekan kirim di aplikasi WhatsApp.</p>
      <h2>Konsultasi</h2>
      <p>Konsultasi awal gratis melalui WhatsApp.</p>
      <WaButton route="/tentang" />
    </div>
  );
}
