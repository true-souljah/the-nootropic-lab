// The single gate for outbound purchase links.
//
// Every template and page reads a product's vendor URL through
// `purchaseUrl()` (or `vendorHost()` for the non-purchase uses: the Trustpilot
// domain and the analytics link domain). It returns null when the record
// carries `noPurchaseLink`, and the CTA renders a notice instead
// (NoPurchaseLinkNotice in @nootropic/ui). purchase-link.test.ts fails when a
// template, page or data module other than this one names the vendor-URL
// field, so a new CTA cannot bypass the gate.
//
// Site-owner decision 2026-10-08: the Japanese edition shows no purchase link
// for products whose formula contains an ingredient from a plant on Japan's
// MHLW list of ingredients used exclusively as medicines. The products stay
// on the site (review pages, lists); only the links go.
//
// Site-owner decision 2026-10-12: the same gate covers a store that no longer
// sells the product (NatureBell's amazon.ca and amazon.com.au listings return
// 404; amazon.sg shows "Currently unavailable"): a notice replaces the dead link.
//
// Type-only imports: client components import this module, so it must not
// pull a catalogue JSON or the i18n bundles into the browser.

import type { Product, NoPurchaseLink, NoPurchaseLinkMhlw, NoPurchaseLinkReason } from './products-us';
import type { Locale } from './i18n';

/** The vendor URL to link to, or null when this edition must not link to a shop for the product. */
export function purchaseUrl(product: Pick<Product, 'affiliateUrl' | 'noPurchaseLink'>): string | null {
  // A stray `null` in JSON must not block a product (validate-data rejects it).
  return product.noPurchaseLink != null ? null : product.affiliateUrl;
}

/**
 * Host of the vendor URL (e.g. "www.mindlabpro.com"), or null when the URL does
 * not parse. For uses that are not purchase links: the Trustpilot review domain
 * and the analytics `link_domain`. Never render it as a link to the vendor.
 */
export function vendorHost(product: Pick<Product, 'affiliateUrl'>): string | null {
  try {
    return new URL(product.affiliateUrl).host;
  } catch {
    return null;
  }
}

/** The block on a record, or null. */
export function purchaseLinkBlock(product: Pick<Product, 'noPurchaseLink'>): NoPurchaseLink | null {
  return product.noPurchaseLink ?? null;
}

/** Region whose records may carry each reason (null: any region). */
export const NO_PURCHASE_LINK_REASON_REGION: Readonly<Record<NoPurchaseLinkReason, string | null>> = {
  'jp-mhlw-medicine-only-ingredient': 'jp',
  'not-sold-on-linked-store': null,
};

/** "Ashwagandha (Withania somnifera)" — the ingredient list interpolated into the notice. */
export function noPurchaseLinkIngredientList(block: NoPurchaseLinkMhlw): string {
  return block.ingredients.map((i) => `${i.name} (${i.plant})`).join(', ');
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/**
 * Why a record's `noPurchaseLink` is malformed, or null. Absent = fine.
 * Rules: known reason, allowed for `region`. not-sold-on-linked-store: a store
 * name, an https `storeUrl` on that store's host, the listing's verbatim
 * `observed` text and a YYYY-MM-DD `checkedAt`. jp-mhlw: non-empty `ingredients`, each with
 * a name the record's formula lists (heroIngredients or an ingredientDosages
 * name, case-insensitive), a plant and the list entry; https `sourceUrl`;
 * YYYY-MM-DD `listUpdated` and `checkedAt`, checked no earlier than the update.
 */
export function noPurchaseLinkProblem(
  product: Pick<Product, 'noPurchaseLink' | 'heroIngredients' | 'ingredientDosages'>,
  region: string,
): string | null {
  if (!('noPurchaseLink' in product) || product.noPurchaseLink === undefined) return null;
  const block = product.noPurchaseLink as unknown;
  if (block === null || typeof block !== 'object') return `noPurchaseLink is not an object: ${JSON.stringify(block)}`;
  const { reason, ingredients, sourceUrl, listUpdated, checkedAt } = block as Record<string, unknown>;
  if (typeof reason !== 'string' || !(reason in NO_PURCHASE_LINK_REASON_REGION)) {
    return `noPurchaseLink.reason is not one of ${Object.keys(NO_PURCHASE_LINK_REASON_REGION).join(' | ')}: ${JSON.stringify(reason)}`;
  }
  const allowedRegion = NO_PURCHASE_LINK_REASON_REGION[reason as NoPurchaseLinkReason];
  if (allowedRegion !== null && region !== allowedRegion) return `noPurchaseLink.reason "${reason}" applies to ${allowedRegion} records only, not ${region}`;
  if (reason === 'not-sold-on-linked-store') return notSoldProblem(block as Record<string, unknown>);
  if (!Array.isArray(ingredients) || ingredients.length === 0) return 'noPurchaseLink.ingredients is empty';
  const formula = [
    ...(product.heroIngredients ?? []),
    ...(product.ingredientDosages ?? []).map((d) => d.name),
  ].map((n) => n.toLowerCase());
  for (const item of ingredients as unknown[]) {
    const { name, plant, listedAs } = (item ?? {}) as Record<string, unknown>;
    if (typeof name !== 'string' || !name.trim()) return 'noPurchaseLink.ingredients has an entry without a name';
    if (typeof plant !== 'string' || !plant.trim()) return `noPurchaseLink.ingredients "${name}" has no plant`;
    if (typeof listedAs !== 'string' || !listedAs.trim()) return `noPurchaseLink.ingredients "${name}" has no listedAs entry`;
    if (!formula.some((f) => f.includes(name.toLowerCase()))) {
      return `noPurchaseLink.ingredients "${name}" is not in the record's heroIngredients or ingredientDosages`;
    }
  }
  if (typeof sourceUrl !== 'string') return 'noPurchaseLink.sourceUrl is missing';
  let parsed: URL;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    return `noPurchaseLink.sourceUrl is not an absolute URL: "${sourceUrl}"`;
  }
  if (parsed.protocol !== 'https:') return `noPurchaseLink.sourceUrl is not https: "${sourceUrl}"`;
  if (!isIsoDate(listUpdated)) return `noPurchaseLink.listUpdated is not a YYYY-MM-DD date: ${JSON.stringify(listUpdated)}`;
  if (!isIsoDate(checkedAt)) return `noPurchaseLink.checkedAt is not a YYYY-MM-DD date: ${JSON.stringify(checkedAt)}`;
  if (checkedAt < listUpdated) return `noPurchaseLink.checkedAt ${checkedAt} is before listUpdated ${listUpdated}`;
  return null;
}

