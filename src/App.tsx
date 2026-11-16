import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { StoreProvider } from './lib/store';
import Bandingkan from './pages/Bandingkan';
import Detail from './pages/Detail';
import Disimpan from './pages/Disimpan';
import Galeri from './pages/Galeri';
import Gaya from './pages/Gaya';
import Home from './pages/Home';
import Kontraktor from './pages/Kontraktor';
import NotFound from './pages/NotFound';
import Tentang from './pages/Tentang';

export default function App() {
  return (
    <HashRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/galeri" element={<Galeri />} />
            <Route path="/gaya/:slug" element={<Gaya />} />
            <Route path="/fasad/:id" element={<Detail />} />
            <Route path="/fasad/:id/:slug" element={<Detail />} />
            <Route path="/disimpan" element={<Disimpan />} />
            <Route path="/bandingkan" element={<Bandingkan />} />
            <Route path="/kontraktor" element={<Kontraktor />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </StoreProvider>
    </HashRouter>
  );
}
