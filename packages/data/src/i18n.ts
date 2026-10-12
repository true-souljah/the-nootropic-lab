import { NO_PURCHASE_LINK_STRINGS, type NoPurchaseLinkStrings } from './purchase-link';
import type { Product } from './products-us';

export type Locale = 'en' | 'es' | 'fr' | 'ja' | 'pt' | 'de' | 'fr-CA';

/** One string per score pillar (the keys of Product.scoreBreakdown). */
export type PillarStrings = Record<keyof Product['scoreBreakdown'], string>;

export interface UIStrings {
  /**
   * Intl locale for prices on this host: each price stays in its store's own
   * currency, and the locale only decides how it is written (en-CA writes
   * US$79.95 and $89.00 for CAD). Set by buildRegionSearchContext; absent on
   * bundles from getStrings() alone, where productDetail.dateLocale is used.
   */
  priceLocale?: string;
  nav: {
    bestNootropics: string;
    compare: string;
    ingredients: string;
    guides: string;
    methodology: string;
    /** Public chrome "About" link — consumed by FPHeader's localized default nav. */
    about: string;
    topPicks: string;
    search: string;
    openMenu: string;
    closeMenu: string;
    /** aria-label for the primary `<nav>` landmark in public chrome. WCAG 3.1.2. */
    primaryLandmark: string;
    /** Label on the indigo "Open comparator" CTA in FPHeader. WCAG 3.1.2. */
    openComparator: string;
    /** Skip-link target text in PublicShell (first focusable element). WCAG 3.1.2 + 2.4.1. */
    skipToContent: string;
  };
  footer: {
    /** Left-column tagline paragraph. */
    tagline: string;
    /** Bottom-row copyright sentence. `{year}` is interpolated at render time. */
    copyrightLine: string;
    /** Prefix shown before the audit date in the bottom-right meta line. */
    lastAuditLabel: string;
    /** Label between the date and the version (e.g. "Methodology"). */
    methodologyLabel: string;
    /** Column 1: best-by-goal. */
    bestByGoal: {
      heading: string;
      focus: string;
      memory: string;
      adhd: string;
      aging: string;
      energy: string;
      mood: string;
      studying: string;
    };
    /** Column 2: head-to-head comparisons. Brand-vs-brand link labels stay English (proper nouns); only "All comparisons →" translates. */
    headToHead: {
      heading: string;
      allComparisons: string;
    };
    /** Column 3: regional cross-domain links. Country/region names translate (WCAG 3.1.2 — these are natural language, not proper nouns). */
    byRegion: {
      heading: string;
      us: string;
      eu: string;
      ca: string;
      au: string;
      jp: string;
      latam: string;
      gcc: string;
      sea: string;
    };
    /** Column 4: about/legal/policy. */
    about: {
      heading: string;
      methodology: string;
      disclosures: string;
      privacy: string;
      cookies: string;
      imprint: string;
      contact: string;
    };
  };
  cookie: {
    message: string;
    gdprNote: string;
    accept: string;
    decline: string;
    privacyPolicy: string;
    /** Persistent "Cookie settings" control that re-opens the consent manager (footer / app shell). */
    settings: string;
  };
  disclosure: {
    text: string;
    methodology: string;
    /** Short label on the top-of-page disclosure strip. */
    badge: string;
    /**
     * Plain-language commission sentence rendered next to the first
     * affiliate CTA (FTC "as close as possible"; UK ASA: never the word
     * "affiliate" alone).
     */
    inline: string;
    /**
     * Replaces `inline` on the review page of a product we earn no commission
     * on (`earnsCommission(product)` is false, e.g. `commissionRate: "0%"`).
     * True whether or not the page shows a buy link.
     */
    noCommission: string;
    /**
     * Whether commission influences ranking (EU UCPD Annex I 11a). Must
     * mirror the published /methodology/ policy — do not change without it.
     */
    ranking: string;
  };
  table: {
    product: string;
    bestFor: string;
    score: string;
    /** Column header for the store price (pack price, or ≈ per month where the supply is stated). */
    price: string;
    caffeineFree: string;
    euStatus: string;
    moneyBack: string;
    trustpilot: string;
    checkPrice: string;
    noResults: string;
    yes: string;
    no: string;
    na: string;
    sortBy: string;
    ascending: string;
    descending: string;
  };
  breadcrumb: {
    home: string;
    ingredients: string;
    /** Components append " {currentYear}" after this string. */
    backToBestNootropics: string;
    backToIngredientsGuide: string;
    /** aria-label for every `<nav>` breadcrumb landmark across the template
     * library. WCAG 3.1.2 — landmark accessible name must match the page lang. */
    ariaLabel: string;
  };
  /** SearchModal page items + descriptions injected by buildSearchIndex. */
  search: {
    pages: {
      bestNootropics: string;
      compareAll: string;
      methodology: string;
    };
    descriptions: {
      bestNootropics: string;
      compareAll: string;
      methodology: string;
    };
    /**
     * Aria-live status messages announced when the search filter
     * count changes. PR-Q29 (#93) — extends PR-Q28's English-only
     * announcements to the full 7-locale matrix. Each phrase carries
     * a `{n}` (result count) or `{query}` (capped to 40 chars +
     * U+2026 by the caller) placeholder.
     */
    liveRegion: {
      /** Announced when query has results AND count === 1. e.g. "1 result". */
      oneResult: string;
      /** Announced when query has results AND count > 1. e.g. "12 results". `{n}` is the count. */
      manyResults: string;
      /** Announced when query has zero matches. `{query}` is the (already-capped) user input. */
      noResults: string;
    };
  };
  ingredientDetail: {
    chips: {
      clinicalDose: string;
      onset: string;
    };
    sections: {
      mechanism: string;
      evidence: string;
      effects: string;
      benefits: string;
      sideEffects: string;
      howTo: string;
      stacking: string;
      faq: string;
      related: string;
    };
    /** TOC labels in the sidebar Quick facts card. */
    toc: {
      mechanism: string;
      evidence: string;
      effects: string;
      benefits: string;
      howTo: string;
      stacking: string;
      faq: string;
      products: string;
      related: string;
    };
    table: {
      effect: string;
      evidence: string;
      magnitude: string;
      studies: string;
      notes: string;
    };
    magnitude: {
      large: string;
      moderate: string;
      small: string;
      negligible: string;
    };
    category: {
      adaptogen: string;
      cholinergic: string;
      mushroom: string;
      amino: string;
      herb: string;
      vitamin: string;
    };
    sidebar: {
      quickFacts: string;
      onThisPage: string;
      category: string;
      dose: string;
      onset: string;
      trials: string;
    };
    /** Template with {name} placeholder. */
    stackingLede: string;
  };
  /** Evidence-review strings on ingredient pages (/ingredients/<slug>/). */
  ingredientEvidence: {
    /** Heading of the collapsible Sources block at the end of an ingredient page. */
    sources: string;
    /** Prefix before the evidence-review date, e.g. "Evidence reviewed:". */
    evidenceReviewed: string;
  };
  productDetail: {
    chips: {
      editorPick: string;
      caffeineFree: string;
      hasCaffeine: string;
      allClinicalDoses: string;
      /** Health Canada NPN-licensed. Number appended after the label in JSX. */
      npnLicensed: string;
      /** No active NPN found in the LNHPD for the names searched (personal importation under GUI-0116 is the route only without a label NPN). */
      personalImport: string;
      /** JP Foods with Function Claims (機能性表示食品) notified to the Consumer Affairs Agency. */
      ffcNotified: string;
      /** AU TGA Listed Medicine. Number appended after the label in JSX. */
      austListed: string;
      /** Halal-certified by a verifiable body (JAKIM, MUI, BPJPH, IFANCA, GAC, etc.). */
      halalCertified: string;
    };
    meta: {
      /** Prefix before brand name in the meta line: "By {brand}". */
      by: string;
      /** Descriptor between brand and pack count, per `Product.form`. */
      productDescriptorByForm: { capsule: string; tablet: string; sachet: string; shot: string; powder: string; softgel: string };
      /** Label before the record's last-edit date (`updatedAt`), used when no `verifiedAt`. */
      updated: string;
      /** Label before the record's verification date (`verifiedAt`), e.g. "Last verified:". */
      lastVerified: string;
      /** Brand byline on product reviews. Team credit only — never a named individual. */
      reviewedBy: string;
    };
    /** BCP-47 locale code passed to Intl.DateTimeFormat for the meta-line date. */
    dateLocale: string;
    score: {
      label: string;
      outOf10: string;
    };
    stats: {
      price: string;
      /**
       * Monthly-price unit WITHOUT the slash ("mo", "Monat"); render as
       * `${price}/${monthUnit}`. A string starting with "/" in the RSC payload
       * is crawled by Google as a URL (GSC 404 "/mo", 2026-10).
       */
      monthUnit: string;
      capsules: string;
      /** Stat label for the per-day serving, whatever the product's form. */
      dailyServing: string;
      /** Unit label per `Product.form`, shown after `capsulesPerServing`. */
      units: { capsule: string; tablet: string; sachet: string; shot: string; powder: string; softgel: string };
      /** Same labels for a count of exactly 1 ("1 sachet", not "1 sachets"). */
      unitsSingular: { capsule: string; tablet: string; sachet: string; shot: string; powder: string; softgel: string };
      moneyBack: string;
      /** "days" suffix for the money-back-guarantee value. */
      days: string;
      trustpilot: string;
      notAvailable: string;
      ourCut: string;
    };
    /** CTA label inside the header card, e.g. "Visit brand →". */
    visitBrand: string;
    tabs: {
      overview: string;
      dosing: string;
      pillars: string;
      reviews: string;
      pricing: string;
      /** Tab-bar accessible name. */
      ariaLabel: string;
    };
    /** Heading for the bottom alternatives rail. */
    alternatives: string;
    /**
     * Pricing tab (product-detail/PricingTab.tsx). It quotes only terms the
     * vendor states on its own site (Product.vendorTerms), verbatim and in the
     * vendor's language; these strings are the labels around those quotes.
     */
    pricing: {
      /** Heading above the quoted vendor terms. */
      vendorTermsHeading: string;
      /** One line under the heading: the terms are quoted word for word and can change. */
      vendorTermsLede: string;
      /** Label of the shipping quote. */
      shipping: string;
      /** Label of the subscription-cancellation quote. */
      cancellation: string;
      /** Label of the one-time-purchase price quote. */
      oneTimePrice: string;
      /** Label of the guarantee quote when the record has a money-back guarantee length. */
      moneyBackGuarantee: string;
      /** Label of the guarantee quote when the vendor's policy is a returns window, not a money-back guarantee. */
      returns: string;
      /** Source line under each quote; {domain} becomes the linked vendor domain, {date} the check date. */
      attribution: string;
      /** Screen-reader cue on the source link, which opens in a new tab. */
      opensInNewTab: string;
      /** Shown instead of the quotes when no vendor term could be verified. */
      noVendorTerms: string;
      /** Affiliate CTA; {brand} is the product's brand. */
      visitVendor: string;
      /** Heading of the affiliate-cookie block. */
      affiliateCookie: string;
      /** Cookie length and commission; {days} and {rate} are filled from the record. */
      cookieTerms: string;
      /** In place of `cookieTerms` when we earn no commission on the product (`earnsCommission` is false). */
      noAffiliateCookie: string;
    };
    /** Pillars tab (product-detail/PillarsTab.tsx). */
    pillars: {
      /** Pillar names, keyed like Product.scoreBreakdown. */
      labels: PillarStrings;
      /** What each pillar measures, shown under its score. */
      rationale: PillarStrings;
      /** Prefix before the record's `unscoredReason` (data, not translated) when a pillar is null. */
      notScored: string;
      /** Heading of the pillar-weights card. */
      howComputedHeading: string;
      /** Weights are editorial and the same for every brand. */
      howComputedBody: string;
      /** Link to /methodology/. */
      readMethodology: string;
      /** Accessible name of a pillar's score bar; {product} is the product name, {pillar} the pillar label. */
      pillarScoreAria: string;
    };
    /**
     * Dosing tab (product-detail/DosingTab.tsx). Row data (ingredient names,
     * label amounts) stays as recorded; the Clinical cell and the status chip
     * come from these strings.
     */
    dosing: {
      heading: string;
      subtitle: string;
      /** Chip with the dosing units proven adequate; {adequate} and {total} are counts. */
      adequateCount: string;
      /** Shown when the record has no dosing rows. */
      unavailable: string;
      columns: { ingredient: string; label: string; clinical: string; status: string };
      /**
       * Status chip per row: pass/under = the label proves the amount meets /
       * falls below the reference minimum; unverified = the row has a
       * reference dose but the label cannot prove the amount; notScored = the
       * ingredient has no reference dose.
       */
      verdict: { pass: string; under: string; unverified: string; notScored: string };
      /** Clinical cell of a row without a reference dose (data: NO_REFERENCE_DOSE). */
      noReferenceDose: string;
      /**
       * Clinical cell of an anchored row: each DOSING_ANCHORS entry's
       * `clinicalDose` in this locale, keyed by its ingredientSlug (same
       * numbers and units; en is the anchor string itself).
       */
      anchorDose: Record<string, string>;
    };
    /** Notice shown on the review page of a product the vendor no longer sells. */
    discontinued: {
      /** Notice heading, e.g. "Discontinued". */
      heading: string;
      /** Link text to the successor product's review, e.g. "Read our review of the successor". */
      successorLink: string;
    };
    /** Eyebrow heading + section name for the YMYL regulatory disclaimer. */
    healthDisclaimerHeading: string;
    /** aria-label for the chip row above the product name (groups Editor's pick, Caffeine-free, regulatory chips, etc.). */
    chipGroupLabel: string;
  };
  /**
   * Notice that replaces a buy CTA when `purchaseUrl(product)` is null
   * (`Product.noPurchaseLink`). The strings live in ./purchase-link
   * (NO_PURCHASE_LINK_STRINGS) so client templates without a bundle can read
   * them without shipping every locale to the browser.
   */
  noPurchaseLink: NoPurchaseLinkStrings;
  /** Educational guide pages (/guides/<slug>/). */
  guide: {
    /** Heading of the collapsible Sources block at the end of a guide. */
    sources: string;
    /** Visible "expand" hint on the collapsed Sources block. WCAG 3.1.2. */
    expand: string;
    /** Prefix before the evidence-review date, e.g. "Evidence reviewed:". */
    evidenceReviewed: string;
  };
}

