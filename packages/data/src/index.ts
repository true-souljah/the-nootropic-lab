export type { Product, EUCompliance, Market, IngredientDosage, VendorTerm, VendorTerms, PriceBasis } from './products-us';
export { productsUS, allProductsUS } from './products-us';
export { productsEU, allProductsEU } from './products-eu';
export { productsCA, allProductsCA } from './products-ca';
export { productsAU, allProductsAU } from './products-au';
export { productsJP, allProductsJP } from './products-jp';
export { productsLatam, allProductsLatam } from './products-latam';
export { activeProducts, isDiscontinued } from './product-status';
export type { ProductImage, ProductImageFile, ProductImageVariant } from './product-images';
export { PRODUCT_IMAGE_SIZES, productImages, productImage } from './product-images';
export type { ProductForm } from './serving-unit';
export { PRODUCT_FORMS, productForm, servingUnit, servingAmount, servingsComparable } from './serving-unit';
export { affiliateUrlProblem, formulaProblem, formProblem, productRuleProblems, scoreProblem, weightedScore, pillarWeightPercent, UNSCORABLE_PILLARS, PILLAR_WEIGHTS, halalEvidenceProblem, HALAL_CERTIFIERS, vendorTermsProblems, VENDOR_TERM_FIELDS } from './product-rules';
export type { QuotedPrice, QuoteSupply, QuoteMonthly, PriceDerivation, SupplyFields } from './vendor-price';
export { DAYS_PER_MONTH, SERVINGS_PER_DAY, parseAmount, parseQuotedPrices, quoteSupply, currencyDigits, monthlyPriceFromQuote, deriveRegionalMonthlyPrice, priceBasisProblems } from './vendor-price';
export { NOT_AVAILABLE, outOfTen, pillarText, guaranteeDays, guaranteeDaysValue } from './display-values';
export type { DosingAnchor } from './dosing-anchors';
export { DOSING_ANCHORS, doseMg, dosingAnchorProblems } from './dosing-anchors';
export { SEO_TITLE_MAX, SEO_DESCRIPTION_MAX, seoOverrideProblems } from './seo-overrides';
export { productsGCC, allProductsGCC } from './products-gcc';
export { productsSEA, allProductsSEA } from './products-sea';
export type { Ingredient, HumanEffect, HowToTake, StackPair, FAQ, IngredientSource } from './ingredients';
export { ingredients } from './ingredients';
export type { Guide, GuideSection, GuideSource } from './guides';
export { guides, guideSources } from './guides';
export { guidesEs } from './guides-es';
export type { EUCountry } from './eu-countries';
export { euCountries } from './eu-countries';
export type { LatamCountry } from './latam-countries';
export { latamCountries } from './latam-countries';
export type { GCCCountry } from './gcc-countries';
export { gccCountries } from './gcc-countries';
export type { SEACountry } from './sea-countries';
export { seaCountries } from './sea-countries';
export type { CAProvince } from './ca-provinces';
export { caProvinces } from './ca-provinces';
export type { AUState } from './au-states';
export { auStates } from './au-states';
export type { JPPrefecture } from './jp-prefectures';
export { jpPrefectures } from './jp-prefectures';
export type { SearchItem, SearchItemMeta } from './search';
export { buildSearchIndex } from './search';
export type { Locale, UIStrings } from './i18n';
export { getStrings, getLocaleForMarket } from './i18n';
export { buildRegionSearchContext } from './region-search';
export type { RegionSearchContext } from './region-search';
export type { Author } from './authors';
export { authors, getAuthorBySlug, buildPersonSchema, buildPersonAuthorReference } from './authors';
export { buildProductSchema } from './product-schema';
export type { DisclaimerMarket } from './regional-disclaimers';
export { getRegionalHealthDisclaimer } from './regional-disclaimers';
export type { AnmatProhibitedCompound, AnmatProhibitedProduct, AnmatBasis } from './anmat-prohibited';
export {
  ANMAT_DISPOSICION_2105_2022,
  anmatProhibitedProducts,
  anmatProhibitedCompounds,
  findAnmatBannedIngredients,
  productContainsAnmatBanned,
  auditProductsForAnmat,
} from './anmat-prohibited';

// Regional overlay (2026-09 audit: de-duplicate the cloned guide/ingredient pages)
export type {
  RegionCode as RegionalRegionCode,
  RegionProfile,
  RegionLabels,
  LicenceStatus,
  LocalPrice,
  RegionalNote,
  RegionalNotes,
  RegionalSource,
  RegionalBuying,
} from './regional';
export {
  REGION_PROFILES,
  REGIONAL_NOTES,
  licenceStatus,
  localPrice,
  regionalGuideNote,
  regionalIngredientNote,
  regionalTitleQualifier,
  validateRegionalNotes,
  buildRegionalBuying,
  hasRegionalBuyingContent,
} from './regional';

// Route availability per region (GSC 404 cleanup, 2026-09)
export { ALL_REGIONS, REGION_ONLY_ROUTES, routeAvailableIn, regionsWithProduct } from './routes';

// Sitemap <lastmod> from content history (2026-09 GSC work)
export { routeDates, contentFileDate, latestDate } from './sitemap-dates';

// PubMed citation allow-list (2026-10-06 citation audit)
export type { Citation } from './citations';
export { CITATIONS } from './citations';
