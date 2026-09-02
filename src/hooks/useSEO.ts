import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description: string;
  h1?: string;
}

export function useSEO({ title, description }: SEOOptions) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
}
