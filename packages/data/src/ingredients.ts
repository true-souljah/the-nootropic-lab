export interface HumanEffect {
  effect: string;
  evidenceStrength: 'strong' | 'moderate' | 'preliminary' | 'mixed';
  magnitude: 'large' | 'moderate' | 'small' | 'negligible';
  /**
   * Number of cited studies (in `sources`) that bear on this effect. Omitted
   * when no reviewed study maps to the row — never an estimate.
   */
  studies?: number;
  notes: string;
}

export interface HowToTake {
  dosage: string;
  timing: string;
  withFood: string;
  cycling?: string;
  forms: string;
}

export interface StackPair {
  ingredient: string;
  slug: string;
  reason: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

/**
 * A cited study behind an ingredient page. Entries come only from the
 * evidence review in packages/data/evidence/ingredients-2026-09/<slug>.json:
 * either a `studies[]` entry with status 200 (pmid/title/year/design copied
 * verbatim) or a `safetySignals[]` entry with a PMID (pmid/title/year/url
 * copied verbatim from that signal).
 */
export interface IngredientSource {
  pmid?: string;
  doi?: string;
  url: string;
  title: string;
  year: number;
  design?: string;
}

export interface Ingredient {
  slug: string;
  name: string;
  category: 'adaptogen' | 'cholinergic' | 'mushroom' | 'amino' | 'herb' | 'vitamin';
  mechanism: string;
  clinicalDose: string;
  timeToEffect: string;
  studySummary: string;
  benefits: string[];
  sideEffects: string[];
  productsContaining: string[];
  humanEffects: HumanEffect[];
  howToTake: HowToTake;
  stacksWith: StackPair[];
  faqs: FAQ[];
  /** Cited studies rendered in the page's Sources block. */
  sources: IngredientSource[];
  /** ISO date (YYYY-MM-DD) of the last PubMed evidence review of this page. */
  evidenceReviewedAt: string;
}

export const ingredients: Ingredient[] = [
  {
    slug: 'lions-mane',
    name: "Lion's Mane",
    category: 'mushroom',
    mechanism: "Lion's Mane (Hericium erinaceus) contains hericenones and erinacines that stimulate the synthesis of Nerve Growth Factor (NGF) in cell and animal studies. NGF promotes neuronal survival, differentiation, and maintenance of neurons in the hippocampus and cortex — regions central to learning and memory. No human trial has yet measured NGF levels after supplementation.",
    clinicalDose: '1–1.8g/day in healthy-adult trials; 3g/day dry powder in the mild cognitive impairment trial',
    timeToEffect: 'Small acute effects within 1–2 hours in pilot trials; the MCI benefit built over 8–16 weeks',
    studySummary: "A 2009 double-blind, placebo-controlled trial (Mori et al., n=30) found higher cognitive function scores in adults with mild cognitive impairment after 16 weeks of 3g/day; scores fell again within 4 weeks of stopping. Its lead author works for Hokuto Corporation, a mushroom producer. A 2019 multicentre RCT improved MMSE scores but not the two other memory tests. In healthy adults, two small 2023 pilot RCTs found acute gains on Stroop, N-Back and reaction-time tasks at 1–1.8g, and only a non-significant trend toward lower stress after 28 days. The evidence is small-sample and short-term.",
    benefits: ['Higher cognitive scores in mild cognitive impairment (one 16-week RCT)', 'Small acute attention and reaction-time gains in healthy adults (pilot RCTs)', 'NGF stimulation (cell and animal studies only)'],
    sideEffects: ['Generally well tolerated; the 16-week MCI trial reported no adverse effects on laboratory tests', 'Rare: mild GI discomfort at high doses'],
    productsContaining: ['mind-lab-pro-review', 'onnit-alpha-brain-review', 'hunter-focus-review'],
    humanEffects: [
      { effect: 'Memory & Learning', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 4, notes: 'Four small RCTs (n=30–41 where reported). Clearest in mild cognitive impairment (Mori 2009); healthy-adult effects are modest and partial (2019 trial significant on MMSE only).' },
      { effect: 'Mood & Stress', evidenceStrength: 'preliminary', magnitude: 'negligible', studies: 1, notes: 'Docherty 2023 (n=41, 1.8g/day, 28 days) found only a non-significant trend toward lower subjective stress (p=0.051).' },
    ],
    howToTake: {
      dosage: '1–1.8g/day (healthy-adult trials); the MCI trial used 3g/day of dry powder, so lower doses may not reproduce its result',
      timing: 'Morning, with breakfast',
      withFood: 'Fat-soluble compounds absorb better with a meal containing some fat. Taking on an empty stomach is fine but a meal improves consistency.',
      forms: 'Capsule or powder. Always choose fruiting body extract (hot-water or dual extracted), not mycelium-on-grain — mycelium products may be mostly starch with minimal active compounds.',
    },
    stacksWith: [
      { ingredient: 'Bacopa Monnieri', slug: 'bacopa-monnieri', reason: 'Classic long-term memory stack. Bacopa consolidates memory via synaptic density; Lion\'s Mane supports NGF. Together they cover both neurogenesis and synaptic pathways.' },
      { ingredient: 'Citicoline', slug: 'citicoline', reason: 'Citicoline provides an acute focus effect while Lion\'s Mane builds long-term neuroprotection — a complementary short- and long-term pairing.' },
      { ingredient: 'Ashwagandha', slug: 'ashwagandha', reason: 'Ashwagandha reduces cortisol (which suppresses NGF expression); combining with Lion\'s Mane may amplify neurogenic effects under stress.' },
    ],
    faqs: [
      { question: 'Fruiting body vs mycelium — which should I buy?', answer: 'Always choose fruiting body extract. Mycelium is grown on grain substrate and most commercial mycelium products contain primarily starch, not active hericenones. Look for "fruiting body" or "dual extract" on the label. Verified extracts like that in Mind Lab Pro use 500mg fruiting body at meaningful concentrations.' },
      { question: 'How long before I notice results?', answer: "Two small 2023 pilot trials found modest acute effects on attention and reaction-time tasks 1–2 hours after a single 1–1.8g dose. The clearest result — in mild cognitive impairment — built over 8–16 weeks of 3g/day (Mori 2009) and faded within 4 weeks of stopping. Do not judge this supplement at 2 weeks." },
      { question: 'Can I take Lion\'s Mane every day?', answer: "Daily use is how it was tested, but only for a limited time: daily dosing was used for up to 16 weeks in the MCI trial (Mori 2009), the other trials reviewed ran 12 weeks or less and the healthy-adult pilots 28 days or less, so longer-term controlled safety data are limited. Unlike some adaptogens, Lion's Mane is not cycled in the trials; the 16-week MCI trial used daily dosing and scores declined within 4 weeks of stopping, so any benefit appears to depend on continued use." },
      { question: "Does Lion's Mane interact with any medications?", answer: "None of the human trials reviewed reported drug interactions, but they were small and short. Always check with your doctor if you are on prescription drugs." },
      { question: 'What does the research actually show for healthy adults?', answer: "Studies in healthy adults are small pilots. Docherty 2023 (n=41, 1.8g/day) found faster Stroop performance 60 minutes after a dose and only a non-significant trend toward lower stress after 28 days; La Monica 2023 found faster N-Back and Go reaction times 2 hours after 1g. Effects are subtler in healthy people than in mild cognitive impairment." },
    ],
    sources: [
      { pmid: '18844328', doi: '10.1002/ptr.2634', url: 'https://pubmed.ncbi.nlm.nih.gov/18844328/', title: 'Improving effects of the mushroom Yamabushitake (Hericium erinaceus) on mild cognitive impairment: a double-blind placebo-controlled clinical trial.', year: 2009, design: 'RCT, double-blind, placebo-controlled, parallel-group' },
      { pmid: '31413233', doi: '10.2220/biomedres.40.125', url: 'https://pubmed.ncbi.nlm.nih.gov/31413233/', title: 'Improvement of cognitive functions by oral intake of Hericium erinaceus.', year: 2019, design: 'RCT, randomized, double-blind, placebo-controlled, parallel-group, multicenter' },
      { pmid: '38004235', doi: '10.3390/nu15224842', url: 'https://pubmed.ncbi.nlm.nih.gov/38004235/', title: 'The Acute and Chronic Effects of Lion\'s Mane Mushroom Supplementation on Cognitive Function, Stress and Mood in Young Adults: A Double-Blind, Parallel Groups, Pilot Study.', year: 2023, design: 'RCT, double-blind, placebo-controlled, parallel-groups, pilot' },
      { pmid: '38140277', doi: '10.3390/nu15245018', url: 'https://pubmed.ncbi.nlm.nih.gov/38140277/', title: 'Acute Effects of Naturally Occurring Guayusa Tea and Nordic Lion\'s Mane Extracts on Cognitive Performance.', year: 2023, design: 'RCT, randomized, double-blind, placebo-controlled, crossover' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'bacopa-monnieri',
    name: 'Bacopa Monnieri',
    category: 'herb',
    mechanism: 'Bacopa enhances synaptic communication by increasing dendritic branching and synaptic density. Its active compounds (bacosides A and B) facilitate repair of damaged neurons and upregulate antioxidant activity, reducing oxidative stress in hippocampal tissue. It also modulates serotonin and acetylcholine systems.',
    clinicalDose: '300–450mg/day (standardised to 55% bacosides)',
    timeToEffect: '8–12 weeks of consistent use (most positive trials ran 12 weeks)',
    studySummary: 'A meta-analysis of 9 RCTs (Kongkeaw et al., 2014, n=518) found Bacopa shortened Trail Making B and choice reaction times versus placebo, and two 12-week RCTs in healthy older adults (Calabrese 2008; Morgan & Stevens 2010) improved delayed word recall at 300mg/day. The newest 12-week RCT (Lopresti 2025, n=101, 300mg/day) found no effect on verbal learning, attention or working memory, though it did reduce self-reported stress. A 2026 network meta-analysis of 29 RCTs found ≥600mg/day beat 300–450mg/day for working memory. Best evidence is for delayed recall rather than acute effects.',
    benefits: ['Delayed recall in healthy older adults (12-week RCTs)', 'Anxiety and stress reduction', 'Antioxidant activity (laboratory studies)'],
    sideEffects: ['GI effects (increased stool frequency, abdominal cramps, nausea) reported at 300mg/day in a 12-week RCT in older adults — take with food', 'More self-reported adverse reactions than placebo (digestive complaints, headaches) in a 2025 12-week RCT', 'Slowed information processing initially', 'Not recommended during pregnancy (precautionary: no human safety data)'],
    productsContaining: ['mind-lab-pro-review', 'noocube-review', 'onnit-alpha-brain-review', 'hunter-focus-review', 'braineffect-focus-review', 'brainzyme-focus-pro-review', 'blackmores-brain-active-review'],
    humanEffects: [
      { effect: 'Memory Consolidation', evidenceStrength: 'strong', magnitude: 'moderate', studies: 4, notes: 'Kongkeaw 2014 meta-analysis (9 RCTs), two 12-week RCTs on delayed recall, and a 2026 network meta-analysis (working memory, ≥600mg/day). The 2025 Lopresti RCT at 300mg/day did not replicate the memory benefit.' },
      { effect: 'Anxiety Reduction', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 2, notes: 'Calabrese 2008: anxiety fell with Bacopa and rose with placebo over 12 weeks; Lopresti 2025: lower self-reported stress reactivity.' },
      { effect: 'Attention', evidenceStrength: 'mixed', magnitude: 'small', studies: 2, notes: 'Positive pooled speed-of-attention result (Kongkeaw 2014) but no effect on attention in the largest recent RCT (Lopresti 2025, p=0.713).' },
      { effect: 'Processing Speed', evidenceStrength: 'mixed', magnitude: 'small', studies: 2, notes: 'An acute 320mg dose improved sustained task performance (2012), but the 2026 network meta-analysis found no processing-speed difference. Some users report temporary initial slowing.' },
    ],
    howToTake: {
      dosage: '300–450mg/day (standardised to 55% bacosides) — the classic trial dose; ≥600mg/day is an emerging, less-established option',
      timing: 'With your largest meal of the day — morning or evening both work',
      withFood: 'Bacosides are fat-soluble, so a meal with some fat is the standard advice. Taking it with food also helps with the GI side effects reported in trials. Do not take on an empty stomach.',
      forms: 'Capsule is most practical. Powder has a bitter, unpleasant taste. Look for standardisation to at least 40–55% bacosides on the label — unstandardised herbal products may contain very little active compound.',
    },
    stacksWith: [
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: 'The definitive long-term memory stack. Bacopa improves synaptic density and memory consolidation; Lion\'s Mane drives NGF synthesis and neuroprotection. Both are slow-acting and complement each other without overlap.' },
      { ingredient: 'Citicoline', slug: 'citicoline', reason: 'Citicoline provides the acute focus and acetylcholine boost that Bacopa lacks in the short term, while Bacopa handles long-term memory consolidation. A well-rounded pairing found in Mind Lab Pro.' },
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'Both have anxiolytic properties. L-Theanine provides immediate calm focus; Bacopa builds long-term stress resilience. The combination is gentle and well-tolerated.' },
    ],
    faqs: [
      { question: 'Why do some people feel "foggy" when starting Bacopa?', answer: 'A minority of users experience a temporary initial slowing of mental processing — sometimes called the "Bacopa fog." This is linked to the serotonin modulation and typically resolves after 3–4 weeks. It reflects the herb\'s mechanism working, not a problem. If it persists past 6 weeks, reduce your dose.' },
      { question: 'Do I really need to take it with fat?', answer: "It is the sensible default. Bacosides are fat-soluble compounds, and GI side effects (cramps, nausea, more frequent stools) were reported in trials, so taking Bacopa with a normal meal that contains some fat is the usual advice." },
      { question: 'What percentage of bacosides should I look for?', answer: 'Aim for 40–55% bacosides standardisation. The two most-studied commercial extracts (Bacognize and Synapsa) are both standardised. Generic "Bacopa" with no standardisation stated is unreliable — the active compound content may be negligible.' },
      { question: 'How long does it take to work?', answer: 'The positive memory trials measured outcomes after 12 weeks. This is not a supplement you evaluate in the first month. Set a calendar reminder to assess at around 12 weeks — and note that the newest 12-week trial at 300mg/day found no cognitive benefit, so results vary.' },
      { question: 'Can Bacopa be taken long-term?', answer: 'Most trials ran 12 weeks or less, so controlled data beyond that is thin. Traditional Ayurvedic use is continuous without cycling, and no trial has shown cycling is necessary — but long-term safety has not been studied directly.' },
    ],
    sources: [
      { pmid: '24252493', doi: '10.1016/j.jep.2013.11.008', url: 'https://pubmed.ncbi.nlm.nih.gov/24252493/', title: 'Meta-analysis of randomized controlled trials on cognitive effects of Bacopa monnieri extract.', year: 2013, design: 'meta-analysis' },
      { pmid: '18611150', doi: '10.1089/acm.2008.0018', url: 'https://pubmed.ncbi.nlm.nih.gov/18611150/', title: 'Effects of a standardized Bacopa monnieri extract on cognitive performance, anxiety, and depression in the elderly: a randomized, double-blind, placebo-controlled trial.', year: 2008, design: 'rct' },
      { pmid: '20590480', doi: '10.1089/acm.2009.0342', url: 'https://pubmed.ncbi.nlm.nih.gov/20590480/', title: 'Does Bacopa monnieri improve memory performance in older persons? Results of a randomized, placebo-controlled, double-blind trial.', year: 2010, design: 'rct' },
      { pmid: '23281132', doi: '10.1002/ptr.4864', url: 'https://pubmed.ncbi.nlm.nih.gov/23281132/', title: 'An acute, double-blind, placebo-controlled crossover study of 320 mg and 640 mg doses of a special extract of Bacopa monnieri (CDRI 08) on sustained cognitive performance.', year: 2012, design: 'rct' },
      { pmid: '41091332', doi: '10.1007/s40261-025-01492-1', url: 'https://pubmed.ncbi.nlm.nih.gov/41091332/', title: 'The Effects of a Bacopa monnieri Extract (Bacumen) on Cognition, Stress, and Fatigue in Healthy Adults: A Randomized, Double-Blind, Placebo-Controlled Trial.', year: 2025, design: 'rct' },
      { pmid: '41678913', doi: '10.1016/j.phymed.2026.157915', url: 'https://pubmed.ncbi.nlm.nih.gov/41678913/', title: 'Comparative effects of Bacopa monnieri and Ginkgo biloba on cognitive functions: A systematic review and network meta-analysis.', year: 2026, design: 'meta-analysis' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'citicoline',
    name: 'Citicoline (CDP-Choline)',
    category: 'cholinergic',
    mechanism: "Citicoline (cytidine 5'-diphosphocholine) is a precursor to both acetylcholine and phosphatidylcholine. It boosts acetylcholine synthesis in the brain — the neurotransmitter central to attention, learning, and memory encoding. It also supports neuronal membrane integrity by replenishing phospholipids.",
    clinicalDose: '250–500mg/day (the memory trials in older adults used 1000–2000mg/day)',
    timeToEffect: 'Memory effects measured after 2–3 months; an acute 1–2 hour onset is unconfirmed for citicoline alone',
    studySummary: 'An RCT in healthy older adults (Spiers et al., 1996) found 1000mg/day improved delayed verbal recall in people with relatively inefficient memory, with 2000mg/day improving immediate and delayed recall. A 2023 meta-analysis found a positive effect on cognitive status in MCI and dementia, but rated study quality poor with a high risk of bias. The 2005 Cochrane review found benefit on memory and behaviour in older adults with chronic cerebral disorders but no evidence of benefit on attention. In acute ischemic stroke, a dose-response RCT (Clark 1997) found better functional outcomes, with 500mg the optimal dose.',
    benefits: ['Verbal memory in older adults with weaker memory', 'Cognitive status in MCI and dementia (low-quality evidence)', 'Functional recovery after ischemic stroke (one RCT)'],
    sideEffects: ['Very well tolerated — no drug-related serious adverse events in the stroke dose-response RCT', 'Rare: headache at very high doses', 'Insomnia if taken late in the day'],
    productsContaining: ['mind-lab-pro-review', 'performance-lab-mind-review'],
    humanEffects: [
      { effect: 'Attention & Focus', evidenceStrength: 'mixed', magnitude: 'small', studies: 2, notes: 'The Cochrane review found no evidence of benefit on attention; the only acute healthy-adult attention RCT gave citicoline together with caffeine, so citicoline’s own effect cannot be isolated.' },
      { effect: 'Working Memory', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 2, notes: 'Verbal-memory benefit in older adults with inefficient memory (Spiers 1996) and a positive pooled effect in MCI/dementia (2023 meta-analysis, poor study quality). Not shown in general healthy adults.' },
      { effect: 'Neuroprotection', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 1, notes: 'Supported for acute ischemic stroke by one dose-response RCT (Clark 1997); no traumatic brain injury trial was found. Effects in healthy adults are untested.' },
    ],
    howToTake: {
      dosage: '250–500mg/day; the memory trials in older adults used 1000–2000mg/day, and 500mg was the optimal dose in the stroke trial',
      timing: 'Morning — citicoline is mildly activating and can cause insomnia if taken after 2pm',
      withFood: 'Can be taken with or without food. No significant difference in absorption. If you experience mild nausea, take with a small meal.',
      forms: 'Capsule. Two standardised branded forms exist: Cognizin (most studied, used in Mind Lab Pro) and Citicoline Sodium. Both are effective. Avoid generic unlabelled CDP-choline from unknown sources.',
    },
    stacksWith: [
      { ingredient: 'Bacopa Monnieri', slug: 'bacopa-monnieri', reason: 'Citicoline handles acute attention and acetylcholine; Bacopa covers long-term memory consolidation. The combination addresses both short-term focus and long-term memory in one stack.' },
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'Citicoline provides cognitive activation; L-Theanine takes the edge off overstimulation. Together they produce alert, focused calm without the jitteriness some people experience from citicoline alone.' },
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: 'Complementary timeframes: citicoline works acutely on acetylcholine; Lion\'s Mane works long-term on NGF. No mechanism overlap — a clean combination.' },
    ],
    faqs: [
      { question: 'Citicoline vs choline bitartrate — what is the difference?', answer: "Citicoline is significantly superior. It crosses the blood-brain barrier more efficiently and provides two active components: choline (for acetylcholine) and cytidine (which converts to uridine, a brain membrane building block). Choline bitartrate provides choline only and crosses the BBB poorly." },
      { question: 'Should I split my dose?', answer: 'At 250mg, a single morning dose is fine. At 500mg, some people split it into 250mg morning and 250mg early afternoon for smoother coverage. Avoid any dose after 2–3pm as the mildly activating effect can delay sleep onset.' },
      { question: 'I got a headache after taking citicoline — is this normal?', answer: 'A headache from citicoline at standard doses (250–500mg) is unusual and may indicate you are sensitive to cholinergic compounds or already getting significant choline from diet/other supplements. Try reducing to 250mg and do not combine with Alpha-GPC or other choline sources on the same day.' },
      { question: 'Cognizin vs generic CDP-Choline — does the brand matter?', answer: 'Cognizin is the most clinically validated form and is tested for purity. Generic CDP-Choline can be fine if sourced from reputable suppliers, but quality varies more. For critical cognitive work, the premium branded form is worth the marginal cost increase.' },
    ],
    sources: [
      { pmid: '15846601', doi: '10.1002/14651858.CD000269.pub3', url: 'https://pubmed.ncbi.nlm.nih.gov/15846601/', title: 'Cytidinediphosphocholine (CDP-choline) for cognitive and behavioural disturbances associated with chronic cerebral disorders in the elderly', year: 2005, design: 'systematic review / meta-analysis (Cochrane)' },
      { pmid: '36678257', doi: '10.3390/nu15020386', url: 'https://pubmed.ncbi.nlm.nih.gov/36678257/', title: 'Is Citicoline Effective in Preventing and Slowing Down Dementia? – A Systematic Review and a Meta-Analysis', year: 2023, design: 'systematic review / meta-analysis' },
      { pmid: '8624220', doi: '10.1001/archneur.1996.00550050071026', url: 'https://pubmed.ncbi.nlm.nih.gov/8624220/', title: 'Citicoline improves verbal memory in aging', year: 1996, design: 'RCT (parallel-group, then crossover sub-study)' },
      { pmid: '9305321', doi: '10.1212/wnl.49.3.671', url: 'https://pubmed.ncbi.nlm.nih.gov/9305321/', title: 'A randomized dose-response trial of citicoline in acute ischemic stroke patients', year: 1997, design: 'RCT, dose-response, multicenter' },
      { pmid: '25046515', doi: '10.3109/09637486.2014.940286', url: 'https://pubmed.ncbi.nlm.nih.gov/25046515/', title: 'Improvements in concentration, working memory and sustained attention following consumption of a natural citicoline-caffeine beverage', year: 2014, design: 'RCT, double-blind, placebo-controlled' },
      { pmid: '41754112', doi: '10.3390/nu18040595', url: 'https://pubmed.ncbi.nlm.nih.gov/41754112/', title: 'The Real-World Early Neuroprotective Effects of Oral Citicoline Combination in Prodromal Dementia', year: 2026, design: 'retrospective, observational, real-world cohort study (not randomized)' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'l-theanine',
    name: 'L-Theanine',
    category: 'amino',
    mechanism: 'L-theanine is a non-protein amino acid found primarily in green tea. It crosses the blood-brain barrier and has been linked to increased alpha brain wave activity. It also modulates GABA, serotonin, and dopamine levels. Combined with caffeine, it improves attention measures more than either compound alone.',
    clinicalDose: '100–200mg/day (trials pairing it with caffeine used roughly 1:1 to 1.7:1 theanine:caffeine)',
    timeToEffect: '30–60 minutes (acute)',
    studySummary: 'A 2026 meta-analysis of 31 RCTs (n=1,168) found a single 200mg dose taken 30–60 minutes before testing improved choice reaction time; its acute stress effect was modest and driven by high-risk-of-bias studies, and anxiety effects were inconsistent. With caffeine, RCTs (Haskell et al., 2007; Kahathuduwa 2016) and an 11-RCT meta-analysis (Camfield 2014) show the combination beats either compound alone on attention and reaction time. The one alpha-wave (MEG) trial found higher alpha activity at 2 hours, and only in people with higher trait anxiety.',
    benefits: ['Faster reaction time after a single 200mg dose', 'Better attention with caffeine than caffeine alone', 'Small improvements in subjective sleep quality'],
    sideEffects: ['Extremely well tolerated — no serious adverse events across a 31-RCT meta-analysis', 'Possible mild sedation at high doses', 'Generally considered very safe'],
    productsContaining: ['mind-lab-pro-review', 'noocube-review', 'thesis-nootropics-review', 'brainzyme-focus-pro-review'],
    humanEffects: [
      { effect: 'Calm Focus (Alpha Waves)', evidenceStrength: 'preliminary', magnitude: 'small', studies: 1, notes: 'White 2016 (n=34) found higher resting alpha activity 2 hours after dosing — not at 45 minutes — and only in participants with higher trait anxiety; it did not track subjective calm or cortisol.' },
      { effect: 'Anxiety & Stress', evidenceStrength: 'mixed', magnitude: 'small', studies: 2, notes: 'The 2026 31-RCT meta-analysis found anxiety effects inconsistent and non-significant (except one 400mg/day clinical trial) and a modest acute stress effect driven by high-risk-of-bias studies; White 2016 found lower subjective stress 1 hour post-dose. Rogers 2008 found no acute anxiolytic effect at 200mg.' },
      { effect: 'Sleep Quality', evidenceStrength: 'moderate', magnitude: 'small', studies: 1, notes: 'A 2025 meta-analysis (18 studies, n=897) found small improvements in subjective sleep latency, daytime dysfunction and sleep quality. No trial has tested it combined with magnesium.' },
      { effect: 'Caffeine Synergy', evidenceStrength: 'strong', magnitude: 'large', studies: 3, notes: 'Haskell 2007, Kahathuduwa 2016 and an 11-RCT meta-analysis show the combination outperforms either compound alone on attention and reaction time; caffeine dose drove the effect more than theanine dose.' },
    ],
    howToTake: {
      dosage: '100–200mg per dose',
      timing: '30 minutes before your cognitive work session or 30 minutes before caffeine',
      withFood: 'No significant food interaction. Can be taken on an empty stomach. Absorption is reliable regardless of meal timing.',
      forms: 'Capsule or powder. Suntheanine is the most studied branded L-Theanine (from enzymatic synthesis, identical to tea-derived theanine). Bulk L-Theanine powder dissolves in water but is subtly sweet and easy to mix.',
    },
    stacksWith: [
      { ingredient: 'Caffeine', slug: 'caffeine', reason: 'The most studied nootropic stack. Trials used 200–250mg theanine with 150–160mg caffeine (roughly 1:1 to 1.7:1). The combination improved attention and reaction time more than either alone; in a controlled trial (Rogers 2008) theanine did not significantly reduce caffeine jitteriness. This pairing is found in virtually every quality pre-work stack.' },
      { ingredient: 'Bacopa Monnieri', slug: 'bacopa-monnieri', reason: 'Both have anxiolytic properties working via different mechanisms. L-Theanine provides immediate calm; Bacopa builds sustained stress tolerance over weeks. A gentle, non-sedating anxiety-reduction combination.' },
      { ingredient: 'Ashwagandha', slug: 'ashwagandha', reason: 'Both target stress through distinct pathways (GABA modulation for theanine; HPA axis for ashwagandha). Good daytime anxiety stack without sedation.' },
    ],
    faqs: [
      { question: 'What is the ideal ratio of L-Theanine to caffeine?', answer: 'No trial has established an ideal ratio. The positive combination trials used roughly 1:1 to 1.7:1 theanine to caffeine — for example 250mg theanine with 150mg caffeine (Haskell 2007) and 200mg with 160mg (Kahathuduwa 2016). A meta-analysis found the caffeine dose drove the effect more than the theanine dose.' },
      { question: 'Does L-Theanine work without caffeine?', answer: "Partly. On its own, a single 200mg dose improved choice reaction time in a 2026 meta-analysis of 31 RCTs, but anxiety effects were inconsistent and the one alpha-wave trial found an effect only in people with higher trait anxiety. It's not stimulating on its own." },
      { question: 'Is it safe to take L-Theanine every day?', answer: 'Yes. Green tea contains theanine and has been consumed daily for millennia without toxicity concerns. No tolerance develops. Chronic daily use is both safe and effective. No cycling required.' },
      { question: 'Why take a supplement when I can just drink green tea?', answer: 'A standard cup of green tea contains ~25–50mg of L-Theanine — well below the 100–200mg therapeutic dose. You would need 4–8 cups of green tea to match a single supplement dose, along with a significant caffeine load. Supplements allow precise dosing without unwanted caffeine.' },
      { question: 'Can L-Theanine help with sleep if taken at night?', answer: "Modestly. A 2025 meta-analysis (18 studies, n=897) found small improvements in subjective sleep onset latency, daytime dysfunction and overall sleep quality. It doesn't cause sedation. Combinations with magnesium are popular but have not been tested in a trial." },
    ],
    sources: [
      { pmid: '42410082', doi: '10.1038/s41380-026-03727-9', url: 'https://pubmed.ncbi.nlm.nih.gov/42410082/', title: 'Cognitive and affective effects of L-Theanine: a systematic review and meta-analysis of 31 randomized trials', year: 2026, design: 'systematic review and meta-analysis (31 RCTs)' },
      { pmid: '24946991', doi: '10.1111/nure.12120', url: 'https://pubmed.ncbi.nlm.nih.gov/24946991/', title: 'Acute effects of tea constituents L-theanine, caffeine, and epigallocatechin gallate on cognitive function and mood: a systematic review and meta-analysis', year: 2014, design: 'systematic review and meta-analysis (11 RCTs)' },
      { pmid: '18006208', doi: '10.1016/j.biopsycho.2007.09.008', url: 'https://pubmed.ncbi.nlm.nih.gov/18006208/', title: 'The effects of L-theanine, caffeine and their combination on cognition and mood', year: 2007, design: 'randomized, placebo-controlled, double-blind, balanced crossover RCT (Haskell et al.)' },
      { pmid: '26869148', doi: '10.1080/1028415X.2016.1144845', url: 'https://pubmed.ncbi.nlm.nih.gov/26869148/', title: 'Acute effects of theanine, caffeine and theanine-caffeine combination on attention', year: 2016, design: 'placebo-controlled, 5-way crossover RCT' },
      { pmid: '26797633', doi: '10.3390/nu8010053', url: 'https://pubmed.ncbi.nlm.nih.gov/26797633/', title: 'Anti-Stress, Behavioural and Magnetoencephalography Effects of an L-Theanine-Based Nutrient Drink: A Randomised, Double-Blind, Placebo-Controlled, Crossover Trial', year: 2016, design: 'double-blind, placebo-controlled, balanced crossover RCT with MEG' },
      { pmid: '40056718', doi: '10.1016/j.smrv.2025.102076', url: 'https://pubmed.ncbi.nlm.nih.gov/40056718/', title: 'The effects of L-theanine consumption on sleep outcomes: A systematic review and meta-analysis', year: 2025, design: 'systematic review and meta-analysis (19 articles, 18 in meta-analysis)' },
      { pmid: '17891480', doi: '10.1007/s00213-007-0938-1', url: 'https://pubmed.ncbi.nlm.nih.gov/17891480/', title: 'Time for tea: mood, blood pressure and cognitive performance effects of caffeine and theanine administered alone and together.', year: 2008, design: 'randomised, double-blind, placebo-controlled, single-dose, 2×2 factorial' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'rhodiola-rosea',
    name: 'Rhodiola Rosea',
    category: 'adaptogen',
    mechanism: "Rhodiola is an adaptogen that modulates the HPA (hypothalamic-pituitary-adrenal) axis, reducing cortisol output under stress. Its key bioactives (rosavins and salidroside) inhibit monoamine oxidase enzymes, increasing availability of dopamine, serotonin, and norepinephrine — neurotransmitters involved in motivation, mood, and cognitive stamina.",
    clinicalDose: '200–600mg/day (standardised to 3% rosavins, 1% salidroside)',
    timeToEffect: 'Single-dose effects in one RCT; repeated-dose trials ran 2–4 weeks',
    studySummary: 'Small SHR-5 extract trials found less mental fatigue: a 2003 RCT in 161 military cadets after a single dose, a 2000 crossover trial in 56 physicians on night duty over two weeks (Darbinyan et al.), and a 2000 pilot in students during exams. The Swedish burnout RCT (Olsson et al., 2008, n=60, 576mg/day) ran 28 days — not 12 weeks — and improved burnout and attention scores versus placebo, while depression scores improved equally in both groups. A 2012 systematic review of 11 trials rated every included study at high or unclear risk of bias and called the evidence contradictory.',
    benefits: ['Mental fatigue reduction (small, low-quality trials)', 'Burnout and attention scores in stress-related fatigue (one 28-day RCT)'],
    sideEffects: ['Generally safe; no side effects were reported in the night-duty physician trial', 'Mild activation/restlessness initially', 'MAO inhibitors and antidepressants: theoretical interaction based on laboratory MAO inhibition, no clinical reports found — ask your doctor before combining', 'Avoid late evening dosing'],
    productsContaining: ['mind-lab-pro-review', 'qualia-mind-review'],
    humanEffects: [
      { effect: 'Mental Fatigue Reduction', evidenceStrength: 'mixed', magnitude: 'moderate', studies: 4, notes: 'Positive single-dose (cadets), two-week (night-duty physicians) and 20-day (students) trials, but the 2012 systematic review found only 3 of 5 mental-fatigue trials positive, all at high or unclear risk of bias.' },
      { effect: 'Stress Resilience', evidenceStrength: 'preliminary', magnitude: 'small', studies: 2, notes: 'Olsson 2008 found a different cortisol awakening response versus placebo over 28 days; the underlying trials are small and methodologically limited.' },
      { effect: 'Physical Endurance', evidenceStrength: 'mixed', magnitude: 'small', studies: 2, notes: 'Only 2 of 6 physical-fatigue trials in the 2012 systematic review reported a benefit; one 20-day student pilot improved physical fitness.' },
      { effect: 'Mood', evidenceStrength: 'mixed', magnitude: 'negligible', studies: 1, notes: 'In the Swedish burnout RCT (Olsson 2008), depression scores improved within both the Rhodiola and placebo groups — the authors attributed this to a placebo effect, with no significant difference between groups.' },
    ],
    howToTake: {
      dosage: '200–600mg/day (standardised to 3% rosavins, 1% salidroside). Several positive trials used doses at or below 200mg/day that the systematic review flagged as possibly suboptimal; dose-response data is thin',
      timing: 'Morning, on an empty stomach — 30 minutes before breakfast. Rhodiola is mildly stimulating; evening doses commonly cause insomnia.',
      withFood: 'Take on an empty stomach for best absorption. The 30-minute pre-meal window is consistent across most clinical protocols. A small amount of food is fine but a full meal reduces absorption.',
      cycling: 'Optional. The trials lasted from a single dose to 4 weeks, so there is no data on months of continuous use; some people cycle 4–6 weeks on, 1–2 weeks off as a precaution.',
      forms: 'Capsule. Always verify standardisation: 3% rosavins and 1% salidroside is the established ratio used in most clinical trials. Products without stated standardisation may be significantly under-dosed on active compounds.',
    },
    stacksWith: [
      { ingredient: 'Ashwagandha', slug: 'ashwagandha', reason: 'The classic adaptogen stack. Rhodiola is activating (raises norepinephrine, best morning); Ashwagandha is calming (lowers cortisol, best evening). Together they provide full-day HPA axis support without one cancelling the other out.' },
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'Rhodiola\'s activating effect pairs well with L-Theanine\'s calming effect. Use Rhodiola for cognitive stamina; L-Theanine to soften any agitation or restlessness Rhodiola can cause initially.' },
      { ingredient: 'L-Tyrosine', slug: 'l-tyrosine', reason: 'Both target performance under stress via different mechanisms. Rhodiola modulates cortisol/monoamine levels; Tyrosine replenishes catecholamine substrate. Strong combination for high-demand cognitive days or night shifts.' },
    ],
    faqs: [
      { question: 'Does Rhodiola need to be cycled?', answer: 'Not on current evidence. The clinical trials ran from a single dose up to 4 weeks, so they neither tested cycling nor months of continuous use. Some people take a 1–2 week break every 4–6 weeks as a precaution against a possible "ceiling effect".' },
      { question: 'What does 3% rosavins / 1% salidroside mean?', answer: "These are the two main bioactive compound classes in Rhodiola. The 3:1 ratio mirrors what is found in wild-harvested Rhodiola rosea and was established in Soviet-era research as the optimal therapeutic ratio. Products standardised only to salidroside may use Rhodiola crenulata (Chinese rhodiola) which has a different and less-studied compound profile." },
      { question: 'Can Rhodiola cause anxiety or jitteriness?', answer: 'In a minority of people, especially at doses above 400mg, Rhodiola can cause a stimulant-like restlessness or mild anxiety — particularly in the first week. Start at 200mg and increase gradually. Some people pair it with L-Theanine to soften this, though that combination has not been tested in a trial.' },
      { question: 'Is Rhodiola safe to take with antidepressants?', answer: 'Not without medical supervision. Rhodiola compounds inhibit monoamine oxidase in laboratory studies, so an interaction with SSRIs, MAOIs and other antidepressants (including serotonin syndrome) is theoretically possible — no clinical reports were found in our 2026 PubMed review. Always consult your doctor if you are on any psychiatric medication.' },
    ],
    sources: [
      { pmid: '22643043', doi: '10.1186/1472-6882-12-70', url: 'https://pubmed.ncbi.nlm.nih.gov/22643043/', title: 'Rhodiola rosea for physical and mental fatigue: a systematic review.', year: 2012, design: 'systematic review' },
      { pmid: '12725561', doi: '10.1078/094471103321659780', url: 'https://pubmed.ncbi.nlm.nih.gov/12725561/', title: 'A randomized trial of two different doses of a SHR-5 Rhodiola rosea extract versus placebo and control of capacity for mental work.', year: 2003, design: 'rct' },
      { pmid: '11081987', doi: '10.1016/S0944-7113(00)80055-0', url: 'https://pubmed.ncbi.nlm.nih.gov/11081987/', title: 'Rhodiola rosea in stress induced fatigue — a double blind cross-over study of a standardized extract SHR-5 with a repeated low-dose regimen on the mental performance of healthy physicians during night duty.', year: 2000, design: 'rct' },
      { pmid: '19016404', doi: '10.1055/s-0028-1088346', url: 'https://pubmed.ncbi.nlm.nih.gov/19016404/', title: 'A randomised, double-blind, placebo-controlled, parallel-group study of the standardised extract SHR-5 of the roots of Rhodiola rosea in the treatment of subjects with stress-related fatigue.', year: 2008, design: 'rct' },
      { pmid: '10839209', doi: '10.1016/S0944-7113(00)80078-1', url: 'https://pubmed.ncbi.nlm.nih.gov/10839209/', title: 'A double-blind, placebo-controlled pilot study of the stimulating and adaptogenic effect of Rhodiola rosea SHR-5 extract on the fatigue of students caused by stress during an examination period with a repeated low-dose regimen.', year: 2000, design: 'rct' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'phosphatidylserine',
    name: 'Phosphatidylserine',
    category: 'cholinergic',
    mechanism: 'Phosphatidylserine (PS) is a phospholipid that forms a critical component of neuronal cell membranes. It supports signal transduction across synapses, facilitates acetylcholine and dopamine release, and modulates cortisol secretion. Supplementation replenishes PS levels that decline naturally with age.',
    clinicalDose: '100–300mg/day (benefit shown mainly in older adults with memory complaints or MCI)',
    timeToEffect: 'Memory trials ran 15 weeks to 12 months; no trial established an earlier onset',
    studySummary: "RCTs in older adults with memory complaints or mild cognitive impairment report memory benefits, though often only in subgroups: soy PS at 100–300mg/day for 6 months helped only participants with low baseline scores (Kato-Kataoka 2010), and marine PS-DHA at 300mg/day improved immediate verbal recall in an exploratory 15-week trial (Vakhapova 2010). A 2026 network meta-analysis in MCI/Alzheimer's found PS 100mg improved MMSE but not the stricter ADAS-Cog scale. In healthy children, a 12-week RCT of 100mg sunflower PS found no effect on primary or secondary outcomes (Friling 2025; authors include staff of IFF, the product's manufacturer). A positive 2024 MCI trial (Duan 2024; BYHEALTH co-authors) gave only 31.5mg PS inside a multi-ingredient formula. The FDA's qualified health claim for dementia risk must be labelled as based on 'very limited and preliminary' research.",
    benefits: ['Memory recall in older adults with memory complaints (often subgroup-only)', 'MMSE scores in MCI/Alzheimer\'s (network meta-analysis)', 'Cortisol reduction under stress (not re-verified in our 2026 review)'],
    sideEffects: ['Well tolerated — no safety differences versus placebo over 15 weeks at 300mg/day', 'Mild GI discomfort in some users', 'Open-label 100mg/day extension: small drop in resting diastolic blood pressure and slight weight gain'],
    productsContaining: ['mind-lab-pro-review', 'qualia-mind-review', 'performance-lab-mind-review', 'hunter-focus-review', 'fancl-brains-review', 'blackmores-brain-active-review'],
    humanEffects: [
      { effect: 'Memory Recall', evidenceStrength: 'strong', magnitude: 'moderate', studies: 4, notes: 'Consistent in older or cognitively impaired adults, but frequently confined to subgroups (low or high baseline performers). A 12-week RCT in healthy children at 100mg/day found no effect (Friling 2025).' },
      { effect: 'Cortisol Reduction', evidenceStrength: 'moderate', magnitude: 'moderate', notes: 'Reported blunting of the cortisol response to exercise and psychological stress; not re-verified in our 2026 review, and no trial established an onset timeline.' },
      { effect: 'Processing Speed', evidenceStrength: 'moderate', magnitude: 'small', notes: 'Reported improvements in reaction time, especially in older adults; not re-verified in our 2026 review.' },
      { effect: 'Age-Related Cognitive Decline', evidenceStrength: 'moderate', magnitude: 'small', studies: 1, notes: 'A 2026 network meta-analysis (29 RCTs, MCI/Alzheimer\'s) found PS 100mg improved MMSE but not ADAS-Cog. The FDA claim is qualified: labels must say "very limited and preliminary scientific research suggests".' },
    ],
    howToTake: {
      dosage: '100–300mg/day — benefit is most consistent in older adults and MCI, and in subgroup analyses; a 100mg/day trial in healthy children was null',
      timing: 'With meals — split doses across 2–3 meals for best results (e.g. 100mg with breakfast, 100mg with lunch)',
      withFood: 'PS is a fat-soluble phospholipid and absorbs best with dietary fat. Always take with food. Splitting doses across meals is better than a single large dose.',
      forms: 'Capsule (softgel preferred). There are three source types: (1) Soy-derived — most common, cheapest, effective but contains soy; (2) Sunflower-derived — soy-free, preferred option; (3) Bovine-brain-derived — used in original 1990s trials, no longer commercially available due to BSE concerns. Sharp-PS from sunflower is the benchmark form.',
    },
    stacksWith: [
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: 'PS maintains cell membrane integrity while Lion\'s Mane drives NGF synthesis. Both support long-term brain health via complementary structural and growth-factor pathways.' },
      { ingredient: 'Citicoline', slug: 'citicoline', reason: 'Both are membrane phospholipid precursors, but they work on different pathways. Citicoline primarily builds phosphatidylcholine; PS addresses phosphatidylserine. Together they provide comprehensive neuronal membrane support.' },
      { ingredient: 'Omega-3 (DHA)', slug: 'dha-omega-3', reason: 'DHA is a structural component of neuronal membranes. Some clinical PS products are DHA-conjugated (PS-DHA): a 15-week trial of marine PS-DHA at 300mg/day improved immediate verbal recall in older adults with memory complaints.' },
    ],
    faqs: [
      { question: 'Soy-derived vs sunflower PS — which is better?', answer: 'Both are used in trials: soy PS in older adults with memory complaints (Kato-Kataoka 2010) and sunflower PS in healthy children, where it had no effect (Friling 2025). Sunflower-derived PS is soy-free and is the preferred option for anyone with soy sensitivity. No head-to-head comparison of the two was part of our 2026 review.' },
      { question: 'What is the FDA health claim for PS?', answer: "The FDA allows a qualified health claim that phosphatidylserine may reduce the risk of dementia and cognitive dysfunction in the elderly. It is qualified — not a full health claim — because the FDA judged the evidence insufficient: labels must state that 'very limited and preliminary scientific research suggests' the benefit." },
      { question: 'What about the bovine brain source I see mentioned in older studies?', answer: 'Original 1990s PS trials used bovine-cortex-derived PS. This source was discontinued globally after BSE (mad cow disease) concerns. All current commercial PS is plant- or marine-derived. The later plant- and marine-PS trials show memory benefits mainly in subgroups of older adults, so the older bovine results should not be assumed to transfer.' },
      { question: 'Does PS interact with blood thinners?', answer: 'No clinical interaction between PS and anticoagulants was found in our 2026 PubMed review, and the main PS safety trial did not collect bleeding data. If you are on warfarin, aspirin, or other anticoagulants, consult your doctor before adding any supplement.' },
    ],
    sources: [
      { pmid: '21103034', doi: '10.3164/jcbn.10-62', url: 'https://pubmed.ncbi.nlm.nih.gov/21103034/', title: 'Soybean-derived phosphatidylserine improves memory function of the elderly Japanese subjects with memory complaints.', year: 2010, design: 'RCT, double-blind, randomized, placebo-controlled' },
      { pmid: '20523044', doi: '10.1159/000310330', url: 'https://pubmed.ncbi.nlm.nih.gov/20523044/', title: 'Phosphatidylserine containing omega-3 fatty acids may improve memory abilities in non-demented elderly with memory complaints: a double-blind placebo-controlled trial.', year: 2010, design: 'RCT, double-blind, placebo-controlled' },
      { pmid: '21711517', doi: '10.1186/1471-2377-11-79', url: 'https://pubmed.ncbi.nlm.nih.gov/21711517/', title: 'Safety of phosphatidylserine containing omega-3 fatty acids in non-demented elderly: a double-blind placebo-controlled trial followed by an open-label extension.', year: 2011, design: 'RCT safety follow-up + open-label extension' },
      { pmid: '39317299', doi: '10.1016/j.jad.2024.09.131', url: 'https://pubmed.ncbi.nlm.nih.gov/39317299/', title: 'Effects of a food supplement containing phosphatidylserine on cognitive function in Chinese older adults with mild cognitive impairment: A randomized double-blind, placebo-controlled trial.', year: 2024, design: 'RCT, double-blind, placebo-controlled' },
      { pmid: '41318468', doi: '10.1186/s12937-025-01264-9', url: 'https://pubmed.ncbi.nlm.nih.gov/41318468/', title: 'The cognitive effects of supplementation with sunflower phosphatidyl serine in healthy children aged 8 to 12 years: a randomized controlled trial.', year: 2025, design: 'RCT, randomized, placebo-controlled' },
      { pmid: '42494057', doi: '10.1080/1028415X.2026.2703619', url: 'https://pubmed.ncbi.nlm.nih.gov/42494057/', title: 'The impact of supplements on cognitive function for Alzheimer\'s disease or mild cognitive impairment: a systematic review and network meta-analysis.', year: 2026, design: 'Systematic review and network meta-analysis' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'alpha-gpc',
    name: 'Alpha-GPC',
    category: 'cholinergic',
    mechanism: 'Alpha-GPC (alpha-glycerylphosphorylcholine) is the most bioavailable choline precursor. It delivers choline directly across the blood-brain barrier, where it is used to synthesise acetylcholine. It also supports cell membrane phospholipid synthesis. It is often marketed for growth hormone release, but a 2024 RCT at 630mg found no growth hormone difference versus placebo.',
    clinicalDose: '300–600mg/day (the positive Alzheimer\'s trial used 1200mg/day)',
    timeToEffect: 'Acute effects at 60 minutes in one RCT; the Alzheimer\'s trial measured benefit at 90 and 180 days',
    studySummary: "A multicenter RCT in mild-to-moderate Alzheimer's dementia (De Jesus Moreno, 2003, n=261) found 1200mg/day improved ADAS-Cog, MMSE and global scores versus placebo at 90 and 180 days, and a 2023 meta-analysis supports benefit in cerebrovascular cognitive impairment. In healthy men, a single 315–630mg dose improved Stroop performance but not N-Back or Flanker (Kerksick 2024). Sports trials are inconsistent: a lower-body force gain after 6 days at 600mg (Bellar 2015), no strength effect at 250–500mg for 7 days, and no power-output effect after a single 630mg dose.",
    benefits: ['Cognition in Alzheimer\'s and cerebrovascular dementia (1200mg/day)', 'Acute Stroop (executive) performance in healthy men', 'Raises plasma choline'],
    sideEffects: ['Well tolerated', 'Headache if combined with other cholinergics', '500mg/day significantly suppressed serum TSH (thyroid-stimulating hormone) in a 7-day trial'],
    productsContaining: ['noocube-review', 'qualia-mind-review', 'onnit-alpha-brain-review', 'thesis-nootropics-review'],
    humanEffects: [
      { effect: 'Acetylcholine Synthesis', evidenceStrength: 'strong', magnitude: 'large', studies: 2, notes: 'Plasma choline rose faster and higher than with citicoline in a 1992 study — but that used intramuscular injection, so oral onset is not directly measured. A 2024 RCT found cognitive effects 60 minutes after an oral dose.' },
      { effect: 'Memory & Cognition', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 2, notes: 'Strong evidence only in Alzheimer\'s patients at 1200mg/day. In healthy men at 630mg, Stroop improved but N-Back (working memory) and Flanker did not.' },
      { effect: 'Athletic Power Output', evidenceStrength: 'mixed', magnitude: 'small', studies: 3, notes: 'Lower-body force gain after 6 days at 600mg; no strength effect at 250–500mg over 7 days (only a jump-velocity effect at 250mg); no power-output effect after a single 630mg pre-exercise dose.' },
      { effect: 'Neuroprotection', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 2, notes: 'Cognitive and functional benefit in Alzheimer\'s and cerebrovascular dementia populations; not tested for healthy brain ageing.' },
    ],
    howToTake: {
      dosage: '300–600mg/day — matches the healthy-adult and sports trials; the strongest (Alzheimer\'s) evidence used 1200mg/day',
      timing: 'Morning or 30–60 minutes before a demanding cognitive task or workout',
      withFood: 'Can be taken with or without food. Slightly better absorbed with a small meal. Do not take late in the day — the acetylcholine activation can interfere with sleep.',
      forms: 'Capsule (common), powder. Alpha-GPC is hygroscopic (absorbs moisture from air) — powder can become sticky; capsule form is more practical. 50% and 85% concentration forms exist; the 50% form (more common) doubles the serving size but is equivalent in active dose.',
    },
    stacksWith: [
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: 'Alpha-GPC provides immediate acetylcholine support; Lion\'s Mane drives long-term NGF synthesis. Neither overlaps mechanistically — a clean acute + long-term pairing.' },
      { ingredient: 'Bacopa Monnieri', slug: 'bacopa-monnieri', reason: 'Alpha-GPC handles acute memory encoding via acetylcholine; Bacopa handles memory consolidation and storage. Together they cover both encoding and consolidation stages of memory formation.' },
      { ingredient: 'Huperzine A', slug: 'huperzine-a', reason: 'Huperzine A prevents acetylcholine breakdown while Alpha-GPC increases acetylcholine synthesis. Powerful combination in theory — but use with caution and low doses, as cholinergic overload (nausea, headache, muscle cramps) is a real risk. Not recommended without experience.' },
    ],
    faqs: [
      { question: 'Alpha-GPC vs Citicoline — which is better for focus?', answer: "Both are excellent. Alpha-GPC has a slight edge for acute cholinergic effects and is preferred for workout performance. Citicoline also provides cytidine (uridine precursor), giving it a broader neuroprotective profile. For pure focus and acetylcholine, Alpha-GPC wins slightly; for comprehensive brain health support, Citicoline is more complete. Don't stack them together — you'll get too much choline activity." },
      { question: 'Is it safe to combine Alpha-GPC with Huperzine A?', answer: 'Use caution. Both increase acetylcholine (Alpha-GPC via synthesis, Huperzine A via inhibiting breakdown). The combination is potent and can cause cholinergic overstimulation — symptoms include nausea, headache, excessive salivation, and muscle cramps. If combining, use lower doses of each (e.g. 200mg Alpha-GPC + 50mcg Huperzine A) and do not take daily.' },
      { question: 'Why does Alpha-GPC powder go sticky?', answer: "Alpha-GPC is highly hygroscopic — it absorbs water from the air quickly. This is normal and doesn't affect potency. Store in an airtight container in a cool, dry place. Capsule form avoids this problem entirely." },
      { question: 'Is there a cardiovascular risk with Alpha-GPC?', answer: 'Unresolved. The CARDIA cohort study (published 2024) linked higher plasma choline — not alpha-GPC supplements — with incident cardiovascular disease, while a meta-analysis of dietary choline intake found no association. No study has tested alpha-GPC supplementation directly for cardiovascular outcomes. If you have cardiovascular disease, discuss it with your doctor.' },
    ],
    sources: [
      { pmid: '36683513', doi: '10.3233/JAD-221189', url: 'https://pubmed.ncbi.nlm.nih.gov/36683513/', title: 'Activity of Choline Alphoscerate on Adult-Onset Cognitive Dysfunctions: A Systematic Review and Meta-Analysis', year: 2023, design: 'systematic review / meta-analysis' },
      { pmid: '12637119', doi: '10.1016/s0149-2918(03)90023-3', url: 'https://pubmed.ncbi.nlm.nih.gov/12637119/', title: 'Cognitive improvement in mild to moderate Alzheimer\'s dementia after treatment with the acetylcholine precursor choline alfoscerate (De Jesus Moreno, 2003)', year: 2003, design: 'RCT, multicenter, double-blind, placebo-controlled' },
      { pmid: '39683633', doi: '10.3390/nu16234240', url: 'https://pubmed.ncbi.nlm.nih.gov/39683633/', title: 'Acute Alpha-Glycerylphosphorylcholine Supplementation Enhances Cognitive Performance in Healthy Men', year: 2024, design: 'RCT, randomized, double-blind, placebo-controlled, crossover' },
      { pmid: '26582972', doi: '10.1186/s12970-015-0103-x', url: 'https://pubmed.ncbi.nlm.nih.gov/26582972/', title: 'The effect of 6 days of alpha glycerylphosphorylcholine on isometric strength (Bellar et al., 2015)', year: 2015, design: 'RCT, double-blind, placebo-controlled, crossover' },
      { pmid: '29042830', doi: '10.1186/s12970-017-0196-5', url: 'https://pubmed.ncbi.nlm.nih.gov/29042830/', title: 'Evaluation of the effects of two doses of alpha glycerylphosphorylcholine on physical and psychomotor performance', year: 2017, design: 'RCT, randomized, double-blind, placebo- and caffeine-controlled' },
      { pmid: '1428296', url: 'https://pubmed.ncbi.nlm.nih.gov/1428296/', title: 'A comparative study of free plasma choline levels following intramuscular administration of L-alpha-glycerylphosphorylcholine and citicoline in normal volunteers', year: 1992, design: 'RCT, crossover, pharmacokinetic comparison' },
      { pmid: '37865185', url: 'https://pubmed.ncbi.nlm.nih.gov/37865185/', title: 'Choline metabolites and incident cardiovascular disease in a prospective cohort of adults: Coronary Artery Risk Development in Young Adults (CARDIA) Study.', year: 2024 },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'ashwagandha',
    name: 'Ashwagandha (KSM-66)',
    category: 'adaptogen',
    mechanism: 'Ashwagandha (Withania somnifera) is an Ayurvedic adaptogen. Its withanolides modulate the HPA axis to reduce cortisol, while also inhibiting acetylcholinesterase (preserving acetylcholine) and promoting GABA receptor activity for anxiolytic effects. KSM-66 is the most studied full-spectrum root extract.',
    clinicalDose: '300–600mg/day (KSM-66 extract)',
    timeToEffect: 'Stress and cortisol effects measured at 60 days; memory effects at 8 weeks (MCI trial)',
    studySummary: "A 2012 RCT in chronically stressed adults (Chandrasekhar et al., KSM-66 600mg/day, 60 days; extract supplied by its maker Ixoreal Biomed) found serum cortisol fell 27.9% versus 7.9% on placebo and perceived stress fell 44%. A 2024 meta-analysis of 9 RCTs confirmed significant reductions in perceived stress, anxiety and cortisol, though a 2019 crossover trial of a low-dose extract in older overweight men found no cortisol effect. A 2017 RCT (Choudhary et al., 300mg twice daily, 8 weeks) improved memory and executive function — in adults with mild cognitive impairment, not healthy adults. Liver-injury case reports exist, and Denmark banned ashwagandha supplements in 2023.",
    benefits: ['Cortisol reduction', 'Lower perceived stress and anxiety', 'Memory in mild cognitive impairment (one 8-week RCT)', 'Sleep quality', 'Muscle strength and recovery'],
    sideEffects: ['Generally well tolerated in 8–12 week trials', 'GI upset in some users', 'Liver injury: published case reports and case series, including cases scored "probable" on the RUCAM causality scale that resolved after stopping — stop and see a doctor if you notice jaundice or dark urine', 'Denmark banned ashwagandha food supplements in 2023 because a safe dose could not be established', 'Contraindicated in thyroid conditions', 'Avoid during pregnancy'],
    productsContaining: ['thesis-nootropics-review', 'hunter-focus-review'],
    humanEffects: [
      { effect: 'Cortisol Reduction', evidenceStrength: 'strong', magnitude: 'large', studies: 3, notes: '27.9% vs 7.9% serum cortisol drop at 600mg/day (Chandrasekhar 2012) and a significant pooled effect in a 9-RCT meta-analysis; a low-dose crossover trial in older overweight men found no cortisol change, so the effect is dose- and population-dependent.' },
      { effect: 'Anxiety & Stress', evidenceStrength: 'strong', magnitude: 'large', studies: 2, notes: 'Perceived stress fell 44% vs 5.5% (Chandrasekhar 2012); the 2024 9-RCT meta-analysis found significant reductions on the Perceived Stress and Hamilton Anxiety scales.' },
      { effect: 'Sleep Quality', evidenceStrength: 'moderate', magnitude: 'moderate', notes: 'A 90-day RCT (Gopukumar 2021) reported improved sleep-quality (PSQI) scores; sleep is usually a secondary endpoint.' },
      { effect: 'Memory (Mild Cognitive Impairment)', evidenceStrength: 'preliminary', magnitude: 'moderate', studies: 1, notes: 'Choudhary 2017 (n=50, 8 weeks) enrolled adults with mild cognitive impairment; its memory and executive-function gains should not be read as a healthy-adult result.' },
    ],
    howToTake: {
      dosage: '300–600mg/day (KSM-66)',
      timing: 'Evening (1–2 hours before bed) for sleep benefits. Morning for cortisol and stress management. Split dosing (300mg AM + 300mg PM) is used in the most comprehensive trials.',
      withFood: 'Take with food to minimise GI upset (particularly with 600mg doses). Absorption is not significantly affected by food.',
      forms: 'Capsule. Insist on KSM-66 (full-spectrum root extract, 5% withanolides) or Sensoril (leaf + root, 8% withanolides, lower dose needed). Avoid unstandardised ashwagandha with no withanolide percentage stated — active content may be negligible.',
    },
    stacksWith: [
      { ingredient: 'Rhodiola Rosea', slug: 'rhodiola-rosea', reason: 'The canonical adaptogen duo. Rhodiola is activating (morning); Ashwagandha is calming (evening). Both target HPA axis dysregulation but through different mechanisms and at different times of day — a perfect day/night pair.' },
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'Both reduce anxiety through distinct mechanisms (HPA axis modulation vs. GABA modulation). L-Theanine provides immediate calm; Ashwagandha provides systemic, longer-term stress reduction. Together they work at multiple timescales.' },
      { ingredient: 'Phosphatidylserine', slug: 'phosphatidylserine', reason: 'Both independently reduce cortisol via different pathways (HPA modulation vs. cortisol receptor sensitivity). The combination may provide additive cortisol reduction under high-stress conditions.' },
    ],
    faqs: [
      { question: 'KSM-66 vs Sensoril vs generic ashwagandha — which should I choose?', answer: 'KSM-66 (5% withanolides from root only) is the extract used in the key stress and cognition trials. Sensoril (8% withanolides from root + leaf, lower dose needed at 125–250mg) has good evidence specifically for stress and sleep. Generic ashwagandha without a stated withanolide percentage is unreliable — you may be paying for starchy root powder with minimal active content. Choose KSM-66 or Sensoril.' },
      { question: 'Will ashwagandha make me tired during the day?', answer: "No — at morning doses, most people experience calm focus, not sedation. The tiredness effect is most pronounced when taken at night, where it reduces sleep latency. Ashwagandha doesn't deplete energy; it reduces the cortisol-driven hyperarousal that causes fatigue. Some people find 600mg in the morning slightly sedating — if so, reduce to 300mg or shift to evening only." },
      { question: 'Is ashwagandha safe for long-term use?', answer: 'Long-term data is missing: most trials run 8–12 weeks, and no controlled safety data beyond about 90 days was found. Published case reports link ashwagandha to liver injury (some scored "probable" on the RUCAM causality scale), and Denmark banned ashwagandha food supplements in 2023 because a safe dose could not be established. Stop and see a doctor if you develop jaundice or dark urine. Avoid if you have thyroid conditions (autoimmune thyroid disease) as withanolides can modulate thyroid hormone levels.' },
      { question: 'Can ashwagandha increase testosterone?', answer: 'Two RCTs found increases: 600mg/day for 8 weeks in young men starting resistance training raised testosterone alongside greater strength gains (2015), and a crossover trial in overweight men aged 40–70 found testosterone +14.7% and DHEA-S +18% versus placebo — but no change in cortisol, fatigue or vigour (Lopresti 2019). The magnitude varies by population and extract.' },
    ],
    sources: [
      { pmid: '23439798', doi: '10.4103/0253-7176.106022', url: 'https://pubmed.ncbi.nlm.nih.gov/23439798/', title: 'A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults.', year: 2012, design: 'rct' },
      { pmid: '39348746', doi: '10.1016/j.explore.2024.103062', url: 'https://pubmed.ncbi.nlm.nih.gov/39348746/', title: 'Effects of Ashwagandha (Withania Somnifera) on stress and anxiety: A systematic review and meta-analysis.', year: 2024, design: 'meta-analysis' },
      { pmid: '28471731', doi: '10.1080/19390211.2017.1284970', url: 'https://pubmed.ncbi.nlm.nih.gov/28471731/', title: 'Efficacy and Safety of Ashwagandha (Withania somnifera (L.) Dunal) Root Extract in Improving Memory and Cognitive Functions.', year: 2017, design: 'rct' },
      { pmid: '26609282', doi: '10.1186/s12970-015-0104-9', url: 'https://pubmed.ncbi.nlm.nih.gov/26609282/', title: 'Examining the effect of Withania somnifera supplementation on muscle strength and recovery: a randomized controlled trial.', year: 2015, design: 'rct' },
      { pmid: '30854916', doi: '10.1177/1557988319835985', url: 'https://pubmed.ncbi.nlm.nih.gov/30854916/', title: 'A Randomized, Double-Blind, Placebo-Controlled, Crossover Study Examining the Hormonal and Vitality Effects of Ashwagandha in Aging, Overweight Males.', year: 2019, design: 'rct' },
      { pmid: '37631044', doi: '10.3390/ph16081129', url: 'https://pubmed.ncbi.nlm.nih.gov/37631044/', title: 'Herb-Induced Liver Injury by Ayurvedic Ashwagandha as Assessed for Causality by the Updated RUCAM: An Emerging Cause.', year: 2023, design: 'case report' },
      { pmid: '36900932', url: 'https://pubmed.ncbi.nlm.nih.gov/36900932/', title: 'Liver Dangers of Herbal Products: A Case Report of Ashwagandha-Induced Liver Injury.', year: 2023 },
      { pmid: '38969606', url: 'https://pubmed.ncbi.nlm.nih.gov/38969606/', title: 'Danish ban on Ashwagandha: Truth, evidence, ethics, and regulations.', year: 2024 },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'huperzine-a',
    name: 'Huperzine A',
    category: 'herb',
    mechanism: 'Huperzine A is extracted from Huperzia serrata (Chinese club moss). It is a potent, reversible acetylcholinesterase inhibitor — meaning it blocks the enzyme that breaks down acetylcholine, effectively increasing acetylcholine levels throughout the brain. This makes it one of the most powerful natural cholinergic compounds.',
    clinicalDose: '100–200mcg/day in the trials (micrograms, not milligrams; 50mcg consumer doses were not tested separately)',
    timeToEffect: 'Trials measured effects after 4–16 weeks of daily dosing; no acute-onset trial was found',
    studySummary: 'Chinese RCTs show Huperzine A improved memory and learning in Alzheimer\'s patients (Xu et al., 1995: 58% vs 36% improved at 200mcg/day over 8 weeks) and in adolescent students (Sun et al., 1999: 100mcg/day for 4 weeks). A 2013 meta-analysis of 20 RCTs found significant benefits in Alzheimer\'s disease, but rated most trials at high risk of bias; the 2008 Cochrane review concluded the evidence is inadequate to recommend it, and a 2012 Cochrane review found no eligible trials in mild cognitive impairment. A 2019 RCT after traumatic brain injury found no memory benefit over placebo.',
    benefits: ['Acetylcholine preservation (established mechanism)', 'Cognition and daily function in Alzheimer\'s disease (low-quality trials)', 'Memory and learning in one student RCT'],
    sideEffects: ['Adverse events in Alzheimer\'s trials were mild and not significantly different from placebo (2008 Cochrane review)', 'Overdose risk with other cholinergics', 'GI discomfort at high doses', 'Not suitable for people on cholinesterase inhibitor drugs'],
    productsContaining: ['noocube-review', 'qualia-mind-review'],
    humanEffects: [
      { effect: 'Memory Recall', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 4, notes: 'Positive pooled effect in Alzheimer\'s patients (20-RCT meta-analysis) and one student RCT, but both meta-analyses flag high risk of bias, there are no eligible MCI trials, and a 2019 TBI trial found no benefit over placebo.' },
      { effect: 'Acetylcholine Preservation', evidenceStrength: 'strong', magnitude: 'large', studies: 2, notes: 'Reversible acetylcholinesterase inhibition is a pharmacologically established mechanism, described consistently across the reviews.' },
      { effect: 'Learning Speed', evidenceStrength: 'preliminary', magnitude: 'moderate', studies: 1, notes: 'One small matched-pair RCT in 68 adolescent students (Sun 1999, 100mcg/day for 4 weeks) found higher memory quotients and lesson scores.' },
      { effect: 'Alzheimer\'s Symptom Reduction', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 3, notes: 'Consistent positive direction (Xu 1995 and two meta-analyses), but the Cochrane authors judged the trials too small and low-quality for a firm recommendation.' },
    ],
    howToTake: {
      dosage: '100–200mcg/day (micrograms — doses are small); 50mcg consumer doses were not tested separately in the trials',
      timing: 'Morning. Avoid evening — the cholinergic activation interferes with sleep.',
      withFood: 'Can be taken with or without food. No significant absorption difference. At higher doses (150–200mcg), taking with food reduces GI sensitivity.',
      cycling: 'Not validated. No human trial has tested a cycling schedule — the trials used continuous daily dosing for 4–16 weeks. Some users take regular breaks as a precaution against cholinergic side effects.',
      forms: 'Capsule only — doses are in micrograms, making accurate powder measurement practically impossible without a milligram-precision scale. Always confirm whether the label states mcg (micrograms) not mg (milligrams) — a 100x error in dosing is dangerous.',
    },
    stacksWith: [
      { ingredient: 'Bacopa Monnieri', slug: 'bacopa-monnieri', reason: 'Bacopa works via synaptic density (non-cholinergic mechanism); Huperzine A works via acetylcholine preservation. No mechanism overlap. A powerful memory stack where both sides work independently.' },
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: 'Lion\'s Mane supports long-term neurogenesis via NGF; Huperzine A supports acetylcholine by slowing its breakdown. Different mechanisms with no conflict.' },
    ],
    faqs: [
      { question: 'Does Huperzine A need to be cycled?', answer: "There is no trial evidence either way. The clinical trials gave it daily for 4–16 weeks, and the 2008 Cochrane review found adverse events were mild and no more common than on placebo. No human trial has tested a cycling schedule. Cholinergic side effects — nausea, sweating, excessive salivation, muscle twitching — are the thing to watch for; stop or reduce the dose if they appear." },
      { question: 'Is 100mcg the same as 100mg? The label looks confusing.', answer: 'No — mcg (micrograms) and mg (milligrams) are different by a factor of 1000. Huperzine A is dosed in micrograms (mcg). A 200mcg dose is 0.2mg. This is correct and intentional — Huperzine A is extremely potent. If a product claims a dose in milligrams (e.g. "100mg"), read the label carefully — it likely means 100mcg (0.1mg). A true 100mg dose of Huperzine A would be catastrophically overdosed.' },
      { question: 'Can I take Huperzine A with Alpha-GPC?', answer: 'Technically yes, but with significant caution. Alpha-GPC increases acetylcholine synthesis; Huperzine A prevents its breakdown. The combination can easily cause cholinergic overload, and no trial has tested it. If combining, use low doses of each and start with one at a time before combining. Watch carefully for early overload symptoms: nausea, headache, excessive salivation.' },
      { question: 'Is Huperzine A safe for young healthy adults?', answer: "Huperzine A's research base is mostly in Alzheimer's patients; the only healthy-population RCT found was a 4-week study in 68 adolescent students at 100mcg/day. The key risks in healthy users are dosing errors (confusing mcg and mg) and combining with other cholinergics. Long-term safety in healthy adults has not been studied." },
    ],
    sources: [
      { pmid: '24086396', doi: '10.1371/journal.pone.0074916', url: 'https://pubmed.ncbi.nlm.nih.gov/24086396/', title: 'Huperzine A for Alzheimer\'s disease: a systematic review and meta-analysis of randomized clinical trials', year: 2013, design: 'systematic review / meta-analysis' },
      { pmid: '18425924', doi: '10.1002/14651858.CD005592.pub2', url: 'https://pubmed.ncbi.nlm.nih.gov/18425924/', title: 'Huperzine A for Alzheimer\'s disease', year: 2008, design: 'systematic review / meta-analysis (Cochrane)' },
      { pmid: '23235666', doi: '10.1002/14651858.CD008827.pub2', url: 'https://pubmed.ncbi.nlm.nih.gov/23235666/', title: 'Huperzine A for mild cognitive impairment', year: 2012, design: 'systematic review (Cochrane)' },
      { pmid: '10678121', url: 'https://pubmed.ncbi.nlm.nih.gov/10678121/', title: 'Huperzine-A capsules enhance memory and learning performance in 34 pairs of matched adolescent students', year: 1999, design: 'RCT, double-blind, matched-pair' },
      { pmid: '8701750', url: 'https://pubmed.ncbi.nlm.nih.gov/8701750/', title: 'Efficacy of tablet huperzine-A on memory, cognition, and behavior in Alzheimer\'s disease', year: 1995, design: 'RCT, multicenter, prospective, double-blind, parallel, placebo-controlled' },
      { pmid: '31638455', doi: '10.1080/02699052.2019.1677941', url: 'https://pubmed.ncbi.nlm.nih.gov/31638455/', title: 'Huperzine A for the treatment of cognitive, mood, and functional deficits after moderate and severe TBI (HUP-TBI): results of a Phase II randomized controlled pilot study', year: 2019, design: 'RCT, Phase II, randomized, double-blind, placebo-controlled pilot' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'l-tyrosine',
    name: 'L-Tyrosine (NALT)',
    category: 'amino',
    mechanism: 'L-Tyrosine is an amino acid precursor to dopamine, norepinephrine, and epinephrine. Under conditions of stress, sleep deprivation, or cognitive load, the brain depletes catecholamine stores. Supplementing tyrosine replenishes the substrate for neurotransmitter synthesis, maintaining cognitive performance when it would otherwise decline.',
    clinicalDose: '100–150mg/kg in the key stress trials (about 7–10g for a 70kg adult); consumer products give flat 500–2000mg doses',
    timeToEffect: 'About 1 hour before a demanding cognitive task',
    studySummary: 'Military and stress trials found tyrosine reduced performance decline during one night of sleep loss (Neri et al., 1995, 150mg/kg), noise stress (Deijen & Orlebeke, 1994, 100mg/kg) and a combat training course (Deijen et al., 1999, 2g/day) — but neither Deijen trial found any effect on mood. Other trials were null or negative: tyrosine did not protect cognition or performance under exercise heat stress (Coull 2016, 150mg/kg), and 2g worsened cognitive flexibility under high cognitive load (Robson 2019). A 2015 narrative review (Jongkees et al.) concluded benefits are conditional on short-term stress that depletes dopamine and norepinephrine.',
    benefits: ['Cognitive performance under some acute stressors (sleep loss, noise, combat training)', 'Focus in demanding conditions'],
    sideEffects: ['Generally safe', 'May worsen cognitive flexibility under high cognitive load (one RCT at 2g)', 'MAO inhibitors: theoretical interaction (tyrosine is a catecholamine precursor), no clinical reports found — ask your doctor before combining', 'Possible hyperthyroid effects at very high doses', 'May interact with thyroid medications'],
    productsContaining: ['mind-lab-pro-review', 'performance-lab-mind-review', 'onnit-alpha-brain-review'],
    humanEffects: [
      { effect: 'Cognitive Performance Under Stress', evidenceStrength: 'mixed', magnitude: 'moderate', studies: 6, notes: 'Benefits under sleep loss, noise and combat-training stress (Neri 1995; Deijen 1994/1999), but no benefit under exercise heat stress (Coull 2016) and worse cognitive flexibility under high load (Robson 2019). The effect depends on the type of stressor.' },
      { effect: 'Mood Under Stress', evidenceStrength: 'mixed', magnitude: 'negligible', studies: 2, notes: 'Deijen 1994 and Deijen 1999 both reported no effect on mood, despite finding cognitive benefits in the same trials.' },
    ],
    howToTake: {
      dosage: '500–2000mg L-Tyrosine (flat dose). Several classic stress trials used weight-based doses of 100–150mg/kg (7–10g for a 70kg adult), so consumer doses are not equivalent to the doses shown effective in those trials',
      timing: '30–60 minutes before the demanding task, exam, workout, or stressful event. Unlike most nootropics, timing relative to the demand matters significantly for tyrosine.',
      withFood: 'Best absorbed on an empty stomach or with a low-protein snack. High-protein meals compete for amino acid transporters and reduce tyrosine uptake into the brain significantly. Avoid taking with a protein shake or high-meat meal.',
      forms: 'Capsule or powder. L-Tyrosine (the free amino acid form) is best value and is the form used in the stress trials. NALT (N-Acetyl-L-Tyrosine) is common in formulated stacks, but no trial comparing NALT with plain L-Tyrosine for cognition was found.',
    },
    stacksWith: [
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'L-Tyrosine supplies dopamine/norepinephrine substrate for focus and drive; L-Theanine keeps you calm and prevents the cortisol spike from stress or caffeine. Together they produce focused, calm high-performance state under demanding conditions.' },
      { ingredient: 'Rhodiola Rosea', slug: 'rhodiola-rosea', reason: 'Rhodiola modulates monoamine availability and HPA axis; Tyrosine replenishes the substrate for those monoamines. Both work best under stress conditions — they target the same problem (cognitive decline under stress) via complementary mechanisms.' },
      { ingredient: 'Caffeine', slug: 'caffeine', reason: "Caffeine depletes dopamine precursors over time. Taking L-Tyrosine with caffeine may reduce the 'caffeine crash' by maintaining dopamine substrate levels. A practical stack for anyone using caffeine for performance." },
    ],
    faqs: [
      { question: 'Does L-Tyrosine work if I am not stressed or sleep-deprived?', answer: "Probably not meaningfully. This is the key nuance of tyrosine. The evidence shows it prevents cognitive decline under stress — it restores depleted catecholamines. In a rested, non-stressed baseline state, catecholamine levels are already sufficient, so adding precursor does not produce a noticeable effect. Think of it as an insurance policy for demanding days, not a daily cognitive enhancer." },
      { question: 'L-Tyrosine vs NALT — which form should I buy?', answer: "Plain L-Tyrosine. The stress trials with positive results used plain L-Tyrosine — at 2g/day or at weight-based doses of 100–150mg/kg — taken about an hour before the demand. NALT is commonly used in formulated stacks (easier to cap), but no trial comparing it with plain L-Tyrosine for cognition was found." },
      { question: 'Does it interact with thyroid medications?', answer: 'Yes — L-Tyrosine is a precursor to thyroid hormones (T3 and T4). At standard doses, this is not clinically significant for most people. However, if you have hyperthyroidism or are on levothyroxine or other thyroid medications, supplemental tyrosine could theoretically affect hormone levels. Consult your doctor before use if you have any thyroid condition.' },
      { question: 'Can L-Tyrosine help with ADHD?', answer: "It is not established. Tyrosine is a dopamine precursor, but our 2026 evidence review did not assess ADHD trials, and a 2015 review judged its potential for treating clinical disorders minimal. L-Tyrosine is not a substitute for ADHD treatment — talk to your doctor before combining it with any medication." },
    ],
    sources: [
      { pmid: '26424423', doi: '10.1016/j.jpsychires.2015.08.014', url: 'https://pubmed.ncbi.nlm.nih.gov/26424423/', title: 'Effect of tyrosine supplementation on clinical and healthy populations under stress or cognitive demands — A review', year: 2015, design: 'narrative review (Jongkees et al.) — this is the landmark \'Jongkees 2015\' review, not a formal meta-analysis' },
      { pmid: '10230711', doi: '10.1016/s0361-9230(98)00163-4', url: 'https://pubmed.ncbi.nlm.nih.gov/10230711/', title: 'Tyrosine improves cognitive performance and reduces blood pressure in cadets after one week of a combat training course', year: 1999, design: 'RCT (Deijen et al., matches site\'s cited \'Deijen et al., 1999\')' },
      { pmid: '7794222', url: 'https://pubmed.ncbi.nlm.nih.gov/7794222/', title: 'The effects of tyrosine on cognitive performance during extended wakefulness', year: 1995, design: 'double-blind RCT (Neri et al., matches site\'s cited \'Neri et al., 1995\')' },
      { pmid: '8293316', doi: '10.1016/0361-9230(94)90200-3', url: 'https://pubmed.ncbi.nlm.nih.gov/8293316/', title: 'Effect of tyrosine on cognitive function and blood pressure under stress', year: 1994, design: 'RCT, randomized crossover (Deijen & Orlebeke)' },
      { pmid: '26285023', doi: '10.1249/MSS.0000000000000757', url: 'https://pubmed.ncbi.nlm.nih.gov/26285023/', title: 'Tyrosine Ingestion and Its Effects on Cognitive and Physical Performance in the Heat', year: 2016, design: 'RCT, double-blind counterbalanced crossover, military-based load-carriage protocol' },
      { pmid: '31521870', doi: '10.1016/j.jad.2019.09.031', url: 'https://pubmed.ncbi.nlm.nih.gov/31521870/', title: 'Tyrosine negatively affects flexible-like behaviour under cognitively demanding conditions', year: 2019, design: 'randomized, double-blind, placebo-controlled RCT' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'caffeine',
    name: 'Caffeine',
    category: 'herb',
    mechanism: 'Caffeine is an adenosine receptor antagonist. By blocking adenosine (the neurotransmitter responsible for drowsiness), caffeine increases dopamine, norepinephrine, and acetylcholine signalling — producing wakefulness, elevated mood, and enhanced focus. It also increases cyclic AMP levels, which amplify downstream catecholamine effects.',
    clinicalDose: '100–200mg for cognitive enhancement',
    timeToEffect: '15–45 minutes (acute)',
    studySummary: 'Caffeine is one of the most extensively studied psychoactive compounds. A 2016 review (McLellan, Caldwell & Lieberman — a narrative review, not a meta-analysis) found low-to-moderate doses (~40–300mg) consistently improve alertness, vigilance, attention and reaction time, with less consistent effects on memory and executive function. A 2010 Cochrane review of shift workers and a 2026 meta-analysis of 7 military sleep-loss RCTs confirmed gains in attention, vigilance and complex task performance. Side effects rise with dose, and the European Food Safety Authority (EFSA, 2015) sets 200mg per single dose and 400mg/day as safe for healthy adults — 200mg/day for pregnant women.',
    benefits: ['Increased alertness', 'Faster reaction time', 'Sustained attention during sleep loss', 'Improved physical performance above ~200mg'],
    sideEffects: ['Pregnancy: EFSA advises limiting habitual intake to 200mg/day from all sources', 'Panic disorder: in a meta-analysis, 53.9% of people with panic disorder had a panic attack after high-dose caffeine (~400–750mg) versus 1.7% of healthy controls — avoid or keep doses low', 'Headache, abdominal discomfort, rapid heart rate, insomnia and anxiety rise with dose, especially above ~6mg/kg (~420mg for a 70kg adult)', 'Insomnia: 400mg taken even 6 hours before bedtime reduced total sleep time', 'Tolerance development', 'Withdrawal headaches'],
    productsContaining: ['hunter-focus-review'],
    humanEffects: [
      { effect: 'Alertness & Wakefulness', evidenceStrength: 'strong', magnitude: 'large', studies: 2, notes: 'Most robust effect of caffeine: consistent after low-to-moderate doses (McLellan 2016); vigilance/response performance SMD 0.73 during sleep loss (2026 military meta-analysis).' },
      { effect: 'Reaction Time', evidenceStrength: 'strong', magnitude: 'moderate', studies: 3, notes: 'Improved orientation/attention in the Cochrane shift-worker review and consistent response-time gains during sleep loss; one of the more tolerance-resistant effects.' },
      { effect: 'Sustained Attention', evidenceStrength: 'strong', magnitude: 'moderate', studies: 2, notes: 'Particularly effective during sleep deprivation or extended work sessions (complex cognitive performance SMD 0.54 in the 2026 military meta-analysis).' },
      { effect: 'Memory Consolidation', evidenceStrength: 'moderate', magnitude: 'small', studies: 1, notes: 'Post-study caffeine enhanced 24-hour memory consolidation (not retrieval), with an inverted-U dose-response (Borota 2014). Effect modest compared to attention benefits.' },
    ],
    howToTake: {
      dosage: '100–200mg for cognitive effects; do not exceed 400mg/day (EFSA: up to 200mg per single dose; 200mg/day in pregnancy)',
      timing: 'Morning or early afternoon. Avoid within 8 hours of bedtime — a 400mg dose disrupted sleep even when taken 6 hours before bed.',
      withFood: 'Can be taken with or without food. Food slows absorption slightly, reducing peak intensity but extending duration.',
      cycling: 'Optional: some people take a week off every 8–12 weeks to reduce tolerance; this has not been tested in trials.',
      forms: 'Coffee, tea, matcha, capsules, or anhydrous powder. Capsules provide the most precise dosing. Matcha provides a gentler curve due to L-Theanine co-occurrence.',
    },
    stacksWith: [
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'The most studied nootropic stack. Trials used roughly 1:1 to 1.7:1 theanine:caffeine and found better attention than caffeine alone; in a controlled trial theanine did not significantly reduce jitteriness. Found naturally in matcha.' },
      { ingredient: 'L-Tyrosine', slug: 'l-tyrosine', reason: 'Caffeine depletes dopamine precursors over time. L-Tyrosine replenishes substrate, reducing the crash and maintaining sustained focus.' },
      { ingredient: 'Rhodiola Rosea', slug: 'rhodiola-rosea', reason: 'Rhodiola provides stress resilience while caffeine provides stimulation — complementary under high-demand conditions without overstimulation.' },
    ],
    faqs: [
      { question: 'How much caffeine is too much?', answer: 'EFSA (2015) concluded that single doses up to 200mg and daily intake up to 400mg do not raise safety concerns for healthy adults, and that pregnant women should stay at or below 200mg/day. People with panic disorder are far more likely to have a panic attack after high doses. Above these levels, anxiety, heart palpitations, and sleep disruption become common. For cognitive enhancement, 100-200mg is the sweet spot — higher doses provide diminishing returns for cognition while increasing side effects.' },
      { question: 'Does caffeine tolerance reduce its cognitive benefits?', answer: 'Partially. Tolerance develops quickly to subjective alertness (the "I feel awake" feeling) but more slowly to objective cognitive benefits like reaction time and vigilance. Even habitual consumers show faster reaction times after caffeine vs. placebo. However, taking periodic breaks (1-2 weeks) can partially reset tolerance.' },
      { question: 'Is caffeine from coffee different from caffeine in supplements?', answer: 'Chemically, caffeine is caffeine regardless of source. However, coffee contains chlorogenic acids and other polyphenols that may modulate absorption kinetics and provide independent neuroprotective effects. Supplement caffeine (anhydrous) hits faster and harder. Neither is objectively better — it depends on whether you want precision dosing (capsule) or a gentler curve (coffee/tea).' },
      { question: 'Can I take caffeine with nootropic stacks that contain stimulants?', answer: 'Be careful. Many nootropic stacks (e.g. Hunter Focus) already contain 100mg caffeine. Adding coffee or caffeine pills on top can push you over 400mg/day. Always check the label for caffeine content before stacking. If a product contains caffeine, reduce your external caffeine intake accordingly.' },
    ],
    sources: [
      { pmid: '27612937', doi: '10.1016/j.neubiorev.2016.09.001', url: 'https://pubmed.ncbi.nlm.nih.gov/27612937/', title: 'A review of caffeine\'s effects on cognitive, physical and occupational performance', year: 2016, design: 'narrative review (McLellan, Caldwell & Lieberman)' },
      { pmid: '20464765', doi: '10.1002/14651858.CD008508', url: 'https://pubmed.ncbi.nlm.nih.gov/20464765/', title: 'Caffeine for the prevention of injuries and errors in shift workers', year: 2010, design: 'Cochrane systematic review and meta-analysis (13 RCTs)' },
      { pmid: '42761483', doi: '10.3389/fnut.2026.1893033', url: 'https://pubmed.ncbi.nlm.nih.gov/42761483/', title: 'Acute caffeine supplementation as a nutrition-based strategy to mitigate sleep-loss-related cognitive and operational performance impairments in military personnel: a systematic review and meta-analysis', year: 2026, design: 'systematic review and meta-analysis (7 RCTs)' },
      { pmid: '24413697', doi: '10.1038/nn.3623', url: 'https://pubmed.ncbi.nlm.nih.gov/24413697/', title: 'Post-study caffeine administration enhances memory consolidation in humans', year: 2014, design: 'double-blind RCT (Borota et al.)' },
      { pmid: '42033594', doi: '10.1007/s40279-026-02441-4', url: 'https://pubmed.ncbi.nlm.nih.gov/42033594/', title: 'Caffeine Use in Sport: A Systematic Review and Meta-analysis of Acute Side Effects and Implications for Athlete Health and Safety', year: 2026, design: 'systematic review and meta-analysis (48 RCTs, 38 in meta-analysis)' },
      { pmid: '24235903', doi: '10.5664/jcsm.3170', url: 'https://pubmed.ncbi.nlm.nih.gov/24235903/', title: 'Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed', year: 2013, design: 'double-blind, placebo-controlled RCT (Drake et al.)' },
      { url: 'https://www.efsa.europa.eu/en/efsajournal/pub/4102', title: 'EFSA Scientific Opinion on the Safety of Caffeine (EFSA Journal 2015;13(5):4102)', year: 2015, design: 'regulatory scientific opinion' },
      { pmid: '34871964', url: 'https://pubmed.ncbi.nlm.nih.gov/34871964/', title: 'Effects of caffeine on anxiety and panic attacks in patients with panic disorder: A systematic review and meta-analysis.', year: 2022 },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'ginkgo-biloba',
    name: 'Ginkgo Biloba',
    category: 'herb',
    mechanism: 'Ginkgo Biloba extract (standardised to 24% ginkgo flavone glycosides and 6% terpene lactones) works primarily by improving cerebral blood flow through vasodilation and platelet-activating factor (PAF) inhibition. The terpene lactones (ginkgolides A, B, C and bilobalide) reduce blood viscosity and improve microcirculation in brain capillaries. Additionally, ginkgo has antioxidant properties that protect neuronal membranes from lipid peroxidation.',
    clinicalDose: '240mg/day of standardised extract EGb 761 in the positive trials (120mg/day appears under-dosed)',
    timeToEffect: 'Positive dementia trials ran 22–26 weeks; the Cochrane review assessed outcomes at 6 months',
    studySummary: 'The NIH-funded GEM trial (DeKosky 2008, n=3,069, 240mg/day, median 6.1 years) found no reduction in dementia or Alzheimer\'s incidence in people aged 75+. For existing cognitive impairment and dementia, a meta-analysis of 9 RCTs (Tan et al., 2015, 22–26 weeks, mainly 240mg/day EGb 761) found benefits on cognition and daily living, concentrated in patients with neuropsychiatric symptoms. The 2026 Cochrane review of 82 RCTs found small-to-moderate benefits in dementia (low-certainty evidence) but little or no effect in mild cognitive impairment. A 2013 review rated the dementia evidence low quality, noting most trials were pharmaceutical-industry sponsored. Ginkgo raises bleeding risk with warfarin.',
    benefits: ['Cognition and daily living in dementia (low-certainty evidence)', 'Improved cerebral blood flow (not re-verified in our 2026 review)', 'Antioxidant activity'],
    sideEffects: ['Headache', 'GI discomfort', 'Increased bleeding risk with blood thinners: in a large Veterans Administration cohort, ginkgo plus warfarin raised bleeding risk (HR 1.38), and a systematic review links ginkgo to major bleeds including intracranial bleeding — avoid with anticoagulants', 'Rare: allergic skin reactions'],
    productsContaining: ['fancl-brains-review', 'naturebell-ginkgo-ginseng-review', 'blackmores-brain-active-review'],
    humanEffects: [
      { effect: 'Cerebral Blood Flow', evidenceStrength: 'strong', magnitude: 'moderate', notes: 'Vasodilatory effect reported in blood-flow studies; not re-verified in our 2026 review.' },
      { effect: 'Memory (Cognitive Decline)', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 3, notes: 'Benefits in dementia (Tan 2015; 2026 Cochrane review, low certainty), but the Cochrane review found little or no effect in mild cognitive impairment. A 2013 review found the effect only in trials with a mean age below 75.' },
      { effect: 'Memory (Healthy Adults)', evidenceStrength: 'mixed', magnitude: 'small', notes: 'Mixed results. Some trials show working memory improvements; others show no effect. Not re-verified in our 2026 review.' },
      { effect: 'Dementia Prevention', evidenceStrength: 'strong', magnitude: 'negligible', studies: 1, notes: 'The GEM trial (n=3,069) found no preventive effect on dementia onset in people aged 75+ over a median 6.1 years.' },
    ],
    howToTake: {
      dosage: '240mg/day of standardised extract (24/6) — the dose used in the positive trials; lower doses (120mg/day) appear under-dosed',
      timing: 'Split into 2 doses (morning and afternoon) for sustained blood flow effects.',
      withFood: 'Take with meals to reduce GI discomfort. Absorption is not significantly affected by food.',
      forms: 'Always use standardised extract (24% flavone glycosides, 6% terpene lactones). EGb 761 is the gold-standard pharmaceutical-grade extract used in most clinical trials. Avoid raw leaf or unstandardised products.',
    },
    stacksWith: [
      { ingredient: 'Phosphatidylserine', slug: 'phosphatidylserine', reason: 'Ginkgo improves blood delivery while PS supports membrane function — complementary pathways for age-related cognitive support.' },
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: "Ginkgo provides acute blood flow support; Lion's Mane builds long-term neuroprotection via NGF. Addresses both immediate and structural brain health." },
      { ingredient: 'Bacopa Monnieri', slug: 'bacopa-monnieri', reason: 'Both have long-term memory benefits via different mechanisms. Ginkgo via blood flow; Bacopa via synaptic density. Combined for comprehensive memory support in older adults.' },
    ],
    faqs: [
      { question: 'Does Ginkgo Biloba actually work for healthy young adults?', answer: 'The evidence is mixed. The clearest benefits are in people with dementia, and the 2026 Cochrane review found little or no effect even in mild cognitive impairment. In healthy young adults, effects on memory and attention are inconsistent across trials. If you are under 40 and cognitively healthy, L-theanine + caffeine has stronger acute evidence.' },
      { question: 'What is EGb 761 and why does it matter?', answer: 'EGb 761 is a specific pharmaceutical-grade Ginkgo biloba extract manufactured by Dr. Willmar Schwabe Pharmaceuticals. It is standardised to 24% ginkgo flavone glycosides and 6% terpene lactones, with toxic ginkgolic acid removed below 5ppm. It is the extract used in most of the dementia trials. Generic ginkgo products may not match the potency or purity.' },
      { question: 'Can I take Ginkgo with blood thinners?', answer: 'Avoid it unless your doctor agrees. In a large Veterans Administration cohort, taking ginkgo with warfarin raised bleeding risk by 38% (HR 1.38), and a systematic review of warfarin interactions links ginkgo to major bleeding events, including intracranial bleeding. The interaction is clinically documented and potentially serious.' },
      { question: 'How long before I see results?', answer: 'The positive dementia trials ran 22–26 weeks at 240mg/day, and the Cochrane review assessed outcomes at 6 months. Do not judge efficacy at 1–2 weeks.' },
    ],
    sources: [
      { pmid: '19017911', doi: '10.1001/jama.2008.683', url: 'https://pubmed.ncbi.nlm.nih.gov/19017911/', title: 'Ginkgo biloba for prevention of dementia: a randomized controlled trial.', year: 2008, design: 'rct' },
      { pmid: '25114079', doi: '10.3233/JAD-140837', url: 'https://pubmed.ncbi.nlm.nih.gov/25114079/', title: 'Efficacy and adverse effects of ginkgo biloba for cognitive impairment and dementia: a systematic review and meta-analysis.', year: 2015, design: 'meta-analysis' },
      { pmid: '41641880', doi: '10.1002/14651858.CD013661.pub2', url: 'https://pubmed.ncbi.nlm.nih.gov/41641880/', title: 'Ginkgo biloba for cognitive impairment and dementia.', year: 2026, design: 'systematic review' },
      { pmid: '24991128', doi: '10.3969/j.issn.1002-0829.2013.01.005', url: 'https://pubmed.ncbi.nlm.nih.gov/24991128/', title: 'Ginkgo biloba extract for dementia: a systematic review.', year: 2013, design: 'meta-analysis' },
      { pmid: '26958257', url: 'https://pubmed.ncbi.nlm.nih.gov/26958257/', title: 'Ginkgo and Warfarin Interaction in a Large Veterans Administration Population.', year: 2015, design: 'cohort study' },
      { pmid: '32478963', doi: '10.1111/bcp.14404', url: 'https://pubmed.ncbi.nlm.nih.gov/32478963/', title: 'Warfarin and food, herbal or dietary supplement interactions: A systematic review.', year: 2020, design: 'systematic review' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'dha-omega-3',
    name: 'DHA (Omega-3)',
    category: 'herb',
    mechanism: 'Docosahexaenoic acid (DHA) is the primary structural omega-3 fatty acid in the brain, constituting ~40% of polyunsaturated fatty acids in neuronal membranes. DHA maintains membrane fluidity, enabling proper receptor function, ion channel activity, and synaptic vesicle dynamics. It also resolves neuroinflammation via specialised pro-resolving mediators (SPMs) and supports BDNF (brain-derived neurotrophic factor) expression for neuroplasticity.',
    clinicalDose: '900mg–1.2g DHA/day (the dose range of the positive trials)',
    timeToEffect: 'About 24 weeks — both positive cognitive RCTs ran 6 months',
    studySummary: 'DHA is essential for brain development and maintenance, but RCT results are mixed. A 2012 Cochrane review (n=4,080) found no cognitive benefit of omega-3 supplements in cognitively healthy older adults, and a 2025 meta-analysis found no meaningful ADAS-Cog benefit once Alzheimer\'s has developed. Two 6-month RCTs were positive: 900mg DHA/day improved learning and recognition memory in age-related cognitive decline (Yurko-Mauro et al., 2010 — sponsored by the algal-DHA maker Martek, with a Martek employee as lead author), and 1.16g/day improved memory and working-memory reaction times in healthy adults aged 18–45 with low DHA intake (Stonehouse 2013). A 2021 NIH-funded meta-analysis (n=81,210) found omega-3 supplements raise atrial fibrillation risk, more so above 1g/day.',
    benefits: ['Learning and recognition memory in age-related cognitive decline (900mg/day)', 'Memory and reaction time in healthy adults with low DHA intake (1.16g/day)', 'Neuronal membrane integrity'],
    sideEffects: ['Atrial fibrillation: a 2021 meta-analysis of cardiovascular RCTs (PMID 34612056, n=81,210) found omega-3 supplements raised atrial fibrillation risk (HR 1.25), rising to HR 1.49 at more than 1g/day — talk to your doctor if you have heart-rhythm problems', 'Fishy aftertaste or burps', 'Mild GI problems (under 15% of participants in the Cochrane review, similar to placebo)', 'Potential blood-thinning effect at very high doses (>3g/day)'],
    productsContaining: ['fancl-brains-review', 'suntory-dha-epa-sesamin-review', 'blackmores-brain-active-review'],
    humanEffects: [
      { effect: 'Memory (Age-Related Decline)', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 1, notes: '900mg DHA/day for 24 weeks improved paired-associate learning and verbal recognition memory, but not working memory or executive function, in adults 55+ with age-related decline (Yurko-Mauro 2010, industry-sponsored).' },
      { effect: 'Memory (Healthy Adults)', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 1, notes: 'Stonehouse 2013 (n=176, 6 months, 1.16g/day) improved episodic and working-memory reaction times (−0.18 to −0.36 SD) in adults 18–45 with low DHA intake; women and men benefited on different measures.' },
      { effect: 'Mood & Depression', evidenceStrength: 'moderate', magnitude: 'small', notes: 'EPA is reported to have the stronger antidepressant effect; not re-verified in our 2026 review.' },
      { effect: 'Brain Structure Preservation', evidenceStrength: 'moderate', magnitude: 'moderate', notes: 'Higher DHA blood levels are reported to correlate with larger hippocampal volume in MRI studies; not re-verified in our 2026 review.' },
    ],
    howToTake: {
      dosage: '900mg–1.2g DHA/day. If combining with EPA, note the atrial fibrillation risk rose above 1g/day of total omega-3 in cardiovascular trials',
      timing: 'With a meal containing fat for optimal absorption. Can be taken any time of day.',
      withFood: 'Essential — DHA is fat-soluble, so take it with a fat-containing meal.',
      forms: 'Fish oil, krill oil, or algal oil (vegan). Algal DHA avoids heavy metal concerns; no head-to-head trial has compared algal and fish DHA on cognitive outcomes.',
    },
    stacksWith: [
      { ingredient: 'Phosphatidylserine', slug: 'phosphatidylserine', reason: 'DHA provides the structural fat for membranes; PS is the phospholipid that organises membrane architecture. Together they provide comprehensive neuronal membrane support.' },
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: "DHA maintains membrane integrity while Lion's Mane stimulates NGF for neuroplasticity. Foundational + growth-oriented brain support." },
      { ingredient: 'Citicoline', slug: 'citicoline', reason: 'Citicoline provides choline for membrane phospholipid synthesis; DHA provides the fatty acid substrate. Together they supply the raw materials for brain cell membrane repair.' },
    ],
    faqs: [
      { question: 'DHA vs EPA — which matters more for brain health?', answer: 'DHA is the structural omega-3 in brain membranes (~40% of brain PUFA), making it more directly relevant to cognitive function. EPA is more potent as an anti-inflammatory and shows stronger effects for mood/depression. For brain health, prioritise DHA — the positive cognitive trials used 900mg–1.16g DHA per day. For mood support, prioritise EPA. Most quality supplements provide both; keep the atrial fibrillation signal above 1g/day of total omega-3 in mind.' },
      { question: 'Can I get enough DHA from diet alone?', answer: 'If you eat fatty fish (salmon, mackerel, sardines) 2-3 times per week, you likely get sufficient DHA. Most people in Western diets consume far below optimal levels. Vegetarians and vegans are particularly at risk for deficiency — algal DHA supplements are the solution. A blood test (Omega-3 Index) can measure your actual status.' },
      { question: 'Is fish oil or algal oil better?', answer: 'DHA is the same molecule from either source. Algal oil avoids mercury/heavy metal concerns and is suitable for vegetarians. Fish oil provides a natural DHA+EPA ratio. No head-to-head trial has compared them on cognitive outcomes — choose based on dietary preference and quality of the specific product.' },
      { question: 'How long before I notice cognitive effects?', answer: 'DHA works by rebuilding membrane composition, which is a slow process. Both positive cognitive RCTs ran for 24 weeks (6 months). You will not feel an acute effect like caffeine or L-theanine. Think of DHA as a long-term infrastructure investment, not a performance supplement.' },
    ],
    sources: [
      { pmid: '20434961', doi: '10.1016/j.jalz.2010.01.013', url: 'https://pubmed.ncbi.nlm.nih.gov/20434961/', title: 'Beneficial effects of docosahexaenoic acid on cognition in age-related cognitive decline.', year: 2010, design: 'RCT, randomized, double-blind, placebo-controlled, multi-site (19 US sites)' },
      { pmid: '23515006', doi: '10.3945/ajcn.112.053371', url: 'https://pubmed.ncbi.nlm.nih.gov/23515006/', title: 'DHA supplementation improved both memory and reaction time in healthy young adults: a randomized controlled trial.', year: 2013, design: 'RCT, randomized, double-blind, placebo-controlled' },
      { pmid: '22696350', doi: '10.1002/14651858.CD005379.pub3', url: 'https://pubmed.ncbi.nlm.nih.gov/22696350/', title: 'Omega 3 fatty acid for the prevention of cognitive decline and dementia.', year: 2012, design: 'Systematic review / meta-analysis (Cochrane)' },
      { pmid: '34612056', doi: '10.1161/CIRCULATIONAHA.121.055654', url: 'https://pubmed.ncbi.nlm.nih.gov/34612056/', title: 'Effect of Long-Term Marine ɷ-3 Fatty Acids Supplementation on the Risk of Atrial Fibrillation in Randomized Controlled Trials of Cardiovascular Outcomes: A Systematic Review and Meta-Analysis.', year: 2021, design: 'Systematic review / meta-analysis of cardiovascular RCTs' },
      { pmid: '39991006', doi: '10.3892/br.2025.1940', url: 'https://pubmed.ncbi.nlm.nih.gov/39991006/', title: 'Cognitive efficacy of omega-3 fatty acids in Alzheimer\'s disease: A systematic review and meta-analysis.', year: 2025, design: 'Systematic review / meta-analysis' },
      { pmid: '26265727', doi: '10.1093/gerona/glv109', url: 'https://pubmed.ncbi.nlm.nih.gov/26265727/', title: 'A High Omega-3 Fatty Acid Multinutrient Supplement Benefits Cognition and Mobility in Older Women: A Randomized, Double-blind, Placebo-controlled Pilot Study.', year: 2015, design: 'RCT, pilot, double-blind, placebo-controlled' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'maritime-pine-bark',
    name: 'Maritime Pine Bark Extract',
    category: 'herb',
    mechanism: 'Maritime Pine Bark Extract (Pinus pinaster) contains proanthocyanidins — potent polyphenol antioxidants that cross the blood-brain barrier. It works via three pathways: (1) stimulating endothelial nitric oxide synthase (eNOS) to increase cerebral blood flow via vasodilation; (2) scavenging reactive oxygen species to protect neuronal membranes; (3) modulating NF-κB inflammatory signalling to reduce neuroinflammation. Pycnogenol is the most studied branded form.',
    clinicalDose: '100–200mg/day (Pycnogenol or equivalent standardised extract)',
    timeToEffect: 'The cognitive studies ran 8–12 weeks',
    studySummary: 'A 2014 Pycnogenol study (Belcaro et al.) in healthy professionals aged 35–55 reported small but significant cognitive improvements and a 30.4% drop in plasma free radicals after 12 weeks at 150mg/day — but it was a non-randomized product-evaluation registry study, not an RCT. A 2011 controlled (non-randomized) study in students (Luzzi et al.) reported better attention, memory and exam scores over 8 weeks. Both come from the same Irvine3 Labs / Chieti-Pescara author group, which has published numerous Pycnogenol studies; Pycnogenol is a Horphag Research trademark, and these trials are widely reported as industry-supported, though no sponsor is disclosed in the abstracts. The independent 2020 Cochrane review rated the evidence for every pine bark outcome it assessed as very low certainty. A 2025 network meta-analysis ranked Pycnogenol highly for mild cognitive impairment but cautioned about heterogeneity.',
    benefits: ['Lower oxidative stress markers', 'Attention and focus (preliminary, non-randomized studies)', 'Antioxidant activity'],
    sideEffects: ['Generally well tolerated, though adverse-event reporting was inconsistent across trials (Cochrane 2020)', 'Rare: mild GI discomfort', 'Headache (uncommon)', 'Immunosuppressants: possible interaction, not confirmed by clinical reports — ask your doctor'],
    productsContaining: ['performance-lab-mind-review'],
    humanEffects: [
      { effect: 'Attention & Focus', evidenceStrength: 'preliminary', magnitude: 'small', studies: 3, notes: 'Two non-randomized studies from one author group (Belcaro 2014; Luzzi 2011) report improvements; the independent Cochrane review rates pine bark evidence as very low certainty.' },
      { effect: 'Oxidative Stress Reduction', evidenceStrength: 'preliminary', magnitude: 'moderate', studies: 1, notes: 'Plasma free radicals fell 30.4% (vs +0.9% in controls) over 12 weeks in Belcaro 2014; proanthocyanidin antioxidant activity is well established mechanistically.' },
      { effect: 'Cerebral Blood Flow', evidenceStrength: 'moderate', magnitude: 'small', notes: 'Proposed via eNOS stimulation and nitric oxide production; not re-verified in our 2026 review.' },
      { effect: 'Memory', evidenceStrength: 'preliminary', magnitude: 'small', studies: 2, notes: 'A non-randomized student study (Luzzi 2011) reported memory gains, and a 2025 network meta-analysis ranked Pycnogenol highly in mild cognitive impairment, with a caution about heterogeneous trials.' },
    ],
    howToTake: {
      dosage: '100–200mg/day of standardised extract (65-75% proanthocyanidins)',
      timing: 'Morning with breakfast. Can be split into 2 doses for sustained antioxidant coverage.',
      withFood: 'Take with food for better absorption and reduced GI risk. Fat is not required but a meal is recommended.',
      forms: 'Capsule is standard. Pycnogenol is the gold-standard branded extract used in most clinical research. Generic pine bark extracts vary widely in proanthocyanidin content — check standardisation percentage.',
    },
    stacksWith: [
      { ingredient: 'Citicoline', slug: 'citicoline', reason: 'Citicoline provides cholinergic focus; Pine Bark provides blood flow and antioxidant support. Together they form the core of Performance Lab Mind — a minimal, evidence-based focus stack.' },
      { ingredient: 'L-Tyrosine', slug: 'l-tyrosine', reason: 'Pine Bark supports cerebral blood flow (delivery); Tyrosine supports catecholamine synthesis (production). Complementary supply-side + demand-side pairing.' },
      { ingredient: 'DHA (Omega-3)', slug: 'dha-omega-3', reason: 'Pine Bark protects neuronal membranes from oxidative damage; DHA provides the structural fatty acid for those membranes. Protective + structural combination.' },
    ],
    faqs: [
      { question: 'What is Pycnogenol and is it worth the premium?', answer: 'Pycnogenol is a patented extract of French Maritime Pine Bark (Pinus pinaster) standardised to 65-75% proanthocyanidins with a specific manufacturing process. It is the extract used in the cognitive studies cited here; no trial has compared it with generic pine bark extract. Generic pine bark extracts may vary in composition. If you want to match the clinical evidence, Pycnogenol is the most reliable choice.' },
      { question: 'How does Maritime Pine Bark compare to Ginkgo Biloba?', answer: 'Both improve cerebral blood flow but via different mechanisms: Ginkgo inhibits platelet-activating factor; Pine Bark stimulates nitric oxide. Pine Bark has stronger antioxidant activity; Ginkgo has a larger evidence base for cognitive decline. No trial has tested the combination, and ginkgo raises bleeding risk with blood thinners.' },
      { question: 'Can I take Pine Bark Extract long-term?', answer: 'The pooled trials ran from 4 weeks to 6 months, and the Cochrane review notes adverse events were reported inconsistently, so the absence of reported harm is not proof of long-term safety. No cycling protocol has been tested. Check with your doctor if you take immunosuppressants.' },
      { question: 'Why is the dose in Performance Lab Mind only 75mg?', answer: 'Performance Lab Mind uses 75mg Maritime Pine Bark — below the 100-200mg clinical dose used in most standalone trials. However, in a multi-ingredient formula with Citicoline and Tyrosine, the synergistic effects may partially compensate. It is still technically underdosed relative to the standalone evidence.' },
    ],
    sources: [
      { pmid: '24675223', url: 'https://pubmed.ncbi.nlm.nih.gov/24675223/', title: 'Pycnogenol® improves cognitive function, attention, mental performance and specific professional skills in healthy professionals aged 35-55.', year: 2014, design: 'Product-evaluation registry study (non-randomised)' },
      { pmid: '22108481', url: 'https://pubmed.ncbi.nlm.nih.gov/22108481/', title: 'Pycnogenol® supplementation improves cognitive function, attention and mental performance in students.', year: 2011, design: 'non-randomised controlled clinical trial' },
      { pmid: '31333448', doi: '10.3389/fphar.2019.00694', url: 'https://pubmed.ncbi.nlm.nih.gov/31333448/', title: 'Assessing the Efficacy and Mechanisms of Pycnogenol on Cognitive Aging From Animal and Human Studies.', year: 2019, design: 'Narrative review' },
      { pmid: '32990945', doi: '10.1002/14651858.CD008294.pub5', url: 'https://pubmed.ncbi.nlm.nih.gov/32990945/', title: 'Pine bark (Pinus spp.) extract for treating chronic disorders.', year: 2020, design: 'Systematic review / meta-analysis (Cochrane, independent)' },
      { pmid: '41333026', doi: '10.3389/fphar.2025.1657169', url: 'https://pubmed.ncbi.nlm.nih.gov/41333026/', title: 'Comparative efficacy and safety of botanical drugs for mild cognitive impairment: a systematic review and network meta-analysis.', year: 2025, design: 'Systematic review / network meta-analysis (Bayesian)' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'acetyl-l-carnitine',
    name: 'Acetyl-L-Carnitine (ALCAR)',
    category: 'amino',
    mechanism: 'Acetyl-L-Carnitine (ALCAR) is an acetylated form of L-Carnitine that crosses the blood-brain barrier more effectively than plain L-Carnitine. It works via three mechanisms: (1) donating acetyl groups for acetylcholine synthesis, supporting cholinergic neurotransmission; (2) transporting long-chain fatty acids into mitochondria for beta-oxidation, providing cellular energy to neurons; (3) supporting mitochondrial membrane integrity and reducing oxidative damage in aging neurons.',
    clinicalDose: '1500–3000mg/day (every positive trial reviewed used at least 1.5g/day)',
    timeToEffect: 'Benefit apparent by 3 months in MCI trials — the shortest trials reviewed ran 3 months',
    studySummary: 'A 2003 meta-analysis of double-blind RCTs (Montgomery et al.) found a modest but significant advantage for ALCAR over placebo in mild cognitive impairment and mild Alzheimer\'s disease at 1.5–3g/day, apparent by 3 months and growing over time. A 2018 meta-analysis of 12 RCTs (Veronese et al., n=791) found a large reduction in depressive symptoms, comparable to antidepressants with fewer adverse effects, most clearly in older adults. A 2022 RCT in pre-frail older adults (3g/day) improved MMSE and walking distance. A 2020 critical review still calls its role in dementia "under debate". No healthy-young-adult trial was found.',
    benefits: ['Cognition in mild cognitive impairment and mild Alzheimer\'s (modest effect)', 'Fewer depressive symptoms, especially in older adults', 'Acetylcholine precursor'],
    sideEffects: ['Bipolar disorder: listed among agents associated with triggering manic or hypomanic episodes (case-report-level evidence) — avoid without psychiatric advice', 'ADHD: rated "not supported" by the 2022 WFSBP/CANMAT nutraceutical guidelines — do not use as an ADHD treatment', 'Fishy body odour at high doses (TMAO pathway)', 'GI discomfort', 'Insomnia if taken late', 'Rare: increased agitation in some individuals'],
    productsContaining: ['qualia-mind-review'],
    humanEffects: [
      { effect: 'Cognitive Function (MCI/Aging)', evidenceStrength: 'strong', magnitude: 'moderate', studies: 2, notes: 'Montgomery 2003 meta-analysis (1.5–3g/day, 3–12 months) found a modest pooled effect (ES≈0.2) in MCI and mild Alzheimer\'s; a 1990 RCT at 2g/day improved memory and attention in mildly impaired elderly.' },
      { effect: 'Mental Energy & Fatigue', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 1, notes: 'A 2022 RCT in pre-frail older adults (3g/day, 3 months) improved MMSE and walking distance. No healthy-young-adult trial was found.' },
      { effect: 'Mood & Depression', evidenceStrength: 'moderate', magnitude: 'large', studies: 1, notes: 'Veronese 2018 (12 RCTs, n=791): large pooled reduction in depressive symptoms (SMD −1.10, high heterogeneity), comparable to antidepressants with fewer adverse effects, most effective in older adults.' },
      { effect: 'Neuroprotection', evidenceStrength: 'preliminary', magnitude: 'small', studies: 2, notes: 'A 2020 critical review says its role in dementia is "still under debate"; in a 2024 Korean trial the pooled open-label donepezil + ALCAR and donepezil + ginkgo arms declined on MMSE while donepezil alone and donepezil + choline alfoscerate improved — ALCAR\'s own contribution cannot be isolated from the pooled ginkgo arm.' },
    ],
    howToTake: {
      dosage: '1500–3000mg/day — the dose range of the positive trials; no positive trial we reviewed used less than 1,500mg/day',
      timing: 'Morning or early afternoon. ALCAR has mild stimulatory properties — avoid evening dosing to prevent sleep disruption.',
      withFood: 'Can be taken with or without food. Absorption is not significantly affected by meals.',
      forms: 'Capsule or powder. ALCAR (acetyl form) is specifically required — plain L-Carnitine does not cross the BBB effectively. Look for "Acetyl-L-Carnitine" or "ALCAR" on the label, not "L-Carnitine" or "L-Carnitine L-Tartrate".',
    },
    stacksWith: [
      { ingredient: 'Alpha-GPC', slug: 'alpha-gpc', reason: 'ALCAR provides acetyl groups; Alpha-GPC provides choline. Together they support acetylcholine synthesis from both the acetyl and choline substrate sides.' },
      { ingredient: 'Citicoline', slug: 'citicoline', reason: 'Both support cholinergic function via different pathways. Citicoline provides CDP-choline for membrane repair; ALCAR provides mitochondrial energy and acetyl groups.' },
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: "ALCAR protects existing neurons via mitochondrial support; Lion's Mane promotes new neuronal growth via NGF. Complementary maintenance + growth strategy." },
    ],
    faqs: [
      { question: 'ALCAR vs plain L-Carnitine — what is the difference?', answer: 'The acetyl group on ALCAR allows it to cross the blood-brain barrier and donate acetyl groups for acetylcholine synthesis. Plain L-Carnitine primarily acts in muscles and peripheral tissue for fat metabolism. For brain benefits, ALCAR is required — plain L-Carnitine will not produce cognitive effects.' },
      { question: 'Does ALCAR raise TMAO levels?', answer: 'Yes, carnitine (including ALCAR) is metabolised by gut bacteria into trimethylamine, which the liver converts to TMAO. Elevated TMAO is associated with cardiovascular risk in observational studies. The clinical significance at standard ALCAR supplement doses (1.5–3g/day) is debated. If you have existing cardiovascular concerns, discuss with your doctor.' },
      { question: 'Is ALCAR useful for young healthy adults?', answer: 'Unproven. The evidence is for older adults with cognitive decline or depressive symptoms; our 2026 review found no trial in healthy young adults. It is not a first-line nootropic for healthy young people — L-theanine + caffeine has stronger acute evidence. It is also not supported for ADHD.' },
      { question: 'Can ALCAR help with brain fog?', answer: 'Possibly. ALCAR supports mitochondrial energy production in neurons, which may address brain fog caused by metabolic insufficiency. Anecdotal reports are common but controlled evidence specifically for "brain fog" in healthy adults is limited. If brain fog persists, investigate underlying causes (sleep, thyroid, iron levels) rather than relying solely on supplements.' },
    ],
    sources: [
      { pmid: '12598816', doi: '10.1097/00004850-200303000-00001', url: 'https://pubmed.ncbi.nlm.nih.gov/12598816/', title: 'Meta-analysis of double blind randomized controlled clinical trials of acetyl-L-carnitine versus placebo in the treatment of mild cognitive impairment and mild Alzheimer\'s disease', year: 2003, design: 'meta-analysis of double-blind RCTs' },
      { pmid: '29076953', doi: '10.1097/PSY.0000000000000537', url: 'https://pubmed.ncbi.nlm.nih.gov/29076953/', title: 'Acetyl-L-Carnitine Supplementation and the Treatment of Depressive Symptoms: A Systematic Review and Meta-Analysis (Veronese et al., 2018)', year: 2018, design: 'systematic review / meta-analysis of RCTs' },
      { pmid: '2201659', url: 'https://pubmed.ncbi.nlm.nih.gov/2201659/', title: 'Acetyl-L-carnitine in the treatment of mildly demented elderly patients', year: 1990, design: 'RCT, controlled, double-blind' },
      { pmid: '36043711', doi: '10.2174/1381612828666220830092815', url: 'https://pubmed.ncbi.nlm.nih.gov/36043711/', title: 'Acetyl-L-carnitine Slows the Progression from Prefrailty to Frailty in Older Subjects: A Randomized Interventional Clinical Trial', year: 2022, design: 'RCT, randomized, observational, double-blind, placebo-controlled' },
      { pmid: '32408706', doi: '10.3390/nu12051389', url: 'https://pubmed.ncbi.nlm.nih.gov/32408706/', title: 'Acetyl-L-Carnitine in Dementia and Other Cognitive Disorders: A Critical Update', year: 2020, design: 'narrative/critical review' },
      { pmid: '38875437', doi: '10.1097/MD.0000000000038067', url: 'https://pubmed.ncbi.nlm.nih.gov/38875437/', title: 'Comparative study of choline alfoscerate as a combination therapy with donepezil: A mixed double-blind randomized controlled and open-label observation trial', year: 2024, design: 'RCT, mixed double-blind randomized controlled and open-label' },
      { pmid: '36940629', url: 'https://pubmed.ncbi.nlm.nih.gov/36940629/', title: 'Triggers for acute mood episodes in bipolar disorder: A systematic review.', year: 2023 },
      { pmid: '35311615', url: 'https://pubmed.ncbi.nlm.nih.gov/35311615/', title: 'Clinician guidelines for the treatment of psychiatric disorders with nutraceuticals and phytoceuticals: The World Federation of Societies of Biological Psychiatry (WFSBP) and Canadian Network for Mood and Anxiety Treatments (CANMAT) Taskforce.', year: 2022 },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'lutemax-2020',
    name: 'Lutemax 2020',
    category: 'vitamin',
    mechanism: 'Lutemax 2020 is a patented marigold extract providing lutein and two zeaxanthin isomers (RR- and RS-meso-zeaxanthin) in a roughly 5:1 ratio. These carotenoids accumulate in the macula of the eye and in brain tissue, where they filter high-energy blue light and neutralise reactive oxygen species. Supplementation raises macular pigment optical density (MPOD), a biomarker correlated with visual function and cognitive processing speed.',
    clinicalDose: '12–27mg/day total lutein + zeaxanthin in trials (lutein-dominant, roughly 5:1)',
    timeToEffect: 'Trials measured MPOD and cognitive changes after 6–12 months',
    studySummary: 'No published cognitive or eye-strain trial names Lutemax 2020 as its test material; the evidence comes from generic lutein and zeaxanthin trials. In healthy young adults, 12mg/day for 12 months raised MPOD and improved visual memory (Renzi-Hammond 2017 — co-authored by Abbott Nutrition staff, with material from DSM, a Lutemax competitor); 22mg/day for 12 months improved memory in adults with low macular pigment (Power 2018); and 13–27mg/day for 6 months improved memory, attention and processing speed (Stringham 2019). A 2023 meta-analysis found xanthophylls speed photostress (glare) recovery. The maker\'s own trial (Juturu 2016; two of three authors employed by OmniActive, which makes Lutemax) tested skin tone, not cognition. No trial has tested digital eye strain or sleep.',
    benefits: ['Macular pigment (MPOD) support', 'Faster glare recovery (xanthophyll meta-analysis)', 'Memory and processing speed in lutein/zeaxanthin trials (not Lutemax-specific)'],
    sideEffects: ['Generally very well tolerated — no serious adverse events in any trial reviewed', 'Mild carotenodermia (yellow skin tint) is a known class effect at very high doses, though not reported in the trials reviewed'],
    productsContaining: ['noocube-review'],
    humanEffects: [
      { effect: 'Memory & Processing Speed', evidenceStrength: 'preliminary', magnitude: 'small', studies: 3, notes: 'Three RCTs of lutein/zeaxanthin (12–27mg/day, 6–12 months) improved visual or composite memory, attention or processing speed; none named Lutemax 2020 as the material, and the dose and isomer mix differ from this product.' },
      { effect: 'Glare Recovery', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 2, notes: 'A 2023 meta-analysis found xanthophylls shortened photostress recovery by 2.35 seconds, and a 2020 meta-analysis links higher MPOD to better glare recovery (correlational). Evidence is for xanthophylls generally, not Lutemax 2020 specifically.' },
    ],
    howToTake: {
      dosage: '12–27mg/day total lutein + zeaxanthin (the range used in trials)',
      timing: 'With a meal — carotenoids are fat-soluble and require dietary fat for absorption.',
      withFood: 'Essential. Take with a fat-containing meal.',
      forms: 'Capsule (softgel preferred for lipid matrix). Lutemax 2020 is a branded lutein/zeaxanthin extract; the cognitive trials used other lutein/zeaxanthin materials. Generic lutein/zeaxanthin supplements may differ in isomer ratio and bioavailability.',
    },
    stacksWith: [
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'Lutein and zeaxanthin support macular pigment; L-Theanine supports calm attention. A common pairing for extended screen work, though the combination has not been tested.' },
      { ingredient: 'DHA (Omega-3)', slug: 'dha-omega-3', reason: 'DHA supports retinal cell membrane integrity while Lutemax provides antioxidant protection. Complementary eye and brain health support.' },
      { ingredient: 'Citicoline', slug: 'citicoline', reason: 'Citicoline supplies choline for acetylcholine and membranes; lutein and zeaxanthin support macular pigment. Different pathways, not tested together.' },
    ],
    faqs: [
      { question: 'Is Lutemax 2020 a nootropic?', answer: 'Not in the traditional sense. It does not directly modulate neurotransmitters. Lutein and zeaxanthin accumulate in the eye and brain, and generic lutein/zeaxanthin trials found small memory and processing-speed gains after 6–12 months — but no trial has tested Lutemax 2020 itself for cognition or eye strain.' },
      { question: 'Can I get enough lutein from diet?', answer: 'Lutein is found in egg yolks, spinach, kale, and corn. Most Western diets provide only 1-2mg/day — well below the 12–27mg/day used in the trials. Supplementation is the practical route to reach therapeutic levels.' },
      { question: 'How is Lutemax 2020 different from generic lutein?', answer: 'Lutemax 2020 provides both zeaxanthin isomers (RR- and RS-meso-zeaxanthin) in addition to lutein, in a roughly 5:1 lutein-to-zeaxanthin ratio. Generic lutein supplements typically provide only lutein or only one zeaxanthin form. No trial has compared Lutemax 2020 head-to-head with generic lutein.' },
      { question: 'Does it reduce eye strain from screens?', answer: 'Not shown. Our 2026 PubMed review found no trial testing lutein/zeaxanthin against digital eye strain, screen-related headache or eye fatigue. The measured effects are higher macular pigment and faster glare recovery, with MPOD and cognitive changes assessed after 6–12 months.' },
    ],
    sources: [
      { pmid: '37094947', doi: '10.1093/nutrit/nuad037', url: 'https://pubmed.ncbi.nlm.nih.gov/37094947/', title: 'Effect of xanthophyll-rich food and supplement intake on visual outcomes in healthy adults and those with eye disease: a systematic review, meta-analysis, and meta-regression of randomized controlled trials', year: 2023, design: 'systematic review + meta-analysis + meta-regression (25 RCTs meta-analyzed, 43 in systematic review)' },
      { pmid: '32792595', doi: '10.1038/s41433-020-01124-2', url: 'https://pubmed.ncbi.nlm.nih.gov/32792595/', title: 'The association between macular pigment optical density and visual function outcomes: a systematic review and meta-analysis', year: 2020, design: 'systematic review + meta-analysis (22 publications, correlational not interventional)' },
      { pmid: '29135938', doi: '10.3390/nu9111246', url: 'https://pubmed.ncbi.nlm.nih.gov/29135938/', title: 'Effects of a Lutein and Zeaxanthin Intervention on Cognitive Function: A Randomized, Double-Masked, Placebo-Controlled Trial of Younger Healthy Adults', year: 2017, design: 'RCT, parallel, double-masked, placebo-controlled' },
      { pmid: '31425700', doi: '10.1016/j.physbeh.2019.112650', url: 'https://pubmed.ncbi.nlm.nih.gov/31425700/', title: 'Effects of macular xanthophyll supplementation on brain-derived neurotrophic factor, pro-inflammatory cytokines, and cognitive performance', year: 2019, design: 'RCT, double-blind, placebo-controlled, 3-arm' },
      { pmid: '29332050', doi: '10.3233/JAD-170713', url: 'https://pubmed.ncbi.nlm.nih.gov/29332050/', title: 'Supplemental Retinal Carotenoids Enhance Memory in Healthy Individuals with Low Levels of Macular Pigment in A Randomized, Double-Blind, Placebo-Controlled Clinical Trial', year: 2018, design: 'RCT, double-blind, placebo-controlled' },
      { pmid: '27785083', doi: '10.2147/CCID.S115519', url: 'https://pubmed.ncbi.nlm.nih.gov/27785083/', title: 'Overall skin tone and skin-lightening-improving effects with oral supplementation of lutein and zeaxanthin isomers: a double-blind, placebo-controlled clinical trial', year: 2016, design: 'RCT, double-blind, placebo-controlled' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'oat-straw',
    name: 'Oat Straw Extract',
    category: 'herb',
    mechanism: 'Oat Straw (Avena sativa) extract works primarily by inhibiting phosphodiesterase type 4 (PDE4) and monoamine oxidase B (MAO-B). PDE4 inhibition increases cyclic AMP levels in neurons, enhancing dopaminergic signalling. MAO-B inhibition slows dopamine breakdown. Additionally, oat straw increases nitric oxide production for cerebral vasodilation and contains avenanthramides — unique anti-inflammatory compounds.',
    clinicalDose: '430–1600mg/day in trials; 800mg or less may be optimal — higher doses underperformed',
    timeToEffect: 'Acute effects within hours in single-dose trials; 4-week effects in one trial, none in a 12-week trial',
    studySummary: 'Four small RCTs, all with manufacturer involvement: a 2011 trial (Berry et al.) in elderly people with below-average cognition found a single 1600mg dose reduced Stroop errors, but 2400mg did no better than placebo; a 2012 trial by the same group found 1500mg/day for 12 weeks had no effect on any cognitive measure in healthy older adults (material supplied by Frutarom); a 2015 trial (Kennedy et al., two Frutarom employees as co-authors) found 800mg improved speed, delayed recall and executive function in adults 40–65 with memory complaints, concluding the optimal dose is at or below 800mg; and a 2020 trial (Kennedy et al., two Anklam Extrakt employees as co-authors) found 430–1290mg improved working memory and multitasking over 4 weeks, with no effect on mood. No trial has measured cerebral blood flow.',
    benefits: ['Acute attention and executive-function gains in small trials', 'Working memory and multitasking over 4 weeks (one trial)'],
    sideEffects: ['Generally well tolerated — no serious adverse events and no blood-pressure changes in the trials reviewed', 'Mild GI discomfort rare', 'Oats are often cross-contaminated with gluten during processing — choose a certified gluten-free product if you have celiac disease'],
    productsContaining: ['onnit-alpha-brain-review'],
    humanEffects: [
      { effect: 'Attention & Concentration', evidenceStrength: 'mixed', magnitude: 'small', studies: 4, notes: 'Acute gains at 800–1600mg (Berry 2011 in elderly people with below-average cognition; Kennedy 2015) and 4-week gains at 430–1290mg (Kennedy 2020), but a 12-week trial at 1500mg/day found no effect, and 2400mg failed where 1600mg worked.' },
      { effect: 'Stress Response', evidenceStrength: 'preliminary', magnitude: 'small', studies: 1, notes: 'Kennedy 2020: the highest dose (1290mg) reduced a physiological stress marker (electrodermal activity) after 4 weeks, but there was no effect on self-reported mood or anxiety at any dose.' },
    ],
    howToTake: {
      dosage: '430–1600mg/day of green oat extract; the dose-response is non-monotonic, and one trial found the optimal dose at or below 800mg',
      timing: 'Morning or before cognitive tasks. Single-dose trials tested effects over the following hours.',
      withFood: 'Can be taken with or without food. No significant absorption difference.',
      forms: 'Capsule or powder. Look for "green oat" or "Avena sativa" extract standardised to avenanthramides. Raw oat straw tea is not equivalent — the concentration is too low.',
    },
    stacksWith: [
      { ingredient: 'Alpha-GPC', slug: 'alpha-gpc', reason: 'Oat Straw supports dopaminergic signalling via MAO-B; Alpha-GPC supports cholinergic signalling. Complementary neurotransmitter coverage for focus.' },
      { ingredient: 'L-Tyrosine', slug: 'l-tyrosine', reason: 'Both support dopamine availability — Oat Straw by slowing breakdown (MAO-B), Tyrosine by providing precursor. Synergistic under stress.' },
      { ingredient: 'Bacopa Monnieri', slug: 'bacopa-monnieri', reason: 'Oat Straw provides acute attention benefits; Bacopa provides long-term memory consolidation. Covers both short-term and long-term cognitive needs.' },
    ],
    faqs: [
      { question: 'Is Oat Straw the same as oatmeal?', answer: 'No. Oat Straw extract comes from the green, unripe aerial parts of Avena sativa — harvested before the oat grain matures. The active compounds (avenanthramides, saponins) are concentrated in the green straw, not the grain. Eating oatmeal does not provide nootropic effects.' },
      { question: 'Is a higher dose better?', answer: 'Not in the trials. In Berry 2011, 1600mg reduced Stroop errors but 2400mg did no better than placebo, and Kennedy 2015 concluded the optimal dose was at or below 800mg. Doses of 430–1290mg worked over 4 weeks in Kennedy 2020.' },
      { question: 'Does Oat Straw contain gluten?', answer: 'Oats are technically gluten-free but are commonly cross-contaminated with wheat during processing. If you have celiac disease or severe gluten sensitivity, verify the supplement is certified gluten-free or avoid it entirely.' },
      { question: 'How does it compare to caffeine for focus?', answer: 'It is not a stimulant, and no trial has compared the two. The oat extract trials found small attention and working-memory gains without the typical stimulant side effects, but the evidence base is four small, manufacturer-linked trials — far thinner than caffeine\'s.' },
    ],
    sources: [
      { pmid: '21711204', doi: '10.1089/acm.2010.0450', url: 'https://pubmed.ncbi.nlm.nih.gov/21711204/', title: 'Acute effects of an Avena sativa herb extract on responses to the Stroop Color-Word test', year: 2011, design: 'RCT, double-blind, randomized, crossover' },
      { pmid: '22690320', doi: '10.3390/nu4050331', url: 'https://pubmed.ncbi.nlm.nih.gov/22690320/', title: 'Chronic effects of a wild green oat extract supplementation on cognitive performance in older adults: a randomised, double-blind, placebo-controlled, crossover trial', year: 2012, design: 'RCT, double-blind, placebo-controlled, crossover' },
      { pmid: '26618715', doi: '10.1080/1028415X.2015.1101304', url: 'https://pubmed.ncbi.nlm.nih.gov/26618715/', title: 'Acute effects of a wild green-oat (Avena sativa) extract on cognitive function in middle-aged adults: A double-blind, placebo-controlled, within-subjects trial', year: 2015, design: 'RCT, double-blind, placebo-controlled, crossover' },
      { pmid: '32485993', doi: '10.3390/nu12061598', url: 'https://pubmed.ncbi.nlm.nih.gov/32485993/', title: 'Acute and Chronic Effects of Green Oat (Avena sativa) Extract on Cognitive Function and Mood during a Laboratory Stressor in Healthy Adults', year: 2020, design: 'RCT, double-blind, randomised, parallel groups, dose-ranging' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'zynamite',
    name: 'Zynamite (Mangifera indica)',
    category: 'herb',
    mechanism: 'Zynamite is a patented extract of Mangifera indica (mango leaf) standardised to >60% mangiferin. Mangiferin is a potent polyphenol that inhibits catechol-O-methyltransferase (COMT), slowing the breakdown of dopamine and norepinephrine in the prefrontal cortex. This extends the active duration of catecholamines without increasing their production — a unique mechanism distinct from precursor-loading (L-Tyrosine) or synthesis-boosting (caffeine) approaches. Additionally, mangiferin has anti-inflammatory and antioxidant properties.',
    clinicalDose: '140–300mg/day (standardised to >60% mangiferin); 300mg showed no cognitive benefit in the largest trial',
    timeToEffect: 'Single-dose trials tested effects from 30 minutes to 5 hours; the largest found no cognitive benefit',
    studySummary: 'The largest and most independent trial (Dodd et al., 2024, n=114, Northumbria University with a PepsiCo co-author) gave a single 300mg dose of mango leaf extract and found no cognitive benefit — participants made more subtraction errors than on placebo. An earlier pilot (López-Ríos et al., 2020, n=16, all four authors Nektium employees) used 500mg, not 300mg, and found only a marginal reaction-time signal. Two sprint trials (2018, 2019; lead authors affiliated with Nektium, the manufacturer) combined 140mg with quercetin or luteolin and improved sprint power output, but measured no cognitive outcome. Three of the four trials are manufacturer-authored.',
    benefits: ['Sprint power output when combined with quercetin or luteolin (manufacturer-authored trials)', 'COMT inhibition (mechanism)'],
    sideEffects: ['Generally well tolerated — no serious adverse events in the four trials reviewed', 'Mild GI discomfort rare', 'Limited long-term safety data', 'MAO inhibitors: theoretical interaction only — mangiferin inhibits COMT rather than MAO, and no clinical reports were found'],
    productsContaining: ['thesis-nootropics-review'],
    humanEffects: [
      { effect: 'Reaction Time', evidenceStrength: 'mixed', magnitude: 'negligible', studies: 2, notes: 'At the 300mg dose, Dodd 2024 (n=114) found no cognitive benefit and more subtraction errors. The positive pilot (López-Ríos 2020, n=16, manufacturer-authored) used 500mg and reached significance only on a secondary percentage-change measure (p=0.049).' },
      { effect: 'Sprint Power Output', evidenceStrength: 'preliminary', magnitude: 'small', studies: 2, notes: 'Peak power rose 2.8–7% in two manufacturer-authored sprint trials when 140mg was combined with quercetin or luteolin; no cognitive test was given, so these do not show cognitive benefits under fatigue.' },
    ],
    howToTake: {
      dosage: '140–300mg/day — note that the one trial testing 300mg alone found no cognitive benefit',
      timing: 'Morning or 1 hour before demanding cognitive/physical tasks.',
      withFood: 'Can be taken with or without food.',
      forms: 'Capsule. Zynamite is a branded mango leaf extract standardised to >60% mangiferin; generic mango leaf products may contain far less mangiferin.',
    },
    stacksWith: [
      { ingredient: 'Caffeine', slug: 'caffeine', reason: 'Caffeine increases catecholamine release; Zynamite is proposed to slow their breakdown via COMT inhibition. The combination has not been tested in a cognitive trial.' },
      { ingredient: 'L-Tyrosine', slug: 'l-tyrosine', reason: 'Tyrosine provides dopamine precursor; Zynamite slows dopamine metabolism. Supply + preservation for sustained catecholamine levels.' },
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'L-Theanine smooths out any overstimulation from Zynamite\'s catecholamine-preserving effects. Balanced energy without agitation.' },
    ],
    faqs: [
      { question: 'Is Zynamite just mango leaf extract?', answer: 'Zynamite is a specific patented extract of Mangifera indica standardised to >60% mangiferin. Generic mango leaf supplements may contain far less mangiferin and are not equivalent. The sprint trials name Zynamite; the cognitive trials used mango leaf extract standardised to at least 60% mangiferin.' },
      { question: 'Is the evidence independent or manufacturer-funded?', answer: 'Three of the four human trials were authored by Nektium, the manufacturer. The only trial led by an independent academic group (Dodd 2024, n=114) tested the 300mg dose and found no cognitive benefit, with more subtraction errors than placebo.' },
      { question: 'Can I take Zynamite with caffeine?', answer: 'No trial has tested Zynamite with caffeine — the sports trials combined it with quercetin or luteolin. If you combine them, monitor your total stimulant load.' },
    ],
    sources: [
      { pmid: '32473365', doi: '10.1016/j.jep.2020.112996', url: 'https://pubmed.ncbi.nlm.nih.gov/32473365/', title: 'Central nervous system activities of extract Mangifera indica L.', year: 2020, design: '2 double-blind, randomized, placebo-controlled crossover pilot trials (plus in-vitro/EEG work)' },
      { pmid: '38665302', doi: '10.3389/fnut.2024.1298807', url: 'https://pubmed.ncbi.nlm.nih.gov/38665302/', title: 'Acute effects of mango leaf extract on cognitive function in healthy adults: a randomised, double-blind, placebo-controlled crossover study', year: 2024, design: 'RCT, double-blind, placebo-controlled, crossover' },
      { pmid: '31661850', doi: '10.3390/nu11112592', url: 'https://pubmed.ncbi.nlm.nih.gov/31661850/', title: 'A Single Dose of The Mango Leaf Extract Zynamite in Combination with Quercetin Enhances Peak Power Output During Repeated Sprint Exercise in Men and Women', year: 2019, design: 'RCT, double-blind, crossover, counterbalanced' },
      { pmid: '29937737', doi: '10.3389/fphys.2018.00740', url: 'https://pubmed.ncbi.nlm.nih.gov/29937737/', title: 'Mangifera indica L. Leaf Extract in Combination With Luteolin or Quercetin Enhances VO2peak and Peak Power Output, and Preserves Skeletal Muscle Function During Ischemia-Reperfusion in Humans', year: 2018, design: 'RCT, randomized, crossover' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
  {
    slug: 'dynamine',
    name: 'Dynamine (Methylliberine)',
    category: 'herb',
    mechanism: 'Dynamine (methylliberine) is a purine alkaloid found in kucha tea leaves, structurally related to caffeine and theacrine. It is described as blocking adenosine receptors (like caffeine) and inhibiting phosphodiesterase. In a 4-week trial at 100–150mg/day it produced no clinically significant changes in heart rate, blood pressure or blood biomarkers. No study has measured tolerance.',
    clinicalDose: '100–150mg/day (150mg is the highest dose tested in humans; 200mg has never been tested)',
    timeToEffect: 'Subjective effects measured 1–3 hours after dosing; onset speed has not been tested directly',
    studySummary: 'Only three human RCTs have tested methylliberine. The only one measuring cognition with methylliberine alone (La Monica et al., 2023, n=25, 100mg/day) found better self-rated concentration, motivation, mood and energy, but a negligible effect on objective cognitive tests (Stroop, Trail Making B). A 4-week safety trial (VanDusseldorp et al., 2020, n=125, 100–150mg/day) found no clinically significant cardiovascular or blood changes; it did not test cognition. A third trial (Cintineo 2022) tested it only inside a caffeine + theacrine combination. Both methylliberine-specific trials were funded in whole or part by Compound Solutions, which sells Dynamine, and a La Monica co-author holds patents on methylliberine.',
    benefits: ['Better self-rated energy, mood and motivation (one small RCT)', 'No clinically significant heart rate or blood pressure change over 4 weeks at 100–150mg'],
    sideEffects: ['Limited safety data: three human RCTs, both methylliberine-specific trials funded by the manufacturer', 'Objective cognition: no measurable effect on Stroop or Trail Making tests in the only trial that tested it', 'Mild GI discomfort possible', 'Possible interaction with caffeine (additive stimulation)', 'Not recommended during pregnancy (precautionary: no pregnancy data)'],
    productsContaining: ['thesis-nootropics-review'],
    humanEffects: [
      { effect: 'Subjective Energy', evidenceStrength: 'preliminary', magnitude: 'moderate', studies: 1, notes: 'La Monica 2023 (n=25, 100mg/day for 3 days): higher self-rated energy and sustained energy versus placebo over the 3 hours after dosing.' },
      { effect: 'Focus & Motivation', evidenceStrength: 'mixed', magnitude: 'small', studies: 1, notes: 'Self-rated concentration and motivation improved, but objective tests (Stroop, Trail Making B) in the same trial showed a negligible effect on cognitive function.' },
      { effect: 'Cardiovascular Safety', evidenceStrength: 'moderate', magnitude: 'negligible', studies: 1, notes: 'VanDusseldorp 2020 (n=125, 4 weeks): no clinically significant change in heart rate, blood pressure, QTc or blood biomarkers at 100–150mg/day, alone or with theacrine.' },
    ],
    howToTake: {
      dosage: '100–150mg/day — no human trial has tested more than 150mg',
      timing: 'As needed, before tasks. The trial measured effects over the 3 hours after dosing; effects on sleep have not been studied.',
      withFood: 'Can be taken with or without food.',
      forms: 'Capsule. Dynamine is a trademarked ingredient from Compound Solutions. Not available as a standalone consumer product — found only in pre-formulated stacks like Thesis.',
    },
    stacksWith: [
      { ingredient: 'Caffeine', slug: 'caffeine', reason: 'A common pairing in pre-formulated stacks. In tactical personnel, 150mg caffeine + 100mg methylliberine + 50mg theacrine matched 300mg caffeine on vigilance reaction time with a smaller diastolic blood pressure rise (Cintineo 2022) — but that tests the combination, not Dynamine alone.' },
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'L-Theanine is commonly paired with stimulants for calmer focus, though in a controlled caffeine trial it did not significantly reduce jitteriness, and the combination with Dynamine has not been tested.' },
      { ingredient: 'Zynamite', slug: 'zynamite', reason: 'Dynamine provides acute adenosine blockade; Zynamite extends dopamine via COMT inhibition. Together found in Thesis blends for multi-pathway stimulation.' },
    ],
    faqs: [
      { question: 'How is Dynamine different from caffeine?', answer: 'It is a related purine alkaloid, but its evidence base is far thinner: three small human RCTs versus decades of caffeine research. In a 4-week trial at 100–150mg/day it caused no clinically significant heart rate or blood pressure change, and in the one cognition trial it improved self-rated energy and mood but not objective test performance. No trial has compared its onset, duration or sleep effects head-to-head with caffeine.' },
      { question: 'Does Dynamine build tolerance like caffeine?', answer: 'Unknown. No study has measured tolerance to methylliberine; the 4-week trial measured safety markers, not whether effects fade. Claims of "minimal tolerance" are not supported by any published trial.' },
      { question: 'Can I buy Dynamine on its own?', answer: 'Not easily. Dynamine (methylliberine) is a trademarked ingredient from Compound Solutions and is primarily available in pre-formulated stacks (e.g., Thesis nootropics). Standalone Dynamine capsules are rare on the consumer market.' },
      { question: 'Is it safe to combine Dynamine with caffeine?', answer: 'Yes — this is a common combination in performance supplements. Since both block adenosine, the stimulant effects are additive. Keep total combined caffeine + Dynamine intake moderate and monitor for overstimulation (anxiety, restlessness). Start with low doses of each.' },
    ],
    sources: [
      { pmid: '37960163', doi: '10.3390/nu15214509', url: 'https://pubmed.ncbi.nlm.nih.gov/37960163/', title: 'Methylliberine Ingestion Improves Various Indices of Affect but Not Cognitive Function in Healthy Men and Women', year: 2023, design: 'double-blind, randomized, within-subject crossover RCT (La Monica et al.)' },
      { pmid: '32121218', doi: '10.3390/nu12030654', url: 'https://pubmed.ncbi.nlm.nih.gov/32121218/', title: 'Safety of Short-Term Supplementation with Methylliberine (Dynamine) Alone and in Combination with TeaCrine in Young Adults', year: 2020, design: 'randomized controlled trial, 5 parallel groups' },
      { pmid: '36016763', doi: '10.1080/15502783.2022.2113339', url: 'https://pubmed.ncbi.nlm.nih.gov/36016763/', title: 'Effects of caffeine, methylliberine, and theacrine on vigilance, marksmanship, and hemodynamic responses in tactical personnel: a double-blind, randomized, placebo-controlled trial', year: 2022, design: 'between-subjects, randomized, placebo-controlled RCT' },
    ],
    evidenceReviewedAt: '2026-09-28',
  },
];
