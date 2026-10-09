import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsCA, buildPersonAuthorReference, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics in Canada ${CURRENT_YEAR} — Canadian Buyer's Guide`,
  description: `Top-rated nootropic supplements for Canadian buyers in ${CURRENT_YEAR}. Evidence-graded reviews, Health Canada licence status and a full clinical dosing audit.`,
  alternates: buildAlternates({ regionCode: 'ca', path: '/best-nootropics/' }),
  openGraph: buildOpenGraph({ regionCode: 'ca', path: '/best-nootropics/', title: `Best Nootropics in Canada ${CURRENT_YEAR} — Canadian Buyer's Guide`, description: `Top-rated nootropic supplements for Canadian buyers in ${CURRENT_YEAR}. Evidence-graded reviews, Health Canada licence status and a full clinical dosing audit.` }),
  twitter: buildTwitter({ title: `Best Nootropics in Canada ${CURRENT_YEAR} — Canadian Buyer's Guide`, description: `Top-rated nootropic supplements for Canadian buyers in ${CURRENT_YEAR}. Evidence-graded reviews, Health Canada licence status and a full clinical dosing audit.` }),
};

const faqItems = [
  {
    q: 'Are nootropics legal in Canada?',
    // NPN wording: Health Canada product-licensing page (checked 2026-10-08).
    // Modafinil: Prescription Drug List, human use, row "Modafinil or its
    // salts" (effective 2013-12-19), fetched 2026-10-09 from
    // https://hpr-rps.hres.ca/pdl-phu.php. Piracetam, aniracetam and
    // phenylpiracetam were not found on that list, so no schedule is stated.
    a: 'Most nootropic supplements are legal in Canada as Natural Health Products (NHPs) regulated by Health Canada. Products with an NPN (Natural Product Number) have been reviewed and approved by Health Canada for safety and efficacy (canada.ca, checked 2026-10-08). Modafinil is on Health Canada’s Prescription Drug List (“Modafinil or its salts”; Health Canada Prescription Drug List, checked 2026-10-09). For racetams, check their status on Health Canada’s Prescription Drug List before importing.',
  },
  {
    q: 'Do I pay customs duties on nootropics ordered from the US or UK?',
    // Thresholds quoted verbatim from the CBSA page "Increase to low-value
    // shipment thresholds and other changes"
    // (https://www.cbsa-asfc.gc.ca/services/cusma-aceum/lvs-efv-eng.html,
    // fetched 2026-10-09, page dated 2025-11-25). Amounts are CAD value for duty.
    a: 'It depends on how the parcel is shipped and where it comes from. For a shipment imported by courier from the US or Mexico, the Canada Border Services Agency (CBSA) lists: “Up to $40: duty and tax free”, “Above $40 to $150: duty free, but taxes still apply” and “Above $150: duties and taxes apply”. For a courier shipment from any other country, including the UK: “Up to $20: duty and tax free”. For a shipment imported by mail: “Above $20: duties and taxes apply when imported from any country, including the US and Mexico”. The amounts are in Canadian dollars and refer to the value for duty (CBSA, checked 2026-10-09).',
  },
  {
    q: 'Which nootropic ships fastest to Canada?',
    // Mind Lab Pro: vendorTerms.shipping in products-ca.json (ca.mindlabpro.com,
    // checked 2026-10-07). Onnit: store-locator statement (checked 2026-10-07,
    // same check as apps/ca/src/app/alpha-brain-canada/page.tsx).
    a: 'We do not publish a delivery-time comparison: confirm the estimate for your address at checkout. Mind Lab Pro says “Parcels going to Canada and the Rest of the World will be shipped from our depot in the UK by international tracked airmail or DHL Courier” (ca.mindlabpro.com, checked 2026-10-07). For Alpha Brain, Onnit says its website “is directed only to U.S. consumers” (onnit.com, checked 2026-10-07); confirm Canadian delivery before you order.',
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
  const itemListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: `Best Nootropic Supplements Canada ${CURRENT_YEAR}`,
    itemListElement: productsCA.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/${p.slug}/` })),
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsCA}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics/' }]}
        hero={{
          eyebrow: `Canada · Audited ${CURRENT_YEAR}`,
          h1: `Best Nootropics in Canada ${CURRENT_YEAR}`,
          dek: 'For each product we show its Health Canada licence status (Natural Product Number). Confirm shipping and any import duties with the brand before you buy.',
        }}
        searchItems={searchItems}
        uiStrings={uiStrings}
        trackingSurface="best_of_ca"
        healthDisclaimer={getRegionalHealthDisclaimer('ca')}
      regulatoryPillar={{ label: 'NPN-licensed nootropics in Canada', href: '/npn-licensed-nootropics-canada/' }}
        preList={
          <div className="flex flex-col gap-5">
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-good" as="aside" aria-labelledby="ca-note-heading">
              <h2 id="ca-note-heading" className="text-[16px] font-bold text-ds-ink m-0 mb-2">Canada buyer&apos;s note</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                For a shipment imported by courier from the US or Mexico, the CBSA lists &ldquo;Up to $40: duty
                and tax free&rdquo; and &ldquo;Above $40 to $150: duty free, but taxes still apply&rdquo; (
                <a href="https://www.cbsa-asfc.gc.ca/services/cusma-aceum/lvs-efv-eng.html" target="_blank" rel="noopener noreferrer" className="underline">CBSA</a>,
                checked 2026-10-09). Mind Lab Pro ships parcels to Canada from its depot in the UK
                (ca.mindlabpro.com, checked 2026-10-07); confirm the delivery estimate at checkout.
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
