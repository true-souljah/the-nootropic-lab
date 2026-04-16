export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';
import { productsJP, ingredients, guides } from '@nootropic/data';

const BASE = 'https://jp.thenootropiclab.com';

const prefectures = ['tokyo', 'osaka', 'kanagawa', 'aichi', 'saitama', 'chiba', 'hokkaido', 'fukuoka'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/best-nootropics`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/nootropic-comparison`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = productsJP.map(p => ({
    url: `${BASE}/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const ingredientPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/ingredients`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...ingredients.map(ing => ({
      url: `${BASE}/ingredients/${ing.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  const guidePages: MetadataRoute.Sitemap = [
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...guides.map(g => ({
      url: `${BASE}/guides/${g.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const prefecturePages: MetadataRoute.Sitemap = prefectures.map(slug => ({
    url: `${BASE}/prefectures/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...ingredientPages, ...guidePages, ...prefecturePages];
}
