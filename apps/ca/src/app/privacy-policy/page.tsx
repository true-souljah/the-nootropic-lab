import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for The Nootropic Lab. How we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: January 15, 2026</p>

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
            <li><strong>Analytics data</strong> (only after cookie consent): page views, referrer, device type, country. We use privacy-focused analytics. No personally identifiable information is collected.</li>
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
            logs (IP address, user agent, timestamps) as part of their infrastructure. See
            Cloudflare&apos;s privacy policy for details. We do not use Google Analytics, Facebook
            Pixel, or any advertising tracking services.
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
    </article>
  );
}