const en: UIStrings = {
  nav: {
    bestNootropics: 'Best Nootropics',
    compare: 'Compare',
    ingredients: 'Ingredients',
    guides: 'Guides',
    methodology: 'Methodology',
    about: 'About',
    topPicks: 'Top Picks',
    search: 'Search',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primaryLandmark: 'Primary',
    openComparator: 'Open comparator →',
    skipToContent: 'Skip to main content',
  },
  footer: {
    tagline:
      "We check each nootropic's label doses against the reference doses on our ingredient pages, where one exists. Affiliate commissions are disclosed inline and don't move scores.",
    copyrightLine:
      '© {year} Nootropic Lab · Information is not medical advice. Consult a clinician before starting any supplement.',
    lastAuditLabel: 'Last full re-audit:',
    methodologyLabel: 'Methodology',
    bestByGoal: {
      heading: 'Best by goal',
      focus: 'For focus',
      memory: 'For memory',
      adhd: 'For ADHD',
      aging: 'For aging',
      energy: 'For energy',
      mood: 'For mood',
      studying: 'For studying',
    },
    headToHead: {
      heading: 'Head-to-head',
      allComparisons: 'All comparisons →',
    },
    byRegion: {
      heading: 'By region',
      us: 'United States',
      eu: 'European Union',
      ca: 'Canada',
      au: 'Australia',
      jp: 'Japan',
      latam: 'Latin America',
      gcc: 'Gulf (GCC)',
      sea: 'Southeast Asia',
    },
    about: {
      heading: 'About',
      methodology: 'Methodology',
      disclosures: 'Disclosures',
      privacy: 'Privacy',
      cookies: 'Cookies',
      imprint: 'Imprint',
      contact: 'Contact',
    },
  },
  cookie: {
    message: 'We use analytics cookies to improve your experience. We do not use advertising cookies.',
    gdprNote: 'GDPR: Analytics fires only after you accept. Necessary cookies are always active.',
    accept: 'Accept Analytics',
    decline: 'Decline',
    privacyPolicy: 'privacy policy',
    settings: 'Cookie settings',
  },
  disclosure: {
    text: 'Affiliate disclosure: This page contains affiliate links. If you purchase through our links, we may earn a commission at no extra cost to you. Our editorial opinions are independent — we only recommend products we have independently researched.',
    methodology: 'Read our methodology',
    badge: 'Affiliate disclosure',
    inline: 'We earn a commission if you buy through links on this page, at no extra cost to you.',
    noCommission: "We don't earn a commission on this product; we have no affiliate deal for it.",
    ranking: 'Our scores and rankings follow our published methodology; commissions do not influence them.',
  },
  table: {
    product: 'Product',
    bestFor: 'Best For',
    score: 'Score',
    price: 'Price',
    caffeineFree: 'Caffeine-Free',
    euStatus: 'EU Status',
    moneyBack: 'Money-Back',
    trustpilot: 'Trustpilot',
    checkPrice: 'Check Price →',
    noResults: 'No products match your filters. Try removing one.',
    yes: 'Yes',
    no: 'No',
    na: 'N/A',
    sortBy: 'Sort by',
    ascending: 'ascending',
    descending: 'descending',
  },
  breadcrumb: {
    home: 'Home',
    ingredients: 'Ingredients',
    backToBestNootropics: '← Back to Best Nootropics',
    backToIngredientsGuide: '← Back to Ingredients Guide',
    ariaLabel: 'Breadcrumb',
  },
  search: {
    pages: {
      bestNootropics: 'Best Nootropics',
      compareAll: 'Compare All',
      methodology: 'Methodology',
    },
    descriptions: {
      bestNootropics: 'Full comparison of top brands',
      compareAll: 'Interactive comparison tool',
      methodology: 'How we score supplements',
    },
    liveRegion: {
      oneResult: '1 result',
      manyResults: '{n} results',
      noResults: 'No results for {query}',
    },
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Clinical dose', onset: 'Onset' },
    sections: {
      mechanism: 'Mechanism of action',
      evidence: 'Clinical evidence summary',
      effects: 'Human effect matrix',
      benefits: 'Documented benefits',
      sideEffects: 'Side effects & cautions',
      howTo: 'How to take',
      stacking: 'Stacking recommendations',
      faq: 'Frequently asked questions',
      related: 'Related ingredients',
    },
    toc: {
      mechanism: 'Mechanism',
      evidence: 'Clinical evidence',
      effects: 'Effect matrix',
      benefits: 'Benefits & side effects',
      howTo: 'How to take',
      stacking: 'Stacking',
      faq: 'FAQ',
      products: 'Products with it',
      related: 'Related ingredients',
    },
    table: {
      effect: 'Effect',
      evidence: 'Evidence',
      magnitude: 'Magnitude',
      studies: 'Studies',
      notes: 'Notes',
    },
    magnitude: { large: 'Large', moderate: 'Moderate', small: 'Small', negligible: 'Negligible' },
    category: {
      adaptogen: 'Adaptogen',
      cholinergic: 'Cholinergic',
      mushroom: 'Mushroom',
      amino: 'Amino Acid',
      herb: 'Herb',
      vitamin: 'Vitamin',
    },
    sidebar: {
      quickFacts: 'Quick facts',
      onThisPage: 'On this page',
      category: 'Category',
      dose: 'Dose',
      onset: 'Onset',
      trials: 'Trials',
    },
    stackingLede: 'Ingredients that pair well with {name} and why.',
  },
  ingredientEvidence: {
    sources: 'Sources',
    evidenceReviewed: 'Evidence reviewed:',
  },
  productDetail: {
    chips: {
      editorPick: 'Editor\'s pick',
      caffeineFree: 'Caffeine-free',
      hasCaffeine: 'Caffeine',
      allClinicalDoses: 'All clinical doses',
      npnLicensed: 'Health Canada NPN',
      personalImport: 'Personal Import',
      ffcNotified: 'FFC notified',
      austListed: 'AUST L',
      halalCertified: 'Halal certified',
    },
    meta: {
      by: 'By',
      productDescriptorByForm: { capsule: 'daily nootropic capsule', tablet: 'daily nootropic tablet', sachet: 'daily nootropic sachet', shot: 'daily nootropic shot', powder: 'daily nootropic drink powder', softgel: 'daily nootropic softgel' },
      updated: 'Updated:',
      lastVerified: 'Last verified:',
      reviewedBy: 'Reviewed by The Nootropic Lab editorial team',
    },
    dateLocale: 'en-US',
    score: {
      label: 'Our score',
      outOf10: 'of 10.0',
    },
    stats: {
      price: 'Price',
      monthUnit: 'mo',
      capsules: 'Caps',
      dailyServing: 'Daily serving',
      units: { capsule: 'caps', tablet: 'tablets', sachet: 'sachets', shot: 'shots', powder: 'scoops', softgel: 'softgels' },
      unitsSingular: { capsule: 'cap', tablet: 'tablet', sachet: 'sachet', shot: 'shot', powder: 'scoop', softgel: 'softgel' },
      moneyBack: 'MBG',
      days: 'days',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/A',
      ourCut: 'Our cut',
    },
    visitBrand: 'Visit brand →',
    tabs: {
      overview: 'Overview',
      dosing: 'Dosing audit',
      pillars: 'Pillars',
      reviews: 'Reviews',
      pricing: 'Pricing',
      ariaLabel: 'Product sections',
    },
    alternatives: 'Similar alternatives',
    pricing: {
      vendorTermsHeading: 'What the vendor’s site says',
      vendorTermsLede: 'Quoted word for word from the vendor’s own pages. Terms change, so check them before you buy.',
      shipping: 'Shipping',
      cancellation: 'Cancelling a subscription',
      oneTimePrice: 'One-time purchase price',
      moneyBackGuarantee: 'Money-back guarantee',
      returns: 'Returns',
      attribution: 'Per {domain}, checked {date}',
      opensInNewTab: '(opens in new tab)',
      noVendorTerms: 'We couldn’t verify this vendor’s terms. Check the vendor’s site for current terms.',
      visitVendor: 'Visit {brand} →',
      affiliateCookie: 'Our affiliate cookie',
      cookieTerms: '{days} days · {rate} commission',
      noAffiliateCookie: 'None (no affiliate deal)',
    },
    pillars: {
      labels: {
        ingredients: 'Ingredient quality',
        dosing: 'Dosing vs. clinical evidence',
        transparency: 'Formula transparency',
        value: 'Value for money',
        trust: 'Brand trust',
      },
      rationale: {
        ingredients: 'Number and quality of evidence-graded ingredients. Trademarked extracts and standardized actives raise this score.',
        dosing: "The share of ingredients with a reference dose on our ingredient pages whose label-stated daily amount meets that page's minimum. Amounts the label hides (blend shares) or states on a different basis count as not met; ingredients with no reference page are listed but not scored.",
        transparency: 'Full disclosure of every ingredient at its exact dose. Proprietary blends are scored as opaque.',
        value: 'Cost per month relative to per-serving clinical doses delivered. Cheaper products with underdoses score lower.',
        trust: 'Brand reputation, third-party testing, refund track record, and Trustpilot signal across multiple years.',
      },
      notScored: 'Not scored.',
      howComputedHeading: 'How the score is computed',
      howComputedBody: "Each pillar is weighted by editorial importance. Weights are constant across every brand we audit — they're not adjusted to favour any particular product.",
      readMethodology: 'Read methodology →',
      pillarScoreAria: '{product}: {pillar} pillar score',
    },
    dosing: {
      heading: 'Dosing audit',
      subtitle: 'Label-stated daily amount vs. the minimum on our ingredient pages; ingredients without a reference dose are listed but not scored',
      adequateCount: '{adequate} / {total} adequate',
      unavailable: 'Dosing data unavailable for this product. Many ingredients are hidden inside proprietary blends.',
      columns: { ingredient: 'Ingredient', label: 'Label', clinical: 'Clinical', status: 'Status' },
      verdict: { pass: '✓ Pass', under: '✕ Under', unverified: '? Unverified', notScored: 'Not scored' },
      noReferenceDose: 'No reference dose on file',
      anchorDose: {
        'lions-mane': '1000-1800mg/day',
        'bacopa-monnieri': '300-450mg/day (≥50% bacosides)',
        citicoline: '250-500mg/day',
        'l-theanine': '100-200mg/day',
        'rhodiola-rosea': '200-600mg/day',
        phosphatidylserine: '100-300mg/day',
        'alpha-gpc': '300-600mg/day',
        ashwagandha: '300-600mg/day (KSM-66)',
        'huperzine-a': '100-200mcg/day',
        'l-tyrosine': '2000mg/day (lowest positive trial)',
        caffeine: '100-200mg',
        'ginkgo-biloba': '240mg/day (24/6 extract)',
        'dha-omega-3': '900mg-1.2g DHA/day',
        'maritime-pine-bark': '100-200mg/day',
        'acetyl-l-carnitine': '1500-3000mg/day',
        'lutemax-2020': '12-27mg/day',
        'oat-straw': '430-1600mg/day',
        zynamite: '140-300mg/day',
        dynamine: '100-150mg/day',
        'longvida-curcumin': '400mg/day (Longvida)',
      },
    },
    discontinued: { heading: 'Discontinued', successorLink: 'Read our review of the successor' },
    healthDisclaimerHeading: 'Health disclaimer',
    chipGroupLabel: 'Product attributes',
  },
  noPurchaseLink: NO_PURCHASE_LINK_STRINGS.en,
  guide: {
    sources: 'Sources',
    expand: 'expand',
    evidenceReviewed: 'Evidence reviewed:',
  },
};

