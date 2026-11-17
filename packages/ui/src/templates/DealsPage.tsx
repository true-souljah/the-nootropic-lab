import Link from 'next/link';
import { earnsCommission, purchaseUrl, type Product, type UIStrings } from '@nootropic/data';
import PublicShell from './PublicShell';
import SchemaOrg from '../SchemaOrg';
import DisclaimerText from '../DisclaimerText';
import { Card } from '../primitives/Card';
import { validatePromoFile, offersForOrderedProducts } from '../promos';
import { utcToday } from './dealsState';
import { productsByScore } from './productOrder';
import DealsList from './DealsList.client';
import type { SearchItem } from '../SearchModal';

export default function DealsPage({ regionCode, products, promosDoc, strings, searchItems, healthDisclaimer, dateLocale }: { regionCode: 'us' | 'eu' | 'ca' | 'au' | 'latam' | 'gcc' | 'sea'; products: Product[]; promosDoc: unknown; strings: UIStrings; searchItems?: SearchItem[]; healthDisclaimer: string; dateLocale: string; backHref?: string }) {
  const today = utcToday();
  const { promos } = validatePromoFile(promosDoc, { region: regionCode, products, today });
  const cards = offersForOrderedProducts(productsByScore(products), promos, today);
  const linkedProducts = [...new Map(cards.flatMap((card) => card.products).filter((p) => purchaseUrl(p) !== null && earnsCommission(p)).map((p) => [p.slug, p])).values()];
  const d = strings.deals;
  return <PublicShell mainBackground="bg" linkedProducts={linkedProducts} searchItems={searchItems} uiStrings={strings}>
    <SchemaOrg schema={{ '@context': 'https://schema.org', '@type': 'WebPage', name: d.heading, url: '/deals/', publisher: { '@type': 'Organization', name: 'The Nootropic Lab' } }} />
    <div className="max-w-4xl mx-auto px-4 py-10"><h1 className="text-[28px] font-bold text-ds-ink m-0">{d.heading}</h1><p className="text-ds-ink-soft leading-relaxed">{d.lede}</p>
      <Card variant="subdued" padding={20} className="mb-5"><h2 className="text-ds-ink m-0">{d.confirmHeading}</h2><p>{d.confirmBody1}</p><p>{d.confirmBody2}</p></Card><p className="text-ds-muted">{d.orderingNote}</p>
      {cards.length ? <DealsList cards={cards} builtOn={today} labels={{ deals: d, scoreAria: strings.productDetail.score.aria, noCommission: strings.disclosure.noCommission, noPurchaseLink: strings.noPurchaseLink }} dateLocale={dateLocale} /> : <Card variant="subdued" padding={20}><h2>{d.emptyTitle}</h2><p>{d.emptyBody}</p><Link className="text-ds-accent underline" href="/best-nootropics/">{d.emptyLink}</Link></Card>}
      <section className="mt-10 pt-6 border-t border-ds-border"><h2 className="text-[13px] uppercase tracking-[0.1em] text-ds-muted">{strings.productDetail.healthDisclaimerHeading}</h2><p className="text-[12px] text-ds-ink leading-relaxed"><DisclaimerText text={healthDisclaimer} /></p></section>
    </div>
  </PublicShell>;
}
