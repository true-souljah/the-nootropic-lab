import Link from 'next/link';
import type { UIStrings } from '@nootropic/data';

export default function SiteFooter({ strings }: { strings?: UIStrings }) {
  const t = strings?.footer;
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16 py-10 text-sm text-gray-500">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="font-bold text-gray-700 mb-2">{t?.brand || 'The Nootropic Lab'}</div>
          <p className="text-xs leading-relaxed">
            {t?.tagline || 'Independent cognitive supplement reviews. Evidence-graded. Affiliate-disclosed. 8 markets worldwide.'}
          </p>
        </div>
        <div>
          <div className="font-semibold text-gray-700 mb-2">{t?.reviews || 'Reviews'}</div>
          <ul className="space-y-1 text-xs">
            <li>
              <Link href="/best-nootropics" className="hover:text-green-700">
                Best Nootropics
              </Link>
            </li>
            <li>
              <Link href="/nootropic-comparison" className="hover:text-green-700">
                Compare All
              </Link>
            </li>
            <li>
              <Link href="/ingredients" className="hover:text-green-700">
                Ingredients
              </Link>
            </li>
            <li>
              <Link href="/guides" className="hover:text-green-700">
                Guides
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-700 mb-2">{t?.learn || 'Learn'}</div>
          <ul className="space-y-1 text-xs">
            <li>
              <Link href="/guides/what-are-nootropics" className="hover:text-green-700">
                {t?.whatAreNootropics || 'What Are Nootropics?'}
              </Link>
            </li>
            <li>
              <Link href="/guides/how-to-stack-nootropics" className="hover:text-green-700">
                {t?.howToStack || 'How to Stack'}
              </Link>
            </li>
            <li>
              <Link href="/methodology" className="hover:text-green-700">
                Methodology
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-700 mb-2">{t?.legal || 'Legal'}</div>
          <ul className="space-y-1 text-xs">
            <li>
              <Link href="/privacy-policy" className="hover:text-green-700">
                {t?.privacyPolicy || 'Privacy Policy'}
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="hover:text-green-700">
                {t?.cookiePolicy || 'Cookie Policy'}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Health disclaimer */}
      <div className="max-w-5xl mx-auto px-4 mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 leading-relaxed mb-3">
          {t?.healthDisclaimer || 'Health Disclaimer: The information on this website is for educational purposes only and is not intended as medical advice. Nootropic supplements are not approved by the FDA to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any supplement regimen, especially if you are pregnant, nursing, taking medication, or have a medical condition. Individual results may vary.'}
        </p>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} {t?.copyright || 'The Nootropic Lab. All rights reserved. This site contains affiliate links. We earn a commission if you purchase through our links. Our editorial reviews are independent and not influenced by affiliate relationships.'}
        </p>
      </div>
    </footer>
  );
}
