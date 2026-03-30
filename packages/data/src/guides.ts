export interface GuideSection {
  heading: string;
  content: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: 'beginner' | 'stacking' | 'usage' | 'science';
  readingTimeMin: number;
  sections: GuideSection[];
}

export const guides: Guide[] = [
  {
    slug: 'what-are-nootropics',
    title: 'What Are Nootropics? A Complete Beginner Guide',
    description: 'Everything you need to know before taking your first nootropic supplement — what they are, how they differ from stimulants, and what the evidence actually says.',
    category: 'beginner',
    readingTimeMin: 7,
    sections: [
      {
        heading: 'The definition',
        content: 'The term "nootropic" was coined in 1972 by Romanian psychologist Corneliu Giurgea, who defined nootropics as substances that enhance learning and memory, protect the brain from injury, increase the efficacy of cortical and subcortical control mechanisms, and have no sedative or stimulant effects. Modern usage is broader: nootropics now refers to any supplement, drug, or compound taken with the goal of enhancing cognitive function — including memory, focus, creativity, motivation, or mental clarity.',
      },
      {
        heading: 'Nootropics vs. stimulants',
        content: "Stimulants (caffeine, modafinil, Adderall) produce short-term performance boosts primarily by increasing catecholamine release — but often at the cost of rebound fatigue, dependency, and disrupted sleep. True nootropics, by Giurgea's original criteria, should enhance cognition without producing significant stimulant effects or withdrawal. Most modern supplements fall in between: they combine stimulant and nootropic ingredients to deliver both acute and long-term benefits. Understanding this distinction helps you set realistic expectations.",
      },
      {
        heading: 'Types of nootropics',
        content: 'Nootropic supplements fall into several categories: (1) Adaptogens (Ashwagandha, Rhodiola Rosea) — reduce stress hormones and support cognitive resilience under pressure. (2) Cholinergics (Citicoline, Alpha-GPC, Huperzine A) — support acetylcholine synthesis or inhibit its breakdown; important for memory and learning. (3) Racetams (Piracetam, Aniracetam) — synthetic compounds that modulate glutamate receptors; available OTC in some countries, prescription-only in others. (4) Mushrooms (Lion\'s Mane, Reishi) — stimulate NGF (Nerve Growth Factor) and support neurogenesis. (5) Amino acids (L-Theanine, L-Tyrosine) — precursors to neurotransmitters; the most studied and safest category.',
      },
      {
        heading: 'What the science actually shows',
        content: "The honest answer: the evidence varies enormously by ingredient. L-Theanine paired with caffeine has robust acute RCT evidence for calm focus. Bacopa Monnieri has strong evidence for memory consolidation over 8–12 weeks. Lion's Mane has promising but limited human trial data for long-term neuroprotection. Many products on the market combine clinically-backed ingredients at sub-clinical doses with well-marketed but under-studied compounds. The single most important question to ask about any nootropic is: what dose of each ingredient is in this formula, and does it match what was used in clinical trials?",
      },
      {
        heading: 'Are nootropics safe?',
        content: 'Most mainstream nootropic supplements use food-grade or well-studied ingredients at doses considered safe for healthy adults. However, "natural" does not mean risk-free. Some ingredients interact with medications (e.g. Huperzine A with cholinesterase inhibitors, Rhodiola with MAO inhibitors). A few ingredients carry regulatory restrictions in certain countries. Always consult a qualified healthcare professional before starting any supplement, especially if you take prescription medications or have a pre-existing health condition.',
      },
    ],
  },
  {
    slug: 'how-nootropics-work',
    title: 'How Nootropics Work: Mechanisms of Action Explained',
    description: "A science-based breakdown of how different nootropic ingredient classes work in the brain — from acetylcholine to NGF to the HPA axis.",
    category: 'science',
    readingTimeMin: 9,
    sections: [
      {
        heading: 'The cholinergic system',
        content: 'Acetylcholine is the primary neurotransmitter for attention, learning, and memory encoding. The cholinergic pathway runs from the basal forebrain to the hippocampus and cortex — the exact brain regions involved in forming new memories and sustaining focus. Nootropics enhance cholinergic function in three ways: (1) providing choline precursors (Citicoline, Alpha-GPC, choline bitartrate) that the brain converts to acetylcholine; (2) inhibiting acetylcholinesterase, the enzyme that breaks acetylcholine down (Huperzine A, Bacopa); or (3) increasing the sensitivity of acetylcholine receptors. This is why many premium stacks contain both a choline source and a cholinesterase inhibitor.',
      },
      {
        heading: 'The dopaminergic system',
        content: 'Dopamine drives motivation, reward, and working memory. L-Tyrosine is the amino acid precursor that the brain converts to L-DOPA and then dopamine. Under stress, sleep deprivation, or cognitive overload, dopamine and norepinephrine stores are depleted faster than the brain can replenish them — resulting in reduced motivation, poor working memory, and cognitive fatigue. Tyrosine supplementation replenishes the substrate, maintaining performance when conditions are demanding. Adaptogens like Rhodiola Rosea modulate dopamine availability by inhibiting monoamine oxidase (MAO).',
      },
      {
        heading: 'The HPA axis and cortisol',
        content: 'The hypothalamic-pituitary-adrenal (HPA) axis governs the stress response. Chronic stress elevates cortisol, which damages hippocampal neurons over time, impairs memory consolidation, and reduces cognitive flexibility. Adaptogens — including Ashwagandha (KSM-66), Rhodiola Rosea, and Panax Ginseng — regulate HPA axis activity, blunting cortisol secretion under acute stress and reducing baseline cortisol over several weeks of use. This is why adaptogens are considered long-term cognitive protectants rather than acute enhancers.',
      },
      {
        heading: 'Nerve Growth Factor (NGF) and neurogenesis',
        content: "Nerve Growth Factor is a protein that promotes the growth, maintenance, and survival of neurons. NGF production declines with age, contributing to memory loss and slower cognitive processing. Lion's Mane mushroom contains hericenones (in the fruiting body) and erinacines (in the mycelium), compounds that stimulate NGF synthesis in the brain. This is why Lion's Mane is one of the few nootropic ingredients with legitimate neuroregeneration potential — though the effects are cumulative and require weeks to months of supplementation to measure.",
      },
      {
        heading: 'Alpha brain waves and calm focus',
        content: 'Alpha brain waves (8–12 Hz) are associated with relaxed alertness — the mental state experienced during flow states, meditation, or creative work. L-Theanine, an amino acid from green tea, increases alpha wave amplitude within 30–45 minutes of ingestion. This produces a state of calm focus without sedation. When combined with caffeine, L-theanine blunts the anxiogenic (anxiety-inducing) effects of caffeine while preserving its attention-sharpening and reaction-time benefits — one of the most replicable findings in cognitive neuroscience.',
      },
      {
        heading: 'Cell membrane integrity and phospholipids',
        content: "Neuronal cell membranes are composed largely of phospholipids — primarily phosphatidylserine (PS) and phosphatidylcholine. Healthy membranes are essential for efficient signal transmission between neurons. PS levels in the brain decline naturally from around age 30 onward. Supplementing with PS replenishes membrane composition, improving synaptic signal transduction and facilitating neurotransmitter release. Citicoline works similarly — as a precursor to phosphatidylcholine, it supports membrane repair while simultaneously boosting acetylcholine synthesis.",
      },
    ],
  },
  {
    slug: 'what-to-expect',
    title: 'What to Expect from Nootropics: Realistic Timelines and Effects',
    description: 'A realistic, evidence-based guide to what nootropics can and cannot do — with timelines for each ingredient class and how to measure whether they are working.',
    category: 'beginner',
    readingTimeMin: 6,
    sections: [
      {
        heading: 'The two categories: acute vs. cumulative',
        content: "Nootropics split into two effect profiles. Acute nootropics produce measurable changes within 30–120 minutes of a single dose: L-Theanine, L-Tyrosine, and caffeine fall into this category. You should feel something on day one. Cumulative nootropics require weeks or months of daily supplementation to produce structural or biochemical changes in the brain: Bacopa Monnieri (6–12 weeks), Lion's Mane (4–8 weeks), Ashwagandha (2–4 weeks for cortisol, 4–8 weeks for cognitive effects), Phosphatidylserine (4–6 weeks). Most high-quality stacks contain both types — an acute component for immediate effect and a cumulative component for long-term benefit.",
      },
      {
        heading: 'What acute effects actually feel like',
        content: 'For L-Theanine + caffeine combinations: reduced jitteriness compared to caffeine alone, sustained attention without the crash, mild mood uplift. For L-Tyrosine under stress: maintained sharpness and working memory during demanding tasks where you would normally feel your performance degrade. For Rhodiola: reduced mental fatigue, better stamina during long cognitive sessions. Importantly, acute nootropics work most noticeably when you have a deficit to correct — fatigue, stress, sleep deprivation. In a well-rested, low-stress state, effects are subtler.',
      },
      {
        heading: 'What cumulative effects feel like',
        content: "Cumulative nootropic effects are subtle by nature — they represent improvements in cognitive baseline, not dramatic acute shifts. After 8–12 weeks on a Bacopa-containing stack, you are likely to notice: faster recall of names, numbers, and learned material; improved retention of new information; and subjectively, things feeling slightly easier to remember. After 8 weeks of Lion's Mane, some users report clearer thinking and better mental endurance. These effects are difficult to notice day-to-day; the best way to measure them is cognitive benchmarking — test your working memory span, reading speed, or task completion time at baseline and again at 8 weeks.",
      },
      {
        heading: 'What nootropics cannot do',
        content: "Nootropics cannot compensate for chronic sleep deprivation, a poor diet, sedentary lifestyle, or untreated anxiety and depression. Sleep is the most powerful cognitive enhancer available — 7–9 hours of quality sleep consistently outperforms any supplement stack in cognitive benchmarks. Nootropics work best as an enhancement layer on top of solid foundations, not as a substitute for them. They also cannot make you smarter in the way that studying makes you smarter — they support the neurological infrastructure for learning, but the learning still has to happen.",
      },
      {
        heading: 'How to measure whether they are working',
        content: "The placebo effect is strong in nootropics — any intervention you believe will enhance cognition produces measurable improvements in subjective cognitive ratings. To test objectively: (1) Use a consistent cognitive task as a benchmark — dual n-back, Cambridge Brain Sciences tests, or a timed reading comprehension passage. (2) Establish baseline scores over 3–5 days before starting. (3) Retest at 4 and 8 weeks under consistent conditions (same time of day, same sleep the night before). (4) Track energy, mood, and stress as confounders. This is the only way to separate real ingredient effects from expectation and lifestyle variation.",
      },
    ],
  },
  {
    slug: 'how-to-stack-nootropics',
    title: 'How to Stack Nootropics Safely: Principles and Example Stacks',
    description: 'A practical guide to combining nootropic supplements for synergistic effects — including safe pairing rules, what to avoid, and three example stacks for different goals.',
    category: 'stacking',
    readingTimeMin: 8,
    sections: [
      {
        heading: 'What is a nootropic stack?',
        content: 'A nootropic stack is a combination of two or more cognitive-enhancing compounds taken together to produce effects greater than either would alone. The concept comes from pharmacology — many drugs are more effective or better-tolerated in combination. The best-evidenced nootropic combination is L-Theanine + Caffeine, where L-theanine reduces caffeine\'s anxiogenic effects while both compounds combine additively on attention. Professional-grade stacks like Mind Lab Pro are pre-formulated stacks with 8–11 ingredients designed to cover multiple cognitive pathways simultaneously.',
      },
      {
        heading: 'The golden rule: one cholinergic source at a time',
        content: "The most common stacking mistake is combining multiple cholinergic compounds without accounting for total acetylcholine load. Stacking Citicoline + Alpha-GPC + Huperzine A simultaneously gives your brain far more acetylcholine precursor and preservation than it needs — resulting in headaches, brain fog, and muscle tension (cholinergic overstimulation). Rule: choose one choline source (either Citicoline or Alpha-GPC, not both) and use Huperzine A separately with cycling. Mind Lab Pro uses Citicoline only for this reason.",
      },
      {
        heading: 'Safe pairing rules',
        content: "Green pairings (generally safe to combine): L-Theanine + Caffeine; Bacopa + Phosphatidylserine; Lion's Mane + Citicoline; Rhodiola + L-Tyrosine; Ashwagandha + any of the above. Amber pairings (use with awareness): Huperzine A + any choline source — reduce choline source dose by 50%. Stimulants + Ashwagandha — monitor for blunted response. Red pairings (avoid): Huperzine A + prescription cholinesterase inhibitors (e.g. Donepezil); Rhodiola or Tyrosine + MAOI antidepressants; Multiple acetylcholinesterase inhibitors simultaneously.",
      },
      {
        heading: 'Example stack 1: focused work (daily driver)',
        content: "Goal: sustained focus and memory for knowledge work. Acute layer: L-Theanine 200mg + Caffeine 100mg (or green tea). Cumulative layer: Mind Lab Pro (contains Citicoline, Bacopa, Lion's Mane, Phosphatidylserine, Rhodiola, L-Tyrosine). Take Mind Lab Pro daily; L-Theanine/Caffeine on demanding work days. No additional cholinergics needed.",
      },
      {
        heading: 'Example stack 2: stress and resilience',
        content: 'Goal: cognitive performance under high-stress periods (exams, deadlines, travel). Foundation: Ashwagandha KSM-66 300mg twice daily. Acute support: Rhodiola Rosea 200mg in the morning (not evening — activating). Acute on-demand: L-Theanine 200mg before high-stakes meetings or presentations. Do not add caffeine-based stimulants on top of Rhodiola without testing individually first.',
      },
      {
        heading: 'Example stack 3: long-term brain health (age 40+)',
        content: "Goal: neuroprotection and maintenance of cognitive baseline with age. Core: Lion's Mane 500mg standardised fruiting body (e.g. Nootropics Depot) daily. Membrane support: Phosphatidylserine 100mg with a fat-containing meal. Cholinergic: Citicoline 250mg. This stack targets NGF production, membrane integrity, and acetylcholine availability — the three pathways most associated with age-related cognitive decline.",
      },
    ],
  },
  {
    slug: 'nootropics-for-focus-vs-memory',
    title: 'Nootropics for Focus vs. Memory: Which Ingredients Do What?',
    description: 'A use-case guide to choosing nootropic ingredients based on your specific cognitive goal — sustained attention, memory encoding, recall speed, or creative thinking.',
    category: 'usage',
    readingTimeMin: 6,
    sections: [
      {
        heading: 'Defining the goals',
        content: 'Cognitive enhancement is not monolithic — different tasks engage different brain systems. Focus (sustained attention) primarily involves the prefrontal cortex and dopaminergic/noradrenergic systems. Memory encoding (forming new memories) involves the hippocampus and the cholinergic system. Memory recall (retrieving stored memories quickly) involves different neural networks from encoding. Creative thinking engages default mode network activity. Each goal responds to different ingredients, which is why the best nootropic "stack" depends on what you are actually trying to improve.',
      },
      {
        heading: 'Best for focus and sustained attention',
        content: 'L-Theanine (200mg) + Caffeine (100mg) is the gold standard for acute focus — 30–60 minutes to effect, lasts 3–5 hours. L-Tyrosine (500–1000mg) is best for focus under stress, sleep deprivation, or multitasking. Citicoline (250mg) supports sustained attention by maintaining acetylcholine availability during long cognitive sessions. Rhodiola Rosea (200mg) reduces mental fatigue for extended focus sessions. Products strong on focus: Mind Lab Pro, Performance Lab Mind, Thesis (Energy blend).',
      },
      {
        heading: 'Best for memory encoding (learning new things)',
        content: "Bacopa Monnieri (300mg, 55% bacosides) is the best-evidenced ingredient for improving the speed and durability of memory encoding — but requires 8–12 weeks. Alpha-GPC (300mg) provides an acute cholinergic boost that improves encoding during the dose window. Lion's Mane (500mg+) supports long-term neuroplasticity that underpins learning capacity. Phosphatidylserine (100mg) improves signal transduction speed across synapses. Products strong on memory encoding: Mind Lab Pro, NooCube.",
      },
      {
        heading: 'Best for recall speed',
        content: "Recall speed — how quickly you can retrieve stored information — is influenced by acetylcholine availability, dopamine signalling, and synaptic transmission speed. Huperzine A (100mcg, cycled) produces the sharpest acute improvement in recall by preserving acetylcholine. Phosphatidylserine supports transmission speed. Rhodiola improves recall under conditions of stress or fatigue (when catecholamine depletion would otherwise slow retrieval). Note: none of these can retrieve information that was never well-encoded — improving encoding comes first.",
      },
      {
        heading: 'Best for creative thinking and insight',
        content: "Creative thinking correlates with increased default mode network activity and alpha brain wave amplitude. L-Theanine is the strongest nootropic intervention for alpha wave induction. Lion's Mane supports the neuroplasticity that underlies cognitive flexibility. Microdosed psychedelics (not discussed here — legal status varies) have the most robust data for creative enhancement but fall outside the scope of conventional supplements. Adaptogens (Ashwagandha, Rhodiola) support creative cognition indirectly by reducing the performance anxiety and stress that suppresses creative output.",
      },
    ],
  },
  {
    slug: 'natural-vs-synthetic-nootropics',
    title: 'Natural vs. Synthetic Nootropics: Trade-offs and What to Choose',
    description: 'A balanced comparison of plant-derived and synthetic nootropic compounds — covering evidence quality, safety profiles, regulatory status, and how to decide what is right for you.',
    category: 'science',
    readingTimeMin: 7,
    sections: [
      {
        heading: 'Defining the categories',
        content: "Natural nootropics are derived from plants, fungi, or other biological sources: Lion's Mane mushroom, Bacopa Monnieri, Ashwagandha, Rhodiola Rosea, Ginkgo Biloba. Synthetic nootropics are chemically synthesised compounds: racetams (Piracetam, Aniracetam, Oxiracetam), Noopept, Modafinil, Phenylpiracetam. A third category exists: semi-synthetic or nature-identical compounds produced through synthesis but identical to naturally occurring molecules. Citicoline, Alpha-GPC, and Huperzine A fall here — they occur in food/plants but are extracted or synthesised for supplementation.",
      },
      {
        heading: 'Evidence quality',
        content: "Synthetic nootropics often have better-quality clinical evidence than natural ones — Piracetam has hundreds of published trials, largely because it has been used in clinical medicine since the 1970s. However, most synthetic nootropic trials were conducted in cognitively impaired populations (elderly, post-stroke), not healthy adults. Extrapolating these results to healthy users is scientifically uncertain. Natural adaptogens and herbal nootropics generally have smaller and more variable study populations but increasingly rigorous modern RCTs. L-Theanine has the highest quality evidence in healthy adults of any natural nootropic.",
      },
      {
        heading: 'Safety and side effect profiles',
        content: 'Natural nootropics at recommended doses have excellent safety records and are sold as food supplements in most jurisdictions. Long-term safety data exists for Bacopa, Ashwagandha, and Rhodiola from centuries of traditional use supplemented by modern clinical monitoring. Synthetic nootropics carry more uncertain long-term safety profiles, particularly for daily use over years. Racetams deplete choline stores (requiring supplemental choline to avoid headaches). Modafinil and Armodafinil — prescription-only in most countries — have established short-term safety but limited long-term data.',
      },
      {
        heading: 'Regulatory status by region',
        content: 'In the US, natural nootropics are regulated as dietary supplements (DSHEA) with no pre-market approval required. Most racetams exist in a grey area — not FDA-approved as drugs but not formally approved as supplements either. Modafinil is Schedule IV controlled. In the EU, supplements must comply with Directive 2002/46/EC; most racetams are not approved for sale as food supplements and are prescription-only drugs in many member states. This is a key practical difference for EU buyers — stick to EU-compliant natural supplement stacks to avoid legal ambiguity.',
      },
      {
        heading: 'What to choose',
        content: "For most healthy adults pursuing long-term cognitive enhancement, natural nootropic stacks offer the best combination of safety, regulatory clarity, and clinical evidence. Reserve synthetic options for specific, well-defined use cases if you understand the legal status in your jurisdiction and have done thorough research. The best-evidenced approach for most people: a multi-ingredient natural stack (Mind Lab Pro, Performance Lab Mind) covering cholinergic, adaptogenic, and neuroplasticity pathways, combined with lifestyle fundamentals (sleep, exercise, diet). This outperforms most synthetic alternatives in safety-adjusted long-term outcomes.",
      },
    ],
  },
];
