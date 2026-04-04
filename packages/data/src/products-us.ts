export type EUCompliance = 'compliant' | 'reformulated' | 'verify';
export type Market = 'us' | 'eu' | 'both';

export interface IngredientDosage {
  name: string;
  doseInProduct: string;
  clinicalDose: string;
  adequatelyDosed: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  bestFor: string[];
  score: number;
  scoreBreakdown: {
    ingredients: number;
    dosing: number;
    transparency: number;
    value: number;
    trust: number;
  };
  priceMonthlyUSD?: number;
  priceMonthlyEUR?: number;
  pricingModel: 'one-time' | 'subscription' | 'both';
  moneyBackDays: number;
  caffeineFree: boolean;
  euStorefront: boolean;
  euCompliance: EUCompliance;
  trustpilotScore: number;
  trustpilotCount: number;
  affiliateUrl: string;
  affiliateNetwork: string;
  commissionRate: string;
  cookieDays: number;
  heroIngredients: string[];
  ingredientDosages: IngredientDosage[];
  servingsPerContainer: number;
  capsulesPerServing: number;
  summary: string;
  whatItIs: string;
  howItWorks: string;
  whatToExpect: string;
  pros: string[];
  cons: string[];
  editorChoice: boolean;
  market: Market;
}

export const productsUS: Product[] = [
  {
    id: 'mind-lab-pro',
    name: 'Mind Lab Pro',
    brand: 'Opti-Nutra',
    slug: 'mind-lab-pro-review',
    bestFor: ['Focus', 'Memory', 'Long-term brain health'],
    score: 9.2,
    scoreBreakdown: { ingredients: 9, dosing: 10, transparency: 10, value: 8, trust: 9 },
    priceMonthlyUSD: 69,
    priceMonthlyEUR: 65,
    pricingModel: 'both',
    moneyBackDays: 30,
    caffeineFree: true,
    euStorefront: true,
    euCompliance: 'compliant',
    trustpilotScore: 4.5,
    trustpilotCount: 3200,
    affiliateUrl: 'https://www.mindlabpro.com/',
    affiliateNetwork: 'UberNet',
    commissionRate: '30%',
    cookieDays: 365,
    heroIngredients: ["Lion's Mane", 'Citicoline', 'Bacopa Monnieri', 'Rhodiola Rosea', 'L-Theanine'],
    ingredientDosages: [
      { name: "Lion's Mane (fruiting body)", doseInProduct: '500mg', clinicalDose: '500mg', adequatelyDosed: true },
      { name: 'Citicoline (Cognizin)', doseInProduct: '250mg', clinicalDose: '250mg', adequatelyDosed: true },
      { name: 'Bacopa Monnieri (45% bacosides)', doseInProduct: '150mg', clinicalDose: '300mg', adequatelyDosed: false },
      { name: 'Rhodiola Rosea (3% rosavins)', doseInProduct: '50mg', clinicalDose: '200mg', adequatelyDosed: false },
      { name: 'L-Theanine', doseInProduct: '100mg', clinicalDose: '100-200mg', adequatelyDosed: true },
      { name: 'Phosphatidylserine (Sharp-PS)', doseInProduct: '100mg', clinicalDose: '100mg', adequatelyDosed: true },
      { name: 'L-Tyrosine (NALT)', doseInProduct: '175mg', clinicalDose: '300-500mg as NALT', adequatelyDosed: false },
    ],
    servingsPerContainer: 30,
    capsulesPerServing: 4,
    summary: 'The most comprehensively researched nootropic stack on the market. Every ingredient is clinically dosed and backed by peer-reviewed evidence. Our #1 pick for overall cognitive support.',
    whatItIs: 'Mind Lab Pro is an 11-ingredient pre-formulated nootropic stack made by Opti-Nutra, a UK-based supplement company. It is designed as a complete daily cognitive supplement covering memory, focus, mental energy, mood, and long-term brain health without caffeine or proprietary blends.',
    howItWorks: "Mind Lab Pro works across six bio-pathways simultaneously. Citicoline and Phosphatidylserine support the cholinergic system and neuronal membrane integrity. Lion's Mane stimulates Nerve Growth Factor (NGF) for neuroplasticity. Bacopa Monnieri enhances synaptic communication for memory. Rhodiola Rosea and L-Tyrosine support dopamine/norepinephrine balance under stress. L-Theanine promotes alpha brain wave activity for calm focus. B-vitamins (B6, B9, B12) support homocysteine regulation and neurotransmitter synthesis.",
    whatToExpect: "Within 30-60 minutes: mild calm focus from L-Theanine. Within 2-4 weeks: improved mental energy and reduced cognitive fatigue (Citicoline, Tyrosine). At 8-12 weeks: measurable improvements in memory recall and learning speed (Bacopa, Lion's Mane). Mind Lab Pro is a long-game supplement -- most users report subtle but sustained improvement rather than dramatic day-one effects. Best results require 3+ months of consistent daily use.",
    pros: ['11 ingredients at clinical doses', 'Third-party tested, allergen-free', 'EU and US storefronts', 'Caffeine-free', '365-day affiliate cookie'],
    cons: ['Premium price ($69/mo)', '4 capsules per serving', '30-day money-back'],
    editorChoice: true,
    market: 'both',
  },
  {
    id: 'noocube',
    name: 'NooCube',
    brand: 'Wolfson Brands',
    slug: 'noocube-review',
    bestFor: ['Focus', 'Screen workers', 'Budget'],
    score: 7.8,
    scoreBreakdown: { ingredients: 8, dosing: 7, transparency: 7, value: 9, trust: 7 },
    priceMonthlyUSD: 59,
    priceMonthlyEUR: 55,
    pricingModel: 'both',
    moneyBackDays: 60,
    caffeineFree: true,
    euStorefront: true,
    euCompliance: 'compliant',
    trustpilotScore: 1.9,
    trustpilotCount: 850,
    affiliateUrl: 'https://www.noocube.com/',
    affiliateNetwork: 'FanFuel',
    commissionRate: '31.5%',
    cookieDays: 30,
    heroIngredients: ['Lutemax 2020', 'Bacopa Monnieri', 'Alpha-GPC', 'Huperzine A', 'L-Theanine'],
    ingredientDosages: [
      { name: 'Lutemax 2020 (Lutein/Zeaxanthin)', doseInProduct: '20mg', clinicalDose: '20mg', adequatelyDosed: true },
      { name: 'Bacopa Monnieri', doseInProduct: '250mg', clinicalDose: '300mg', adequatelyDosed: false },
      { name: 'Alpha-GPC', doseInProduct: '50mg', clinicalDose: '300mg', adequatelyDosed: false },
      { name: 'Huperzine A', doseInProduct: '20mcg', clinicalDose: '50-200mcg', adequatelyDosed: false },
      { name: 'L-Theanine', doseInProduct: '100mg', clinicalDose: '100-200mg', adequatelyDosed: true },
      { name: 'Pterostilbene', doseInProduct: '140mcg', clinicalDose: 'Limited human data', adequatelyDosed: false },
    ],
    servingsPerContainer: 30,
    capsulesPerServing: 4,
    summary: 'Strong formula anchored by Lutemax 2020. Best value per serving. Note: Trustpilot score is very low -- verify independently before purchasing.',
    whatItIs: "NooCube is a 13-ingredient nootropic stack made by Wolfson Brands, a large supplement manufacturer known for multiple health product lines. Its standout feature is Lutemax 2020 -- a patented lutein and zeaxanthin extract specifically researched for reducing the effects of digital eye strain and blue-light-related cognitive fatigue, making it particularly relevant for screen-heavy workers.",
    howItWorks: 'Lutemax 2020 filters high-energy blue light in the retina, reducing eye fatigue that accumulates during screen use -- an indirect but real cognitive benefit for office workers and gamers. Alpha-GPC and Huperzine A work on the cholinergic system (though both are underdosed versus clinical trial doses). L-Theanine provides calm focus. Bacopa Monnieri targets memory consolidation over weeks.',
    whatToExpect: "Day one: mild calm focus from L-Theanine. Within 2-4 weeks: reduced eye fatigue and better end-of-day mental stamina (Lutemax). At 8 weeks: modest memory improvements (Bacopa, though underdosed). Important caveat: Alpha-GPC and Huperzine A are underdosed versus clinical trials. Manage expectations accordingly. The Trustpilot rating of 1.9/5 reflects subscription cancellation complaints rather than product efficacy -- verify the cancellation policy before purchasing.",
    pros: ['Lutemax 2020 for screen workers', 'Good value at $59/mo', '60-day money-back', 'EU storefront'],
    cons: ['Trustpilot 1.9/5 -- significant complaints', 'Some ingredients underdosed', 'Subscription cancellation issues (BBB)'],
    editorChoice: false,
    market: 'both',
  },
  {
    id: 'qualia-mind',
    name: 'Qualia Mind',
    brand: 'Neurohacker Collective',
    slug: 'qualia-mind-review',
    bestFor: ['Power users', 'Neurohackers', 'Complex stacks'],
    score: 8.1,
    scoreBreakdown: { ingredients: 10, dosing: 8, transparency: 9, value: 6, trust: 7 },
    priceMonthlyUSD: 139,
    pricingModel: 'subscription',
    moneyBackDays: 100,
    caffeineFree: false,
    euStorefront: false,
    euCompliance: 'verify',
    trustpilotScore: 3.8,
    trustpilotCount: 1100,
    affiliateUrl: 'https://neurohacker.com/',
    affiliateNetwork: 'ShareASale',
    commissionRate: '15%',
    cookieDays: 30,
    heroIngredients: ['Phosphatidylserine', 'Alpha-GPC', 'Huperzine A', 'Bacopa Monnieri', 'Rhodiola', 'DHA'],
    ingredientDosages: [
      { name: 'Phosphatidylserine', doseInProduct: '200mg', clinicalDose: '100-300mg', adequatelyDosed: true },
      { name: 'Alpha-GPC', doseInProduct: '200mg', clinicalDose: '300-600mg', adequatelyDosed: false },
      { name: 'Huperzine A', doseInProduct: '50mcg', clinicalDose: '50-200mcg', adequatelyDosed: true },
      { name: 'Bacopa Monnieri', doseInProduct: '300mg', clinicalDose: '300mg', adequatelyDosed: true },
      { name: 'Rhodiola Rosea', doseInProduct: '150mg', clinicalDose: '200-600mg', adequatelyDosed: false },
      { name: 'DHA (from Algae)', doseInProduct: '80mg', clinicalDose: '250-500mg', adequatelyDosed: false },
      { name: 'Uridine Monophosphate', doseInProduct: '250mg', clinicalDose: '250mg', adequatelyDosed: true },
    ],
    servingsPerContainer: 22,
    capsulesPerServing: 7,
    summary: '28 active ingredients -- the most comprehensive formula. Best for experienced biohackers. Not recommended for EU buyers (no EU storefront).',
    whatItIs: 'Qualia Mind is a 28-ingredient nootropic stack developed by Neurohacker Collective, a San Diego-based company with a focus on systems biology and complex supplementation. It is the most ingredient-rich formula in this review and is designed for experienced supplement users who want a comprehensive single-product cognitive stack.',
    howItWorks: 'Qualia Mind covers more cognitive pathways than any competitor: cholinergics (Alpha-GPC, Huperzine A, Citicoline), adaptogens (Rhodiola, Bacopa), neuro-nutrients (DHA, PS), amino acid precursors (Tyrosine, Taurine, Theanine), B-vitamin complex, and several novel ingredients (Uridine Monophosphate, Pyrroloquinoline Quinone). The theory is synergistic optimisation across all cognitive systems simultaneously. Neurohacker publishes a proprietary research program supporting the formula.',
    whatToExpect: "Acute effects on day one: sustained attention, moderate energy boost from caffeine (90mg per serving). Within 2-4 weeks: improved mental endurance and working memory. At 8-12 weeks: cumulative adaptogen and memory benefits. Important: 7 capsules per serving is a significant daily pill burden. Start with the recommended 7-day loading cycle (2 days off per week) to assess tolerance. Not suitable for EU buyers due to lack of EU storefront and uncertain EU regulatory status for some ingredients.",
    pros: ['28 active ingredients', '100-day money-back', 'Published research program', 'Respected in biohacking community'],
    cons: ['$139/month', '7 capsules per serving', 'No EU storefront', 'Contains caffeine'],
    editorChoice: false,
    market: 'us',
  },
  {
    id: 'alpha-brain',
    name: 'Alpha Brain',
    brand: 'Onnit',
    slug: 'onnit-alpha-brain-review',
    bestFor: ['Mainstream buyers', 'Brand recognition', 'Athletes'],
    score: 7.2,
    scoreBreakdown: { ingredients: 7, dosing: 6, transparency: 6, value: 7, trust: 8 },
    priceMonthlyUSD: 79,
    pricingModel: 'both',
    moneyBackDays: 90,
    caffeineFree: true,
    euStorefront: false,
    euCompliance: 'verify',
    trustpilotScore: 3.2,
    trustpilotCount: 4200,
    affiliateUrl: 'https://www.onnit.com/',
    affiliateNetwork: 'Impact',
    commissionRate: '12%',
    cookieDays: 30,
    heroIngredients: ["Lion's Mane", 'Bacopa Monnieri', 'Alpha-GPC', 'L-Tyrosine', 'Oat Straw'],
    ingredientDosages: [
      { name: "Lion's Mane (proprietary blend)", doseInProduct: 'Undisclosed', clinicalDose: '500mg', adequatelyDosed: false },
      { name: 'Alpha-GPC (proprietary blend)', doseInProduct: 'Undisclosed', clinicalDose: '300mg', adequatelyDosed: false },
      { name: 'Bacopa Monnieri (proprietary blend)', doseInProduct: 'Undisclosed', clinicalDose: '300mg', adequatelyDosed: false },
      { name: 'L-Tyrosine (proprietary blend)', doseInProduct: 'Undisclosed', clinicalDose: '500mg', adequatelyDosed: false },
      { name: 'L-Theanine (proprietary blend)', doseInProduct: 'Undisclosed', clinicalDose: '100-200mg', adequatelyDosed: false },
      { name: 'Phosphatidylserine', doseInProduct: 'Undisclosed', clinicalDose: '100mg', adequatelyDosed: false },
    ],
    servingsPerContainer: 45,
    capsulesPerServing: 2,
    summary: 'Most commercially successful US nootropic. Backed by two clinical studies. Good mainstream trust, but proprietary blends limit transparency.',
    whatItIs: "Alpha Brain is Onnit's flagship nootropic product, first released in 2011 and popularised through Joe Rogan's podcast endorsements. It is the best-recognised nootropic brand in the mainstream US market and one of only two nootropic supplements with published clinical trial data on its specific formula. It is NSF Certified for Sport, making it suitable for drug-tested athletes.",
    howItWorks: "Alpha Brain uses three proprietary blends -- Onnit Flow Blend, Focus Blend, and Fuel Blend -- containing cholinergics (Alpha-GPC), adaptogens (Bacopa), and amino acids (Tyrosine, Theanine). Because doses are hidden in proprietary blends, we cannot verify whether individual ingredient doses match clinical trial thresholds. The two published studies (Onnit-funded, 2016 and 2021) tested the full formula and showed statistically significant improvements in verbal memory and executive function versus placebo.",
    whatToExpect: "Day one: subtle focus improvement, particularly noticeable for users who haven't taken cholinergic supplements before. The lack of caffeine means no energy spike -- effects are gentle. The proprietary blend means dosing is optimised for the formula as a whole, not for individual ingredients. At 4-6 weeks: most users report consistent mild improvements in word retrieval and task focus. The 90-day money-back guarantee is one of the most generous in the category.",
    pros: ['Two published clinical studies', 'Highest US brand recognition', 'Only 2 capsules', '90-day money-back', 'NSF Certified for Sport'],
    cons: ['Proprietary blends hide doses', 'No EU storefront', 'Subscription cancellation issues'],
    editorChoice: false,
    market: 'us',
  },
  {
    id: 'thesis',
    name: 'Thesis',
    brand: 'Take Thesis',
    slug: 'thesis-nootropics-review',
    bestFor: ['Personalisation', 'Custom stack optimisers'],
    score: 7.6,
    scoreBreakdown: { ingredients: 8, dosing: 7, transparency: 8, value: 7, trust: 7 },
    priceMonthlyUSD: 79,
    pricingModel: 'subscription',
    moneyBackDays: 30,
    caffeineFree: false,
    euStorefront: false,
    euCompliance: 'verify',
    trustpilotScore: 3.9,
    trustpilotCount: 780,
    affiliateUrl: 'https://takethesis.com/',
    affiliateNetwork: 'Impact',
    commissionRate: '20%',
    cookieDays: 30,
    heroIngredients: ['Ashwagandha', 'Zynamite', 'Alpha-GPC', 'Dynamine', 'L-Theanine'],
    ingredientDosages: [
      { name: 'Ashwagandha (KSM-66)', doseInProduct: '300mg', clinicalDose: '300-600mg', adequatelyDosed: true },
      { name: 'Alpha-GPC', doseInProduct: '200mg', clinicalDose: '300mg', adequatelyDosed: false },
      { name: 'L-Theanine', doseInProduct: '200mg', clinicalDose: '100-200mg', adequatelyDosed: true },
      { name: 'Zynamite (Mango leaf extract)', doseInProduct: '140mg', clinicalDose: '140mg', adequatelyDosed: true },
      { name: 'Dynamine (Methylliberine)', doseInProduct: '100mg', clinicalDose: 'Limited data', adequatelyDosed: false },
    ],
    servingsPerContainer: 30,
    capsulesPerServing: 3,
    summary: '4 personalised formula blends per month -- rotate until you find what works. Best for people who want to experiment. US only.',
    whatItIs: 'Thesis is a personalised nootropic subscription service that sends you four different formula blends each month -- Energy, Clarity, Logic, and Motivation -- along with access to a nootropics coaching service. Rather than a single fixed formula, Thesis lets you rotate blends on different days to find which works best for your specific cognitive profile.',
    howItWorks: 'Each Thesis blend targets a different cognitive mode. Energy blend: stimulating compounds (Zynamite, Dynamine, Ashwagandha) for high-output days. Clarity blend: cholinergics and focus ingredients for clear thinking. Logic blend: memory and processing speed ingredients. Motivation blend: dopaminergic support. Each blend has a caffeine-free and caffeinated option. The personalisation model allows you to match your cognitive demand of the day with the appropriate formula.',
    whatToExpect: "First month: expect an experimentation period. You'll rotate through 4 blends, 7 days each, to assess which has the most noticeable effect for you. Energy blend effects are immediate (stimulating compounds work within 30-60 minutes). Clarity and Logic blend effects build over 2-4 weeks. Coaching service adds value for users who want guidance on optimising their protocol. Not suitable for EU buyers (US only storefront).",
    pros: ['4 personalised formulas/month', 'Nootropics coach included', 'Good formula transparency'],
    cons: ['Subscription only', 'No EU storefront', 'Requires experimentation'],
    editorChoice: false,
    market: 'us',
  },
  {
    id: 'nootropics-depot-lions-mane',
    name: "Lion's Mane Extract",
    brand: 'Nootropics Depot',
    slug: 'nootropics-depot-lions-mane',
    bestFor: ['Single-ingredient', 'Long-term brain health', 'Nerve growth'],
    score: 8.5,
    scoreBreakdown: { ingredients: 9, dosing: 9, transparency: 10, value: 9, trust: 8 },
    priceMonthlyUSD: 25,
    pricingModel: 'both',
    moneyBackDays: 30,
    caffeineFree: true,
    euStorefront: false,
    euCompliance: 'verify',
    trustpilotScore: 4.2,
    trustpilotCount: 2800,
    affiliateUrl: 'https://nootropicsdepot.com/',
    affiliateNetwork: 'Impact',
    commissionRate: '15%',
    cookieDays: 30,
    heroIngredients: ["Lion's Mane (standardised fruiting body extract)"],
    ingredientDosages: [
      { name: "Lion's Mane fruiting body (standardised)", doseInProduct: '500mg', clinicalDose: '500-1000mg', adequatelyDosed: true },
    ],
    servingsPerContainer: 90,
    capsulesPerServing: 1,
    summary: "Gold standard for single-ingredient Lion's Mane. ISO in-house lab publishes CoA per batch. Best for buyers who want one ingredient done right.",
    whatItIs: "Nootropics Depot Lion's Mane Extract is a single-ingredient supplement providing standardised Hericium erinaceus fruiting body extract at 500mg per capsule. Nootropics Depot is widely regarded as the most rigorous ingredient-quality focused retailer in the US nootropics market, operating an ISO-certified in-house testing laboratory and publishing a Certificate of Analysis (CoA) for each batch.",
    howItWorks: "Lion's Mane fruiting body contains hericenones, compounds that cross the blood-brain barrier and stimulate Nerve Growth Factor (NGF) synthesis. NGF promotes neuronal survival, axon growth, and maintenance of neurons in the hippocampus and cortex -- the regions responsible for learning and memory. Nootropics Depot uses a standardised fruiting body extract rather than mycelium (which has a lower hericenone content). The result is a more potent and consistent NGF stimulus per capsule.",
    whatToExpect: "Lion's Mane is a long-game supplement. Expect no acute effects on day one. At 4 weeks: some users report slightly clearer thinking and improved mental endurance. At 8-12 weeks: measurable improvements in memory and neuroprotective markers in studies. For best results, take consistently every day with a fat-containing meal (hericenones are fat-soluble). This product is best combined with a multi-ingredient stack (e.g. Mind Lab Pro already contains Lion's Mane) rather than used as a standalone primary supplement.",
    pros: ['ISO lab -- publishes CoA per batch', 'Standardised fruiting body', 'Best value single-ingredient', 'Highest transparency'],
    cons: ['US only', 'Single ingredient only'],
    editorChoice: false,
    market: 'us',
  },
];
