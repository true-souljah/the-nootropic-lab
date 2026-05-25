import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion } from '@nootropic/ui';
import { productsCA, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://ca.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics in Canada ${CURRENT_YEAR} — Canadian Buyer's Guide`,
  description: `Top-rated nootropic supplements for Canadian buyers in ${CURRENT_YEAR}. Canadian shipping confirmed, evidence-graded reviews, and full clinical dosing audit.`,
  alternates: { canonical: `${SITE_URL}/best-nootropics/` },
};

const faqItems = [
  {
    q: 'Are nootropics legal in Canada?',
    a: 'Most nootropic supplements are legal in Canada as Natural Health Products (NHPs) regulated by Health Canada. Products with an NPN (Natural Product Number) have been reviewed for safety. Some compounds (e.g. racetams, modafinil) are prescription-only. All products we recommend use Health Canada-permissible ingredients.',
  },
  {
    q: 'Do I pay customs duties on nootropics ordered from the US or UK?',
    a: 'Orders under CAD $150 from the US typically enter duty-free under CUSMA/USMCA. UK orders may attract duties after Brexit changes. Products shipped from within North America are your safest bet for avoiding import delays.',
  },
  {
    q: 'Which nootropic ships fastest to Canada?',
    a: 'Mind Lab Pro and Performance Lab Mind both ship directly to Canada from their UK/EU warehouses, typically arriving in 5-10 business days. US-based brands like Alpha Brain ship from domestic US warehouses to Canada in 3-7 days.',
  },
];

const goalLinks = [
  { href: '/best-nootropics-for-focus/', title: 'Best Nootropics for Focus', desc: 'L-theanine + caffeine, citicoline, Alpha-GPC' },
  { href: '/best-nootropics-for-memory/', title: 'Best Nootropics for Memory', desc: "Bacopa Monnieri, Lion's Mane, phosphatidylserine" },
  { href: '/best-nootropics-for-studying/', title: 'Best Nootropics for Studying', desc: 'Sustained focus + memory consolidation' },
  { href: '/best-nootropics-for-aging/', title: 'Best Nootropics for Aging Brain', desc: 'Phosphatidylserine, citicoline, BDNF support' },
];

export default function BestNootropicsCAPage() {
  const winner = productsCA.find((p) => p.editorChoice)!;
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `Best Nootropics in Canada ${CURRENT_YEAR}`,
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: buildPersonAuthorReference(undefined, SITE_URL),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
  };
  const itemListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: `Best Nootropic Supplements Canada ${CURRENT_YEAR}`,
    itemListElement: productsCA.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/${p.slug}/` })),
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsCA}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics' }]}
        hero={{
          eyebrow: `Canada · Audited ${CURRENT_YEAR}`,
          h1: `Best Nootropics in Canada ${CURRENT_YEAR}`,
          dek: 'All products listed below ship directly to Canada. We verify Canadian availability, Health Canada NHP status where applicable, and note import duties for each brand.',
        }}
        searchItems={searchItems}
        uiStrings={uiStrings}
        trackingSurface="best_of_ca"
        preList={
          <div className="flex flex-col gap-5">
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-good" as="aside" aria-labelledby="ca-note-heading">
              <h2 id="ca-note-heading" className="text-[16px] font-bold text-ds-ink m-0 mb-2">Canada buyer&apos;s note</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                Canadian buyers benefit from CUSMA/USMCA — orders under CAD $150 from the US typically
                enter duty-free. UK brands like Mind Lab Pro and Performance Lab ship internationally
                with standard delivery of 5-10 business days.
              </p>
            </Card>
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-accent">
              <Chip tone="accent">★ Editor&apos;s Choice — Canada {CURRENT_YEAR}</Chip>
              <h2 className="text-[20px] font-bold text-ds-ink m-0 mt-2 mb-1">{winner.name}</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">{winner.summary}</p>
              <a href={winner.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer"
                className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white font-semibold px-5 py-[10px] rounded-[8px] text-[13px] no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2">
                {winner.priceMonthlyUSD ? `Check price ($${winner.priceMonthlyUSD}/mo USD) →` : 'Check price →'}
              </a>
            </Card>
          </div>
        }
        postList={
          <>
            <section>
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-1 tracking-[-0.01em]">Browse by goal</h2>
              <p className="text-[13px] text-ds-muted mb-5">Different ingredients suit different cognitive goals. Each picks list ranks the products available to Canadian buyers at clinical dose.</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {goalLinks.map((g) => (
                  <Link key={g.href} href={g.href} className="block border border-ds-border rounded-[10px] p-4 hover:border-ds-accent-border bg-ds-card focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2">
                    <div className="font-semibold text-ds-ink text-[14px] mb-1">{g.title}</div>
                    <div className="text-[12px] text-ds-muted">{g.desc}</div>
                  </Link>
                ))}
              </div>
            </section>
            <section className="mt-10">
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-4 tracking-[-0.01em]">Canada nootropics FAQ</h2>
              <FaqAccordion items={faqItems} />
            </section>
          </>
        }
      />
    </>
  );
}
