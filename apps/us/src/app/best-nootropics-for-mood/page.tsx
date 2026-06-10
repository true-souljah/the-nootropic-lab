import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Mood ${CURRENT_YEAR}: NOT a Substitute for Mental Health Treatment`,
  description:
    'Independent ranking of nootropics with mood-adjacent benefits in healthy adults. NOT a treatment for depression, anxiety, or any mental health condition. Always consult a clinician.',
  alternates: buildAlternates({ regionCode: 'us', path: '/best-nootropics-for-mood/', availableInRegions: ['us'] }),
  openGraph: {
    title: 'Best Nootropics for Mood — Honest Editorial',
    description: 'What the evidence says about Rhodiola, Bacopa, and L-theanine for mood support in healthy adults.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Rhodiola Rosea — stress + mild fatigue-related low mood',
    evidence:
      'Adaptogen with documented benefit for mental fatigue and stress-related low mood in healthy adults at 200–600mg/day standardized to 3% rosavins. NOT a treatment for clinical depression. Effects within 1–2 weeks; gentler than stimulants.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22228617/',
  },
  {
    name: 'L-Theanine — anxiolytic / calming',
    evidence:
      'Acutely reduces subjective stress and anxiety markers. Promotes alpha-wave EEG patterns associated with relaxed alertness. Most-replicated calm-focus ingredient. 100–200mg.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22214254/',
  },
  {
    name: 'Bacopa Monnieri — long-term mood + cognition',
    evidence:
      'Beyond memory consolidation, multiple RCTs show Bacopa reduces anxiety and supports overall mood in healthy adults after 8–12 weeks. Slow-onset, cumulative effect.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/23772955/',
  },
  {
    name: 'Saffron extract (where available)',
    evidence:
      'Multiple RCTs show saffron extract (Affron, Crocus sativus) at 28–30mg/day improves mood scores in adults with mild-to-moderate low mood. Generally not in mainstream nootropic stacks; some standalone supplements available.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/29580657/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsUS.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Rhodiola (50mg — below clinical anchor of 200mg, useful as part of a stack), L-theanine (100mg at clinical dose), and Bacopa. Open formula, no caffeine — won\'t aggravate anxiety. Best universal mood-adjacent supplement in our coverage.',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes Rhodiola at higher dose, L-theanine, Bacopa plus broader spectrum. Caffeine-free version is recommended for mood support — caffeinated variant could amplify anxiety in sensitive users.',
  },
  {
    product: productsUS.find(p => p.slug === 'thesis-nootropics-review')!,
    rank: 3,
    whyItsHere:
      'Their Motivation formula targets mood specifically with L-tyrosine + saffron. Personalised approach lets users try this formula in isolation for 4 weeks before committing. Subscription pricing is the friction.',
  },
  {
    product: productsUS.find(p => p.slug === 'noocube-review')!,
    rank: 4,
    whyItsHere:
      'Includes L-theanine and Bacopa. No Rhodiola or saffron. Open formula. Reasonable mood-adjacent option but not the top pick — Mind Lab Pro covers more mood-relevant ingredients.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Can nootropics replace antidepressants?',
    a: 'No. Antidepressants (SSRIs, SNRIs, etc.) are prescription medications for clinical depression and other mental health conditions. Nootropic supplements are not pharmacologically equivalent and should not be marketed as substitutes. If you have or suspect depression or anxiety, see a clinician — supplements may complement (not replace) treatment under clinician supervision.',
  },
  {
    q: 'Are these safe alongside antidepressants?',
    a: 'Talk to your prescribing clinician. L-tyrosine in particular interacts with MAOIs and could affect SSRI dosing. Rhodiola has weak interactions with antidepressants. Bacopa and L-theanine are generally well-tolerated alongside most psychiatric medications, but combining anything new with a treatment regimen requires clinician input.',
  },
  {
    q: 'How long until I notice mood effects?',
    a: 'L-theanine: acute (30–60 minutes). Rhodiola: 1–2 weeks. Bacopa: 8–12 weeks. Saffron: 4–6 weeks. None are acute mood-fix ingredients — expect gradual improvement over weeks, not days.',
  },
  {
    q: 'What about St. John\'s Wort?',
    a: 'St. John\'s Wort has documented antidepressant effect in mild-to-moderate depression but interacts with MANY medications (oral contraceptives, blood thinners, antidepressants, immunosuppressants). It\'s not a "safe natural" option and should only be used under clinician supervision. We don\'t feature it in our editorial picks because of the interaction risk.',
  },
  {
    q: 'Will Rhodiola or Bacopa make me feel "happy"?',
    a: 'No. These are not euphoriants. They reduce stress + fatigue + anxiety markers in healthy adults — the subjective experience is "less worn down" rather than "high." If you expect a noticeable mood lift, you will likely be disappointed.',
  },
  {
    q: 'Should I try a single mood ingredient or a stack?',
    a: 'For evaluation, single-ingredient testing is more informative — you know what worked. For convenience + cumulative effect, a stack like Mind Lab Pro covers L-theanine + Rhodiola + Bacopa in one formula. We recommend starting with a stack, then trying single ingredients (saffron in particular) if mood support remains a primary goal.',
  },
];

const moodDisclaimer =
  'IMPORTANT: This page is not medical advice and not a treatment for depression, anxiety, or any mental health condition. If you are experiencing persistent low mood, anxiety, or thoughts of self-harm, please contact a qualified mental health professional. In the US, the 988 Suicide and Crisis Lifeline is available 24/7 by calling or texting 988. Nootropic supplements may support mood-adjacent factors (stress, fatigue, anxiety) in healthy adults but are not a substitute for professional mental health care.';

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="mood"
      pageTitle="Best Nootropics for Mood Support"
      pageDescription="Independent ranking of nootropics with mood-adjacent benefits in healthy adults. NOT a treatment for depression or anxiety."
      heroParagraph="Mood support is one of the harder use cases to evaluate honestly — the placebo effect is large, the YMYL stakes are high, and the clinical evidence is weakest exactly where buyers want certainty. This page covers what the evidence actually says about Rhodiola, L-theanine, Bacopa, and saffron for mood-adjacent benefits in healthy adults. Not a substitute for mental health care."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'FDA framework for nootropic supplements', href: '/are-nootropics-fda-approved/' }}
      healthDisclaimer={moodDisclaimer}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
