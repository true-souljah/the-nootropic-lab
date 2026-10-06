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

const POLICY_UPDATED = 'October 6, 2026';

const GA_COOKIE_DOC = 'https://support.google.com/analytics/answer/11397207';
const IMPACT_COOKIE_DOC =
  'https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/tracking/tracking-explained/impactcom-cookies-explained';

const TH = 'px-3 py-2 font-semibold text-gray-700';
const TD = 'px-3 py-2 text-gray-700 align-top';
const TD_NAME = 'px-3 py-2 text-gray-900 font-medium align-top';

export interface CookieTableLabels {
  cookie: string;
  setBy: string;
  role: string;
  duration: string;
}

const COOKIE_TABLE_LABELS_EN: CookieTableLabels = {
  cookie: 'Cookie',
  setBy: 'Set by',
  role: 'What it does',
  duration: 'Duration',
};

export interface CookieTableProps {
  /** The consent purpose these cookies serve (one table per purpose). */
  heading: string;
  labels: CookieTableLabels;
  /** [name, set by, what it does, duration] */
  rows: [string, string, string, string][];
}

/** The cookies of ONE consent purpose: a heading plus a name / set-by / role / duration table. */
export function CookieTable({ heading, labels, rows }: CookieTableProps) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-2">{heading}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className={TH}>{labels.cookie}</th>
              <th className={TH}>{labels.setBy}</th>
              <th className={TH}>{labels.role}</th>
              <th className={TH}>{labels.duration}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, setBy, role, duration], i) => (
              <tr key={name} className={`border-b border-gray-100${i % 2 ? ' bg-gray-50' : ''}`}>
                <td className={TD_NAME}>{name}</td>
                <td className={TD}>{setBy}</td>
                <td className={TD}>{role}</td>
                <td className={TD}>{duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CookiePolicyBody() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {POLICY_UPDATED}</p>

      <div className="prose prose-gray prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What Are Cookies?</h2>
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. Similar
            browser storage (localStorage) works the same way. This page lists every cookie and
            storage entry this site uses, what each one is for, who sets it and how long it lasts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Nothing Optional Runs Before You Choose</h2>
          <p className="text-gray-700 leading-relaxed">
            The optional cookies serve two separate purposes, and you decide on each one
            separately: <strong>Analytics</strong> (Google Analytics 4) and{' '}
            <strong>Affiliate attribution</strong> (Impact.com). On your first visit a consent
            banner offers <strong>Accept all</strong> and <strong>Decline all</strong> side by
            side, plus <strong>Configure</strong>, where each purpose has its own switch (both off
            until you switch them on). A purpose&apos;s script loads, and its cookies are set, only
            if you allow that purpose: allowing Analytics never loads Impact.com, and allowing
            Affiliate attribution never loads Google Analytics. Until you choose, no request is sent
            to Google or Impact.com. If you decline, nothing optional is loaded and we remember your
            refusal for exactly as long as we would remember an acceptance (365 days).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies We Use, by Purpose</h2>
          <CookieTable
            heading="Strictly necessary (always active)"
            labels={COOKIE_TABLE_LABELS_EN}
            rows={[
              ['klaro', 'This site (consent manager)', 'Stores your consent choice for each purpose: which services you allowed or declined.', '365 days'],
            ]}
          />
          <CookieTable
            heading="Analytics: Google Analytics 4 (only if you allow Analytics)"
            labels={COOKIE_TABLE_LABELS_EN}
            rows={[
              ['_ga', 'Google Analytics 4 (Google), first-party cookie', 'Distinguishes visitors so we can count how many people read each page.', '2 years'],
              ['_ga_<container-id>', 'Google Analytics 4 (Google), first-party cookie', 'Keeps track of the current visit (session state).', '2 years'],
            ]}
          />
          <CookieTable
            heading="Affiliate attribution: Impact.com (only if you allow Affiliate attribution)"
            labels={COOKIE_TABLE_LABELS_EN}
            rows={[
              ['IR_MPI', 'Impact.com, first-party cookie', 'Random visitor ID used by Impact.com’s tracking tag so a purchase on a partner site can be credited to this site.', 'Persistent (400 days in Chrome, the browser maximum)'],
              ['IR_MPS', 'Impact.com, first-party cookie', 'Current-visit record used by Impact.com’s tracking tag.', 'Session'],
              ['IR_gbd', 'Impact.com, first-party cookie', 'Records the base domain for Impact.com’s tracking tag.', 'Session'],
              ['IR_PI, IR_<campaign-id>', 'Impact.com, first-party cookies', 'Other attribution cookies Impact.com documents for its tracking tag; they may be set when you follow a partner link.', '365 days / Session'],
            ]}
          />
          <p className="text-gray-700 leading-relaxed">
            Durations are the providers&apos; defaults; browsers may shorten them (Google notes a
            maximum of 400 days in Chrome and 7 days in Safari):{' '}
            <a href={GA_COOKIE_DOC} className="text-emerald-700 underline" rel="noopener noreferrer">
              Google Analytics 4 cookie usage
            </a>{' '}
            and{' '}
            <a href={IMPACT_COOKIE_DOC} className="text-emerald-700 underline" rel="noopener noreferrer">
              impact.com cookies explained
            </a>
            . Google Analytics runs with advertising features off: no advertising cookies, no
            personalised ads, and the data is not sold.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Browser Storage for Features You Use</h2>
          <p className="text-gray-700 leading-relaxed">
            These entries are written only when you use the feature, never shared with anyone and
            kept until you clear them: <strong>nootropic-shortlist</strong> and{' '}
            <strong>nootropic-shortlist-note:&lt;product&gt;</strong> (your saved shortlist and
            notes), and <strong>nootropic-command-recent</strong> (your recent searches in the
            search palette).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Hosting and Partner Sites</h2>
          <p className="text-gray-700 leading-relaxed">
            The site is hosted on Cloudflare, which processes standard technical request data
            (such as IP address and browser type) to deliver and protect the site. We do not use
            Cloudflare Web Analytics. When you click an affiliate link you leave this site; the
            retailer or affiliate network you land on sets its own cookies under its own policy,
            which we do not control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Change or Withdraw Your Consent</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>On our site:</strong> use the <strong>Cookie settings</strong> link at the
              bottom of every page to reopen the consent banner: <strong>Decline all</strong>{' '}
              withdraws both purposes, and <strong>Configure</strong> lets you switch off one
              purpose only. Withdrawing Analytics stops Google Analytics on the page and deletes its
              cookies (<code>_ga</code>, <code>_ga_&lt;container-id&gt;</code>); withdrawing
              Affiliate attribution deletes Impact.com&apos;s cookies (<code>IR_*</code>). The other
              purpose stays as you chose it.
            </li>
            <li>
              <strong>In your browser:</strong> you can delete or block cookies in your browser
              settings. Deleting the <strong>klaro</strong> cookie makes the consent banner appear
              again on your next visit.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">We Do Not Use</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Advertising cookies or retargeting pixels</li>
            <li>Facebook Pixel or social media tracking</li>
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
      <p className="text-sm text-gray-500 mb-8">Last updated: {POLICY_UPDATED}</p>

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
            <li><strong>Analytics data</strong> (only if you allow the Analytics purpose on the consent banner): page views, referrer, device type, country. Collected via Google Analytics 4. No personally identifiable information is collected. Advertising features are disabled, and data is not used for personalized advertising or sold to third parties.</li>
            <li><strong>Affiliate attribution data</strong> (only if you allow the Affiliate attribution purpose, which is separate from Analytics): Impact.com&apos;s tracking tag stores a random ID so a purchase made on a partner site after clicking our link can be credited to us.</li>
            <li><strong>Cookie consent preference:</strong> stored in the <code className="bg-gray-100 px-1 rounded text-xs">klaro</code> cookie for 365 days to remember your choice (acceptance and refusal are kept for the same time).</li>
            <li><strong>Affiliate click data:</strong> when you click an affiliate link, the destination site may set its own tracking cookies. We do not control third-party cookies.</li>
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
            We use one <strong>necessary cookie</strong> (<code className="bg-gray-100 px-1 rounded text-xs">klaro</code>,
            your consent choice, 365 days) which is always active, and optional cookies for two
            separate purposes that you choose individually: <strong>Analytics</strong> (Google
            Analytics 4: <code className="bg-gray-100 px-1 rounded text-xs">_ga</code>,{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">_ga_&lt;container-id&gt;</code>) and{' '}
            <strong>Affiliate attribution</strong> (Impact.com:{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">IR_*</code>). Each is set only after
            you allow its purpose on our consent banner (&quot;Accept all&quot;, or that purpose under
            &quot;Configure&quot;). Nothing optional loads before you choose. You can decline with no
            impact on site functionality, and change or withdraw your choice for each purpose at any
            time via the &quot;Cookie settings&quot; link at the bottom of every page. See our{' '}
            <a href="/cookie-policy" className="text-green-700 underline">Cookie Policy</a> for
            names, purposes and durations.
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
            logs (IP address, user agent, timestamps) as part of their infrastructure; we do not
            use Cloudflare Web Analytics. Only for the purposes you allow on our consent banner, we
            use <strong>Google Analytics 4</strong> to measure site usage (Analytics;
            personalized-advertising features off) and <strong>Impact.com</strong>&apos;s tracking tag
            to attribute affiliate purchases (Affiliate attribution). We do not use Facebook Pixel or any advertising-tracking services. See
            Cloudflare&apos;s, Google&apos;s and Impact.com&apos;s respective privacy policies for details.
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
