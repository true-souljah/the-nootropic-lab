import productsUSData from './products-us.json';

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


export const productsUS: Product[] = productsUSData as Product[];
