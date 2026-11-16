import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Dua mode build:
 *  - publik (default): base '/', gambar dari .build/publik (watermark, 1200px, nama hash). Gambar asli TIDAK ikut.
 *  - internal (`--mode internal`): base '/int-<token>/', gambar asli dari media/fasad, tanpa proteksi, noindex.
 * Token internal disimpan di .internal-token (jangan di-commit ke repo sumber).
 */
const ROOT = __dirname;

function bacaToken(): string {
  const f = path.join(ROOT, '.internal-token');
  if (!fs.existsSync(f)) throw new Error('.internal-token tidak ada — jalankan npm run build:internal');
  const t = fs.readFileSync(f, 'utf8').trim();
  if (!/^[a-z0-9]{16,}$/.test(t)) throw new Error('token internal harus ≥16 karakter [a-z0-9]');
  return t;
}

// Saat build, entri fasad yang dikecualikan (src/data/dikecualikan.json) dibuang dari
// sumber fasad.ts, sehingga judul/deskripsinya pun tidak ikut ke bundle JS.
function kecualiPlugin(): Plugin {
  return {
    name: 'gf-kecuali',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\\/g, '/').endsWith('/src/data/fasad.ts')) return null;
      const dk = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src/data/dikecualikan.json'), 'utf8'));
      const ids = new Set<string>(dk.id ?? []);
      const batch = new Set<number>(dk.batch ?? []);
      if (!ids.size && !batch.size) return null;
      const re = /^  \{ id: "(GF-\d{4})"(?:, batch: (\d+))?[\s\S]*?(?=^  \{ id: "GF-|^\];)/gm;
      return { code: code.replace(re, (m, gid, b) => (ids.has(gid) || batch.has(Number(b ?? 1)) ? '' : m)), map: null };
    },
  };
}

function gambarPlugin(mode: string): Plugin {
  const internal = mode === 'internal';
  const manifestFile = path.join(ROOT, '.build', internal ? 'internal' : 'publik', 'manifest.json');
  const VID = 'virtual:gambar-manifest';
  return {
    name: 'gf-gambar',
    resolveId: (id) => (id === VID ? '\0' + VID : null),
    load(id) {
      if (id !== '\0' + VID) return null;
      if (!fs.existsSync(manifestFile)) throw new Error(`${manifestFile} belum ada — jalankan python3 scripts/gambar-publik.py`);
      this.addWatchFile(manifestFile);
      return `export default ${fs.readFileSync(manifestFile, 'utf8')};`;
    },
    // dev server: layani file gambar dari sumber yang sesuai mode
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0];
        const m = internal ? url.match(/\/img\/(.+\.webp)$/) : url.match(/\/(g\/[a-f0-9]+\.webp)$/);
        if (!m) return next();
        const file = internal ? path.join(ROOT, 'media', 'fasad', m[1]) : path.join(ROOT, '.build', 'publik', m[1]);
        if (!fs.existsSync(file)) return next();
        res.setHeader('Content-Type', 'image/webp');
        fs.createReadStream(file).pipe(res);
      });
    },
    generateBundle() {
      const emit = (fileName: string, file: string) => this.emitFile({ type: 'asset', fileName, source: fs.readFileSync(file) });
      if (internal) {
        // hanya gambar yang ada di manifest (fasad yang dikecualikan tidak ikut)
        const man = JSON.parse(fs.readFileSync(manifestFile, 'utf8')) as Record<string, { full: string; thumb: string }>;
        const src = path.join(ROOT, 'media', 'fasad');
        const sudah = new Set<string>();
        for (const m of Object.values(man))
          for (const rel of [m.full, m.thumb]) {
            if (sudah.has(rel)) continue;
            sudah.add(rel);
            emit(rel, path.join(src, rel.replace(/^img\//, '')));
          }
        emit('favicon.svg', path.join(ROOT, 'public', 'favicon.svg'));
      } else {
        const src = path.join(ROOT, '.build', 'publik', 'g');
        for (const f of fs.readdirSync(src)) emit(`g/${f}`, path.join(src, f));
      }
    },
    transformIndexHtml(html) {
      if (!internal) return html;
      return html
        .replace(/<meta name="robots"[^\n]*\n/, '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" /> <!-- INTERNAL: noindex permanen -->\n')
        .replace(/<title>[^<]*<\/title>/, '<title>[INTERNAL] Galeri.Fasad</title>')
        // jangan bocorkan path internal lewat header Referer saat membuka tautan keluar (mis. WhatsApp)
        .replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="referrer" content="no-referrer" />');
    },
  };
}

export default defineConfig(({ mode }) => {
  const internal = mode === 'internal';
  return {
    base: internal ? `/int-${bacaToken()}/` : '/',
    publicDir: internal ? false : 'public', // build internal tidak membawa CNAME/robots/sitemap
    plugins: [kecualiPlugin(), react(), gambarPlugin(mode)],
    define: { __GF_INTERNAL__: JSON.stringify(internal) },
    build: { outDir: internal ? 'dist-internal' : 'dist', assetsInlineLimit: 0, emptyOutDir: true },
  };
});
