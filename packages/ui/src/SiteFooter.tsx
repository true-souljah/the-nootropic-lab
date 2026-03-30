import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16 py-10 text-sm text-gray-500">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="font-bold text-gray-700 mb-2">NootropicGuide</div>
          <p className="text-xs leading-relaxed">
            Independent cognitive supplement reviews for US and EU buyers. Evidence-graded.
            Affiliate-disclosed.
          </p>
        </div>
        <div>
          <div className="font-semibold text-gray-700 mb-2">Reviews</div>
          <ul className="space-y-1 text-xs">
            <li>
              <Link href="/best-nootropics" className="hover:text-green-700">
                Best Nootropics US
              </Link>
            </li>
            <li>
              <Link href="/best-nootropics-europe" className="hover:text-green-700">
                Best Nootropics EU
              </Link>
            </li>
            <li>
              <Link href="/nootropic-comparison" className="hover:text-green-700">
                Compare All
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-700 mb-2">Languages</div>
          <ul className="space-y-1 text-xs">
            <li>
              <Link href="/" className="hover:text-green-700">
                🇺🇸 English (US)
              </Link>
            </li>
            <li>
              <Link href="/de/beste-nootropika" className="hover:text-green-700">
                🇩🇪 Deutsch
              </Link>
            </li>
            <li>
              <Link href="/fr/meilleurs-nootropiques" className="hover:text-green-700">
                🇫🇷 Français
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-700 mb-2">Legal</div>
          <ul className="space-y-1 text-xs">
            <li>
              <Link href="/methodology" className="hover:text-green-700">
                Methodology
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-green-700">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="hover:text-green-700">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-8 pt-6 border-t border-gray-200 text-xs text-gray-400">
        © {new Date().getFullYear()} NootropicGuide. All rights reserved. This site contains
        affiliate links. We earn a commission if you purchase through our links. Our editorial
        reviews are independent. This content is for informational purposes only and does not
        constitute medical advice. Always consult a qualified healthcare professional before taking
        any supplement.
      </div>
    </footer>
  );
}