const es: UIStrings = {
  nav: {
    bestNootropics: 'Los Mejores',
    compare: 'Comparar',
    ingredients: 'Ingredientes',
    guides: 'Guías',
    methodology: 'Metodología',
    about: 'Acerca de',
    topPicks: 'Mejores Opciones',
    search: 'Buscar',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    primaryLandmark: 'Navegación principal',
    openComparator: 'Abrir comparador →',
    skipToContent: 'Saltar al contenido principal',
  },
  footer: {
    tagline:
      'Comparamos las dosis de la etiqueta de cada nootrópico con las dosis de referencia de nuestras páginas de ingredientes, cuando existen. Las comisiones de afiliados se divulgan en línea y no afectan las puntuaciones.',
    copyrightLine:
      '© {year} Nootropic Lab · La información no es asesoramiento médico. Consulte a un médico antes de comenzar cualquier suplemento.',
    lastAuditLabel: 'Última auditoría completa:',
    methodologyLabel: 'Metodología',
    bestByGoal: {
      heading: 'Mejores por objetivo',
      focus: 'Para concentración',
      memory: 'Para memoria',
      adhd: 'Para TDAH',
      aging: 'Para envejecimiento',
      energy: 'Para energía',
      mood: 'Para estado de ánimo',
      studying: 'Para estudio',
    },
    headToHead: {
      heading: 'Frente a frente',
      allComparisons: 'Todas las comparaciones →',
    },
    byRegion: {
      heading: 'Por región',
      us: 'Estados Unidos',
      eu: 'Unión Europea',
      ca: 'Canadá',
      au: 'Australia',
      jp: 'Japón',
      latam: 'América Latina',
      gcc: 'Golfo (CCG)',
      sea: 'Sudeste Asiático',
    },
    about: {
      heading: 'Acerca de',
      methodology: 'Metodología',
      disclosures: 'Divulgaciones',
      privacy: 'Privacidad',
      cookies: 'Cookies',
      imprint: 'Aviso legal',
      contact: 'Contacto',
    },
  },
  cookie: {
    message: 'Usamos cookies de análisis para mejorar su experiencia. No usamos cookies publicitarias.',
    gdprNote: 'GDPR: Los análisis solo se activan después de aceptar. Las cookies necesarias siempre están activas.',
    accept: 'Aceptar Análisis',
    decline: 'Rechazar',
    privacyPolicy: 'política de privacidad',
    settings: 'Configuración de cookies',
  },
  disclosure: {
    text: 'Divulgación de afiliados: Esta página contiene enlaces de afiliados. Si compra a través de nuestros enlaces, podemos ganar una comisión sin costo adicional para usted. Nuestras opiniones editoriales son independientes — solo recomendamos productos que hemos investigado de forma independiente.',
    methodology: 'Lea nuestra metodología',
    badge: 'Divulgación de afiliados',
    inline: 'Ganamos una comisión si compra a través de los enlaces de esta página, sin costo adicional para usted.',
    noCommission: 'No ganamos ninguna comisión por este producto; no tenemos un acuerdo de afiliados para él.',
    ranking: 'Nuestras puntuaciones y clasificaciones siguen nuestra metodología publicada; las comisiones no influyen en ellas.',
  },
  table: {
    product: 'Producto',
    bestFor: 'Mejor para',
    score: 'Puntuación',
    price: 'Precio',
    caffeineFree: 'Sin Cafeína',
    euStatus: 'Estado UE',
    moneyBack: 'Devolución',
    trustpilot: 'Trustpilot',
    checkPrice: 'Ver Precio →',
    noResults: 'Ningún producto coincide con sus filtros. Intente eliminar uno.',
    yes: 'Sí',
    no: 'No',
    na: 'N/A',
    sortBy: 'Ordenar por',
    ascending: 'ascendente',
    descending: 'descendente',
  },
  breadcrumb: {
    home: 'Inicio',
    ingredients: 'Ingredientes',
    backToBestNootropics: '← Volver a Los Mejores Nootrópicos',
    backToIngredientsGuide: '← Volver a la Guía de Ingredientes',
    ariaLabel: 'Ruta de navegación',
  },
  search: {
    pages: {
      bestNootropics: 'Los Mejores Nootrópicos',
      compareAll: 'Comparar Todos',
      methodology: 'Metodología',
    },
    descriptions: {
      bestNootropics: 'Comparación completa de las marcas principales',
      compareAll: 'Herramienta de comparación interactiva',
      methodology: 'Cómo puntuamos los suplementos',
    },
    liveRegion: {
      oneResult: '1 resultado',
      manyResults: '{n} resultados',
      noResults: 'Sin resultados para {query}',
    },
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Dosis clínica', onset: 'Inicio de acción' },
    sections: {
      mechanism: 'Mecanismo de acción',
      evidence: 'Resumen de evidencia clínica',
      effects: 'Matriz de efectos en humanos',
      benefits: 'Beneficios documentados',
      sideEffects: 'Efectos secundarios y precauciones',
      howTo: 'Cómo tomarlo',
      stacking: 'Recomendaciones de combinación',
      faq: 'Preguntas frecuentes',
      related: 'Ingredientes relacionados',
    },
    toc: {
      mechanism: 'Mecanismo',
      evidence: 'Evidencia clínica',
      effects: 'Matriz de efectos',
      benefits: 'Beneficios y efectos secundarios',
      howTo: 'Cómo tomarlo',
      stacking: 'Combinación',
      faq: 'Preguntas frecuentes',
      products: 'Productos que lo contienen',
      related: 'Ingredientes relacionados',
    },
    table: {
      effect: 'Efecto',
      evidence: 'Evidencia',
      magnitude: 'Magnitud',
      studies: 'Estudios',
      notes: 'Notas',
    },
    magnitude: { large: 'Grande', moderate: 'Moderado', small: 'Pequeño', negligible: 'Insignificante' },
    category: {
      adaptogen: 'Adaptógeno',
      cholinergic: 'Colinérgico',
      mushroom: 'Hongo',
      amino: 'Aminoácido',
      herb: 'Hierba',
      vitamin: 'Vitamina',
    },
    sidebar: {
      quickFacts: 'Datos rápidos',
      onThisPage: 'En esta página',
      category: 'Categoría',
      dose: 'Dosis',
      onset: 'Inicio',
      trials: 'Ensayos',
    },
    stackingLede: 'Ingredientes que se combinan bien con {name} y por qué.',
  },
  ingredientEvidence: {
    sources: 'Fuentes',
    evidenceReviewed: 'Evidencia revisada el',
  },
  productDetail: {
    chips: {
      editorPick: 'Elección editorial',
      caffeineFree: 'Sin cafeína',
      hasCaffeine: 'Con cafeína',
      allClinicalDoses: 'Todas las dosis clínicas',
      npnLicensed: 'NPN de Health Canada',
      personalImport: 'Importación personal',
      ffcNotified: 'Notificado al FFC',
      austListed: 'AUST L',
      halalCertified: 'Certificado halal',
    },
    meta: {
      by: 'Por',
      productDescriptorByForm: { capsule: 'cápsula nootrópica diaria', tablet: 'comprimido nootrópico diario', sachet: 'sobre nootrópico diario', shot: 'shot nootrópico diario', powder: 'polvo nootrópico para beber', softgel: 'cápsula blanda nootrópica diaria' },
      updated: 'Actualizado:',
      lastVerified: 'Última verificación:',
      reviewedBy: 'Revisado por el equipo editorial de The Nootropic Lab',
    },
    dateLocale: 'es-419',
    score: {
      label: 'Nuestra puntuación',
      outOf10: 'sobre 10,0',
    },
    stats: {
      price: 'Precio',
      monthUnit: 'mes',
      capsules: 'Cáps.',
      dailyServing: 'Dosis diaria',
      units: { capsule: 'cáps.', tablet: 'comprimidos', sachet: 'sobres', shot: 'shots', powder: 'cacitos', softgel: 'cápsulas blandas' },
      unitsSingular: { capsule: 'cáp.', tablet: 'comprimido', sachet: 'sobre', shot: 'shot', powder: 'cacito', softgel: 'cápsula blanda' },
      moneyBack: 'Garantía',
      days: 'días',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/D',
      ourCut: 'Nuestra comisión',
    },
    visitBrand: 'Visitar marca →',
    tabs: {
      overview: 'Resumen',
      dosing: 'Auditoría de dosis',
      pillars: 'Pilares',
      reviews: 'Opiniones',
      pricing: 'Precios',
      ariaLabel: 'Secciones del producto',
    },
    alternatives: 'Alternativas similares',
    pricing: {
      vendorTermsHeading: 'Lo que dice el sitio del vendedor',
      vendorTermsLede: 'Citado palabra por palabra de las páginas del propio vendedor. Las condiciones cambian: revíselas antes de comprar.',
      shipping: 'Envío',
      cancellation: 'Cancelar una suscripción',
      oneTimePrice: 'Precio de compra única',
      moneyBackGuarantee: 'Garantía de devolución del dinero',
      returns: 'Devoluciones',
      attribution: 'Según {domain}, consultado el {date}',
      opensInNewTab: '(se abre en una pestaña nueva)',
      noVendorTerms: 'No pudimos verificar las condiciones de este vendedor. Consulte el sitio del vendedor para ver las condiciones vigentes.',
      visitVendor: 'Visitar {brand} →',
      affiliateCookie: 'Nuestra cookie de afiliado',
      cookieTerms: '{days} días · {rate} de comisión',
      noAffiliateCookie: 'Ninguna (sin acuerdo de afiliados)',
    },
    pillars: {
      labels: {
        ingredients: 'Calidad de los ingredientes',
        dosing: 'Dosis vs. evidencia clínica',
        transparency: 'Transparencia de la fórmula',
        value: 'Relación calidad-precio',
        trust: 'Confianza en la marca',
      },
      rationale: {
        ingredients: 'Cantidad y calidad de los ingredientes calificados según su evidencia. Los extractos de marca registrada y los activos estandarizados elevan esta puntuación.',
        dosing: 'La proporción de ingredientes con una dosis de referencia en nuestras páginas de ingredientes cuya cantidad diaria declarada en la etiqueta alcanza el mínimo de esa página. Las cantidades que la etiqueta oculta (partes de una mezcla) o declara sobre otra base cuentan como no alcanzadas; los ingredientes sin página de referencia se muestran, pero no se puntúan.',
        transparency: 'Divulgación completa de cada ingrediente con su dosis exacta. Las mezclas patentadas se puntúan como opacas.',
        value: 'Costo mensual en relación con las dosis clínicas que aporta cada porción. Los productos más baratos con dosis insuficientes obtienen una puntuación más baja.',
        trust: 'Reputación de la marca, pruebas de terceros, historial de reembolsos y señal de Trustpilot a lo largo de varios años.',
      },
      notScored: 'Sin puntuación.',
      howComputedHeading: 'Cómo se calcula la puntuación',
      howComputedBody: 'Cada pilar se pondera según su importancia editorial. Las ponderaciones son las mismas para todas las marcas que auditamos: no se ajustan para favorecer a ningún producto en particular.',
      readMethodology: 'Leer la metodología →',
      pillarScoreAria: '{product}: puntuación del pilar {pillar}',
    },
    dosing: {
      heading: 'Auditoría de dosis',
      subtitle: 'Cantidad diaria declarada en la etiqueta frente al mínimo de nuestras páginas de ingredientes; los ingredientes sin dosis de referencia se muestran, pero no se puntúan',
      adequateCount: '{adequate} / {total} con dosis adecuada',
      unavailable: 'No hay datos de dosificación disponibles para este producto. Muchos ingredientes están ocultos dentro de mezclas patentadas.',
      columns: { ingredient: 'Ingrediente', label: 'Etiqueta', clinical: 'Dosis clínica', status: 'Estado' },
      verdict: { pass: '✓ Cumple', under: '✕ Insuficiente', unverified: '? Sin verificar', notScored: 'Sin puntuación' },
      noReferenceDose: 'Sin dosis de referencia registrada',
      anchorDose: {
        'lions-mane': '1000-1800mg/día',
        'bacopa-monnieri': '300-450mg/día (≥50% de bacósidos)',
        citicoline: '250-500mg/día',
        'l-theanine': '100-200mg/día',
        'rhodiola-rosea': '200-600mg/día',
        phosphatidylserine: '100-300mg/día',
        'alpha-gpc': '300-600mg/día',
        ashwagandha: '300-600mg/día (KSM-66)',
        'huperzine-a': '100-200mcg/día',
        'l-tyrosine': '2000mg/día (el ensayo positivo con la dosis más baja)',
        caffeine: '100-200mg',
        'ginkgo-biloba': '240mg/día (extracto 24/6)',
        'dha-omega-3': '900mg-1,2g de DHA/día',
        'maritime-pine-bark': '100-200mg/día',
        'acetyl-l-carnitine': '1500-3000mg/día',
        'lutemax-2020': '12-27mg/día',
        'oat-straw': '430-1600mg/día',
        zynamite: '140-300mg/día',
        dynamine: '100-150mg/día',
        'longvida-curcumin': '400mg/día (Longvida)',
      },
    },
    discontinued: { heading: 'Descontinuado', successorLink: 'Lee nuestra reseña del sucesor' },
    healthDisclaimerHeading: 'Aviso de salud',
    chipGroupLabel: 'Atributos del producto',
  },
  noPurchaseLink: NO_PURCHASE_LINK_STRINGS.es,
  guide: {
    sources: 'Fuentes',
    expand: 'ampliar',
    evidenceReviewed: 'Evidencia revisada el',
  },
};

