export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';
import { routeDates, productsJP, ingredients, guides, jpPrefectures } from '@nootropic/data';

const BASE = 'https://jp.thenootropiclab.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const d = routeDates('jp');

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: d.productListing(''), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/best-nootropics/`, lastModified: d.productListing('best-nootropics'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/best-nootropics-for-focus/`, lastModified: d.productListing('best-nootropics-for-focus'), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/best-nootropics-for-memory/`, lastModified: d.productListing('best-nootropics-for-memory'), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/best-nootropics-for-studying/`, lastModified: d.productListing('best-nootropics-for-studying'), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/best-nootropics-for-aging/`, lastModified: d.productListing('best-nootropics-for-aging'), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/nootropic-comparison/`, lastModified: d.productListing('nootropic-comparison'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/ffc-notified-cognitive-supplements/`, lastModified: d.productListing('ffc-notified-cognitive-supplements'), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/imprint/`, lastModified: d.page('imprint'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/methodology/`, lastModified: d.page('methodology'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about/`, lastModified: d.page('about'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact/`, lastModified: d.page('contact'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/privacy-policy/`, lastModified: d.page('privacy-policy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/cookie-policy/`, lastModified: d.page('cookie-policy'), changeFrequency: 'yearly', priority: 0.3 },
    // Japanese locale pages
    { url: `${BASE}/ja/`, lastModified: d.productListing('ja'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/ja/best-nootropics/`, lastModified: d.productListing('ja/best-nootropics'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/ja/hikaku/`, lastModified: d.productListing('ja/hikaku'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/ja/yakkan-shoumei/`, lastModified: d.productListing('ja/yakkan-shoumei'), changeFrequency: 'monthly', priority: 0.75 },
  ];
  const productPages: MetadataRoute.Sitemap = productsJP.map(p => ({
    url: `${BASE}/${p.slug}/`,
    lastModified: d.product(p),
    changeFrequency: 'weekly' as const,
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
    { url: `${BASE}/prefectures/`, lastModified: d.geoHub('prefectures'), changeFrequency: 'monthly', priority: 0.7 },
  ];
  const prefecturePages: MetadataRoute.Sitemap = jpPrefectures.map(p => ({
    url: `${BASE}/prefectures/${p.slug}/`,
    lastModified: d.geo('prefectures', 'prefecture'),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...ingredientPages, ...guidePages, ...geoHubPage, ...prefecturePages];
}
