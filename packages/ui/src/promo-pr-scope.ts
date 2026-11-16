import { AUTO_MERGE_KINDS, PROMO_REGIONS, type PromoProduct, validatePromoFile } from './promos';

export const PROMO_BRANCH_AUTO = /^promo-auto\//;
export const PROMO_BRANCH_REVIEW = /^promo-review\//;
const PATH = /^packages\/data\/promos\/(us|eu|ca|au|latam|gcc|sea)\.json$/;

export function isPromoPr({ headRef, title }: { headRef: string; title: string }): boolean {
  return PROMO_BRANCH_AUTO.test(headRef) || PROMO_BRANCH_REVIEW.test(headRef) || /^\s*promo:/i.test(title);
}
export function checkPromoPr(input: { headRef: string; title: string; changedPaths: string[]; base: Record<string, unknown>; head: Record<string, unknown>; productsByRegion: Record<string, readonly PromoProduct[]> }): { promo: boolean; ok: boolean; violations: string[] } {
  const promo = isPromoPr(input); if (!promo) return { promo, ok: true, violations: [] };
  const violations: string[] = [];
  if (!input.changedPaths.length) violations.push('promo PR has no changed paths');
  for (const path of input.changedPaths) {
    const match = PATH.exec(path);
    if (!match) { violations.push(path === 'packages/data/promos/jp.json' ? `${path}: JP hold permits no promo file` : `disallowed path: ${path}`); continue; }
    if (!(path in input.head)) { violations.push(`${path}: promo file was deleted`); continue; }
    try { validatePromoFile(input.head[path], { region: match[1], products: input.productsByRegion[match[1]] ?? [] }); }
    catch (error) { violations.push(`${path}: ${(error as Error).message}`); continue; }
    if (PROMO_BRANCH_AUTO.test(input.headRef)) {
      const oldRows = (input.base[path] as { promos?: unknown[] } | undefined)?.promos;
      const oldById = new Map((Array.isArray(oldRows) ? oldRows : []).filter((x): x is { id: string } => !!x && typeof x === 'object' && typeof (x as { id?: unknown }).id === 'string').map((x) => [x.id, x]));
      const rows = (input.head[path] as { promos: { id: string; regulated: boolean; kind: string }[] }).promos;
      for (const row of rows) if (JSON.stringify(oldById.get(row.id)) !== JSON.stringify(row) && (row.regulated || !(AUTO_MERGE_KINDS as readonly string[]).includes(row.kind))) violations.push(`${path}: promo "${row.id}" is not eligible for promo-auto`);
    }
  }
  return { promo, ok: violations.length === 0, violations };
}