const fr: UIStrings = {
  nav: {
    bestNootropics: 'Les Meilleurs',
    compare: 'Comparer',
    ingredients: 'Ingrédients',
    guides: 'Guides',
    methodology: 'Méthodologie',
    about: 'À propos',
    topPicks: 'Nos Choix',
    search: 'Rechercher',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    primaryLandmark: 'Navigation principale',
    openComparator: 'Ouvrir le comparateur →',
    skipToContent: 'Aller au contenu principal',
  },
  footer: {
    tagline:
      "Nous comparons les doses indiquées sur l'étiquette de chaque nootropique aux doses de référence de nos pages d'ingrédients, lorsqu'elles existent. Les commissions d'affiliation sont divulguées en ligne et n'influencent pas les notes.",
    copyrightLine:
      "© {year} Nootropic Lab · Les informations ne constituent pas un avis médical. Consultez un clinicien avant de commencer tout supplément.",
    lastAuditLabel: 'Dernier audit complet :',
    methodologyLabel: 'Méthodologie',
    bestByGoal: {
      heading: 'Meilleurs par objectif',
      focus: 'Pour la concentration',
      memory: 'Pour la mémoire',
      adhd: 'Pour le TDAH',
      aging: 'Pour le vieillissement',
      energy: "Pour l'énergie",
      mood: "Pour l'humeur",
      studying: "Pour l'étude",
    },
    headToHead: {
      heading: 'Face-à-face',
      allComparisons: 'Toutes les comparaisons →',
    },
    byRegion: {
      heading: 'Par région',
      us: 'États-Unis',
      eu: 'Union européenne',
      ca: 'Canada',
      au: 'Australie',
      jp: 'Japon',
      latam: 'Amérique latine',
      gcc: 'Golfe (CCG)',
      sea: 'Asie du Sud-Est',
    },
    about: {
      heading: 'À propos',
      methodology: 'Méthodologie',
      disclosures: 'Divulgations',
      privacy: 'Confidentialité',
      cookies: 'Cookies',
      imprint: 'Mentions légales',
      contact: 'Contact',
    },
  },
  cookie: {
    message: 'Nous utilisons des cookies analytiques pour améliorer votre expérience. Nous n\'utilisons pas de cookies publicitaires.',
    gdprNote: 'RGPD : Les analyses ne se déclenchent qu\'après votre acceptation. Les cookies nécessaires sont toujours actifs.',
    accept: 'Accepter',
    decline: 'Refuser',
    privacyPolicy: 'politique de confidentialité',
    settings: 'Paramètres des cookies',
  },
  disclosure: {
    text: 'Divulgation d\'affiliation : Cette page contient des liens affiliés. Si vous achetez via nos liens, nous pouvons gagner une commission sans frais supplémentaires. Nos opinions éditoriales sont indépendantes.',
    methodology: 'Lire notre méthodologie',
    badge: "Divulgation d'affiliation",
    inline: 'Nous touchons une commission si vous achetez via les liens de cette page, sans frais supplémentaires pour vous.',
    noCommission: 'Nous ne touchons aucune commission sur ce produit : nous n’avons aucun accord d’affiliation le concernant.',
    ranking: "Nos notes et classements suivent notre méthodologie publiée ; les commissions ne les influencent pas.",
  },
  table: {
    product: 'Produit',
    bestFor: 'Idéal pour',
    score: 'Note',
    price: 'Prix',
    caffeineFree: 'Sans Caféine',
    euStatus: 'Statut UE',
    moneyBack: 'Remboursement',
    trustpilot: 'Trustpilot',
    checkPrice: 'Voir le Prix →',
    noResults: 'Aucun produit ne correspond à vos filtres. Essayez d\'en supprimer un.',
    yes: 'Oui',
    no: 'Non',
    na: 'N/A',
    sortBy: 'Trier par',
    ascending: 'croissant',
    descending: 'décroissant',
  },
  breadcrumb: {
    home: 'Accueil',
    ingredients: 'Ingrédients',
    backToBestNootropics: '← Retour aux Meilleurs Nootropiques',
    backToIngredientsGuide: '← Retour au Guide des Ingrédients',
    ariaLabel: "Fil d'Ariane",
  },
  search: {
    pages: {
      bestNootropics: 'Meilleurs Nootropiques',
      compareAll: 'Comparer Tout',
      methodology: 'Méthodologie',
    },
    descriptions: {
      bestNootropics: 'Comparaison complète des principales marques',
      compareAll: 'Outil de comparaison interactif',
      methodology: 'Comment nous évaluons les suppléments',
    },
    liveRegion: {
      oneResult: '1 résultat',
      manyResults: '{n} résultats',
      noResults: 'Aucun résultat pour {query}',
    },
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Dose clinique', onset: 'Délai d\'action' },
    sections: {
      mechanism: 'Mécanisme d\'action',
      evidence: 'Résumé des preuves cliniques',
      effects: 'Matrice des effets humains',
      benefits: 'Bénéfices documentés',
      sideEffects: 'Effets indésirables et précautions',
      howTo: 'Comment le prendre',
      stacking: 'Recommandations de combinaison',
      faq: 'Questions fréquentes',
      related: 'Ingrédients connexes',
    },
    toc: {
      mechanism: 'Mécanisme',
      evidence: 'Preuves cliniques',
      effects: 'Matrice des effets',
      benefits: 'Bénéfices et effets indésirables',
      howTo: 'Comment le prendre',
      stacking: 'Combinaison',
      faq: 'FAQ',
      products: 'Produits qui en contiennent',
      related: 'Ingrédients connexes',
    },
    table: {
      effect: 'Effet',
      evidence: 'Preuves',
      magnitude: 'Ampleur',
      studies: 'Études',
      notes: 'Notes',
    },
    magnitude: { large: 'Grand', moderate: 'Modéré', small: 'Petit', negligible: 'Négligeable' },
    category: {
      adaptogen: 'Adaptogène',
      cholinergic: 'Cholinergique',
      mushroom: 'Champignon',
      amino: 'Acide aminé',
      herb: 'Plante',
      vitamin: 'Vitamine',
    },
    sidebar: {
      quickFacts: 'Faits clés',
      onThisPage: 'Sur cette page',
      category: 'Catégorie',
      dose: 'Dose',
      onset: 'Délai',
      trials: 'Essais',
    },
    stackingLede: 'Ingrédients qui se combinent bien avec {name} et pourquoi.',
  },
  ingredientEvidence: {
    sources: 'Sources',
    evidenceReviewed: 'Données probantes vérifiées le',
  },
  productDetail: {
    chips: {
      editorPick: 'Choix de la rédaction',
      caffeineFree: 'Sans caféine',
      hasCaffeine: 'Contient de la caféine',
      allClinicalDoses: 'Toutes les doses cliniques',
      npnLicensed: 'NPN Santé Canada',
      personalImport: 'Importation personnelle',
      ffcNotified: 'Notifié FFC',
      austListed: 'AUST L',
      halalCertified: 'Certifié halal',
    },
    meta: {
      by: 'Par',
      productDescriptorByForm: { capsule: 'capsule nootropique quotidienne', tablet: 'comprimé nootropique quotidien', sachet: 'sachet nootropique quotidien', shot: 'shot nootropique quotidien', powder: 'poudre nootropique à diluer', softgel: 'capsule molle nootropique quotidienne' },
      updated: 'Mis à jour :',
      lastVerified: 'Dernière vérification :',
      reviewedBy: "Évalué par l'équipe éditoriale de The Nootropic Lab",
    },
    dateLocale: 'fr-FR',
    score: {
      label: 'Notre note',
      outOf10: 'sur 10,0',
    },
    stats: {
      price: 'Prix',
      monthUnit: 'mois',
      capsules: 'Caps.',
      dailyServing: 'Dose quotidienne',
      units: { capsule: 'gélules', tablet: 'comprimés', sachet: 'sachets', shot: 'shots', powder: 'doses', softgel: 'capsules molles' },
      unitsSingular: { capsule: 'gélule', tablet: 'comprimé', sachet: 'sachet', shot: 'shot', powder: 'dose', softgel: 'capsule molle' },
      moneyBack: 'Garantie',
      days: 'jours',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/D',
      ourCut: 'Notre commission',
    },
    visitBrand: 'Visiter la marque →',
    tabs: {
      overview: 'Aperçu',
      dosing: 'Audit du dosage',
      pillars: 'Piliers',
      reviews: 'Avis',
      pricing: 'Tarification',
      ariaLabel: 'Sections du produit',
    },
    alternatives: 'Alternatives similaires',
    pricing: {
      vendorTermsHeading: 'Ce qu’indique le site du vendeur',
      vendorTermsLede: 'Cité mot pour mot depuis les pages du vendeur. Les conditions changent : vérifiez-les avant d’acheter.',
      shipping: 'Livraison',
      cancellation: 'Résilier un abonnement',
      oneTimePrice: 'Prix en achat unique',
      moneyBackGuarantee: 'Garantie satisfait ou remboursé',
      returns: 'Retours',
      attribution: 'Selon {domain}, vérifié le {date}',
      opensInNewTab: '(s’ouvre dans un nouvel onglet)',
      noVendorTerms: 'Nous n’avons pas pu vérifier les conditions de ce vendeur. Consultez le site du vendeur pour connaître les conditions en vigueur.',
      visitVendor: 'Visiter {brand} →',
      affiliateCookie: 'Notre cookie d’affiliation',
      cookieTerms: '{days} jours · commission de {rate}',
      noAffiliateCookie: 'Aucun (pas d’accord d’affiliation)',
    },
    pillars: {
      labels: {
        ingredients: 'Qualité des ingrédients',
        dosing: 'Dosage face aux preuves cliniques',
        transparency: 'Transparence de la formule',
        value: 'Rapport qualité-prix',
        trust: 'Confiance dans la marque',
      },
      rationale: {
        ingredients: 'Nombre et qualité des ingrédients évalués selon leur niveau de preuve. Les extraits de marque déposée et les actifs standardisés font monter cette note.',
        dosing: 'La part des ingrédients ayant une dose de référence sur nos pages d’ingrédients dont la quantité quotidienne indiquée sur l’étiquette atteint le minimum de cette page. Les quantités que l’étiquette masque (parts d’un mélange) ou indique sur une autre base comptent comme non atteintes ; les ingrédients sans page de référence sont listés mais pas notés.',
        transparency: 'Divulgation complète de chaque ingrédient à sa dose exacte. Les mélanges exclusifs sont notés comme opaques.',
        value: 'Coût mensuel rapporté aux doses cliniques apportées par portion. Les produits moins chers mais sous-dosés obtiennent une note plus basse.',
        trust: 'Réputation de la marque, tests par des tiers, historique des remboursements et signal Trustpilot sur plusieurs années.',
      },
      notScored: 'Non noté.',
      howComputedHeading: 'Comment la note est calculée',
      howComputedBody: 'Chaque pilier est pondéré selon son importance éditoriale. Les pondérations sont identiques pour toutes les marques que nous auditons : elles ne sont pas ajustées pour favoriser un produit en particulier.',
      readMethodology: 'Lire la méthodologie →',
      pillarScoreAria: '{product} : note du pilier {pillar}',
    },
    dosing: {
      heading: 'Audit du dosage',
      subtitle: 'Quantité quotidienne indiquée sur l’étiquette comparée au minimum de nos pages d’ingrédients ; les ingrédients sans dose de référence sont listés mais pas notés',
      adequateCount: '{adequate} / {total} correctement dosés',
      unavailable: 'Données de dosage indisponibles pour ce produit. De nombreux ingrédients sont cachés dans des mélanges exclusifs.',
      columns: { ingredient: 'Ingrédient', label: 'Étiquette', clinical: 'Dose clinique', status: 'Statut' },
      verdict: { pass: '✓ Conforme', under: '✕ Sous-dosé', unverified: '? Non vérifié', notScored: 'Non noté' },
      noReferenceDose: 'Aucune dose de référence enregistrée',
      anchorDose: {
        'lions-mane': '1000-1800mg/jour',
        'bacopa-monnieri': '300-450mg/jour (≥50% de bacosides)',
        citicoline: '250-500mg/jour',
        'l-theanine': '100-200mg/jour',
        'rhodiola-rosea': '200-600mg/jour',
        phosphatidylserine: '100-300mg/jour',
        'alpha-gpc': '300-600mg/jour',
        ashwagandha: '300-600mg/jour (KSM-66)',
        'huperzine-a': '100-200mcg/jour',
        'l-tyrosine': '2000mg/jour (essai positif à la dose la plus faible)',
        caffeine: '100-200mg',
        'ginkgo-biloba': '240mg/jour (extrait 24/6)',
        'dha-omega-3': '900mg-1,2g de DHA/jour',
        'maritime-pine-bark': '100-200mg/jour',
        'acetyl-l-carnitine': '1500-3000mg/jour',
        'lutemax-2020': '12-27mg/jour',
        'oat-straw': '430-1600mg/jour',
        zynamite: '140-300mg/jour',
        dynamine: '100-150mg/jour',
        'longvida-curcumin': '400mg/jour (Longvida)',
      },
    },
    discontinued: { heading: 'Produit arrêté', successorLink: 'Lire notre avis sur le successeur' },
    healthDisclaimerHeading: 'Avis de santé',
    chipGroupLabel: 'Attributs du produit',
  },
  noPurchaseLink: NO_PURCHASE_LINK_STRINGS.fr,
  guide: {
    sources: 'Sources',
    expand: 'afficher',
    evidenceReviewed: 'Données probantes vérifiées le',
  },
};

