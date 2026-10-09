import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHead, buildAlternates, buildOpenGraph, buildTwitter } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { allProductsAU, productsAU, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

// Discontinued (2026-09-28): read from the full list; the page explains the
// discontinuation and HeadToHead renders no buy link for it.
const productA = allProductsAU.find(p => p.slug === 'blackmores-brain-active-review');
const productB = productsAU.find(p => p.slug === 'mind-lab-pro-review');


const META_TITLE = `Blackmores Brain Active vs Mind Lab Pro ${CURRENT_YEAR}: Discontinued vs Personal Import`;
const META_DESCRIPTION =
  'Independent comparison of Blackmores Brain Active vs Mind Lab Pro for Australian buyers. A discontinued Australian brain supplement (its two Australian Register of Therapeutic Goods (ARTG) entries were cancelled in 2014 and 2021) vs an international personal import.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'au', path: '/blackmores-brain-active-vs-mind-lab-pro/', availableInRegions: ['au'] }),
  openGraph: buildOpenGraph({
    regionCode: 'au',
    path: '/blackmores-brain-active-vs-mind-lab-pro/',
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: 'article',
  }),
  twitter: buildTwitter({ title: META_TITLE, description: META_DESCRIPTION }),
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better for Australian buyers, Blackmores Brain Active or Mind Lab Pro?',
    a:
      "Blackmores Brain Active is no longer sold in Australia: its page on blackmores.com.au has been removed and Chemist Warehouse's Blackmores range no longer lists it. Blackmores' current brain-health products are Cognition Ultra and Omega Brain, which we have not reviewed. Of the two products compared here, only Mind Lab Pro is still available to Australian buyers — A$89/month on its Australian storefront (au.mindlabpro.com), imported under the TGA Personal Importation Scheme.",
  },
  {
    q: 'What does TGA-listed mean?',
    a:
      "The TGA says that before a therapeutic good can be supplied in Australia the sponsor must obtain pre-market approval, and \"in most cases this involves entry of the product in the Australian Register of Therapeutic Goods (ARTG)\", as a registered (AUST R) or listed (AUST L / AUST L(A)) medicine. The TGA also states that ARTG inclusion \"is not an endorsement of that good\". Listed (AUST L) medicines have not been assessed by the TGA for efficacy before sale, and may only use claim wording from the TGA's pre-approved Permitted Indications list. Blackmores Brain Active returned no current entry in the ARTG search on 2026-10-06. TGA's cancellations-by-sponsor database lists ARTG 227270, cancelled 18 September 2014, sponsor Blackmores Limited, and a second entry, ARTG 227319, cancelled 17 May 2021 (Blackmores Ltd).",
  },
  {
    q: 'How does Personal Importation Scheme work?',
    a:
      "The TGA Personal Importation Scheme lets individuals import therapeutic goods that are not on the ARTG for personal use, up to a 3-month supply per order (and no more than a 15-month supply in any 12-month period), subject to its conditions. Products imported this way are not evaluated by the TGA. Mind Lab Pro ships to Australia from its own storefront (au.mindlabpro.com) as a personal import.",
  },
  {
    q: 'Price difference?',
    a:
      'Blackmores Brain Active has no current price because it is no longer sold. Mind Lab Pro is A$89/month (one-time purchase) on au.mindlabpro.com, checked 28 September 2026.',
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
  'Nobody new: Blackmores Brain Active is no longer sold in Australia',
  "Pharmacy-shelf buyers can look at Blackmores' current range (Cognition Ultra, Omega Brain), which we have not reviewed",
];

const whoIsForB = [
  'Want broader formula (Lion\'s Mane, citicoline, PS, Rhodiola, L-theanine)',
  'Care about peer-reviewed product-specific RCT evidence',
  'Are willing to pay 4× premium for the wider ingredient coverage',
  'Are caffeine-free user',
  'Don\'t mind 5-10 day international shipping under Personal Importation Scheme',
];

const verdictParagraph =
  'Blackmores Brain Active has been discontinued in Australia — blackmores.com.au no longer lists it and Chemist Warehouse does not stock it — so this is no longer a live choice. Mind Lab Pro remains available at A$89/month on its Australian storefront, imported under the TGA Personal Importation Scheme. If you want a pharmacy-shelf Blackmores product instead, its current brain-health range is Cognition Ultra and Omega Brain; we have not reviewed either.';

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
      healthDisclaimer={getRegionalHealthDisclaimer('au')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
