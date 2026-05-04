import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHeadPage } from '@nootropic/ui';
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsEU } from '@nootropic/data';

const SITE_URL = 'https://eu.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

const productA = productsEU.find(p => p.slug === 'braineffect-focus-review');
const productB = productsEU.find(p => p.slug === 'mind-lab-pro-review');

export const metadata: Metadata = {
  title: `BRAINEFFECT FOCUS vs Mind Lab Pro ${CURRENT_YEAR}: DACH-Native vs International`,
  description:
    'Independent comparison of BRAINEFFECT FOCUS vs Mind Lab Pro for EU buyers. Berlin-based 4-ingredient acute focus formula vs international 11-ingredient daily stack.',
  alternates: { canonical: `${SITE_URL}/braineffect-vs-mind-lab-pro/` },
  openGraph: {
    title: 'BRAINEFFECT FOCUS vs Mind Lab Pro — Independent Head-to-Head',
    description: 'Lean caffeine + L-theanine vs broad daily stack. Which makes sense for EU buyers?',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better, BRAINEFFECT FOCUS or Mind Lab Pro?',
    a:
      'They serve different needs. BRAINEFFECT FOCUS is built around the most-evidence-backed acute focus combination (caffeine + L-theanine) at clinical doses — it works in 30-60 minutes and is purpose-built for "I need to focus right now". Mind Lab Pro is a broader 11-ingredient daily stack covering focus + memory + long-term brain health, with cumulative effects over weeks. If you want acute focus on demand, BRAINEFFECT. If you want a daily cognitive maintenance supplement, Mind Lab Pro.',
  },
  {
    q: 'EU compliance — which is safer for EU regulatory framing?',
    a:
      'Both are EU-compliant. BRAINEFFECT, as a Berlin-based DACH brand, has the clearest EFSA framing — caffeine ≥75mg has the EFSA-approved alertness claim and BRAINEFFECT carries 90mg per serving. Mind Lab Pro has an EU storefront with EUR pricing and EU-compliant labelling. For EFSA-claim usage in marketing, BRAINEFFECT is more straightforward.',
  },
  {
    q: 'Price difference?',
    a:
      'BRAINEFFECT FOCUS: €39/month (60 capsules = 30 servings). Mind Lab Pro: €65/month. BRAINEFFECT is meaningfully cheaper because the formula is leaner — 4 ingredients vs 11. Per-ingredient cost is comparable.',
  },
  {
    q: 'Caffeine content?',
    a:
      'BRAINEFFECT FOCUS: 90mg per serving (1 cup of coffee equivalent). Mind Lab Pro: caffeine-free entirely — designed to be paired with your own coffee or tea. If you want caffeine-on-demand control, Mind Lab Pro lets you titrate; BRAINEFFECT bakes the dose in.',
  },
  {
    q: 'Which has more peer-reviewed evidence?',
    a:
      'Mind Lab Pro has multiple published RCTs (University of Leeds 2019 + follow-ups) — uniquely so among multi-ingredient nootropics. BRAINEFFECT relies on the very strong existing literature for caffeine + L-theanine (Owen et al. 2008 and many replications). Both are evidence-grounded; Mind Lab Pro has product-specific evidence; BRAINEFFECT has ingredient-specific evidence.',
  },
  {
    q: 'Are these substitutes for ADHD medication?',
    a:
      'No. Both are dietary supplements. ADHD treatment in EU markets uses methylphenidate (Concerta, Ritalin) — supplements are not equivalents. Always consult a clinician.',
  },
];

const whoIsForA = [
  'Want acute focus in 30-60 minutes (caffeine + L-theanine working immediately)',
  'Are based in DACH market and prefer Berlin-domiciled brands',
  'Want EFSA-claim-compliant labelling for caffeine alertness',
  'Are budget-conscious at €39/month',
  'Already have a memory/long-term cognitive stack and want a focused acute supplement',
];

const whoIsForB = [
  'Want a single daily stack covering focus + memory + long-term health',
  'Are caffeine-sensitive or already get caffeine from coffee/tea',
  'Care about peer-reviewed product-specific RCT evidence',
  'Are willing to pay €65/month for the broader formula',
  'Want phosphatidylserine, Bacopa, Lion\'s Mane, and Rhodiola in one capsule',
];

const verdictParagraph =
  'They solve different problems. BRAINEFFECT FOCUS is the cleanest acute-focus product in the EU coverage — caffeine + L-theanine at clinical doses, EU-compliant, Berlin-based, EFSA-claim-friendly. Mind Lab Pro is the broader daily cognitive maintenance stack with multi-ingredient memory support and unique product-specific RCT evidence. The right answer depends on whether you want "focus right now" (BRAINEFFECT) or "daily cognitive support over months" (Mind Lab Pro). For most EU buyers, the strongest setup is actually both — BRAINEFFECT on demand + Mind Lab Pro daily.';

export default function Page() {
  if (!productA || !productB) notFound();
  return (
    <HeadToHeadPage
      productA={productA}
      productB={productB}
      siteUrl={SITE_URL}
      verdictParagraph={verdictParagraph}
      faqItems={faqItems}
      whoIsForA={whoIsForA}
      whoIsForB={whoIsForB}
    />
  );
}
