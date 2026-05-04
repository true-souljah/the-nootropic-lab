import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHeadPage } from '@nootropic/ui';
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsCA, getAuthorBySlug } from '@nootropic/data';

const SITE_URL = 'https://ca.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();
const author = getAuthorBySlug('stephan-kulik')!;

const productA = productsCA.find(p => p.slug === 'aor-ortho-mind-review');
const productB = productsCA.find(p => p.slug === 'mind-lab-pro-review');

export const metadata: Metadata = {
  title: `AOR Ortho•Mind vs Mind Lab Pro ${CURRENT_YEAR}: NPN-Licensed vs International`,
  description:
    'Independent comparison of AOR Ortho•Mind vs Mind Lab Pro for Canadian buyers. Calgary-based, Health Canada NPN-licensed Canadian product vs international personal-import.',
  alternates: { canonical: `${SITE_URL}/aor-ortho-mind-vs-mind-lab-pro/` },
  openGraph: {
    title: 'AOR Ortho•Mind vs Mind Lab Pro — NPN vs International',
    description: 'Health Canada-licensed Canadian formula vs international personal-import. Which makes sense for CA buyers?',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better for Canadian buyers, AOR Ortho•Mind or Mind Lab Pro?',
    a:
      'Different trust frameworks. AOR Ortho•Mind is Health Canada NPN-licensed (NPN 80037243), Calgary-domiciled, with bilingual EN/FR labelling for Quebec compliance. Mind Lab Pro is international, ships to Canada via personal-import, has multiple peer-reviewed RCTs but no Health Canada NPN. If regulatory compliance + Canadian-domiciled trust matters most, AOR. If product-specific clinical evidence + broader formula matters most, Mind Lab Pro.',
  },
  {
    q: 'Is the NPN important for buyers?',
    a:
      "Yes for compliance — Health Canada legally requires Natural Health Products to display an NPN. Imports without NPN are technically grey-market (Mind Lab Pro arrives via personal-import allowance). For most consumers this doesn't matter functionally, but Quebec retail availability, bilingual labelling, and pharmacy distribution all depend on NPN-licensing. AOR has it; Mind Lab Pro doesn't.",
  },
  {
    q: 'Price difference?',
    a:
      'AOR Ortho•Mind: ~CAD $65/month direct from aor.ca or Canadian pharmacies. Mind Lab Pro: ~CAD $95/month including international shipping (USD $69 + currency + shipping). AOR is meaningfully cheaper for Canadian buyers because no international shipping or currency conversion friction.',
  },
  {
    q: 'Capsule count and friction?',
    a:
      'AOR Ortho•Mind: 3 capsules/day. Mind Lab Pro: 2 capsules/day. Both are reasonable; Mind Lab Pro slightly less friction.',
  },
  {
    q: 'Bacopa dose?',
    a:
      'AOR Ortho•Mind: 300mg Bacopa standardized to 50% bacosides — at clinical dose. Mind Lab Pro: 150mg Bacopa standardized — below clinical dose. For memory consolidation specifically, AOR has the better Bacopa dose.',
  },
  {
    q: 'Where to buy each?',
    a:
      'AOR Ortho•Mind: directly at aor.ca, Pure Pharmacy, Healthy Planet, and many independent Canadian health-food retailers. Mind Lab Pro: only via mindlabpro.com (international shipping to Canada in 5-10 business days).',
  },
];

const whoIsForA = [
  'Care about Health Canada NPN compliance',
  'Want a Calgary-domiciled Canadian brand',
  'Need bilingual EN/FR labelling (Quebec compliance)',
  'Want to buy at Canadian pharmacies (Pure Pharmacy, Healthy Planet)',
  'Prioritize Bacopa at clinical dose (300mg) for memory',
  'Want CAD pricing without international shipping',
];

const whoIsForB = [
  'Care about peer-reviewed product-specific RCT evidence',
  'Want phosphatidylserine, Lion\'s Mane, citicoline, Rhodiola in one capsule',
  'Are caffeine-free user (Mind Lab Pro is fully caffeine-free)',
  'Don\'t mind international shipping (5-10 business days)',
  'Are willing to pay 50% premium for the broader 11-ingredient formula',
];

const verdictParagraph =
  'For Canadian buyers, AOR Ortho•Mind is the stronger choice on regulatory compliance, price, Bacopa dose, and Canadian-domiciled trust. Mind Lab Pro is the stronger choice on broader formula coverage, peer-reviewed RCT evidence, and caffeine-free design. If NPN compliance and Canadian retail availability are top priorities, AOR wins. If formula breadth and clinical evidence are top priorities, Mind Lab Pro is worth the international-shipping friction. Both are open-formula and well-reviewed editorially.';

export default function Page() {
  if (!productA || !productB) notFound();
  return (
    <HeadToHeadPage
      productA={productA}
      productB={productB}
      siteUrl={SITE_URL}
      author={author}
      verdictParagraph={verdictParagraph}
      faqItems={faqItems}
      whoIsForA={whoIsForA}
      whoIsForB={whoIsForB}
    />
  );
}
