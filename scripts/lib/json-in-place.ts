// In-place JSON editing for the products-<region>.json files: locate value
// spans with a minimal scanner so a change touches only its own key — no
// re-serialisation, so existing formatting (such as "4.0" and the missing
// final newlines) stays. Shared by scripts/import-vendor-terms.ts and
// scripts/derive-prices-from-vendor-quotes.ts.

export function skipWs(s: string, i: number): number {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
}

export function stringEnd(s: string, i: number): number {
  if (s[i] !== '"') throw new Error(`expected a string at ${i}`);
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === '\\') j++;
    else if (s[j] === '"') return j + 1;
  }
  throw new Error(`unterminated string at ${i}`);
}

export function valueEnd(s: string, i: number): number {
  const c = s[i];
  if (c === '"') return stringEnd(s, i);
  if (c === '{' || c === '[') {
    const close = c === '{' ? '}' : ']';
    let j = skipWs(s, i + 1);
    if (s[j] === close) return j + 1;
    for (;;) {
      if (c === '{') {
        j = skipWs(s, stringEnd(s, j));
        if (s[j] !== ':') throw new Error(`expected ':' at ${j}`);
        j = skipWs(s, j + 1);
      }
      j = skipWs(s, valueEnd(s, j));
      if (s[j] === ',') j = skipWs(s, j + 1);
      else if (s[j] === close) return j + 1;
      else throw new Error(`expected ',' or '${close}' at ${j}`);
    }
  }
  const m = /^(-?\d+(\.\d+)?([eE][+-]?\d+)?|true|false|null)/.exec(s.slice(i, i + 40));
  if (!m) throw new Error(`unexpected token at ${i}`);
  return i + m[0].length;
}

export interface Member {
  key: string;
  keyStart: number;
  valueStart: number;
  valueEnd: number;
}

/** Top-level members of the object starting at `start`. */
export function members(s: string, start: number): Member[] {
  const list: Member[] = [];
  let j = skipWs(s, start + 1);
  if (s[j] === '}') return list;
  for (;;) {
    const keyStart = j;
    const keyEnd = stringEnd(s, j);
    const key = JSON.parse(s.slice(j, keyEnd)) as string;
    j = skipWs(s, keyEnd);
    if (s[j] !== ':') throw new Error(`expected ':' at ${j}`);
    const valueStart = skipWs(s, j + 1);
    const end = valueEnd(s, valueStart);
    list.push({ key, keyStart, valueStart, valueEnd: end });
    j = skipWs(s, end);
    if (s[j] === ',') j = skipWs(s, j + 1);
    else if (s[j] === '}') return list;
    else throw new Error(`expected ',' or '}' at ${j}`);
  }
}

/** Start offsets of the objects in the top-level array. */
export function recordStarts(s: string): number[] {
  let j = skipWs(s, 0);
  if (s[j] !== '[') throw new Error('products file is not a JSON array');
  const starts: number[] = [];
  j = skipWs(s, j + 1);
  while (s[j] !== ']') {
    starts.push(j);
    j = skipWs(s, valueEnd(s, j));
    if (s[j] === ',') j = skipWs(s, j + 1);
  }
  return starts;
}

/** `value` as indented JSON whose continuation lines sit at `indent`. */
export function serialise(value: unknown, indent: string): string {
  return JSON.stringify(value, null, 2).replace(/\n/g, `\n${indent}`);
}

export type Edit = { start: number; end: number; text: string };

export function applyEdits(s: string, edits: Edit[]): string {
  let out = s;
  for (const e of [...edits].sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}
