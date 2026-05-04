export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';
import { productsGCC, ingredients, guides, gccCountries, authors } from '@nootropic/data';

const BASE = 'https://gcc.thenootropiclab.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/best-nootropics`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/best-nootropics-for-focus`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/best-nootropics-for-memory`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/best-nootropics-for-studying`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/best-nootropics-for-aging`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/nootropic-comparison`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/authors`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const authorPages: MetadataRoute.Sitemap = authors.map(a => ({
    url: `${BASE}/authors/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const productPages: MetadataRoute.Sitemap = productsGCC.map(p => ({
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

  const countryPages: MetadataRoute.Sitemap = gccCountries.map(c => ({
    url: `${BASE}/countries/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...authorPages, ...productPages, ...ingredientPages, ...guidePages, ...countryPages];
}
