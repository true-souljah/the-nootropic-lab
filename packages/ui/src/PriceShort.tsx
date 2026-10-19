import type { LocalPrice } from '@nootropic/data';
import { localPriceShort, packLangAttr, type PriceText } from './price-text';

interface LineProps {
  /** The line as one string (PriceText.short, localPriceShort). */
  text: string;
  /** The store's pack words when the line ends with them (no stated supply), else null. */
  packText: string | null;
  /** Their `lang` on this page (packLangAttr); undefined where it is the page's own. */
  lang: string | undefined;
  /** Joined to the line ("Ver precio (" … ") →"). */
  before?: string;
  after?: string;
}

/**
 * A short price line — "≈ US$53.30/mo", or "US$159 · 1 x Qualia Mind 2.0 -
 * 120 count Boxed" when the pack's supply is not stated — whose store pack
 * words (verbatim, usually English) carry `lang` on a page in another
 * language (WCAG 3.1.2). With nothing to mark it is the plain string, as one
 * text node, so that markup is unchanged.
 */
function Line({ text, packText, lang, before = '', after = '' }: LineProps) {
  if (!lang || packText === null) return <>{`${before}${text}${after}`}</>;
  return (
    <>
      {`${before}${text.slice(0, text.length - packText.length)}`}
      <span lang={lang}>{packText}</span>
      {after ? after : null}
    </>
  );
}

/** PriceText.short with the pack words marked; `fallback` ("—") without a store price. */
export function PriceShort({ price, before, after, fallback = '—' }: { price: PriceText | null | undefined; before?: string; after?: string; fallback?: string }) {
  if (!price) return <>{fallback}</>;
  return <Line text={price.short} packText={price.monthly ? null : price.packText} lang={price.packLangAttr} before={before} after={after} />;
}

/** A regional block's price (localPriceShort) with the pack words marked for a page in `pageLocale`. */
export function LocalPriceShort({ price, monthUnit, pageLocale }: { price: LocalPrice; monthUnit: string; pageLocale: string }) {
  return (
    <Line
      text={localPriceShort(price, monthUnit)}
      packText={price.monthly ? null : price.packText}
      lang={packLangAttr(price.packLang, pageLocale)}
    />
  );
}
