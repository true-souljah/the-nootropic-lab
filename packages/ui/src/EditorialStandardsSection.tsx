import Link from 'next/link';
import { getStrings, type UIStrings } from '@nootropic/data';
import { fillNodes } from './templates/fillNodes';

/**
 * Editorial Standards section appended to /methodology/ pages across the
 * portfolio. Documents the review protocol, conflict-of-interest policy,
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
 *
 * The headings and the policy text come from the page locale (`strings`,
 * `strings.body`). Only en and es carry the policy text; a locale without it
 * shows en's (no page renders this section in another locale).
 */
export default function EditorialStandardsSection({ strings }: { strings: UIStrings['editorialStandards'] }) {
  const body = strings.body ?? getStrings('en').editorialStandards.body!;
  return (
    <>
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{strings.heading}</h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{body.intro}</p>

        <div className="space-y-5">
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">{strings.reviewProtocol}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{body.reviewProtocol}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">{strings.conflictOfInterest}</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              {fillNodes(body.conflictIntro, { doNot: <strong>{body.conflictDoNot}</strong> })}
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-1 ml-2">
              {body.conflictItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">{body.conflictOutro}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">{strings.sourceCitation}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{body.sourceCitation}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">{strings.correction}</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">{body.correctionIntro}</p>
            <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-1 ml-2">
              {body.correctionItems.map((item) => (
                <li key={item}>
                  {fillNodes(item, { field: <code className="text-xs bg-gray-100 px-1 rounded">dateModified</code> })}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              {fillNodes(body.correctionContact, {
                email: (
                  <a href="mailto:editorial@thenootropiclab.com" className="text-green-700 underline">
                    editorial@thenootropiclab.com
                  </a>
                ),
              })}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">{strings.teamIdentity}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{body.teamIdentity}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-2">{strings.regionalFraming}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{body.regionalFraming}</p>
          </div>
        </div>
      </section>

      <section className="my-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-3">{strings.contact}</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">{body.contactLead}</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          <a href="mailto:editorial@thenootropiclab.com" className="text-blue-700 underline font-medium">
            editorial@thenootropiclab.com
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          {fillNodes(body.imprintNote, {
            imprint: (
              <Link href="/imprint/" className="text-blue-700 underline">
                {body.imprintLink}
              </Link>
            ),
          })}
        </p>
      </section>
    </>
  );
}
