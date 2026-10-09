import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHead, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsCA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

const productA = productsCA.find(p => p.slug === 'aor-ortho-mind-review');
const productB = productsCA.find(p => p.slug === 'mind-lab-pro-review');


export const metadata: Metadata = {
  title: `AOR Ortho•Mind vs Mind Lab Pro ${CURRENT_YEAR}: NPN-Licensed vs International`,
  description:
    'Independent comparison of AOR Ortho•Mind vs Mind Lab Pro for Canadian buyers. Calgary-based, Health Canada NPN-licensed Canadian product vs international personal-import.',
  alternates: buildAlternates({ regionCode: 'ca', path: '/aor-ortho-mind-vs-mind-lab-pro/', availableInRegions: ['ca'] }),
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
      'Different trust frameworks. AOR Ortho•Mind holds an Active Health Canada licence, NPN (Natural Product Number) 80037243 (checked 2026-10-07) and is Calgary-domiciled. Mind Lab Pro is international, ships to Canada as a personal import, and has multiple peer-reviewed RCTs; we found no NPN for it in Health Canada\'s Licensed Natural Health Products Database (LNHPD) (full register export searched, 2026-10-07). If regulatory compliance + Canadian-domiciled trust matters most, AOR. If product-specific clinical evidence + broader formula matters most, Mind Lab Pro.',
  },
  {
    q: 'Is the NPN important for buyers?',
    a:
      'Health Canada states that "All natural health products (NHPs) sold in Canada require a product licence before being marketed", and a licensed product\'s label bears an eight-digit NPN (Natural Product Number). AOR Ortho•Mind\'s NPN 80037243 is listed as Active in the Licensed Natural Health Products Database (LNHPD), licence holder Advanced Orthomolecular Research Inc. (checked 2026-10-07). We found no NPN for Mind Lab Pro in the LNHPD (full register export searched, 2026-10-07); a licence can be held under another name, so look for an eight-digit NPN on the label; without one, a consumer\'s only route is personal importation, which Health Canada\'s GUI-0116 limits to "no more than a 90-day supply or a single course of treatment, whichever is less".',
  },
  {
    q: 'Price difference?',
    a:
      'AOR Ortho•Mind: CAD $98.33 for a 180-capsule bottle direct from aor.ca (checked 2026-10-07), which lasts 30 days at the licensed 6 capsules a day. Mind Lab Pro: ~CAD $95/month including international shipping (USD $69 + currency + shipping). The monthly cost is similar; AOR avoids international shipping and currency conversion.',
  },
  {
    q: 'Capsule count and friction?',
    a:
      'AOR Ortho•Mind: 6 capsules/day (the licensed adult dose is 2 capsules three times daily). Mind Lab Pro: 2 capsules/day. Mind Lab Pro is clearly less friction.',
  },
  {
    q: 'Bacopa dose?',
    a:
      'AOR Ortho•Mind: 300mg Bacopa a day (50 mg per capsule × 6, standardized to 50-55% bacosides) — at clinical dose. Mind Lab Pro: 150mg Bacopa standardized — below clinical dose. For memory consolidation specifically, AOR has the better Bacopa dose.',
  },
  {
    q: 'Where to buy each?',
    a:
      'AOR Ortho•Mind: sold direct at aor.ca (the site offers a store locator); in a store, check for NPN 80037243 on the label. Mind Lab Pro: only via mindlabpro.com (international shipping to Canada: 5-20 working days by tracked airmail or 2-7 working days by DHL courier, per mindlabpro.com, checked 2026-09-29).',
  },
];

const whoIsForA = [
  'Care about Health Canada NPN compliance',
  'Want a Calgary-domiciled Canadian brand',
  'Want to order direct from a Canadian company (aor.ca)',
  'Prioritize Bacopa at clinical dose (300mg) for memory',
  'Want CAD pricing without international shipping',
];

const whoIsForB = [
  'Care about peer-reviewed product-specific RCT evidence',
  'Want phosphatidylserine, Lion\'s Mane, citicoline, Rhodiola in one formula',
  'Are caffeine-free user (Mind Lab Pro is fully caffeine-free)',
  'Don\'t mind international shipping (5-20 working days by airmail or 2-7 working days by DHL, per mindlabpro.com, checked 2026-09-29)',
  'Want the broader 11-ingredient formula at a similar monthly cost',
];

const verdictParagraph =
  'For Canadian buyers, AOR Ortho•Mind is the stronger choice on regulatory compliance, Bacopa dose, and Canadian-domiciled trust. Mind Lab Pro is the stronger choice on broader formula coverage and peer-reviewed RCT evidence, with 2 capsules a day instead of 6. If an active NPN and a Canadian seller are top priorities, AOR wins. If formula breadth and clinical evidence are top priorities, Mind Lab Pro is worth the international-shipping friction. Both are open-formula and well-reviewed editorially.';

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
      healthDisclaimer={getRegionalHealthDisclaimer('ca')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
