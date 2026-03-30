import Link from 'next/link';

export default function SiteHeader({ market }: { market: 'us' | 'eu' }) {
  const label = market === 'us' ? 'NootropicGuide US' : 'NootropicGuide EU';
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-gray-900 tracking-tight" aria-label={label}>
          <span className="text-green-700">Nootropic</span>Guide
          {market === 'eu' && <span className="text-xs font-normal text-gray-400 ml-1">EU</span>}
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link href="/best-nootropics" className="hover:text-green-700 transition-colors">
            Best Nootropics
          </Link>
          <Link href="/nootropic-comparison" className="hover:text-green-700 transition-colors">
            Compare
          </Link>
          <Link href="/ingredients" className="hover:text-green-700 transition-colors">
            Ingredients
          </Link>
          <Link href="/guides" className="hover:text-green-700 transition-colors">
            Guides
          </Link>
          <Link href="/methodology" className="hover:text-green-700 transition-colors">
            Methodology
          </Link>
        </nav>
      </div>
    </header>
  );
}
