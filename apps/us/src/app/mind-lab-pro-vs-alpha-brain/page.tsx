import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHead, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

const productA = productsUS.find(p => p.slug === 'mind-lab-pro-review');
const productB = productsUS.find(p => p.slug === 'onnit-alpha-brain-review');


export const metadata: Metadata = {
  title: `Mind Lab Pro vs Alpha Brain ${CURRENT_YEAR}: Head-to-Head Clinical Dosing Audit`,
  description:
    'Independent comparison of Mind Lab Pro vs Onnit Alpha Brain. Side-by-side ingredient dosing, score breakdown, price, and verdict — based on the same 5-pillar methodology.',
  alternates: buildAlternates({ regionCode: 'us', path: '/mind-lab-pro-vs-alpha-brain/', availableInRegions: ['us'] }),
  openGraph: {
    title: 'Mind Lab Pro vs Alpha Brain — Independent Head-to-Head',
    description: 'Which nootropic actually delivers? Clinical dosing audit + score breakdown + verdict.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better, Mind Lab Pro or Alpha Brain?',
    a:
      'Mind Lab Pro discloses every ingredient dose; Alpha Brain hides several behind proprietary blends. If formula transparency matters to you, Mind Lab Pro is the stronger choice. If you prefer a brand with broad retail distribution and a 15% subscription discount, Alpha Brain is the more accessible option.',
  },
  {
    q: 'Are Mind Lab Pro and Alpha Brain caffeine-free?',
    a:
      "Both are caffeine-free. Mind Lab Pro is explicitly marketed as caffeine-free. Alpha Brain Classic is also caffeine-free; Onnit's Black Label and Instant variants include other ingredients you should check the label for.",
  },
  {
    q: 'How long until each takes effect?',
    a:
      'Both contain ingredients with mixed onset profiles. L-theanine (in both) acts within 30–60 minutes. Bacopa Monnieri (in both) needs 4–12 weeks of consistent use for measurable cognitive effects. Plan for at least 8 weeks before judging long-term efficacy.',
  },
  {
    q: 'Do they offer money-back guarantees?',
    a:
      "Mind Lab Pro: 30-day Performance Promise (money back if you finish the bottle and don't see a benefit). Alpha Brain: standard Onnit return window.",
  },
  {
    q: 'Which is better value for money?',
    a:
      'Mind Lab Pro is $69/month at full price. Alpha Brain Classic is roughly ~$67/month with the 15% autoship discount, ~$80/month one-time. Mind Lab Pro costs more but offers a fully open formula. Alpha Brain is cheaper but several active ingredients sit inside undisclosed proprietary blends.',
  },
  {
    q: 'Are these alternatives to Adderall?',
    a:
      'No. Mind Lab Pro and Alpha Brain are dietary supplements regulated under DSHEA. Adderall is a Schedule II prescription stimulant for ADHD. The two are not equivalent and supplements should not be marketed as replacements for prescription medication. Always consult a clinician for ADHD treatment.',
  },
];

const whoIsForA = [
  "Want to know exactly what you're taking — every dose disclosed",
  'Care about peer-reviewed efficacy data (multiple Leeds RCTs)',
  'Prefer caffeine-free with no autoship pressure',
  'Are willing to pay $69/mo for formula transparency',
];

const whoIsForB = [
  'Want a brand you can buy at Whole Foods, Amazon, CVS, Vitamin Shoppe',
  'Prefer the lower price point with autoship discount',
  "Don't mind proprietary blends",
  "Are comfortable navigating Onnit's documented cancellation friction",
];

const verdictParagraph =
  'The headline difference is formula transparency: Mind Lab Pro discloses every ingredient dose. ' +
  'Alpha Brain uses proprietary blends that hide several active doses behind a single weight. ' +
  "If you want to know what you're taking, Mind Lab Pro is the clearer choice.";

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
      healthDisclaimer={getRegionalHealthDisclaimer('us')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
