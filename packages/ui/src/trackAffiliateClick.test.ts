// Regression guard for the portfolio-standard GA4 params: alongside the
// site-specific payload, every affiliate_click must carry affiliate_partner /
// affiliate_status / link_domain — the event-scoped custom dimensions
// registered in GA4 via gsc-data ga4-setup.mjs.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Product } from '@nootropic/data';
import { trackAffiliateClick } from './trackAffiliateClick';

const g = globalThis as { window?: { gtag?: unknown } };

function product(overrides: Record<string, unknown> = {}): Product {
  return {
    brand: 'Mind Lab Pro',
    slug: 'mind-lab-pro',
    name: 'Mind Lab Pro v4',
    score: 9.2,
    affiliateNetwork: 'PartnerStack',
    affiliateUrl: 'https://www.mindlabpro.com?a_aid=x',
    ...overrides,
  } as unknown as Product;
}

describe('trackAffiliateClick', () => {
  beforeEach(() => {
    delete g.window;
  });
  afterEach(() => {
    delete g.window;
  });

  it('is a no-op without window.gtag', () => {
    g.window = {};
    expect(() => trackAffiliateClick({ product: product(), surface: 'review' })).not.toThrow();
  });

  it('emits site payload plus the portfolio-standard params', () => {
    const gtag = vi.fn();
    g.window = { gtag };

    trackAffiliateClick({ product: product(), position: 1, surface: 'listicle' });

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag.mock.calls[0]![2]).toMatchObject({
      partner: 'Mind Lab Pro',
      product: 'mind-lab-pro',
      surface: 'listicle',
      affiliate_partner: 'Mind Lab Pro',
      affiliate_status: 'live',
      link_domain: 'www.mindlabpro.com',
    });
  });

  it('degrades to affiliate_status=unknown and empty link_domain when affiliate data is missing', () => {
    const gtag = vi.fn();
    g.window = { gtag };

    trackAffiliateClick({
      product: product({ affiliateNetwork: undefined, affiliateUrl: undefined }),
      surface: 'review',
    });

    expect(gtag.mock.calls[0]![2]).toMatchObject({
      affiliate_status: 'unknown',
      link_domain: '',
    });
  });
});
