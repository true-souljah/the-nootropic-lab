import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsGCC, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://gcc.thenootropiclab.com';
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
  { q: 'Do GCC countries charge VAT on imported supplements?', a: 'Saudi Arabia charges 15% VAT on most goods including supplements. UAE and Qatar charge 5% VAT. Kuwait has no VAT currently. Bahrain and Oman charge 5% VAT. Import duties are generally 5% for most supplement categories.' },
  { q: 'Are the supplements listed porcine-free and halal-friendly?', a: 'Mind Lab Pro, Performance Lab Mind, and NooCube do not use porcine-derived ingredients. Some products use bovine-sourced phosphatidylserine instead of soy-derived. Always check the full ingredient list on the brand website for halal certification status.' },
];

export default function BestNootropicsGCCPage() {
  const winner = productsGCC.find((p) => p.editorChoice)!;
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: `Best Nootropics in the GCC ${CURRENT_YEAR}`, datePublished: '2026-01-15', dateModified: new Date().toISOString().split('T')[0], author: buildPersonAuthorReference(undefined, SITE_URL), publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) };
  const itemListSchema = { '@context': 'https://schema.org', '@type': 'ItemList', name: `Best Nootropic Supplements GCC ${CURRENT_YEAR}`, itemListElement: productsGCC.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/${p.slug}/` })) };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsGCC}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics' }]}
        hero={{ eyebrow: `GCC · Audited ${CURRENT_YEAR}`, h1: `Best Nootropics in the GCC ${CURRENT_YEAR}`, dek: 'Caffeine-free, stimulant-free, porcine-free options prioritised. Verified for personal import to Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman.' }}
        searchItems={searchItems} uiStrings={uiStrings} trackingSurface="best_of_gcc"
        preList={
          <div className="flex flex-col gap-5">
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-warn" as="aside" aria-labelledby="gcc-note-heading">
              <h2 id="gcc-note-heading" className="text-[16px] font-bold text-ds-warn-ink m-0 mb-2">GCC import &amp; VAT note</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                Verify with SFDA (Saudi Arabia) or MOHAP (UAE) before ordering. Saudi VAT is 15%; UAE / Qatar / Bahrain / Oman charge 5%; Kuwait has no VAT. Import duties typically 5%. We prioritise caffeine-free, stimulant-free formulations.
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
      />
    </>
  );
}
