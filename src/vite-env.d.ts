/// <reference types="vite/client" />

/** true hanya pada build internal (tanpa proteksi gambar). */
declare const __GF_INTERNAL__: boolean;

declare module 'virtual:gambar-manifest' {
  const manifest: Record<string, { full: string; thumb: string; w: number; tw: number }>;
  export default manifest;
}
