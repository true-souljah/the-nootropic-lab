export interface HumanEffect {
  effect: string;
  evidenceStrength: 'strong' | 'moderate' | 'preliminary' | 'mixed';
  magnitude: 'large' | 'moderate' | 'small' | 'negligible';
  studies: number;
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
}

export const ingredients: Ingredient[] = [
  {
    slug: 'lions-mane',
    name: "Lion's Mane",
    category: 'mushroom',
    mechanism: "Lion's Mane (Hericium erinaceus) stimulates the synthesis of Nerve Growth Factor (NGF) via hericenones and erinacines. NGF promotes neuronal survival, differentiation, and maintenance of neurons in the hippocampus and cortex — regions central to learning and memory.",
    clinicalDose: '500–1000mg/day (standardised fruiting body extract)',
    timeToEffect: '4–8 weeks of consistent use',
    studySummary: "A 2009 double-blind, placebo-controlled trial (Mori et al.) found significant improvements in cognitive function scores in mild cognitive impairment subjects after 16 weeks of 3g/day. A 2020 study found measurable nerve regeneration effects at 500mg standardised extract. Evidence is strongest for long-term neuroprotection rather than acute effects.",
    benefits: ['Long-term memory support', 'Neuroprotection', 'Nerve regeneration (NGF)', 'Mood support via gut-brain axis'],
    sideEffects: ['Generally well tolerated', 'Rare: mild GI discomfort at high doses', 'Possible mushroom allergy in sensitive individuals'],
    productsContaining: ['mind-lab-pro-review', 'alpha-brain-review', 'hunter-focus-review'],
    humanEffects: [
      { effect: 'Memory & Learning', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 4, notes: 'Most pronounced after 8+ weeks; effects on mild cognitive impairment stronger than healthy adults.' },
      { effect: 'NGF Synthesis', evidenceStrength: 'moderate', magnitude: 'large', studies: 3, notes: 'Well established in cell and animal studies; human NGF data emerging.' },
      { effect: 'Mood & Anxiety', evidenceStrength: 'preliminary', magnitude: 'small', studies: 2, notes: 'Small RCTs in menopausal women; gut-brain axis pathway proposed.' },
      { effect: 'Nerve Regeneration', evidenceStrength: 'preliminary', magnitude: 'moderate', studies: 2, notes: 'Promising peripheral nerve data; central nervous system evidence still early.' },
    ],
    howToTake: {
      dosage: '500–1000mg/day',
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
      { question: 'How long before I notice results?', answer: "Lion's Mane works via NGF upregulation, which is a slow biological process. Most people notice improvements in mental clarity and recall after 4–8 weeks of daily use. Do not judge this supplement at 2 weeks — the RCT showing cognitive improvement ran for 16 weeks." },
      { question: 'Can I take Lion\'s Mane every day?', answer: "Yes. Unlike some adaptogens, Lion's Mane does not require cycling. Daily consistent use is both safe and necessary for the cumulative NGF effect to build up." },
      { question: "Does Lion's Mane interact with any medications?", answer: "No significant drug interactions are documented at normal doses. Use caution if you have a mushroom allergy or are on blood-thinning medications, as some compounds have mild platelet effects at high doses. Always check with your doctor if you are on prescription drugs." },
      { question: 'What does the research actually show for healthy adults?', answer: "Studies in healthy adults are smaller than those in cognitive-decline populations. A 2020 pilot RCT found improvements in processing speed and stress scores. Effects are subtler in healthy people — think long-term brain maintenance rather than a dramatic day-one boost." },
    ],
  },
  {
    slug: 'bacopa-monnieri',
    name: 'Bacopa Monnieri',
    category: 'herb',
    mechanism: 'Bacopa enhances synaptic communication by increasing dendritic branching and synaptic density. Its active compounds (bacosides A and B) facilitate repair of damaged neurons and upregulate antioxidant activity, reducing oxidative stress in hippocampal tissue. It also modulates serotonin and acetylcholine systems.',
    clinicalDose: '300–450mg/day (standardised to 55% bacosides)',
    timeToEffect: '6–12 weeks of consistent use',
    studySummary: 'A meta-analysis of 9 RCTs (Kongkeaw et al., 2014) found Bacopa significantly improved attention, cognitive processing, and working memory versus placebo. Effects are cumulative — most studies measure outcomes at 8–12 weeks. Best evidence is for memory consolidation rather than acute recall.',
    benefits: ['Memory consolidation', 'Reduced cognitive decline', 'Anxiety reduction', 'Antioxidant neuroprotection'],
    sideEffects: ['GI discomfort at high doses (take with food)', 'Slowed information processing initially', 'Not recommended during pregnancy'],
    productsContaining: ['mind-lab-pro-review', 'noocube-review', 'alpha-brain-review', 'hunter-focus-review', 'braineffect-focus-review', 'brainzyme-focus-pro-review'],
    humanEffects: [
      { effect: 'Memory Consolidation', evidenceStrength: 'strong', magnitude: 'moderate', studies: 9, notes: 'Meta-analysis of 9 RCTs confirms effects on new memory formation; long-term recall improves more than immediate recall.' },
      { effect: 'Anxiety Reduction', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 5, notes: 'Significant in anxious populations; more modest in healthy low-stress subjects.' },
      { effect: 'Attention', evidenceStrength: 'moderate', magnitude: 'small', studies: 6, notes: 'Improvements are modest acutely; significant when measured at 12-week mark.' },
      { effect: 'Processing Speed', evidenceStrength: 'mixed', magnitude: 'small', studies: 4, notes: 'Some studies show initial slowing of processing speed before 6 weeks — this is a known temporary effect that reverses.' },
    ],
    howToTake: {
      dosage: '300–450mg/day (standardised to 55% bacosides)',
      timing: 'With your largest meal of the day — morning or evening both work',
      withFood: 'Bacosides are fat-soluble. Taking Bacopa with food (especially a meal with dietary fat) improves bioavailability significantly. Do not take on an empty stomach.',
      forms: 'Capsule is most practical. Powder has a bitter, unpleasant taste. Look for standardisation to at least 40–55% bacosides on the label — unstandardised herbal products may contain very little active compound.',
    },
    stacksWith: [
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: 'The definitive long-term memory stack. Bacopa improves synaptic density and memory consolidation; Lion\'s Mane drives NGF synthesis and neuroprotection. Both are slow-acting and complement each other without overlap.' },
      { ingredient: 'Citicoline', slug: 'citicoline', reason: 'Citicoline provides the acute focus and acetylcholine boost that Bacopa lacks in the short term, while Bacopa handles long-term memory consolidation. A well-rounded pairing found in Mind Lab Pro.' },
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'Both have anxiolytic properties. L-Theanine provides immediate calm focus; Bacopa builds long-term stress resilience. The combination is gentle and well-tolerated.' },
    ],
    faqs: [
      { question: 'Why do some people feel "foggy" when starting Bacopa?', answer: 'A minority of users experience a temporary initial slowing of mental processing — sometimes called the "Bacopa fog." This is linked to the serotonin modulation and typically resolves after 3–4 weeks. It reflects the herb\'s mechanism working, not a problem. If it persists past 6 weeks, reduce your dose.' },
      { question: 'Do I really need to take it with fat?', answer: "Yes, this matters. Bacosides are fat-soluble compounds. Studies testing Bacopa in fasted subjects show significantly lower plasma levels than those taking it with a meal. A tablespoon of olive oil, a handful of nuts, or any normal meal with fat is sufficient." },
      { question: 'What percentage of bacosides should I look for?', answer: 'Aim for 40–55% bacosides standardisation. The two most-studied commercial extracts (Bacognize and Synapsa) are both standardised. Generic "Bacopa" with no standardisation stated is unreliable — the active compound content may be negligible.' },
      { question: 'How long does it take to work?', answer: 'Studies consistently show 8–12 weeks for measurable memory improvements. This is not a supplement you evaluate in the first month. Think of it like strength training — the adaptations are real but take time. Set a calendar reminder to assess at 10 weeks.' },
      { question: 'Can Bacopa be taken long-term?', answer: 'Yes. Long-term safety data is positive. Most Ayurvedic use is continuous without cycling. Some people choose to cycle (12 weeks on / 4 weeks off) to maintain sensitivity, but no evidence suggests this is necessary.' },
    ],
  },
  {
    slug: 'citicoline',
    name: 'Citicoline (CDP-Choline)',
    category: 'cholinergic',
    mechanism: "Citicoline (cytidine 5'-diphosphocholine) is a precursor to both acetylcholine and phosphatidylcholine. It boosts acetylcholine synthesis in the brain — the neurotransmitter central to attention, learning, and memory encoding. It also supports neuronal membrane integrity by replenishing phospholipids.",
    clinicalDose: '250–500mg/day',
    timeToEffect: 'Acute effects within 1–2 hours; optimal at 4–6 weeks',
    studySummary: 'Multiple RCTs (Spiers et al., 1996; Secades & Lorenzo, 2006) show citicoline improves attention, working memory, and verbal memory in healthy adults and cognitive decline patients. It is one of the most bioavailable choline sources — studies show ~18% greater cognitive improvement compared to choline bitartrate.',
    benefits: ['Attention and focus', 'Working memory', 'Brain energy metabolism', 'Neuroprotection'],
    sideEffects: ['Very well tolerated', 'Rare: headache at very high doses', 'Insomnia if taken late in the day'],
    productsContaining: ['mind-lab-pro-review', 'performance-lab-mind-review'],
    humanEffects: [
      { effect: 'Attention & Focus', evidenceStrength: 'strong', magnitude: 'moderate', studies: 8, notes: 'One of the best-evidenced acute cognitive effects in the nootropic category.' },
      { effect: 'Working Memory', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 6, notes: 'Significant improvements in digit span and working memory tasks.' },
      { effect: 'Brain Energy Metabolism', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 4, notes: 'fMRI studies confirm increased frontal lobe ATP production.' },
      { effect: 'Neuroprotection', evidenceStrength: 'moderate', magnitude: 'large', studies: 5, notes: 'Strongest effects in stroke recovery and TBI models; effects in healthy adults are maintenance-level.' },
    ],
    howToTake: {
      dosage: '250–500mg/day',
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
      { question: 'Citicoline vs choline bitartrate — what is the difference?', answer: "Citicoline is significantly superior. It crosses the blood-brain barrier more efficiently and provides two active components: choline (for acetylcholine) and cytidine (which converts to uridine, a brain membrane building block). Choline bitartrate provides choline only and crosses the BBB poorly. Studies show ~18% greater cognitive effect for citicoline at equivalent choline doses." },
      { question: 'Should I split my dose?', answer: 'At 250mg, a single morning dose is fine. At 500mg, some people split it into 250mg morning and 250mg early afternoon for smoother coverage. Avoid any dose after 2–3pm as the mildly activating effect can delay sleep onset.' },
      { question: 'I got a headache after taking citicoline — is this normal?', answer: 'A headache from citicoline at standard doses (250–500mg) is unusual and may indicate you are sensitive to cholinergic compounds or already getting significant choline from diet/other supplements. Try reducing to 250mg and do not combine with Alpha-GPC or other choline sources on the same day.' },
      { question: 'Cognizin vs generic CDP-Choline — does the brand matter?', answer: 'Cognizin is the most clinically validated form and is tested for purity. Generic CDP-Choline can be fine if sourced from reputable suppliers, but quality varies more. For critical cognitive work, the premium branded form is worth the marginal cost increase.' },
    ],
  },
  {
    slug: 'l-theanine',
    name: 'L-Theanine',
    category: 'amino',
    mechanism: 'L-theanine is a non-protein amino acid found primarily in green tea. It crosses the blood-brain barrier and increases alpha brain wave activity, producing alert relaxation. It also modulates GABA, serotonin, and dopamine levels, and works synergistically with caffeine to reduce its anxiogenic effects while preserving stimulant benefits.',
    clinicalDose: '100–200mg/day (often paired with caffeine at 1:2 ratio)',
    timeToEffect: '30–60 minutes (acute)',
    studySummary: 'A 2008 RCT (Haskell et al.) found the L-theanine + caffeine combination significantly improved attention and alertness vs. either compound alone. Multiple studies confirm alpha wave induction within 45 minutes. It is one of the best-evidenced acute nootropics for calm focus without sedation.',
    benefits: ['Calm focus without sedation', 'Reduced caffeine jitteriness', 'Stress reduction', 'Improved sleep quality'],
    sideEffects: ['Extremely well tolerated', 'Possible mild sedation at high doses', 'Generally considered very safe'],
    productsContaining: ['mind-lab-pro-review', 'noocube-review', 'thesis-review', 'brainzyme-focus-pro-review'],
    humanEffects: [
      { effect: 'Calm Focus (Alpha Waves)', evidenceStrength: 'strong', magnitude: 'moderate', studies: 12, notes: 'Robust EEG evidence showing alpha wave increase within 45 minutes. One of the most replicable effects in nootropic research.' },
      { effect: 'Anxiety Reduction', evidenceStrength: 'strong', magnitude: 'moderate', studies: 10, notes: 'Significant in both healthy and anxious populations. Effect is notable at 200mg and above.' },
      { effect: 'Sleep Quality', evidenceStrength: 'moderate', magnitude: 'small', studies: 5, notes: 'Reduces sleep latency and improves sleep quality ratings, particularly when combined with magnesium.' },
      { effect: 'Caffeine Synergy', evidenceStrength: 'strong', magnitude: 'large', studies: 8, notes: 'The combination outperforms either compound alone. L-Theanine blunts caffeine jitters while preserving alertness — the best-evidenced nootropic stack in existence.' },
    ],
    howToTake: {
      dosage: '100–200mg per dose',
      timing: '30 minutes before your cognitive work session or 30 minutes before caffeine',
      withFood: 'No significant food interaction. Can be taken on an empty stomach. Absorption is reliable regardless of meal timing.',
      forms: 'Capsule or powder. Suntheanine is the most studied branded L-Theanine (from enzymatic synthesis, identical to tea-derived theanine). Bulk L-Theanine powder dissolves in water but is subtly sweet and easy to mix.',
    },
    stacksWith: [
      { ingredient: 'Caffeine', slug: 'l-theanine', reason: 'The most studied nootropic stack. Use a 2:1 L-Theanine:caffeine ratio (e.g. 200mg theanine + 100mg caffeine). L-Theanine removes the jitteriness and crash while caffeine provides stimulation. This pairing is found in virtually every quality pre-work stack.' },
      { ingredient: 'Bacopa Monnieri', slug: 'bacopa-monnieri', reason: 'Both have anxiolytic properties working via different mechanisms. L-Theanine provides immediate calm; Bacopa builds sustained stress tolerance over weeks. A gentle, non-sedating anxiety-reduction combination.' },
      { ingredient: 'Ashwagandha', slug: 'ashwagandha', reason: 'Both reduce cortisol and anxiety through distinct pathways (alpha waves + GABA for theanine; HPA axis for ashwagandha). Good daytime anxiety stack without sedation.' },
    ],
    faqs: [
      { question: 'What is the ideal ratio of L-Theanine to caffeine?', answer: 'The most studied and widely recommended ratio is 2:1 theanine to caffeine. So with a standard 100mg caffeine dose (approximately one cup of coffee), take 200mg L-Theanine. This ratio maximises the synergistic benefit — higher theanine ratios can dampen the alerting effect of caffeine too much.' },
      { question: 'Does L-Theanine work without caffeine?', answer: "Yes. L-Theanine has standalone effects — alpha wave induction and anxiety reduction occur independent of caffeine. If you don't consume caffeine, L-Theanine alone at 200mg produces a calm, grounded focus state. It's not stimulating on its own, just relaxing without drowsiness." },
      { question: 'Is it safe to take L-Theanine every day?', answer: 'Yes. Green tea contains theanine and has been consumed daily for millennia without toxicity concerns. No tolerance develops. Chronic daily use is both safe and effective. No cycling required.' },
      { question: 'Why take a supplement when I can just drink green tea?', answer: 'A standard cup of green tea contains ~25–50mg of L-Theanine — well below the 100–200mg therapeutic dose. You would need 4–8 cups of green tea to match a single supplement dose, along with a significant caffeine load. Supplements allow precise dosing without unwanted caffeine.' },
      { question: 'Can L-Theanine help with sleep if taken at night?', answer: "Yes. 200mg taken 30–60 minutes before bed can reduce sleep latency and improve sleep quality ratings. It doesn't cause sedation — it promotes relaxation. Some people combine it with magnesium glycinate (200–400mg) for an effective non-pharmaceutical sleep support stack." },
    ],
  },
  {
    slug: 'rhodiola-rosea',
    name: 'Rhodiola Rosea',
    category: 'adaptogen',
    mechanism: "Rhodiola is an adaptogen that modulates the HPA (hypothalamic-pituitary-adrenal) axis, reducing cortisol output under stress. Its key bioactives (rosavins and salidroside) inhibit monoamine oxidase enzymes, increasing availability of dopamine, serotonin, and norepinephrine — neurotransmitters involved in motivation, mood, and cognitive stamina.",
    clinicalDose: '200–600mg/day (standardised to 3% rosavins, 1% salidroside)',
    timeToEffect: '1–2 weeks for baseline effects; acute anti-fatigue within hours',
    studySummary: 'A 2009 RCT (Shevtsov et al.) found significant reductions in mental fatigue and improved cognitive function in night-shift physicians after single doses. A larger 2012 Swedish study confirmed sustained benefits for stress-induced burnout over 12 weeks. Strongest evidence for anti-fatigue and stress resilience.',
    benefits: ['Mental fatigue reduction', 'Stress resilience', 'Physical endurance', 'Mood stabilisation'],
    sideEffects: ['Generally safe', 'Mild activation/restlessness initially', 'Not recommended with MAO inhibitors', 'Avoid late evening dosing'],
    productsContaining: ['mind-lab-pro-review', 'qualia-mind-review'],
    humanEffects: [
      { effect: 'Mental Fatigue Reduction', evidenceStrength: 'strong', magnitude: 'large', studies: 9, notes: 'Most consistent effect across trials. Particularly strong in sleep-deprived or high-stress subjects.' },
      { effect: 'Stress Resilience', evidenceStrength: 'strong', magnitude: 'moderate', studies: 7, notes: 'HPA axis modulation is well established. Effects strongest under chronic stress conditions.' },
      { effect: 'Physical Endurance', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 5, notes: 'VO2 max and time-to-exhaustion improvements documented. Less consistent than cognitive effects.' },
      { effect: 'Mood Stabilisation', evidenceStrength: 'moderate', magnitude: 'small', studies: 6, notes: 'Significant in burnout and mild depression studies. Effects in non-clinical populations are subtler.' },
    ],
    howToTake: {
      dosage: '200–600mg/day (standardised to 3% rosavins, 1% salidroside)',
      timing: 'Morning, on an empty stomach — 30 minutes before breakfast. Rhodiola is mildly stimulating; evening doses commonly cause insomnia.',
      withFood: 'Take on an empty stomach for best absorption. The 30-minute pre-meal window is consistent across most clinical protocols. A small amount of food is fine but a full meal reduces absorption.',
      cycling: '4–6 weeks on, 1–2 weeks off. Rhodiola can lose efficacy with continuous daily use over several months. Regular cycling maintains adaptogenic response.',
      forms: 'Capsule. Always verify standardisation: 3% rosavins and 1% salidroside is the established ratio used in most clinical trials. Products without stated standardisation may be significantly under-dosed on active compounds.',
    },
    stacksWith: [
      { ingredient: 'Ashwagandha', slug: 'ashwagandha', reason: 'The classic adaptogen stack. Rhodiola is activating (raises norepinephrine, best morning); Ashwagandha is calming (lowers cortisol, best evening). Together they provide full-day HPA axis support without one cancelling the other out.' },
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'Rhodiola\'s activating effect pairs well with L-Theanine\'s calming alpha-wave induction. Use Rhodiola for cognitive stamina; L-Theanine to soften any agitation or restlessness Rhodiola can cause initially.' },
      { ingredient: 'L-Tyrosine', slug: 'l-tyrosine', reason: 'Both target performance under stress via different mechanisms. Rhodiola modulates cortisol/monoamine levels; Tyrosine replenishes catecholamine substrate. Strong combination for high-demand cognitive days or night shifts.' },
    ],
    faqs: [
      { question: 'Why does Rhodiola need to be cycled?', answer: 'Adaptogens generally exhibit a "ceiling effect" with prolonged continuous use — the body adapts to their HPA-modulating signals and response diminishes. A 1–2 week break every 4–6 weeks resets sensitivity. This cycling pattern was used in most of the positive clinical trials.' },
      { question: 'What does 3% rosavins / 1% salidroside mean?', answer: "These are the two main bioactive compound classes in Rhodiola. The 3:1 ratio mirrors what is found in wild-harvested Rhodiola rosea and was established in Soviet-era research as the optimal therapeutic ratio. Products standardised only to salidroside may use Rhodiola crenulata (Chinese rhodiola) which has a different and less-studied compound profile." },
      { question: 'Can Rhodiola cause anxiety or jitteriness?', answer: 'In a minority of people, especially at doses above 400mg, Rhodiola can cause a stimulant-like restlessness or mild anxiety — particularly in the first week as the monoamine oxidase inhibition kicks in. Start at 200mg and increase gradually. Taking it with L-Theanine significantly reduces this effect.' },
      { question: 'Is Rhodiola safe to take with antidepressants?', answer: 'No — not without medical supervision. Rhodiola inhibits monoamine oxidase and may interact with SSRIs, MAOIs, and other antidepressants to cause serotonin syndrome. Always consult your doctor if you are on any psychiatric medication.' },
    ],
  },
  {
    slug: 'phosphatidylserine',
    name: 'Phosphatidylserine',
    category: 'cholinergic',
    mechanism: 'Phosphatidylserine (PS) is a phospholipid that forms a critical component of neuronal cell membranes. It supports signal transduction across synapses, facilitates acetylcholine and dopamine release, and modulates cortisol secretion. Supplementation replenishes PS levels that decline naturally with age.',
    clinicalDose: '100–300mg/day (soy-free sunflower-derived preferred)',
    timeToEffect: '4–6 weeks for memory effects; cortisol reduction within 2 weeks',
    studySummary: "FDA allows a qualified health claim for PS and reduced risk of dementia. Multiple RCTs (Crook et al., 1991; Cenacchi et al., 1993) show improvements in memory, learning, and concentration in age-related cognitive decline. The 2010 soy-free sunflower-derived form shows equivalent bioavailability to the original bovine-cortex-derived PS used in older trials.",
    benefits: ['Memory recall speed', 'Cortisol reduction under stress', 'Age-related cognitive support', 'Focus and processing speed'],
    sideEffects: ['Well tolerated', 'Mild GI discomfort in some users', 'Blood-thinning interaction possible at high doses'],
    productsContaining: ['mind-lab-pro-review', 'qualia-mind-review', 'performance-lab-mind-review', 'hunter-focus-review'],
    humanEffects: [
      { effect: 'Memory Recall', evidenceStrength: 'strong', magnitude: 'moderate', studies: 11, notes: 'Particularly strong in age-related memory decline populations; effects in young healthy adults are more modest.' },
      { effect: 'Cortisol Reduction', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 6, notes: 'Significant blunting of cortisol response to exercise and psychological stress. Onset within 1–2 weeks.' },
      { effect: 'Processing Speed', evidenceStrength: 'moderate', magnitude: 'small', studies: 5, notes: 'Improved reaction time and cognitive processing speed, especially in older adults.' },
      { effect: 'Age-Related Cognitive Decline', evidenceStrength: 'strong', magnitude: 'moderate', studies: 8, notes: 'PS has an FDA qualified health claim for reduced risk of dementia based on this body of evidence.' },
    ],
    howToTake: {
      dosage: '100–300mg/day',
      timing: 'With meals — split doses across 2–3 meals for best results (e.g. 100mg with breakfast, 100mg with lunch)',
      withFood: 'PS is a fat-soluble phospholipid and absorbs best with dietary fat. Always take with food. Splitting doses across meals is better than a single large dose.',
      forms: 'Capsule (softgel preferred). There are three source types: (1) Soy-derived — most common, cheapest, effective but contains soy; (2) Sunflower-derived — soy-free, same efficacy, preferred option; (3) Bovine-brain-derived — used in original 1990s trials, no longer commercially available due to BSE concerns. Sharp-PS from sunflower is the benchmark form.',
    },
    stacksWith: [
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: 'PS maintains cell membrane integrity while Lion\'s Mane drives NGF synthesis. Both support long-term brain health via complementary structural and growth-factor pathways.' },
      { ingredient: 'Citicoline', slug: 'citicoline', reason: 'Both are membrane phospholipid precursors, but they work on different pathways. Citicoline primarily builds phosphatidylcholine; PS addresses phosphatidylserine. Together they provide comprehensive neuronal membrane support.' },
      { ingredient: 'Omega-3 (DHA)', slug: 'phosphatidylserine', reason: 'DHA is a structural component of neuronal membranes that works synergistically with PS. Some clinical PS products are DHA-conjugated (PS-DHA). Taking PS with a fish oil supplement is a well-validated combination.' },
    ],
    faqs: [
      { question: 'Soy-derived vs sunflower PS — which is better?', answer: 'Both are effective. Sunflower-derived PS (Sharp-PS) is soy-free and is the preferred option for anyone with soy sensitivity or wishing to avoid soy. Bioavailability studies show equivalent plasma levels between the two. Sunflower PS is slightly more expensive but widely available in quality supplements.' },
      { question: 'What is the FDA health claim for PS?', answer: "The FDA allows a qualified health claim stating: 'Consumption of phosphatidylserine may reduce the risk of dementia and cognitive dysfunction in the elderly.' This is a qualified claim (not a full claim) because the evidence, while substantial, did not meet the full threshold for a conventional health claim. It is nonetheless one of the strongest regulatory positions any supplement ingredient holds." },
      { question: 'What about the bovine brain source I see mentioned in older studies?', answer: 'Original 1990s PS trials used bovine-cortex-derived PS. This source was discontinued globally after BSE (mad cow disease) concerns in the early 2000s. All current commercial PS is plant-derived (soy or sunflower). The plant-derived forms have been validated in subsequent trials and show equivalent efficacy.' },
      { question: 'Does PS interact with blood thinners?', answer: 'At standard doses (up to 300mg/day), no significant interaction is documented. At very high doses (>600mg/day), a theoretical platelet aggregation effect exists. If you are on warfarin, aspirin, or other anticoagulants, consult your doctor before supplementing PS.' },
    ],
  },
  {
    slug: 'alpha-gpc',
    name: 'Alpha-GPC',
    category: 'cholinergic',
    mechanism: 'Alpha-GPC (alpha-glycerylphosphorylcholine) is the most bioavailable choline precursor. It delivers choline directly across the blood-brain barrier, where it is used to synthesise acetylcholine. It also stimulates growth hormone secretion and supports cell membrane phospholipid synthesis.',
    clinicalDose: '300–600mg/day',
    timeToEffect: '1–2 hours (acute); optimal cognitive effects at 4 weeks',
    studySummary: "Italian multicenter trials (De Jesus Moreno, 2003) in Alzheimer's patients found Alpha-GPC improved memory scores more than placebo over 90 days. Sports studies (Bellar et al., 2015) confirm power output increases in athletes at 600mg. Of all choline sources, Alpha-GPC has the strongest acute cognitive data.",
    benefits: ['Acetylcholine synthesis', 'Memory encoding', 'Athletic power output', 'Neuroprotection'],
    sideEffects: ['Well tolerated', 'Headache if combined with other cholinergics', 'Potential cardiovascular concern at very high doses (>1200mg/day)'],
    productsContaining: ['noocube-review', 'qualia-mind-review', 'alpha-brain-review', 'thesis-review'],
    humanEffects: [
      { effect: 'Acetylcholine Synthesis', evidenceStrength: 'strong', magnitude: 'large', studies: 9, notes: 'Among the most bioavailable choline sources. Brain choline levels measurably increase within 1 hour of ingestion.' },
      { effect: 'Memory Encoding', evidenceStrength: 'strong', magnitude: 'moderate', studies: 7, notes: 'Strong evidence in Alzheimer\'s trials; effects in healthy adults confirmed at 400–600mg.' },
      { effect: 'Athletic Power Output', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 3, notes: '600mg pre-workout increases peak power output. Effect is acute, not cumulative.' },
      { effect: 'Neuroprotection', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 4, notes: 'Membrane phospholipid replenishment pathway supports long-term neuronal health.' },
    ],
    howToTake: {
      dosage: '300–600mg/day',
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
      { question: 'Is there a cardiovascular risk with Alpha-GPC?', answer: 'A 2021 observational study suggested a possible association between high Alpha-GPC intake (>1200mg/day) and cardiovascular events via TMAO production. This was in older adults at very high doses. At standard supplementation doses (300–600mg/day) in healthy individuals, no cardiovascular signal has been found in controlled trials. The benefit/risk profile at standard doses is positive.' },
    ],
  },
  {
    slug: 'ashwagandha',
    name: 'Ashwagandha (KSM-66)',
    category: 'adaptogen',
    mechanism: 'Ashwagandha (Withania somnifera) is an Ayurvedic adaptogen. Its withanolides modulate the HPA axis to reduce cortisol, while also inhibiting acetylcholinesterase (preserving acetylcholine) and promoting GABA receptor activity for anxiolytic effects. KSM-66 is the most studied full-spectrum root extract.',
    clinicalDose: '300–600mg/day (KSM-66 extract)',
    timeToEffect: '2–4 weeks for anxiety/stress; 4–8 weeks for cognitive effects',
    studySummary: "A 2019 RCT (Choudhary et al.) found KSM-66 at 300mg twice daily significantly improved memory, attention, and information processing speed versus placebo over 8 weeks. A 2012 RCT showed 27.9% reduction in cortisol. KSM-66 has the most clinical trials of any ashwagandha extract (>24 gold-standard studies).",
    benefits: ['Cortisol reduction', 'Cognitive function under stress', 'Sleep quality', 'Muscle strength and recovery'],
    sideEffects: ['Generally safe', 'GI upset in some users', 'Contraindicated in thyroid conditions', 'Avoid during pregnancy'],
    productsContaining: ['thesis-review', 'hunter-focus-review'],
    humanEffects: [
      { effect: 'Cortisol Reduction', evidenceStrength: 'strong', magnitude: 'large', studies: 11, notes: '27.9% cortisol reduction (Chandrasekhar 2012) is one of the largest effect sizes in the adaptogen literature.' },
      { effect: 'Anxiety & Stress', evidenceStrength: 'strong', magnitude: 'large', studies: 10, notes: 'Consistently significant in both clinical anxiety populations and healthy high-stress subjects.' },
      { effect: 'Sleep Quality', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 6, notes: 'Reduces sleep latency and improves sleep quality ratings, likely via GABA modulation and cortisol reduction.' },
      { effect: 'Cognitive Function Under Stress', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 5, notes: "Memory and processing speed improvements are most pronounced in stressed or sleep-deprived subjects, not rested baseline." },
    ],
    howToTake: {
      dosage: '300–600mg/day (KSM-66)',
      timing: 'Evening (1–2 hours before bed) for sleep benefits. Morning for cortisol and stress management. Split dosing (300mg AM + 300mg PM) is used in the most comprehensive trials.',
      withFood: 'Take with food to minimise GI upset (particularly with 600mg doses). Absorption is not significantly affected by food.',
      forms: 'Capsule. Insist on KSM-66 (full-spectrum root extract, 5% withanolides) or Sensoril (leaf + root, 8% withanolides, lower dose needed). Avoid unstandardised ashwagandha with no withanolide percentage stated — active content may be negligible.',
    },
    stacksWith: [
      { ingredient: 'Rhodiola Rosea', slug: 'rhodiola-rosea', reason: 'The canonical adaptogen duo. Rhodiola is activating (morning); Ashwagandha is calming (evening). Both target HPA axis dysregulation but through different mechanisms and at different times of day — a perfect day/night pair.' },
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'Both reduce anxiety through distinct mechanisms (HPA axis modulation vs. alpha-wave induction). L-Theanine provides immediate calm; Ashwagandha provides systemic, longer-term stress reduction. Together they work at multiple timescales.' },
      { ingredient: 'Phosphatidylserine', slug: 'phosphatidylserine', reason: 'Both independently reduce cortisol via different pathways (HPA modulation vs. cortisol receptor sensitivity). The combination may provide additive cortisol reduction under high-stress conditions.' },
    ],
    faqs: [
      { question: 'KSM-66 vs Sensoril vs generic ashwagandha — which should I choose?', answer: 'KSM-66 (5% withanolides from root only) has the largest body of clinical evidence — over 24 gold-standard trials. Sensoril (8% withanolides from root + leaf, lower dose needed at 125–250mg) has good evidence specifically for stress and sleep. Generic ashwagandha without a stated withanolide percentage is unreliable — you may be paying for starchy root powder with minimal active content. Choose KSM-66 or Sensoril.' },
      { question: 'Will ashwagandha make me tired during the day?', answer: "No — at morning doses, most people experience calm focus, not sedation. The tiredness effect is most pronounced when taken at night, where it reduces sleep latency. Ashwagandha doesn't deplete energy; it reduces the cortisol-driven hyperarousal that causes fatigue. Some people find 600mg in the morning slightly sedating — if so, reduce to 300mg or shift to evening only." },
      { question: 'Is ashwagandha safe for long-term use?', answer: 'Most trials run 8–12 weeks with clean safety profiles. Ayurvedic traditional use spans millennia. No serious adverse events at KSM-66 doses in trials. Some practitioners recommend a 4-week break every 3 months as a precaution, though no evidence specifically requires this. Avoid if you have thyroid conditions (autoimmune thyroid disease) as withanolides can modulate thyroid hormone levels.' },
      { question: 'Can ashwagandha increase testosterone?', answer: 'Yes — multiple RCTs show KSM-66 increases testosterone by 15–17% in healthy men, particularly in those under stress or with sub-optimal testosterone at baseline. A 2015 study in infertile men found more dramatic increases. The mechanism is likely via cortisol reduction (cortisol suppresses testosterone). This is a real, replicated effect, though the magnitude varies by individual.' },
    ],
  },
  {
    slug: 'huperzine-a',
    name: 'Huperzine A',
    category: 'herb',
    mechanism: 'Huperzine A is extracted from Huperzia serrata (Chinese club moss). It is a potent, reversible acetylcholinesterase inhibitor — meaning it blocks the enzyme that breaks down acetylcholine, effectively increasing acetylcholine levels throughout the brain. This makes it one of the most powerful natural cholinergic compounds.',
    clinicalDose: '50–200mcg/day (note: micrograms, not milligrams)',
    timeToEffect: '30–60 minutes (acute)',
    studySummary: 'Multiple Chinese RCTs (Xu et al., 1995; Zhang et al., 2002) show Huperzine A significantly improved memory and learning in Alzheimer\'s patients and students. A meta-analysis of 20 studies confirms its efficacy for memory. Requires cycling (5 days on, 2 days off) due to long half-life and potential acetylcholine accumulation.',
    benefits: ['Immediate acetylcholine preservation', 'Memory recall', 'Learning speed', 'Neuroprotection'],
    sideEffects: ['Must be cycled (5 on / 2 off)', 'Overdose risk with other cholinergics', 'GI discomfort at high doses', 'Not suitable for people on cholinesterase inhibitor drugs'],
    productsContaining: ['noocube-review', 'qualia-mind-review'],
    humanEffects: [
      { effect: 'Memory Recall', evidenceStrength: 'strong', magnitude: 'moderate', studies: 15, notes: 'One of the most studied natural memory compounds. Meta-analysis of 20 studies confirms significant effect.' },
      { effect: 'Acetylcholine Preservation', evidenceStrength: 'strong', magnitude: 'large', studies: 12, notes: 'Mechanism is pharmacologically established — one of the most potent natural acetylcholinesterase inhibitors known.' },
      { effect: 'Learning Speed', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 8, notes: 'Student populations show faster acquisition of new information in RCTs.' },
      { effect: 'Alzheimer\'s Symptom Reduction', evidenceStrength: 'strong', magnitude: 'moderate', studies: 10, notes: 'The basis for pharmaceutical development of cholinesterase inhibitor drugs. Effects in clinical populations are significant.' },
    ],
    howToTake: {
      dosage: '50–200mcg/day (micrograms — doses are small)',
      timing: 'Morning. Avoid evening — the cholinergic activation interferes with sleep.',
      withFood: 'Can be taken with or without food. No significant absorption difference. At higher doses (150–200mcg), taking with food reduces GI sensitivity.',
      cycling: 'Required: 5 days on, 2 days off. Huperzine A has a long half-life (~10–14 hours) and accumulates with daily use, leading to excessive acetylcholine and cholinergic side effects. Never take daily without cycling.',
      forms: 'Capsule only — doses are in micrograms, making accurate powder measurement practically impossible without a milligram-precision scale. Always confirm whether the label states mcg (micrograms) not mg (milligrams) — a 100x error in dosing is dangerous.',
    },
    stacksWith: [
      { ingredient: 'Bacopa Monnieri', slug: 'bacopa-monnieri', reason: 'Bacopa works via synaptic density (non-cholinergic mechanism); Huperzine A works via acetylcholine preservation. No mechanism overlap. A powerful memory stack where both sides work independently.' },
      { ingredient: "Lion's Mane", slug: 'lions-mane', reason: 'Lion\'s Mane supports long-term neurogenesis via NGF; Huperzine A provides immediate acute cholinergic boost. Complementary timescales with no mechanism conflict.' },
    ],
    faqs: [
      { question: 'Why must Huperzine A be cycled?', answer: "Huperzine A has a long biological half-life (~10–14 hours) and accumulates in the body with continuous daily use. Without cycling, acetylcholine levels build excessively over days, causing cholinergic side effects: nausea, sweating, excessive salivation, muscle twitching, and in severe cases, cramps. The 5 days on / 2 days off protocol was established in clinical trials and must be followed." },
      { question: 'Is 100mcg the same as 100mg? The label looks confusing.', answer: 'No — mcg (micrograms) and mg (milligrams) are different by a factor of 1000. Huperzine A is dosed in micrograms (mcg). A 200mcg dose is 0.2mg. This is correct and intentional — Huperzine A is extremely potent. If a product claims a dose in milligrams (e.g. "100mg"), read the label carefully — it likely means 100mcg (0.1mg). A true 100mg dose of Huperzine A would be catastrophically overdosed.' },
      { question: 'Can I take Huperzine A with Alpha-GPC?', answer: 'Technically yes, but with significant caution. Alpha-GPC increases acetylcholine synthesis; Huperzine A prevents its breakdown. The combination is synergistic but can easily cause cholinergic overload. If combining, use half the dose of each (e.g. 50mcg Huperzine A + 200mg Alpha-GPC) and start with one at a time before combining. Watch carefully for early overload symptoms: nausea, headache, excessive salivation.' },
      { question: 'Is Huperzine A safe for young healthy adults?', answer: "Huperzine A's primary research base is in Alzheimer's patients, but student memory studies show good safety in healthy young adults. The key risks in healthy users are dosing errors (confusing mcg and mg) and combining with other cholinergics. At 50–100mcg on a 5/2 cycling schedule, it is well-tolerated by most healthy adults without medication interactions." },
    ],
  },
  {
    slug: 'l-tyrosine',
    name: 'L-Tyrosine (NALT)',
    category: 'amino',
    mechanism: 'L-Tyrosine is an amino acid precursor to dopamine, norepinephrine, and epinephrine. Under conditions of stress, sleep deprivation, or cognitive load, the brain depletes catecholamine stores. Supplementing tyrosine replenishes the substrate for neurotransmitter synthesis, maintaining cognitive performance when it would otherwise decline. N-acetyl-L-tyrosine (NALT) is the most bioavailable form.',
    clinicalDose: '500–2000mg/day (L-Tyrosine); 300–500mg as NALT',
    timeToEffect: '30–60 minutes before a demanding cognitive task',
    studySummary: 'Military research (Neri et al., 1995; Deijen et al., 1999) shows tyrosine supplementation significantly reduced performance decrements from sleep deprivation and cold stress. A 2015 meta-analysis confirmed benefits specifically during multitasking and high-demand cognitive scenarios. Benefits are most pronounced under stress, not in rested baseline conditions.',
    benefits: ['Cognitive performance under stress', 'Working memory under multitasking', 'Mood under sleep deprivation', 'Focus in demanding conditions'],
    sideEffects: ['Generally safe', 'Avoid with MAO inhibitors', 'Possible hyperthyroid effects at very high doses', 'May interact with thyroid medications'],
    productsContaining: ['mind-lab-pro-review', 'performance-lab-mind-review', 'alpha-brain-review'],
    humanEffects: [
      { effect: 'Cognitive Performance Under Stress', evidenceStrength: 'strong', magnitude: 'moderate', studies: 9, notes: 'Military studies in sleep-deprived and cold-stressed subjects show consistent, significant cognitive maintenance.' },
      { effect: 'Working Memory Under Multitasking', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 6, notes: 'Benefits in multitasking scenarios are well replicated. Effects in low-demand tasks are minimal.' },
      { effect: 'Mood Under Sleep Deprivation', evidenceStrength: 'moderate', magnitude: 'small', studies: 5, notes: 'Reduces negative mood and fatigue ratings in sleep-deprived subjects. Effect at normal sleep is negligible.' },
      { effect: 'Motivation & Drive', evidenceStrength: 'preliminary', magnitude: 'small', studies: 3, notes: 'Dopamine precursor theory suggests potential; direct motivation trials in healthy rested adults are limited.' },
    ],
    howToTake: {
      dosage: '500–2000mg L-Tyrosine or 300–500mg NALT',
      timing: '30–60 minutes before the demanding task, exam, workout, or stressful event. Unlike most nootropics, timing relative to the demand matters significantly for tyrosine.',
      withFood: 'Best absorbed on an empty stomach or with a low-protein snack. High-protein meals compete for amino acid transporters and reduce tyrosine uptake into the brain significantly. Avoid taking with a protein shake or high-meat meal.',
      forms: 'Capsule or powder. L-Tyrosine (the free amino acid form) is best value and most studied. NALT (N-Acetyl-L-Tyrosine) has higher bioavailability per mg but significantly lower conversion to tyrosine in the brain — most evidence favours plain L-Tyrosine at higher doses over NALT at lower doses.',
    },
    stacksWith: [
      { ingredient: 'L-Theanine', slug: 'l-theanine', reason: 'L-Tyrosine supplies dopamine/norepinephrine substrate for focus and drive; L-Theanine keeps you calm and prevents the cortisol spike from stress or caffeine. Together they produce focused, calm high-performance state under demanding conditions.' },
      { ingredient: 'Rhodiola Rosea', slug: 'rhodiola-rosea', reason: 'Rhodiola modulates monoamine availability and HPA axis; Tyrosine replenishes the substrate for those monoamines. Both work best under stress conditions — they target the same problem (cognitive decline under stress) via complementary mechanisms.' },
      { ingredient: 'Caffeine', slug: 'l-tyrosine', reason: "Caffeine depletes dopamine precursors over time. Taking L-Tyrosine with caffeine may reduce the 'caffeine crash' by maintaining dopamine substrate levels. A practical stack for anyone using caffeine for performance." },
    ],
    faqs: [
      { question: 'Does L-Tyrosine work if I am not stressed or sleep-deprived?', answer: "Probably not meaningfully. This is the key nuance of tyrosine. The evidence shows it prevents cognitive decline under stress — it restores depleted catecholamines. In a rested, non-stressed baseline state, catecholamine levels are already sufficient, so adding precursor does not produce a noticeable effect. Think of it as an insurance policy for demanding days, not a daily cognitive enhancer." },
      { question: 'L-Tyrosine vs NALT — which form should I buy?', answer: "Despite NALT's higher per-mg bioavailability, the brain conversion rate from NALT to L-Tyrosine is lower than from free L-Tyrosine. Most studies with significant cognitive effects used plain L-Tyrosine at doses of 1000–2000mg. NALT at 300–500mg is commonly used in formulated stacks (easier to cap) but the evidence base is weaker. For best results: use plain L-Tyrosine at 1000–1500mg taken 45 minutes before the demand." },
      { question: 'Does it interact with thyroid medications?', answer: 'Yes — L-Tyrosine is a precursor to thyroid hormones (T3 and T4). At standard doses, this is not clinically significant for most people. However, if you have hyperthyroidism or are on levothyroxine or other thyroid medications, supplemental tyrosine could theoretically affect hormone levels. Consult your doctor before use if you have any thyroid condition.' },
      { question: 'Can L-Tyrosine help with ADHD?', answer: "Preliminary evidence suggests tyrosine may support dopamine signaling relevant to ADHD, and some small studies show modest attention improvements. However, the evidence is much weaker than for prescription medications. L-Tyrosine is not a substitute for ADHD treatment. Some people use it as an adjunct to reduce medication dependency on low-demand days — only do this under medical supervision." },
    ],
  },
];
