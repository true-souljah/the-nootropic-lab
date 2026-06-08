export type EUCompliance = 'compliant' | 'reformulated' | 'verify';
export type Market = 'us' | 'eu' | 'ca' | 'au' | 'jp' | 'latam' | 'gcc' | 'sea' | 'both';

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
  priceMonthlyCAD?: number;
  priceMonthlyAUD?: number;
  priceMonthlyJPY?: number;
  pricingModel: 'one-time' | 'subscription' | 'both';
  moneyBackDays: number;
  caffeineFree: boolean;
  euStorefront: boolean;
  euCompliance: EUCompliance;
  /**
   * Vendor's Trustpilot rating (0..5) or `null` when no Trustpilot profile
   * exists for this vendor — e.g. Amazon-only listings (NatureBell), Lazada
   * brands, regional pharmacy chains, and some major JP brands.
   * Renderers MUST handle `null` and show "N/A" / hide the row instead of
   * displaying a literal 0 (which previously leaked into Product JSON-LD as
   * `reviewRating.ratingValue: '0'` — bad SEO).
   */
  trustpilotScore: number | null;
  trustpilotCount: number | null;
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
  updatedAt?: string;
  /** True if this product has been independently tested by the editorial team
   * (full hands-on review with sample, dosing audit, and verdict). False or
   * undefined = catalog entry sourced from public product information; we have
   * not held the bottle. Surfaced as a trust badge on listicle + review pages.
   */
  handsOnTested?: boolean;
  /**
   * Canadian Natural Health Products Directorate licensing status. Only set on
   * products served by the CA market app. `licensed` = Health Canada has issued
   * an NPN (Natural Product Number); the `npn` field carries it. `pip` = the
   * product reaches Canadian buyers via the Personal Importation Program — not
   * Health Canada licensed, but legally imported in personal-use quantities.
   * Undefined for products not surfaced to the CA market.
   */
  npnStatus?: {
    status: 'licensed' | 'pip';
    npn?: string;
  };
  /**
   * Japanese Foods with Function Claims (機能性表示食品 / FFC) notification
   * status. Only meaningful on products served by the JP market app.
   * `notified: true` = the manufacturer has filed scientific evidence with
   * the Consumer Affairs Agency (消費者庁) supporting the cognitive claims
   * made on the product label; the `notificationNumber` (届出番号) is
   * carried when documented. Imported products that bypass this system
   * carry `notified: false`. Undefined for products not surfaced to JP.
   */
  ffcStatus?: {
    notified: boolean;
    notificationNumber?: string;
  };
  /**
   * Australian Therapeutic Goods Administration AUST L (Listed Medicine)
   * number. Only meaningful on products served by the AU market app. When
   * present, the product is TGA-listed and can be sold at any Australian
   * pharmacy without import friction. Undefined for products imported via
   * the TGA Personal Importation Scheme (3-month personal-use supply).
   */
  austl?: string;
  /**
   * Halal certification status. Meaningful primarily on products served by
   * the SEA + GCC market apps, where halal is a federal-law requirement for
   * Indonesian (BPJPH) and Malaysian (JAKIM) consumers and a strong trust
   * signal across GCC. `true` only when a verifiable certification body has
   * issued one (JAKIM, MUI, BPJPH, IFANCA, GAC, etc.); `false` is a
   * confident "not certified" claim (no body has issued one and we have
   * sufficient evidence — e.g. Western imports with gelatin capsules and
   * no halal claim). Undefined means we have not verified — UI should
   * render no chip rather than guess.
   */
  halalCertified?: boolean;
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
    summary: 'The most comprehensively researched nootropic stack on the market. Most ingredients are clinically dosed and backed by peer-reviewed evidence. Our #1 pick for overall cognitive support.',
    whatItIs: 'Mind Lab Pro is an 11-ingredient pre-formulated nootropic stack made by Opti-Nutra, a UK-based supplement company. It is designed as a complete daily cognitive supplement covering memory, focus, mental energy, mood, and long-term brain health without caffeine or proprietary blends.',
    howItWorks: "Mind Lab Pro works across six bio-pathways simultaneously. Citicoline and Phosphatidylserine support the cholinergic system and neuronal membrane integrity. Lion's Mane stimulates Nerve Growth Factor (NGF) for neuroplasticity. Bacopa Monnieri enhances synaptic communication for memory. Rhodiola Rosea and L-Tyrosine support dopamine/norepinephrine balance under stress. L-Theanine promotes alpha brain wave activity for calm focus. B-vitamins (B6, B9, B12) support homocysteine regulation and neurotransmitter synthesis.",
    whatToExpect: "Within 30-60 minutes: mild calm focus from L-Theanine. Within 2-4 weeks: improved mental energy and reduced cognitive fatigue (Citicoline, Tyrosine). At 8-12 weeks: measurable improvements in memory recall and learning speed (Bacopa, Lion's Mane). Mind Lab Pro is a long-game supplement -- most users report subtle but sustained improvement rather than dramatic day-one effects. Best results require 3+ months of consistent daily use.",
    pros: ['11 ingredients at clinical doses', 'Third-party tested, allergen-free', 'EU and US storefronts', 'Caffeine-free', '365-day affiliate cookie'],
    cons: ['Premium price ($69/mo)', '4 capsules per serving', '30-day money-back'],
    editorChoice: true,
    market: 'both',
    updatedAt: '2026-05-28',
    handsOnTested: true,
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
    updatedAt: '2026-05-28',
    handsOnTested: true,
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
    updatedAt: '2026-05-28',
    handsOnTested: true,
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
    whatItIs: "Alpha Brain is Onnit's flagship nootropic product, first released in 2011 and popularised through Joe Rogan's podcast endorsements. It is the best-recognised nootropic brand in the mainstream US market and one of only two nootropic supplements with published clinical trial data on its specific formula. It is National Sanitation Foundation (NSF) Certified for Sport, making it suitable for drug-tested athletes.",
    howItWorks: "Alpha Brain uses three proprietary blends -- Onnit Flow Blend, Focus Blend, and Fuel Blend -- containing cholinergics (Alpha-GPC), adaptogens (Bacopa), and amino acids (Tyrosine, Theanine). Because doses are hidden in proprietary blends, we cannot verify whether individual ingredient doses match clinical trial thresholds. The two published studies (Onnit-funded, 2016 and 2021) tested the full formula and showed statistically significant improvements in verbal memory and executive function versus placebo.",
    whatToExpect: "Day one: subtle focus improvement, particularly noticeable for users who haven't taken cholinergic supplements before. The lack of caffeine means no energy spike -- effects are gentle. The proprietary blend means dosing is optimised for the formula as a whole, not for individual ingredients. At 4-6 weeks: most users report consistent mild improvements in word retrieval and task focus. The 90-day money-back guarantee is one of the most generous in the category.",
    pros: ['Two published clinical studies', 'Highest US brand recognition', 'Only 2 capsules', '90-day money-back', 'National Sanitation Foundation (NSF) Certified for Sport'],
    cons: ['Proprietary blends hide doses', 'No EU storefront', 'Subscription cancellation issues'],
    editorChoice: false,
    market: 'us',
    updatedAt: '2026-05-28',
    handsOnTested: true,
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
    updatedAt: '2026-05-28',
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
    updatedAt: '2026-05-28',
  },
  {
    id: 'naturebell-ginkgo-ginseng',
    name: 'NatureBell Ginkgo + Ginseng',
    brand: 'NatureBell',
    slug: 'naturebell-ginkgo-ginseng-review',
    bestFor: ['Budget', 'Memory', 'TCM-inspired formula'],
    score: 6.8,
    scoreBreakdown: { ingredients: 7, dosing: 7, transparency: 6, value: 9, trust: 6 },
    priceMonthlyUSD: 5,
    pricingModel: 'one-time',
    moneyBackDays: 60,
    caffeineFree: true,
    euStorefront: false,
    euCompliance: 'verify',
    trustpilotScore: null,
    trustpilotCount: null,
    affiliateUrl: 'https://www.amazon.com/Naturebell-Capsules-GinkoVida-Strength-Supplement/dp/B09F4ML3FF',
    affiliateNetwork: 'Amazon Associates',
    commissionRate: '4%',
    cookieDays: 24,
    heroIngredients: ['Ginkgo Biloba', 'Panax Ginseng'],
    ingredientDosages: [
      { name: 'Ginkgo Biloba Extract (50:1)', doseInProduct: '120mg', clinicalDose: '120mg', adequatelyDosed: true },
      { name: 'Panax Ginseng Extract', doseInProduct: '10mg', clinicalDose: '200mg', adequatelyDosed: false },
    ],
    servingsPerContainer: 150,
    capsulesPerServing: 2,
    summary: 'NatureBell Ginkgo + Ginseng is the most affordable nootropic in this review at approximately $5 USD/month for a 5-month supply (300 capsules for ~$25). Chinese-manufactured with US branding, available on Amazon with Prime shipping. Combines Ginkgo Biloba (clinically dosed at 120mg) with Panax Ginseng — a TCM-inspired pairing for cerebral blood flow and cognitive energy. Best as a budget entry point or stack addition.',
    whatItIs: 'NatureBell is a US-registered supplement brand sourcing ingredients from Chinese manufacturers. Their Ginkgo + Ginseng formula uses a 50:1 Ginkgo Biloba extract (equivalent to 6,000mg raw herb per serving) at the clinical dose of 120mg, paired with Panax Ginseng extract. Available exclusively through Amazon with Prime shipping across the US, Canada, Australia, and select international markets. The 300-capsule bottle provides a 5-month supply — the best per-month value in this entire review.',
    howItWorks: 'Ginkgo Biloba improves cerebral blood flow via vasodilation and platelet-activating factor (PAF) inhibition, delivering more oxygen and glucose to neurons. Panax Ginseng contains ginsenosides that modulate NMDA receptor activity, support dopaminergic signalling, and may improve working memory under fatigue. The combination is one of the oldest TCM cognitive pairings, now supported by modern clinical evidence for Ginkgo in particular.',
    whatToExpect: 'Weeks 1-2: mild improvement in mental alertness from Ginkgo blood flow effects. Weeks 4-8: cumulative memory and concentration benefits. At 12+ weeks: sustained cognitive maintenance. The Ginseng dose is well below clinical levels (10mg vs 200mg needed), so most cognitive benefit comes from the properly-dosed Ginkgo component. Best used as a stack addition alongside a premium nootropic rather than a standalone solution.',
    pros: ['Cheapest nootropic in this review (~$5/month)', 'Ginkgo at full clinical dose (120mg)', '300 capsules — 5-month supply', 'Amazon Prime shipping', '60-day money-back guarantee'],
    cons: ['Ginseng severely underdosed (10mg vs 200mg clinical)', 'Chinese-manufactured — limited transparency', 'No third-party CoA published', 'Two-ingredient formula only'],
    editorChoice: false,
    market: 'us',
    updatedAt: '2026-05-28',
  },
  {
    id: 'performance-lab-mind',
    name: 'Performance Lab Mind',
    brand: 'Opti-Nutra',
    slug: 'performance-lab-mind-review',
    bestFor: ['Lean stack', 'Stim-free focus', 'Stackable formula'],
    score: 8.5,
    scoreBreakdown: { ingredients: 9, dosing: 10, transparency: 10, value: 8, trust: 6 },
    priceMonthlyUSD: 49,
    pricingModel: 'both',
    moneyBackDays: 30,
    caffeineFree: true,
    euStorefront: true,
    euCompliance: 'compliant',
    trustpilotScore: 4.0,
    trustpilotCount: 6,
    affiliateUrl: 'https://www.performancelab.com/products/mind',
    affiliateNetwork: 'UberNet',
    commissionRate: '30%',
    cookieDays: 365,
    heroIngredients: ['Cognizin Citicoline', 'Sharp-PS Phosphatidylserine', 'Ajipure L-Tyrosine', 'Maritime Pine Bark Extract'],
    ingredientDosages: [
      { name: 'Citicoline (Cognizin)', doseInProduct: '250mg', clinicalDose: '250mg', adequatelyDosed: true },
      { name: 'Phosphatidylserine (Sharp-PS Green)', doseInProduct: '100mg', clinicalDose: '100mg', adequatelyDosed: true },
      { name: 'L-Tyrosine (Ajipure)', doseInProduct: '250mg', clinicalDose: '300-500mg', adequatelyDosed: false },
      { name: 'Maritime Pine Bark Extract (95% proanthocyanidins)', doseInProduct: '75mg', clinicalDose: '50-100mg', adequatelyDosed: true },
    ],
    servingsPerContainer: 30,
    capsulesPerServing: 2,
    summary: 'A minimalist 4-ingredient cognitive stack from Opti-Nutra (the same UK parent that makes Mind Lab Pro). Every ingredient is a branded, standardized extract dosed at or near clinical evidence. Best for people who want a clean, stackable formula rather than a kitchen-sink approach.',
    whatItIs: 'Performance Lab Mind is a 4-ingredient stim-free nootropic produced by Opti-Nutra Ltd, the same Leamington Spa company that makes our editor-choice pick Mind Lab Pro. It uses only branded standardized extracts — Cognizin citicoline, Sharp-PS Green phosphatidylserine, Ajipure L-tyrosine, and Maritime Pine Bark — delivered in NutriCaps prebiotic-infused vegan capsules. The product is positioned as the lean, stackable counterpart to Mind Lab Pro for users who want focused dosing without ingredient overlap. It is manufactured in the USA in an FDA-registered current Good Manufacturing Practice (cGMP) facility and only sold via the official website.',
    howItWorks: 'Cognizin citicoline raises brain phosphatidylcholine and supports acetylcholine synthesis for membrane integrity and focus. Sharp-PS Green phosphatidylserine targets the FDA-qualified claim for cognitive decline and supports neuronal membrane fluidity. Ajipure L-tyrosine is a precursor for dopamine and norepinephrine, blunting cognitive decline under acute stress and sleep loss. Maritime Pine Bark proanthocyanidins cross the blood-brain barrier, support cerebral blood flow, and act as long-acting antioxidants. The four-ingredient logic is membrane + neurotransmitter precursor + circulation — the minimum complete stack for cognitive support.',
    whatToExpect: 'Within 30-60 minutes: subtle calm focus and improved working memory from citicoline and tyrosine. Within 2-4 weeks: noticeable mental endurance under cognitive load and stress. At 8-12 weeks: cumulative neuroprotective benefits from PS and pine bark. Most users report this stack feels cleaner than multi-ingredient formulas — fewer ingredients also means fewer GI or jitter complaints. Best for users who already supplement separately for adaptogens, mushrooms, or B-vitamins and want a focused base layer.',
    pros: ['Every ingredient at or near clinical dose', 'Only branded standardized extracts (Cognizin, Sharp-PS, Ajipure)', 'Just 2 capsules per serving', 'EU and US storefronts', '365-day affiliate cookie', 'Stackable with Performance Lab Energy and other PL products'],
    cons: ['Only 6 Trustpilot reviews — limited social proof', '4-ingredient formula will feel sparse versus 11+ ingredient competitors', 'No Amazon or retail availability', 'Tyrosine slightly under clinical range', 'Less brand recognition than sister product Mind Lab Pro'],
    editorChoice: false,
    market: 'us',
    updatedAt: '2026-05-28',
  },
  {
    id: 'hunter-focus',
    name: 'Hunter Focus',
    brand: 'Roar Ambition',
    slug: 'hunter-focus-review',
    bestFor: ['Open formula', 'Executive nootropic', 'Comprehensive stack'],
    score: 8.2,
    scoreBreakdown: { ingredients: 9, dosing: 8, transparency: 10, value: 6, trust: 7 },
    priceMonthlyUSD: 90,
    pricingModel: 'one-time',
    moneyBackDays: 90,
    caffeineFree: false,
    euStorefront: true,
    euCompliance: 'verify',
    trustpilotScore: 3.6,
    trustpilotCount: 0,
    affiliateUrl: 'https://www.hunterevolve.com/en-us/hunter-focus',
    affiliateNetwork: 'In-house (Stacked Brands)',
    commissionRate: 'Not publicly disclosed',
    cookieDays: 30,
    heroIngredients: ["Lion's Mane", 'Citicoline', 'Bacopa Monnieri', 'L-Theanine', 'Phosphatidylserine', 'Ashwagandha'],
    ingredientDosages: [
      { name: 'Citicoline', doseInProduct: '250mg', clinicalDose: '250mg', adequatelyDosed: true },
      { name: "Lion's Mane Mushroom (10:1 extract)", doseInProduct: '500mg', clinicalDose: '500mg', adequatelyDosed: true },
      { name: 'Bacopa Monnieri (50% bacosides)', doseInProduct: '300mg', clinicalDose: '300mg', adequatelyDosed: true },
      { name: 'L-Tyrosine', doseInProduct: '500mg', clinicalDose: '300-500mg', adequatelyDosed: true },
      { name: 'L-Theanine', doseInProduct: '200mg', clinicalDose: '100-200mg', adequatelyDosed: true },
      { name: 'Phosphatidylserine', doseInProduct: '200mg', clinicalDose: '100-300mg', adequatelyDosed: true },
      { name: 'Ashwagandha Extract', doseInProduct: '300mg', clinicalDose: '300-600mg', adequatelyDosed: true },
      { name: 'Rhodiola Rosea (3% rosavins)', doseInProduct: '100mg', clinicalDose: '200-600mg', adequatelyDosed: false },
      { name: 'Maritime Pine Bark Extract', doseInProduct: '75mg', clinicalDose: '50-100mg', adequatelyDosed: true },
      { name: 'Panax Ginseng', doseInProduct: '100mg', clinicalDose: '200-400mg', adequatelyDosed: false },
      { name: 'N-Acetyl L-Cysteine (NAC)', doseInProduct: '250mg', clinicalDose: '600-1200mg', adequatelyDosed: false },
      { name: 'Caffeine Anhydrous', doseInProduct: '100mg', clinicalDose: '50-200mg', adequatelyDosed: true },
      { name: 'Vitamin C', doseInProduct: '120mg', clinicalDose: '90-120mg', adequatelyDosed: true },
      { name: 'Vitamin D3', doseInProduct: '50mcg (2000 IU)', clinicalDose: '15-50mcg', adequatelyDosed: true },
      { name: 'Vitamin B6 (P-5-P)', doseInProduct: '2.5mg', clinicalDose: '1.3-2mg', adequatelyDosed: true },
      { name: 'Vitamin B9 (Folate)', doseInProduct: '333mcg', clinicalDose: '400mcg', adequatelyDosed: false },
      { name: 'Vitamin B12 (Methylcobalamin)', doseInProduct: '20mcg', clinicalDose: '2.4mcg', adequatelyDosed: true },
    ],
    servingsPerContainer: 30,
    capsulesPerServing: 6,
    summary: 'A 20-ingredient fully-disclosed open-label nootropic from Roar Ambition (UK). Most ingredients are at or near clinical doses. Premium positioning for ambitious professionals 30+; the 6-capsule serving and $90 single-bottle price are the main barriers.',
    whatItIs: 'Hunter Focus is the cognitive product in the Hunter Evolve premium men-and-women supplement line, made by Roar Ambition / Stacked Brands in Leeds, UK. It uses a fully transparent 20-ingredient formula organized into three proprietary "zones": Concentration Activation, Memory Matrix, and Mood Amplification. The brand is positioned for ambitious professionals aged 30+ and is manufactured in current Good Manufacturing Practice (cGMP) certified facilities in the USA and UK. It is sold only through the Hunter Evolve official website with no Amazon or retail distribution.',
    howItWorks: 'The 20-ingredient stack covers four main pathways. Cholinergics (Citicoline) and acetylcholinesterase support drive day-one focus. Adaptogens (Ashwagandha, Rhodiola, Panax Ginseng) buffer cortisol and stress-induced cognitive decline. Membrane and neurotrophic compounds (Phosphatidylserine, Lion\'s Mane) build long-term brain health and neuroplasticity. Catecholamine precursors (L-Tyrosine) plus L-Theanine and a moderate caffeine dose provide acute mental energy. The B-vitamin complex supports homocysteine regulation and neurotransmitter synthesis. The Ultimate Bundle (4-month supply at $270) brings the effective monthly cost down to roughly $67.50.',
    whatToExpect: 'Day one: noticeable focus and energy from caffeine + tyrosine + citicoline within 30-60 minutes. The L-theanine softens any caffeine jitter. Within 2-4 weeks: improved stress resilience and stable mood under workload (adaptogens). At 8-12 weeks: measurable memory and learning benefits from Lion\'s Mane and Bacopa. The 6-capsule daily serving is the highest in this review and may be a deal-breaker for capsule-averse users. Stack is built around moderate caffeine — not suitable if you already drink multiple cups of coffee.',
    pros: ['Fully open-label 20-ingredient formula — no proprietary blends', 'Most ingredients at clinical doses', 'Comprehensive multi-pathway coverage', '90-day money-back guarantee', 'Ultimate Bundle drops effective price below $70/month', 'cGMP USA + UK manufacturing'],
    cons: ['$90/month at single-bottle price — premium positioning', '6 capsules per serving — highest pill burden in this review', 'Contains 100mg caffeine — not stim-free', 'No subscription option, only multi-month bundles', 'Limited Trustpilot footprint — minimal independent social proof', 'Folate, NAC, ginseng, and rhodiola underdosed versus clinical evidence'],
    editorChoice: false,
    market: 'us',
    updatedAt: '2026-05-28',
  },
  {
    id: 'brainmd-brain-memory-power-boost',
    name: 'BrainMD Brain & Memory Power Boost',
    brand: 'BrainMD (Dr. Daniel Amen)',
    slug: 'brainmd-brain-memory-power-boost-review',
    bestFor: ['Doctor-formulated', 'Memory support', 'Older adults'],
    score: 7.5,
    scoreBreakdown: { ingredients: 8, dosing: 8, transparency: 7, value: 6, trust: 7 },
    priceMonthlyUSD: 90,
    pricingModel: 'both',
    moneyBackDays: 30,
    caffeineFree: true,
    euStorefront: false,
    euCompliance: 'verify',
    trustpilotScore: 2.3,
    trustpilotCount: 16,
    affiliateUrl: 'https://brainmd.com/brain-memory-power-boost',
    affiliateNetwork: 'ShareASale',
    commissionRate: '20%',
    cookieDays: 30,
    heroIngredients: ['Phosphatidylserine', 'Acetyl-L-Carnitine', 'Ginkgo Biloba', 'Huperzine A'],
    ingredientDosages: [
      { name: 'Phosphatidylserine', doseInProduct: '100mg', clinicalDose: '100-300mg', adequatelyDosed: true },
      { name: 'Acetyl-L-Carnitine', doseInProduct: '500mg', clinicalDose: '500-2000mg', adequatelyDosed: true },
      { name: 'Ginkgo Biloba (24% glycosides, 6% lactones)', doseInProduct: '120mg', clinicalDose: '120-240mg', adequatelyDosed: true },
      { name: 'Huperzine A', doseInProduct: '50mcg', clinicalDose: '50-200mcg', adequatelyDosed: true },
      { name: 'Vinpocetine', doseInProduct: '5mg', clinicalDose: '15-30mg', adequatelyDosed: false },
      { name: 'N-Acetyl L-Cysteine (NAC)', doseInProduct: '300mg', clinicalDose: '600-1200mg', adequatelyDosed: false },
      { name: 'Alpha Lipoic Acid', doseInProduct: '50mg', clinicalDose: '300-600mg', adequatelyDosed: false },
    ],
    servingsPerContainer: 30,
    capsulesPerServing: 4,
    summary: 'A doctor-formulated brain-and-memory stack from Dr. Daniel Amen\'s BrainMD line. The four headline ingredients (PS, ALCAR, Ginkgo, Huperzine) are clinically dosed; several supporting ingredients are not. Positioned for older adults and patients in the Amen Clinics ecosystem.',
    whatItIs: 'BrainMD Brain & Memory Power Boost is the flagship cognitive product from BrainMD, the supplement company founded by Dr. Daniel Amen — the psychiatrist and bestselling author known for the Amen Clinics and SPECT imaging-based brain assessments. The product is a 7-ingredient memory-and-aging-focused stack manufactured to pharmaceutical-grade quality standards in current Good Manufacturing Practice (cGMP) compliant facilities. It is sold direct via brainmd.com, on Amazon, and through Costco, with broad reach into the older-adult and clinician-referred consumer segment.',
    howItWorks: 'Phosphatidylserine supports neuronal membrane fluidity and carries an FDA-qualified health claim for cognitive decline. Acetyl-L-Carnitine crosses the blood-brain barrier, supports mitochondrial energy in neurons, and has trial evidence for mild cognitive impairment. Ginkgo Biloba improves cerebral blood flow via vasodilation and PAF inhibition. Huperzine A is a reversible acetylcholinesterase inhibitor that elevates synaptic acetylcholine — clinically used for memory in some markets. Vinpocetine, NAC, and Alpha Lipoic Acid are present at sub-clinical doses but contribute supporting antioxidant and neuroprotective activity.',
    whatToExpect: 'This is a long-game memory product — expect minimal day-one effects. Within 2-4 weeks: subtle improvements in word retrieval and short-term recall (Ginkgo + Huperzine A). At 8-12 weeks: cumulative membrane and mitochondrial benefits from PS and ALCAR. Best suited for adults over 50 working on long-term memory maintenance rather than acute focus. Cycle Huperzine A (5 days on, 2 off) — the long half-life can cause acetylcholine excess if taken continuously for months.',
    pros: ['Headline ingredients (PS, ALCAR, Ginkgo, Huperzine A) all clinically dosed', 'Pharmaceutical-grade cGMP manufacturing', 'Caffeine-free', 'Available on Amazon and at Costco', '20% subscription discount', 'Strong recognition among older demographics and clinician-referred patients'],
    cons: ['Vinpocetine, NAC, and Alpha Lipoic Acid significantly underdosed versus clinical evidence', '$89.95 for 120 capsules works out to ~$90/month at 4 capsules per day', '4 capsules per serving', 'Transparency note: Dr. Amen\'s SPECT-imaging diagnostic claims have been criticized by mainstream psychiatry — buy on the formula, not the founder narrative', 'No Trustpilot footprint to verify customer experience', '30-day money-back is shorter than competitors'],
    editorChoice: false,
    market: 'us',
    updatedAt: '2026-05-28',
  },
  {
    id: 'trubrain',
    name: 'TruBrain',
    brand: 'TruBrain',
    slug: 'trubrain-review',
    bestFor: ['Liquid format', 'On-the-go use', 'Pill-averse users'],
    score: 7.8,
    scoreBreakdown: { ingredients: 8, dosing: 8, transparency: 8, value: 6, trust: 5 },
    priceMonthlyUSD: 75,
    pricingModel: 'subscription',
    moneyBackDays: 0,
    caffeineFree: false,
    euStorefront: false,
    euCompliance: 'verify',
    trustpilotScore: 2.6,
    trustpilotCount: 0,
    affiliateUrl: 'https://www.trubrain.com',
    affiliateNetwork: 'ShareASale',
    commissionRate: '15%',
    cookieDays: 14,
    heroIngredients: ['Citicoline', 'L-Tyrosine', 'L-Theanine', 'Magnesium Threonate', 'Centrophenoxine'],
    ingredientDosages: [
      { name: 'Citicoline (CDP-Choline)', doseInProduct: '250mg', clinicalDose: '250mg', adequatelyDosed: true },
      { name: 'L-Tyrosine', doseInProduct: '500mg', clinicalDose: '300-500mg', adequatelyDosed: true },
      { name: 'L-Theanine', doseInProduct: '200mg', clinicalDose: '100-200mg', adequatelyDosed: true },
      { name: 'Magnesium (as Magtein L-Threonate)', doseInProduct: '85mg elemental', clinicalDose: '144mg elemental (2g Magtein)', adequatelyDosed: false },
      { name: 'Centrophenoxine', doseInProduct: '250mg', clinicalDose: '250-1000mg', adequatelyDosed: true },
      { name: 'Caffeine', doseInProduct: '100mg', clinicalDose: '50-200mg', adequatelyDosed: true },
    ],
    servingsPerContainer: 20,
    capsulesPerServing: 0,
    summary: 'The only major nootropic in liquid-shot format. Co-founded by UCLA-trained neuroscientist Dr. Andrew Hill. Disclosed doses are mostly clinical, but the 2.6/5 Trustpilot score and aggressive autoship complaints are a real concern — read the cancellation terms before subscribing.',
    whatItIs: 'TruBrain is a liquid nootropic delivered in 1-oz drink shots, founded in 2012 in Santa Monica, California. The company was co-founded by Dr. Andrew Hill, a UCLA-trained cognitive neuroscientist, which is the brand\'s primary credibility anchor. The standard subscription is a 20-shot monthly box at roughly $75/month ($3.75 per shot). TruBrain also sells variants — Focus, Ketones, Mellow, Extra — plus a capsule version for users who prefer pills. The product is sold direct via trubrain.com only.',
    howItWorks: 'Each shot delivers a synergistic stack. Citicoline raises brain phosphatidylcholine and supports acetylcholine for focus. L-Tyrosine is a precursor to dopamine and norepinephrine, supporting performance under stress and sleep loss. L-Theanine paired with caffeine produces calm focus while smoothing the caffeine spike. Magnesium L-Threonate (Magtein) is the only magnesium form clinically shown to raise brain magnesium concentrations, supporting NMDA receptor function and synaptic plasticity. Centrophenoxine is a cholinergic compound related to DMAE that supports acetylcholine and clears lipofuscin from neurons.',
    whatToExpect: 'Onset is fast because of the liquid format — most users feel focus and energy within 15-30 minutes (faster than capsule competitors). The taste is divisive — multiple reviews describe it as thick and medicinal. Within 2-4 weeks: cumulative magnesium threonate and centrophenoxine benefits for memory and learning. Important warnings: (1) the autoship enrollment is aggressive and customer service is often slow to cancel — review the cancellation steps before the first charge; (2) most products carry no money-back guarantee; (3) the Trustpilot score of 2.6/5 is driven primarily by billing and cancellation complaints, not formula complaints.',
    pros: ['Only major liquid-format nootropic — best for pill-averse users', 'Fast onset (15-30 min) versus capsule formats', 'Clinically-trained co-founder (Dr. Andrew Hill, UCLA neuroscience)', 'Magnesium L-Threonate is a high-quality, expensive ingredient most competitors skip', 'Disclosed doses for all ingredients', 'Convenient on-the-go format'],
    cons: ['Trustpilot 2.6/5 — significant complaints about billing and customer service', 'Aggressive autoship enrollment; cancellation reportedly difficult', 'No money-back guarantee on most products', 'Magnesium dose below Magtein clinical trial level (full 2g)', 'Taste divisive — thick and medicinal per reviews', 'Premium per-serving price ($3.75/shot) versus capsules', 'Customer support response times reportedly up to a week', 'Some CBD-labeled product variants raise compliance flags'],
    editorChoice: false,
    market: 'us',
    updatedAt: '2026-05-28',
  },
];
