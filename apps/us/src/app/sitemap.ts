export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';
import { productsUS, ingredients, guides } from '@nootropic/data';

const BASE = 'https://thenootropiclab.com';

const states = [
  'alabama','alaska','arizona','arkansas','california','colorado','connecticut',
  'delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa',
  'kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan',
  'minnesota','mississippi','missouri','montana','nebraska','nevada',
  'new-hampshire','new-jersey','new-mexico','new-york','north-carolina',
  'north-dakota','ohio','oklahoma','oregon','pennsylvania','rhode-island',
  'south-carolina','south-dakota','tennessee','texas','utah','vermont',
  'virginia','washington','west-virginia','wisconsin','wyoming',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/best-nootropics`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/nootropic-comparison`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/es`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/es/mejores-nootropicos`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/es/comparar`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const productPages: MetadataRoute.Sitemap = productsUS.map(p => ({
    url: `${BASE}/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const statePages: MetadataRoute.Sitemap = states.map(s => ({
    url: `${BASE}/${s}/best-nootropics`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
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

  return [...staticPages, ...productPages, ...statePages, ...ingredientPages, ...guidePages];
}