function notSoldProblem(block: Record<string, unknown>): string | null {
  const { store, storeUrl, observed, checkedAt } = block;
  if (typeof store !== 'string' || !store.trim()) return 'noPurchaseLink.store is missing';
  if (typeof storeUrl !== 'string') return 'noPurchaseLink.storeUrl is missing';
  let parsed: URL;
  try {
    parsed = new URL(storeUrl);
  } catch {
    return `noPurchaseLink.storeUrl is not an absolute URL: "${storeUrl}"`;
  }
  if (parsed.protocol !== 'https:') return `noPurchaseLink.storeUrl is not https: "${storeUrl}"`;
  const host = parsed.hostname.toLowerCase();
  const name = store.trim().toLowerCase();
  if (host !== name && !host.endsWith(`.${name}`)) return `noPurchaseLink.storeUrl host ${host} is not on ${store}`;
  if (typeof observed !== 'string' || !observed.trim()) return 'noPurchaseLink.observed must be the listing\'s verbatim text';
  if (!isIsoDate(checkedAt)) return `noPurchaseLink.checkedAt is not a YYYY-MM-DD date: ${JSON.stringify(checkedAt)}`;
  return null;
}

/** Notice strings (one bundle per locale; wired into UIStrings.noPurchaseLink by ./i18n). */
export interface NoPurchaseLinkStrings {
  /** BCP-47 language of `label`, `jpMhlwReason`, `sourceLink` and `sourceDates`. */
  lang: string;
  /** Short text that replaces a buy CTA, and the notice's lead-in. */
  label: string;
  /** Reason line for `jp-mhlw-medicine-only-ingredient`; `{ingredients}` is the ingredient list. */
  jpMhlwReason: string;
  /** The same reason in Japanese for Japanese readers; always rendered with lang="ja". */
  jpMhlwReasonJa: string;
  /** Link text for the source document. */
  sourceLink: string;
  /** Dates after the source link; `{listUpdated}` and `{checkedAt}` are YYYY-MM-DD. */
  sourceDates: string;
  /** Short text for `not-sold-on-linked-store` (replaces a buy CTA; the notice's lead-in). */
  notSoldLabel: string;
  /** Reason line for `not-sold-on-linked-store`; `{store}`, `{observed}` (verbatim, English) and `{checkedAt}` (YYYY-MM-DD). */
  notSoldReason: string;
}

// Site-owner wording, 2026-10-08. "may" (可能性がある) on purpose: the notice
// reports the list entry; it does not say the product is a drug or illegal.
const JP_MHLW_REASON_JA = '日本では医薬品として扱われる原料を含む可能性があるため、本サイトでは購入リンクを掲載しません。';

const EN: NoPurchaseLinkStrings = {
  lang: 'en',
  label: 'No purchase link in Japan',
  jpMhlwReason:
    'this product contains {ingredients}, an ingredient from a plant that Japan’s Ministry of Health, Labour and Welfare (MHLW) lists as used exclusively in medicines.',
  jpMhlwReasonJa: JP_MHLW_REASON_JA,
  sourceLink: 'MHLW list (PDF, in Japanese)',
  sourceDates: 'list updated {listUpdated}; checked {checkedAt}',
  notSoldLabel: 'No purchase link',
  notSoldReason: 'the {store} listing we linked to showed “{observed}” when we checked on {checkedAt}, so we show no purchase link.',
};

