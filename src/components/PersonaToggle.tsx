import { useStore } from '../lib/store';

export default function PersonaToggle({ kompak = false }: { kompak?: boolean }) {
  const { persona, setPersona } = useStore();
  return (
    <div className={`persona${kompak ? ' persona--kompak' : ''}`} role="radiogroup" aria-label="Saya adalah">
      <span className="persona__label">Saya:</span>
      {(['pemilik', 'kontraktor'] as const).map((p) => (
        <button key={p} type="button" role="radio" aria-checked={persona === p} className={`chip${persona === p ? ' chip--on' : ''}`} onClick={() => setPersona(p)}>
          {p === 'pemilik' ? 'Pemilik rumah' : 'Kontraktor'}
        </button>
      ))}
    </div>
  );
}
