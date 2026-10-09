import { Fragment, type ReactNode } from 'react';
import { Card } from '../../primitives/Card';
import TrackedAffiliateLink from '../../TrackedAffiliateLink';
import NoPurchaseLinkNotice from '../../NoPurchaseLinkNotice';
import type { Product, UIStrings, VendorTerms } from '@nootropic/data';
import { NOT_AVAILABLE, VENDOR_TERM_FIELDS, purchaseUrl } from '@nootropic/data';

export interface PricingTabProps {
  product: Product;
  /** Locale disclosure bundle — the commission sentence must render in the page locale. */
  disclosure: UIStrings['disclosure'];
  /** Locale product-detail bundle: Pricing-tab labels, price unit and date locale. */
  strings: UIStrings['productDetail'];
  /** Short notice in place of the buy buttons when the edition shows no purchase link. */
  noticeStrings: UIStrings['noPurchaseLink'];
}

/** Fills `{name}` placeholders of a locale template with text or elements. */
function fill(template: string, values: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{\w+\})/).map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return key !== undefined && key in values ? <Fragment key={i}>{values[key]}</Fragment> : part;
  });
}

type TermField = (typeof VENDOR_TERM_FIELDS)[number];

/**
 * Pricing tab. Shows only what the vendor states on its own site
 * (`product.vendorTerms`): each term is the vendor's verbatim quote, in its
 * own language, attributed to its page and check date. A term without
 * evidence renders nothing — never a default promise. The price is the
 * stored record price, as in the header card.
 */
export function PricingTab({ product: p, disclosure, strings, noticeStrings }: PricingTabProps) {
  const t = strings.pricing;
  const terms: VendorTerms | undefined = p.vendorTerms;
  const pageLang = strings.dateLocale.split('-')[0];
  const labels: Record<TermField, string> = {
    shipping: t.shipping,
    cancellation: t.cancellation,
    oneTimePrice: t.oneTimePrice,
    // A returns window (unopened-only, or no refunds) is not a money-back guarantee.
    guarantee: p.moneyBackDays !== null && p.moneyBackDays > 0 ? t.moneyBackGuarantee : t.returns,
  };
  const checkedDisplay = terms
    ? new Date(`${terms.checkedAt}T00:00:00Z`).toLocaleDateString(strings.dateLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : '';

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card padding={22} style={{ gridColumn: '1 / -1' }}>
        <h3 className="text-[16px] font-semibold m-0 mb-1 text-ds-ink">{t.vendorTermsHeading}</h3>
        {/* No purchase link in this edition (Product.noPurchaseLink): the vendor's
            price/shipping quotes cite and link its shop pages, so show the notice instead. */}
        {purchaseUrl(p) === null ? (
          <NoPurchaseLinkNotice product={p} strings={noticeStrings} variant="full" />
        ) : terms ? (
          <>
            <p className="text-[13px] text-ds-muted m-0 mb-4 leading-[1.55]">{t.vendorTermsLede}</p>
            <div className="grid gap-5 md:grid-cols-2">
              {VENDOR_TERM_FIELDS.map((field) => {
                const term = terms[field];
                if (!term) return null;
                return (
                  <div key={field} data-vendor-term={field}>
                    <h4 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted m-0 mb-2">
                      {labels[field]}
                    </h4>
                    <blockquote
                      cite={term.url}
                      lang={term.lang !== pageLang ? term.lang : undefined}
                      className="m-0 pl-3 border-l-[3px] border-l-ds-border text-[14px] text-ds-ink leading-[1.55] break-words"
                    >
                      {/* Fragments are separate page snippets the evidence joined with " | ": one line each. */}
                      {(term.fragments ?? [term.text]).map((line, i) => (
                        <p key={i} className="m-0">
                          {line}
                        </p>
                      ))}
                    </blockquote>
                    <p className="text-[12px] text-ds-muted m-0 mt-2 leading-[1.5]">
                      {fill(t.attribution, {
                        domain: (
                          <a
                            href={term.url}
                            target="_blank"
                            rel="nofollow noopener"
                            className="text-ds-accent underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                          >
                            {new URL(term.url).hostname.replace(/^www\./, '')}
                            <span className="ds-sr-only"> {t.opensInNewTab}</span>
                          </a>
                        ),
                        date: <time dateTime={terms.checkedAt}>{checkedDisplay}</time>,
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.55]">{t.noVendorTerms}</p>
        )}
      </Card>

      <Card padding={22} className="border-l-[3px] border-l-ds-accent">
        {p.priceMonthlyUSD && (
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">
              {strings.stats.price}
            </span>
            <span className="text-right">
              <span className="text-[32px] font-bold tracking-[-0.02em] ds-tabular text-ds-accent">
                ${p.priceMonthlyUSD}
              </span>
              <span className="text-ds-muted text-[14px]">/{strings.stats.monthUnit}</span>
            </span>
          </div>
        )}
        <TrackedAffiliateLink
          product={p}
          position={1}
          surface="review"
          noticeStrings={noticeStrings}
          noticeVariant="compact"
          className="block w-full text-center bg-ds-accent hover:bg-ds-accent-press text-white border-0 py-[10px] rounded-[8px] text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
        >
          {fill(t.visitVendor, { brand: p.brand })}
        </TrackedAffiliateLink>
      </Card>

      <Card variant="subdued" padding={22} className="border-l-[3px] border-l-ds-muted">
        <h3 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted m-0 mb-1">
          {t.affiliateCookie}
        </h3>
        <div className="text-[16px] font-semibold text-ds-ink mb-1">
          {typeof p.cookieDays === 'number'
            ? fill(t.cookieTerms, { days: p.cookieDays, rate: p.commissionRate })
            : NOT_AVAILABLE}
        </div>
        <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">
          {disclosure.inline} {disclosure.ranking}
        </p>
      </Card>
    </div>
  );
}