const ja: UIStrings = {
  nav: {
    bestNootropics: 'ベスト',
    compare: '比較',
    ingredients: '成分',
    guides: 'ガイド',
    methodology: '評価方法',
    about: '運営者情報',
    topPicks: 'おすすめ',
    search: '検索',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
    primaryLandmark: 'メインナビゲーション',
    openComparator: '比較ツールを開く →',
    skipToContent: 'メインコンテンツへスキップ',
  },
  footer: {
    tagline:
      '各ノートロピクスのラベル記載用量を、当サイトの成分ページの基準用量（ある場合）と照合しています。アフィリエイト報酬はインラインで開示され、評価には影響しません。',
    copyrightLine:
      '© {year} Nootropic Lab · 情報は医学的助言ではありません。サプリメントを開始する前に医師に相談してください。',
    lastAuditLabel: '最終全面監査:',
    methodologyLabel: '評価方法',
    bestByGoal: {
      heading: '目的別ベスト',
      focus: '集中力向上',
      memory: '記憶力向上',
      adhd: 'ADHD対策',
      aging: 'エイジングケア',
      energy: 'エネルギー向上',
      mood: '気分改善',
      studying: '学習サポート',
    },
    headToHead: {
      heading: '直接比較',
      allComparisons: 'すべての比較 →',
    },
    byRegion: {
      heading: '地域別',
      us: 'アメリカ',
      eu: '欧州連合',
      ca: 'カナダ',
      au: 'オーストラリア',
      jp: '日本',
      latam: 'ラテンアメリカ',
      gcc: '湾岸諸国（GCC）',
      sea: '東南アジア',
    },
    about: {
      heading: '運営者情報',
      methodology: '評価方法',
      disclosures: '開示事項',
      privacy: 'プライバシー',
      cookies: 'Cookie',
      imprint: '特定商取引法に基づく表記',
      contact: 'お問い合わせ',
    },
  },
  cookie: {
    message: '体験向上のために分析Cookieを使用しています。広告Cookieは使用していません。',
    gdprNote: 'GDPR：分析は同意後にのみ有効になります。必要なCookieは常にアクティブです。',
    accept: '分析を許可',
    decline: '拒否',
    privacyPolicy: 'プライバシーポリシー',
    settings: 'Cookie設定',
  },
  disclosure: {
    text: 'アフィリエイト広告を含みます：このページにはアフィリエイトリンクが含まれています。当社のリンクを通じて購入された場合、追加費用なしでコミッションを受け取る場合があります。編集意見は独立しており、独自に調査した製品のみを推奨しています。',
    methodology: '評価方法を読む',
    badge: '広告（アフィリエイト）',
    inline: '本ページのリンクから商品を購入されると、当サイトは紹介料を受け取ります（お客様の追加負担はありません）。',
    noCommission: '当サイトはこの商品についてアフィリエイト契約を結んでおらず、紹介料を受け取っていません。',
    ranking: 'スコアと順位は公開している評価方法に基づいて決定しており、紹介料の影響は受けません。',
  },
  table: {
    product: '製品',
    bestFor: '最適な用途',
    score: 'スコア',
    price: '価格',
    caffeineFree: 'カフェインフリー',
    euStatus: 'EU状態',
    moneyBack: '返金保証',
    trustpilot: 'Trustpilot',
    checkPrice: '価格を確認 →',
    noResults: 'フィルターに一致する製品がありません。フィルターを1つ削除してみてください。',
    yes: 'はい',
    no: 'いいえ',
    na: 'N/A',
    sortBy: '並べ替え',
    ascending: '昇順',
    descending: '降順',
  },
  breadcrumb: {
    home: 'ホーム',
    ingredients: '成分',
    backToBestNootropics: '← ベストノートロピクスに戻る',
    backToIngredientsGuide: '← 成分ガイドに戻る',
    ariaLabel: 'パンくずリスト',
  },
  search: {
    pages: {
      bestNootropics: 'ベストノートロピクス',
      compareAll: 'すべて比較',
      methodology: '評価方法',
    },
    descriptions: {
      bestNootropics: 'トップブランドの完全比較',
      compareAll: 'インタラクティブな比較ツール',
      methodology: 'サプリメントの評価方法',
    },
    liveRegion: {
      oneResult: '1件の結果',
      manyResults: '{n}件の結果',
      noResults: '{query}に一致する結果はありません',
    },
  },
  ingredientDetail: {
    chips: { clinicalDose: '臨床用量', onset: '効果発現時間' },
    sections: {
      mechanism: '作用機序',
      evidence: '臨床エビデンスの概要',
      effects: 'ヒト効果マトリクス',
      benefits: '実証された効果',
      sideEffects: '副作用と注意事項',
      howTo: '摂取方法',
      stacking: 'スタッキングの推奨',
      faq: 'よくある質問',
      related: '関連成分',
    },
    toc: {
      mechanism: '作用機序',
      evidence: '臨床エビデンス',
      effects: '効果マトリクス',
      benefits: '効果と副作用',
      howTo: '摂取方法',
      stacking: 'スタッキング',
      faq: 'FAQ',
      products: '含有製品',
      related: '関連成分',
    },
    table: {
      effect: '効果',
      evidence: 'エビデンス',
      magnitude: '効果の大きさ',
      studies: '研究数',
      notes: '備考',
    },
    magnitude: { large: '大', moderate: '中', small: '小', negligible: 'ごくわずか' },
    category: {
      adaptogen: 'アダプトゲン',
      cholinergic: 'コリン作動性',
      mushroom: 'きのこ類',
      amino: 'アミノ酸',
      herb: 'ハーブ',
      vitamin: 'ビタミン',
    },
    sidebar: {
      quickFacts: '基本情報',
      onThisPage: '目次',
      category: 'カテゴリ',
      dose: '用量',
      onset: '効果発現',
      trials: '試験数',
    },
    stackingLede: '{name}と相性の良い成分とその理由。',
  },
  ingredientEvidence: {
    sources: '出典',
    evidenceReviewed: 'エビデンス確認日:',
  },
  productDetail: {
    chips: {
      editorPick: '編集部のおすすめ',
      caffeineFree: 'カフェインフリー',
      hasCaffeine: 'カフェイン含有',
      allClinicalDoses: '全成分が臨床用量',
      npnLicensed: 'カナダ保健省 NPN',
      personalImport: '個人輸入',
      ffcNotified: '機能性表示食品',
      austListed: 'AUST L',
      halalCertified: 'ハラール認証',
    },
    meta: {
      by: '販売：',
      productDescriptorByForm: { capsule: '毎日のノートロピクスカプセル', tablet: '毎日のノートロピクス錠剤', sachet: '毎日のノートロピクス分包', shot: '毎日のノートロピクスショット', powder: 'ノートロピクスパウダー', softgel: '毎日のノートロピクスソフトジェル' },
      updated: '更新日：',
      lastVerified: '最終確認日：',
      reviewedBy: 'The Nootropic Lab 編集部による評価',
    },
    dateLocale: 'ja-JP',
    score: {
      label: '当社の評価',
      outOf10: '10.0点満点',
    },
    stats: {
      price: '価格',
      monthUnit: '月',
      capsules: 'カプセル',
      dailyServing: '1日の目安量',
      units: { capsule: 'カプセル', tablet: '錠', sachet: '包', shot: '本', powder: 'スクープ', softgel: 'ソフトジェル' },
      unitsSingular: { capsule: 'カプセル', tablet: '錠', sachet: '包', shot: '本', powder: 'スクープ', softgel: 'ソフトジェル' },
      moneyBack: '返金保証',
      days: '日間',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/A',
      ourCut: '当社の手数料',
    },
    visitBrand: 'ブランドサイトへ →',
    tabs: {
      overview: '概要',
      dosing: '用量チェック',
      pillars: '柱',
      reviews: 'レビュー',
      pricing: '価格',
      ariaLabel: '製品セクション',
    },
    alternatives: '類似の代替品',
    pricing: {
      vendorTermsHeading: '販売元サイトの記載',
      vendorTermsLede: '販売元の公式ページから原文のまま引用しています。条件は変わることがあるため、購入前にご確認ください。',
      shipping: '配送',
      cancellation: '定期購入の解約',
      oneTimePrice: '単品購入の価格',
      moneyBackGuarantee: '返金保証',
      returns: '返品',
      attribution: '出典：{domain}（{date}確認）',
      opensInNewTab: '（新しいタブで開きます）',
      noVendorTerms: 'この販売元の条件は確認できませんでした。最新の条件は販売元のサイトでご確認ください。',
      visitVendor: '{brand}のサイトへ →',
      affiliateCookie: '当サイトのアフィリエイトCookie',
      cookieTerms: '有効期間{days}日 · 紹介料{rate}',
      noAffiliateCookie: 'なし（アフィリエイト契約なし）',
    },
    pillars: {
      labels: {
        ingredients: '成分の品質',
        dosing: '臨床エビデンスに対する用量',
        transparency: '処方の透明性',
        value: 'コストパフォーマンス',
        trust: 'ブランドの信頼性',
      },
      rationale: {
        ingredients: 'エビデンスの強さで評価した成分の数と質。商標登録された抽出物や規格化された有効成分があるとスコアが上がります。',
        dosing: '当サイトの成分ページに基準用量がある成分のうち、ラベルに記載された1日量がそのページの最低量を満たす成分の割合です。ラベルが量を伏せている場合（ブレンド内の配合量）や別の基準で記載している場合は、満たしていないものとみなします。基準ページのない成分は一覧に表示しますが、採点の対象外です。',
        transparency: 'すべての成分を正確な用量とともに開示しているか。独自ブレンドは不透明なものとして採点します。',
        value: '1回分あたりに含まれる臨床用量に対する月額費用。安価でも用量が不足している製品はスコアが低くなります。',
        trust: 'ブランドの評判、第三者機関による試験、返金対応の実績、そして複数年にわたるTrustpilotでの評価。',
      },
      notScored: '採点対象外。',
      howComputedHeading: 'スコアの算出方法',
      howComputedBody: '各柱は編集上の重要度に応じて重み付けしています。重みは当サイトが評価するすべてのブランドで共通で、特定の製品に有利になるよう調整することはありません。',
      readMethodology: '評価方法を読む →',
      pillarScoreAria: '{product}：{pillar}のスコア',
    },
    dosing: {
      heading: '用量チェック',
      subtitle: 'ラベルに記載された1日量と、当サイトの成分ページに示す最低量との比較。基準用量のない成分は一覧に表示しますが、採点の対象外です',
      adequateCount: '十分な用量：{adequate} / {total}',
      unavailable: 'この製品の用量データはありません。多くの成分が独自ブレンドの中に隠れています。',
      columns: { ingredient: '成分', label: 'ラベル表示', clinical: '臨床用量', status: '判定' },
      verdict: { pass: '✓ 適合', under: '✕ 不足', unverified: '? 未確認', notScored: '採点対象外' },
      noReferenceDose: '基準用量の登録なし',
      anchorDose: {
        'lions-mane': '1000〜1800mg/日',
        'bacopa-monnieri': '300〜450mg/日（バコシド50%以上）',
        citicoline: '250〜500mg/日',
        'l-theanine': '100〜200mg/日',
        'rhodiola-rosea': '200〜600mg/日',
        phosphatidylserine: '100〜300mg/日',
        'alpha-gpc': '300〜600mg/日',
        ashwagandha: '300〜600mg/日（KSM-66）',
        'huperzine-a': '100〜200mcg/日',
        'l-tyrosine': '2000mg/日（効果が示された試験のうち最低の用量）',
        caffeine: '100〜200mg',
        'ginkgo-biloba': '240mg/日（24/6エキス）',
        'dha-omega-3': 'DHA 900mg〜1.2g/日',
        'maritime-pine-bark': '100〜200mg/日',
        'acetyl-l-carnitine': '1500〜3000mg/日',
        'lutemax-2020': '12〜27mg/日',
        'oat-straw': '430〜1600mg/日',
        zynamite: '140〜300mg/日',
        dynamine: '100〜150mg/日',
        'longvida-curcumin': '400mg/日（Longvida）',
      },
    },
    discontinued: { heading: '販売終了', successorLink: '後継製品のレビューを読む' },
    healthDisclaimerHeading: '健康に関する免責事項',
    chipGroupLabel: '製品の属性',
  },
  noPurchaseLink: NO_PURCHASE_LINK_STRINGS.ja,
  guide: {
    sources: '出典',
    expand: '展開',
    evidenceReviewed: 'エビデンス確認日：',
  },
};

