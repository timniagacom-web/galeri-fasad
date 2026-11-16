import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { MAX_COMPARE } from '../config';

export type Persona = 'pemilik' | 'kontraktor';

const read = <T,>(key: string, def: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : def;
  } catch {
    return def;
  }
};
const write = (key: string, v: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* localStorage tidak tersedia (mode privat) — abaikan */
  }
};

type Store = {
  saved: string[];
  compare: string[];
  persona: Persona;
  toggleSaved: (id: string) => void;
  toggleCompare: (id: string) => boolean; // false bila penuh
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  setPersona: (p: Persona) => void;
  notice: string;
  setNotice: (s: string) => void;
};
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>(() => read('gf_saved', []));
  const [compare, setCompare] = useState<string[]>(() => read('gf_compare', []));
  const [persona, setPersonaState] = useState<Persona>(() => read('gf_persona', 'pemilik'));
  const [notice, setNotice] = useState('');

  useEffect(() => write('gf_saved', saved), [saved]);
  useEffect(() => write('gf_compare', compare), [compare]);
  useEffect(() => write('gf_persona', persona), [persona]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const toggleSaved = useCallback((id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])), []);
  const toggleCompare = useCallback(
    (id: string) => {
      if (compare.includes(id)) {
        setCompare((c) => c.filter((x) => x !== id));
        return true;
      }
      if (compare.length >= MAX_COMPARE) {
        setNotice(`Maksimal ${MAX_COMPARE} fasad untuk dibandingkan. Hapus salah satu dulu.`);
        return false;
      }
      setCompare((c) => [...c, id]);
      return true;
    },
    [compare],
  );
  const value = useMemo<Store>(
    () => ({
      saved, compare, persona, toggleSaved, toggleCompare,
      removeCompare: (id) => setCompare((c) => c.filter((x) => x !== id)),
      clearCompare: () => setCompare([]),
      setPersona: setPersonaState, notice, setNotice,
    }),
    [saved, compare, persona, toggleSaved, toggleCompare, notice],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('StoreProvider hilang');
  return c;
};
