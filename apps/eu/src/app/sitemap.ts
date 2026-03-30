import type { MetadataRoute } from 'next';
import { productsEU, ingredients, guides, euCountries } from '@nootropic/data';

const BASE = 'https://eu.thenootropiclab.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/best-nootropics`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/nootropic-comparison`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/de/beste-nootropika`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/fr/meilleurs-nootropiques`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const productPages: MetadataRoute.Sitemap = productsEU.map(p => ({
    url: `${BASE}/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
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

  const countryPages: MetadataRoute.Sitemap = euCountries.map(c => ({
    url: `${BASE}/countries/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...ingredientPages, ...guidePages, ...countryPages];
}
