import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion } from '@nootropic/ui';
import { productsSEA, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://sea.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics in Southeast Asia ${CURRENT_YEAR} — SEA Buyer's Guide`,
  description: 'Top nootropic supplements for SEA buyers. Singapore, Malaysia, Thailand, Philippines, Indonesia, Vietnam — regulatory notes and shipping confirmed.',
  alternates: { canonical: `${SITE_URL}/best-nootropics/` },
};

const faqItems = [
  { q: 'Are nootropics regulated differently across SEA countries?', a: 'Yes. Singapore (HSA) and Malaysia (NPRA) have the most structured supplement import frameworks. Singapore is the safest entry point — HSA allows personal import of most food supplements. Indonesia (BPOM) is the most restrictive. Thailand, Philippines, and Vietnam allow personal imports but formal registration is required for commercial sale.' },
  { q: 'Which SEA country has the fastest delivery?', a: 'Singapore receives international shipments from the UK and US in 5–10 business days — the fastest hub in SEA. Malaysia and Thailand follow at 7–14 days. Indonesia and Vietnam can take 14–21 days due to customs processing.' },
  { q: 'Is Mind Lab Pro popular in Singapore?', a: 'Yes. Mind Lab Pro has a significant following among Singapore\'s professional and expat community. It is frequently ordered directly from the Opti-Nutra website with delivery to Singapore addresses in approximately 7 business days.' },
];

export default function BestNootropicsSEAPage() {
  const winner = productsSEA.find((p) => p.editorChoice)!;
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: `Best Nootropics in Southeast Asia ${CURRENT_YEAR}`, datePublished: '2026-01-15', dateModified: new Date().toISOString().split('T')[0], author: buildPersonAuthorReference(undefined, SITE_URL), publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) };
  const itemListSchema = { '@context': 'https://schema.org', '@type': 'ItemList', name: `Best Nootropic Supplements SEA ${CURRENT_YEAR}`, itemListElement: productsSEA.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/${p.slug}/` })) };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsSEA}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics' }]}
        hero={{ eyebrow: `Southeast Asia · Audited ${CURRENT_YEAR}`, h1: `Best Nootropics in Southeast Asia ${CURRENT_YEAR}`, dek: 'Shipping confirmed to Singapore, Malaysia, Thailand, Philippines, Indonesia and Vietnam. Regulatory framework notes: HSA, NPRA, FDA Thailand, FDA Philippines, BPOM, MOH Vietnam.' }}
        searchItems={searchItems} uiStrings={uiStrings} trackingSurface="best_of_sea"
        preList={
          <div className="flex flex-col gap-5">
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-warn" as="aside" aria-labelledby="sea-note-heading">
              <h2 id="sea-note-heading" className="text-[16px] font-bold text-ds-warn-ink m-0 mb-2">SEA regulatory note</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                Singapore (HSA) and Malaysia (NPRA) have the most structured personal-import frameworks. Indonesia (BPOM) is the most restrictive. Thailand / Philippines / Vietnam allow personal imports but commercial sale requires formal registration. Singapore is the fastest hub (5–10 days from UK/US).
              </p>
            </Card>
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-accent">
              <Chip tone="accent">★ Editor&apos;s Choice — SEA {CURRENT_YEAR}</Chip>
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
            <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-4 tracking-[-0.01em]">SEA nootropics FAQ</h2>
            <FaqAccordion items={faqItems} />
          </section>
        }
      />
    </>
  );
}
