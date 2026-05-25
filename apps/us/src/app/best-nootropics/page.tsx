import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion } from '@nootropic/ui';
import { productsUS, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics ${CURRENT_YEAR}: Expert-Tested & Ranked for Focus, Memory and Energy`,
  description: `Independent comparison of the best nootropic supplements in ${CURRENT_YEAR}. Every ingredient audited against clinical trials. Transparent scoring and affiliate disclosure.`,
  alternates: { canonical: `${SITE_URL}/best-nootropics/` },
};

const faqItems = [
  {
    q: `What is the best nootropic supplement in ${CURRENT_YEAR}?`,
    a: `Based on our clinical dosing audit, Mind Lab Pro is the best overall nootropic in ${CURRENT_YEAR}. It contains 11 clinically-backed ingredients at effective doses, is caffeine-free, and ships worldwide.`,
  },
  {
    q: 'Are nootropics safe?',
    a: 'Most mainstream nootropic supplements use food-grade ingredients that are generally safe for healthy adults. Always consult a healthcare professional before starting any supplement.',
  },
  {
    q: 'How long does it take for nootropics to work?',
    a: "Some ingredients like L-theanine have acute effects within 30–60 minutes. Others like Bacopa Monnieri and Lion's Mane require 4–12 weeks of consistent use for measurable cognitive effects.",
  },
];

const goalLinks = [
  { href: '/best-nootropics-for-focus/', title: 'Best Nootropics for Focus', desc: 'L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC' },
  { href: '/best-nootropics-for-memory/', title: 'Best Nootropics for Memory', desc: "Bacopa Monnieri, Lion's Mane, phosphatidylserine" },
  { href: '/best-nootropics-for-studying/', title: 'Best Nootropics for Studying', desc: 'Sustained focus + memory consolidation' },
  { href: '/best-nootropics-for-aging/', title: 'Best Nootropics for Aging Brain', desc: "Phosphatidylserine FDA qualified claim, plus PS, Bacopa, Lion's Mane" },
  { href: '/best-nootropics-for-adhd/', title: 'Nootropics for ADHD-Adjacent Focus', desc: 'Honest editorial: NOT a substitute for prescription treatment' },
  { href: '/natural-adderall-alternatives/', title: 'Natural Adderall Alternatives', desc: 'No supplement is equivalent. What the science actually shows.' },
];

const comparisonLinks = [
  { href: '/mind-lab-pro-vs-alpha-brain/', title: 'Mind Lab Pro vs Alpha Brain', desc: 'Open formula vs proprietary blends' },
  { href: '/mind-lab-pro-vs-qualia-mind/', title: 'Mind Lab Pro vs Qualia Mind', desc: '11 ingredients vs 28 megadose' },
  { href: '/alpha-brain-vs-qualia-mind/', title: 'Alpha Brain vs Qualia Mind', desc: 'Mainstream brand vs premium megadose' },
];

const recommendedReading = [
  { href: '/guides/what-are-nootropics', title: 'What Are Nootropics?', desc: "A beginner's guide to cognitive supplements" },
  { href: '/guides/how-to-stack-nootropics', title: 'How to Stack Nootropics', desc: 'Combine ingredients safely for better results' },
  { href: '/ingredients', title: 'Ingredient Database', desc: 'Evidence-graded profiles for 15 key nootropics' },
  { href: '/guides/nootropics-for-focus-vs-memory', title: 'Focus vs. Memory', desc: 'Which nootropics work best for your goal?' },
];

export default function BestNootropicsUSPage() {
  const winner = productsUS.find((p) => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Nootropics ${CURRENT_YEAR}: Expert-Tested & Ranked`,
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: buildPersonAuthorReference(undefined, SITE_URL),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
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
    name: `Best Nootropic Supplements ${CURRENT_YEAR}`,
    itemListElement: productsUS.map((p, i) => ({
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
        products={productsUS}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics' }]}
        hero={{
          eyebrow: `Audited ${CURRENT_YEAR} · Methodology v3.2`,
          h1: `Best Nootropics ${CURRENT_YEAR} — US`,
          dek: `We reviewed ${productsUS.length} nootropic supplements, auditing every ingredient dose against peer-reviewed clinical trials. Below is our ranked comparison with full scoring breakdown and subscription transparency ratings.`,
        }}
        searchItems={searchItems}
        uiStrings={uiStrings}
        trackingSurface="best_of_us"
        preList={
          <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-accent">
            <div className="flex items-center gap-2 mb-2">
              <Chip>★ Editor&apos;s Choice {CURRENT_YEAR}</Chip>
            </div>
            <h2 className="text-[20px] font-bold text-ds-ink m-0 mb-1">{winner.name}</h2>
            <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.6] mb-3">{winner.summary}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {winner.pros.slice(0, 3).map((pro) => (
                <Chip key={pro} tone="good">✓ {pro}</Chip>
              ))}
            </div>
            <a
              href={winner.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white font-semibold px-5 py-[10px] rounded-[8px] text-[13px] no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              {winner.priceMonthlyUSD
                ? `Check current price ($${winner.priceMonthlyUSD}/mo) →`
                : 'Check current price →'}
            </a>
          </Card>
        }
        postList={
          <>
            {/* Browse by goal */}
            <section>
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-1 tracking-[-0.01em]">
                Browse by goal
              </h2>
              <p className="text-[13px] text-ds-muted mb-5">
                Different ingredients suit different cognitive goals. Each picks list ranks the products in our
                coverage that contain the right ingredient at clinical dose.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* Compare top brands */}
            <section className="mt-10">
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-1 tracking-[-0.01em]">
                Compare top brands head-to-head
              </h2>
              <p className="text-[13px] text-ds-muted mb-5">
                Side-by-side clinical dosing audits + score breakdowns + verdict for the most-asked-about brand pairs.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {comparisonLinks.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block border border-ds-border rounded-[10px] p-4 hover:border-ds-accent-border bg-ds-card focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                  >
                    <div className="font-semibold text-ds-ink text-[14px] mb-1">{c.title}</div>
                    <div className="text-[12px] text-ds-muted">{c.desc}</div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Methodology callout */}
            <Card variant="subdued" padding={24} className="mt-10 border-l-[3px] border-l-ds-accent">
              <h2 className="text-[18px] font-bold text-ds-ink m-0 mb-2">How we score nootropics</h2>
              <p className="text-[14px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">
                Each product is scored across 5 pillars: ingredient quality, dosing vs. clinical evidence,
                formula transparency, value for money, and brand trust.
              </p>
              <Link href="/methodology" className="text-ds-accent underline text-[13px] font-semibold">
                Read our full methodology →
              </Link>
            </Card>

            {/* FAQ */}
            <section className="mt-10">
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-4 tracking-[-0.01em]">
                Frequently asked questions
              </h2>
              <FaqAccordion items={faqItems} />
            </section>

            {/* Recommended reading */}
            <Card variant="subdued" padding={24} className="mt-10 border-l-[3px] border-l-ds-good">
              <h2 className="text-[18px] font-bold text-ds-ink m-0 mb-4">Recommended reading</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {recommendedReading.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="block bg-ds-card rounded-[10px] p-4 border border-ds-border hover:border-ds-accent-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                  >
                    <div className="font-semibold text-ds-ink text-[13.5px] mb-1">{r.title}</div>
                    <div className="text-[12px] text-ds-muted">{r.desc}</div>
                  </Link>
                ))}
              </div>
            </Card>
          </>
        }
      />
    </>
  );
}
