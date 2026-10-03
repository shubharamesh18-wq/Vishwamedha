import type { Metadata } from 'next';
import { site } from './site';

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${site.shortName}`, description, url, siteName: site.name, locale: 'en_IN', type: 'website' },
    twitter: { card: 'summary_large_image', title: `${title} | ${site.shortName}`, description }
  };
}
