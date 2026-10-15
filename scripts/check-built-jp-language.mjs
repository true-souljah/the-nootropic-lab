#!/usr/bin/env node
// Post-build JP language gate (owner decision 2026-10-13: Japanese copy on the
// JP host is paused until a Japanese pharmaceutical-advertising lawyer has
// answered the questions in the JP compliance guide; BACKLOG
// compliance:jp-japanese-paused-2026-10-13).
//
// For every built page under apps/jp/out/ it reads the static HTML (scripts,
// styles, templates and comments stripped) and fails when:
//   - the page is not <html lang="en">, or carries a <div lang> locale wrapper
//     (the consent banner and check-built-disclosure read the page language
//     from those);
//   - a page was built under /ja/ (the section is gone; _redirects 301s it);
//   - the chrome (header, nav and footer elements) carries any Japanese
//     character;
//   - a run of Japanese characters in visible text, the <title>, or an
//     aria-label / alt / title / placeholder value is neither inside an
//     element marked lang="ja" nor on the ALLOWLIST below;
//   - an ALLOWLIST entry matches nothing (the list stays honest).
// Every allowlisted run is pre-existing English-page text that names a
// Japanese term, product, label or source; the owner decides on each
// separately. Refuses to pass when it scanned no page.
//
//   node scripts/check-built-jp-language.mjs              # the gate
//   node scripts/check-built-jp-language.mjs --inventory  # every Japanese run, page by page
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'apps', 'jp', 'out');
const INVENTORY = process.argv.includes('--inventory');

