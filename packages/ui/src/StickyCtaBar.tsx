'use client';
import { useEffect, useState } from 'react';

interface Props {
  productName: string;
  affiliateUrl: string;
}

export default function StickyCtaBar({ productName, affiliateUrl }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setVisible(pct > 0.3);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`sticky-cta-bar ${visible ? 'visible' : ''}`}>
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
