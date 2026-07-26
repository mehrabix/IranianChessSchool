import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://iranian-chess-school.vercel.app';
  const locales = ['en', 'fa', 'ru', 'it', 'de', 'fr', 'no'];
  const pages = ['', '/about', '/kids', '/faq', '/blog', '/contact', '/pricing', '/courses', '/dashboard'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      });
    }
  }

  return entries;
}
