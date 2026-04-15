'use client';
import { useEffect, useState } from 'react';

interface Props {
  productName: string;
  affiliateUrl: string;
}

export default function StickyCtaBar({ productName, affiliateUrl }: Props) {
  const [visible, setVisible] = useState(false);
  const [cookieDismissed, setCookieDismissed] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) setCookieDismissed(true);

    function onStorage() {
      if (localStorage.getItem('cookie-consent')) setCookieDismissed(true);
    }
    window.addEventListener('storage', onStorage);

    function onScroll() {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setVisible(pct > 0.3);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    const interval = setInterval(() => {
      if (localStorage.getItem('cookie-consent')) {
        setCookieDismissed(true);
        clearInterval(interval);
      }
    }, 500);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  const show = visible && cookieDismissed;

  return (
    <div className={`sticky-cta-bar ${show ? 'visible' : ''}`}>
      <span className="text-sm font-medium">Our #1 Pick: {productName}</span>
      <a
        href={affiliateUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-5 py-2 rounded"
      >
        Check Current Price →
      </a>
    </div>
  );
}
