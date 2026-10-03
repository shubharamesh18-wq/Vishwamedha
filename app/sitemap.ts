import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { services } from '@/lib/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/about', '/founders', '/services', ...services.map((s) => `/services/${s.slug}`), '/academy', '/industries', '/contact'];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date(), changeFrequency: p === '/academy' ? 'weekly' : 'monthly', priority: p === '/' ? 1 : 0.7 }));
}