/** Japanese script, CJK punctuation and full-width forms; not the ￥ currency sign (U+FFE5) of yen prices. */
const JA_RUN = /[　-〿぀-ヿㇰ-ㇿ㐀-䶿一-鿿！-～｡-ﾟ]+/g;
const CHROME = new Set(['header', 'nav', 'footer']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const NAME_ATTRS = ['aria-label', 'alt', 'title', 'placeholder'];

// Japanese runs allowed outside lang="ja", by reason. Built from the
// 2026-10-13 inventory of the English JP build; every entry is text that was
// on the page before the 2026-10-12/13 chrome translation (#385) or comes from
// product, vendor or source data. Nothing here is chrome.
const ALLOWLIST = [
  {
    reason: "Quoted claim wording inside English sentences, highest risk under the JP compliance guide (sections 3.3 and 6): the CAA-recorded function-claim text of notifications D295 (L-theanine) and D235 (Bacopa) on /ingredients/l-theanine/ and /ingredients/bacopa-monnieri/ (packages/data/src/regional-notes/jp.ts), and Suntory's sales claim quoted on the memory/aging listicles, /best-nootropics/ and its review (products-jp.json, listicle page files). Owner decision pending.",
    runs: [
      "本品にはバコパサポニンが含まれます。バコパサポニンには、認知機能の一部である記憶力（加齢により低下する日常生活で見聞きした情報を覚え、思い出す力）を維持する機能があることが報告されています。",
      "本品は",
      "テアニンを含みます。",
      "テアニンは起床時の疲労感や眠気の軽減をサポートすることが報告されています。また、",
      "テアニンは一過性の作業などによるストレス（精神的負担）を和らげる機能が報告されています。",
      "起床時の疲労感や眠気の軽減をサポートする",
      "「",
      "」",
      "サプリメント市場",
      "年連続売上",
    ],
  },
  {
    reason: "Page <title> text set before 2026-10-12: '(日本)' on /best-nootropics/, '(ノートロピクス)' on the home page, 'Imprint / 運営者情報' (page metadata in apps/jp/src/app).",
    runs: [
      "日本",
      "運営者情報",
      "ノートロピクス",
    ],
  },
  {
    reason: "The imprint's bilingual region note (apps/jp/src/app/imprint/page.tsx regionNote): its Japanese half is not marked lang=\"ja\" yet.",
    runs: [
      "日本国内で販売される機能性表示食品（",
      "）および特定保健用食品（",
      "）は、消費者庁への届出または許可を必要とします。届出のない輸入品については、本サイトは消費者体験および成分研究のレビューとして編集しており、薬機法（旧薬事法）の下で疾病治療を示唆する表現は行いません。",
    ],
  },
  {
    reason: "Japanese prefecture names (packages/data/src/jp-prefectures.ts nameJa) beside the English names on the home page, /prefectures/ and each prefecture page.",
    runs: [
      "東京都",
      "大阪府",
      "神奈川県",
      "愛知県",
      "埼玉県",
      "千葉県",
      "北海道",
      "福岡県",
    ],
  },
  {
    reason: "The en licence label 'FFC 届出 {number}' (packages/data/src/i18n.ts en.productDetail.regionalBuying.licence.ffcNumber, since 2026-09-04) on FANCL BRAINs' review and the guide pages' 'Products in Japan' block.",
    runs: [
      "届出",
    ],
  },
  {
    reason: "The home page tagline under the H1 (apps/jp/src/app/page.tsx), there before 2026-10-12.",
    runs: [
      "ノートロピクスの独立比較レビュー",
    ],
  },
  {
    reason: "Titles of Japanese sources in citation links (packages/data/src/regional-notes/jp.ts sources; the CAA database name on the FFC explainers).",
    runs: [
      "届出情報検索",
      "機能性表示食品について",
      "脳機能の向上等を標ぼうする医薬品等を個人輸入する場合の取扱いについて",
      "健康食品の正しい利用法",
      "食薬区分における成分本質（原材料）の取扱いの例示の一部改正について",
      "日薬生監麻発第",
      "号",
      "食薬区分における成分本質（原材料）の取扱いの例示",
      "日薬生監麻発",
      "第",
      "別添",
      "医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質（原材料）リスト",
      "植物由来物等",
      "年度",
      "機能性表示食品検証",
      "報告書",
      "診療報酬情報提供サービス",
      "医薬品コード",
      "省略漢字名称変更のお知らせ（令和",
      "月診療分から適用）",
    ],
  },
  {
    reason: "Japanese terms glossed in the English body copy of JP page files, there before 2026-10-12 (about, the FFC and Japanese-brain explainers, listicle text and FAQ, guides index, home): agency, law and food-category names, product and ingredient names, clinical terms.",
    runs: [
      "機能性表示食品",
      "消費者庁",
      "厚生労働省",
      "医師または薬剤師",
      "認知症",
      "ヤマブシタケ",
      "神経内科",
      "介護保険",
      "トクホ",
      "「国が審査を行いません」",
      "もの忘れの自覚",
      "かかりつけ医",
      "薬剤師",
      "アリセプト",
      "抹茶",
      "バコパサポニン",
      "ＤＨＡ＆ＥＰＡ＋セサミンＥＸ",
      "セサミン",
      "子実体",
      "試験前夜では遅すぎる",
      "受験",
      "覚せい剤取締法",
      "精神科",
      "受験シーズン",
      "商品名",
      "ＢＲＡＩＮｓ（ブレインズ）",
      "届出者",
      "株式会社ファンケル",
      "届出番号",
      "熟成ホップ由来苦味酸",
      "特定保健用食品",
      "薬機法",
      "特別用途食品",
      "いわゆる健康食品",
      "ノーマル食品",
      "撤回",
      "機能性表示食品の届出情報検索",
      "薬監証明",
      "年",
      "日",
      "イチョウ葉由来テルペンラクトン",
      "フラボノイド配糖体",
      "ルテイン",
      "医薬品・医薬部外品",
      "医薬品",
      "オメガエイド",
    ],
  },
  {
    reason: "FANCL BRAINs notification fields in packages/data/src/products-jp.json (its functional ingredients and the 機能性関与成分 label).",
    runs: [
      "バコパサポニン、熟成ホップ由来苦味酸",
      "機能性関与成分",
    ],
  },
  {
    reason: "JP regional notes on ingredient and guide pages (packages/data/src/regional-notes/jp.ts): regulatory list and notice names, ingredient and product names, notification titles, an NHI drug-code entry, dates.",
    runs: [
      "輸入確認証",
      "数量に関わらず",
      "海外からの入国者が国内滞在中の自己の治療のために携帯して輸入する場合を除いて",
      "栄養機能食品",
      "別添２「医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質（原材料）リスト」",
      "グリセロ",
      "ホスホコリン",
      "グリセリルホスホリルコリン／",
      "食薬区分",
      "別添１",
      "別添２",
      "令和",
      "月",
      "オトメアゼア",
      "オトメアゼナ",
      "バコパモニエラ",
      "バコパ（オトメアゼナ）は非医。",
      "「記憶の小箱」",
      "（バコパサポニン）",
      "「食薬区分における成分本質（原材料）の取扱いの例示」",
      "シチコリン注５００ｍｇ／２ｍＬ「日医工」",
      "２５％",
      "別添１「専ら医薬品として使用される成分本質（原材料）リスト」",
      "シチコリン注５００ｍｇ／２ｍＬ",
      "「食添」",
      "「ヘルス",
      "スイッチ",
      "睡眠」",
      "テアニン",
      "全草",
    ],
  },
];

function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function attr(attrs, name) {
  const m = new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(attrs);
  return m ? decode(m[1]) : null;
}

/** Every Japanese run on a page: { run, lang, chrome, where }. */
function japaneseRuns(html) {
  const runs = [];
  const htmlLang = /<html\b[^>]*\slang="([^"]+)"/.exec(html)?.[1] ?? '';
  const body = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<template\b[\s\S]*?<\/template>|<!--[\s\S]*?-->/g, ' ');
  const stack = [];
  const langOf = () => [...stack].reverse().find((e) => e.lang)?.lang ?? htmlLang;
  const inChrome = () => stack.some((e) => CHROME.has(e.tag));
  const where = () => stack.slice(-4).map((e) => e.tag).join('>');
  const collect = (text, source) => {
    for (const m of text.matchAll(JA_RUN)) runs.push({ run: m[0], lang: langOf(), chrome: inChrome(), where: `${where()} ${source}` });
  };
  for (const m of body.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"]|"[^"]*")*)>|([^<]+)/g)) {
    const [, close, rawTag, attrs = '', text] = m;
    if (text !== undefined) {
      collect(decode(text), 'text');
      continue;
    }
    const tag = rawTag.toLowerCase();
    if (close) {
      const i = stack.map((e) => e.tag).lastIndexOf(tag);
      if (i >= 0) stack.length = i;
      continue;
    }
    const own = attr(attrs, 'lang');
    const selfClosing = VOID.has(tag) || /\/\s*$/.test(attrs);
    stack.push({ tag, lang: own });
    for (const name of NAME_ATTRS) {
      const v = attr(attrs, name);
      if (v) collect(v, `@${name}`);
    }
    if (selfClosing) stack.pop();
  }
  return { htmlLang, runs };
}