const pt: UIStrings = {
  nav: {
    bestNootropics: 'Os Melhores',
    compare: 'Comparar',
    ingredients: 'Ingredientes',
    guides: 'Guias',
    methodology: 'Metodologia',
    about: 'Sobre',
    topPicks: 'Melhores Escolhas',
    search: 'Pesquisar',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    primaryLandmark: 'Navegação principal',
    openComparator: 'Abrir comparador →',
    skipToContent: 'Ir para o conteúdo principal',
  },
  footer: {
    tagline:
      'Comparamos as doses do rótulo de cada nootrópico com as doses de referência das nossas páginas de ingredientes, quando existem. As comissões de afiliados são divulgadas em linha e não influenciam as pontuações.',
    copyrightLine:
      '© {year} Nootropic Lab · As informações não são aconselhamento médico. Consulte um clínico antes de iniciar qualquer suplemento.',
    lastAuditLabel: 'Última auditoria completa:',
    methodologyLabel: 'Metodologia',
    bestByGoal: {
      heading: 'Melhores por objetivo',
      focus: 'Para foco',
      memory: 'Para memória',
      adhd: 'Para TDAH',
      aging: 'Para envelhecimento',
      energy: 'Para energia',
      mood: 'Para humor',
      studying: 'Para estudo',
    },
    headToHead: {
      heading: 'Frente a frente',
      allComparisons: 'Todas as comparações →',
    },
    byRegion: {
      heading: 'Por região',
      us: 'Estados Unidos',
      eu: 'União Europeia',
      ca: 'Canadá',
      au: 'Austrália',
      jp: 'Japão',
      latam: 'América Latina',
      gcc: 'Golfo (CCG)',
      sea: 'Sudeste Asiático',
    },
    about: {
      heading: 'Sobre',
      methodology: 'Metodologia',
      disclosures: 'Divulgações',
      privacy: 'Privacidade',
      cookies: 'Cookies',
      imprint: 'Aviso legal',
      contact: 'Contacto',
    },
  },
  cookie: {
    message: 'Utilizamos cookies de análise para melhorar a sua experiência. Não utilizamos cookies de publicidade.',
    gdprNote: 'RGPD: A análise só é ativada após a sua aceitação. Os cookies necessários estão sempre ativos.',
    accept: 'Aceitar',
    decline: 'Recusar',
    privacyPolicy: 'política de privacidade',
    settings: 'Preferências de cookies',
  },
  disclosure: {
    text: 'Divulgação de afiliação: Esta página contém links de afiliados. Se comprar através dos nossos links, podemos ganhar uma comissão sem custos adicionais. As nossas opiniões editoriais são independentes.',
    methodology: 'Ler a nossa metodologia',
    badge: 'Divulgação de afiliação',
    inline: 'Recebemos uma comissão se comprar através dos links desta página, sem custos adicionais para si.',
    noCommission: 'Não recebemos qualquer comissão por este produto; não temos nenhum acordo de afiliação para ele.',
    ranking: 'As nossas pontuações e classificações seguem a nossa metodologia publicada; as comissões não as influenciam.',
  },
  table: {
    product: 'Produto',
    bestFor: 'Melhor para',
    score: 'Pontuação',
    price: 'Preço',
    caffeineFree: 'Sem Cafeína',
    euStatus: 'Estado UE',
    moneyBack: 'Devolução',
    trustpilot: 'Trustpilot',
    checkPrice: 'Ver Preço →',
    noResults: 'Nenhum produto corresponde aos seus filtros. Tente remover um.',
    yes: 'Sim',
    no: 'Não',
    na: 'N/A',
    sortBy: 'Ordenar por',
    ascending: 'ascendente',
    descending: 'descendente',
  },
  breadcrumb: {
    home: 'Início',
    ingredients: 'Ingredientes',
    backToBestNootropics: '← Voltar aos Melhores Nootrópicos',
    backToIngredientsGuide: '← Voltar ao Guia de Ingredientes',
    ariaLabel: 'Caminho de navegação',
  },
  search: {
    pages: {
      bestNootropics: 'Melhores Nootrópicos',
      compareAll: 'Comparar Todos',
      methodology: 'Metodologia',
    },
    descriptions: {
      bestNootropics: 'Comparação completa das principais marcas',
      compareAll: 'Ferramenta de comparação interativa',
      methodology: 'Como avaliamos os suplementos',
    },
    liveRegion: {
      oneResult: '1 resultado',
      manyResults: '{n} resultados',
      noResults: 'Nenhum resultado para {query}',
    },
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Dose clínica', onset: 'Início de ação' },
    sections: {
      mechanism: 'Mecanismo de ação',
      evidence: 'Resumo de evidências clínicas',
      effects: 'Matriz de efeitos em humanos',
      benefits: 'Benefícios documentados',
      sideEffects: 'Efeitos colaterais e precauções',
      howTo: 'Como tomar',
      stacking: 'Recomendações de combinação',
      faq: 'Perguntas frequentes',
      related: 'Ingredientes relacionados',
    },
    toc: {
      mechanism: 'Mecanismo',
      evidence: 'Evidências clínicas',
      effects: 'Matriz de efeitos',
      benefits: 'Benefícios e efeitos colaterais',
      howTo: 'Como tomar',
      stacking: 'Combinação',
      faq: 'Perguntas frequentes',
      products: 'Produtos que contêm',
      related: 'Ingredientes relacionados',
    },
    table: {
      effect: 'Efeito',
      evidence: 'Evidência',
      magnitude: 'Magnitude',
      studies: 'Estudos',
      notes: 'Notas',
    },
    magnitude: { large: 'Grande', moderate: 'Moderado', small: 'Pequeno', negligible: 'Insignificante' },
    category: {
      adaptogen: 'Adaptógeno',
      cholinergic: 'Colinérgico',
      mushroom: 'Cogumelo',
      amino: 'Aminoácido',
      herb: 'Erva',
      vitamin: 'Vitamina',
    },
    sidebar: {
      quickFacts: 'Dados rápidos',
      onThisPage: 'Nesta página',
      category: 'Categoria',
      dose: 'Dose',
      onset: 'Início',
      trials: 'Ensaios',
    },
    stackingLede: 'Ingredientes que combinam bem com {name} e por quê.',
  },
  ingredientEvidence: {
    sources: 'Fontes',
    evidenceReviewed: 'Evidências revisadas em',
  },
  productDetail: {
    chips: {
      editorPick: 'Escolha editorial',
      caffeineFree: 'Sem cafeína',
      hasCaffeine: 'Com cafeína',
      allClinicalDoses: 'Todas as doses clínicas',
      npnLicensed: 'NPN Health Canada',
      personalImport: 'Importação pessoal',
      ffcNotified: 'Notificado FFC',
      austListed: 'AUST L',
      halalCertified: 'Certificado halal',
    },
    meta: {
      by: 'Por',
      productDescriptorByForm: { capsule: 'cápsula nootrópica diária', tablet: 'comprimido nootrópico diário', sachet: 'sachê nootrópico diário', shot: 'shot nootrópico diário', powder: 'pó nootrópico para beber', softgel: 'cápsula gelatinosa nootrópica diária' },
      updated: 'Atualizado:',
      lastVerified: 'Última verificação:',
      reviewedBy: 'Avaliado pela equipa editorial do The Nootropic Lab',
    },
    dateLocale: 'pt-PT',
    score: {
      label: 'Nossa pontuação',
      outOf10: 'em 10,0',
    },
    stats: {
      price: 'Preço',
      monthUnit: 'mês',
      capsules: 'Cáps.',
      dailyServing: 'Dose diária',
      units: { capsule: 'cáps.', tablet: 'comprimidos', sachet: 'sachês', shot: 'shots', powder: 'doses', softgel: 'cápsulas gelatinosas' },
      unitsSingular: { capsule: 'cáp.', tablet: 'comprimido', sachet: 'sachê', shot: 'shot', powder: 'dose', softgel: 'cápsula gelatinosa' },
      moneyBack: 'Garantia',
      days: 'dias',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/D',
      ourCut: 'Nossa comissão',
    },
    visitBrand: 'Visitar marca →',
    tabs: {
      overview: 'Visão geral',
      dosing: 'Auditoria de dosagem',
      pillars: 'Pilares',
      reviews: 'Avaliações',
      pricing: 'Preços',
      ariaLabel: 'Secções do produto',
    },
    alternatives: 'Alternativas semelhantes',
    pricing: {
      vendorTermsHeading: 'O que diz o site do vendedor',
      vendorTermsLede: 'Citado palavra por palavra das páginas do próprio vendedor. As condições mudam: confirme-as antes de comprar.',
      shipping: 'Envio',
      cancellation: 'Cancelar uma subscrição',
      oneTimePrice: 'Preço de compra única',
      moneyBackGuarantee: 'Garantia de devolução do dinheiro',
      returns: 'Devoluções',
      attribution: 'Segundo {domain}, verificado a {date}',
      opensInNewTab: '(abre num novo separador)',
      noVendorTerms: 'Não conseguimos verificar as condições deste vendedor. Consulte o site do vendedor para ver as condições em vigor.',
      visitVendor: 'Visitar {brand} →',
      affiliateCookie: 'O nosso cookie de afiliado',
      cookieTerms: '{days} dias · comissão de {rate}',
      noAffiliateCookie: 'Nenhum (sem acordo de afiliação)',
    },
    pillars: {
      labels: {
        ingredients: 'Qualidade dos ingredientes',
        dosing: 'Dosagem vs. evidência clínica',
        transparency: 'Transparência da fórmula',
        value: 'Relação qualidade-preço',
        trust: 'Confiança na marca',
      },
      rationale: {
        ingredients: 'Número e qualidade dos ingredientes classificados pelo nível de evidência. Extratos de marca registada e ativos padronizados aumentam esta pontuação.',
        dosing: 'A proporção dos ingredientes com uma dose de referência nas nossas páginas de ingredientes cuja quantidade diária declarada no rótulo atinge o mínimo dessa página. As quantidades que o rótulo oculta (partes de uma mistura) ou declara numa base diferente contam como não atingidas; os ingredientes sem página de referência são listados, mas não pontuados.',
        transparency: 'Divulgação completa de cada ingrediente na sua dose exata. As misturas proprietárias são pontuadas como opacas.',
        value: 'Custo mensal em relação às doses clínicas fornecidas por porção. Os produtos mais baratos com subdosagem pontuam menos.',
        trust: 'Reputação da marca, testes por terceiros, historial de reembolsos e sinal do Trustpilot ao longo de vários anos.',
      },
      notScored: 'Sem pontuação.',
      howComputedHeading: 'Como a pontuação é calculada',
      howComputedBody: 'Cada pilar é ponderado pela sua importância editorial. As ponderações são as mesmas para todas as marcas que auditamos: não são ajustadas para favorecer nenhum produto em particular.',
      readMethodology: 'Ler a metodologia →',
      pillarScoreAria: '{product}: pontuação do pilar {pillar}',
    },
    dosing: {
      heading: 'Auditoria de dosagem',
      subtitle: 'Quantidade diária declarada no rótulo face ao mínimo das nossas páginas de ingredientes; os ingredientes sem dose de referência são listados, mas não pontuados',
      adequateCount: '{adequate} / {total} com dose adequada',
      unavailable: 'Dados de dosagem indisponíveis para este produto. Muitos ingredientes estão ocultos em misturas proprietárias.',
      columns: { ingredient: 'Ingrediente', label: 'Rótulo', clinical: 'Dose clínica', status: 'Estado' },
      verdict: { pass: '✓ Cumpre', under: '✕ Abaixo', unverified: '? Não verificado', notScored: 'Sem pontuação' },
      noReferenceDose: 'Sem dose de referência registada',
      anchorDose: {
        'lions-mane': '1000-1800mg/dia',
        'bacopa-monnieri': '300-450mg/dia (≥50% de bacosídeos)',
        citicoline: '250-500mg/dia',
        'l-theanine': '100-200mg/dia',
        'rhodiola-rosea': '200-600mg/dia',
        phosphatidylserine: '100-300mg/dia',
        'alpha-gpc': '300-600mg/dia',
        ashwagandha: '300-600mg/dia (KSM-66)',
        'huperzine-a': '100-200mcg/dia',
        'l-tyrosine': '2000mg/dia (o ensaio positivo com a dose mais baixa)',
        caffeine: '100-200mg',
        'ginkgo-biloba': '240mg/dia (extrato 24/6)',
        'dha-omega-3': '900mg-1,2g de DHA/dia',
        'maritime-pine-bark': '100-200mg/dia',
        'acetyl-l-carnitine': '1500-3000mg/dia',
        'lutemax-2020': '12-27mg/dia',
        'oat-straw': '430-1600mg/dia',
        zynamite: '140-300mg/dia',
        dynamine: '100-150mg/dia',
        'longvida-curcumin': '400mg/dia (Longvida)',
      },
    },
    discontinued: { heading: 'Descontinuado', successorLink: 'Leia a nossa análise do sucessor' },
    healthDisclaimerHeading: 'Aviso de saúde',
    chipGroupLabel: 'Atributos do produto',
  },
  noPurchaseLink: NO_PURCHASE_LINK_STRINGS.pt,
  guide: {
    sources: 'Fontes',
    expand: 'expandir',
    evidenceReviewed: 'Evidência revista em',
  },
};

