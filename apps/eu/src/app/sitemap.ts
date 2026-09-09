export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';
import { routeDates, productsEU, ingredients, guides, euCountries } from '@nootropic/data';

const BASE = 'https://eu.thenootropiclab.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const d = routeDates('eu');

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: d.productListing(''), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/best-nootropics/`, lastModified: d.productListing('best-nootropics'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/best-nootropics-for-focus/`, lastModified: d.productListing('best-nootropics-for-focus'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/best-nootropics-for-memory/`, lastModified: d.productListing('best-nootropics-for-memory'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/best-nootropics-for-studying/`, lastModified: d.productListing('best-nootropics-for-studying'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/best-nootropics-for-aging/`, lastModified: d.productListing('best-nootropics-for-aging'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/nootropic-comparison/`, lastModified: d.productListing('nootropic-comparison'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/efsa-approved-cognitive-supplements/`, lastModified: d.productListing('efsa-approved-cognitive-supplements'), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/braineffect-vs-mind-lab-pro/`, lastModified: d.productListing('braineffect-vs-mind-lab-pro'), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/methodology/`, lastModified: d.page('methodology'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about/`, lastModified: d.page('about'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact/`, lastModified: d.page('contact'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/imprint/`, lastModified: d.page('imprint'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/privacy-policy/`, lastModified: d.page('privacy-policy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/cookie-policy/`, lastModified: d.page('cookie-policy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/de/beste-nootropika/`, lastModified: d.productListing('de/beste-nootropika'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/fr/meilleurs-nootropiques/`, lastModified: d.productListing('fr/meilleurs-nootropiques'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/pt/`, lastModified: d.productListing('pt'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/pt/melhores-nootropicos/`, lastModified: d.productListing('pt/melhores-nootropicos'), changeFrequency: 'weekly', priority: 0.8 },
  ];
  const productPages: MetadataRoute.Sitemap = productsEU.map(p => ({
    url: `${BASE}/${p.slug}/`,
    lastModified: d.product(p),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const ingredientPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/ingredients/`, lastModified: d.ingredientsHub(), changeFrequency: 'monthly', priority: 0.8 },
    ...ingredients.map(ing => ({
      url: `${BASE}/ingredients/${ing.slug}/`,
      lastModified: d.ingredient(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  const guidePages: MetadataRoute.Sitemap = [
    { url: `${BASE}/guides/`, lastModified: d.guidesHub(), changeFrequency: 'monthly', priority: 0.7 },
    ...guides.map(g => ({
      url: `${BASE}/guides/${g.slug}/`,
      lastModified: d.guide(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const geoHubPage: MetadataRoute.Sitemap = [
    { url: `${BASE}/countries/`, lastModified: d.geoHub('countries'), changeFrequency: 'monthly', priority: 0.7 },
  ];
  const countryPages: MetadataRoute.Sitemap = euCountries.map(c => ({
    url: `${BASE}/countries/${c.slug}/`,
    lastModified: d.geo('countries', 'country'),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...ingredientPages, ...guidePages, ...geoHubPage, ...countryPages];
}
