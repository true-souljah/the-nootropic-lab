'use client';
import { useEffect, useState } from 'react';
import { CONSENT_CHOICE_EVENT, hasConsentChoice } from './CookieBanner';

interface Props {
  productName: string;
  affiliateUrl: string;
  /** Localized lead-in before the product name (default English). */
  pickLabel?: string;
  /** Localized CTA link text (default English). */
  ctaLabel?: string;
  /** Localized accessible name of the bar (default English). */
  ariaLabel?: string;
}

export default function StickyCtaBar({
  productName,
  affiliateUrl,
  pickLabel = 'Our #1 Pick:',
  ctaLabel = 'Check Current Price →',
  ariaLabel = 'Top pick recommendation',
}: Props) {
  const [visible, setVisible] = useState(false);
  const [cookieDismissed, setCookieDismissed] = useState(false);

  useEffect(() => {
    // The bar waits until the consent banner is out of the way, i.e. the
    // visitor has made a Klaro choice (stored in Klaro's `klaro` cookie).
    // It previously polled a `cookie-consent` localStorage key nothing ever
    // wrote, so the bar never appeared.
    if (hasConsentChoice(document.cookie)) setCookieDismissed(true);

    function onChoice() {
      setCookieDismissed(true);
    }
    window.addEventListener(CONSENT_CHOICE_EVENT, onChoice);

    function onScroll() {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setVisible(pct > 0.3);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener(CONSENT_CHOICE_EVENT, onChoice);
    };
  }, []);

  const show = visible && cookieDismissed;

  return (
    <div className={`sticky-cta-bar ${show ? 'visible' : ''}`} role="complementary" aria-live="polite" aria-label={ariaLabel}>
      <span className="text-sm font-medium">
        {pickLabel} {productName}
      </span>
      <a
        href={affiliateUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-5 py-2 rounded"
      >
        {ctaLabel}
      </a>
    </div>
  );
}
