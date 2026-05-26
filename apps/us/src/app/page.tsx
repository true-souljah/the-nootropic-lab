import Link from 'next/link';
import type { Metadata } from 'next';
import { Discover, SchemaOrg, Card, buildAlternates} from '@nootropic/ui';
import { productsUS } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const CURRENT_YEAR = new Date().getFullYear();
const SITE_URL = 'https://thenootropiclab.com';

export const metadata: Metadata = {
  title: 'The Nootropic Lab — Independent Cognitive Supplement Reviews',
  description:
    'The independent nootropic comparison platform for US buyers. Evidence-graded reviews, clinical dosing audits, and transparent affiliate disclosure.',
  openGraph: {
    title: 'The Nootropic Lab — Independent Cognitive Supplement Reviews',
    description: 'Evidence-graded nootropic reviews. Clinical dosing audits. Transparent affiliate disclosure.',
    url: SITE_URL,
    siteName: 'The Nootropic Lab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Nootropic Lab — Independent Cognitive Supplement Reviews',
    description: 'Evidence-graded nootropic reviews. Clinical dosing audits. Transparent affiliate disclosure.',
  },
  alternates: buildAlternates({ regionCode: 'us', path: '/' }),
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab',
  url: SITE_URL,
  description: 'Independent cognitive supplement reviews for US buyers.',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Nootropic Lab',
  url: SITE_URL,
  description: 'Independent cognitive supplement reviews with clinical dosing audits and transparent affiliate disclosure.',
};

const features = [
  {
    icon: '🔬',
    title: 'Clinical dosing audits',
    desc: 'Every product review includes a dosing-vs-evidence table comparing each ingredient to the minimum effective dose from peer-reviewed trials.',
  },
  {
    icon: '✅',
    title: 'NSF & third-party tested',
    desc: 'We prioritise products with independent third-party testing and flag brands with documented BBB or subscription complaints.',
  },
  {
    icon: '⚖️',
    title: 'Subscription transparency',
    desc: 'We score every brand on subscription cancellation experience. Trustpilot scores shown inline — including the bad ones.',
  },
];

const goalLinks = [
  { href: '/best-nootropics-for-focus/', title: 'For focus', desc: 'L-theanine + caffeine, citicoline' },
  { href: '/best-nootropics-for-memory/', title: 'For memory', desc: "Bacopa, Lion's Mane, PS" },
  { href: '/best-nootropics-for-studying/', title: 'For studying', desc: 'Sustained focus + retention' },
  { href: '/best-nootropics-for-aging/', title: 'For aging brain', desc: 'PS FDA qualified claim' },
  { href: '/best-nootropics-for-adhd/', title: 'ADHD-adjacent focus', desc: 'Honest editorial — NOT a substitute for treatment' },
  { href: '/natural-adderall-alternatives/', title: 'Natural Adderall alternatives', desc: 'No supplement is equivalent — what evidence shows' },
];

const comparisonLinks = [
  { href: '/mind-lab-pro-vs-alpha-brain/', title: 'Mind Lab Pro vs Alpha Brain' },
  { href: '/mind-lab-pro-vs-qualia-mind/', title: 'Mind Lab Pro vs Qualia Mind' },
  { href: '/alpha-brain-vs-qualia-mind/', title: 'Alpha Brain vs Qualia Mind' },
];

export default function HomePage() {
  return (
    <>
      <SchemaOrg schema={websiteSchema} />
      <SchemaOrg schema={orgSchema} />
      <Discover
        products={productsUS}
        mode="collapsed"
        searchItems={searchItems}
        uiStrings={uiStrings}
        hero={{
          eyebrow: `US Market · Evidence-Graded · Audited ${CURRENT_YEAR}`,
          h1: 'The Independent US Guide to Cognitive Supplements',
          dek:
            'We test every ingredient dose against peer-reviewed clinical trials. No anonymous authors. No hidden commissions.',
          ctas: [
            { label: `Best Nootropics ${CURRENT_YEAR} →`, href: '/best-nootropics', variant: 'primary' },
            { label: 'Compare All Brands', href: '/nootropic-comparison', variant: 'secondary' },
          ],
        }}
        afterGrid={
          <>
            {/* Why we're different */}
            <section className="mt-12">
              <h2 className="text-[22px] font-bold text-ds-ink mb-6 tracking-[-0.01em]">
                Why The Nootropic Lab is different
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {features.map((f) => (
                  <Card key={f.title} variant="subdued" padding={20}>
                    <div className="text-[28px] mb-2" aria-hidden="true">{f.icon}</div>
                    <h3 className="font-semibold text-ds-ink text-[14px] m-0 mb-1">{f.title}</h3>
                    <p className="text-[13px] text-ds-muted leading-[1.6] m-0">{f.desc}</p>
                  </Card>
                ))}
              </div>
            </section>

            {/* Browse by goal */}
            <section className="mt-12">
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-1 tracking-[-0.01em]">
                Browse by goal
              </h2>
              <p className="text-[13px] text-ds-muted mb-5">
                Different ingredients suit different cognitive goals.
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
            <section className="mt-12">
              <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-1 tracking-[-0.01em]">
                Compare top brands
              </h2>
              <p className="text-[13px] text-ds-muted mb-5">
                Side-by-side dosing audits + verdict.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {comparisonLinks.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block border border-ds-border rounded-[10px] p-4 hover:border-ds-accent-border bg-ds-card focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                  >
                    <div className="font-semibold text-ds-ink text-[14px]">{c.title}</div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        }
      />
    </>
  );
}
