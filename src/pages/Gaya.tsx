import { useParams } from 'react-router-dom';
import { GAYA } from '../data/taxonomy';
import { gayaTampil } from '../lib/fasad';
import Galeri from './Galeri';
import NotFound from './NotFound';

export default function Gaya() {
  const { slug } = useParams();
  const g = GAYA.find((x) => x.value === slug);
  if (!g || !gayaTampil(g.value)) return <NotFound />;
  return <Galeri kunciGaya={g.value} judul={`Fasad rumah ${g.label}`} intro={g.intro} route={`/gaya/${g.value}`} />;
}
