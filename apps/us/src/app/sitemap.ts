export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';
import { routeDates, productsUS, ingredients, guides } from '@nootropic/data';

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
  const d = routeDates('us');

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: d.productListing(''), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/best-nootropics/`, lastModified: d.productListing('best-nootropics'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/mind-lab-pro-vs-alpha-brain/`, lastModified: d.productListing('mind-lab-pro-vs-alpha-brain'), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/mind-lab-pro-vs-qualia-mind/`, lastModified: d.productListing('mind-lab-pro-vs-qualia-mind'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/alpha-brain-vs-qualia-mind/`, lastModified: d.productListing('alpha-brain-vs-qualia-mind'), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/mind-lab-pro-vs-noocube/`, lastModified: d.productListing('mind-lab-pro-vs-noocube'), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/mind-lab-pro-vs-thesis/`, lastModified: d.productListing('mind-lab-pro-vs-thesis'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/best-nootropics-for-focus/`, lastModified: d.productListing('best-nootropics-for-focus'), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/best-nootropics-for-adhd/`, lastModified: d.productListing('best-nootropics-for-adhd'), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/best-nootropics-for-memory/`, lastModified: d.productListing('best-nootropics-for-memory'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/best-nootropics-for-studying/`, lastModified: d.productListing('best-nootropics-for-studying'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/best-nootropics-for-aging/`, lastModified: d.productListing('best-nootropics-for-aging'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/best-nootropics-for-mood/`, lastModified: d.productListing('best-nootropics-for-mood'), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/best-nootropics-for-energy/`, lastModified: d.productListing('best-nootropics-for-energy'), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/natural-adderall-alternatives/`, lastModified: d.productListing('natural-adderall-alternatives'), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/are-nootropics-fda-approved/`, lastModified: d.productListing('are-nootropics-fda-approved'), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/alpha-brain-vs-mind-lab-pro-vs-noocube/`, lastModified: d.productListing('alpha-brain-vs-mind-lab-pro-vs-noocube'), changeFrequency: 'weekly', priority: 0.75 },
    // /quiz/ and /dose-calculator/ deliberately excluded — both pages set
    // `robots: { index: false }` (user-input-dependent tools), so including
    // them was a "Submitted URL marked noindex" contradiction in GSC.
    { url: `${BASE}/imprint/`, lastModified: d.page('imprint'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/cancel-onnit-subscription/`, lastModified: d.productListing('cancel-onnit-subscription'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/cancel-thesis-subscription/`, lastModified: d.productListing('cancel-thesis-subscription'), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/cancel-qualia-subscription/`, lastModified: d.productListing('cancel-qualia-subscription'), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/nootropic-comparison/`, lastModified: d.productListing('nootropic-comparison'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/methodology/`, lastModified: d.page('methodology'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about/`, lastModified: d.page('about'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact/`, lastModified: d.page('contact'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/privacy-policy/`, lastModified: d.page('privacy-policy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/cookie-policy/`, lastModified: d.page('cookie-policy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/es/`, lastModified: d.productListing('es'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/es/mejores-nootropicos/`, lastModified: d.productListing('es/mejores-nootropicos'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/es/comparar/`, lastModified: d.productListing('es/comparar'), changeFrequency: 'weekly', priority: 0.6 },
  ];
  const productPages: MetadataRoute.Sitemap = productsUS.map(p => ({
    url: `${BASE}/${p.slug}/`,
    lastModified: d.product(p),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const statePages: MetadataRoute.Sitemap = states.map(s => ({
    url: `${BASE}/${s}/best-nootropics/`,
    lastModified: d.usState(),
    changeFrequency: 'monthly',
    priority: 0.6,
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

  return [...staticPages, ...productPages, ...statePages, ...ingredientPages, ...guidePages];
}
