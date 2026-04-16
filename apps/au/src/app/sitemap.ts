export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';
import { productsAU, ingredients, guides } from '@nootropic/data';

const BASE = 'https://au.thenootropiclab.com';

const states = [
  'new-south-wales', 'victoria', 'queensland', 'western-australia',
  'south-australia', 'tasmania', 'australian-capital-territory', 'northern-territory',
];

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

  const productPages: MetadataRoute.Sitemap = productsAU.map(p => ({
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

  const statePages: MetadataRoute.Sitemap = states.map(slug => ({
    url: `${BASE}/states/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...ingredientPages, ...guidePages, ...statePages];
}