const de: UIStrings = {
  nav: {
    bestNootropics: 'Beste Nootropika',
    compare: 'Vergleichen',
    ingredients: 'Inhaltsstoffe',
    guides: 'Ratgeber',
    methodology: 'Methodik',
    about: 'Über uns',
    topPicks: 'Top-Empfehlungen',
    search: 'Suchen',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    primaryLandmark: 'Hauptnavigation',
    openComparator: 'Vergleichstool öffnen →',
    skipToContent: 'Zum Hauptinhalt springen',
  },
  footer: {
    tagline:
      'Wir vergleichen die Etikettendosen jedes Nootropikums mit den Referenzdosen unserer Inhaltsstoffseiten, sofern vorhanden. Affiliate-Provisionen werden inline offengelegt und beeinflussen die Bewertungen nicht.',
    copyrightLine:
      '© {year} Nootropic Lab · Informationen sind keine medizinische Beratung. Konsultieren Sie einen Arzt, bevor Sie ein Nahrungsergänzungsmittel einnehmen.',
    lastAuditLabel: 'Letzte vollständige Prüfung:',
    methodologyLabel: 'Methodik',
    bestByGoal: {
      heading: 'Beste nach Ziel',
      focus: 'Für Konzentration',
      memory: 'Für Gedächtnis',
      adhd: 'Für ADHS',
      aging: 'Für Altern',
      energy: 'Für Energie',
      mood: 'Für Stimmung',
      studying: 'Für das Lernen',
    },
    headToHead: {
      heading: 'Direktvergleich',
      allComparisons: 'Alle Vergleiche →',
    },
    byRegion: {
      heading: 'Nach Region',
      us: 'Vereinigte Staaten',
      eu: 'Europäische Union',
      ca: 'Kanada',
      au: 'Australien',
      jp: 'Japan',
      latam: 'Lateinamerika',
      gcc: 'Golfstaaten (GCC)',
      sea: 'Südostasien',
    },
    about: {
      heading: 'Über uns',
      methodology: 'Methodik',
      disclosures: 'Offenlegungen',
      privacy: 'Datenschutz',
      cookies: 'Cookies',
      imprint: 'Impressum',
      contact: 'Kontakt',
    },
  },
  cookie: {
    message: 'Wir verwenden Analyse-Cookies, um Ihre Erfahrung zu verbessern. Wir verwenden keine Werbe-Cookies.',
    gdprNote: 'DSGVO: Analytics wird erst nach Ihrer Zustimmung aktiviert. Notwendige Cookies sind immer aktiv.',
    accept: 'Analyse akzeptieren',
    decline: 'Ablehnen',
    privacyPolicy: 'Datenschutzerklärung',
    settings: 'Cookie-Einstellungen',
  },
  disclosure: {
    text: 'Affiliate-Hinweis: Diese Seite enthält Affiliate-Links. Wenn Sie über unsere Links kaufen, erhalten wir eine Provision ohne zusätzliche Kosten für Sie. Unsere redaktionellen Meinungen sind unabhängig — wir empfehlen nur Produkte, die wir unabhängig recherchiert haben.',
    methodology: 'Methodik lesen',
    badge: 'Werbehinweis (Affiliate-Links)',
    inline: 'Wenn Sie über Links auf dieser Seite kaufen, erhalten wir eine Provision – ohne Mehrkosten für Sie.',
    noCommission: 'Für dieses Produkt erhalten wir keine Provision; wir haben dafür keine Affiliate-Vereinbarung.',
    ranking: 'Unsere Bewertungen und Rankings folgen unserer veröffentlichten Methodik; Provisionen haben keinen Einfluss darauf.',
  },
  table: {
    product: 'Produkt',
    bestFor: 'Geeignet für',
    score: 'Bewertung',
    price: 'Preis',
    caffeineFree: 'Koffeinfrei',
    euStatus: 'EU-Status',
    moneyBack: 'Geld-zurück',
    trustpilot: 'Trustpilot',
    checkPrice: 'Preis prüfen →',
    noResults: 'Keine Produkte entsprechen Ihren Filtern. Bitte einen Filter entfernen.',
    yes: 'Ja',
    no: 'Nein',
    na: 'k. A.',
    sortBy: 'Sortieren nach',
    ascending: 'aufsteigend',
    descending: 'absteigend',
  },
  breadcrumb: {
    home: 'Start',
    ingredients: 'Inhaltsstoffe',
    backToBestNootropics: '← Zurück zu Beste Nootropika',
    backToIngredientsGuide: '← Zurück zum Inhaltsstoff-Ratgeber',
    ariaLabel: 'Brotkrümelnavigation',
  },
  search: {
    pages: {
      bestNootropics: 'Beste Nootropika',
      compareAll: 'Alle vergleichen',
      methodology: 'Methodik',
    },
    descriptions: {
      bestNootropics: 'Vollständiger Vergleich der Top-Marken',
      compareAll: 'Interaktives Vergleichswerkzeug',
      methodology: 'Wie wir Nahrungsergänzungsmittel bewerten',
    },
    liveRegion: {
      oneResult: '1 Ergebnis',
      manyResults: '{n} Ergebnisse',
      noResults: 'Keine Ergebnisse für {query}',
    },
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Klinische Dosis', onset: 'Wirkungseintritt' },
    sections: {
      mechanism: 'Wirkmechanismus',
      evidence: 'Zusammenfassung klinischer Evidenz',
      effects: 'Effekt-Matrix beim Menschen',
      benefits: 'Dokumentierte Vorteile',
      sideEffects: 'Nebenwirkungen und Vorsichtsmaßnahmen',
      howTo: 'Einnahme',
      stacking: 'Kombinationsempfehlungen',
      faq: 'Häufig gestellte Fragen',
      related: 'Verwandte Inhaltsstoffe',
    },
    toc: {
      mechanism: 'Wirkmechanismus',
      evidence: 'Klinische Evidenz',
      effects: 'Effekt-Matrix',
      benefits: 'Vorteile und Nebenwirkungen',
      howTo: 'Einnahme',
      stacking: 'Kombination',
      faq: 'FAQ',
      products: 'Produkte mit diesem Inhaltsstoff',
      related: 'Verwandte Inhaltsstoffe',
    },
    table: {
      effect: 'Effekt',
      evidence: 'Evidenz',
      magnitude: 'Ausmaß',
      studies: 'Studien',
      notes: 'Anmerkungen',
    },
    magnitude: { large: 'Groß', moderate: 'Mäßig', small: 'Klein', negligible: 'Vernachlässigbar' },
    category: {
      adaptogen: 'Adaptogen',
      cholinergic: 'Cholinergikum',
      mushroom: 'Pilz',
      amino: 'Aminosäure',
      herb: 'Heilkraut',
      vitamin: 'Vitamin',
    },
    sidebar: {
      quickFacts: 'Kurzfakten',
      onThisPage: 'Auf dieser Seite',
      category: 'Kategorie',
      dose: 'Dosis',
      onset: 'Wirkungseintritt',
      trials: 'Studien',
    },
    stackingLede: 'Inhaltsstoffe, die gut mit {name} kombinieren — und warum.',
  },
  ingredientEvidence: {
    sources: 'Quellen',
    evidenceReviewed: 'Evidenz geprüft am',
  },
  productDetail: {
    chips: {
      editorPick: 'Empfehlung der Redaktion',
      caffeineFree: 'Koffeinfrei',
      hasCaffeine: 'Koffeinhaltig',
      allClinicalDoses: 'Alle klinischen Dosen',
      npnLicensed: 'Health-Canada-NPN',
      personalImport: 'Privatimport',
      ffcNotified: 'FFC-notifiziert',
      austListed: 'AUST L',
      halalCertified: 'Halal-zertifiziert',
    },
    meta: {
      by: 'Von',
      productDescriptorByForm: { capsule: 'tägliche Nootropika-Kapsel', tablet: 'tägliche Nootropika-Tablette', sachet: 'täglicher Nootropika-Beutel', shot: 'täglicher Nootropika-Shot', powder: 'Nootropika-Trinkpulver', softgel: 'tägliche Nootropika-Weichkapsel' },
      updated: 'Aktualisiert:',
      lastVerified: 'Zuletzt geprüft:',
      reviewedBy: 'Geprüft von der Redaktion von The Nootropic Lab',
    },
    dateLocale: 'de-DE',
    score: {
      label: 'Unsere Bewertung',
      outOf10: 'von 10,0',
    },
    stats: {
      price: 'Preis',
      monthUnit: 'Monat',
      capsules: 'Kapseln',
      dailyServing: 'Tagesdosis',
      units: { capsule: 'Kapseln', tablet: 'Tabletten', sachet: 'Beutel', shot: 'Shots', powder: 'Messlöffel', softgel: 'Weichkapseln' },
      unitsSingular: { capsule: 'Kapsel', tablet: 'Tablette', sachet: 'Beutel', shot: 'Shot', powder: 'Messlöffel', softgel: 'Weichkapsel' },
      moneyBack: 'Geld-zurück',
      days: 'Tage',
      trustpilot: 'Trustpilot',
      notAvailable: 'k. A.',
      ourCut: 'Unsere Provision',
    },
    visitBrand: 'Zur Marke →',
    tabs: {
      overview: 'Übersicht',
      dosing: 'Dosierungsprüfung',
      pillars: 'Säulen',
      reviews: 'Bewertungen',
      pricing: 'Preise',
      ariaLabel: 'Produktbereiche',
    },
    alternatives: 'Ähnliche Alternativen',
    pricing: {
      vendorTermsHeading: 'Was die Website des Anbieters angibt',
      vendorTermsLede: 'Wörtlich von den Seiten des Anbieters zitiert. Bedingungen ändern sich – prüfen Sie sie vor dem Kauf.',
      shipping: 'Versand',
      cancellation: 'Abo kündigen',
      oneTimePrice: 'Preis beim Einmalkauf',
      moneyBackGuarantee: 'Geld-zurück-Garantie',
      returns: 'Rückgabe',
      attribution: 'Laut {domain}, geprüft am {date}',
      opensInNewTab: '(öffnet in neuem Tab)',
      noVendorTerms: 'Wir konnten die Bedingungen dieses Anbieters nicht überprüfen. Die aktuellen Bedingungen finden Sie auf der Website des Anbieters.',
      visitVendor: '{brand} besuchen →',
      affiliateCookie: 'Unser Affiliate-Cookie',
      cookieTerms: '{days} Tage · {rate} Provision',
      noAffiliateCookie: 'Keines (keine Affiliate-Vereinbarung)',
    },
    pillars: {
      labels: {
        ingredients: 'Qualität der Inhaltsstoffe',
        dosing: 'Dosierung vs. klinische Evidenz',
        transparency: 'Transparenz der Rezeptur',
        value: 'Preis-Leistungs-Verhältnis',
        trust: 'Vertrauen in die Marke',
      },
      rationale: {
        ingredients: 'Anzahl und Qualität der nach Evidenz bewerteten Inhaltsstoffe. Markengeschützte Extrakte und standardisierte Wirkstoffe erhöhen diesen Wert.',
        dosing: 'Der Anteil der Inhaltsstoffe mit einer Referenzdosis auf unseren Inhaltsstoffseiten, deren auf dem Etikett angegebene Tagesmenge das Minimum dieser Seite erreicht. Mengen, die das Etikett verbirgt (Anteile einer Mischung) oder auf einer anderen Grundlage angibt, gelten als nicht erreicht; Inhaltsstoffe ohne Referenzseite werden aufgeführt, aber nicht bewertet.',
        transparency: 'Vollständige Offenlegung jedes Inhaltsstoffs mit seiner genauen Dosis. Proprietäre Mischungen werden als intransparent bewertet.',
        value: 'Monatliche Kosten im Verhältnis zu den klinischen Dosen pro Portion. Günstigere Produkte mit Unterdosierung schneiden schlechter ab.',
        trust: 'Ruf der Marke, Tests durch Dritte, Erstattungshistorie und Trustpilot-Signal über mehrere Jahre.',
      },
      notScored: 'Nicht bewertet.',
      howComputedHeading: 'So wird die Bewertung berechnet',
      howComputedBody: 'Jede Säule wird nach ihrer redaktionellen Bedeutung gewichtet. Die Gewichtungen sind für jede von uns geprüfte Marke gleich – sie werden nicht zugunsten eines bestimmten Produkts angepasst.',
      readMethodology: 'Zur Methodik →',
      pillarScoreAria: '{product}: Bewertung der Säule {pillar}',
    },
    dosing: {
      heading: 'Dosierungsprüfung',
      subtitle: 'Auf dem Etikett angegebene Tagesmenge im Vergleich zum Minimum auf unseren Inhaltsstoffseiten; Inhaltsstoffe ohne Referenzdosis werden aufgeführt, aber nicht bewertet',
      adequateCount: '{adequate} / {total} ausreichend dosiert',
      unavailable: 'Für dieses Produkt sind keine Dosierungsdaten verfügbar. Viele Inhaltsstoffe sind in proprietären Mischungen versteckt.',
      columns: { ingredient: 'Inhaltsstoff', label: 'Etikett', clinical: 'Klinische Dosis', status: 'Ergebnis' },
      verdict: { pass: '✓ Erfüllt', under: '✕ Zu niedrig', unverified: '? Nicht verifiziert', notScored: 'Nicht bewertet' },
      noReferenceDose: 'Keine Referenzdosis hinterlegt',
      anchorDose: {
        'lions-mane': '1000-1800mg/Tag',
        'bacopa-monnieri': '300-450mg/Tag (≥50% Bacoside)',
        citicoline: '250-500mg/Tag',
        'l-theanine': '100-200mg/Tag',
        'rhodiola-rosea': '200-600mg/Tag',
        phosphatidylserine: '100-300mg/Tag',
        'alpha-gpc': '300-600mg/Tag',
        ashwagandha: '300-600mg/Tag (KSM-66)',
        'huperzine-a': '100-200mcg/Tag',
        'l-tyrosine': '2000mg/Tag (niedrigste Dosis einer positiven Studie)',
        caffeine: '100-200mg',
        'ginkgo-biloba': '240mg/Tag (24/6-Extrakt)',
        'dha-omega-3': '900mg-1,2g DHA/Tag',
        'maritime-pine-bark': '100-200mg/Tag',
        'acetyl-l-carnitine': '1500-3000mg/Tag',
        'lutemax-2020': '12-27mg/Tag',
        'oat-straw': '430-1600mg/Tag',
        zynamite: '140-300mg/Tag',
        dynamine: '100-150mg/Tag',
        'longvida-curcumin': '400mg/Tag (Longvida)',
      },
    },
    discontinued: { heading: 'Nicht mehr erhältlich', successorLink: 'Zu unserer Bewertung des Nachfolgers' },
    healthDisclaimerHeading: 'Gesundheitshinweis',
    chipGroupLabel: 'Produktmerkmale',
  },
  noPurchaseLink: NO_PURCHASE_LINK_STRINGS.de,
  guide: {
    sources: 'Quellen',
    expand: 'ausklappen',
    evidenceReviewed: 'Evidenz geprüft am',
  },
};

