import type { Fasad } from '../data/fasad';
import FasadCard from './FasadCard';

export default function Grid({ list, eagerCount = 2 }: { list: Fasad[]; eagerCount?: number }) {
  return (
    <div className="grid">
      {list.map((f, i) => (
        <FasadCard key={f.id} f={f} eager={i < eagerCount} />
      ))}
    </div>
  );
}
