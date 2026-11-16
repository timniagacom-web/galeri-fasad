import { Link } from 'react-router-dom';
import Grid from '../components/Grid';
import PersonaToggle from '../components/PersonaToggle';
import WaButton from '../components/WaButton';
import { TAGLINE } from '../config';
import { GRUP_GAYA } from '../data/taxonomy';
import { GAYA_TAMPIL, terbaru } from '../lib/fasad';
import { useSeo } from '../lib/seo';

export default function Home() {
  useSeo({
    title: 'Galeri.Fasad — Inspirasi fasad rumah, didukung Gambar.Express',
    description: 'Temukan model fasad rumah impian: filter gaya, tipe 36–90+, lantai, dan lebar lahan 6–12 m. Simpan, bandingkan, lalu konsultasi gratis via WhatsApp.',
    route: '/',
  });
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <p className="eyebrow">{TAGLINE}</p>
          <h1>Temukan model rumah impian Anda dalam hitungan menit</h1>
          <p className="hero__lead">Jelajahi contoh desain fasad rumah berdasarkan gaya, tipe, jumlah lantai, dan lebar lahan. Suka satu model? Konsultasikan gratis dan wujudkan jadi gambar rumah Anda.</p>
          <PersonaToggle />
          <div className="hero__cta">
            <Link to="/galeri" className="btn btn-primary">Lihat galeri</Link>
            <WaButton className="btn-outline-wa" />
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="gaya-h">
        <h2 id="gaya-h">Pilih gaya</h2>
        {GRUP_GAYA.map((k) => (
          <div key={k.value} className="gaya-grup">
            <h3 className="gaya-grup__judul">
              <Link to={`/galeri?grup=${k.value}`}>{k.label === 'Modern' ? 'Gaya modern' : k.label}</Link>
            </h3>
            <div className="chips chips--scroll">
              {GAYA_TAMPIL.filter((g) => g.grup === k.value).map((g) => (
                <Link key={g.value} to={`/gaya/${g.value}`} className="chip chip--link">{g.label.replace(' Kontemporer', '')}</Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section container" aria-labelledby="baru-h">
        <div className="section__head">
          <h2 id="baru-h">Fasad terbaru</h2>
          <Link to="/galeri" className="link-more">Semua fasad →</Link>
        </div>
        <Grid list={terbaru(8)} />
      </section>

      <section className="section container" aria-labelledby="cara-h">
        <h2 id="cara-h">Cara kerja</h2>
        <ol className="steps">
          <li><span className="steps__n">1</span><div><h3>Pilih fasad</h3><p>Filter berdasarkan gaya, tipe, lantai, dan lebar lahan Anda.</p></div></li>
          <li><span className="steps__n">2</span><div><h3>Simpan &amp; bandingkan</h3><p>Tandai favorit dan bandingkan hingga 3 model berdampingan.</p></div></li>
          <li><span className="steps__n">3</span><div><h3>Konsultasi gratis via WhatsApp</h3><p>Kirim ID fasad pilihan. Tim Gambar.Express bantu menyesuaikan dengan lahan Anda.</p></div></li>
        </ol>
        <div className="center"><WaButton /></div>
      </section>
    </>
  );
}
