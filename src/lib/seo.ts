import { useEffect } from 'react';
import { BRAND, SITE_URL } from '../config';

type Seo = { title: string; description: string; image?: string; route: string; jsonLd?: object[] };

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export function useSeo({ title, description, image, route, jsonLd }: Seo) {
  useEffect(() => {
    const full = title.includes(BRAND) ? title : `${title} — ${BRAND}`;
    document.title = full;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    if (image) setMeta('property', 'og:image', new URL(image, window.location.href).href);

    let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (SITE_URL) {
      if (!canon) {
        canon = document.createElement('link');
        canon.rel = 'canonical';
        document.head.appendChild(canon);
      }
      canon.href = `${SITE_URL.replace(/\/$/, '')}/#${route}`;
    } else canon?.remove();

    document.head.querySelectorAll('script[data-gf-ld]').forEach((s) => s.remove());
    (jsonLd ?? []).forEach((obj) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.dataset.gfLd = '1';
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
    });
  }, [title, description, image, route, jsonLd]);
}
