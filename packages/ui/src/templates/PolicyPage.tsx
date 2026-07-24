// Shared cookie-policy + privacy-policy template. The english copy was
// duplicated across 7 region apps (us, eu, ca, au, jp, gcc, sea); this
// template is the single source of truth for that copy. Each region's
// `apps/<region>/src/app/cookie-policy/page.tsx` and `privacy-policy/page.tsx`
// reduce to a thin wrapper that supplies the region code + searchItems/uiStrings.
//
// LATAM keeps its own Spanish-language version of these pages and does NOT
// use this template. Future locale-specific bodies should follow that pattern
// (region-specific custom file) rather than parameterizing this template.

import PublicShell from './PublicShell';
import type { SearchItem } from '../SearchModal';
import type { UIStrings } from '@nootropic/data';

export interface PolicyPageProps {
  type: 'cookie' | 'privacy' | 'terms';
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
}

const LAST_UPDATED = 'January 15, 2026';

function CookiePolicyBody() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-gray prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What Are Cookies?</h2>
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They help
            the site remember your preferences and understand how you use the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Cookie</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Type</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Purpose</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-3 py-2 text-gray-900 font-medium">cookie-consent</td>
                  <td className="px-3 py-2 text-gray-700">Necessary</td>
                  <td className="px-3 py-2 text-gray-700">Stores your cookie consent preference (accepted/declined)</td>
                  <td className="px-3 py-2 text-gray-700">Persistent (localStorage)</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-3 py-2 text-gray-900 font-medium">Analytics cookies</td>
                  <td className="px-3 py-2 text-gray-700">Optional</td>
                  <td className="px-3 py-2 text-gray-700">Anonymous page view tracking, referrer source, device type</td>
                  <td className="px-3 py-2 text-gray-700">Session / 30 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Third-Party Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            When you click an affiliate link on our site, you are redirected to the product
            manufacturer&apos;s website. That site may set its own cookies for tracking affiliate
            referrals and purchases. We do not control these third-party cookies. Common affiliate
            networks used on this site include direct brand programs and Amazon Associates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Control Cookies</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>On our site:</strong> Use the cookie banner at the bottom of the page to accept or decline analytics cookies. Your choice is saved and respected on all future visits.</li>
            <li><strong>In your browser:</strong> You can delete cookies or block them entirely in your browser settings. This will not affect site functionality since our site works without JavaScript cookies.</li>
            <li><strong>To reset your preference:</strong> Clear your browser&apos;s localStorage for this domain, and the cookie banner will reappear on your next visit.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">We Do Not Use</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Advertising cookies or retargeting pixels</li>
            <li>Facebook Pixel or social media tracking</li>
            <li>Cross-site tracking of any kind</li>
            <li>Personalized advertising or data sales to third parties</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about our cookie practices: <strong>privacy@thenootropiclab.com</strong>
          </p>
        </section>
      </div>
    </>
  );
}


function TermsBody() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-gray prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Nature of This Site</h2>
          <p className="text-gray-700 leading-relaxed">
            The Nootropic Lab (independently operated) provides evidence-graded reviews, clinical
            dosing audits, and comparisons of cognitive supplements. Content is intended for
            general information only and does not constitute medical, nutritional, or other
            professional advice. Consult a qualified healthcare professional before taking any
            supplement, especially alongside medication or a medical condition.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Affiliate Links</h2>
          <p className="text-gray-700 leading-relaxed">
            We earn commissions when readers purchase through links on this site. This is
            disclosed on our methodology page and never affects scores or rankings — vendors
            without affiliate programmes are graded on the same criteria as those with them.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Accuracy</h2>
          <p className="text-gray-700 leading-relaxed">
            Formulations, pricing, and availability change frequently and vary by region. We
            strive for accuracy but cannot guarantee all information is current; verify directly
            with the vendor before purchasing. Report errors via the contact page.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. No Warranties</h2>
          <p className="text-gray-700 leading-relaxed">
            This site is provided &quot;as is&quot; without warranties of any kind, express or
            implied. To the maximum extent permitted by applicable law, we disclaim all
            warranties including merchantability, fitness for a particular purpose, and
            non-infringement.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            To the maximum extent permitted by applicable law, The Nootropic Lab and its editor
            are not liable for any direct, indirect, incidental, consequential, or exemplary
            damages arising from use of this site or reliance on its content.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            Editorial content on this site is © The Nootropic Lab. You may quote brief excerpts
            with attribution and a link; wholesale reproduction requires permission.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These terms are governed by the laws of Cyprus. See also the{' '}
            <a href="/privacy-policy" className="text-emerald-700 underline">privacy policy</a> and{' '}
            <a href="/imprint" className="text-emerald-700 underline">imprint</a>.
          </p>
        </section>
      </div>
    </>
  );
}