// Quebec French (fr-CA). Generated by /tmp/translate-frca-uistrings.mts (Claude
// Sonnet 4.6, 2026-05-28). OQLF-compliant: "témoins" not "cookies", "RGPD" not
// "GDPR", "Santé Canada" not "Health Canada", "courriel" not "e-mail".
// `dateLocale: 'fr-CA'` carries the BCP-47 code for Intl.DateTimeFormat.
// Native-speaker review recommended before final ship.
const frCa: UIStrings = {
  nav: {
    bestNootropics: 'Meilleurs Nootropiques',
    compare: 'Comparer',
    ingredients: 'Ingrédients',
    guides: 'Guides',
    methodology: 'Méthodologie',
    about: 'À propos',
    topPicks: 'Nos coups de cœur',
    search: 'Rechercher',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    primaryLandmark: 'Navigation principale',
    openComparator: 'Ouvrir le comparateur →',
    skipToContent: 'Aller au contenu principal',
  },
  footer: {
    tagline:
      "Nous vérifions les doses indiquées sur l'étiquette de chaque nootropique par rapport aux doses de référence de nos pages d'ingrédients, lorsqu'elles existent. Les commissions d'affiliation sont divulguées en ligne et n'influencent pas les notes.",
    copyrightLine:
      "© {year} Nootropic Lab · L'information ne constitue pas un avis médical. Consultez un professionnel de la santé avant de prendre tout supplément.",
    lastAuditLabel: 'Dernière vérification complète :',
    methodologyLabel: 'Méthodologie',
    bestByGoal: {
      heading: 'Meilleurs par objectif',
      focus: 'Pour la concentration',
      memory: 'Pour la mémoire',
      adhd: 'Pour le TDAH',
      aging: 'Pour le vieillissement',
      energy: "Pour l'énergie",
      mood: "Pour l'humeur",
      studying: "Pour l'étude",
    },
    headToHead: {
      heading: 'Face-à-face',
      allComparisons: 'Toutes les comparaisons →',
    },
    byRegion: {
      heading: 'Par région',
      us: 'États-Unis',
      eu: 'Union européenne',
      ca: 'Canada',
      au: 'Australie',
      jp: 'Japon',
      latam: 'Amérique latine',
      gcc: 'Golfe (CCG)',
      sea: 'Asie du Sud-Est',
    },
    about: {
      heading: 'À propos',
      methodology: 'Méthodologie',
      disclosures: 'Divulgations',
      privacy: 'Confidentialité',
      cookies: 'Témoins',
      imprint: 'Mentions légales',
      contact: 'Contact',
    },
  },
  cookie: {
    message: 'Nous utilisons des témoins d\'analyse pour améliorer votre expérience. Nous n\'utilisons pas de témoins publicitaires.',
    gdprNote: 'RGPD : Les analyses ne sont activées qu\'après votre consentement. Les témoins nécessaires sont toujours actifs.',
    accept: 'Accepter les témoins d\'analyse',
    decline: 'Refuser',
    privacyPolicy: 'politique de confidentialité',
    settings: 'Paramètres des témoins',
  },
  disclosure: {
    text: 'Divulgation de liens affiliés : Cette page contient des liens affiliés. Si vous effectuez un achat par l\'entremise de nos liens, nous pouvons toucher une commission sans frais supplémentaires pour vous. Nos opinions éditoriales sont indépendantes — nous recommandons uniquement des produits que nous avons évalués de façon indépendante.',
    methodology: 'Lire notre méthodologie',
    badge: 'Divulgation de liens affiliés',
    inline: "Nous touchons une commission si vous effectuez un achat par l'entremise des liens de cette page, sans frais supplémentaires pour vous.",
    noCommission: 'Nous ne touchons aucune commission sur ce produit : nous n’avons aucune entente d’affiliation le concernant.',
    ranking: 'Nos notes et nos classements suivent notre méthodologie publiée; les commissions ne les influencent pas.',
  },
  table: {
    product: 'Produit',
    bestFor: 'Idéal pour',
    score: 'Score',
    price: 'Prix',
    caffeineFree: 'Sans caféine',
    euStatus: 'Statut UE',
    moneyBack: 'Remboursement',
    trustpilot: 'Trustpilot',
    checkPrice: 'Vérifier le prix →',
    noResults: 'Aucun produit ne correspond à vos filtres. Essayez d\'en retirer un.',
    yes: 'Oui',
    no: 'Non',
    na: 'S.O.',
    sortBy: 'Trier par',
    ascending: 'croissant',
    descending: 'décroissant',
  },
  breadcrumb: {
    home: 'Accueil',
    ingredients: 'Ingrédients',
    backToBestNootropics: '← Retour aux meilleurs nootropiques',
    backToIngredientsGuide: '← Retour au guide des ingrédients',
    ariaLabel: "Fil d'Ariane",
  },
  search: {
    pages: {
      bestNootropics: 'Meilleurs Nootropiques',
      compareAll: 'Comparer Tout',
      methodology: 'Méthodologie',
    },
    descriptions: {
      bestNootropics: 'Comparaison complète des principales marques',
      compareAll: 'Outil de comparaison interactif',
      methodology: 'Comment nous évaluons les suppléments',
    },
    liveRegion: {
      oneResult: '1 résultat',
      manyResults: '{n} résultats',
      noResults: 'Aucun résultat pour {query}',
    },
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Dose clinique', onset: 'Délai d\'action' },
    sections: {
      mechanism: 'Mécanisme d\'action',
      evidence: 'Résumé des données cliniques',
      effects: 'Matrice des effets chez l\'humain',
      benefits: 'Bienfaits documentés',
      sideEffects: 'Effets secondaires et mises en garde',
      howTo: 'Mode d\'utilisation',
      stacking: 'Recommandations de combinaison',
      faq: 'Questions fréquemment posées',
      related: 'Ingrédients connexes',
    },
    toc: {
      mechanism: 'Mécanisme',
      evidence: 'Données cliniques',
      effects: 'Matrice des effets',
      benefits: 'Bienfaits et effets secondaires',
      howTo: 'Mode d\'utilisation',
      stacking: 'Combinaison',
      faq: 'FAQ',
      products: 'Produits qui en contiennent',
      related: 'Ingrédients connexes',
    },
    table: {
      effect: 'Effet',
      evidence: 'Preuves',
      magnitude: 'Ampleur',
      studies: 'Études',
      notes: 'Notes',
    },
    magnitude: { large: 'Importante', moderate: 'Modérée', small: 'Faible', negligible: 'Négligeable' },
    category: {
      adaptogen: 'Adaptogène',
      cholinergic: 'Cholinergique',
      mushroom: 'Champignon',
      amino: 'Acide aminé',
      herb: 'Plante médicinale',
      vitamin: 'Vitamine',
    },
    sidebar: {
      quickFacts: 'Faits rapides',
      onThisPage: 'Sur cette page',
      category: 'Catégorie',
      dose: 'Dose',
      onset: 'Délai d\'action',
      trials: 'Essais cliniques',
    },
    stackingLede: 'Ingrédients qui se combinent bien avec {name} et les raisons pour lesquelles.',
  },
  ingredientEvidence: {
    sources: 'Sources',
    evidenceReviewed: 'Données probantes vérifiées le',
  },
  productDetail: {
    chips: {
      editorPick: 'Choix de la rédaction',
      caffeineFree: 'Sans caféine',
      hasCaffeine: 'Caféine',
      allClinicalDoses: 'Toutes les doses cliniques',
      npnLicensed: 'NPN Santé Canada',
      personalImport: 'Importation personnelle',
      ffcNotified: 'Notifié FFC',
      austListed: 'AUST L',
      halalCertified: 'Certifié halal',
    },
    meta: {
      by: 'Par',
      productDescriptorByForm: { capsule: 'capsule nootropique quotidienne', tablet: 'comprimé nootropique quotidien', sachet: 'sachet nootropique quotidien', shot: 'shot nootropique quotidien', powder: 'poudre nootropique à diluer', softgel: 'capsule molle nootropique quotidienne' },
      updated: 'Mis à jour :',
      lastVerified: 'Dernière vérification :',
      reviewedBy: "Évalué par l'équipe éditoriale de The Nootropic Lab",
    },
    dateLocale: 'fr-CA',
    score: { label: 'Notre score', outOf10: 'sur 10,0' },
    stats: {
      price: 'Prix',
      monthUnit: 'mois',
      capsules: 'Gélules',
      dailyServing: 'Dose quotidienne',
      units: { capsule: 'gélules', tablet: 'comprimés', sachet: 'sachets', shot: 'shots', powder: 'doses', softgel: 'capsules molles' },
      unitsSingular: { capsule: 'gélule', tablet: 'comprimé', sachet: 'sachet', shot: 'shot', powder: 'dose', softgel: 'capsule molle' },
      moneyBack: 'Remboursement',
      days: 'jours',
      trustpilot: 'Trustpilot',
      notAvailable: 'S.O.',
      ourCut: 'Notre commission',
    },
    visitBrand: 'Visiter la marque →',
    tabs: {
      overview: 'Aperçu',
      dosing: 'Vérification des doses',
      pillars: 'Piliers',
      reviews: 'Évaluations',
      pricing: 'Tarification',
      ariaLabel: 'Sections du produit',
    },
    alternatives: 'Alternatives similaires',
    pricing: {
      vendorTermsHeading: 'Ce qu’indique le site du vendeur',
      vendorTermsLede: 'Cité mot pour mot à partir des pages du vendeur. Les conditions changent : vérifiez-les avant d’acheter.',
      shipping: 'Livraison',
      cancellation: 'Annuler un abonnement',
      oneTimePrice: 'Prix à l’achat unique',
      moneyBackGuarantee: 'Garantie de remboursement',
      returns: 'Retours',
      attribution: 'Selon {domain}, vérifié le {date}',
      opensInNewTab: '(s’ouvre dans un nouvel onglet)',
      noVendorTerms: 'Nous n’avons pas pu vérifier les conditions de ce vendeur. Consultez le site du vendeur pour connaître les conditions en vigueur.',
      visitVendor: 'Visiter {brand} →',
      affiliateCookie: 'Notre témoin d’affiliation',
      cookieTerms: '{days} jours · commission de {rate}',
      noAffiliateCookie: 'Aucun (pas d’entente d’affiliation)',
    },
    pillars: {
      labels: {
        ingredients: 'Qualité des ingrédients',
        dosing: 'Dosage par rapport aux données probantes cliniques',
        transparency: 'Transparence de la formule',
        value: 'Rapport qualité-prix',
        trust: 'Confiance envers la marque',
      },
      rationale: {
        ingredients: 'Nombre et qualité des ingrédients cotés selon les données probantes. Les extraits de marque déposée et les actifs normalisés font monter ce score.',
        dosing: 'La proportion des ingrédients ayant une dose de référence dans nos pages d’ingrédients dont la quantité quotidienne indiquée sur l’étiquette atteint le minimum de cette page. Les quantités que l’étiquette cache (parts d’un mélange) ou indique sur une autre base comptent comme non atteintes; les ingrédients sans page de référence sont affichés, mais pas notés.',
        transparency: 'Divulgation complète de chaque ingrédient à sa dose exacte. Les mélanges exclusifs sont notés comme opaques.',
        value: 'Coût mensuel par rapport aux doses cliniques fournies par portion. Les produits moins chers et sous-dosés obtiennent un score plus bas.',
        trust: 'Réputation de la marque, analyses par des tiers, historique des remboursements et signal Trustpilot sur plusieurs années.',
      },
      notScored: 'Non noté.',
      howComputedHeading: 'Comment le score est calculé',
      howComputedBody: 'Chaque pilier est pondéré selon son importance éditoriale. Les pondérations sont les mêmes pour toutes les marques que nous vérifions; elles ne sont pas ajustées pour favoriser un produit en particulier.',
      readMethodology: 'Lire la méthodologie →',
      pillarScoreAria: '{product} : score du pilier {pillar}',
    },
    dosing: {
      heading: 'Vérification des doses',
      subtitle: 'Quantité quotidienne indiquée sur l’étiquette par rapport au minimum de nos pages d’ingrédients; les ingrédients sans dose de référence sont affichés, mais pas notés',
      adequateCount: '{adequate} / {total} doses adéquates',
      unavailable: 'Données sur les doses non disponibles pour ce produit. De nombreux ingrédients sont cachés dans des mélanges exclusifs.',
      columns: { ingredient: 'Ingrédient', label: 'Étiquette', clinical: 'Dose clinique', status: 'Statut' },
      verdict: { pass: '✓ Conforme', under: '✕ Sous-dosé', unverified: '? Non vérifié', notScored: 'Non noté' },
      noReferenceDose: 'Aucune dose de référence au dossier',
      anchorDose: {
        'lions-mane': '1000-1800mg/jour',
        'bacopa-monnieri': '300-450mg/jour (≥50% de bacosides)',
        citicoline: '250-500mg/jour',
        'l-theanine': '100-200mg/jour',
        'rhodiola-rosea': '200-600mg/jour',
        phosphatidylserine: '100-300mg/jour',
        'alpha-gpc': '300-600mg/jour',
        ashwagandha: '300-600mg/jour (KSM-66)',
        'huperzine-a': '100-200mcg/jour',
        'l-tyrosine': '2000mg/jour (essai positif à la plus faible dose)',
        caffeine: '100-200mg',
        'ginkgo-biloba': '240mg/jour (extrait 24/6)',
        'dha-omega-3': '900mg-1,2g de DHA/jour',
        'maritime-pine-bark': '100-200mg/jour',
        'acetyl-l-carnitine': '1500-3000mg/jour',
        'lutemax-2020': '12-27mg/jour',
        'oat-straw': '430-1600mg/jour',
        zynamite: '140-300mg/jour',
        dynamine: '100-150mg/jour',
        'longvida-curcumin': '400mg/jour (Longvida)',
      },
    },
    discontinued: { heading: 'Produit arrêté', successorLink: 'Lire notre avis sur le successeur' },
    healthDisclaimerHeading: 'Avis de santé',
    chipGroupLabel: 'Caractéristiques du produit',
  },
  noPurchaseLink: NO_PURCHASE_LINK_STRINGS['fr-CA'],
  guide: {
    sources: 'Sources',
    expand: 'afficher',
    evidenceReviewed: 'Données probantes vérifiées le',
  },
};

const translations: Record<Locale, UIStrings> = { en, es, fr, ja, pt, de, 'fr-CA': frCa };

export function getStrings(locale: Locale): UIStrings {
  return translations[locale] || translations.en;
}

export function getLocaleForMarket(market: string): Locale {
  switch (market) {
    case 'latam': return 'es';
    case 'jp': return 'ja';
    default: return 'en';
  }
}
