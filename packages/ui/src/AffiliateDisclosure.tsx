import Link from 'next/link';

export default function AffiliateDisclosure() {
  return (
    <div className="disclosure-banner mb-6">
      <strong>Affiliate disclosure:</strong> This page contains affiliate links. If you purchase
      through our links, we may earn a commission at no extra cost to you. Our editorial opinions
      are independent — we only recommend products we have independently researched.{' '}
      <Link href="/methodology" className="underline">
        Read our methodology
      </Link>
      .
    </div>
  );
}
