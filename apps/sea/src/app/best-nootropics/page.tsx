import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsSEA, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics in Southeast Asia ${CURRENT_YEAR} — SEA Buyer's Guide`,
  description: 'Top nootropic supplements for SEA buyers. Singapore, Malaysia, Thailand, Philippines, Indonesia, Vietnam — regulatory notes for each market.',
  alternates: buildAlternates({ regionCode: 'sea', path: '/best-nootropics/' }),
  openGraph: buildOpenGraph({ regionCode: 'sea', path: '/best-nootropics/', title: `Best Nootropics in Southeast Asia ${CURRENT_YEAR} — SEA Buyer's Guide`, description: 'Top nootropic supplements for SEA buyers. Singapore, Malaysia, Thailand, Philippines, Indonesia, Vietnam — regulatory notes for each market.' }),
  twitter: buildTwitter({ title: `Best Nootropics in Southeast Asia ${CURRENT_YEAR} — SEA Buyer's Guide`, description: 'Top nootropic supplements for SEA buyers. Singapore, Malaysia, Thailand, Philippines, Indonesia, Vietnam — regulatory notes for each market.' }),
};

const faqItems = [
  { q: 'Are nootropics regulated differently across SEA countries?', a: 'Yes. In Singapore, the Health Sciences Authority (HSA) states that "Health supplements are not subject to approvals and licensing by HSA for their importation, manufacture and sales" (hsa.gov.sg, checked 2026-10-08); HSA\'s "up to 3 months’ supply" rule is on its personal-medications page, not for supplements, and we found no personal-import quantity rule for supplements on HSA or Singapore Food Agency (SFA) pages. Indonesia (BPOM) is the most restrictive. Thailand, Philippines, and Vietnam allow personal imports but formal registration is required for commercial sale.' },
  { q: 'Which SEA country has the fastest delivery?', a: 'None of the brands in this list publish delivery estimates for Southeast Asia; delivery depends on the carrier and on customs clearance in each country, so check the estimate at checkout and expect longer times for Indonesia and Vietnam, where personal-import customs processing is stricter.' },
  { q: 'Is Mind Lab Pro popular in Singapore?', a: 'Yes. Mind Lab Pro has a significant following among Singapore\'s professional and expat community. It can be ordered from mindlabpro.com; its shipping page says "Parcels going to Canada and the Rest of the World will be shipped from our depot in the UK", with "Airmail expected delivery time: 5 - 20 working days" and "DHL expected delivery time: 2 - 7 working days" (mindlabpro.com, checked 2026-10-09). It does not give a Singapore-specific delivery time.' },
];

export default function BestNootropicsSEAPage() {
  const winner = productsSEA.find((p) => p.editorChoice)!;
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: `Best Nootropics in Southeast Asia ${CURRENT_YEAR}`, datePublished: '2026-01-15', dateModified: new Date().toISOString().split('T')[0], author: buildPersonAuthorReference(undefined, SITE_URL), publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL } };
  const itemListSchema = { '@context': 'https://schema.org', '@type': 'ItemList', name: `Best Nootropic Supplements SEA ${CURRENT_YEAR}`, itemListElement: productsSEA.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/${p.slug}/` })) };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsSEA}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics/' }]}
        hero={{ eyebrow: `Southeast Asia · Audited ${CURRENT_YEAR}`, h1: `Best Nootropics in Southeast Asia ${CURRENT_YEAR}`, dek: 'Regulatory framework notes for Singapore, Malaysia, Thailand, Philippines, Indonesia and Vietnam: HSA, NPRA, FDA Thailand, FDA Philippines, BPOM, MOH Vietnam. Confirm shipping with the brand before you buy.' }}
        searchItems={searchItems} uiStrings={uiStrings} trackingSurface="best_of_sea"
        preList={
          <div className="flex flex-col gap-5">
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-warn" as="aside" aria-labelledby="sea-note-heading">
              <h2 id="sea-note-heading" className="text-[16px] font-bold text-ds-warn-ink m-0 mb-2">SEA regulatory note</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                Singapore&apos;s Health Sciences Authority (HSA) states that &ldquo;Health supplements are not subject to approvals and licensing by HSA for their importation, manufacture and sales&rdquo; (hsa.gov.sg, checked 2026-10-08). Indonesia (BPOM) is the most restrictive. Thailand / Philippines / Vietnam allow personal imports but commercial sale requires formal registration.
              </p>
              <p className="text-[13.5px] text-ds-ink-soft m-0 mt-2 leading-[1.65]">
                Country guides: <Link href="/nootropics-in-thailand/" className="text-ds-accent underline">nootropics in Thailand</Link> · <Link href="/nootropics-in-the-philippines/" className="text-ds-accent underline">nootropics in the Philippines</Link>.
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
              regulatoryPillar={{ label: 'Halal nootropics in Indonesia (BPJPH)', href: '/halal-nootropics-indonesia-bpjph/' }}
      />
    </>
  );
}