if (!existsSync(join(OUT, 'index.html'))) {
  console.error('check-built-jp-language: no apps/jp/out/index.html — build JP first (npm run build:jp).');
  process.exit(2);
}

const allowed = new Map(ALLOWLIST.flatMap((g) => g.runs.map((r) => [r, g.reason])));
const used = new Set();
const failures = [];
const pages = walk(OUT);
let scannedRuns = 0;
for (const file of pages) {
  const page = `/${relative(OUT, file)}`.replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const { htmlLang, runs } = japaneseRuns(html);
  scannedRuns += runs.length;
  if (htmlLang !== 'en') failures.push(`${page}: <html lang="${htmlLang}">, expected "en"`);
  if (/<div lang="/.test(html)) failures.push(`${page}: a <div lang> locale wrapper`);
  if (/^\/ja(\/|$)/.test(page)) failures.push(`${page}: a page under /ja/ was built`);
  for (const r of runs) {
    if (INVENTORY) console.log(`${page}\t${r.lang === 'ja' ? 'lang=ja' : `lang=${r.lang || '?'}`}\t${r.where}\t${r.run}`);
    if (r.chrome) failures.push(`${page}: Japanese in the chrome (${r.where}): "${r.run}"`);
    else if (r.lang === 'ja') continue;
    else if (allowed.has(r.run)) used.add(r.run);
    else failures.push(`${page}: Japanese outside lang="ja" and not allowlisted (${r.where}): "${r.run}"`);
  }
}
if (INVENTORY) process.exit(0);

for (const r of allowed.keys()) if (!used.has(r)) failures.push(`allowlist entry matches nothing on the JP build: "${r}"`);

console.log(`check-built-jp-language: pages=${pages.length} japaneseRuns=${scannedRuns} allowlisted=${allowed.size}`);
// A scan that read no page reads exactly like a clean pass — refuse it.
if (pages.length < 50) {
  console.error(`check-built-jp-language: scanned ${pages.length} page(s) — refusing to report a pass.`);
  process.exit(2);
}
if (failures.length) {
  console.error(`check-built-jp-language: ${failures.length} failure(s):`);
  for (const f of failures.slice(0, 200)) console.error(`  ${f}`);
  if (failures.length > 200) console.error(`  … ${failures.length - 200} more`);
  process.exit(1);
}
console.log('check-built-jp-language: OK — English chrome, html lang="en", no /ja/ page, every Japanese run marked lang="ja" or allowlisted.');
