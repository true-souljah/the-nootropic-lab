import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter, PublicShell } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

// Every factual sentence on this page maps to the sourced fact sheet
// nootropics-research/2026-09/p5/jp-english-guide.json (fetched 2026-09-29).
// Retailer availability outside Rakuten, and Japan shipping for NooCube,
// Performance Lab Mind and Hunter Focus, were NOT verified — do not add them
// without a fresh verified fetch.

const PATH = '/japanese-brain-supplements/';
const PAGE_URL = `${SITE_URL}${PATH}`;
const TITLE = 'Japanese Brain Supplements: FFC-Notified Products vs. Imported Nootropics';
const DESCRIPTION =
  'What "Japanese vitamins for the brain" actually means: how Japan\'s Foods with Function Claims (機能性表示食品) system works, FOSHU vs FFC, how to verify FANCL BRAINs (notification G425) yourself, and the 2019 personal-import restriction on racetams, vinpocetine and adrafinil.';

// Date the facts below were last checked against their sources.
const VERIFIED_ON = '2026-09-29';
const VERIFIED_ON_LABEL = '29 September 2026';

const CAA_FFC_DB_URL = 'https://www.fld.caa.go.jp/caaks/cssc01/';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'jp', path: PATH, availableInRegions: ['jp'] }),
  openGraph: buildOpenGraph({ regionCode: 'jp', path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What are "Japanese vitamins for the brain"? FFC-notified supplements vs. imported nootropics',
  description: DESCRIPTION,
  datePublished: VERIFIED_ON,
  dateModified: VERIFIED_ON,
  author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  mainEntityOfPage: PAGE_URL,
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Japanese Brain Supplements', item: PAGE_URL },
  ],
};

const ffcCognitiveIngredients = [
  'Ginkgo biloba leaf-derived terpene lactones and flavonoid glycosides (イチョウ葉由来テルペンラクトン / フラボノイド配糖体)',
  'Lutein (ルテイン)',
  'Matured-hop-derived bitter acids (熟成ホップ由来苦味酸)',
  'Bacopa saponins (バコパサポニン)',
  'DHA',
  'GABA',
  'Phosphatidylcholine',
];

const restrictedCompounds = [
  'piracetam',
  'aniracetam',
  'oxiracetam',
  'pramiracetam',
  'levetiracetam',
  'nefiracetam',
  'etiracetam',
  'vinpocetine',
  'adrafinil',
];

