import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsEU, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics in Europe ${CURRENT_YEAR}: EU-Compliant, EUR-Priced, Evidence-Graded`,
  description:
    'The only nootropic comparison platform built for EU buyers. EUR pricing, EU regulatory compliance status (Directive 2002/46/EC), and full ingredient dosing audit.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/best-nootropics/' }),
  openGraph: buildOpenGraph({ regionCode: 'eu', path: '/best-nootropics/', title: `Best Nootropics in Europe ${CURRENT_YEAR}: EU-Compliant, EUR-Priced, Evidence-Graded`, description: 'The only nootropic comparison platform built for EU buyers. EUR pricing, EU regulatory compliance status (Directive 2002/46/EC), and full ingredient dosing audit.' }),
  twitter: buildTwitter({ title: `Best Nootropics in Europe ${CURRENT_YEAR}: EU-Compliant, EUR-Priced, Evidence-Graded`, description: 'The only nootropic comparison platform built for EU buyers. EUR pricing, EU regulatory compliance status (Directive 2002/46/EC), and full ingredient dosing audit.' }),
};

const faqItems = [
  {
    q: 'Are nootropics legal in the EU?',
    a: 'Most nootropic supplements are legal in the EU as food supplements under Directive 2002/46/EC. However, some compounds (e.g. racetams, modafinil) are prescription-only or restricted in specific EU member states. All products we recommend use EFSA-permissible ingredients.',
  },
  {
    q: 'Which nootropic is best for EU buyers?',
    a: 'Mind Lab Pro is our top pick for EU buyers. It has a dedicated EU storefront with EUR pricing, ships from within the EU to avoid customs, and the formula is fully compliant with EU Directive 2002/46/EC.',
  },
  {
    q: 'Do I need to pay customs duties on nootropics ordered from the US?',
    a: 'Yes — if ordered from a US store, EU buyers may be charged import duties and VAT. We only recommend products with dedicated EU storefronts in our EU comparison table to avoid this.',
  },
];

const goalLinks = [
  { href: '/best-nootropics-for-focus/', title: 'Best Nootropics for Focus', desc: 'L-theanine + caffeine, citicoline, L-tyrosine' },
  { href: '/best-nootropics-for-memory/', title: 'Best Nootropics for Memory', desc: "Bacopa, Lion's Mane, phosphatidylserine" },
  { href: '/best-nootropics-for-studying/', title: 'Best Nootropics for Studying', desc: 'Sustained focus + memory consolidation' },
  { href: '/best-nootropics-for-aging/', title: 'Best Nootropics for Aging Brain', desc: "Phosphatidylserine, citicoline, Lion's Mane" },
];

export default function BestNootropicsEUPage() {
  const winner = productsEU.find((p) => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Nootropics in Europe ${CURRENT_YEAR}: EU-Compliant, EUR-Priced, Evidence-Graded`,
    datePublished: `${CURRENT_YEAR}-01-15`,
    dateModified: new Date().toISOString().split('T')[0],
    author: buildPersonAuthorReference(undefined, SITE_URL),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab EU', url: SITE_URL },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Nootropic Supplements Europe ${CURRENT_YEAR}`,
    itemListElement: productsEU.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/${p.slug}/`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsEU}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics' }]}
        hero={{
          eyebrow: `EU · Audited ${CURRENT_YEAR}`,
          h1: `Best Nootropics in Europe ${CURRENT_YEAR}`,
          dek: 'Built specifically for EU buyers. Every product has an EU storefront (EUR pricing, no import tax) and has been checked against EU Directive 2002/46/EC and EFSA health claim Regulation (EC) 1924/2006.',
        }}
        searchItems={searchItems}
        uiStrings={uiStrings}
        trackingSurface="best_of_eu"
        preList={
          <div className="flex flex-col gap-5">
            <Card
              variant="subdued"
              padding={20}
              className="border-l-[3px] border-l-ds-accent"
              as="aside"
              aria-labelledby="eu-reg-heading"
            >
              <h2 id="eu-reg-heading" className="text-[16px] font-bold text-ds-ink m-0 mb-2">
                EU regulatory context
              </h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                Nootropic supplements are regulated as food supplements in the EU under{' '}
                <strong>Directive 2002/46/EC</strong>. Health claims must comply with{' '}
                <strong>Regulation (EC) 1924/2006</strong> using EFSA-approved claims only.
                Novel Food ingredients require authorisation under{' '}
                <strong>Regulation (EU) 2015/2283</strong>. Products rated{' '}
                <Chip tone="good">EU-compliant</Chip> in the table use ingredients with established
                EU food-supplement status.
              </p>
            </Card>

            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-accent">
              <Chip tone="accent">★ Editor&apos;s Choice — EU {CURRENT_YEAR}</Chip>
              <h2 className="text-[20px] font-bold text-ds-ink m-0 mt-2 mb-1">{winner.name}</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">{winner.summary}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Chip tone="good">EU-compliant</Chip>
                <Chip>EUR pricing</Chip>
                <Chip>Ships from EU</Chip>
              </div>
              <a
                href={winner.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white font-semibold px-5 py-[10px] rounded-[8px] text-[13px] no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                {winner.priceMonthlyEUR
                  ? `Check EU price (€${winner.priceMonthlyEUR}/mo) →`
                  : 'Check EU price →'}
              </a>
            </Card>
          </div>
        }
        postList={
          <>
            <section>
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-1 tracking-[-0.01em]">
                Browse by goal
              </h2>
              <p className="text-[13px] text-ds-muted mb-5">
                Different ingredients suit different cognitive goals. Each picks list ranks the
                EU-storefront products in our coverage that contain the right ingredient at clinical
                dose.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {goalLinks.map((g) => (
                  <Link
                    key={g.href}
                    href={g.href}
                    className="block border border-ds-border rounded-[10px] p-4 hover:border-ds-accent-border bg-ds-card focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                  >
                    <div className="font-semibold text-ds-ink text-[14px] mb-1">{g.title}</div>
                    <div className="text-[12px] text-ds-muted">{g.desc}</div>
                  </Link>
                ))}
              </div>
            </section>

            <Card variant="subdued" padding={24} className="mt-10 border-l-[3px] border-l-ds-accent">
              <h2 className="text-[18px] font-bold text-ds-ink m-0 mb-2">How we score nootropics</h2>
              <p className="text-[14px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">
                Each product is scored across 5 pillars: ingredient quality, dosing vs. clinical
                evidence, formula transparency, value for money, and brand trust.
              </p>
              <Link href="/methodology" className="text-ds-accent underline text-[13px] font-semibold">
                Read our full methodology →
              </Link>
            </Card>

            <section className="mt-10">
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-4 tracking-[-0.01em]">
                EU nootropics FAQ
              </h2>
              <FaqAccordion items={faqItems} />
            </section>
          </>
        }
              regulatoryPillar={{ label: 'EFSA-approved cognitive supplement framework', href: '/efsa-approved-cognitive-supplements/' }}
      />
    </>
  );
}
