// The Deals page (/deals/) shared by the seven promo regions (no jp). With `promos.ts` and the
// seven region wrappers it is one of the only files that read promo data (promo-firewall.test.ts,
// ALLOWED_PROMO_READERS). Offers follow our review scores only: `productsByScore` orders the
// products and `offersForOrderedProducts` walks that order; nothing here sorts.
import Link from 'next/link';
import { purchaseUrl } from '@nootropic/data';
import type { Product, UIStrings } from '@nootropic/data';
import PublicShell from './PublicShell';
import SchemaOrg from '../SchemaOrg';
import DisclaimerText from '../DisclaimerText';
import { Card } from '../primitives/Card';
import { REGIONS } from '../seo';
import { offersForOrderedProducts, validatePromoFile, type PROMO_REGIONS } from '../promos';
import { utcToday } from './dealsState';
import { productsByScore } from './productOrder';
import DealsList from './DealsList.client';
import type { SearchItem } from '../SearchModal';

export interface DealsPageProps {
  /** One of the seven promo regions; jp is held and has no Deals page. */
  regionCode: (typeof PROMO_REGIONS)[number];
  /** The region's product list (the one its best-nootropics page ranks). */
  products: Product[];
  /** `packages/data/promos/<region>.json`, validated here (a bad file fails the build). */
  promosDoc: unknown;
  strings: UIStrings;
  searchItems?: SearchItem[];
  healthDisclaimer: string;
  dateLocale: string;
  backHref?: string;
}

export default function DealsPage({ regionCode, products, promosDoc, strings, searchItems, healthDisclaimer, dateLocale }: DealsPageProps) {
  const today = utcToday();
  const { promos } = validatePromoFile(promosDoc, { region: regionCode, products, today });
  const ordered = productsByScore(products);
  const cards = offersForOrderedProducts(ordered, promos, today);
  // Every product the page renders a buy link for: PublicShell scopes the strip from them.
  const linkedProducts = [...new Set(cards.flatMap((card) => card.products))].filter((p) => purchaseUrl(p) !== null);
  const d = strings.deals;
  const siteUrl = REGIONS[regionCode].siteUrl;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${siteUrl}/deals/`,
    name: d.metaTitle,
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
  };

  return (
    <PublicShell mainBackground="bg" linkedProducts={linkedProducts} searchItems={searchItems} uiStrings={strings}>
      <SchemaOrg schema={schema} />
      <div className="max-w-[880px] mx-auto px-4 py-10">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-ds-ink leading-tight m-0 mb-3">{d.heading}</h1>
        <p className="text-[16px] text-ds-ink-soft leading-relaxed m-0 mb-6">{d.lede}</p>

        <Card variant="subdued" padding={20} as="section" aria-labelledby="deals-confirm-heading" className="mb-4">
          <h2 id="deals-confirm-heading" className="text-[16px] font-bold text-ds-ink m-0 mb-2">
            {d.confirmHeading}
          </h2>
          <p className="text-[14px] text-ds-ink-soft leading-relaxed m-0 mb-2">{d.confirmBody1}</p>
          <p className="text-[14px] text-ds-ink-soft leading-relaxed m-0">{d.confirmBody2}</p>
        </Card>
        <p className="text-[13px] text-ds-ink-soft leading-relaxed m-0">{d.orderingNote}</p>

        {cards.length === 0 ? (
          <Card padding={20} as="section" aria-labelledby="deals-empty-heading" className="mt-6">
            <h2 id="deals-empty-heading" className="text-[18px] font-bold text-ds-ink m-0 mb-2">
              {d.emptyTitle}
            </h2>
            <p className="text-[14px] text-ds-ink-soft leading-relaxed m-0 mb-3">{d.emptyBody}</p>
            <Link
              href="/best-nootropics/"
              className="text-[14px] font-semibold text-ds-accent underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              {d.emptyLink}
            </Link>
          </Card>
        ) : (
          <DealsList
            cards={cards}
            builtOn={today}
            labels={{
              deals: d,
              scoreAria: strings.productDetail.score.aria,
              noCommission: strings.disclosure.noCommission,
              noPurchaseLink: strings.noPurchaseLink,
            }}
            dateLocale={dateLocale}
          />
        )}

        <section aria-labelledby="deals-health-disclaimer-heading" className="mt-10 pt-6 border-t border-ds-border">
          <h2
            id="deals-health-disclaimer-heading"
            className="text-[13px] uppercase tracking-[0.1em] text-ds-muted font-semibold m-0 mb-2"
          >
            {strings.productDetail.healthDisclaimerHeading}
          </h2>
          <p className="text-[12px] text-ds-ink leading-relaxed"><DisclaimerText text={healthDisclaimer} /></p>
        </section>
      </div>
    </PublicShell>
  );
}