export const NO_PURCHASE_LINK_STRINGS: Readonly<Record<Locale, NoPurchaseLinkStrings>> = {
  en: EN,
  es: {
    lang: 'es',
    label: 'Sin enlace de compra en Japón',
    jpMhlwReason:
      'este producto contiene {ingredients}, un ingrediente procedente de una planta que el Ministerio de Salud, Trabajo y Bienestar de Japón (MHLW) incluye en su lista de uso exclusivo en medicamentos.',
    jpMhlwReasonJa: JP_MHLW_REASON_JA,
    sourceLink: 'Lista del MHLW (PDF, en japonés)',
    sourceDates: 'lista actualizada el {listUpdated}; consultada el {checkedAt}',
    notSoldLabel: 'Sin enlace de compra',
    notSoldReason: 'el anuncio de {store} al que enlazábamos mostraba «{observed}» cuando lo comprobamos el {checkedAt}, así que no mostramos enlace de compra.',
  },
  fr: {
    lang: 'fr',
    label: 'Aucun lien d’achat au Japon',
    jpMhlwReason:
      'ce produit contient {ingredients}, un ingrédient issu d’une plante que le ministère japonais de la Santé, du Travail et des Affaires sociales (MHLW) inscrit sur sa liste des ingrédients à usage exclusivement médicamenteux.',
    jpMhlwReasonJa: JP_MHLW_REASON_JA,
    sourceLink: 'Liste du MHLW (PDF, en japonais)',
    sourceDates: 'liste mise à jour le {listUpdated} ; consultée le {checkedAt}',
    notSoldLabel: 'Aucun lien d’achat',
    notSoldReason: 'la fiche {store} vers laquelle nous renvoyions affichait « {observed} » lors de notre vérification du {checkedAt} ; nous n’affichons donc pas de lien d’achat.',
  },
  // The Japanese edition's body copy is English while its translation is
  // paused (site-owner decision 2026-10-08), so its bundle carries the English
  // line (lang "en") and the notice adds the Japanese line beside it. When the
  // translation resumes, translate these and set lang to "ja".
  ja: EN,
  pt: {
    lang: 'pt',
    label: 'Sem link de compra no Japão',
    jpMhlwReason:
      'este produto contém {ingredients}, um ingrediente proveniente de uma planta que o Ministério da Saúde, Trabalho e Bem-Estar do Japão (MHLW) inclui na sua lista de uso exclusivo em medicamentos.',
    jpMhlwReasonJa: JP_MHLW_REASON_JA,
    sourceLink: 'Lista do MHLW (PDF, em japonês)',
    sourceDates: 'lista atualizada a {listUpdated}; consultada a {checkedAt}',
    notSoldLabel: 'Sem link de compra',
    notSoldReason: 'o anúncio da {store} para o qual apontávamos mostrava «{observed}» quando o verificámos a {checkedAt}, por isso não mostramos link de compra.',
  },
  de: {
    lang: 'de',
    label: 'Kein Kauflink in Japan',
    jpMhlwReason:
      'Dieses Produkt enthält {ingredients}, einen Inhaltsstoff aus einer Pflanze, die das japanische Ministerium für Gesundheit, Arbeit und Soziales (MHLW) als ausschließlich in Arzneimitteln verwendet listet.',
    jpMhlwReasonJa: JP_MHLW_REASON_JA,
    sourceLink: 'MHLW-Liste (PDF, auf Japanisch)',
    sourceDates: 'Liste aktualisiert am {listUpdated}; geprüft am {checkedAt}',
    notSoldLabel: 'Kein Kauflink',
    notSoldReason: 'Das Angebot bei {store}, auf das wir verlinkt hatten, zeigte bei unserer Prüfung am {checkedAt} „{observed}“, daher zeigen wir keinen Kauflink.',
  },
  'fr-CA': {
    lang: 'fr-CA',
    label: 'Aucun lien d’achat au Japon',
    jpMhlwReason:
      'ce produit contient {ingredients}, un ingrédient issu d’une plante que le ministère japonais de la Santé, du Travail et des Affaires sociales (MHLW) inscrit sur sa liste des ingrédients à usage exclusivement médicamenteux.',
    jpMhlwReasonJa: JP_MHLW_REASON_JA,
    sourceLink: 'Liste du MHLW (PDF, en japonais)',
    sourceDates: 'liste mise à jour le {listUpdated}; consultée le {checkedAt}',
    notSoldLabel: 'Aucun lien d’achat',
    notSoldReason: 'la fiche {store} vers laquelle nous renvoyions affichait « {observed} » lors de notre vérification du {checkedAt}; nous n’affichons donc pas de lien d’achat.',
  },
};
