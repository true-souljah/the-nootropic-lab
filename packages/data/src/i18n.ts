import { NO_PURCHASE_LINK_STRINGS, type NoPurchaseLinkStrings } from './purchase-link';
import type { Product } from './products-us';
import type { RegionCode } from './regional';

export type Locale = 'en' | 'es' | 'fr' | 'ja' | 'pt' | 'de' | 'fr-CA';

/** One string per score pillar (the keys of Product.scoreBreakdown). */
export type PillarStrings = Record<keyof Product['scoreBreakdown'], string>;

/** One string per regional host (RegionCode in ./regional). */
export type RegionStrings = Record<RegionCode, string>;

/** Use cases with a "Related guides" link on every Listicle. */
export type RelatedGuideUseCase = 'focus' | 'memory' | 'studying' | 'aging';

/** One string per Ingredient.category. */
export interface IngredientCategoryStrings {
  adaptogen: string;
  cholinergic: string;
  mushroom: string;
  amino: string;
  herb: string;
  vitamin: string;
}

/**
 * Licence / import status lines of the "Buying in <region>" block, one per
 * `LicenceStatus.key` (./regional). Placeholders: {npn}, {austl}, {number}
 * are the record's numbers; {date} is the record's check date (YYYY-MM-DD).
 */
export interface LicenceStatusStrings {
  npnNumber: string;
  npnLicensed: string;
  noNpn: string;
  noNpnChecked: string;
  austl: string;
  personalImportation: string;
  ffcNumber: string;
  ffcNotified: string;
  noFfc: string;
  noFfcChecked: string;
  euStorefront: string;
  halalCertified: string;
  noHalal: string;
  noHalalChecked: string;
}

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
    /** AppShell top-bar link to the comparator. */
    buildMyStack: string;
    /** Accessible name of the AppShell mobile navigation drawer (role="dialog"). */
    drawerLabel: string;
    /** AppShell sidebar rail (primitives/Sidebar.tsx): group headings and link labels. */
    sidebar: {
      browse: string;
      discover: string;
      allProducts: string;
      /** Link to /best-nootropics/; the year is part of the label, as in English. */
      bestOf2026: string;
      ingredients: string;
      tools: string;
      comparator: string;
      doseCalculator: string;
      myShortlist: string;
      about: string;
      ourMethodology: string;
      disclosures: string;
      /** Footer mailto link of the rail. */
      submitTip: string;
    };
    /** AppShell meta line on product lists (best-of, comparator); {n} is the count. */
    productCount: string;
    /** AppShell meta line on the ingredient library; {n} is the count. */
    ingredientCount: string;
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
    /**
     * Short label on the disclosure strip and trust note of a page with a
     * commission-earning buy link (DisclosureScope 'page'). JP: carries 広告.
     */
    badge: string;
    /**
     * Label in place of `badge` on a page without a commission-earning buy
     * link (DisclosureScope 'site' and 'product'). Neutral: not "advertisement"
     * (広告) and not "affiliate", because the page carries no affiliate link.
     */
    neutralBadge: string;
    /**
     * Plain-language commission sentence rendered next to the first
     * affiliate CTA (FTC "as close as possible"; UK ASA: never the word
     * "affiliate" alone). Only on a page that renders at least one buy link
     * to a product we earn a commission on (DisclosureScope 'page').
     */
    inline: string;
    /**
     * Replaces `inline` on the review page of a product we earn no commission
     * on (`earnsCommission(product)` is false, e.g. `commissionRate: "0%"`).
     * True whether or not the page shows a buy link.
     */
    noCommission: string;
    /**
     * Replaces `inline` on a page without a commission-earning buy link
     * (DisclosureScope 'site'): a site-level statement that never says the
     * page itself carries affiliate links. Followed by `ranking` on the strip.
     */
    siteWide: string;
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
    ascending: string;
    descending: string;
    /** Accessible name of a sort control; {column} is one of `sortColumns`. */
    sortAria: string;
    /** Same, on the column the table is sorted by; {direction} is `ascending` or `descending`. */
    sortAriaActive: string;
    /** Column names in the sort controls' accessible names: readable words, never a record field name. */
    sortColumns: { score: string; price: string; moneyBack: string; trustpilot: string };
    /** Badge on the editor's-choice product. */
    editorChoice: string;
    /** Filter chip: only products with an EU storefront. */
    euStorefront: string;
    /** Label of the per-month price cap slider; {price} is the formatted cap. */
    maxPrice: string;
    /** Screen-reader name of the buy-link column. */
    actions: string;
    /** Accessible name of a score cell; {score} is the score. */
    scoreAria: string;
    /** Heading of the score tooltip. */
    scoreBreakdown: string;
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
    /**
     * CommandPalette dialog (templates/CommandPalette.tsx). The key caps
     * (⌘K, Esc, ↑ ↓ ↵) stay as symbols; these are the words around them.
     */
    palette: {
      /** Accessible name of the search dialog. */
      dialogLabel: string;
      placeholder: string;
      /** Accessible name of the result list while a query is typed. */
      resultsLabel: string;
      /** Accessible name of the result list while the query is empty. */
      recentLabel: string;
      /** Shown when nothing matches; {query} is the user's text (rendered emphasized). */
      noResults: string;
      /** Empty state before any recent item exists. */
      emptyPrompt: string;
      /** Heading of the recent-items section. */
      recent: string;
      /** Result-section headings. */
      categories: { ingredients: string; products: string; comparisons: string; guides: string; other: string };
      /** Footer key hints, each after its key cap. */
      hints: { navigate: string; open: string; close: string };
      /** Footer count; {n} is the number of indexed items. */
      indexed: string;
      /** Appended to a product row's accessible name; {score} is the score with one decimal. */
      scoreAria: string;
      /** Appended to an ingredient row's accessible name; {grade} is A, B or C. */
      gradeAria: string;
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
    category: IngredientCategoryStrings;
    /** Category line on the related-ingredient cards (lowercase in en; the card capitalizes it). */
    relatedCategory: IngredientCategoryStrings;
    /** Lede under the effect-matrix heading. */
    humanTrialsOnly: string;
    /** Evidence-strength chip per HumanEffect.evidenceStrength (lowercase in en). */
    evidenceStrength: { strong: string; moderate: string; preliminary: string; mixed: string };
    /** Legend under the effect matrix: its label, then one "<level> = <meaning>" entry per level. */
    evidenceKey: { label: string; strong: string; moderate: string; preliminary: string; mixed: string };
    /** Row labels of the "How to take" card; the values are ingredient data. */
    howToLabels: { dosage: string; timing: string; withFood: string; cycling: string; forms: string };
    /** Heading of the products grid; {name} is the ingredient name. */
    topStacks: string;
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
      productDescriptorByForm: { capsule: string; tablet: string; sachet: string; shot: string; powder: string; softgel: string; can: string };
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
      /** Accessible name of a score pill; {score} and {max} are formatted with one decimal. */
      aria: string;
    };
    stats: {
      price: string;
      /**
       * Monthly-price unit WITHOUT the slash ("mo", "Monat"); render as
       * `${price}/${monthUnit}`. A string starting with "/" in the RSC payload
       * is crawled by Google as a URL (GSC 404 "/mo", 2026-10).
       */
      monthUnit: string;
      /** Per-serving price unit, WITHOUT the slash (same rule as `monthUnit`): `${price}/${perServingUnit}`. */
      perServingUnit: string;
      /** Per-day price unit, WITHOUT the slash (same rule as `monthUnit`): `${price}/${perDayUnit}`. */
      perDayUnit: string;
      /** Column/row label for the per-serving price (comparator, head-to-head). */
      perServingLabel: string;
      /** Label for the per-day price. */
      perDayLabel: string;
      capsules: string;
      /** Stat label for the per-day serving, whatever the product's form. */
      dailyServing: string;
      /** Unit label per `Product.form`, shown after `capsulesPerServing`. */
      units: { capsule: string; tablet: string; sachet: string; shot: string; powder: string; softgel: string; can: string };
      /** Same labels for a count of exactly 1 ("1 sachet", not "1 sachets"). */
      unitsSingular: { capsule: string; tablet: string; sachet: string; shot: string; powder: string; softgel: string; can: string };
      moneyBack: string;
      /** "days" suffix for the money-back-guarantee value. */
      days: string;
      /** A money-back length; {days} is the number of days. */
      daysCount: string;
      /** Short form of the same, for tight cells. */
      daysCountShort: string;
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
    /** First breadcrumb in the review page's top bar (links to /best-nootropics/). */
    breadcrumbBestOf: string;
    /**
     * Overview tab (product-detail/OverviewTab.tsx). The record's own text
     * (summary, whatItIs, howItWorks, whatToExpect, hero ingredients, pros,
     * cons) is data and stays as recorded; these are the labels around it.
     */
    overview: {
      /** Eyebrow above the verdict headline. */
      verdictEyebrow: string;
      /** Verdict headline per score tier (scoreTier); {product} is the product name, rendered in the tier colour. */
      verdict: { good: string; warn: string; bad: string };
      whatItDoes: string;
      howItWorks: string;
      whatToExpect: string;
      heroIngredients: string;
      /** Heading above the first pros. */
      whoItsFor: string;
      /** Heading above the first cons. */
      whoShouldSkip: string;
    };
    /** Reviews tab (product-detail/ReviewsTab.tsx). Trustpilot is a brand name and stays as is. */
    reviews: {
      /** Card heading when the record has no Trustpilot score. */
      noProfileHeading: string;
      /** {brand} is the product's brand. */
      noProfileBody: string;
      noProfileTrust: string;
      /** Accessible name of the star row; {score} is the Trustpilot score. */
      starsAria: string;
      /** {count} is the review count, formatted for the locale. */
      countOnTrustpilot: string;
      /** {count} is the review count, formatted for the locale. */
      verifiedCount: string;
      noCherryPicking: string;
      /** Link to the brand's Trustpilot page; {count} is the review count. */
      readAll: string;
    };
    /**
     * "Buying in <region>" block (RegionalBuying.tsx), derived from the
     * region's own record. Region-specific labels (heading, regulator, geo-hub
     * link) are keyed by RegionCode; en matches REGION_PROFILES in ./regional.
     */
    regionalBuying: {
      heading: RegionStrings;
      price: string;
      /** Monthly-price unit without the slash; rendered as `${price}/${monthUnit}` in one string. */
      monthUnit: string;
      /** Label of the licence / import status line. */
      status: string;
      whereToBuy: string;
      importPathway: string;
      /** Short regulator label next to the status. */
      regulator: RegionStrings;
      /** Link to the region's geo hub. */
      geoHub: RegionStrings;
      licence: LicenceStatusStrings;
    };
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
      /** One-word pillar names in compact score panels (listicle cards, best-of rows, comparator, score tooltip). */
      short: PillarStrings;
      /** Accessible name of a compact pillar bar; {name} is the product name, {pillar} a `short` name. */
      shortScoreAria: string;
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
    /** Read time on guide cards and guide pages; {minutes} is the estimate. */
    minRead: string;
    /** H1 of the guides index; {year} is the current year. */
    indexHeading: string;
    /** Link on each guides-index card. */
    readGuide: string;
    /** Back link at the end of a guide. */
    backToGuides: string;
    /** Category chip per Guide.category. */
    categories: { beginner: string; stacking: string; usage: string; science: string };
  };
  /**
   * Meta row under the H1 of editorial pages (FPByline: listicles, ingredient
   * and comparison pages). Team credit only — never a named individual.
   */
  byline: {
    attribution: string;
    factChecked: string;
    /** Label before the date. */
    updated: string;
    /** {minutes} is the estimated read time. */
    readTime: string;
  };
  /**
   * "Best nootropics for <use case>" pages (templates/Listicle.tsx). The page's
   * own copy (title, hero, evidence cards, picks' reasons, FAQ) is passed in by
   * the page and is not part of the bundle.
   */
  listicle: {
    /** Second breadcrumb: the best-of hub. */
    bestNootropics: string;
    /** Heading of the health-disclaimer aside. */
    healthDisclaimer: string;
    /** Disclaimer body when the page passes none. */
    defaultHealthDisclaimer: string;
    whatEvidenceSays: string;
    /** Lead paragraph of the evidence section. */
    evidenceIntro: string;
    /** Link to an evidence card's source. */
    sourceLink: string;
    /** Picks heading; {useCase} is `useCaseLabels[useCase]`, or the page's use-case slug fragment. */
    ourPicksFor: string;
    picksIntro: string;
    /** Badge after "#1" on the first pick. */
    topPick: string;
    whyItsHere: string;
    /** Buy CTA; {name} is the product name. */
    checkProduct: string;
    readFullReview: string;
    faqHeading: string;
    howWeChoose: string;
    /**
     * "How we choose" body; {minScore} is LISTICLE_MIN_SCORE (never a typed
     * number). {link} is where the `fullMethodology` link goes, so each
     * language places it and closes the sentence itself.
     */
    howWeChooseBody: string;
    /** Inline link text to /methodology/. */
    fullMethodology: string;
    /** {year} is the current year. */
    backToBest: string;
    /** Heading of the unranked section for picks below the bar; {minScore}. */
    alsoConsideredHeading: string;
    /** Lead paragraph of that section; {minScore}. */
    alsoConsideredIntro: string;
    /** Reason line of a pick below the bar; {score} and {minScore}. */
    belowBarReason: string;
    /** Heading of that section when a pick in it meets the bar but fails rule (b), the dose rule. */
    alsoConsideredRulesHeading: string;
    /** Lead paragraph in that case (names both rules); {minScore}. */
    alsoConsideredRulesIntro: string;
    /** Reason line of a pick that meets the bar but fails rule (b); {score}. */
    doseRuleReason: string;
    /** Lead paragraph when a pick meets both rules but the edition shows no purchase link for it; {minScore}. */
    alsoConsideredLinkIntro: string;
    /** Reason line of a pick that meets both rules but has no purchase link in this edition; {score}. */
    noPurchaseLinkReason: string;
    /** "In this guide" sidebar link to the unranked section. */
    alsoConsideredToc: string;
    /** Chip above the H1, before the date. */
    audited: string;
    /** Label of the page's use case in `ourPicksFor`, keyed by use-case slug fragment. */
    useCaseLabels: Partial<Record<string, string>>;
    /** Money-back length on a pick card; {days}. */
    moneyBackDays: string;
    /** Word after the money-back length. */
    moneyBackLabel: string;
    /** Label of a pick card's score panel. */
    ourScore: string;
    relatedGuides: string;
    /** Sibling-listicle link labels. */
    relatedGuideLabels: Record<RelatedGuideUseCase, string>;
    /** Sidebar table-of-contents heading. */
    inThisGuide: string;
  };
  /** Ranked best-of leaderboard (templates/BestOf.tsx). */
  bestOf: {
    /** Stat tiles above the ranking. */
    stats: { audited: string; recommended: string; underdosed: string; avgMonthly: string };
    /** Line under the H1; {audited}, {listed}, {version} (methodology version) and {date}. */
    subtitle: string;
    /** Label under each row's rank number. */
    rank: string;
    /** Spec label of the commission rate. */
    commission: string;
    /** Buy CTA of each row. */
    visit: string;
  };
  /** Interactive comparator (templates/Comparator.tsx and comparator/*). */
  comparator: {
    /** H1 and breadcrumb. */
    heading: string;
    /** Line under the H1; {shown}, {total} and {max} (products selectable for side-by-side). */
    matchSummary: string;
    /** Filter panel heading and its mobile trigger. */
    filters: string;
    saveView: string;
    /** Status after "Save view" copies the link. */
    linkCopied: string;
    clipboardError: string;
    /** Accessible name of the comparison grid. */
    gridLabel: string;
    columns: { product: string; score: string; value: string; price: string; trustpilot: string; bestFor: string };
    /** Empty state, followed by `resetFilters`. */
    noMatch: string;
    resetFilters: string;
    /** Row checkbox; {name} is the product name. */
    compareAria: string;
    /** Row link to the review. */
    view: string;
    /** Its accessible name; {name} is the product name. */
    viewAria: string;
    /** Marker after the brand of a product with caffeine. */
    containsCaffeine: string;
    /** Accessible name of the mobile filter sheet. */
    filterDialog: string;
    closeFilters: string;
    /** Mobile sheet's apply button; {n} is the number of matching products. */
    showResults: string;
    /** Same, for exactly one product. */
    showResultsOne: string;
    /** Goal filter: label, group name and one label per goal (the values match the products' best-for tags). */
    goal: string;
    goalAria: string;
    goals: { any: string; focus: string; memory: string; energy: string; beginners: string; budget: string };
    /** Price-cap label; {unit} is the monthly unit. */
    maxPerMonth: string;
    /** Grade filter: legend and one label per grade. */
    grade: string;
    grades: { all: string; recommended: string; worthALook: string; skip: string };
    caffeineFreeOnly: string;
    euStorefrontOnly: string;
    showCommission: string;
    /** Note under the commission toggle. */
    commissionNote: string;
    resetAll: string;
    /** Compare card: eyebrow, summary ({n} selected), clear button and row labels. */
    compare: string;
    selectedSummary: string;
    clear: string;
    daily: string;
    caffeine: string;
    /** Value of the caffeine row for a caffeine-free product. */
    caffeineFree: string;
  };
  /** Ingredient index (templates/IngredientLibrary.tsx). */
  ingredientLibrary: {
    /** Default H1 when the page passes none. */
    heading: string;
    /** H1 the region pages pass (/ingredients/); {year} is the current year. */
    guideHeading: string;
    /** Default line under it; {n} is the ingredient count. */
    dek: string;
    /** Accessible name of the grade filter. */
    filterAria: string;
    allGrades: string;
    /** {grade} is A, B or C. */
    grade: string;
    /** Legend card; {n} and {grade}. */
    legendCount: string;
    /** What each grade means. */
    descriptors: { A: string; B: string; C: string };
    /** Empty state; {grade}. */
    empty: string;
    seeAll: string;
    columns: { grade: string; ingredient: string; clinicalDose: string; trials: string; ourTake: string };
    /** Accessible name of a grade badge; {grade}. */
    gradeAria: string;
    /** Accessible name of the study-count sparkline; {name} and {counts} (comma-separated). */
    studyCounts: string;
    /** In `counts`, for an effect without a study count. */
    notCounted: string;
    /** Live-region announcements of the filter: {n}, {grade}. */
    showingAll: string;
    showingGrade: string;
    showingGradeOne: string;
  };
  /** Local buyer's-guide pages (JP prefectures, LATAM countries). */
  geo: {
    /** H1; {place} and {year}. */
    bestIn: string;
    /** Picks heading; {place}. */
    topPicksFor: string;
    /** Label before a pick's score. */
    score: string;
  };
  /** Headings of the editorial-standards section on /methodology/ (EditorialStandardsSection). */
  editorialStandards: {
    heading: string;
    reviewProtocol: string;
    conflictOfInterest: string;
    sourceCitation: string;
    correction: string;
    teamIdentity: string;
    regionalFraming: string;
    contact: string;
  };
  /** Shortlist toggle (templates/ShortlistButton.tsx). */
  shortlist: {
    save: string;
    saved: string;
    saveAria: string;
    removeAria: string;
  };
  /**
   * How the templates join translated pieces in this language. Japanese
   * punctuation (。、：) carries its own spacing, so ja adds no space; French
   * puts a no-break space before a colon.
   */
  typography: {
    /** Between a bare label and its value ("Price: $69"; ja "価格：$69"; fr "Prix : 69 $"). */
    colon: string;
    /** Between a sentence, or a label that ends in its own punctuation, and what follows it (a value, link, button or count). Empty in ja. */
    space: string;
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
    buildMyStack: 'Build my stack',
    drawerLabel: 'Primary navigation',
    sidebar: {
      browse: 'Browse',
      discover: 'Discover',
      allProducts: 'All products',
      bestOf2026: 'Best of 2026',
      ingredients: 'Ingredients',
      tools: 'Tools',
      comparator: 'Comparator',
      doseCalculator: 'Dose calculator',
      myShortlist: 'My shortlist',
      about: 'About',
      ourMethodology: 'Our methodology',
      disclosures: 'Disclosures',
      submitTip: 'Submit a tip →',
    },
    productCount: '{n} products',
    ingredientCount: '{n} ingredients',
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
    neutralBadge: 'Disclosure',
    inline: 'We earn a commission if you buy through links on this page, at no extra cost to you.',
    noCommission: "We don't earn a commission on this product; we have no affiliate deal for it.",
    siteWide: 'Some pages on this site contain affiliate links; we may earn a commission when you buy through them.',
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
    ascending: 'ascending',
    descending: 'descending',
    sortAria: 'Sort by {column}',
    sortAriaActive: 'Sort by {column}, currently {direction}',
    sortColumns: { score: 'score', price: 'price', moneyBack: 'money-back days', trustpilot: 'Trustpilot score' },
    editorChoice: "Editor's Choice",
    euStorefront: 'EU Storefront',
    maxPrice: 'Max {price}',
    actions: 'Actions',
    scoreAria: 'Score {score} out of 10 — tap or hover for breakdown',
    scoreBreakdown: 'Score breakdown',
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
    palette: {
      dialogLabel: 'Site search',
      placeholder: 'Search products, ingredients, comparisons, guides…',
      resultsLabel: 'Search results',
      recentLabel: 'Recent and trending',
      noResults: 'No results for “{query}”',
      emptyPrompt: 'Type to search products, ingredients, comparisons, or guides.',
      recent: 'Recent',
      categories: { ingredients: 'Ingredients', products: 'Products', comparisons: 'Comparisons', guides: 'Guides', other: 'Other' },
      hints: { navigate: 'navigate', open: 'open', close: 'close' },
      indexed: '{n} indexed',
      scoreAria: ', score {score} out of 10',
      gradeAria: ', evidence grade {grade}',
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
    relatedCategory: {
      adaptogen: 'adaptogen',
      cholinergic: 'cholinergic',
      mushroom: 'mushroom',
      amino: 'amino',
      herb: 'herb',
      vitamin: 'vitamin',
    },
    humanTrialsOnly: 'Based on human clinical trials only. Animal and in-vitro data excluded.',
    evidenceStrength: { strong: 'strong', moderate: 'moderate', preliminary: 'preliminary', mixed: 'mixed' },
    evidenceKey: {
      label: 'Evidence key:',
      strong: 'Strong = multiple consistent RCTs',
      moderate: 'Moderate = smaller/fewer RCTs',
      preliminary: 'Preliminary = early trials or small n',
      mixed: 'Mixed = conflicting results',
    },
    howToLabels: { dosage: 'Dosage', timing: 'Timing', withFood: 'With food', cycling: 'Cycling', forms: 'Forms' },
    topStacks: 'Top stacks containing {name}',
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
      productDescriptorByForm: { capsule: 'daily nootropic capsule', tablet: 'daily nootropic tablet', sachet: 'daily nootropic sachet', shot: 'daily nootropic shot', powder: 'daily nootropic drink powder', softgel: 'daily nootropic softgel', can: 'daily nootropic drink' },
      updated: 'Updated:',
      lastVerified: 'Last verified:',
      reviewedBy: 'Reviewed by The Nootropic Lab editorial team',
    },
    dateLocale: 'en-US',
    score: {
      label: 'Our score',
      outOf10: 'of 10.0',
      aria: 'Score {score} out of {max}',
    },
    stats: {
      price: 'Price',
      monthUnit: 'mo',
      perServingUnit: 'serving',
      perDayUnit: 'day',
      perServingLabel: 'Per serving',
      perDayLabel: 'Per day',
      capsules: 'Caps',
      dailyServing: 'Daily serving',
      units: { capsule: 'caps', tablet: 'tablets', sachet: 'sachets', shot: 'shots', powder: 'scoops', softgel: 'softgels', can: 'cans' },
      unitsSingular: { capsule: 'cap', tablet: 'tablet', sachet: 'sachet', shot: 'shot', powder: 'scoop', softgel: 'softgel', can: 'can' },
      moneyBack: 'MBG',
      days: 'days',
      daysCount: '{days} days',
      daysCountShort: '{days}d',
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
    breadcrumbBestOf: 'Best of',
    overview: {
      verdictEyebrow: 'Verdict',
      verdict: { good: '{product} is recommended.', warn: '{product} is worth a look.', bad: '{product} falls short.' },
      whatItDoes: 'What it does',
      howItWorks: 'How it works',
      whatToExpect: 'What to expect',
      heroIngredients: 'Hero ingredients',
      whoItsFor: "Who it's for",
      whoShouldSkip: 'Who should skip',
    },
    reviews: {
      noProfileHeading: 'No Trustpilot profile',
      noProfileBody: "{brand} doesn't have an active Trustpilot listing — this is common for Amazon-only sellers, marketplace brands, and regional pharmacy chains.",
      noProfileTrust: 'The Trust pillar in our editorial score still applies and reflects brand reputation, third-party testing, and refund track record.',
      starsAria: '{score} out of 5 stars',
      countOnTrustpilot: '{count} reviews on Trustpilot',
      verifiedCount: '{count} verified reviews',
      noCherryPicking: "We don't embed cherry-picked quotes here. Trustpilot is the canonical source — the score above feeds into our Trust pillar.",
      readAll: 'Read all {count} reviews on Trustpilot →',
    },
    regionalBuying: {
      heading: {
        us: 'Buying in the United States',
        eu: 'Buying in the EU',
        ca: 'Buying in Canada',
        au: 'Buying in Australia',
        jp: 'Buying in Japan',
        latam: 'Buying in Latin America',
        gcc: 'Buying in the Gulf',
        sea: 'Buying in Southeast Asia',
      },
      price: 'Local price',
      monthUnit: 'month',
      status: 'Status',
      whereToBuy: 'Where to buy',
      importPathway: 'Import pathway',
      regulator: {
        us: 'FDA (DSHEA dietary supplement)',
        eu: 'EU food supplement (Reg. 1924/2006 claims)',
        ca: 'Health Canada (NPN)',
        au: 'TGA (AUST L)',
        jp: 'Consumer Affairs Agency (FFC)',
        latam: 'ANVISA / COFEPRIS / INVIMA',
        gcc: 'SFDA / Dubai Municipality',
        sea: 'HSA / NPRA / BPOM / FDA PH / Thai FDA',
      },
      geoHub: {
        us: 'Best nootropics in the US',
        eu: 'Country guides',
        ca: 'Province guides',
        au: 'State & territory guides',
        jp: 'Prefecture guides',
        latam: 'Country guides',
        gcc: 'Country guides',
        sea: 'Country guides',
      },
      licence: {
        npnNumber: 'NPN {npn}',
        npnLicensed: 'NPN licensed',
        noNpn: 'No NPN found',
        noNpnChecked: 'No NPN found (checked {date})',
        austl: 'AUST L {austl}',
        personalImportation: 'Personal Importation Scheme',
        ffcNumber: 'FFC 届出 {number}',
        ffcNotified: 'FFC notified',
        noFfc: 'No FFC notification on file',
        noFfcChecked: 'No FFC notification found (checked {date})',
        euStorefront: 'EU storefront',
        halalCertified: 'Halal certified',
        noHalal: 'No halal certificate shown by the brand',
        noHalalChecked: 'No halal certificate shown by the brand (checked {date})',
      },
    },
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
      short: { ingredients: 'ingredients', dosing: 'dosing', transparency: 'transparency', value: 'value', trust: 'trust' },
      shortScoreAria: '{name} {pillar} score',
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
    minRead: '{minutes} min read',
    indexHeading: 'Nootropics Guides {year}',
    readGuide: 'Read guide →',
    backToGuides: '← Back to Guides',
    categories: { beginner: 'Beginner', stacking: 'Stacking', usage: 'Usage', science: 'Science' },
  },
  byline: {
    attribution: 'By The Nootropic Lab editorial team',
    factChecked: '✓ Fact-checked',
    updated: 'Updated',
    readTime: '{minutes} min read',
  },
  listicle: {
    bestNootropics: 'Best Nootropics',
    healthDisclaimer: 'Health disclaimer',
    defaultHealthDisclaimer:
      'This page is for educational purposes only and is not medical advice. Nootropic supplements are not approved by the FDA to diagnose, treat, cure, or prevent any disease, including ADHD or other cognitive conditions. They are not equivalent to prescription stimulants. Always consult a qualified healthcare professional before starting any supplement regimen, especially if you take medication or have a medical condition.',
    whatEvidenceSays: 'What the evidence actually says',
    evidenceIntro:
      'For each ingredient below, we link directly to the peer-reviewed source. Ingredient mechanism is not the same as product efficacy — a product can include the right ingredient at the wrong dose.',
    sourceLink: 'Source →',
    ourPicksFor: 'Our picks for {useCase}',
    picksIntro: 'Ranked by how well each product matches the evidence above + our 5-pillar editorial audit.',
    topPick: 'Top pick',
    whyItsHere: "Why it's here:",
    checkProduct: 'Check {name} →',
    readFullReview: 'Read full review',
    faqHeading: 'Frequently asked questions',
    howWeChoose: 'How we choose',
    howWeChooseBody:
      'Every pick must (a) include at least one ingredient with peer-reviewed evidence for the use case, (b) dose that ingredient at or near the clinical-trial dose, and (c) score ≥ {minScore}/10 in our 5-pillar editorial audit. Read our {link}.',
    fullMethodology: 'full methodology',
    backToBest: '← Back to Best Nootropics {year}',
    alsoConsideredHeading: 'Also considered — below our {minScore} bar',
    alsoConsideredIntro:
      'Products audited for this guide that score below the {minScore}/10 a ranked pick needs in our 5-pillar editorial audit. Listed for transparency, not ranked or recommended.',
    belowBarReason: 'Scores {score}/10 — below our {minScore} bar',
    alsoConsideredRulesHeading: 'Also considered — not ranked',
    alsoConsideredRulesIntro:
      'Products audited for this guide that we do not rank: each either scores below the {minScore}/10 a ranked pick needs in our 5-pillar editorial audit, or its label does not reach our reference dose for any evidence entry above (for a combination, every ingredient in it). Listed for transparency, not ranked or recommended.',
    doseRuleReason:
      'Scores {score}/10, but its label does not reach our reference dose for any evidence entry above (for a combination, every ingredient in it)',
    alsoConsideredLinkIntro:
      'Products audited for this guide that we do not rank: each either scores below the {minScore}/10 a ranked pick needs in our 5-pillar editorial audit, or its label does not reach our reference dose for any evidence entry above (for a combination, every ingredient in it), or this edition shows no purchase link for it. Listed for transparency, not ranked or recommended.',
    noPurchaseLinkReason: 'Scores {score}/10, but this edition shows no purchase link for it; its review says why',
    alsoConsideredToc: 'Also considered',
    audited: 'Audited',
    useCaseLabels: {},
    moneyBackDays: '{days}d',
    moneyBackLabel: 'MBG',
    ourScore: 'Our score',
    relatedGuides: 'Related guides',
    relatedGuideLabels: {
      focus: 'Best nootropics for focus',
      memory: 'Best nootropics for memory',
      studying: 'Best nootropics for studying',
      aging: 'Best nootropics for aging',
    },
    inThisGuide: 'In this guide',
  },
  bestOf: {
    stats: { audited: 'Audited', recommended: 'Recommended', underdosed: 'Underdosed flagship', avgMonthly: 'Avg / month' },
    subtitle: '{audited} audited · {listed} listed · methodology {version} · refreshed {date}',
    rank: 'Rank',
    commission: 'Commission',
    visit: 'Visit →',
  },
  comparator: {
    heading: 'Comparator',
    matchSummary: '{shown} of {total} match · select up to {max} to compare side-by-side',
    filters: 'Filters',
    saveView: 'Save view',
    linkCopied: 'Link copied to clipboard',
    clipboardError: 'Could not access clipboard',
    gridLabel: 'Products comparison',
    columns: { product: 'Product', score: 'Score', value: 'Value', price: 'Price', trustpilot: 'Trustpilot', bestFor: 'Best for' },
    noMatch: 'No products match.',
    resetFilters: 'Reset filters',
    compareAria: 'Compare {name}',
    view: 'View →',
    viewAria: 'View {name}',
    containsCaffeine: 'caffeine',
    filterDialog: 'Filter products',
    closeFilters: 'Close filters',
    showResults: 'Show {n} products',
    showResultsOne: 'Show {n} product',
    goal: 'Goal',
    goalAria: 'Filter by goal',
    goals: { any: 'Any', focus: 'Focus', memory: 'Memory', energy: 'Energy', beginners: 'Beginners', budget: 'Budget' },
    maxPerMonth: 'Max ≈ per {unit}',
    grade: 'Our grade',
    grades: { all: 'All', recommended: 'Recommended', worthALook: 'Worth a look', skip: 'Skip' },
    caffeineFreeOnly: 'Caffeine-free only',
    euStorefrontOnly: 'EU storefront only',
    showCommission: 'Show our commission',
    commissionNote: "Doesn't change scores",
    resetAll: 'Reset all filters',
    compare: 'Compare',
    selectedSummary: '{n} selected · side by side',
    clear: 'Clear',
    daily: 'Daily',
    caffeine: 'Caffeine',
    caffeineFree: 'Free',
  },
  ingredientLibrary: {
    heading: 'Ingredient library',
    guideHeading: 'Nootropic Ingredients Guide {year}',
    dek: '{n} ingredients · graded on RCT evidence and consistency · plain-English notes',
    filterAria: 'Filter by evidence grade',
    allGrades: 'All grades',
    grade: 'Grade {grade}',
    legendCount: '{n} ingredients · Grade {grade}',
    descriptors: { A: 'Multiple consistent RCTs', B: 'Smaller / fewer RCTs', C: 'Preliminary or mixed' },
    empty: 'No Grade {grade} ingredients in this catalog yet.',
    seeAll: 'See all grades →',
    columns: { grade: 'Grade', ingredient: 'Ingredient', clinicalDose: 'Clinical dose', trials: 'Trials', ourTake: 'Our take' },
    gradeAria: 'Evidence grade {grade}',
    studyCounts: 'Study counts for {name} effects: {counts}',
    notCounted: 'not counted',
    showingAll: 'Showing all {n} ingredients',
    showingGrade: 'Showing {n} grade-{grade} ingredients',
    showingGradeOne: 'Showing {n} grade-{grade} ingredient',
  },
  geo: {
    bestIn: 'Best Nootropics in {place} {year}',
    topPicksFor: 'Top Picks for {place} Buyers',
    score: 'Score:',
  },
  editorialStandards: {
    heading: 'Editorial Standards',
    reviewProtocol: '1. Review protocol',
    conflictOfInterest: '2. Conflict-of-interest policy',
    sourceCitation: '3. Source-citation policy',
    correction: '4. Correction policy',
    teamIdentity: '5. Editorial-team identity',
    regionalFraming: '6. Region-specific regulatory framing',
    contact: 'Editorial contact',
  },
  shortlist: {
    save: 'Save',
    saved: 'Saved',
    saveAria: 'Save to shortlist',
    removeAria: 'Remove from shortlist',
  },
  typography: { colon: ': ', space: ' ' },
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
    buildMyStack: 'Crear mi stack',
    drawerLabel: 'Navegación principal',
    sidebar: {
      browse: 'Explorar',
      discover: 'Descubrir',
      allProducts: 'Todos los productos',
      bestOf2026: 'Lo mejor de 2026',
      ingredients: 'Ingredientes',
      tools: 'Herramientas',
      comparator: 'Comparador',
      doseCalculator: 'Calculadora de dosis',
      myShortlist: 'Mi preselección',
      about: 'Acerca de',
      ourMethodology: 'Nuestra metodología',
      disclosures: 'Divulgaciones',
      submitTip: 'Enviar un dato →',
    },
    productCount: '{n} productos',
    ingredientCount: '{n} ingredientes',
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
    neutralBadge: 'Transparencia',
    inline: 'Ganamos una comisión si compra a través de los enlaces de esta página, sin costo adicional para usted.',
    noCommission: 'No ganamos ninguna comisión por este producto; no tenemos un acuerdo de afiliados para él.',
    siteWide: 'Algunas páginas de este sitio contienen enlaces de afiliados; podemos ganar una comisión si compra a través de ellos.',
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
    ascending: 'ascendente',
    descending: 'descendente',
    sortAria: 'Ordenar por {column}',
    sortAriaActive: 'Ordenar por {column}, orden actual: {direction}',
    sortColumns: {
      score: 'puntuación',
      price: 'precio',
      moneyBack: 'días de garantía de devolución',
      trustpilot: 'puntuación de Trustpilot',
    },
    editorChoice: 'Elección editorial',
    euStorefront: 'Tienda en la UE',
    maxPrice: 'Máx. {price}',
    actions: 'Acciones',
    scoreAria: 'Puntuación {score} de 10 — toca o pasa el cursor para ver el desglose',
    scoreBreakdown: 'Desglose de la puntuación',
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
    palette: {
      dialogLabel: 'Búsqueda en el sitio',
      placeholder: 'Buscar productos, ingredientes, comparativas, guías…',
      resultsLabel: 'Resultados de búsqueda',
      recentLabel: 'Recientes y tendencias',
      noResults: 'No hay resultados para “{query}”',
      emptyPrompt: 'Escriba para buscar productos, ingredientes, comparativas o guías.',
      recent: 'Recientes',
      categories: { ingredients: 'Ingredientes', products: 'Productos', comparisons: 'Comparativas', guides: 'Guías', other: 'Otros' },
      hints: { navigate: 'navegar', open: 'abrir', close: 'cerrar' },
      indexed: '{n} indexados',
      scoreAria: ', puntuación {score} sobre 10',
      gradeAria: ', grado de evidencia {grade}',
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
    relatedCategory: {
      adaptogen: 'adaptógeno',
      cholinergic: 'colinérgico',
      mushroom: 'hongo',
      amino: 'aminoácido',
      herb: 'hierba',
      vitamin: 'vitamina',
    },
    humanTrialsOnly: 'Basado solo en ensayos clínicos en humanos. Se excluyen los datos en animales e in vitro.',
    evidenceStrength: { strong: 'sólida', moderate: 'moderada', preliminary: 'preliminar', mixed: 'mixta' },
    evidenceKey: {
      label: 'Clave de evidencia:',
      strong: 'Sólida = varios ECA consistentes',
      moderate: 'Moderada = ECA más pequeños o menos numerosos',
      preliminary: 'Preliminar = ensayos iniciales o n pequeño',
      mixed: 'Mixta = resultados contradictorios',
    },
    howToLabels: { dosage: 'Dosis', timing: 'Momento', withFood: 'Con comida', cycling: 'Ciclos', forms: 'Formas' },
    topStacks: 'Principales stacks que contienen {name}',
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
      productDescriptorByForm: { capsule: 'cápsula nootrópica diaria', tablet: 'comprimido nootrópico diario', sachet: 'sobre nootrópico diario', shot: 'shot nootrópico diario', powder: 'polvo nootrópico para beber', softgel: 'cápsula blanda nootrópica diaria', can: 'bebida nootrópica diaria' },
      updated: 'Actualizado:',
      lastVerified: 'Última verificación:',
      reviewedBy: 'Revisado por el equipo editorial de The Nootropic Lab',
    },
    dateLocale: 'es-419',
    score: {
      label: 'Nuestra puntuación',
      outOf10: 'sobre 10,0',
      aria: 'Puntuación {score} de {max}',
    },
    stats: {
      price: 'Precio',
      monthUnit: 'mes',
      perServingUnit: 'dosis',
      perDayUnit: 'día',
      perServingLabel: 'Por dosis',
      perDayLabel: 'Por día',
      capsules: 'Cáps.',
      dailyServing: 'Dosis diaria',
      units: { capsule: 'cáps.', tablet: 'comprimidos', sachet: 'sobres', shot: 'shots', powder: 'cacitos', softgel: 'cápsulas blandas', can: 'latas' },
      unitsSingular: { capsule: 'cáp.', tablet: 'comprimido', sachet: 'sobre', shot: 'shot', powder: 'cacito', softgel: 'cápsula blanda', can: 'lata' },
      moneyBack: 'Garantía',
      days: 'días',
      daysCount: '{days} días',
      daysCountShort: '{days} d',
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
    breadcrumbBestOf: 'Lo mejor',
    overview: {
      verdictEyebrow: 'Veredicto',
      verdict: { good: '{product} es recomendable.', warn: '{product} merece un vistazo.', bad: '{product} se queda corto.' },
      whatItDoes: 'Qué hace',
      howItWorks: 'Cómo funciona',
      whatToExpect: 'Qué esperar',
      heroIngredients: 'Ingredientes principales',
      whoItsFor: 'Para quién es',
      whoShouldSkip: 'Quién debería evitarlo',
    },
    reviews: {
      noProfileHeading: 'Sin perfil en Trustpilot',
      noProfileBody: '{brand} no tiene una ficha activa en Trustpilot; esto es habitual en vendedores que solo venden en Amazon, marcas de marketplace y cadenas de farmacias regionales.',
      noProfileTrust: 'El pilar de confianza de nuestra puntuación editorial se sigue aplicando y refleja la reputación de la marca, las pruebas de terceros y el historial de reembolsos.',
      starsAria: '{score} de 5 estrellas',
      countOnTrustpilot: '{count} opiniones en Trustpilot',
      verifiedCount: '{count} opiniones verificadas',
      noCherryPicking: 'Aquí no incluimos citas elegidas a conveniencia. Trustpilot es la fuente de referencia: la puntuación de arriba alimenta nuestro pilar de confianza.',
      readAll: 'Leer las {count} opiniones en Trustpilot →',
    },
    regionalBuying: {
      heading: {
        us: 'Comprar en Estados Unidos',
        eu: 'Comprar en la UE',
        ca: 'Comprar en Canadá',
        au: 'Comprar en Australia',
        jp: 'Comprar en Japón',
        latam: 'Comprar en América Latina',
        gcc: 'Comprar en el Golfo',
        sea: 'Comprar en el Sudeste Asiático',
      },
      price: 'Precio local',
      monthUnit: 'mes',
      status: 'Estado',
      whereToBuy: 'Dónde comprar',
      importPathway: 'Vía de importación',
      regulator: {
        us: 'FDA (suplemento dietético según la DSHEA)',
        eu: 'Complemento alimenticio en la UE (declaraciones según el Reg. 1924/2006)',
        ca: 'Health Canada (NPN)',
        au: 'TGA (AUST L)',
        jp: 'Agencia de Asuntos del Consumidor (FFC)',
        latam: 'ANVISA / COFEPRIS / INVIMA',
        gcc: 'SFDA / Municipalidad de Dubái',
        sea: 'HSA / NPRA / BPOM / FDA PH / FDA de Tailandia',
      },
      geoHub: {
        us: 'Los mejores nootrópicos en EE. UU.',
        eu: 'Guías por país',
        ca: 'Guías por provincia',
        au: 'Guías por estado y territorio',
        jp: 'Guías por prefectura',
        latam: 'Guías por país',
        gcc: 'Guías por país',
        sea: 'Guías por país',
      },
      licence: {
        npnNumber: 'NPN {npn}',
        npnLicensed: 'Con licencia NPN',
        noNpn: 'No se encontró NPN',
        noNpnChecked: 'No se encontró NPN (consultado el {date})',
        austl: 'AUST L {austl}',
        personalImportation: 'Régimen de importación personal',
        ffcNumber: 'Notificación FFC {number}',
        ffcNotified: 'Notificado como FFC',
        noFfc: 'Sin notificación FFC registrada',
        noFfcChecked: 'No se encontró notificación FFC (consultado el {date})',
        euStorefront: 'Tienda en la UE',
        halalCertified: 'Certificado halal',
        noHalal: 'La marca no muestra ningún certificado halal',
        noHalalChecked: 'La marca no muestra ningún certificado halal (consultado el {date})',
      },
    },
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
      short: { ingredients: 'ingredientes', dosing: 'dosis', transparency: 'transparencia', value: 'valor', trust: 'confianza' },
      shortScoreAria: 'Puntuación de {pillar} de {name}',
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
    minRead: '{minutes} min de lectura',
    indexHeading: 'Guías de Nootrópicos {year}',
    readGuide: 'Leer guía →',
    backToGuides: '← Volver a las Guías',
    categories: { beginner: 'Principiante', stacking: 'Combinación', usage: 'Uso', science: 'Ciencia' },
  },
  byline: {
    attribution: 'Por el equipo editorial de The Nootropic Lab',
    factChecked: '✓ Datos verificados',
    updated: 'Actualizado',
    readTime: '{minutes} min de lectura',
  },
  listicle: {
    bestNootropics: 'Mejores Nootrópicos',
    healthDisclaimer: 'Aviso de salud',
    defaultHealthDisclaimer:
      'Esta página es solo con fines educativos y no constituye consejo médico. Los suplementos nootrópicos no están aprobados por la FDA para diagnosticar, tratar, curar o prevenir ninguna enfermedad, incluido el TDAH u otras condiciones cognitivas. No son equivalentes a los estimulantes recetados. Consulte siempre a un profesional de la salud calificado antes de comenzar cualquier régimen de suplementos.',
    whatEvidenceSays: 'Lo que dice realmente la evidencia',
    evidenceIntro:
      'Para cada ingrediente a continuación, enlazamos directamente a la fuente revisada por expertos. El mecanismo del ingrediente no es lo mismo que la eficacia del producto — un producto puede incluir el ingrediente correcto en la dosis incorrecta.',
    sourceLink: 'Fuente →',
    ourPicksFor: 'Nuestras selecciones para {useCase}',
    picksIntro:
      'Clasificadas según qué tan bien cada producto coincide con la evidencia anterior + nuestra auditoría editorial de 5 pilares.',
    topPick: 'Mejor opción',
    whyItsHere: '¿Por qué está aquí?',
    checkProduct: 'Ver {name} →',
    readFullReview: 'Leer reseña completa',
    faqHeading: 'Preguntas frecuentes',
    howWeChoose: 'Cómo elegimos',
    howWeChooseBody:
      'Cada selección debe (a) incluir al menos un ingrediente con evidencia revisada por expertos para el caso de uso, (b) dosificar ese ingrediente en o cerca de la dosis del ensayo clínico, y (c) obtener una puntuación ≥ {minScore}/10 en nuestra auditoría editorial de 5 pilares. Lea nuestra {link}.',
    fullMethodology: 'metodología completa',
    backToBest: '← Volver a Mejores Nootrópicos {year}',
    alsoConsideredHeading: 'También evaluados — por debajo de nuestro umbral de {minScore}',
    alsoConsideredIntro:
      'Productos auditados para esta guía cuya puntuación queda por debajo del {minScore}/10 que necesita una selección clasificada en nuestra auditoría editorial de 5 pilares. Se incluyen por transparencia; no están clasificados ni recomendados.',
    belowBarReason: 'Puntuación de {score}/10 — por debajo de nuestro umbral de {minScore}',
    alsoConsideredRulesHeading: 'También evaluados — sin clasificar',
    alsoConsideredRulesIntro:
      'Productos auditados para esta guía que no clasificamos: cada uno obtiene una puntuación por debajo del {minScore}/10 que necesita una selección clasificada en nuestra auditoría editorial de 5 pilares, o su etiqueta no alcanza nuestra dosis de referencia en ninguna de las entradas de evidencia anteriores (en una combinación, en cada uno de sus ingredientes). Se incluyen por transparencia; no están clasificados ni recomendados.',
    doseRuleReason:
      'Puntuación de {score}/10, pero su etiqueta no alcanza nuestra dosis de referencia en ninguna de las entradas de evidencia anteriores (en una combinación, en cada uno de sus ingredientes)',
    alsoConsideredLinkIntro:
      'Productos auditados para esta guía que no clasificamos: cada uno obtiene una puntuación por debajo del {minScore}/10 que necesita una selección clasificada en nuestra auditoría editorial de 5 pilares, o su etiqueta no alcanza nuestra dosis de referencia en ninguna de las entradas de evidencia anteriores (en una combinación, en cada uno de sus ingredientes), o esta edición no muestra enlace de compra para él. Se incluyen por transparencia; no están clasificados ni recomendados.',
    noPurchaseLinkReason: 'Puntuación de {score}/10, pero esta edición no muestra enlace de compra para este producto; su reseña explica por qué',
    alsoConsideredToc: 'También evaluados',
    audited: 'Auditado',
    useCaseLabels: {
      focus: 'la concentración',
      memory: 'la memoria',
      studying: 'estudiar',
      aging: 'el cerebro adulto mayor',
    },
    moneyBackDays: '{days} días',
    moneyBackLabel: 'de garantía',
    ourScore: 'Nuestra puntuación',
    relatedGuides: 'Guías relacionadas',
    relatedGuideLabels: {
      focus: 'Mejores nootrópicos para la concentración',
      memory: 'Mejores nootrópicos para la memoria',
      studying: 'Mejores nootrópicos para estudiar',
      aging: 'Mejores nootrópicos para el cerebro adulto mayor',
    },
    inThisGuide: 'En esta guía',
  },
  bestOf: {
    stats: { audited: 'Auditados', recommended: 'Recomendados', underdosed: 'Producto estrella subdosificado', avgMonthly: 'Prom. / mes' },
    subtitle: '{audited} auditados · {listed} listados · metodología {version} · actualizado el {date}',
    rank: 'Puesto',
    commission: 'Comisión',
    visit: 'Visitar →',
  },
  comparator: {
    heading: 'Comparador',
    matchSummary: '{shown} de {total} coinciden · selecciona hasta {max} para comparar lado a lado',
    filters: 'Filtros',
    saveView: 'Guardar vista',
    linkCopied: 'Enlace copiado al portapapeles',
    clipboardError: 'No se pudo acceder al portapapeles',
    gridLabel: 'Comparación de productos',
    columns: { product: 'Producto', score: 'Puntuación', value: 'Valor', price: 'Precio', trustpilot: 'Trustpilot', bestFor: 'Ideal para' },
    noMatch: 'Ningún producto coincide.',
    resetFilters: 'Restablecer filtros',
    compareAria: 'Comparar {name}',
    view: 'Ver →',
    viewAria: 'Ver {name}',
    containsCaffeine: 'con cafeína',
    filterDialog: 'Filtrar productos',
    closeFilters: 'Cerrar filtros',
    showResults: 'Mostrar {n} productos',
    showResultsOne: 'Mostrar {n} producto',
    goal: 'Objetivo',
    goalAria: 'Filtrar por objetivo',
    goals: { any: 'Cualquiera', focus: 'Concentración', memory: 'Memoria', energy: 'Energía', beginners: 'Principiantes', budget: 'Económico' },
    maxPerMonth: 'Máx. ≈ por {unit}',
    grade: 'Nuestra calificación',
    grades: { all: 'Todas', recommended: 'Recomendado', worthALook: 'Vale la pena mirarlo', skip: 'Descartar' },
    caffeineFreeOnly: 'Solo sin cafeína',
    euStorefrontOnly: 'Solo con tienda en la UE',
    showCommission: 'Mostrar nuestra comisión',
    commissionNote: 'No cambia las puntuaciones',
    resetAll: 'Restablecer todos los filtros',
    compare: 'Comparar',
    selectedSummary: '{n} seleccionados · lado a lado',
    clear: 'Borrar',
    daily: 'Diario',
    caffeine: 'Cafeína',
    caffeineFree: 'Sin cafeína',
  },
  ingredientLibrary: {
    heading: 'Biblioteca de ingredientes',
    guideHeading: 'Guía de ingredientes nootrópicos {year}',
    dek: '{n} ingredientes · calificados según la evidencia de ECA y su consistencia · notas en lenguaje sencillo',
    filterAria: 'Filtrar por grado de evidencia',
    allGrades: 'Todos los grados',
    grade: 'Grado {grade}',
    legendCount: '{n} ingredientes · Grado {grade}',
    descriptors: { A: 'Varios ECA consistentes', B: 'ECA más pequeños o menos numerosos', C: 'Preliminar o mixta' },
    empty: 'Todavía no hay ingredientes de grado {grade} en este catálogo.',
    seeAll: 'Ver todos los grados →',
    columns: { grade: 'Grado', ingredient: 'Ingrediente', clinicalDose: 'Dosis clínica', trials: 'Ensayos', ourTake: 'Nuestra opinión' },
    gradeAria: 'Grado de evidencia {grade}',
    studyCounts: 'Número de estudios por efecto de {name}: {counts}',
    notCounted: 'sin contar',
    showingAll: 'Mostrando los {n} ingredientes',
    showingGrade: 'Mostrando {n} ingredientes de grado {grade}',
    showingGradeOne: 'Mostrando {n} ingrediente de grado {grade}',
  },
  geo: {
    bestIn: 'Los Mejores Nootrópicos en {place} {year}',
    topPicksFor: 'Mejores opciones para compradores en {place}',
    score: 'Puntuación:',
  },
  editorialStandards: {
    heading: 'Estándares editoriales',
    reviewProtocol: '1. Protocolo de revisión',
    conflictOfInterest: '2. Política de conflictos de interés',
    sourceCitation: '3. Política de citación de fuentes',
    correction: '4. Política de correcciones',
    teamIdentity: '5. Identidad del equipo editorial',
    regionalFraming: '6. Marco regulatorio por región',
    contact: 'Contacto editorial',
  },
  shortlist: {
    save: 'Guardar',
    saved: 'Guardado',
    saveAria: 'Añadir a mi preselección',
    removeAria: 'Quitar de mi preselección',
  },
  typography: { colon: ': ', space: ' ' },
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
    buildMyStack: 'Composer mon stack',
    drawerLabel: 'Navigation principale',
    sidebar: {
      browse: 'Parcourir',
      discover: 'Découvrir',
      allProducts: 'Tous les produits',
      bestOf2026: 'Le meilleur de 2026',
      ingredients: 'Ingrédients',
      tools: 'Outils',
      comparator: 'Comparateur',
      doseCalculator: 'Calculateur de dose',
      myShortlist: 'Ma présélection',
      about: 'À propos',
      ourMethodology: 'Notre méthodologie',
      disclosures: 'Divulgations',
      submitTip: 'Nous signaler une info →',
    },
    productCount: '{n} produits',
    ingredientCount: '{n} ingrédients',
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
    neutralBadge: 'Transparence',
    inline: 'Nous touchons une commission si vous achetez via les liens de cette page, sans frais supplémentaires pour vous.',
    noCommission: 'Nous ne touchons aucune commission sur ce produit : nous n’avons aucun accord d’affiliation le concernant.',
    siteWide: 'Certaines pages de ce site contiennent des liens affiliés ; nous pouvons toucher une commission si vous achetez via ces liens.',
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
    ascending: 'croissant',
    descending: 'décroissant',
    sortAria: 'Trier par {column}',
    sortAriaActive: 'Trier par {column}, ordre actuel : {direction}',
    sortColumns: {
      score: 'note',
      price: 'prix',
      moneyBack: 'jours de garantie de remboursement',
      trustpilot: 'note Trustpilot',
    },
    editorChoice: 'Choix de la rédaction',
    euStorefront: 'Boutique UE',
    maxPrice: 'Max. {price}',
    actions: 'Actions',
    scoreAria: 'Note de {score} sur 10 — touchez ou survolez pour voir le détail',
    scoreBreakdown: 'Détail de la note',
  },
  breadcrumb: {
    home: 'Accueil',
    ingredients: 'Ingrédients',
    backToBestNootropics: '← Retour aux Meilleurs Nootropiques',
    backToIngredientsGuide: '← Retour au Guide des Ingrédients',
    ariaLabel: "Fil d'Ariane",
  },
  search: {
    palette: {
      dialogLabel: 'Recherche sur le site',
      placeholder: 'Rechercher des produits, ingrédients, comparatifs, guides…',
      resultsLabel: 'Résultats de recherche',
      recentLabel: 'Récents et tendances',
      noResults: 'Aucun résultat pour « {query} »',
      emptyPrompt: 'Saisissez du texte pour rechercher des produits, ingrédients, comparatifs ou guides.',
      recent: 'Récents',
      categories: { ingredients: 'Ingrédients', products: 'Produits', comparisons: 'Comparatifs', guides: 'Guides', other: 'Autres' },
      hints: { navigate: 'naviguer', open: 'ouvrir', close: 'fermer' },
      indexed: '{n} indexés',
      scoreAria: ', note de {score} sur 10',
      gradeAria: ', niveau de preuve {grade}',
    },
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
    relatedCategory: {
      adaptogen: 'adaptogène',
      cholinergic: 'cholinergique',
      mushroom: 'champignon',
      amino: 'acide aminé',
      herb: 'plante',
      vitamin: 'vitamine',
    },
    humanTrialsOnly: 'Fondé uniquement sur des essais cliniques chez l’humain. Données animales et in vitro exclues.',
    evidenceStrength: { strong: 'solides', moderate: 'modérées', preliminary: 'préliminaires', mixed: 'mitigées' },
    evidenceKey: {
      label: 'Légende des données :',
      strong: 'Solides = plusieurs ECR concordants',
      moderate: 'Modérées = ECR plus petits ou moins nombreux',
      preliminary: 'Préliminaires = premiers essais ou petit effectif',
      mixed: 'Mitigées = résultats contradictoires',
    },
    howToLabels: { dosage: 'Posologie', timing: 'Moment', withFood: 'Avec un repas', cycling: 'Cycles', forms: 'Formes' },
    topStacks: 'Meilleurs stacks contenant {name}',
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
      productDescriptorByForm: { capsule: 'capsule nootropique quotidienne', tablet: 'comprimé nootropique quotidien', sachet: 'sachet nootropique quotidien', shot: 'shot nootropique quotidien', powder: 'poudre nootropique à diluer', softgel: 'capsule molle nootropique quotidienne', can: 'boisson nootropique quotidienne' },
      updated: 'Mis à jour :',
      lastVerified: 'Dernière vérification :',
      reviewedBy: "Évalué par l'équipe éditoriale de The Nootropic Lab",
    },
    dateLocale: 'fr-FR',
    score: {
      label: 'Notre note',
      outOf10: 'sur 10,0',
      aria: 'Note de {score} sur {max}',
    },
    stats: {
      price: 'Prix',
      monthUnit: 'mois',
      perServingUnit: 'dose',
      perDayUnit: 'jour',
      perServingLabel: 'Par dose',
      perDayLabel: 'Par jour',
      capsules: 'Caps.',
      dailyServing: 'Dose quotidienne',
      units: { capsule: 'gélules', tablet: 'comprimés', sachet: 'sachets', shot: 'shots', powder: 'doses', softgel: 'capsules molles', can: 'canettes' },
      unitsSingular: { capsule: 'gélule', tablet: 'comprimé', sachet: 'sachet', shot: 'shot', powder: 'dose', softgel: 'capsule molle', can: 'canette' },
      moneyBack: 'Garantie',
      days: 'jours',
      daysCount: '{days} jours',
      daysCountShort: '{days} j',
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
    breadcrumbBestOf: 'Le meilleur',
    overview: {
      verdictEyebrow: 'Verdict',
      verdict: { good: '{product} est recommandé.', warn: '{product} vaut le coup d’œil.', bad: '{product} n’est pas à la hauteur.' },
      whatItDoes: 'Ce qu’il fait',
      howItWorks: 'Comment il agit',
      whatToExpect: 'À quoi s’attendre',
      heroIngredients: 'Ingrédients phares',
      whoItsFor: 'Pour qui',
      whoShouldSkip: 'Qui devrait s’en passer',
    },
    reviews: {
      noProfileHeading: 'Aucun profil Trustpilot',
      noProfileBody: '{brand} n’a pas de fiche Trustpilot active — c’est courant pour les vendeurs présents uniquement sur Amazon, les marques de places de marché et les chaînes de pharmacies régionales.',
      noProfileTrust: 'Le pilier Confiance de notre note éditoriale s’applique toujours et reflète la réputation de la marque, les tests par des tiers et l’historique des remboursements.',
      starsAria: '{score} étoiles sur 5',
      countOnTrustpilot: '{count} avis sur Trustpilot',
      verifiedCount: '{count} avis vérifiés',
      noCherryPicking: 'Nous n’intégrons pas ici de citations triées sur le volet. Trustpilot est la source de référence — la note ci-dessus alimente notre pilier Confiance.',
      readAll: 'Lire les {count} avis sur Trustpilot →',
    },
    regionalBuying: {
      heading: {
        us: 'Acheter aux États-Unis',
        eu: 'Acheter dans l’UE',
        ca: 'Acheter au Canada',
        au: 'Acheter en Australie',
        jp: 'Acheter au Japon',
        latam: 'Acheter en Amérique latine',
        gcc: 'Acheter dans le Golfe',
        sea: 'Acheter en Asie du Sud-Est',
      },
      price: 'Prix local',
      monthUnit: 'mois',
      status: 'Statut',
      whereToBuy: 'Où acheter',
      importPathway: 'Voie d’importation',
      regulator: {
        us: 'FDA (complément alimentaire au sens de la DSHEA)',
        eu: 'Complément alimentaire dans l’UE (allégations selon le règl. 1924/2006)',
        ca: 'Santé Canada (NPN)',
        au: 'TGA (AUST L)',
        jp: 'Agence de la consommation (FFC)',
        latam: 'ANVISA / COFEPRIS / INVIMA',
        gcc: 'SFDA / Municipalité de Dubaï',
        sea: 'HSA / NPRA / BPOM / FDA PH / FDA thaïlandaise',
      },
      geoHub: {
        us: 'Les meilleurs nootropiques aux États-Unis',
        eu: 'Guides par pays',
        ca: 'Guides par province',
        au: 'Guides par État et territoire',
        jp: 'Guides par préfecture',
        latam: 'Guides par pays',
        gcc: 'Guides par pays',
        sea: 'Guides par pays',
      },
      licence: {
        npnNumber: 'NPN {npn}',
        npnLicensed: 'Titulaire d’une licence NPN',
        noNpn: 'Aucun NPN trouvé',
        noNpnChecked: 'Aucun NPN trouvé (vérifié le {date})',
        austl: 'AUST L {austl}',
        personalImportation: 'Régime d’importation personnelle',
        ffcNumber: 'Notification FFC {number}',
        ffcNotified: 'Notifié FFC',
        noFfc: 'Aucune notification FFC enregistrée',
        noFfcChecked: 'Aucune notification FFC trouvée (vérifié le {date})',
        euStorefront: 'Boutique dans l’UE',
        halalCertified: 'Certifié halal',
        noHalal: 'Aucun certificat halal présenté par la marque',
        noHalalChecked: 'Aucun certificat halal présenté par la marque (vérifié le {date})',
      },
    },
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
      short: { ingredients: 'ingrédients', dosing: 'dosage', transparency: 'transparence', value: 'valeur', trust: 'confiance' },
      shortScoreAria: 'Note {pillar} de {name}',
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
    minRead: '{minutes} min de lecture',
    indexHeading: 'Guides sur les nootropiques {year}',
    readGuide: 'Lire le guide →',
    backToGuides: '← Retour aux guides',
    categories: { beginner: 'Débutant', stacking: 'Combinaisons', usage: 'Utilisation', science: 'Sciences' },
  },
  byline: {
    attribution: 'Par l’équipe éditoriale de The Nootropic Lab',
    factChecked: '✓ Vérifié',
    updated: 'Mis à jour le',
    readTime: '{minutes} min de lecture',
  },
  listicle: {
    bestNootropics: 'Meilleurs nootropiques',
    healthDisclaimer: 'Avertissement santé',
    defaultHealthDisclaimer:
      'Cette page est fournie à titre informatif uniquement et ne constitue pas un avis médical. Les compléments nootropiques ne sont pas approuvés par la FDA pour diagnostiquer, traiter, guérir ou prévenir une maladie, y compris le TDAH ou d’autres troubles cognitifs. Ils ne sont pas équivalents aux stimulants sur ordonnance. Consultez toujours un professionnel de santé qualifié avant de commencer un complément, en particulier si vous prenez des médicaments ou avez un problème de santé.',
    whatEvidenceSays: 'Ce que disent vraiment les données',
    evidenceIntro:
      'Pour chaque ingrédient ci-dessous, nous renvoyons directement à la source évaluée par des pairs. Le mécanisme d’un ingrédient n’est pas l’efficacité d’un produit — un produit peut contenir le bon ingrédient à la mauvaise dose.',
    sourceLink: 'Voir la source →',
    ourPicksFor: 'Notre sélection pour {useCase}',
    picksIntro: 'Classés selon leur adéquation avec les données ci-dessus + notre audit éditorial en 5 piliers.',
    topPick: 'Meilleur choix',
    whyItsHere: 'Pourquoi il figure ici :',
    checkProduct: 'Voir {name} →',
    readFullReview: 'Lire l’avis complet',
    faqHeading: 'Questions fréquentes',
    howWeChoose: 'Notre méthode de sélection',
    howWeChooseBody:
      'Chaque choix doit (a) contenir au moins un ingrédient appuyé par des données évaluées par des pairs pour cet usage, (b) doser cet ingrédient à la dose des essais cliniques ou à une dose proche, et (c) obtenir une note ≥ {minScore}/10 dans notre audit éditorial en 5 piliers. Lisez notre {link}.',
    fullMethodology: 'méthodologie complète',
    backToBest: '← Retour aux meilleurs nootropiques {year}',
    alsoConsideredHeading: 'Également examinés — sous notre seuil de {minScore}',
    alsoConsideredIntro:
      'Produits audités pour ce guide dont la note est inférieure au {minScore}/10 requis pour un choix classé dans notre audit éditorial en 5 piliers. Présentés par transparence ; ni classés ni recommandés.',
    belowBarReason: 'Note de {score}/10 — sous notre seuil de {minScore}',
    alsoConsideredRulesHeading: 'Également examinés — non classés',
    alsoConsideredRulesIntro:
      'Produits audités pour ce guide que nous ne classons pas : chacun obtient une note inférieure au {minScore}/10 requis pour un choix classé dans notre audit éditorial en 5 piliers, ou son étiquette n’atteint notre dose de référence pour aucune des entrées de données ci-dessus (pour une combinaison, pour chacun de ses ingrédients). Présentés par transparence ; ni classés ni recommandés.',
    doseRuleReason:
      'Note de {score}/10, mais son étiquette n’atteint notre dose de référence pour aucune des entrées de données ci-dessus (pour une combinaison, pour chacun de ses ingrédients)',
    alsoConsideredLinkIntro:
      'Produits audités pour ce guide que nous ne classons pas : chacun obtient une note inférieure au {minScore}/10 requis pour un choix classé dans notre audit éditorial en 5 piliers, ou son étiquette n’atteint notre dose de référence pour aucune des entrées de données ci-dessus (pour une combinaison, pour chacun de ses ingrédients), ou cette édition n’affiche aucun lien d’achat pour lui. Présentés par transparence ; ni classés ni recommandés.',
    noPurchaseLinkReason: 'Note de {score}/10, mais cette édition n’affiche aucun lien d’achat pour ce produit ; son avis explique pourquoi',
    alsoConsideredToc: 'Également examinés',
    audited: 'Audité',
    useCaseLabels: {
      focus: 'la concentration',
      memory: 'la mémoire',
      studying: 'les études',
      aging: 'le vieillissement',
    },
    moneyBackDays: '{days} j',
    moneyBackLabel: 'de garantie',
    ourScore: 'Notre note',
    relatedGuides: 'Guides associés',
    relatedGuideLabels: {
      focus: 'Meilleurs nootropiques pour la concentration',
      memory: 'Meilleurs nootropiques pour la mémoire',
      studying: 'Meilleurs nootropiques pour les études',
      aging: 'Meilleurs nootropiques pour le vieillissement',
    },
    inThisGuide: 'Dans ce guide',
  },
  bestOf: {
    stats: { audited: 'Audités', recommended: 'Recommandés', underdosed: 'Produit phare sous-dosé', avgMonthly: 'Moy. / mois' },
    subtitle: '{audited} audités · {listed} listés · méthodologie {version} · mis à jour le {date}',
    rank: 'Rang',
    commission: 'Commission',
    visit: 'Visiter →',
  },
  comparator: {
    heading: 'Comparateur',
    matchSummary: '{shown} sur {total} correspondent · sélectionnez jusqu’à {max} produits pour les comparer côte à côte',
    filters: 'Filtres',
    saveView: 'Enregistrer la vue',
    linkCopied: 'Lien copié dans le presse-papiers',
    clipboardError: 'Impossible d’accéder au presse-papiers',
    gridLabel: 'Comparaison des produits',
    columns: { product: 'Produit', score: 'Note', value: 'Rapport qualité-prix', price: 'Prix', trustpilot: 'Trustpilot', bestFor: 'Idéal pour' },
    noMatch: 'Aucun produit ne correspond.',
    resetFilters: 'Réinitialiser les filtres',
    compareAria: 'Comparer {name}',
    view: 'Voir →',
    viewAria: 'Voir {name}',
    containsCaffeine: 'caféine',
    filterDialog: 'Filtrer les produits',
    closeFilters: 'Fermer les filtres',
    showResults: 'Afficher {n} produits',
    showResultsOne: 'Afficher {n} produit',
    goal: 'Objectif',
    goalAria: 'Filtrer par objectif',
    goals: { any: 'Tous', focus: 'Concentration', memory: 'Mémoire', energy: 'Énergie', beginners: 'Débutants', budget: 'Petit budget' },
    maxPerMonth: 'Max. ≈ par {unit}',
    grade: 'Notre appréciation',
    grades: { all: 'Toutes', recommended: 'Recommandé', worthALook: 'À considérer', skip: 'À éviter' },
    caffeineFreeOnly: 'Sans caféine uniquement',
    euStorefrontOnly: 'Boutique UE uniquement',
    showCommission: 'Afficher notre commission',
    commissionNote: 'Ne modifie pas les notes',
    resetAll: 'Réinitialiser tous les filtres',
    compare: 'Comparer',
    selectedSummary: '{n} sélectionnés · côte à côte',
    clear: 'Effacer',
    daily: 'Par jour',
    caffeine: 'Caféine',
    caffeineFree: 'Sans',
  },
  ingredientLibrary: {
    heading: 'Bibliothèque d’ingrédients',
    guideHeading: 'Guide des ingrédients nootropiques {year}',
    dek: '{n} ingrédients · évalués selon les données des ECR et leur cohérence · notes en langage simple',
    filterAria: 'Filtrer par niveau de preuve',
    allGrades: 'Tous les niveaux',
    grade: 'Niveau {grade}',
    legendCount: '{n} ingrédients · Niveau {grade}',
    descriptors: { A: 'Plusieurs ECR concordants', B: 'ECR plus petits ou moins nombreux', C: 'Préliminaires ou mitigées' },
    empty: 'Aucun ingrédient de niveau {grade} dans ce catalogue pour l’instant.',
    seeAll: 'Voir tous les niveaux →',
    columns: { grade: 'Niveau', ingredient: 'Ingrédient', clinicalDose: 'Dose clinique', trials: 'Essais', ourTake: 'Notre avis' },
    gradeAria: 'Niveau de preuve {grade}',
    studyCounts: 'Nombre d’études par effet pour {name} : {counts}',
    notCounted: 'non compté',
    showingAll: 'Affichage des {n} ingrédients',
    showingGrade: 'Affichage de {n} ingrédients de niveau {grade}',
    showingGradeOne: 'Affichage de {n} ingrédient de niveau {grade}',
  },
  geo: {
    bestIn: 'Meilleurs nootropiques : {place} {year}',
    topPicksFor: 'Meilleurs choix pour les acheteurs : {place}',
    score: 'Note :',
  },
  editorialStandards: {
    heading: 'Normes éditoriales',
    reviewProtocol: '1. Protocole d’évaluation',
    conflictOfInterest: '2. Politique en matière de conflits d’intérêts',
    sourceCitation: '3. Politique de citation des sources',
    correction: '4. Politique de correction',
    teamIdentity: '5. Identité de l’équipe éditoriale',
    regionalFraming: '6. Cadre réglementaire propre à chaque région',
    contact: 'Contact éditorial',
  },
  shortlist: {
    save: 'Enregistrer',
    saved: 'Enregistré',
    saveAria: 'Ajouter à ma présélection',
    removeAria: 'Retirer de ma présélection',
  },
  // No-break space before the colon (French typography).
  typography: { colon: '\u00a0: ', space: ' ' },
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
    buildMyStack: 'マイスタックを作る',
    drawerLabel: 'メインナビゲーション',
    sidebar: {
      browse: '閲覧',
      discover: '発見',
      allProducts: 'すべての製品',
      bestOf2026: '2026年のベスト',
      ingredients: '成分',
      tools: 'ツール',
      comparator: '比較ツール',
      doseCalculator: '用量計算ツール',
      myShortlist: 'マイ候補リスト',
      about: 'サイトについて',
      ourMethodology: '当サイトの評価方法',
      disclosures: '開示事項',
      submitTip: '情報を提供する →',
    },
    productCount: '{n}製品',
    ingredientCount: '{n}成分',
  },
  footer: {
    tagline:
      '各ノートロピクスのラベル記載用量を、当サイトの成分ページの基準用量（ある場合）と照合しています。アフィリエイト報酬はインラインで開示され、評価には影響しません。',
    copyrightLine:
      '© {year} Nootropic Lab · 情報は医学的助言ではありません。サプリメントを開始する前に医師に相談してください。',
    lastAuditLabel: '最終全面監査：',
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
    neutralBadge: '情報開示',
    inline: '本ページのリンクから商品を購入されると、当サイトは紹介料を受け取ります（お客様の追加負担はありません）。',
    noCommission: '当サイトはこの商品についてアフィリエイト契約を結んでおらず、紹介料を受け取っていません。',
    siteWide: '当サイトの一部のページにはアフィリエイトリンクが含まれており、そのリンクから商品を購入されると当サイトが紹介料を受け取る場合があります。',
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
    ascending: '昇順',
    descending: '降順',
    sortAria: '{column}で並べ替え',
    sortAriaActive: '{column}で並べ替え（現在：{direction}）',
    sortColumns: { score: 'スコア', price: '価格', moneyBack: '返金保証の日数', trustpilot: 'Trustpilotスコア' },
    editorChoice: '編集部のおすすめ',
    euStorefront: 'EU向けストア',
    maxPrice: '上限 {price}',
    actions: '操作',
    scoreAria: 'スコア 10点中{score}点 — タップまたはカーソルを合わせると内訳を表示',
    scoreBreakdown: 'スコアの内訳',
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
    palette: {
      dialogLabel: 'サイト内検索',
      placeholder: '製品・成分・比較・ガイドを検索…',
      resultsLabel: '検索結果',
      recentLabel: '最近の項目とトレンド',
      noResults: '「{query}」に一致する結果はありません',
      emptyPrompt: '入力すると製品・成分・比較・ガイドを検索できます。',
      recent: '最近の項目',
      categories: { ingredients: '成分', products: '製品', comparisons: '比較', guides: 'ガイド', other: 'その他' },
      hints: { navigate: '移動', open: '開く', close: '閉じる' },
      indexed: '{n}件を収録',
      scoreAria: '、スコア10点中{score}点',
      gradeAria: '、エビデンス評価{grade}',
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
    relatedCategory: {
      adaptogen: 'アダプトゲン',
      cholinergic: 'コリン作動性',
      mushroom: 'きのこ類',
      amino: 'アミノ酸',
      herb: 'ハーブ',
      vitamin: 'ビタミン',
    },
    humanTrialsOnly: 'ヒトを対象とした臨床試験のみに基づいています。動物実験と試験管内（in vitro）のデータは除外しています。',
    evidenceStrength: { strong: '強い', moderate: '中程度', preliminary: '予備的', mixed: '一貫しない' },
    evidenceKey: {
      label: 'エビデンスの見方：',
      strong: '強い = 結果が一貫した複数のRCT',
      moderate: '中程度 = より小規模または少数のRCT',
      preliminary: '予備的 = 初期の試験または少人数の試験',
      mixed: '一貫しない = 相反する結果',
    },
    howToLabels: { dosage: '用量', timing: 'タイミング', withFood: '食事との関係', cycling: 'サイクル', forms: '剤形' },
    topStacks: '{name}を含む主なスタック',
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
    evidenceReviewed: 'エビデンス確認日：',
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
      productDescriptorByForm: { capsule: '毎日のノートロピクスカプセル', tablet: '毎日のノートロピクス錠剤', sachet: '毎日のノートロピクス分包', shot: '毎日のノートロピクスショット', powder: 'ノートロピクスパウダー', softgel: '毎日のノートロピクスソフトジェル', can: '毎日のノートロピクスドリンク' },
      updated: '更新日：',
      lastVerified: '最終確認日：',
      reviewedBy: 'The Nootropic Lab 編集部による評価',
    },
    dateLocale: 'ja-JP',
    score: {
      label: '当社の評価',
      outOf10: '10.0点満点',
      aria: 'スコア {max}点中{score}点',
    },
    stats: {
      price: '価格',
      monthUnit: '月',
      perServingUnit: '回',
      perDayUnit: '日',
      perServingLabel: '1回あたり',
      perDayLabel: '1日あたり',
      capsules: 'カプセル',
      dailyServing: '1日の目安量',
      units: { capsule: 'カプセル', tablet: '錠', sachet: '包', shot: '本', powder: 'スクープ', softgel: 'ソフトジェル', can: '缶' },
      unitsSingular: { capsule: 'カプセル', tablet: '錠', sachet: '包', shot: '本', powder: 'スクープ', softgel: 'ソフトジェル', can: '缶' },
      moneyBack: '返金保証',
      days: '日間',
      daysCount: '{days}日間',
      daysCountShort: '{days}日',
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
    breadcrumbBestOf: 'ベスト',
    overview: {
      verdictEyebrow: '総評',
      verdict: { good: '{product}はおすすめです。', warn: '{product}は検討する価値があります。', bad: '{product}は基準に届きません。' },
      whatItDoes: 'この製品の働き',
      howItWorks: '作用の仕組み',
      whatToExpect: '期待できること',
      heroIngredients: '主要成分',
      whoItsFor: '向いている人',
      whoShouldSkip: '見送るべき人',
    },
    reviews: {
      noProfileHeading: 'Trustpilotのプロフィールなし',
      noProfileBody: '{brand}には有効なTrustpilotのページがありません。Amazonのみで販売する事業者、マーケットプレイスのブランド、地域の薬局チェーンではよくあることです。',
      noProfileTrust: '当サイトの編集スコアにおける信頼性の柱は引き続き適用され、ブランドの評判、第三者機関による試験、返金対応の実績を反映します。',
      starsAria: '星5つ中{score}',
      countOnTrustpilot: 'Trustpilotのレビュー{count}件',
      verifiedCount: '認証済みレビュー{count}件',
      noCherryPicking: 'ここでは都合のよい口コミだけを選んで掲載することはしません。Trustpilotが正式な情報源であり、上のスコアは当サイトの信頼性の柱に反映されます。',
      readAll: 'Trustpilotで{count}件のレビューをすべて読む →',
    },
    regionalBuying: {
      heading: {
        us: 'アメリカでの購入',
        eu: 'EUでの購入',
        ca: 'カナダでの購入',
        au: 'オーストラリアでの購入',
        jp: '日本での購入',
        latam: 'ラテンアメリカでの購入',
        gcc: '湾岸諸国での購入',
        sea: '東南アジアでの購入',
      },
      price: '現地価格',
      monthUnit: '月',
      status: '状況',
      whereToBuy: '購入できる場所',
      importPathway: '輸入経路',
      regulator: {
        us: 'FDA（DSHEAに基づくダイエタリーサプリメント）',
        eu: 'EUの食品サプリメント（規則1924/2006に基づく強調表示）',
        ca: 'カナダ保健省（NPN）',
        au: 'TGA (AUST L)',
        jp: '消費者庁（機能性表示食品）',
        latam: 'ANVISA / COFEPRIS / INVIMA',
        gcc: 'SFDA／ドバイ市',
        sea: 'HSA／NPRA／BPOM／FDA PH／タイFDA',
      },
      geoHub: {
        us: 'アメリカのおすすめノートロピクス',
        eu: '国別ガイド',
        ca: '州別ガイド',
        au: '州・準州別ガイド',
        jp: '都道府県別ガイド',
        latam: '国別ガイド',
        gcc: '国別ガイド',
        sea: '国別ガイド',
      },
      licence: {
        npnNumber: 'NPN {npn}',
        npnLicensed: 'NPN取得済み',
        noNpn: 'NPNは見つかりませんでした',
        noNpnChecked: 'NPNは見つかりませんでした（{date}確認）',
        austl: 'AUST L {austl}',
        personalImportation: '個人輸入制度',
        ffcNumber: '機能性表示食品 届出番号 {number}',
        ffcNotified: '機能性表示食品（届出済み）',
        noFfc: '機能性表示食品の届出の記録はありません',
        noFfcChecked: '機能性表示食品の届出は見つかりませんでした（{date}確認）',
        euStorefront: 'EU向けストア',
        halalCertified: 'ハラール認証',
        noHalal: 'ブランドによるハラール認証書の提示なし',
        noHalalChecked: 'ブランドによるハラール認証書の提示なし（{date}確認）',
      },
    },
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
      short: { ingredients: '成分', dosing: '用量', transparency: '透明性', value: 'コスパ', trust: '信頼性' },
      shortScoreAria: '{name}の{pillar}スコア',
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
    minRead: '{minutes}分で読めます',
    indexHeading: '{year}年版 ノートロピクスガイド',
    readGuide: 'ガイドを読む →',
    backToGuides: '← ガイド一覧に戻る',
    categories: { beginner: '初心者向け', stacking: '組み合わせ', usage: '使い方', science: '科学' },
  },
  byline: {
    attribution: '執筆：The Nootropic Lab 編集チーム',
    factChecked: '✓ ファクトチェック済み',
    updated: '更新日：',
    readTime: '{minutes}分で読めます',
  },
  listicle: {
    bestNootropics: 'ベストノートロピクス',
    healthDisclaimer: '健康に関する注意事項',
    defaultHealthDisclaimer:
      'このページは情報提供のみを目的としており、医学的助言ではありません。ノートロピクスのサプリメントは、ADHDその他の認知機能に関わる状態を含め、いかなる疾患の診断、治療、治癒、予防についてもFDAの承認を受けていません。処方薬の中枢神経刺激薬と同等のものではありません。サプリメントを始める前には、特に服薬中の方や持病のある方は、必ず資格のある医療専門家にご相談ください。',
    whatEvidenceSays: 'エビデンスが実際に示していること',
    evidenceIntro:
      '以下の各成分について、査読済みの出典に直接リンクしています。成分の作用機序は製品の効果と同じではありません。正しい成分が含まれていても、用量が適切でない製品もあります。',
    sourceLink: '出典 →',
    ourPicksFor: '{useCase}向けの当サイトのおすすめ',
    picksIntro: '上記のエビデンスとの適合度と、当サイトの5本柱の編集監査に基づいて順位付けしています。',
    topPick: 'いちばんのおすすめ',
    whyItsHere: '選んだ理由：',
    checkProduct: '{name}をチェック →',
    readFullReview: 'レビュー全文を読む',
    faqHeading: 'よくある質問',
    howWeChoose: '選定方法',
    howWeChooseBody:
      '掲載する製品は、(a) その用途について査読済みのエビデンスがある成分を少なくとも1つ含み、(b) その成分を臨床試験の用量またはそれに近い用量で配合し、(c) 当サイトの5本柱の編集監査で{minScore}/10以上のスコアを得ている必要があります。詳しくは当サイトの{link}をご覧ください。',
    fullMethodology: '評価方法の全文',
    backToBest: '← {year}年のベストノートロピクスに戻る',
    alsoConsideredHeading: '比較検討した製品 — 基準の{minScore}未満',
    alsoConsideredIntro:
      'このガイドのために監査した製品のうち、当サイトの5本柱の編集監査で順位付けに必要な{minScore}/10に届かなかったものです。透明性のために掲載しており、順位付けや推奨はしていません。',
    belowBarReason: 'スコア{score}/10 — 基準の{minScore}未満',
    alsoConsideredRulesHeading: '比較検討した製品 — 順位付けなし',
    alsoConsideredRulesIntro:
      'このガイドのために監査した製品のうち、順位付けしていないものです。いずれも、当サイトの5本柱の編集監査で順位付けに必要な{minScore}/10に届かないか、ラベル記載量が上記のどのエビデンス項目についても当サイトの基準用量に達していません（組み合わせの場合は、そのすべての成分について）。透明性のために掲載しており、順位付けや推奨はしていません。',
    doseRuleReason:
      'スコア{score}/10。ただし、ラベル記載量が上記のどのエビデンス項目についても当サイトの基準用量に達していません（組み合わせの場合は、そのすべての成分について）',
    alsoConsideredLinkIntro:
      'このガイドのために監査した製品のうち、順位付けしていないものです。いずれも、当サイトの5本柱の編集監査で順位付けに必要な{minScore}/10に届かないか、ラベル記載量が上記のどのエビデンス項目についても当サイトの基準用量に達していないか（組み合わせの場合は、そのすべての成分について）、この版では購入リンクを表示していません。透明性のために掲載しており、順位付けや推奨はしていません。',
    noPurchaseLinkReason: 'スコア{score}/10。ただし、この版ではこの製品の購入リンクを表示していません。理由はレビューに記載しています',
    alsoConsideredToc: '比較検討した製品',
    audited: '監査済み',
    useCaseLabels: {
      focus: '集中力',
      memory: '記憶力',
      studying: '学習',
      aging: 'エイジングケア',
    },
    moneyBackDays: '{days}日間',
    moneyBackLabel: '返金保証',
    ourScore: '当サイトのスコア',
    relatedGuides: '関連ガイド',
    relatedGuideLabels: {
      focus: '集中力におすすめのノートロピクス',
      memory: '記憶力におすすめのノートロピクス',
      studying: '学習におすすめのノートロピクス',
      aging: 'エイジングケアにおすすめのノートロピクス',
    },
    inThisGuide: 'このガイドの内容',
  },
  bestOf: {
    stats: { audited: '監査済み', recommended: 'おすすめ', underdosed: '用量不足の主力製品', avgMonthly: '月額平均' },
    subtitle: '監査{audited}件 · 掲載{listed}件 · 評価方法 {version} · {date}更新',
    rank: '順位',
    commission: '紹介料',
    visit: 'サイトへ →',
  },
  comparator: {
    heading: '比較ツール',
    matchSummary: '{total}件中{shown}件が該当 · 最大{max}件を選んで並べて比較できます',
    filters: '絞り込み',
    saveView: 'ビューを保存',
    linkCopied: 'リンクをクリップボードにコピーしました',
    clipboardError: 'クリップボードにアクセスできませんでした',
    gridLabel: '製品比較',
    columns: { product: '製品', score: 'スコア', value: 'コスパ', price: '価格', trustpilot: 'Trustpilot', bestFor: 'おすすめの用途' },
    noMatch: '該当する製品がありません。',
    resetFilters: '絞り込みをリセット',
    compareAria: '{name}を比較',
    view: '見る →',
    viewAria: '{name}を見る',
    containsCaffeine: 'カフェイン含有',
    filterDialog: '製品を絞り込む',
    closeFilters: '絞り込みを閉じる',
    showResults: '{n}件の製品を表示',
    showResultsOne: '{n}件の製品を表示',
    goal: '目的',
    goalAria: '目的で絞り込む',
    goals: { any: 'すべて', focus: '集中力', memory: '記憶力', energy: 'エネルギー', beginners: '初心者', budget: '低予算' },
    maxPerMonth: '上限（≈ {unit}あたり）',
    grade: '当サイトの評価',
    grades: { all: 'すべて', recommended: 'おすすめ', worthALook: '検討の価値あり', skip: '見送り' },
    caffeineFreeOnly: 'カフェインフリーのみ',
    euStorefrontOnly: 'EU向けストアのみ',
    showCommission: '当サイトの紹介料を表示',
    commissionNote: 'スコアには影響しません',
    resetAll: 'すべての絞り込みをリセット',
    compare: '比較',
    selectedSummary: '{n}件を選択 · 並べて比較',
    clear: 'クリア',
    daily: '1日量',
    caffeine: 'カフェイン',
    caffeineFree: 'なし',
  },
  ingredientLibrary: {
    heading: '成分ライブラリ',
    guideHeading: '{year}年版 ノートロピクス成分ガイド',
    dek: '{n}成分 · RCTのエビデンスと一貫性で評価 · わかりやすい解説',
    filterAria: 'エビデンスのグレードで絞り込む',
    allGrades: 'すべてのグレード',
    grade: 'グレード{grade}',
    legendCount: '{n}成分 · グレード{grade}',
    descriptors: { A: '結果が一貫した複数のRCT', B: 'より小規模または少数のRCT', C: '予備的または一貫しない結果' },
    empty: 'このカタログにはまだグレード{grade}の成分がありません。',
    seeAll: 'すべてのグレードを見る →',
    columns: { grade: 'グレード', ingredient: '成分', clinicalDose: '臨床用量', trials: '試験数', ourTake: '当サイトの見解' },
    gradeAria: 'エビデンスのグレード{grade}',
    studyCounts: '{name}の効果ごとの研究数：{counts}',
    notCounted: '未集計',
    showingAll: '全{n}成分を表示中',
    showingGrade: 'グレード{grade}の成分を{n}件表示中',
    showingGradeOne: 'グレード{grade}の成分を{n}件表示中',
  },
  geo: {
    bestIn: '{place}のおすすめノートロピクス {year}',
    topPicksFor: '{place}の購入者向けおすすめ',
    score: 'スコア：',
  },
  editorialStandards: {
    heading: '編集基準',
    reviewProtocol: '1. レビューの手順',
    conflictOfInterest: '2. 利益相反に関する方針',
    sourceCitation: '3. 出典の明記に関する方針',
    correction: '4. 訂正に関する方針',
    teamIdentity: '5. 編集チームについて',
    regionalFraming: '6. 地域ごとの規制に関する記載',
    contact: '編集部への連絡先',
  },
  shortlist: {
    save: '保存',
    saved: '保存済み',
    saveAria: '候補リストに追加',
    removeAria: '候補リストから削除',
  },
  // Full-width punctuation carries its own spacing: no space after 。、：.
  typography: { colon: '：', space: '' },
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
    buildMyStack: 'Montar o meu stack',
    drawerLabel: 'Navegação principal',
    sidebar: {
      browse: 'Explorar',
      discover: 'Descobrir',
      allProducts: 'Todos os produtos',
      bestOf2026: 'O melhor de 2026',
      ingredients: 'Ingredientes',
      tools: 'Ferramentas',
      comparator: 'Comparador',
      doseCalculator: 'Calculadora de dose',
      myShortlist: 'A minha pré-seleção',
      about: 'Sobre',
      ourMethodology: 'A nossa metodologia',
      disclosures: 'Divulgações',
      submitTip: 'Enviar uma dica →',
    },
    productCount: '{n} produtos',
    ingredientCount: '{n} ingredientes',
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
    neutralBadge: 'Transparência',
    inline: 'Recebemos uma comissão se comprar através dos links desta página, sem custos adicionais para si.',
    noCommission: 'Não recebemos qualquer comissão por este produto; não temos nenhum acordo de afiliação para ele.',
    siteWide: 'Algumas páginas deste site contêm links de afiliados; podemos receber uma comissão se comprar através deles.',
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
    ascending: 'ascendente',
    descending: 'descendente',
    sortAria: 'Ordenar por {column}',
    sortAriaActive: 'Ordenar por {column}, ordem atual: {direction}',
    sortColumns: {
      score: 'pontuação',
      price: 'preço',
      moneyBack: 'dias de garantia de reembolso',
      trustpilot: 'pontuação no Trustpilot',
    },
    editorChoice: 'Escolha editorial',
    euStorefront: 'Loja na UE',
    maxPrice: 'Máx. {price}',
    actions: 'Ações',
    scoreAria: 'Pontuação {score} em 10 — toque ou passe o cursor para ver a decomposição',
    scoreBreakdown: 'Decomposição da pontuação',
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
    palette: {
      dialogLabel: 'Pesquisa no site',
      placeholder: 'Pesquisar produtos, ingredientes, comparações, guias…',
      resultsLabel: 'Resultados da pesquisa',
      recentLabel: 'Recentes e tendências',
      noResults: 'Nenhum resultado para “{query}”',
      emptyPrompt: 'Escreva para pesquisar produtos, ingredientes, comparações ou guias.',
      recent: 'Recentes',
      categories: { ingredients: 'Ingredientes', products: 'Produtos', comparisons: 'Comparações', guides: 'Guias', other: 'Outros' },
      hints: { navigate: 'navegar', open: 'abrir', close: 'fechar' },
      indexed: '{n} indexados',
      scoreAria: ', pontuação {score} em 10',
      gradeAria: ', grau de evidência {grade}',
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
    relatedCategory: {
      adaptogen: 'adaptógeno',
      cholinergic: 'colinérgico',
      mushroom: 'cogumelo',
      amino: 'aminoácido',
      herb: 'erva',
      vitamin: 'vitamina',
    },
    humanTrialsOnly: 'Baseado apenas em ensaios clínicos em humanos. Dados em animais e in vitro excluídos.',
    evidenceStrength: { strong: 'forte', moderate: 'moderada', preliminary: 'preliminar', mixed: 'mista' },
    evidenceKey: {
      label: 'Legenda da evidência:',
      strong: 'Forte = vários ECA consistentes',
      moderate: 'Moderada = ECA mais pequenos ou menos numerosos',
      preliminary: 'Preliminar = ensaios iniciais ou n pequeno',
      mixed: 'Mista = resultados contraditórios',
    },
    howToLabels: { dosage: 'Dose', timing: 'Momento', withFood: 'Com alimentos', cycling: 'Ciclos', forms: 'Formas' },
    topStacks: 'Principais stacks que contêm {name}',
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
      productDescriptorByForm: { capsule: 'cápsula nootrópica diária', tablet: 'comprimido nootrópico diário', sachet: 'sachê nootrópico diário', shot: 'shot nootrópico diário', powder: 'pó nootrópico para beber', softgel: 'cápsula gelatinosa nootrópica diária', can: 'bebida nootrópica diária' },
      updated: 'Atualizado:',
      lastVerified: 'Última verificação:',
      reviewedBy: 'Avaliado pela equipa editorial do The Nootropic Lab',
    },
    dateLocale: 'pt-PT',
    score: {
      label: 'Nossa pontuação',
      outOf10: 'em 10,0',
      aria: 'Pontuação {score} em {max}',
    },
    stats: {
      price: 'Preço',
      monthUnit: 'mês',
      perServingUnit: 'dose',
      perDayUnit: 'dia',
      perServingLabel: 'Por dose',
      perDayLabel: 'Por dia',
      capsules: 'Cáps.',
      dailyServing: 'Dose diária',
      units: { capsule: 'cáps.', tablet: 'comprimidos', sachet: 'sachês', shot: 'shots', powder: 'doses', softgel: 'cápsulas gelatinosas', can: 'latas' },
      unitsSingular: { capsule: 'cáp.', tablet: 'comprimido', sachet: 'sachê', shot: 'shot', powder: 'dose', softgel: 'cápsula gelatinosa', can: 'lata' },
      moneyBack: 'Garantia',
      days: 'dias',
      daysCount: '{days} dias',
      daysCountShort: '{days} d',
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
    breadcrumbBestOf: 'O melhor',
    overview: {
      verdictEyebrow: 'Veredicto',
      verdict: { good: '{product} é recomendado.', warn: '{product} merece uma vista de olhos.', bad: '{product} fica aquém.' },
      whatItDoes: 'O que faz',
      howItWorks: 'Como funciona',
      whatToExpect: 'O que esperar',
      heroIngredients: 'Ingredientes principais',
      whoItsFor: 'Para quem é',
      whoShouldSkip: 'Quem deve evitar',
    },
    reviews: {
      noProfileHeading: 'Sem perfil no Trustpilot',
      noProfileBody: '{brand} não tem uma página ativa no Trustpilot — algo comum em vendedores que só vendem na Amazon, marcas de marketplace e cadeias regionais de farmácias.',
      noProfileTrust: 'O pilar de confiança da nossa pontuação editorial continua a aplicar-se e reflete a reputação da marca, os testes por terceiros e o historial de reembolsos.',
      starsAria: '{score} de 5 estrelas',
      countOnTrustpilot: '{count} avaliações no Trustpilot',
      verifiedCount: '{count} avaliações verificadas',
      noCherryPicking: 'Não incorporamos aqui citações escolhidas a dedo. O Trustpilot é a fonte de referência — a pontuação acima entra no nosso pilar de confiança.',
      readAll: 'Ler as {count} avaliações no Trustpilot →',
    },
    regionalBuying: {
      heading: {
        us: 'Comprar nos Estados Unidos',
        eu: 'Comprar na UE',
        ca: 'Comprar no Canadá',
        au: 'Comprar na Austrália',
        jp: 'Comprar no Japão',
        latam: 'Comprar na América Latina',
        gcc: 'Comprar no Golfo',
        sea: 'Comprar no Sudeste Asiático',
      },
      price: 'Preço local',
      monthUnit: 'mês',
      status: 'Estado',
      whereToBuy: 'Onde comprar',
      importPathway: 'Via de importação',
      regulator: {
        us: 'FDA (suplemento alimentar ao abrigo da DSHEA)',
        eu: 'Suplemento alimentar na UE (alegações ao abrigo do Reg. 1924/2006)',
        ca: 'Health Canada (NPN)',
        au: 'TGA (AUST L)',
        jp: 'Agência dos Assuntos do Consumidor (FFC)',
        latam: 'ANVISA / COFEPRIS / INVIMA',
        gcc: 'SFDA / Município do Dubai',
        sea: 'HSA / NPRA / BPOM / FDA PH / FDA tailandesa',
      },
      geoHub: {
        us: 'Os melhores nootrópicos nos EUA',
        eu: 'Guias por país',
        ca: 'Guias por província',
        au: 'Guias por estado e território',
        jp: 'Guias por prefeitura',
        latam: 'Guias por país',
        gcc: 'Guias por país',
        sea: 'Guias por país',
      },
      licence: {
        npnNumber: 'NPN {npn}',
        npnLicensed: 'Com licença NPN',
        noNpn: 'Nenhum NPN encontrado',
        noNpnChecked: 'Nenhum NPN encontrado (verificado a {date})',
        austl: 'AUST L {austl}',
        personalImportation: 'Regime de importação pessoal',
        ffcNumber: 'Notificação FFC {number}',
        ffcNotified: 'Notificado FFC',
        noFfc: 'Sem notificação FFC registada',
        noFfcChecked: 'Nenhuma notificação FFC encontrada (verificado a {date})',
        euStorefront: 'Loja na UE',
        halalCertified: 'Certificado halal',
        noHalal: 'A marca não apresenta certificado halal',
        noHalalChecked: 'A marca não apresenta certificado halal (verificado a {date})',
      },
    },
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
      short: { ingredients: 'ingredientes', dosing: 'dose', transparency: 'transparência', value: 'valor', trust: 'confiança' },
      shortScoreAria: 'Pontuação de {pillar} de {name}',
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
    minRead: '{minutes} min de leitura',
    indexHeading: 'Guias de nootrópicos {year}',
    readGuide: 'Ler o guia →',
    backToGuides: '← Voltar aos guias',
    categories: { beginner: 'Iniciante', stacking: 'Combinações', usage: 'Utilização', science: 'Ciência' },
  },
  byline: {
    attribution: 'Pela equipa editorial do The Nootropic Lab',
    factChecked: '✓ Factos verificados',
    updated: 'Atualizado',
    readTime: '{minutes} min de leitura',
  },
  listicle: {
    bestNootropics: 'Melhores nootrópicos',
    healthDisclaimer: 'Aviso de saúde',
    defaultHealthDisclaimer:
      'Esta página tem fins exclusivamente informativos e não constitui aconselhamento médico. Os suplementos nootrópicos não são aprovados pela FDA para diagnosticar, tratar, curar ou prevenir qualquer doença, incluindo a PHDA ou outras condições cognitivas. Não são equivalentes a estimulantes sujeitos a receita médica. Consulte sempre um profissional de saúde qualificado antes de iniciar qualquer suplemento, sobretudo se toma medicação ou tem uma condição médica.',
    whatEvidenceSays: 'O que a evidência realmente diz',
    evidenceIntro:
      'Para cada ingrediente abaixo, ligamos diretamente à fonte revista por pares. O mecanismo de um ingrediente não é o mesmo que a eficácia do produto — um produto pode incluir o ingrediente certo na dose errada.',
    sourceLink: 'Fonte →',
    ourPicksFor: 'As nossas escolhas para {useCase}',
    picksIntro: 'Classificados pela correspondência de cada produto com a evidência acima + a nossa auditoria editorial de 5 pilares.',
    topPick: 'Melhor escolha',
    whyItsHere: 'Porque está aqui:',
    checkProduct: 'Ver {name} →',
    readFullReview: 'Ler a análise completa',
    faqHeading: 'Perguntas frequentes',
    howWeChoose: 'Como escolhemos',
    howWeChooseBody:
      'Cada escolha tem de (a) incluir pelo menos um ingrediente com evidência revista por pares para o caso de uso, (b) dosear esse ingrediente na dose dos ensaios clínicos ou perto dela, e (c) obter uma pontuação ≥ {minScore}/10 na nossa auditoria editorial de 5 pilares. Leia a nossa {link}.',
    fullMethodology: 'metodologia completa',
    backToBest: '← Voltar aos melhores nootrópicos {year}',
    alsoConsideredHeading: 'Também avaliados — abaixo do nosso limiar de {minScore}',
    alsoConsideredIntro:
      'Produtos auditados para este guia cuja pontuação fica abaixo dos {minScore}/10 de que uma escolha classificada precisa na nossa auditoria editorial de 5 pilares. Listados por transparência; não são classificados nem recomendados.',
    belowBarReason: 'Pontuação de {score}/10 — abaixo do nosso limiar de {minScore}',
    alsoConsideredRulesHeading: 'Também avaliados — sem classificação',
    alsoConsideredRulesIntro:
      'Produtos auditados para este guia que não classificamos: cada um tem uma pontuação abaixo dos {minScore}/10 de que uma escolha classificada precisa na nossa auditoria editorial de 5 pilares, ou o seu rótulo não atinge a nossa dose de referência em nenhuma das entradas de evidência acima (numa combinação, em cada um dos seus ingredientes). Listados por transparência; não são classificados nem recomendados.',
    doseRuleReason:
      'Pontuação de {score}/10, mas o seu rótulo não atinge a nossa dose de referência em nenhuma das entradas de evidência acima (numa combinação, em cada um dos seus ingredientes)',
    alsoConsideredLinkIntro:
      'Produtos auditados para este guia que não classificamos: cada um tem uma pontuação abaixo dos {minScore}/10 de que uma escolha classificada precisa na nossa auditoria editorial de 5 pilares, ou o seu rótulo não atinge a nossa dose de referência em nenhuma das entradas de evidência acima (numa combinação, em cada um dos seus ingredientes), ou esta edição não mostra nenhuma ligação de compra para ele. Listados por transparência; não são classificados nem recomendados.',
    noPurchaseLinkReason: 'Pontuação de {score}/10, mas esta edição não mostra nenhuma ligação de compra para este produto; a respetiva análise explica porquê',
    alsoConsideredToc: 'Também avaliados',
    audited: 'Auditado',
    useCaseLabels: {
      focus: 'a concentração',
      memory: 'a memória',
      studying: 'o estudo',
      aging: 'o envelhecimento',
    },
    moneyBackDays: '{days} dias',
    moneyBackLabel: 'de garantia',
    ourScore: 'A nossa pontuação',
    relatedGuides: 'Guias relacionados',
    relatedGuideLabels: {
      focus: 'Melhores nootrópicos para a concentração',
      memory: 'Melhores nootrópicos para a memória',
      studying: 'Melhores nootrópicos para o estudo',
      aging: 'Melhores nootrópicos para o envelhecimento',
    },
    inThisGuide: 'Neste guia',
  },
  bestOf: {
    stats: { audited: 'Auditados', recommended: 'Recomendados', underdosed: 'Produto principal subdoseado', avgMonthly: 'Média / mês' },
    subtitle: '{audited} auditados · {listed} listados · metodologia {version} · atualizado a {date}',
    rank: 'Posição',
    commission: 'Comissão',
    visit: 'Visitar →',
  },
  comparator: {
    heading: 'Comparador',
    matchSummary: '{shown} de {total} correspondem · selecione até {max} para comparar lado a lado',
    filters: 'Filtros',
    saveView: 'Guardar vista',
    linkCopied: 'Ligação copiada para a área de transferência',
    clipboardError: 'Não foi possível aceder à área de transferência',
    gridLabel: 'Comparação de produtos',
    columns: { product: 'Produto', score: 'Pontuação', value: 'Valor', price: 'Preço', trustpilot: 'Trustpilot', bestFor: 'Ideal para' },
    noMatch: 'Nenhum produto corresponde.',
    resetFilters: 'Repor filtros',
    compareAria: 'Comparar {name}',
    view: 'Ver →',
    viewAria: 'Ver {name}',
    containsCaffeine: 'com cafeína',
    filterDialog: 'Filtrar produtos',
    closeFilters: 'Fechar filtros',
    showResults: 'Mostrar {n} produtos',
    showResultsOne: 'Mostrar {n} produto',
    goal: 'Objetivo',
    goalAria: 'Filtrar por objetivo',
    goals: { any: 'Qualquer', focus: 'Concentração', memory: 'Memória', energy: 'Energia', beginners: 'Iniciantes', budget: 'Económico' },
    maxPerMonth: 'Máx. ≈ por {unit}',
    grade: 'A nossa classificação',
    grades: { all: 'Todas', recommended: 'Recomendado', worthALook: 'Vale a pena ver', skip: 'Evitar' },
    caffeineFreeOnly: 'Apenas sem cafeína',
    euStorefrontOnly: 'Apenas com loja na UE',
    showCommission: 'Mostrar a nossa comissão',
    commissionNote: 'Não altera as pontuações',
    resetAll: 'Repor todos os filtros',
    compare: 'Comparar',
    selectedSummary: '{n} selecionados · lado a lado',
    clear: 'Limpar',
    daily: 'Diário',
    caffeine: 'Cafeína',
    caffeineFree: 'Sem',
  },
  ingredientLibrary: {
    heading: 'Biblioteca de ingredientes',
    guideHeading: 'Guia de ingredientes nootrópicos {year}',
    dek: '{n} ingredientes · classificados pela evidência de ECA e pela sua consistência · notas em linguagem simples',
    filterAria: 'Filtrar por grau de evidência',
    allGrades: 'Todos os graus',
    grade: 'Grau {grade}',
    legendCount: '{n} ingredientes · Grau {grade}',
    descriptors: { A: 'Vários ECA consistentes', B: 'ECA mais pequenos ou menos numerosos', C: 'Preliminar ou mista' },
    empty: 'Ainda não há ingredientes de grau {grade} neste catálogo.',
    seeAll: 'Ver todos os graus →',
    columns: { grade: 'Grau', ingredient: 'Ingrediente', clinicalDose: 'Dose clínica', trials: 'Ensaios', ourTake: 'A nossa opinião' },
    gradeAria: 'Grau de evidência {grade}',
    studyCounts: 'Número de estudos por efeito de {name}: {counts}',
    notCounted: 'não contabilizado',
    showingAll: 'A mostrar os {n} ingredientes',
    showingGrade: 'A mostrar {n} ingredientes de grau {grade}',
    showingGradeOne: 'A mostrar {n} ingrediente de grau {grade}',
  },
  geo: {
    bestIn: 'Melhores nootrópicos: {place} {year}',
    topPicksFor: 'Melhores escolhas para compradores: {place}',
    score: 'Pontuação:',
  },
  editorialStandards: {
    heading: 'Normas editoriais',
    reviewProtocol: '1. Protocolo de análise',
    conflictOfInterest: '2. Política de conflitos de interesses',
    sourceCitation: '3. Política de citação de fontes',
    correction: '4. Política de correções',
    teamIdentity: '5. Identidade da equipa editorial',
    regionalFraming: '6. Enquadramento regulamentar por região',
    contact: 'Contacto editorial',
  },
  shortlist: {
    save: 'Guardar',
    saved: 'Guardado',
    saveAria: 'Adicionar à minha pré-seleção',
    removeAria: 'Remover da minha pré-seleção',
  },
  typography: { colon: ': ', space: ' ' },
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
    buildMyStack: 'Mein Stack zusammenstellen',
    drawerLabel: 'Hauptnavigation',
    sidebar: {
      browse: 'Stöbern',
      discover: 'Entdecken',
      allProducts: 'Alle Produkte',
      bestOf2026: 'Das Beste 2026',
      ingredients: 'Inhaltsstoffe',
      tools: 'Werkzeuge',
      comparator: 'Vergleichstool',
      doseCalculator: 'Dosisrechner',
      myShortlist: 'Meine Auswahlliste',
      about: 'Über uns',
      ourMethodology: 'Unsere Methodik',
      disclosures: 'Offenlegungen',
      submitTip: 'Hinweis senden →',
    },
    productCount: '{n} Produkte',
    ingredientCount: '{n} Inhaltsstoffe',
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
    neutralBadge: 'Transparenzhinweis',
    inline: 'Wenn Sie über Links auf dieser Seite kaufen, erhalten wir eine Provision – ohne Mehrkosten für Sie.',
    noCommission: 'Für dieses Produkt erhalten wir keine Provision; wir haben dafür keine Affiliate-Vereinbarung.',
    siteWide: 'Einige Seiten dieser Website enthalten Affiliate-Links; wenn Sie über diese Links kaufen, erhalten wir möglicherweise eine Provision.',
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
    ascending: 'aufsteigend',
    descending: 'absteigend',
    sortAria: 'Nach {column} sortieren',
    sortAriaActive: 'Nach {column} sortieren, derzeit {direction}',
    sortColumns: {
      score: 'Bewertung',
      price: 'Preis',
      moneyBack: 'Tagen Geld-zurück-Garantie',
      trustpilot: 'Trustpilot-Bewertung',
    },
    editorChoice: 'Empfehlung der Redaktion',
    euStorefront: 'EU-Shop',
    maxPrice: 'Max. {price}',
    actions: 'Aktionen',
    scoreAria: 'Bewertung {score} von 10 – tippen oder mit der Maus darauf zeigen für die Aufschlüsselung',
    scoreBreakdown: 'Aufschlüsselung der Bewertung',
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
    palette: {
      dialogLabel: 'Website-Suche',
      placeholder: 'Produkte, Inhaltsstoffe, Vergleiche, Ratgeber suchen…',
      resultsLabel: 'Suchergebnisse',
      recentLabel: 'Zuletzt geöffnet und im Trend',
      noResults: 'Keine Ergebnisse für „{query}“',
      emptyPrompt: 'Tippen Sie, um Produkte, Inhaltsstoffe, Vergleiche oder Ratgeber zu suchen.',
      recent: 'Zuletzt geöffnet',
      categories: { ingredients: 'Inhaltsstoffe', products: 'Produkte', comparisons: 'Vergleiche', guides: 'Ratgeber', other: 'Sonstiges' },
      hints: { navigate: 'navigieren', open: 'öffnen', close: 'schließen' },
      indexed: '{n} indexiert',
      scoreAria: ', Bewertung {score} von 10',
      gradeAria: ', Evidenzgrad {grade}',
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
    relatedCategory: {
      adaptogen: 'Adaptogen',
      cholinergic: 'Cholinergikum',
      mushroom: 'Pilz',
      amino: 'Aminosäure',
      herb: 'Heilkraut',
      vitamin: 'Vitamin',
    },
    humanTrialsOnly: 'Nur auf Grundlage klinischer Studien am Menschen. Tier- und In-vitro-Daten ausgeschlossen.',
    evidenceStrength: { strong: 'stark', moderate: 'mäßig', preliminary: 'vorläufig', mixed: 'uneinheitlich' },
    evidenceKey: {
      label: 'Legende zur Evidenz:',
      strong: 'Stark = mehrere übereinstimmende RCTs',
      moderate: 'Mäßig = kleinere/weniger RCTs',
      preliminary: 'Vorläufig = frühe Studien oder kleines n',
      mixed: 'Uneinheitlich = widersprüchliche Ergebnisse',
    },
    howToLabels: { dosage: 'Dosierung', timing: 'Zeitpunkt', withFood: 'Mit Mahlzeit', cycling: 'Zyklen', forms: 'Darreichungsformen' },
    topStacks: 'Top-Stacks mit {name}',
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
      productDescriptorByForm: { capsule: 'tägliche Nootropika-Kapsel', tablet: 'tägliche Nootropika-Tablette', sachet: 'täglicher Nootropika-Beutel', shot: 'täglicher Nootropika-Shot', powder: 'Nootropika-Trinkpulver', softgel: 'tägliche Nootropika-Weichkapsel', can: 'tägliches Nootropika-Getränk' },
      updated: 'Aktualisiert:',
      lastVerified: 'Zuletzt geprüft:',
      reviewedBy: 'Geprüft von der Redaktion von The Nootropic Lab',
    },
    dateLocale: 'de-DE',
    score: {
      label: 'Unsere Bewertung',
      outOf10: 'von 10,0',
      aria: 'Bewertung {score} von {max}',
    },
    stats: {
      price: 'Preis',
      monthUnit: 'Monat',
      perServingUnit: 'Dosis',
      perDayUnit: 'Tag',
      perServingLabel: 'Pro Dosis',
      perDayLabel: 'Pro Tag',
      capsules: 'Kapseln',
      dailyServing: 'Tagesdosis',
      units: { capsule: 'Kapseln', tablet: 'Tabletten', sachet: 'Beutel', shot: 'Shots', powder: 'Messlöffel', softgel: 'Weichkapseln', can: 'Dosen' },
      unitsSingular: { capsule: 'Kapsel', tablet: 'Tablette', sachet: 'Beutel', shot: 'Shot', powder: 'Messlöffel', softgel: 'Weichkapsel', can: 'Dose' },
      moneyBack: 'Geld-zurück',
      days: 'Tage',
      daysCount: '{days} Tage',
      daysCountShort: '{days} T.',
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
    breadcrumbBestOf: 'Das Beste',
    overview: {
      verdictEyebrow: 'Fazit',
      verdict: { good: '{product} ist empfehlenswert.', warn: '{product} ist einen Blick wert.', bad: '{product} bleibt hinter den Erwartungen zurück.' },
      whatItDoes: 'Was es bewirkt',
      howItWorks: 'Wie es wirkt',
      whatToExpect: 'Was Sie erwarten können',
      heroIngredients: 'Hauptinhaltsstoffe',
      whoItsFor: 'Für wen es geeignet ist',
      whoShouldSkip: 'Wer darauf verzichten sollte',
    },
    reviews: {
      noProfileHeading: 'Kein Trustpilot-Profil',
      noProfileBody: '{brand} hat kein aktives Trustpilot-Profil – das ist bei reinen Amazon-Händlern, Marktplatzmarken und regionalen Apothekenketten üblich.',
      noProfileTrust: 'Die Vertrauenssäule unserer redaktionellen Bewertung gilt weiterhin und spiegelt den Ruf der Marke, Tests durch Dritte und die Erstattungshistorie wider.',
      starsAria: '{score} von 5 Sternen',
      countOnTrustpilot: '{count} Bewertungen auf Trustpilot',
      verifiedCount: '{count} verifizierte Bewertungen',
      noCherryPicking: 'Wir binden hier keine handverlesenen Zitate ein. Trustpilot ist die maßgebliche Quelle – die Bewertung oben fließt in unsere Vertrauenssäule ein.',
      readAll: 'Alle {count} Bewertungen auf Trustpilot lesen →',
    },
    regionalBuying: {
      heading: {
        us: 'Kaufen in den Vereinigten Staaten',
        eu: 'Kaufen in der EU',
        ca: 'Kaufen in Kanada',
        au: 'Kaufen in Australien',
        jp: 'Kaufen in Japan',
        latam: 'Kaufen in Lateinamerika',
        gcc: 'Kaufen in den Golfstaaten',
        sea: 'Kaufen in Südostasien',
      },
      price: 'Lokaler Preis',
      monthUnit: 'Monat',
      status: 'Status',
      whereToBuy: 'Bezugsquellen',
      importPathway: 'Einfuhrweg',
      regulator: {
        us: 'FDA (Nahrungsergänzungsmittel nach DSHEA)',
        eu: 'EU-Nahrungsergänzungsmittel (Angaben nach VO 1924/2006)',
        ca: 'Health Canada (NPN)',
        au: 'TGA (AUST L)',
        jp: 'Verbraucherbehörde (FFC)',
        latam: 'ANVISA / COFEPRIS / INVIMA',
        gcc: 'SFDA / Stadtverwaltung Dubai',
        sea: 'HSA / NPRA / BPOM / FDA PH / thailändische FDA',
      },
      geoHub: {
        us: 'Die besten Nootropika in den USA',
        eu: 'Länderratgeber',
        ca: 'Ratgeber nach Provinz',
        au: 'Ratgeber nach Bundesstaat und Territorium',
        jp: 'Ratgeber nach Präfektur',
        latam: 'Länderratgeber',
        gcc: 'Länderratgeber',
        sea: 'Länderratgeber',
      },
      licence: {
        npnNumber: 'NPN {npn}',
        npnLicensed: 'NPN-lizenziert',
        noNpn: 'Keine NPN gefunden',
        noNpnChecked: 'Keine NPN gefunden (geprüft am {date})',
        austl: 'AUST L {austl}',
        personalImportation: 'Regelung für die persönliche Einfuhr',
        ffcNumber: 'FFC-Meldung {number}',
        ffcNotified: 'FFC-notifiziert',
        noFfc: 'Keine FFC-Meldung erfasst',
        noFfcChecked: 'Keine FFC-Meldung gefunden (geprüft am {date})',
        euStorefront: 'EU-Shop',
        halalCertified: 'Halal-zertifiziert',
        noHalal: 'Kein Halal-Zertifikat von der Marke vorgelegt',
        noHalalChecked: 'Kein Halal-Zertifikat von der Marke vorgelegt (geprüft am {date})',
      },
    },
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
      short: { ingredients: 'Inhaltsstoffe', dosing: 'Dosierung', transparency: 'Transparenz', value: 'Preis-Leistung', trust: 'Vertrauen' },
      shortScoreAria: '{name}: Bewertung {pillar}',
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
    minRead: '{minutes} Min. Lesezeit',
    indexHeading: 'Nootropika-Ratgeber {year}',
    readGuide: 'Ratgeber lesen →',
    backToGuides: '← Zurück zu den Ratgebern',
    categories: { beginner: 'Einsteiger', stacking: 'Kombinieren', usage: 'Anwendung', science: 'Wissenschaft' },
  },
  byline: {
    attribution: 'Von der Redaktion von The Nootropic Lab',
    factChecked: '✓ Faktengeprüft',
    updated: 'Aktualisiert',
    readTime: '{minutes} Min. Lesezeit',
  },
  listicle: {
    bestNootropics: 'Beste Nootropika',
    healthDisclaimer: 'Gesundheitshinweis',
    defaultHealthDisclaimer:
      'Diese Seite dient ausschließlich der Information und ist keine medizinische Beratung. Nootropische Nahrungsergänzungsmittel sind von der FDA nicht zur Diagnose, Behandlung, Heilung oder Vorbeugung von Krankheiten zugelassen, auch nicht von ADHS oder anderen kognitiven Erkrankungen. Sie sind verschreibungspflichtigen Stimulanzien nicht gleichwertig. Sprechen Sie immer mit einer qualifizierten medizinischen Fachkraft, bevor Sie ein Nahrungsergänzungsmittel einnehmen, insbesondere wenn Sie Medikamente einnehmen oder eine Erkrankung haben.',
    whatEvidenceSays: 'Was die Evidenz wirklich sagt',
    evidenceIntro:
      'Zu jedem Inhaltsstoff unten verlinken wir direkt die von Fachleuten begutachtete Quelle. Der Wirkmechanismus eines Inhaltsstoffs ist nicht dasselbe wie die Wirksamkeit eines Produkts – ein Produkt kann den richtigen Inhaltsstoff in der falschen Dosis enthalten.',
    sourceLink: 'Quelle →',
    ourPicksFor: 'Unsere Auswahl für {useCase}',
    picksIntro: 'Gereiht danach, wie gut jedes Produkt zur obigen Evidenz passt + unserem redaktionellen 5-Säulen-Audit.',
    topPick: 'Top-Empfehlung',
    whyItsHere: 'Warum es dabei ist:',
    checkProduct: '{name} ansehen →',
    readFullReview: 'Vollständigen Test lesen',
    faqHeading: 'Häufig gestellte Fragen',
    howWeChoose: 'So wählen wir aus',
    howWeChooseBody:
      'Jede Empfehlung muss (a) mindestens einen Inhaltsstoff mit von Fachleuten begutachteter Evidenz für den Anwendungszweck enthalten, (b) diesen Inhaltsstoff in oder nahe der Dosis der klinischen Studien dosieren und (c) in unserem redaktionellen 5-Säulen-Audit ≥ {minScore}/10 erreichen. Lesen Sie unsere {link}.',
    fullMethodology: 'vollständige Methodik',
    backToBest: '← Zurück zu Beste Nootropika {year}',
    alsoConsideredHeading: 'Ebenfalls geprüft – unter unserer Schwelle von {minScore}',
    alsoConsideredIntro:
      'Für diesen Ratgeber geprüfte Produkte, die unter den {minScore}/10 liegen, die eine gereihte Empfehlung in unserem redaktionellen 5-Säulen-Audit braucht. Aus Transparenzgründen aufgeführt, nicht gereiht oder empfohlen.',
    belowBarReason: 'Bewertung {score}/10 – unter unserer Schwelle von {minScore}',
    alsoConsideredRulesHeading: 'Ebenfalls geprüft – nicht gereiht',
    alsoConsideredRulesIntro:
      'Für diesen Ratgeber geprüfte Produkte, die wir nicht reihen: Jedes liegt entweder unter den {minScore}/10, die eine gereihte Empfehlung in unserem redaktionellen 5-Säulen-Audit braucht, oder sein Etikett erreicht für keinen der obigen Evidenzeinträge unsere Referenzdosis (bei einer Kombination für jeden ihrer Inhaltsstoffe). Aus Transparenzgründen aufgeführt, nicht gereiht oder empfohlen.',
    doseRuleReason:
      'Bewertung {score}/10, aber sein Etikett erreicht für keinen der obigen Evidenzeinträge unsere Referenzdosis (bei einer Kombination für jeden ihrer Inhaltsstoffe)',
    alsoConsideredLinkIntro:
      'Für diesen Ratgeber geprüfte Produkte, die wir nicht reihen: Jedes liegt entweder unter den {minScore}/10, die eine gereihte Empfehlung in unserem redaktionellen 5-Säulen-Audit braucht, oder sein Etikett erreicht für keinen der obigen Evidenzeinträge unsere Referenzdosis (bei einer Kombination für jeden ihrer Inhaltsstoffe), oder diese Ausgabe zeigt keinen Kauflink dafür. Aus Transparenzgründen aufgeführt, nicht gereiht oder empfohlen.',
    noPurchaseLinkReason: 'Bewertung {score}/10, aber diese Ausgabe zeigt keinen Kauflink für dieses Produkt; der Test erklärt, warum',
    alsoConsideredToc: 'Ebenfalls geprüft',
    audited: 'Geprüft',
    useCaseLabels: {
      focus: 'Konzentration',
      memory: 'Gedächtnis',
      studying: 'das Lernen',
      aging: 'das Altern',
    },
    moneyBackDays: '{days} Tage',
    moneyBackLabel: 'Geld-zurück',
    ourScore: 'Unsere Bewertung',
    relatedGuides: 'Verwandte Ratgeber',
    relatedGuideLabels: {
      focus: 'Beste Nootropika für Konzentration',
      memory: 'Beste Nootropika für das Gedächtnis',
      studying: 'Beste Nootropika zum Lernen',
      aging: 'Beste Nootropika für das Altern',
    },
    inThisGuide: 'In diesem Ratgeber',
  },
  bestOf: {
    stats: { audited: 'Geprüft', recommended: 'Empfohlen', underdosed: 'Unterdosiertes Flaggschiff', avgMonthly: 'Ø / Monat' },
    subtitle: '{audited} geprüft · {listed} gelistet · Methodik {version} · aktualisiert am {date}',
    rank: 'Rang',
    commission: 'Provision',
    visit: 'Zum Shop →',
  },
  comparator: {
    heading: 'Vergleichstool',
    matchSummary: '{shown} von {total} passen · bis zu {max} für den direkten Vergleich auswählen',
    filters: 'Filter',
    saveView: 'Ansicht speichern',
    linkCopied: 'Link in die Zwischenablage kopiert',
    clipboardError: 'Kein Zugriff auf die Zwischenablage',
    gridLabel: 'Produktvergleich',
    columns: { product: 'Produkt', score: 'Bewertung', value: 'Preis-Leistung', price: 'Preis', trustpilot: 'Trustpilot', bestFor: 'Ideal für' },
    noMatch: 'Keine passenden Produkte.',
    resetFilters: 'Filter zurücksetzen',
    compareAria: '{name} vergleichen',
    view: 'Ansehen →',
    viewAria: '{name} ansehen',
    containsCaffeine: 'mit Koffein',
    filterDialog: 'Produkte filtern',
    closeFilters: 'Filter schließen',
    showResults: '{n} Produkte anzeigen',
    showResultsOne: '{n} Produkt anzeigen',
    goal: 'Ziel',
    goalAria: 'Nach Ziel filtern',
    goals: { any: 'Alle', focus: 'Konzentration', memory: 'Gedächtnis', energy: 'Energie', beginners: 'Einsteiger', budget: 'Preiswert' },
    maxPerMonth: 'Max. ≈ pro {unit}',
    grade: 'Unsere Einstufung',
    grades: { all: 'Alle', recommended: 'Empfohlen', worthALook: 'Einen Blick wert', skip: 'Auslassen' },
    caffeineFreeOnly: 'Nur koffeinfrei',
    euStorefrontOnly: 'Nur mit EU-Shop',
    showCommission: 'Unsere Provision anzeigen',
    commissionNote: 'Ändert keine Bewertungen',
    resetAll: 'Alle Filter zurücksetzen',
    compare: 'Vergleich',
    selectedSummary: '{n} ausgewählt · nebeneinander',
    clear: 'Leeren',
    daily: 'Täglich',
    caffeine: 'Koffein',
    caffeineFree: 'Frei',
  },
  ingredientLibrary: {
    heading: 'Inhaltsstoff-Bibliothek',
    guideHeading: 'Nootropika-Inhaltsstoffe: Ratgeber {year}',
    dek: '{n} Inhaltsstoffe · bewertet nach RCT-Evidenz und Konsistenz · verständliche Hinweise',
    filterAria: 'Nach Evidenzgrad filtern',
    allGrades: 'Alle Grade',
    grade: 'Grad {grade}',
    legendCount: '{n} Inhaltsstoffe · Grad {grade}',
    descriptors: { A: 'Mehrere übereinstimmende RCTs', B: 'Kleinere / weniger RCTs', C: 'Vorläufig oder uneinheitlich' },
    empty: 'In diesem Katalog gibt es noch keine Inhaltsstoffe mit Grad {grade}.',
    seeAll: 'Alle Grade ansehen →',
    columns: { grade: 'Grad', ingredient: 'Inhaltsstoff', clinicalDose: 'Klinische Dosis', trials: 'Studien', ourTake: 'Unsere Einschätzung' },
    gradeAria: 'Evidenzgrad {grade}',
    studyCounts: 'Anzahl der Studien je Wirkung von {name}: {counts}',
    notCounted: 'nicht gezählt',
    showingAll: 'Alle {n} Inhaltsstoffe werden angezeigt',
    showingGrade: '{n} Inhaltsstoffe mit Grad {grade} werden angezeigt',
    showingGradeOne: '{n} Inhaltsstoff mit Grad {grade} wird angezeigt',
  },
  geo: {
    bestIn: 'Beste Nootropika: {place} {year}',
    topPicksFor: 'Top-Empfehlungen für Käufer: {place}',
    score: 'Bewertung:',
  },
  editorialStandards: {
    heading: 'Redaktionelle Standards',
    reviewProtocol: '1. Testverfahren',
    conflictOfInterest: '2. Richtlinie zu Interessenkonflikten',
    sourceCitation: '3. Richtlinie zur Quellenangabe',
    correction: '4. Richtlinie zu Korrekturen',
    teamIdentity: '5. Identität der Redaktion',
    regionalFraming: '6. Regionsspezifische regulatorische Einordnung',
    contact: 'Kontakt zur Redaktion',
  },
  shortlist: {
    save: 'Merken',
    saved: 'Gemerkt',
    saveAria: 'Zur Auswahlliste hinzufügen',
    removeAria: 'Von der Auswahlliste entfernen',
  },
  typography: { colon: ': ', space: ' ' },
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
    buildMyStack: 'Composer mon stack',
    drawerLabel: 'Navigation principale',
    sidebar: {
      browse: 'Parcourir',
      discover: 'Découvrir',
      allProducts: 'Tous les produits',
      bestOf2026: 'Le meilleur de 2026',
      ingredients: 'Ingrédients',
      tools: 'Outils',
      comparator: 'Comparateur',
      doseCalculator: 'Calculateur de dose',
      myShortlist: 'Ma présélection',
      about: 'À propos',
      ourMethodology: 'Notre méthodologie',
      disclosures: 'Divulgations',
      submitTip: 'Nous signaler une info →',
    },
    productCount: '{n} produits',
    ingredientCount: '{n} ingrédients',
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
    neutralBadge: 'Divulgation',
    inline: "Nous touchons une commission si vous effectuez un achat par l'entremise des liens de cette page, sans frais supplémentaires pour vous.",
    noCommission: 'Nous ne touchons aucune commission sur ce produit : nous n’avons aucune entente d’affiliation le concernant.',
    siteWide: "Certaines pages de ce site contiennent des liens affiliés; nous pouvons toucher une commission si vous effectuez un achat par l'entremise de ces liens.",
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
    ascending: 'croissant',
    descending: 'décroissant',
    sortAria: 'Trier par {column}',
    sortAriaActive: 'Trier par {column}, ordre actuel : {direction}',
    sortColumns: {
      score: 'score',
      price: 'prix',
      moneyBack: 'jours de garantie de remboursement',
      trustpilot: 'score Trustpilot',
    },
    editorChoice: 'Choix de la rédaction',
    euStorefront: 'Boutique dans l’UE',
    maxPrice: 'Max. {price}',
    actions: 'Actions',
    scoreAria: 'Score de {score} sur 10 — touchez ou survolez pour voir le détail',
    scoreBreakdown: 'Détail du score',
  },
  breadcrumb: {
    home: 'Accueil',
    ingredients: 'Ingrédients',
    backToBestNootropics: '← Retour aux meilleurs nootropiques',
    backToIngredientsGuide: '← Retour au guide des ingrédients',
    ariaLabel: "Fil d'Ariane",
  },
  search: {
    palette: {
      dialogLabel: 'Recherche sur le site',
      placeholder: 'Rechercher des produits, ingrédients, comparatifs, guides…',
      resultsLabel: 'Résultats de recherche',
      recentLabel: 'Récents et tendances',
      noResults: 'Aucun résultat pour « {query} »',
      emptyPrompt: 'Tapez du texte pour rechercher des produits, ingrédients, comparatifs ou guides.',
      recent: 'Récents',
      categories: { ingredients: 'Ingrédients', products: 'Produits', comparisons: 'Comparatifs', guides: 'Guides', other: 'Autres' },
      hints: { navigate: 'naviguer', open: 'ouvrir', close: 'fermer' },
      indexed: '{n} indexés',
      scoreAria: ', score de {score} sur 10',
      gradeAria: ', niveau de preuve {grade}',
    },
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
    relatedCategory: {
      adaptogen: 'adaptogène',
      cholinergic: 'cholinergique',
      mushroom: 'champignon',
      amino: 'acide aminé',
      herb: 'plante médicinale',
      vitamin: 'vitamine',
    },
    humanTrialsOnly: 'Fondé uniquement sur des essais cliniques chez l’humain. Les données animales et in vitro sont exclues.',
    evidenceStrength: { strong: 'solides', moderate: 'modérées', preliminary: 'préliminaires', mixed: 'mitigées' },
    evidenceKey: {
      label: 'Légende des données probantes :',
      strong: 'Solides = plusieurs ECR concordants',
      moderate: 'Modérées = ECR plus petits ou moins nombreux',
      preliminary: 'Préliminaires = premiers essais ou petit échantillon',
      mixed: 'Mitigées = résultats contradictoires',
    },
    howToLabels: { dosage: 'Posologie', timing: 'Moment de la prise', withFood: 'Avec de la nourriture', cycling: 'Cycles', forms: 'Formes' },
    topStacks: 'Meilleurs stacks contenant {name}',
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
      productDescriptorByForm: { capsule: 'capsule nootropique quotidienne', tablet: 'comprimé nootropique quotidien', sachet: 'sachet nootropique quotidien', shot: 'shot nootropique quotidien', powder: 'poudre nootropique à diluer', softgel: 'capsule molle nootropique quotidienne', can: 'boisson nootropique quotidienne' },
      updated: 'Mis à jour :',
      lastVerified: 'Dernière vérification :',
      reviewedBy: "Évalué par l'équipe éditoriale de The Nootropic Lab",
    },
    dateLocale: 'fr-CA',
    score: { label: 'Notre score', outOf10: 'sur 10,0', aria: 'Score de {score} sur {max}' },
    stats: {
      price: 'Prix',
      monthUnit: 'mois',
      perServingUnit: 'dose',
      perDayUnit: 'jour',
      perServingLabel: 'Par dose',
      perDayLabel: 'Par jour',
      capsules: 'Gélules',
      dailyServing: 'Dose quotidienne',
      units: { capsule: 'gélules', tablet: 'comprimés', sachet: 'sachets', shot: 'shots', powder: 'doses', softgel: 'capsules molles', can: 'canettes' },
      unitsSingular: { capsule: 'gélule', tablet: 'comprimé', sachet: 'sachet', shot: 'shot', powder: 'dose', softgel: 'capsule molle', can: 'canette' },
      moneyBack: 'Remboursement',
      days: 'jours',
      daysCount: '{days} jours',
      daysCountShort: '{days} j',
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
    breadcrumbBestOf: 'Le meilleur',
    overview: {
      verdictEyebrow: 'Verdict',
      verdict: { good: '{product} est recommandé.', warn: '{product} vaut le coup d’œil.', bad: '{product} n’est pas à la hauteur.' },
      whatItDoes: 'Ce qu’il fait',
      howItWorks: 'Comment il agit',
      whatToExpect: 'À quoi s’attendre',
      heroIngredients: 'Ingrédients vedettes',
      whoItsFor: 'Pour qui',
      whoShouldSkip: 'Qui devrait s’en passer',
    },
    reviews: {
      noProfileHeading: 'Aucun profil Trustpilot',
      noProfileBody: '{brand} n’a pas de fiche Trustpilot active — c’est courant pour les vendeurs présents uniquement sur Amazon, les marques de places de marché et les chaînes de pharmacies régionales.',
      noProfileTrust: 'Le pilier Confiance de notre score éditorial s’applique toujours et reflète la réputation de la marque, les analyses par des tiers et l’historique des remboursements.',
      starsAria: '{score} étoiles sur 5',
      countOnTrustpilot: '{count} évaluations sur Trustpilot',
      verifiedCount: '{count} évaluations vérifiées',
      noCherryPicking: 'Nous n’intégrons pas ici de citations triées sur le volet. Trustpilot est la source de référence — le score ci-dessus alimente notre pilier Confiance.',
      readAll: 'Lire les {count} évaluations sur Trustpilot →',
    },
    regionalBuying: {
      heading: {
        us: 'Acheter aux États-Unis',
        eu: 'Acheter dans l’UE',
        ca: 'Acheter au Canada',
        au: 'Acheter en Australie',
        jp: 'Acheter au Japon',
        latam: 'Acheter en Amérique latine',
        gcc: 'Acheter dans le Golfe',
        sea: 'Acheter en Asie du Sud-Est',
      },
      price: 'Prix local',
      monthUnit: 'mois',
      status: 'Statut',
      whereToBuy: 'Où acheter',
      importPathway: 'Voie d’importation',
      regulator: {
        us: 'FDA (supplément alimentaire au sens de la DSHEA)',
        eu: 'Complément alimentaire dans l’UE (allégations selon le règl. 1924/2006)',
        ca: 'Santé Canada (NPN)',
        au: 'TGA (AUST L)',
        jp: 'Agence de la consommation (FFC)',
        latam: 'ANVISA / COFEPRIS / INVIMA',
        gcc: 'SFDA / Municipalité de Dubaï',
        sea: 'HSA / NPRA / BPOM / FDA PH / FDA thaïlandaise',
      },
      geoHub: {
        us: 'Les meilleurs nootropiques aux États-Unis',
        eu: 'Guides par pays',
        ca: 'Guides par province',
        au: 'Guides par État et territoire',
        jp: 'Guides par préfecture',
        latam: 'Guides par pays',
        gcc: 'Guides par pays',
        sea: 'Guides par pays',
      },
      licence: {
        npnNumber: 'NPN {npn}',
        npnLicensed: 'Titulaire d’une licence NPN',
        noNpn: 'Aucun NPN trouvé',
        noNpnChecked: 'Aucun NPN trouvé (vérifié le {date})',
        austl: 'AUST L {austl}',
        personalImportation: 'Régime d’importation personnelle',
        ffcNumber: 'Notification FFC {number}',
        ffcNotified: 'Notifié FFC',
        noFfc: 'Aucune notification FFC enregistrée',
        noFfcChecked: 'Aucune notification FFC trouvée (vérifié le {date})',
        euStorefront: 'Boutique dans l’UE',
        halalCertified: 'Certifié halal',
        noHalal: 'Aucun certificat halal présenté par la marque',
        noHalalChecked: 'Aucun certificat halal présenté par la marque (vérifié le {date})',
      },
    },
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
      short: { ingredients: 'ingrédients', dosing: 'dosage', transparency: 'transparence', value: 'valeur', trust: 'confiance' },
      shortScoreAria: 'Score {pillar} de {name}',
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
    minRead: '{minutes} min de lecture',
    indexHeading: 'Guides sur les nootropiques {year}',
    readGuide: 'Lire le guide →',
    backToGuides: '← Retour aux guides',
    categories: { beginner: 'Débutant', stacking: 'Combinaisons', usage: 'Utilisation', science: 'Sciences' },
  },
  byline: {
    attribution: 'Par l’équipe éditoriale de The Nootropic Lab',
    factChecked: '✓ Faits vérifiés',
    updated: 'Mis à jour le',
    readTime: '{minutes} min de lecture',
  },
  listicle: {
    bestNootropics: 'Meilleurs nootropiques',
    healthDisclaimer: 'Mise en garde santé',
    defaultHealthDisclaimer:
      'Cette page est fournie à titre informatif seulement et ne constitue pas un avis médical. Les suppléments nootropiques ne sont pas approuvés par la FDA pour diagnostiquer, traiter, guérir ou prévenir une maladie, y compris le TDAH ou d’autres troubles cognitifs. Ils ne sont pas équivalents aux stimulants sur ordonnance. Consultez toujours un professionnel de la santé qualifié avant de commencer un supplément, surtout si vous prenez des médicaments ou avez un problème de santé.',
    whatEvidenceSays: 'Ce que disent vraiment les données probantes',
    evidenceIntro:
      'Pour chaque ingrédient ci-dessous, nous renvoyons directement à la source révisée par des pairs. Le mécanisme d’un ingrédient n’est pas l’efficacité d’un produit — un produit peut contenir le bon ingrédient à la mauvaise dose.',
    sourceLink: 'Voir la source →',
    ourPicksFor: 'Nos choix pour {useCase}',
    picksIntro: 'Classés selon leur correspondance avec les données probantes ci-dessus + notre vérification éditoriale en 5 piliers.',
    topPick: 'Premier choix',
    whyItsHere: 'Pourquoi il figure ici :',
    checkProduct: 'Voir {name} →',
    readFullReview: 'Lire l’évaluation complète',
    faqHeading: 'Questions fréquentes',
    howWeChoose: 'Comment nous choisissons',
    howWeChooseBody:
      'Chaque choix doit (a) contenir au moins un ingrédient appuyé par des données probantes révisées par des pairs pour cet usage, (b) doser cet ingrédient à la dose des essais cliniques ou près de celle-ci, et (c) obtenir un score ≥ {minScore}/10 dans notre vérification éditoriale en 5 piliers. Consultez notre {link}.',
    fullMethodology: 'méthodologie complète',
    backToBest: '← Retour aux meilleurs nootropiques {year}',
    alsoConsideredHeading: 'Également examinés — sous notre seuil de {minScore}',
    alsoConsideredIntro:
      'Produits vérifiés pour ce guide dont le score est inférieur au {minScore}/10 exigé pour un choix classé dans notre vérification éditoriale en 5 piliers. Présentés par souci de transparence; ni classés ni recommandés.',
    belowBarReason: 'Score de {score}/10 — sous notre seuil de {minScore}',
    alsoConsideredRulesHeading: 'Également examinés — non classés',
    alsoConsideredRulesIntro:
      'Produits vérifiés pour ce guide que nous ne classons pas : chacun obtient un score inférieur au {minScore}/10 exigé pour un choix classé dans notre vérification éditoriale en 5 piliers, ou son étiquette n’atteint notre dose de référence pour aucune des entrées de données probantes ci-dessus (pour une combinaison, pour chacun de ses ingrédients). Présentés par souci de transparence; ni classés ni recommandés.',
    doseRuleReason:
      'Score de {score}/10, mais son étiquette n’atteint notre dose de référence pour aucune des entrées de données probantes ci-dessus (pour une combinaison, pour chacun de ses ingrédients)',
    alsoConsideredLinkIntro:
      'Produits vérifiés pour ce guide que nous ne classons pas : chacun obtient un score inférieur au {minScore}/10 exigé pour un choix classé dans notre vérification éditoriale en 5 piliers, ou son étiquette n’atteint notre dose de référence pour aucune des entrées de données probantes ci-dessus (pour une combinaison, pour chacun de ses ingrédients), ou cette édition n’affiche aucun lien d’achat pour lui. Présentés par souci de transparence; ni classés ni recommandés.',
    noPurchaseLinkReason: 'Score de {score}/10, mais cette édition n’affiche aucun lien d’achat pour ce produit; son évaluation explique pourquoi',
    alsoConsideredToc: 'Également examinés',
    audited: 'Vérifié',
    useCaseLabels: {
      focus: 'la concentration',
      memory: 'la mémoire',
      studying: 'les études',
      aging: 'le vieillissement',
    },
    moneyBackDays: '{days} j',
    moneyBackLabel: 'de garantie',
    ourScore: 'Notre score',
    relatedGuides: 'Guides connexes',
    relatedGuideLabels: {
      focus: 'Meilleurs nootropiques pour la concentration',
      memory: 'Meilleurs nootropiques pour la mémoire',
      studying: 'Meilleurs nootropiques pour les études',
      aging: 'Meilleurs nootropiques pour le vieillissement',
    },
    inThisGuide: 'Dans ce guide',
  },
  bestOf: {
    stats: { audited: 'Vérifiés', recommended: 'Recommandés', underdosed: 'Produit phare sous-dosé', avgMonthly: 'Moy. / mois' },
    subtitle: '{audited} vérifiés · {listed} affichés · méthodologie {version} · mis à jour le {date}',
    rank: 'Rang',
    commission: 'Commission',
    visit: 'Visiter →',
  },
  comparator: {
    heading: 'Comparateur',
    matchSummary: '{shown} sur {total} correspondent · sélectionnez jusqu’à {max} produits pour les comparer côte à côte',
    filters: 'Filtres',
    saveView: 'Enregistrer la vue',
    linkCopied: 'Lien copié dans le presse-papiers',
    clipboardError: 'Impossible d’accéder au presse-papiers',
    gridLabel: 'Comparaison des produits',
    columns: { product: 'Produit', score: 'Score', value: 'Rapport qualité-prix', price: 'Prix', trustpilot: 'Trustpilot', bestFor: 'Idéal pour' },
    noMatch: 'Aucun produit ne correspond.',
    resetFilters: 'Réinitialiser les filtres',
    compareAria: 'Comparer {name}',
    view: 'Voir →',
    viewAria: 'Voir {name}',
    containsCaffeine: 'caféine',
    filterDialog: 'Filtrer les produits',
    closeFilters: 'Fermer les filtres',
    showResults: 'Afficher {n} produits',
    showResultsOne: 'Afficher {n} produit',
    goal: 'Objectif',
    goalAria: 'Filtrer par objectif',
    goals: { any: 'Tous', focus: 'Concentration', memory: 'Mémoire', energy: 'Énergie', beginners: 'Débutants', budget: 'Petit budget' },
    maxPerMonth: 'Max. ≈ par {unit}',
    grade: 'Notre appréciation',
    grades: { all: 'Toutes', recommended: 'Recommandé', worthALook: 'À considérer', skip: 'À éviter' },
    caffeineFreeOnly: 'Sans caféine seulement',
    euStorefrontOnly: 'Boutique dans l’UE seulement',
    showCommission: 'Afficher notre commission',
    commissionNote: 'Ne modifie pas les scores',
    resetAll: 'Réinitialiser tous les filtres',
    compare: 'Comparer',
    selectedSummary: '{n} sélectionnés · côte à côte',
    clear: 'Effacer',
    daily: 'Par jour',
    caffeine: 'Caféine',
    caffeineFree: 'Sans',
  },
  ingredientLibrary: {
    heading: 'Bibliothèque d’ingrédients',
    guideHeading: 'Guide des ingrédients nootropiques {year}',
    dek: '{n} ingrédients · évalués selon les données des ECR et leur cohérence · notes en langage simple',
    filterAria: 'Filtrer par niveau de preuve',
    allGrades: 'Tous les niveaux',
    grade: 'Niveau {grade}',
    legendCount: '{n} ingrédients · Niveau {grade}',
    descriptors: { A: 'Plusieurs ECR concordants', B: 'ECR plus petits ou moins nombreux', C: 'Préliminaires ou mitigées' },
    empty: 'Aucun ingrédient de niveau {grade} dans ce catalogue pour le moment.',
    seeAll: 'Voir tous les niveaux →',
    columns: { grade: 'Niveau', ingredient: 'Ingrédient', clinicalDose: 'Dose clinique', trials: 'Essais', ourTake: 'Notre avis' },
    gradeAria: 'Niveau de preuve {grade}',
    studyCounts: 'Nombre d’études par effet pour {name} : {counts}',
    notCounted: 'non compté',
    showingAll: 'Affichage des {n} ingrédients',
    showingGrade: 'Affichage de {n} ingrédients de niveau {grade}',
    showingGradeOne: 'Affichage de {n} ingrédient de niveau {grade}',
  },
  geo: {
    bestIn: 'Meilleurs nootropiques : {place} {year}',
    topPicksFor: 'Meilleurs choix pour les acheteurs : {place}',
    score: 'Score :',
  },
  editorialStandards: {
    heading: 'Normes éditoriales',
    reviewProtocol: '1. Protocole d’évaluation',
    conflictOfInterest: '2. Politique sur les conflits d’intérêts',
    sourceCitation: '3. Politique de citation des sources',
    correction: '4. Politique de correction',
    teamIdentity: '5. Identité de l’équipe éditoriale',
    regionalFraming: '6. Cadre réglementaire propre à chaque région',
    contact: 'Joindre l’équipe éditoriale',
  },
  shortlist: {
    save: 'Enregistrer',
    saved: 'Enregistré',
    saveAria: 'Ajouter à ma présélection',
    removeAria: 'Retirer de ma présélection',
  },
  // No-break space before the colon (French typography).
  typography: { colon: '\u00a0: ', space: ' ' },
};

const translations: Record<Locale, UIStrings> = { en, es, fr, ja, pt, de, 'fr-CA': frCa };

export function getStrings(locale: Locale): UIStrings {
  return translations[locale] || translations.en;
}

// JP is English: Japanese copy on the JP host is paused until a Japanese
// pharmaceutical-advertising lawyer has reviewed it (owner decision
// 2026-10-13). The ja bundle above stays, unused on JP.
export function getLocaleForMarket(market: string): Locale {
  switch (market) {
    case 'latam': return 'es';
    default: return 'en';
  }
}
