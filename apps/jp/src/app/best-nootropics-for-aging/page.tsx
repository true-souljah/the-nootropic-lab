import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsJP, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain in Japan ${CURRENT_YEAR}: Evidence-Graded Picks`,
  description:
    'Independent ranking of nootropics for adults in Japan concerned about age-related cognitive changes. Domestic options (FFC-notified FANCL BRAINs, plus Suntory) plus phosphatidylserine and citicoline international stacks. NOT a treatment for dementia or Alzheimer\'s.',
  alternates: buildAlternates({ regionCode: 'jp', path: '/best-nootropics-for-aging/' }),
  openGraph: {
    title: 'Best Nootropics for Aging Brain in Japan — Evidence-Graded',
    description: 'Domestic options (FFC-notified FANCL BRAINs, plus Suntory DHA) and international Phosphatidylserine and citicoline picks. Japan\'s aging-population context.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'DHA — Japan\'s most-notified FFC ingredient for older adults',
    ingredientSlugs: ['dha-omega-3'],
    evidence:
      'DHA dominates the Japanese FFC supplement market for adults 50+, with claims around memory support and cognitive function maintenance. The positive memory trials we reviewed used 900mg–1.2g DHA/day for 24 weeks or longer; the trial in adults aged 55 and over used 900mg/day (see our DHA ingredient page). The cultural and regulatory anchor for aging-brain supplementation in Japan.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20434961/',
  },
  {
    name: 'Phosphatidylserine (PS) — FDA qualified health claim',
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'The FDA permits a qualified health claim that PS may reduce risk of dementia and cognitive dysfunction in elderly. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA claim: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo. Used in international Mind Lab Pro (100mg Sharp-PS).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Lion\'s Mane (ヤマブシタケ)',
    ingredientSlugs: ['lions-mane'],
    evidence:
      'Mori et al. 2009 — a foundational small RCT in older Japanese adults with mild cognitive impairment. 1g/day fruiting-body extract over 16 weeks improved cognitive function scores. The Lion\'s Mane evidence base for aging brains was established in Japan; evidence is promising for early age-related changes but is not a dementia treatment.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    ingredientSlugs: ['citicoline'],
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardized form used in Mind Lab Pro.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsJP.find(p => p.slug === 'fancl-brains-review')!,
    rank: 1,
    whyItsHere:
      'The leading domestic Japanese option for aging adults. FFC-notified (機能性表示食品) with cognitive claims filed with the Consumer Affairs Agency. Its notified functional ingredients are bacopa saponins (15mg, age-related memory) and matured hop bitter acids (35mg, age-related attention), per FANCL\'s notification G425 — in one Japanese-language-labelled product. Sold through FANCL\'s official Rakuten store, labelled 機能性表示食品. Trusted FANCL brand familiar to the target demographic. ¥5,479 per 30-day bag (list price on fancl.co.jp).',
  },
  {
    product: productsJP.find(p => p.slug === 'suntory-dha-epa-sesamin-review')!,
    rank: 2,
    whyItsHere:
      'An omega-3 brain supplement whose maker\'s product page calls it 「DHAサプリメント市場18年連続売上No.1」 (No. 1 in DHA-supplement sales for 18 years running; suntory-kenko.com, checked 2026-10-09); no Foods with Function Claims (FFC, 機能性表示食品) notification found in the Consumer Affairs Agency (CAA) database (export scanned 2026-10-06) — Suntory Wellness, a household name backed by the ¥2.7 trillion Suntory Group. 300mg DHA + 100mg EPA + 10mg sesamin per 4 capsules. Foundational structural support for aging brains; widely advertised on Japanese television and trusted across the 60+ demographic. ¥4,800/month.',
  },
  {
    product: productsJP.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 3,
    whyItsHere:
      'Includes phosphatidylserine, citicoline (250mg Cognizin at clinical dose), Bacopa, and Lion\'s Mane (the ingredient with Japanese RCT evidence) in one open-formula product. Caffeine-free — no cardiovascular load for older adults sensitive to stimulants. Best for Japanese adults already comfortable with international online ordering and willing to pay ¥10,350/month equivalent for broader ingredient coverage.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Will these prevent dementia (認知症) or Alzheimer\'s?',
    a: 'No. No supplement — Japanese FFC-notified or otherwise — is approved to prevent or treat dementia (認知症) or Alzheimer\'s disease. The ingredients on this page have evidence for age-related cognitive support in healthy older adults, distinct from disease prevention. If you or a family member is experiencing significant memory changes, see a Japanese neurologist (神経内科) for evaluation. The Ministry of Health, Labour and Welfare (MHLW) Long-Term Care Insurance system (介護保険) provides screening and support resources.',
  },
  {
    q: 'What does FFC notification (機能性表示食品) actually mean?',
    a: 'Japan\'s Food with Function Claims system requires manufacturers to notify the Consumer Affairs Agency (CAA, 消費者庁) of the cognitive claim and the supporting evidence. The CAA describes it as a system in which a business notifies the CAA Commissioner before sale of the scientific evidence for safety and function, and states that, unlike Foods for Specified Health Uses (FOSHU, トクホ), 「国が審査を行いません」 (the government does not review the notification) (caa.go.jp, checked 2026-10-06). It is more rigorous than US "structure-function claims" but less than the EU\'s health-claim authorization system. FANCL BRAINs is notified (G425, confirmed in the CAA database on 2026-10-06); no FFC notification was found for Suntory DHA & EPA + Sesamin EX in the CAA database (export scanned 2026-10-06). The notification reflects the manufacturer\'s own evidence, not a government evaluation, and is not a disease-prevention promise.',
  },
  {
    q: 'When should I start taking these?',
    a: 'The evidence is strongest in 50+ adults with subjective cognitive complaints (もの忘れの自覚). There is no benefit shown to starting in your 30s or 40s purely as "prevention." Talk with your kakaritsuke-i (かかりつけ医) about cognitive concerns before starting any supplement, especially if you take prescription medications.',
  },
  {
    q: 'Are these safe alongside Japanese prescription medications?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing doctor. Bacopa and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with warfarin/anticoagulant regimens; sunflower-derived PS is the alternative. For older adults on multiple medications, bring the supplement label to your next pharmacist (薬剤師) consultation — Japanese pharmacy chains offer this service free.',
  },
  {
    q: 'I take a cholinesterase inhibitor (donepezil / アリセプト). Should I avoid certain ingredients?',
    a: 'Yes — discuss with your neurologist. Huperzine A is itself an acetylcholinesterase inhibitor and stacking with donepezil (アリセプト) is not advised. None of the products above contain Huperzine A. Citicoline is a different mechanism (choline donor) and is sometimes used alongside cholinesterase inhibitors under clinician supervision, but combine only with medical input.',
  },
  {
    q: 'Where can my elderly parents buy these in Japan?',
    a: 'FANCL BRAINs is sold through FANCL\'s official Rakuten store, where it is labelled 機能性表示食品 (notification G425). Mind Lab Pro requires ordering from an international website with English checkout — typically a barrier for older buyers without English proficiency. The domestic options are easier for this demographic to buy, but both score below our bar for ranked picks (listed under Also considered above); Mind Lab Pro, the ranked pick, is the route if a younger family member can manage the international order.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain in Japan"
      pageDescription="Independent ranking of nootropics for adults in Japan concerned about age-related cognitive changes."
      heroParagraph="Japan has the world's oldest population by median age, and age-related cognitive support is one of the largest functional supplement categories under the FFC (機能性表示食品) framework. Domestic brands target this demographic via DHA (Suntory DHA & EPA + Sesamin EX; no FFC notification found in the Consumer Affairs Agency (CAA) database, export scanned 2026-10-06) and bacopa saponins plus matured hop bitter acids (FANCL BRAINs, FFC notification G425). International stacks add Lion's Mane (the evidence base established in Japan via Mori et al. 2009) and clinical-dose citicoline. These supplements have evidence specifically in older adults with subjective cognitive complaints. They are NOT treatments for dementia (認知症), Alzheimer's, or any clinical cognitive disease. For those, see a Japanese neurologist."
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
