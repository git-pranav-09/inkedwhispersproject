import { siteConfig } from '@/lib/site-config';
import { getEventSlugs } from '@/lib/data';

export const revalidate = 3600;

export default async function sitemap() {
  const base = siteConfig.url;
  const now = new Date();
  const staticRoutes = ['', '/about', '/core', '/events', '/past-events', '/join', '/newsletter', '/contact', '/privacy', '/terms'].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === '' || p === '/events' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : p === '/events' || p === '/join' ? 0.9 : 0.6,
  }));

  const events = await getEventSlugs();
  const eventRoutes = events.map((e) => ({
    url: `${base}/${e.status === 'completed' ? 'past-events' : 'events'}/${e.slug}`,
    lastModified: e.updated_at ? new Date(e.updated_at) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...eventRoutes];
}
