// Basic consent mode for GA4 + Impact (operator decision 2026-09-30).
//
// Nothing tracker-related is requested before the visitor clicks Accept:
// the region layouts declare gtag.js / the GA init / the Impact tag as
// `type="text/plain"` scripts that Klaro activates only after consent, and
// the gtag.js URL is passed as `data-src` (not `src`) so Next.js does not
// emit a `<link rel="preload">` for it — that preload fetched
// googletagmanager.com on every first visit before any choice.
//
// This module is the single source for:
//   - the GA init snippet every layout injects (consent default denied →
//     update granted → js/config, so the first hit is already granted);
//   - the Klaro onAccept/onDecline handlers that re-grant / withdraw on the
//     same page and delete tracker cookies on the host AND parent domains;
//   - the "is analytics live right now" check that custom events gate on.
//
// Pure where possible (DOM shapes are injected) so it unit-tests in node.

/** Runtime state the GA init snippet publishes on `window`. */
export interface GaRuntimeState {
  id: string;
  /** true while GA is loaded AND the visitor's consent is granted. */
  active: boolean;
}

export const GA_STATE_KEY = '__nlGa';

export const GTAG_SRC_BASE = 'https://www.googletagmanager.com/gtag/js?id=';

export function gtagSrc(measurementId: string): string {
  return GTAG_SRC_BASE + measurementId;
}

const GA_ID_RE = /^G-[A-Z0-9]{4,20}$/;

/**
 * Inline GA4 init for the consent-gated `ga4-init` script. Runs only after
 * Klaro activates it (i.e. after Accept, on this page or a later one).
 * Order matters: the consent default must precede the update, and the
 * update must precede js/config so the first page_view carries gcs=G1x1.
 * ad_* signals stay denied — the site runs no ads.
 */
export function gaInitScript(measurementId: string): string {
  if (!GA_ID_RE.test(measurementId)) {
    throw new Error(`gaInitScript: "${measurementId}" is not a GA4 measurement id`);
  }
  return [
    'window.dataLayer = window.dataLayer || [];',
    'function gtag(){dataLayer.push(arguments);}',
    'window.gtag = gtag;',
    "gtag('consent', 'default', {ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied'});",
    "gtag('consent', 'update', {analytics_storage: 'granted'});",
    `window['ga-disable-${measurementId}'] = false;`,
    `window.${GA_STATE_KEY} = {id: '${measurementId}', active: true};`,
    "gtag('js', new Date());",
    `gtag('config', '${measurementId}');`,
  ].join('\n');
}

type GtagWindow = {
  gtag?: (...args: unknown[]) => void;
  [GA_STATE_KEY]?: GaRuntimeState;
  [key: string]: unknown;
};

/**
 * True only while GA is loaded and consent is granted. Custom events must
 * gate on this, NOT on `typeof gtag === 'function'`: the dataLayer stub can
 * exist without consent, and anything pushed into it would be sent after a
 * later Accept (operator decision 4).
 */
export function isAnalyticsActive(win: unknown): boolean {
  const w = win as GtagWindow | undefined;
  if (!w || typeof w.gtag !== 'function') return false;
  return w[GA_STATE_KEY]?.active === true;
}

/**
 * Domains a cookie set on `hostname` may live on: the host itself plus every
 * parent except the bare TLD. GA4's default cookie_domain 'auto' writes _ga
 * on the registrable domain (`.thenootropiclab.com` from jp.thenootropiclab.com),
 * which Klaro's own cleanup (host + `.host` only) never reaches.
 */
export function cookieDomainsFor(hostname: string): string[] {
  if (!hostname || /^[\d.]+$/.test(hostname) || !hostname.includes('.')) return [hostname].filter(Boolean);
  const parts = hostname.split('.');
  const out: string[] = [];
  for (let i = 0; i <= parts.length - 2; i++) out.push(parts.slice(i).join('.'));
  return out;
}

export interface CookieDocument {
  cookie: string;
}

/** Expire every cookie whose name matches one of `patterns`, on the host and all parent domains. */
export function expireCookies(doc: CookieDocument, hostname: string, patterns: RegExp[]): string[] {
  const names = doc.cookie
    .split(';')
    .map((c) => c.split('=')[0]?.trim() ?? '')
    .filter((n) => n && patterns.some((p) => p.test(n)));
  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/';
  for (const name of names) {
    doc.cookie = `${name}=; ${expire}`;
    for (const domain of cookieDomainsFor(hostname)) {
      doc.cookie = `${name}=; ${expire}; domain=${domain}`;
      doc.cookie = `${name}=; ${expire}; domain=.${domain}`;
    }
  }
  return names;
}

export const GA_COOKIE_PATTERNS = [/^_ga$/, /^_ga_/, /^_gid$/, /^_gat/];
export const IMPACT_COOKIE_PATTERNS = [/^IR_/, /^_ire/];

function browserWindow(): (GtagWindow & Window) | undefined {
  return typeof window === 'undefined' ? undefined : (window as unknown as GtagWindow & Window);
}

/** Klaro onDecline for google-analytics: stop GA on this page and delete its cookies. */
export function onGoogleAnalyticsDecline(): void {
  const w = browserWindow();
  if (!w) return;
  const ga = w[GA_STATE_KEY];
  if (ga) {
    ga.active = false;
    w[`ga-disable-${ga.id}`] = true;
    w.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  }
  expireCookies(document, location.hostname, GA_COOKIE_PATTERNS);
}

/**
 * Klaro onAccept for google-analytics. On the first Accept GA is not loaded
 * yet (Klaro activates the gated scripts right after this handler) — nothing
 * to do. After a withdraw → re-Accept on the same page, GA is already loaded
 * (the service is `onlyOnce`, so its scripts do not run twice): re-grant.
 */
export function onGoogleAnalyticsAccept(): void {
  const w = browserWindow();
  const ga = w?.[GA_STATE_KEY];
  if (!w || !ga) return;
  w[`ga-disable-${ga.id}`] = false;
  w.gtag?.('consent', 'update', { analytics_storage: 'granted' });
  ga.active = true;
}

/** Klaro onDecline for impact-com: delete the Impact UTT first-party cookies. */
export function onImpactDecline(): void {
  if (!browserWindow()) return;
  expireCookies(document, location.hostname, IMPACT_COOKIE_PATTERNS);
}
