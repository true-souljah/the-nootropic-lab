import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for The Nootropic Lab. What cookies we use and how to control them.',
};

export default function CookiePolicyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: January 15, 2026</p>

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
            <li>Google Analytics (we use privacy-focused alternatives)</li>
            <li>Facebook Pixel or social media tracking</li>
            <li>Cross-site tracking of any kind</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about our cookie practices: <strong>privacy@thenootropiclab.com</strong>
          </p>
        </section>
      </div>
    </article>
  );
}