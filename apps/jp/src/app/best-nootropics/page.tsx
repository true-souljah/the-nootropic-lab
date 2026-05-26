import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion, buildAlternates} from '@nootropic/ui';
import { productsJP, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://jp.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics in Japan ${CURRENT_YEAR} (日本) — MHLW Import Guide`,
  description: 'Top nootropic supplements for Japan buyers. International brands with Japan shipping + domestic FANCL and Suntory options. MHLW import compliance notes.',
  alternates: buildAlternates({ regionCode: 'jp', path: '/best-nootropics/' }),
};

const faqItems = [
  { q: 'What is the duty-free import limit for supplements in Japan?', a: 'Japan allows personal imports duty-free up to ¥16,000 in value. Orders above this threshold may attract customs duties (typically 0–6.5% plus 10% consumption tax). To stay under the limit, order no more than 1 month\'s supply at a time from international brands.' },
  { q: 'Are racetams or modafinil legal in Japan?', a: 'Racetams (piracetam, aniracetam) are unregulated in Japan but are not widely sold domestically. Modafinil is a prescription drug in Japan. We only recommend products using MHLW-permissible ingredients.' },
  { q: 'What is the difference between FANCL BRAINs and Mind Lab Pro?', a: 'FANCL BRAINs is a Japanese domestic brand, MHLW-compliant, available on Amazon Japan without import issues. Mind Lab Pro is an international premium stack with higher clinical doses but requires international ordering. For first-time buyers, FANCL is lower-risk; for maximum efficacy, Mind Lab Pro leads our ranking.' },
];

export default function BestNootropicsJPPage() {
  const winner = productsJP.find((p) => p.editorChoice)!;
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: `Best Nootropics in Japan ${CURRENT_YEAR}`, datePublished: '2026-01-15', dateModified: new Date().toISOString().split('T')[0], author: buildPersonAuthorReference(undefined, SITE_URL), publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) };
  const itemListSchema = { '@context': 'https://schema.org', '@type': 'ItemList', name: `Best Nootropic Supplements Japan ${CURRENT_YEAR}`, itemListElement: productsJP.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/${p.slug}/` })) };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsJP}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics' }]}
        hero={{ eyebrow: `Japan · Audited ${CURRENT_YEAR}`, h1: `Best Nootropics in Japan ${CURRENT_YEAR}`, dek: 'International stacks with confirmed Japan shipping, plus MHLW-compliant domestic options (FANCL, Suntory). Personal import limit is ¥16,000 — keep orders under 1 month\'s supply.' }}
        searchItems={searchItems} uiStrings={uiStrings} trackingSurface="best_of_jp"
        preList={
          <div className="flex flex-col gap-5">
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-warn" as="aside" aria-labelledby="jp-note-heading">
              <h2 id="jp-note-heading" className="text-[16px] font-bold text-ds-warn-ink m-0 mb-2">MHLW personal import note</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                Japan&apos;s personal import limit is ¥16,000 duty-free. Above this, customs duties (0–6.5%) plus 10% consumption tax apply. Modafinil is a prescription drug; we don&apos;t list it. Racetams are unregulated but not widely available domestically.
              </p>
            </Card>
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-accent">
              <Chip tone="accent">★ Editor&apos;s Choice — Japan {CURRENT_YEAR}</Chip>
              <h2 className="text-[20px] font-bold text-ds-ink m-0 mt-2 mb-1">{winner.name}</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">{winner.summary}</p>
              <a href={winner.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white font-semibold px-5 py-[10px] rounded-[8px] text-[13px] no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2">
                {winner.priceMonthlyJPY ? `Check JP price (¥${winner.priceMonthlyJPY.toLocaleString()}/mo) →` : winner.priceMonthlyUSD ? `Check price ($${winner.priceMonthlyUSD}/mo USD) →` : 'Check price →'}
              </a>
            </Card>
          </div>
        }
        postList={
          <section>
            <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-4 tracking-[-0.01em]">Japan nootropics FAQ</h2>
            <FaqAccordion items={faqItems} />
          </section>
        }
      />
    </>
  );
}
