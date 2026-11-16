import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BRAND, DISCLAIMER, PARTNER } from '../config';
import { useStore } from '../lib/store';

const NAV = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/galeri', label: 'Galeri' },
  { to: '/kontraktor', label: 'Untuk kontraktor' },
  { to: '/tentang', label: 'Tentang' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const { saved, compare, notice } = useStore();
  const loc = useLocation();

  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll-sm', menu);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menu]);

  return (
    <div className="app">
      <a href="#konten" className="skip" onClick={(e) => { e.preventDefault(); document.getElementById('konten')?.focus(); }}>
        Lewati ke konten
      </a>
      {__GF_INTERNAL__ && (
        <div className="gf-internal-banner" role="note">MODE INTERNAL — gambar asli tanpa proteksi. Jangan bagikan tautan ini.</div>
      )}
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand" aria-label={`${BRAND} beranda`}>
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={32} height={32} />
            <span className="brand__text">
              <strong>{BRAND}</strong>
              <small>didukung {PARTNER}</small>
            </span>
          </Link>
          <div className="header__right">
            <Link to="/disimpan" className="counter" aria-label={`Disimpan: ${saved.length}`}>
              <span aria-hidden="true">♥</span> {saved.length}
            </Link>
            <Link to={`/bandingkan${compare.length ? `?ids=${compare.join(',')}` : ''}`} className="counter" aria-label={`Bandingkan: ${compare.length}`}>
              <span aria-hidden="true">⇄</span> {compare.length}
            </Link>
            <button type="button" className="btn btn-icon hamburger" aria-expanded={menu} aria-controls="nav-utama" aria-label={menu ? 'Tutup menu' : 'Buka menu'} onClick={() => setMenu((m) => !m)}>
              <span className={`hamburger__bars${menu ? ' is-open' : ''}`} aria-hidden="true" />
            </button>
          </div>
          <nav id="nav-utama" className={`nav${menu ? ' is-open' : ''}`} aria-label="Navigasi utama">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
                {n.label}
              </NavLink>
            ))}
            <NavLink to="/disimpan" className={({ isActive }) => `nav__link nav__link--sm${isActive ? ' is-active' : ''}`}>
              Disimpan ({saved.length})
            </NavLink>
            <NavLink to="/bandingkan" className={({ isActive }) => `nav__link nav__link--sm${isActive ? ' is-active' : ''}`}>
              Bandingkan ({compare.length})
            </NavLink>
          </nav>
        </div>
      </header>
      {menu && <div className="nav-backdrop" onClick={() => setMenu(false)} aria-hidden="true" />}

      <main id="konten" tabIndex={-1} className="main">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <p className="footer__disclaimer">{DISCLAIMER}</p>
          <nav className="footer__nav" aria-label="Tautan footer">
            <Link to="/tentang">Tentang &amp; disclaimer</Link>
            <Link to="/kontraktor">Untuk kontraktor</Link>
            <Link to="/galeri">Galeri</Link>
          </nav>
          <p className="footer__copy">© {BRAND} — didukung {PARTNER} · Semua gambar adalah desain konsep</p>
        </div>
      </footer>

      <div className={`toast${notice ? ' is-on' : ''}`} role="status" aria-live="polite">
        {notice}
      </div>
    </div>
  );
}
