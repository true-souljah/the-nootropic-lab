import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsGCC, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics in the GCC ${CURRENT_YEAR} — Saudi, UAE, Qatar Buyer's Guide`,
  description: 'Top nootropic supplements for GCC buyers. Caffeine-free options prioritised. Import and VAT notes for Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman.',
  alternates: buildAlternates({ regionCode: 'gcc', path: '/best-nootropics/' }),
  openGraph: buildOpenGraph({ regionCode: 'gcc', path: '/best-nootropics/', title: `Best Nootropics in the GCC ${CURRENT_YEAR} — Saudi, UAE, Qatar Buyer's Guide`, description: 'Top nootropic supplements for GCC buyers. Caffeine-free options prioritised. Import and VAT notes for Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman.' }),
  twitter: buildTwitter({ title: `Best Nootropics in the GCC ${CURRENT_YEAR} — Saudi, UAE, Qatar Buyer's Guide`, description: 'Top nootropic supplements for GCC buyers. Caffeine-free options prioritised. Import and VAT notes for Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman.' }),
};

const faqItems = [
  { q: 'Are nootropics legal in Saudi Arabia and the UAE?', a: 'Most nootropic supplements are legal to personally import in Saudi Arabia and the UAE as food supplements. However, you must verify with SFDA (Saudi Arabia) or MOHAP (UAE) before ordering. Stimulant-containing supplements may face restrictions. We prioritise caffeine-free, stimulant-free formulations for the GCC.' },
  { q: 'Do GCC countries charge VAT on imported supplements?', a: 'VAT may apply at checkout or on import. Rates and import duties vary by state and were not confirmed from an official page in our 2026-10-05 check — confirm with customs or the brand before ordering.' },
  { q: 'Are the supplements listed porcine-free or halal-certified?', a: 'We record each brand’s capsule-shell statement and whether a halal certificate is shown; rankings are not adjusted for it. None of the brands we checked shows a halal certificate (checked 2026-10-07). On capsules, Mind Lab Pro states pullulan (NutriCaps) capsules and Qualia Mind lists hypromellose and “6 Vegetarian Capsules”; NooCube, Onnit Alpha Brain, Thesis and Nootropics Depot do not name the capsule material on the pages we checked, and Eu Yan Sang BrainMAX+ is a powder sachet. Our halal-certified nootropics page has the brand-by-brand audit.' },
];

export default function BestNootropicsGCCPage() {
  const winner = productsGCC.find((p) => p.editorChoice)!;
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: `Best Nootropics in the GCC ${CURRENT_YEAR}`, datePublished: '2026-01-15', dateModified: new Date().toISOString().split('T')[0], author: buildPersonAuthorReference(undefined, SITE_URL), publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL } };
  const itemListSchema = { '@context': 'https://schema.org', '@type': 'ItemList', name: `Best Nootropic Supplements GCC ${CURRENT_YEAR}`, itemListElement: productsGCC.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/${p.slug}/` })) };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsGCC}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics/' }]}
        hero={{ eyebrow: `GCC · Audited ${CURRENT_YEAR}`, h1: `Best Nootropics in the GCC ${CURRENT_YEAR}`, dek: 'Caffeine-free, stimulant-free options prioritised. We record each brand’s capsule-shell statement and whether a halal certificate is shown (none of the brands we checked shows one, checked 2026-10-07); rankings are not adjusted for it. Each review notes whether the brand ships to Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman — several do not.' }}
        searchItems={searchItems} uiStrings={uiStrings} trackingSurface="best_of_gcc"
        preList={
          <div className="flex flex-col gap-5">
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-warn" as="aside" aria-labelledby="gcc-note-heading">
              <h2 id="gcc-note-heading" className="text-[16px] font-bold text-ds-warn-ink m-0 mb-2">GCC import &amp; VAT note</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                Verify with SFDA (Saudi Arabia) or MOHAP (UAE) before ordering. VAT may apply at checkout or on import; rates and import duties were not confirmed from an official page in our 2026-10-05 check. We prioritise caffeine-free, stimulant-free formulations.
              </p>
            </Card>
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-accent">
              <Chip tone="accent">★ Editor&apos;s Choice — GCC {CURRENT_YEAR}</Chip>
              <h2 className="text-[20px] font-bold text-ds-ink m-0 mt-2 mb-1">{winner.name}</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">{winner.summary}</p>
              <a href={winner.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white font-semibold px-5 py-[10px] rounded-[8px] text-[13px] no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2">
                {winner.priceMonthlyUSD ? `Check price ($${winner.priceMonthlyUSD}/mo USD) →` : 'Check price →'}
              </a>
            </Card>
          </div>
        }
        postList={
          <section>
            <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-4 tracking-[-0.01em]">GCC nootropics FAQ</h2>
            <FaqAccordion items={faqItems} />
          </section>
        }
              regulatoryPillar={{ label: 'Halal-certified nootropics in the GCC', href: '/halal-certified-nootropics/' }}
      />
    </>
  );
}
