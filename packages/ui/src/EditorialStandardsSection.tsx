import Link from 'next/link';

/**
 * Editorial Standards section appended to /methodology/ pages across the
 * portfolio. Documents the testing protocol, conflict-of-interest policy,
 * correction policy, source-citation policy, and the editorial-team identity
 * statement.
 *
 * Per Stage 6 E-E-A-T audit: this section is the load-bearing piece that
 * makes the Organization-only authorship stance defensible under Google's
 * Quality Rater Guidelines. The bar is "is the editorial process credible?"
 * not "is the byline named?". This component documents the process.
 *
 * Same content is rendered on all 8 region apps so the editorial standards
 * are consistent across the portfolio. Region-specific compliance content
 * (EU Reg 1924/2006, ANMAT, etc.) lives in each app's methodology page.tsx
 * around this shared section.
 */
export default function EditorialStandardsSection() {
  return (
    <>
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Editorial Standards</h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Beyond the 5-pillar scoring framework, every page on this site is produced under the following
          editorial standards. These standards apply to all 8 regional editions and govern how content is
          researched, reviewed, corrected, and disclosed.
        </p>

        <div className="space-y-5">
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">1. Testing &amp; review protocol</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Products are categorised as <strong>hands-on tested</strong> or <strong>catalog only</strong>.
              Hands-on tested products are sourced through retail or manufacturer channels (never from
              affiliate-program promo samples), used by an editor for a minimum of 30 days under
              consistent stack conditions, and audited against label claims via a clinical-dose
              cross-reference. Catalog-only products are evaluated from manufacturer-published ingredient
              lists, regulatory filings, and third-party Certificates of Analysis when available. Every
              listicle pick and comparison row is tagged so readers can self-filter trust. We never
              imply hands-on testing where none has occurred.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">2. Conflict-of-interest policy</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              We earn affiliate commissions from links on commercial pages. Affiliate relationships
              <strong> do not</strong> influence:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-1 ml-2">
              <li>5-pillar scores (set before any affiliate program is evaluated)</li>
              <li>Listicle ranking position (driven by score + use-case fit only)</li>
              <li>Pros/cons content (criticism is preserved even on affiliate-active products)</li>
              <li>Clinical-dose audit verdicts (purely data-driven against PubMed-indexed RCTs)</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              We do not accept payment for reviews, sponsored content placements, or guaranteed-position
              promotion. Affiliate disclosures appear at the top of every commercial page, before the
              first call-to-action, in compliance with FTC 16 CFR Part 255 (US), ASA CAP Code (UK), and
              equivalent advertising codes in each region we publish.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">3. Source-citation policy</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Clinical-dose claims are sourced from PubMed-indexed human randomized controlled trials,
              meta-analyses, and Examine.com syntheses. Regulatory claims are sourced from primary
              regulator documents (FDA, EFSA, TGA, Health Canada, MHLW Consumer Affairs Agency, ANMAT,
              ANVISA, COFEPRIS, SFDA, BPOM, HSA, NPRA, JAKIM, BPJPH). When a claim cannot be sourced
              from primary literature or a primary regulator, it is either omitted or flagged as
              "limited evidence" / "manufacturer claim only". We do not cite secondary aggregators
              (Healthline, Verywell) as primary sources for clinical claims.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">4. Correction policy</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              We aim to respond to substantive editorial corrections within 5 business days and to
              update or retract incorrect content within 10 business days of verification. When a
              correction is made:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-1 ml-2">
              <li>The page&apos;s <code className="text-xs bg-gray-100 px-1 rounded">dateModified</code> Article-schema field is updated to reflect the change.</li>
              <li>For factual corrections (dose values, regulatory status, brand ownership), the prior
              statement is replaced and a brief note is added to the page when the correction is
              material to a reader&apos;s purchase decision.</li>
              <li>We do not silently delete published claims. Significant corrections to scored
              comparisons trigger a re-score under the same 5-pillar framework with a visible date.</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              Send corrections to{' '}
              <a href="mailto:editorial@thenootropiclab.com" className="text-green-700 underline">
                editorial@thenootropiclab.com
              </a>
              . Include the page URL, the specific claim, and a primary source supporting the correct
              version.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">5. Editorial-team identity</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              The Nootropic Lab operates as an independent editorial collective. Reviews are produced
              collaboratively by editors with backgrounds in pharmacology, evidence synthesis, and
              consumer-product analysis. We do not disclose individual contributors by name and do not
              feature personal brands within reviews. This is a deliberate choice: it keeps the focus
              on the methodology and the data, and reduces the risk that a single contributor&apos;s
              preferences disproportionately influence rankings. Every review applies the same 5-pillar
              framework documented above; consistency is the credibility signal, not authority by
              persona.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">6. Region-specific regulatory framing</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Each regional edition of this site applies the YMYL disclaimer language mandated or
              expected by that region&apos;s primary regulator: DSHEA (US FDA), Reg (EC) 1924/2006 +
              EFSA register (EU), Health Canada NPN (CA), TGA Therapeutic Goods Advertising Code (AU),
              PMD Act + FFC + FOSHU (JP), ANVISA / COFEPRIS / ANMAT (LATAM, with explicit ANMAT
              2105/2022 banned-compound auditing for Argentine traffic), SFDA + Halal certification
              (GCC), HSA + BPOM + NPRA + Halal mandatory ID/MY (SEA). Cognitive claims that are not
              approved by the relevant regulator are reframed as ingredient mechanisms or consumer
              experience and never asserted as label-grade health claims.
            </p>
          </div>
        </div>
      </section>

      <section className="my-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-3">Editorial contact</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">
          Editorial corrections, regulatory inquiries, partnership requests:
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          <a href="mailto:editorial@thenootropiclab.com" className="text-blue-700 underline font-medium">
            editorial@thenootropiclab.com
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          For full publisher information see our{' '}
          <Link href="/imprint/" className="text-blue-700 underline">imprint</Link>.
        </p>
      </section>
    </>
  );
}
