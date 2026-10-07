import productsUSData from './products-us.json';
import { activeProducts } from './product-status';
import type { ScoreBreakdown, Scored } from './scoring';

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
  /**
   * Composite review score = computeScore(scoreBreakdown) (scoring.ts): the
   * PILLAR_WEIGHTS-weighted sum rounded to one decimal, written by
   * `npm run recompute-scores` and enforced by `npm run validate-data`.
   * `null` = unscored: at least one pillar is missing, so the product is
   * left out of every ranked, sorted or compared surface and its review page
   * shows the "not scored" state instead of a number.
   */
  score: number | null;
  /** Pillar scores 0-10; a `null` pillar could not be scored from the available data. */
  scoreBreakdown: ScoreBreakdown;
  priceMonthlyUSD?: number;
  priceMonthlyEUR?: number;
  priceMonthlyCAD?: number;
  priceMonthlyAUD?: number;
  priceMonthlyJPY?: number;
  pricingModel: 'one-time' | 'subscription' | 'both';
  moneyBackDays: number;
  caffeineFree: boolean;
  euStorefront: boolean;
  /**
   * Legacy self-asserted flag, NOT rendered anywhere: no regulator record
   * backs it, so badges, chips and filters use `euStorefront` instead.
   */
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
  /**
   * Units of `form` per daily serving (capsules, tablets, sachets, shots,
   * powder scoops or softgels — the name predates `form`). Render it through
   * `servingAmount()` / `servingUnit()` (serving-unit.ts), never with
   * hard-coded capsule wording.
   */
  capsulesPerServing: number;
  /**
   * Dosage form of one unit. Absent = `'capsule'` (the default for most
   * records). `'powder'` = one scoop of a drink powder. `'softgel'` = a soft
   * gel capsule (gelatin or plant-based shell), such as an omega-3 NutriGel.
   * Validated by `formProblem()` in product-rules.ts.
   */
  form?: 'capsule' | 'tablet' | 'sachet' | 'shot' | 'powder' | 'softgel';
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
   * carried when documented. `notified: false` means only that the CAA
   * notification database returned no row for the product and company names
   * searched on `checkedAt` (queries in `basis`); it is not evidence that the
   * product is outside the system under some other name, and copy must say
   * "no FFC notification found", never "not notified". Undefined for
   * products not surfaced to JP.
   */
  ffcStatus?: {
    notified: boolean;
    notificationNumber?: string;
    /** ISO date (YYYY-MM-DD) the CAA database was checked. */
    checkedAt?: string;
    /** One line: the row confirmed, or the queries that returned no row. */
    basis?: string;
  };
  /**
   * Australian Therapeutic Goods Administration AUST L (Listed Medicine)
   * number. Only meaningful on products served by the AU market app. When
   * present, the product is TGA-listed and can be sold at any Australian
   * pharmacy without import friction. Undefined for products imported via
   * the TGA Personal Importation Scheme (3-month personal-use supply).
   */
  austl?: string;
  /** Region-record extras (SEA catalogue and per-region notes). Optional; rendered by the "Buying in <region>" block when present. */
  notes?: string | string[];
  distributionChannels?: string[];
  distributionChannelsSea?: string[];
  importPathway?: string;
  regulatoryNote?: string;
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
  /**
   * Optional per-product SEO override for the review page `<title>` (the
   * text before the layout's `%s | The Nootropic Lab …` brand suffix).
   * When set, the region's `[slug]` `generateMetadata` prefers this over
   * the default `"{name} Review {year} — Independent Score & Ingredient
   * Audit"` template. Use ONLY to fix a specific page's CTR (page-1,
   * zero-click) — do not set it network-wide. Because each region app
   * reads only its own `products-{region}.json`, setting this on a product
   * in one region's data file cannot leak into any other region's page.
   * Keep ≤ ~60 chars (the brand suffix is appended by the layout template).
   */
  seoTitle?: string;
  /**
   * Optional per-product SEO override for the review page meta description.
   * Same gating semantics as `seoTitle` — preferred over the default
   * `"Independent review of {name}. Score: {score}/10. …"` template only
   * when set. Keep ≤ 155 chars. Ground every claim in on-page facts; never
   * fabricate ratings.
   */
  seoDescription?: string;
  /** ISO date (YYYY-MM-DD) of the last check of this record against the vendor's own pages. */
  verifiedAt?: string;
  /** ISO date (YYYY-MM-DD) the `trustpilotScore` / `trustpilotCount` pair was last read from Trustpilot. */
  trustpilotCheckedAt?: string;
  /**
   * Set when the vendor no longer sells this product. The review page stays
   * published (it still has search demand) but renders a discontinued notice
   * instead of buy CTAs, and the product is excluded from every
   * recommendation surface (see `activeProducts` in ./product-status).
   */
  discontinued?: {
    /** ISO date the discontinuation was confirmed. */
    since: string;
    /** Slug of the review page readers should go to instead, when one exists. */
    successorSlug?: string;
    /** Reader-facing explanation, shown verbatim in the notice. */
    note: string;
  };
}

/** A product with a composite score and every pillar scored — the only kind a ranked, sorted or compared surface may show. */
export type ScoredProduct = Product & Scored;

/** Every US record, including discontinued ones — review pages, sitemap, hreflang. */
export const allProductsUS: Product[] = productsUSData as Product[];
/** US records that can be recommended (discontinued products excluded). */
export const productsUS: Product[] = activeProducts(allProductsUS);
