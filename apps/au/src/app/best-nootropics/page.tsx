import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsAU, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics in Australia ${CURRENT_YEAR} — TGA Import Guide`,
  description: 'Top-rated nootropic supplements for Australian buyers. TGA personal import rules, evidence-graded reviews, and clinical dosing audits.',
  alternates: buildAlternates({ regionCode: 'au', path: '/best-nootropics/' }),
  openGraph: buildOpenGraph({ regionCode: 'au', path: '/best-nootropics/', title: `Best Nootropics in Australia ${CURRENT_YEAR} — TGA Import Guide`, description: 'Top-rated nootropic supplements for Australian buyers. TGA personal import rules, evidence-graded reviews, and clinical dosing audits.' }),
  twitter: buildTwitter({ title: `Best Nootropics in Australia ${CURRENT_YEAR} — TGA Import Guide`, description: 'Top-rated nootropic supplements for Australian buyers. TGA personal import rules, evidence-graded reviews, and clinical dosing audits.' }),
};

const faqItems = [
  { q: 'Are nootropics legal to import into Australia?', a: 'Most nootropic supplements can be personally imported into Australia under the TGA Personal Importation Scheme. Individuals may import up to 3 months\' supply for personal use without a permit. Prescription medicines (modafinil, racetams) require a valid prescription. All products we list use TGA-permissible ingredients.' },
  { q: 'Do I pay GST on supplements imported from overseas?', a: 'From July 2018, overseas businesses with turnover above AUD $75,000 must charge GST (10%) on goods under AUD $1,000. Many supplement brands now add GST automatically at checkout for Australian orders.' },
  { q: 'Which nootropic ships fastest to Australia?', a: 'Mind Lab Pro ships from the UK, typically reaching Australian addresses in 7-14 business days. US-based brands take 10-21 days. All brands listed have confirmed Australian shipping.' },
];

const goalLinks = [
  { href: '/best-nootropics-for-focus/', title: 'Best Nootropics for Focus', desc: 'L-theanine + caffeine, citicoline' },
  { href: '/best-nootropics-for-memory/', title: 'Best Nootropics for Memory', desc: "Bacopa, Lion's Mane, phosphatidylserine" },
  { href: '/best-nootropics-for-studying/', title: 'Best Nootropics for Studying', desc: 'Sustained focus + memory consolidation' },
  { href: '/best-nootropics-for-aging/', title: 'Best Nootropics for Aging Brain', desc: 'PS + citicoline + BDNF support' },
];

export default function BestNootropicsAUPage() {
  const winner = productsAU.find((p) => p.editorChoice)!;
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: `Best Nootropics in Australia ${CURRENT_YEAR}`, datePublished: '2026-01-15', dateModified: new Date().toISOString().split('T')[0], author: buildPersonAuthorReference(undefined, SITE_URL), publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) };
  const itemListSchema = { '@context': 'https://schema.org', '@type': 'ItemList', name: `Best Nootropic Supplements Australia ${CURRENT_YEAR}`, itemListElement: productsAU.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/${p.slug}/` })) };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsAU}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics' }]}
        hero={{ eyebrow: `Australia · Audited ${CURRENT_YEAR}`, h1: `Best Nootropics in Australia ${CURRENT_YEAR}`, dek: 'Under the TGA Personal Importation Scheme, individuals can import up to 3 months\' supply of food-supplement nootropics without a permit. Below: every product with confirmed Australian shipping.' }}
        searchItems={searchItems} uiStrings={uiStrings} trackingSurface="best_of_au"
        preList={
          <div className="flex flex-col gap-5">
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-warn" as="aside" aria-labelledby="au-note-heading">
              <h2 id="au-note-heading" className="text-[16px] font-bold text-ds-warn-ink m-0 mb-2">TGA personal import note</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                The TGA Personal Importation Scheme allows up to 3 months&apos; supply per import for personal use without a permit. Prescription medicines (modafinil, racetams) still require a valid prescription. GST (10%) applies to imported supplements; many brands add it at checkout.
              </p>
            </Card>
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-accent">
              <Chip tone="accent">★ Editor&apos;s Choice — Australia {CURRENT_YEAR}</Chip>
              <h2 className="text-[20px] font-bold text-ds-ink m-0 mt-2 mb-1">{winner.name}</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">{winner.summary}</p>
              <a href={winner.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white font-semibold px-5 py-[10px] rounded-[8px] text-[13px] no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2">
                {winner.priceMonthlyAUD ? `Check AU price (A$${winner.priceMonthlyAUD}/mo) →` : winner.priceMonthlyUSD ? `Check price ($${winner.priceMonthlyUSD}/mo USD) →` : 'Check price →'}
              </a>
            </Card>
          </div>
        }
        postList={
          <>
            <section>
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-1 tracking-[-0.01em]">Browse by goal</h2>
              <p className="text-[13px] text-ds-muted mb-5">Each picks list ranks the products with confirmed Australian shipping that contain the right ingredient at clinical dose.</p>
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
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-4 tracking-[-0.01em]">Australia nootropics FAQ</h2>
              <FaqAccordion items={faqItems} />
            </section>
          </>
        }
      />
    </>
  );
}