function PrivacyPolicyBody() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-gray prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
          <p className="text-gray-700 leading-relaxed">
            The Nootropic Lab is an independent cognitive supplement review platform. We provide
            evidence-graded reviews, clinical dosing audits, and product comparisons. We are an
            affiliate site — we earn commissions when you purchase through our links. This policy
            explains how we handle your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We collect minimal data:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Analytics data</strong> (only after cookie consent): page views, referrer, device type, country. Collected via Google Analytics 4 and Cloudflare Web Analytics. No personally identifiable information is collected. Advertising features are disabled, and data is not used for personalized advertising or sold to third parties.</li>
            <li><strong>Cookie consent preference:</strong> stored in your browser&apos;s localStorage to remember your choice.</li>
            <li><strong>Affiliate click data:</strong> when you click an affiliate link, the destination site may set tracking cookies. We do not control third-party cookies.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data We Do NOT Collect</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>We do not collect names, email addresses, or personal information</li>
            <li>We do not require account creation</li>
            <li>We do not sell or share data with third parties for advertising</li>
            <li>We do not use advertising cookies or retargeting pixels</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            We use two types of cookies: <strong>necessary cookies</strong> (cookie consent
            preference, stored in localStorage) which are always active, and <strong>analytics
            cookies</strong> which are only activated after you click &quot;Accept Analytics&quot; on our
            cookie banner. You can decline analytics cookies with no impact on site functionality.
            See our <a href="/cookie-policy" className="text-green-700 underline">Cookie Policy</a> for
            full details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Affiliate Links</h2>
          <p className="text-gray-700 leading-relaxed">
            This site contains affiliate links. When you click these links and make a purchase, we
            may earn a commission at no additional cost to you. Affiliate relationships do not
            influence our editorial scores or recommendations. All affiliate links are clearly
            marked with <code className="bg-gray-100 px-1 rounded text-xs">rel=&quot;nofollow sponsored&quot;</code> attributes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Third-Party Services</h2>
          <p className="text-gray-700 leading-relaxed">
            This site is hosted on Cloudflare Pages. Cloudflare may collect standard web server
            logs (IP address, user agent, timestamps) as part of their infrastructure. After you
            accept analytics cookies, we use <strong>Google Analytics 4</strong> and{' '}
            <strong>Cloudflare Web Analytics</strong> to measure site usage. Neither uses
            personalized-advertising features, and IP addresses are anonymized. We do not use
            Facebook Pixel or any advertising-tracking services. See Cloudflare&apos;s and
            Google&apos;s respective privacy policies for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            Under GDPR (EU), CCPA (California), and equivalent privacy laws, you have the right to
            access, correct, delete, or restrict processing of your personal data. Since we collect
            minimal data with no account system, there is typically no personal data to request.
            For any privacy-related questions, contact us at the email below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            For privacy inquiries: <strong>privacy@thenootropiclab.com</strong>
          </p>
        </section>
      </div>
    </>
  );
}

export default function PolicyPage({ type, searchItems, uiStrings }: PolicyPageProps) {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
      <article className="max-w-3xl mx-auto px-4 py-10">
        {type === 'cookie' ? <CookiePolicyBody /> : type === 'terms' ? <TermsBody /> : <PrivacyPolicyBody />}
      </article>
    </PublicShell>
  );
}
