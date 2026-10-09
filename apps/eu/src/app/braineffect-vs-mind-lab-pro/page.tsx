import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHead, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { allProductsEU, productsEU, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

// Discontinued (2026-09-29): read from the full list; the page explains the
// discontinuation and HeadToHead renders no buy link for it.
const productA = allProductsEU.find(p => p.slug === 'braineffect-focus-review');
const productB = productsEU.find(p => p.slug === 'mind-lab-pro-review');


export const metadata: Metadata = {
  title: `BRAINEFFECT FOCUS vs Mind Lab Pro ${CURRENT_YEAR}: DACH-Native vs International`,
  description:
    'Independent comparison of BRAINEFFECT FOCUS vs Mind Lab Pro for EU buyers. BRAINEFFECT FOCUS has been discontinued; Mind Lab Pro is still sold from its EU storefront.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/braineffect-vs-mind-lab-pro/', availableInRegions: ['eu'] }),
  openGraph: {
    title: 'BRAINEFFECT FOCUS vs Mind Lab Pro — Independent Head-to-Head',
    description: 'BRAINEFFECT FOCUS is discontinued. What that leaves EU buyers comparing it with Mind Lab Pro.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better, BRAINEFFECT FOCUS or Mind Lab Pro?',
    a:
      'BRAINEFFECT FOCUS is no longer sold: its product page on brain-effect.com returns 404 and FOCUS is no longer in the brand\'s catalogue (checked 29 September 2026). BRAINEFFECT still sells other products, which we have not reviewed. Of the two products compared here, only Mind Lab Pro is still available to EU buyers — €65/month from its EU storefront.',
  },
  {
    q: 'EU rules — how did the two compare?',
    a:
      'Both were sold as EU food supplements. BRAINEFFECT FOCUS contained 80mg of caffeine per serving, but no caffeine cognition claim is authorised in the EU: the European Food Safety Authority (EFSA) assessed a 75mg alertness claim favourably in 2011, yet the European Commission never added any caffeine claim to the list of authorised health claims, and it refused a 40–75mg alertness claim in Regulation (EU) 2016/1411. Mind Lab Pro has an EU storefront with EUR pricing; we do not verify either product\'s labelling compliance, which is the seller\'s responsibility.',
  },
  {
    q: 'Price difference?',
    a:
      'BRAINEFFECT FOCUS has no current price because it is no longer sold. Mind Lab Pro is €65/month from its EU storefront.',
  },
  {
    q: 'Caffeine content?',
    a:
      'BRAINEFFECT FOCUS contained 80mg of caffeine per serving. Mind Lab Pro is caffeine-free — designed to be paired with your own coffee or tea, so you control the caffeine dose.',
  },
  {
    q: 'Which has more peer-reviewed evidence?',
    a:
      'Mind Lab Pro has multiple published RCTs (University of Leeds 2019 + follow-ups) — uniquely so among multi-ingredient nootropics. BRAINEFFECT FOCUS relied on ingredient-level evidence for caffeine, Panax Ginseng, Ginkgo and Bacopa rather than trials of the product itself.',
  },
  {
    q: 'Are these substitutes for ADHD medication?',
    a:
      'No. Both are dietary supplements. ADHD treatment in EU markets uses methylphenidate (Concerta, Ritalin) — supplements are not equivalents. Always consult a clinician.',
  },
];

const whoIsForA = [
  'Nobody new: BRAINEFFECT FOCUS is no longer sold (its brain-effect.com product page returns 404)',
  'BRAINEFFECT still sells other products, which we have not reviewed',
];

const whoIsForB = [
  'Want a single daily stack covering focus + memory + long-term health',
  'Are caffeine-sensitive or already get caffeine from coffee/tea',
  'Care about peer-reviewed product-specific RCT evidence',
  'Are willing to pay €65/month for the broader formula',
  'Want phosphatidylserine, Bacopa, Lion\'s Mane, and Rhodiola in one formula',
];

const verdictParagraph =
  'BRAINEFFECT FOCUS has been discontinued — its brain-effect.com product page returns 404 and it is no longer in the brand\'s catalogue (checked 29 September 2026) — so this is no longer a live choice. Mind Lab Pro remains available at €65/month from its EU storefront. BRAINEFFECT still sells other products; we have not reviewed them.';

export default function Page() {
  if (!productA || !productB) notFound();
  return (
    <HeadToHead
      productA={productA}
      productB={productB}
      siteUrl={SITE_URL}
      verdictParagraph={verdictParagraph}
      faqItems={faqItems}
      whoIsForA={whoIsForA}
      whoIsForB={whoIsForB}
      healthDisclaimer={getRegionalHealthDisclaimer('eu')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
