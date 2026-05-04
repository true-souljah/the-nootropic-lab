import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsJP, getAuthorBySlug } from '@nootropic/data';

const SITE_URL = 'https://jp.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();
const author = getAuthorBySlug('stephan-kulik')!;

export const metadata: Metadata = {
  title: `Best Nootropics for Studying in Japan ${CURRENT_YEAR}: Independent Picks for Students`,
  description:
    'Independent ranking of nootropics for sustained study sessions in Japan. Picks judged on focus + memory consolidation + safety profile for daily use. Includes both imported stacks and domestic FFC-notified options.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-studying/` },
  openGraph: {
    title: 'Best Nootropics for Studying in Japan — Evidence-Graded',
    description: 'Sustained focus + memory consolidation. What students in Japan should actually take, and what to avoid.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine — sustained focus',
    evidence:
      'For sustained study sessions, the L-theanine + caffeine combo is the foundation. Reduces caffeine jitter and post-coffee crash, smooths attention switching. 100–200mg L-theanine + 100mg caffeine — the same pairing naturally found in matcha (抹茶), already familiar to Japanese students.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Bacopa Monnieri — long-term memory consolidation',
    evidence:
      'Critical for retention of studied material. Bacopa improves memory consolidation — what your brain does during sleep with material you studied that day. 300mg standardized to 50% bacosides daily for 8+ weeks. Start at the beginning of the term, not the night before the exam (試験前夜では遅すぎる).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Citicoline — choline for cognitive demand',
    evidence:
      'Heavy cognitive demand depletes choline. Citicoline at 250–500mg/day supports phospholipid synthesis and acetylcholine availability — the neurotransmitter most associated with attention and learning. Cognizin is the standardized form.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'DHA — foundational for retention (FFC-notified)',
    evidence:
      'DHA is Japan\'s most-notified FFC ingredient for cognitive function. As the brain\'s primary structural omega-3, DHA supports synaptic transmission and signal propagation — relevant for sustained study over a multi-month term. Suntory DHA & EPA + Sesamin EX is the most affordable Japanese option.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22932089/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsJP.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Caffeine-free design pairs perfectly with whatever caffeine source Japanese students use during study sessions (coffee, matcha, energy drinks like Red Bull). Includes L-theanine, Bacopa, citicoline, and L-tyrosine — covers all four study-relevant mechanisms in one open formula. Take daily through the term for cumulative Bacopa effect. Ships from the UK/US in 7–14 days at ¥10,350/month equivalent.',
  },
  {
    product: productsJP.find(p => p.slug === 'noocube-review')!,
    rank: 2,
    whyItsHere:
      'Caffeine-free, includes Alpha-GPC, Bacopa, L-theanine (100mg, clinical dose), and L-tyrosine. 60-day money-back guarantee — useful if you finish a term and decide it didn\'t help. One-time purchase model means no recurring billing — straightforward for Japanese student buyers unfamiliar with international subscription supplements.',
  },
  {
    product: productsJP.find(p => p.slug === 'suntory-dha-epa-sesamin-review')!,
    rank: 3,
    whyItsHere:
      'The budget-friendly Japanese domestic option for students. ¥4,800/month — by far the most affordable in this Japan review. FFC-notified (機能性表示食品) DHA + EPA from Suntory Wellness, available everywhere from drugstores to Amazon Japan. Foundational omega-3 support for the duration of a term — best paired with a focus-targeted stack like Mind Lab Pro for acute study sessions.',
  },
  {
    product: productsJP.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 4,
    whyItsHere:
      'Caffeine-free, only 2 capsules/day — the lowest pill burden in this Japan review, useful for students who already take many supplements. 250mg Cognizin citicoline and 100mg phosphatidylserine at clinical dose support cognitive demand and stress resilience during exam periods. Pair with separate caffeine source (coffee, matcha) for the L-theanine + caffeine acute-focus effect.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'When should I start taking nootropics for studying?',
    a: 'For acute-effect ingredients (L-theanine + caffeine), 30 minutes before a study session. For Bacopa, citicoline, and DHA (memory consolidation and structural support), start at the beginning of the term — they need 4–8 weeks of daily use to show effect. The night before an entrance exam (受験) or final is too late for these ingredients.',
  },
  {
    q: 'Will nootropics make me smarter?',
    a: 'No. Nootropics do not increase IQ or change underlying cognitive capacity. They support specific mechanisms — focus stamina, memory consolidation, stress resilience — that allow you to study more effectively for longer with the cognitive capacity you already have.',
  },
  {
    q: 'Are these safe for students in Japan?',
    a: 'The ingredients on this page are generally regarded as safe for healthy adults at the doses listed. Students taking ADHD medication, antidepressants, or with bipolar diagnoses should consult their prescribing clinician. In Japan, ADHD prescription stimulants (Concerta, Strattera) require specialist follow-up — discuss any new supplement with your prescribing doctor before starting.',
  },
  {
    q: 'Should I take Adderall instead?',
    a: 'Adderall is not approved or available in Japan. Methamphetamine derivatives are strictly controlled under the Stimulants Control Act (覚せい剤取締法). Personal import of Adderall or Vyvanse is illegal. If you suspect you have ADHD, see a Japanese psychiatrist (精神科) for evaluation — Concerta and Strattera are the prescription options approved in Japan. Nootropic supplements are not equivalent to prescription stimulants.',
  },
  {
    q: 'How does sleep interact with study supplements?',
    a: 'Sleep is when memory consolidation actually happens. No supplement compensates for chronic sleep deprivation. If you are pulling all-nighters during entrance exam season (受験シーズン), optimize sleep first; supplements are second-order. L-tyrosine has documented benefit specifically for cognitive performance during acute sleep loss but should not be used as a license to skip sleep.',
  },
  {
    q: 'Is matcha alone enough for study sessions?',
    a: 'Matcha provides the L-theanine + caffeine combo at a natural ratio — and is extremely cost-effective. A 30g tin of ceremonial-grade matcha runs ¥1,500–3,000 and lasts a month for daily students. The supplements on this page add memory-consolidation ingredients (Bacopa, citicoline, DHA) on top, which compounds for actual retention of studied material over the term. Many Japanese students start with matcha alone and add a memory-targeted supplement once they\'re committed to a multi-month study plan.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="studying"
      pageTitle="Best Nootropics for Studying in Japan"
      pageDescription="Independent ranking of nootropics for sustained study sessions in Japan. Focus + memory consolidation + safety for daily use."
      heroParagraph="Studying combines two distinct cognitive demands: sustained focus during study sessions and memory consolidation between them. The best study stack for Japanese students covers both — acute-effect focus ingredients (L-theanine + caffeine, naturally present in matcha) plus daily-use memory ingredients (Bacopa, citicoline, DHA). This page ranks the products available in Japan that include both, mixing imported stacks with FFC-notified domestic options."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      author={author}
    />
  );
}
