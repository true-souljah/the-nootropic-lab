import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHeadPage } from '@nootropic/ui';
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsAU } from '@nootropic/data';

const SITE_URL = 'https://au.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

const productA = productsAU.find(p => p.slug === 'blackmores-brain-active-review');
const productB = productsAU.find(p => p.slug === 'mind-lab-pro-review');

export const metadata: Metadata = {
  title: `Blackmores Brain Active vs Mind Lab Pro ${CURRENT_YEAR}: TGA-Listed vs Personal Import`,
  description:
    'Independent comparison of Blackmores Brain Active vs Mind Lab Pro for Australian buyers. TGA-listed pharmacy supplement vs international personal-import.',
  alternates: { canonical: `${SITE_URL}/blackmores-brain-active-vs-mind-lab-pro/` },
  openGraph: {
    title: 'Blackmores Brain Active vs Mind Lab Pro — TGA vs Personal Import',
    description: 'Pharmacy-shelf TGA-listed vs international personal-import. Which makes sense for Australian buyers?',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better for Australian buyers, Blackmores Brain Active or Mind Lab Pro?',
    a:
      "They occupy different positions. Blackmores Brain Active is TGA-listed (AUST L), pharmacy-distributed (Chemist Warehouse, Priceline, Amcal), 1 capsule/day, ~AUD $35/month — the dominant pharmacy-shelf cognitive supplement in Australia. Mind Lab Pro arrives via TGA Personal Importation Scheme, ~AUD $135/month with international shipping, 2 capsules/day, with broader 11-ingredient formula. Blackmores wins on accessibility and price; Mind Lab Pro wins on formula breadth and product-specific RCT evidence.",
  },
  {
    q: 'What does TGA-listed mean?',
    a:
      'TGA Listed Medicines (AUST L) are pre-approved for sale in Australia within the Australian Listed Medicines framework — they use only approved ingredients with pre-approved indications and have been notified to the Therapeutic Goods Administration. Listed Medicines are lower-risk than Registered Medicines (AUST R = prescription-equivalent). For consumers, AUST L means it can be sold at any Australian pharmacy without import friction.',
  },
  {
    q: 'How does Personal Importation Scheme work?',
    a:
      "The TGA Personal Importation Scheme allows Australians to import up to 3 months' supply of supplements that aren't TGA-listed, for personal use. Mind Lab Pro ships internationally to Australia under this scheme — entirely legal for personal use. Customs occasionally inspects but rarely seizes for amounts under the 3-month threshold.",
  },
  {
    q: 'Price difference?',
    a:
      'Blackmores Brain Active: ~AUD $35/month at Chemist Warehouse single-bottle pricing, often discounted in pharmacy promotions. Mind Lab Pro: ~AUD $135/month including international shipping (USD $69 + AUD currency + shipping). Blackmores is roughly 4× cheaper for Australian buyers.',
  },
  {
    q: 'Bacopa dose?',
    a:
      'Both contain Bacopa at clinical dose (300mg standardized to 50% bacosides). On the most-replicated memory ingredient, they tie.',
  },
  {
    q: 'What does Blackmores miss that Mind Lab Pro has?',
    a:
      'Mind Lab Pro adds Lion\'s Mane, citicoline (Cognizin), L-theanine, L-tyrosine, phosphatidylserine, Rhodiola, and a higher Ginkgo dose. If you want any of these specific ingredients, Mind Lab Pro is the only choice between these two. Blackmores keeps it simple at Bacopa + Ginkgo + B-vitamins.',
  },
];

const whoIsForA = [
  'Want a TGA-listed Australian Listed Medicine (no Personal Import friction)',
  'Prefer pharmacy-shelf availability (Chemist Warehouse, Priceline)',
  'Are budget-conscious at AUD $35/month',
  'Like 1-capsule daily simplicity',
  'Want a long-tenure brand (Blackmores founded 1932)',
  'Are fine with a Bacopa-focused 5-ingredient formula',
];

const whoIsForB = [
  'Want broader formula (Lion\'s Mane, citicoline, PS, Rhodiola, L-theanine)',
  'Care about peer-reviewed product-specific RCT evidence',
  'Are willing to pay 4× premium for the wider ingredient coverage',
  'Are caffeine-free user',
  'Don\'t mind 5-10 day international shipping under Personal Importation Scheme',
];

const verdictParagraph =
  'For most Australian buyers, Blackmores Brain Active is the practical winner — TGA-listed, pharmacy-available, AUD $35/month, with Bacopa at clinical dose covering the most-replicated memory ingredient. Mind Lab Pro is for buyers who specifically want the broader 11-ingredient formula and are willing to pay 4× and wait for international shipping under Personal Importation Scheme. If you\'re starting nootropics in Australia, start with Blackmores; if you\'ve been on it 12 weeks and want to expand, Mind Lab Pro adds genuine breadth.';

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
