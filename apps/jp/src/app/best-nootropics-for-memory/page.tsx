import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsJP, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Memory in Japan ${CURRENT_YEAR}: Independent Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for memory and recall available in Japan. Includes domestic FFC-notified brands (FANCL, Suntory) alongside international stacks shipping to Japan. MHLW-aware buyer notes throughout.',
  alternates: buildAlternates({ regionCode: 'jp', path: '/best-nootropics-for-memory/' }),
  openGraph: {
    title: 'Best Nootropics for Memory in Japan — Evidence-Graded',
    description: 'Bacopa, Lion\'s Mane, Phosphatidylserine, DHA — what the science says + which products in Japan actually deliver them at clinical dose.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri',
    evidence:
      'The most-replicated memory ingredient in nootropics. Multiple double-blind RCTs in adults show improved memory consolidation and recall after 8–12 weeks at 300mg standardized to 50% bacosides. Onset is slow — daily for 8+ weeks. Not currently a notified FFC ingredient in Japan; available only via international stacks.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus / ヤマブシタケ)',
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Mori et al. 2009 — a small RCT in older Japanese adults with mild cognitive impairment — showed memory improvements at 1g/day fruiting-body extract over 16 weeks. The Lion\'s Mane evidence base is uniquely Japanese in origin. Look for fruiting-body extract, not mycelium-on-grain.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'DHA (Docosahexaenoic Acid) — FFC-notified in Japan',
    evidence:
      'DHA is the most-notified functional ingredient under Japan\'s FFC system, with claims around memory support in middle-aged and older adults. The brain is approximately 60% fat by dry weight and DHA is its primary structural omega-3. Clinical doses of 500mg+/day across 12+ weeks. Suntory and FANCL are the dominant Japanese DHA brands.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22932089/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'Phospholipid component of brain cell membranes. The FDA permits a qualified health claim for PS supporting cognitive function in elderly adults. Most RCT evidence is in 50–80-year-olds at 100–300mg/day. Used in both FANCL BRAINs and Performance Lab Mind.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsJP.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), AND phosphatidylserine — three of the four memory-evidence ingredients in one open formula. Bacopa dose is 150mg (under the 300mg clinical anchor) so consider stacking with a separate Bacopa supplement for full effect. Ships from the UK or US to Japan in 7–14 days.',
  },
  {
    product: productsJP.find(p => p.slug === 'fancl-brains-review')!,
    rank: 2,
    whyItsHere:
      'The leading Japanese domestic option: FFC-notified (機能性表示食品) with cognitive claims filed with the Consumer Affairs Agency (消費者庁). Combines DHA (300mg), Ginkgo Biloba (60mg), and Phosphatidylserine (50mg) — three FFC-acceptable mechanisms. Available nationwide at Matsumoto Kiyoshi, Welcia, Sugi Pharmacy, and Amazon Japan with same-day Prime delivery. No customs risk, Japanese-language label, ¥7,500/month.',
  },
  {
    product: productsJP.find(p => p.slug === 'suntory-dha-epa-sesamin-review')!,
    rank: 3,
    whyItsHere:
      'Japan\'s best-selling FFC-notified omega-3 brain supplement (over 30 million bottles sold). 400mg DHA + 100mg EPA + 20mg sesamin from Suntory Wellness — backed by a household-name conglomerate familiar to every Japanese consumer. Foundational rather than acute: works by maintaining structural membrane integrity. Best paired with a dedicated nootropic stack like Mind Lab Pro for users wanting both. ¥4,800/month — the most affordable pick.',
  },
  {
    product: productsJP.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 4,
    whyItsHere:
      'Includes 100mg Sharp-PS phosphatidylserine AND 250mg Cognizin citicoline — both at clinical dose. Caffeine-free, only 2 capsules per day. The minimalist option for memory buyers who want patented, third-party-tested ingredients without a long ingredient list. Ships from the UK to Japan in 10–14 days.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'What is the difference between FFC-notified domestic brands and imported stacks?',
    a: 'Japan\'s Food with Function Claims system (機能性表示食品) requires manufacturers to notify the Consumer Affairs Agency (消費者庁) of the cognitive claim and supporting evidence — a regulatory framework that domestic brands like FANCL BRAINs and Suntory DHA & EPA + Sesamin EX operate under. Imported stacks (Mind Lab Pro, Performance Lab Mind) ship under Ministry of Health, Labour and Welfare (MHLW) personal-import rules and carry no Japanese cognitive claim. Both routes are legal; FFC products are easier to buy in pharmacy chains and have Japanese-language labels.',
  },
  {
    q: 'What is the most evidence-backed nootropic for memory?',
    a: 'Bacopa Monnieri at 300mg standardized to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults — but is only available via imports. For Japan-domestic options, DHA is the most-notified FFC ingredient with strong evidence in middle-aged and older adults; Phosphatidylserine has the FDA qualified health claim for cognitive function in elderly.',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use. Lion\'s Mane: 8–16 weeks. DHA, Phosphatidylserine, citicoline: 4–12 weeks. None of these are acute-effect ingredients. Plan for at least 8 weeks of consistent dosing before judging.',
  },
  {
    q: 'Where can I buy these in Japan?',
    a: 'FANCL BRAINs: every major pharmacy chain (Matsumoto Kiyoshi, Welcia, Sugi Pharmacy, Sundrug) plus Amazon Japan with Prime delivery. Suntory DHA & EPA + Sesamin EX: Suntory Wellness direct, Amazon Japan, and select drugstores. Mind Lab Pro and Performance Lab Mind: ship directly from the UK or US to Japan via the manufacturer website (7–14 business days).',
  },
  {
    q: 'Will Bacopa make me feel anything?',
    a: 'No. Bacopa is not an acute-effect ingredient. It is a classic case of "you only know it worked when you stop and notice the regression." This makes it psychologically harder to stick with than acute-effect ingredients (caffeine, L-theanine) — but the cumulative memory benefit at 8–12 weeks is the most replicated finding in nootropics.',
  },
  {
    q: 'Lion\'s Mane: fruiting body or mycelium?',
    a: 'Fruiting body. Most clinical research uses fruiting-body extract — including the original Mori et al. 2009 study conducted in Japan. Mycelium-on-grain products contain a high percentage of grain (oats, brown rice) by weight and lower beta-glucan content. Read labels carefully and prefer products that disclose β-glucan percentage and use the fruiting body (子実体).',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="memory"
      pageTitle="Best Nootropics for Memory in Japan"
      pageDescription="Independent ranking of the best nootropics for memory and recall available in Japan, based on clinical evidence."
      heroParagraph="Memory is the use case where Japan's regulatory landscape and the global nootropics evidence base intersect most directly. Domestic FFC-notified brands (FANCL BRAINs, Suntory DHA & EPA + Sesamin EX) are notified under Japan's Food with Function Claims system administered by the Consumer Affairs Agency (消費者庁) and target middle-aged and older adults via DHA, Ginkgo, and Phosphatidylserine. International stacks shipping to Japan add the Bacopa and Lion's Mane evidence base — including Mori et al. 2009, the foundational Lion's Mane RCT conducted in Japan."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'FFC-notified cognitive supplements in Japan', href: '/ffc-notified-cognitive-supplements/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('jp')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