// Visible Q&A only — no FAQPage JSON-LD (retired portfolio-wide).
const faqs = [
  {
    q: 'Is FFC the same as FDA approval?',
    a: 'No. FFC is not a government approval of any kind. The business notifies Japan\'s Consumer Affairs Agency of its safety and functionality evidence before sale, and the government does not review that notification. Japan\'s approval-based route is FOSHU (特定保健用食品), where the government reviews the effectiveness and safety of each product before granting approval.',
  },
  {
    q: 'Can I buy Mind Lab Pro in Japan?',
    a: 'Mind Lab Pro\'s own FAQ lists Japan among the territories it ships to. It is not FFC-notified in our Japanese catalogue, so it does not carry an FFC function claim in Japan.',
  },
  {
    q: 'Is piracetam legal to import into Japan?',
    a: 'Not without a doctor\'s prescription or instruction. Since 1 January 2019, personal import of piracetam and the other designated "smart drug" compounds has been prohibited in principle without one, regardless of quantity. Japan classes these compounds as pharmaceuticals (医薬品).',
  },
  {
    q: 'Is Suntory DHA&EPA+Sesamin EX an FFC product?',
    a: 'Not according to our catalogue, which records it as not FFC-notified. The Suntory Wellness official Rakuten listing we checked also shows no 機能性表示食品 labelling. It is a domestic Japanese product either way.',
  },
];

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700">Home</Link>
          {' / '}
          <span>Japanese Brain Supplements</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last verified: <time dateTime={VERIFIED_ON}>{VERIFIED_ON_LABEL}</time></span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          What are &ldquo;Japanese vitamins for the brain&rdquo;? FFC-notified supplements vs. imported nootropics
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          Search for &ldquo;Japanese vitamins for the brain&rdquo; and you get two very different kinds of product mixed
          together: supplements sold in Japan under the Consumer Affairs Agency&apos;s Foods with Function Claims system,
          and international nootropic stacks shipped in from abroad. This explainer separates the two, shows how to check
          a Japanese product&apos;s notification yourself, and flags the import rule that applies to several classic
          nootropic compounds. Every factual statement below is backed by a source listed at the end of the page.
        </p>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What people mean by &ldquo;Japanese brain vitamins&rdquo;</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              The phrase covers two groups that are regulated very differently. The first is domestic products that carry
              a function claim under Japan&apos;s Foods with Function Claims system (機能性表示食品, FFC). FANCL BRAINs is
              one of them: it is FFC-notified under notification number G425.
            </p>
            <p>
              Not every well-known Japanese brain-health product is FFC-notified, though. Suntory DHA&amp;EPA+Sesamin EX
              is recorded as not FFC-notified in our catalogue, and the Suntory Wellness official Rakuten listing we
              checked shows no 機能性表示食品 labelling.
            </p>
            <p>
              The second group is international nootropic stacks such as Mind Lab Pro, NooCube, Performance Lab Mind and
              Hunter Focus. All four are in our Japanese catalogue, and none of them is FFC-notified. The distinction
              matters because an FFC function claim comes from a notification filed with the regulator before sale; a
              product with no notification has no FFC claim to display.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Japan&apos;s Foods with Function Claims (機能性表示食品) system, in plain English</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              FFC is administered by the Consumer Affairs Agency (CAA, 消費者庁). Under rules set by the government, a
              business notifies the CAA Commissioner, before sale, of the scientific evidence for the product&apos;s safety
              and functionality, and may then display a function claim on the product.
            </p>
            <p>
              The key word is <em>notification</em>. The CAA itself states that, unlike FOSHU, the government does not
              review FFC notifications: the business has to label the product appropriately, on its own responsibility,
              based on the scientific evidence. The CAA&apos;s English-language labelling material says the same thing in
              one line: Foods with Function Claims are &ldquo;labelled with health functions under food business
              operators&apos; responsibility.&rdquo;
            </p>
            <p>
              In practice, an FFC label tells you that a company has filed its evidence with the regulator. It does not
              tell you that the regulator has checked that evidence.
            </p>
            <p>
              For the full map of Japan&apos;s functional-food categories, and our audit of the Japanese catalogue against
              them, see our{' '}
              <Link href="/ffc-notified-cognitive-supplements/" className="text-green-700 underline">FFC-notified cognitive supplements guide</Link>.
              This page does not repeat it.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FOSHU vs. FFC, in one paragraph</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              FOSHU (特定保健用食品, often shortened to トクホ) is the stricter route. To be sold as FOSHU, each individual
              product must have its effectiveness and safety reviewed by the government and receive approval, under
              Article 43(1) of the Health Promotion Act. In the CAA&apos;s English terminology, FOSHU products are
              &ldquo;labelled with health functions under approval by the Commissioner of CAA&rdquo;, while FFC products
              are labelled under the operator&apos;s own responsibility. Our catalogue records the imported stacks
              above in the general-foods category, with no FFC notification. When a Japanese product mentions memory or
              attention, the first thing to check is which of these routes it used.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients that appear in Japan&apos;s cognitive-function FFC notifications</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              An industry ingredient index that compiles CAA notification data lists the following among the active
              ingredients used in cognitive-function FFC notifications:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {ffcCognitiveIngredients.map(name => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <p>
              Treat this as a list of what companies have notified, not as a ranking of evidence. Because the government
              does not review FFC notifications, an ingredient&apos;s presence on the list means a company filed evidence
              for it, not that the evidence was independently confirmed. For the research behind individual ingredients,
              use our <Link href="/ingredients/" className="text-green-700 underline">ingredient database</Link>.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Case study: FANCL BRAINs (notification G425)</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              FANCL BRAINs is a useful example because it can be checked end to end, from the label to the regulator&apos;s
              database.
            </p>
            <p>
              <strong>What it claims.</strong> FANCL&apos;s product page states that Bacopa saponin (バコパサポニン) helps
              maintain memory, one part of the cognitive function that declines with age, and that matured-hop-derived
              bitter acid (熟成ホップ由来苦味酸) helps maintain attention. That is function wording, and we reproduce it as
              FANCL states it rather than paraphrasing it into anything stronger.
            </p>
            <p>
              <strong>How to verify it yourself.</strong> FANCL&apos;s product page gives the notification number G425 and
              tells shoppers to check the notification details on the CAA&apos;s site:
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                Open the{' '}
                <a href={CAA_FFC_DB_URL} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">CAA FFC notification database (届出情報検索)</a>.
              </li>
              <li>Enter G425 in the notification-number (届出番号) field and search.</li>
              <li>Compare the notifier and the function claim with what is printed on the product you are holding.</li>
            </ol>
            <p>
              The database is an interactive web application: it needs JavaScript and an interactive search, so there is
              no simple link straight to a record. Our own automated check could not query it, which is why we confirmed
              G425 against FANCL&apos;s product page; run the search above yourself before relying on it.
            </p>
            <p>
              <strong>Where it is sold.</strong> FANCL runs an official store on Rakuten, where BRAINs is listed and
              explicitly labelled as a 機能性表示食品 product.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Domestic vs. imported: what changes when a brand ships in from abroad</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Mind Lab Pro ships to Japan: its own FAQ lists Japan among the territories it ships to. For NooCube,
              Performance Lab Mind and Hunter Focus we have not confirmed Japan shipping ourselves for this page, so we
              make no shipping claim for them here; check at checkout.
            </p>
            <p>
              None of these four products is FFC-notified in our catalogue, so none of them carries an FFC function claim
              in Japan. That means the Japanese regulatory label cannot help you compare them, and you have to judge them
              on their ingredients and doses instead.
            </p>
            <p>
              This page is the explainer; for the buying comparison, use our{' '}
              <Link href="/best-nootropics/" className="text-green-700 underline">Best Nootropics in Japan roundup</Link>{' '}
              (also in <Link href="/ja/best-nootropics/" className="text-green-700 underline">Japanese</Link>). For picks
              by goal, see the{' '}
              <Link href="/best-nootropics-for-memory/" className="text-green-700 underline">best nootropics for memory</Link>{' '}
              and{' '}
              <Link href="/best-nootropics-for-focus/" className="text-green-700 underline">best nootropics for focus</Link>{' '}
              in Japan. For side-by-side data, use the{' '}
              <Link href="/nootropic-comparison/" className="text-green-700 underline">nootropic comparator</Link>{' '}
              or the Japanese-language{' '}
              <Link href="/ja/hikaku/" className="text-green-700 underline">brand comparison table (比較)</Link>.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal import rules, briefly</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Our Japanese-language{' '}
              <Link href="/ja/yakkan-shoumei/" className="text-green-700 underline">guide to yakkan shoumei (薬監証明)</Link>{' '}
              covers personal-import paperwork in detail. This section adds two points an English-language searcher is
              likely to miss.
            </p>
            <p>
              <strong>The quantity guidance is written for drugs.</strong> The Ministry of Health, Labour and
              Welfare&apos;s personal-import guidance limits poisons, potent drugs and prescription drugs to a one-month
              supply based on the dosage, and other pharmaceuticals and quasi-drugs (医薬品・医薬部外品) to a two-month
              supply. That is the basis for the commonly cited &ldquo;two-month rule&rdquo;, and it targets those drug
              categories rather than ordinary food-category supplements such as FFC products.
            </p>
            <p>
              <strong>Some classic nootropics are restricted regardless of quantity.</strong> Since 1 January 2019,
              personal import of 25 designated &ldquo;smart drug&rdquo; compounds without a doctor&apos;s prescription or
              instruction has been prohibited in principle. The list includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {restrictedCompounds.map(name => (
                <li key={name} className="capitalize">{name}</li>
              ))}
            </ul>
            <p>
              In Japan these compounds are classed as pharmaceuticals (医薬品), even where they are sold as supplements
              abroad. Researchers at Japan&apos;s National Institute of Health Sciences describe the same restriction in a
              conference poster: since 2019, individual import of the 25 designated smart drugs without a prescription
              has been limited. So a quantity threshold alone does not answer &ldquo;can I import piracetam?&rdquo;; for
              these compounds the answer is no, whatever the amount, unless a doctor has prescribed or instructed it.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where Japanese buyers shop: the channel we confirmed</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              The one retail channel we confirmed for this page is Rakuten, where both domestic examples on this page have
              official brand stores. FANCL&apos;s official Rakuten store lists BRAINs, labelled as a 機能性表示食品
              product, and Suntory Wellness&apos;s official Rakuten store lists DHA&amp;EPA+Sesamin EX.
            </p>
            <p>
              We have not verified availability at other Japanese retailers for this page, so we do not list any. Wherever
              you buy a domestic product, check the listing or the package for the 機能性表示食品 label and its
              notification number, then look the number up in the CAA database as shown above.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="faq-question font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <Sources
          defaultOpen
          sources={[
            { type: 'Regulator', label: 'Consumer Affairs Agency (消費者庁) — Foods with Function Claims (機能性表示食品)', url: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/' },
            { type: 'Regulator', label: 'Consumer Affairs Agency — food labelling overview in English (FFC and FOSHU terminology, PDF)', url: 'https://www.caa.go.jp/en/policy/food_labeling/assets/food_labeling_cms206_241210_22.pdf' },
            { type: 'Regulator', label: 'Consumer Affairs Agency — Foods for Specified Health Uses (特定保健用食品)', url: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_for_specified_health_uses/' },
            { type: 'Regulator', label: 'Consumer Affairs Agency — FFC notification database (届出情報検索)', url: CAA_FFC_DB_URL },
            { type: 'Brand page', label: 'FANCL — BRAINs product page (notification G425)', url: 'https://www.fancl.co.jp/healthy/item/5248a/' },
            { type: 'Brand page', label: 'FANCL official Rakuten store — BRAINs listing', url: 'https://review.rakuten.co.jp/item/1/335893_10009819/1.1/' },
            { type: 'Brand page', label: 'Suntory Wellness official Rakuten store — DHA&EPA+Sesamin EX listing', url: 'https://review.rakuten.co.jp/item/1/405797_10000005/1.1/' },
            { type: 'Brand page', label: 'Mind Lab Pro — FAQ (shipping territories)', url: 'https://www.mindlabpro.com/' },
            { type: 'Industry index', label: 'bal-bal.com — FFC cognitive-function ingredient index', url: 'https://bal-bal.com/food?category=16' },
            { type: 'Regulator', label: 'Ministry of Health, Labour and Welfare (厚生労働省) — personal-import quantity guidance', url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iyakuhin/kojinyunyu/topics/tp010401-1.html' },
            { type: 'Government notice', label: 'Shizuoka Prefecture — personal-import restriction on designated smart drugs (from 1 January 2019)', url: 'https://www.pref.shizuoka.jp/kenkofukushi/eiseiyakuji/yakuji/chuuikanki/1025331.html' },
            { type: 'Study', label: 'National Institute of Health Sciences researchers — smart drugs in Japan (conference poster, PDF)', url: 'https://www.novelpsychoactivesubstances.org/wp-content/uploads/quform/20/2023/11/NPS2023_Tanaka.pdf' },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health note</strong>
          This page is editorial and not medical advice. Consult a qualified healthcare professional before starting any
          supplement.
        </aside>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/" className="text-green-700 underline">← Back to home</Link>
          {' · '}
          <Link href="/guides/" className="text-green-700 underline">All guides</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Methodology</Link>
        </div>
      </article>
    </PublicShell>
  );
}
