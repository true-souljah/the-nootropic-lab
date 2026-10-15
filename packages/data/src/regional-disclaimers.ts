// Per-region YMYL disclaimers for nootropic / cognitive supplement content.
// Each market has a distinct regulatory framework whose disclaimer language
// (or claim-language framing) is mandated or strongly expected. These strings
// are the audited Stage 9 + Stage 6 + Stage 7 outputs.
//
// Pages call getRegionalHealthDisclaimer(market) and pass the result to the
// commercial template's `healthDisclaimer` prop. Templates fall back to a
// generic supplement disclaimer when no region-specific one is supplied.

export type DisclaimerMarket =
  | 'us'
  | 'eu'
  | 'ca'
  | 'au'
  | 'jp'
  | 'latam'
  | 'gcc'
  | 'sea';

const disclaimers: Record<DisclaimerMarket, string> = {
  us: 'These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. Information on this page is for educational purposes only and is not medical advice. Consult a qualified healthcare professional before starting any supplement, especially if you are pregnant, nursing, taking medication, or have a medical condition. Individual results vary.',
  eu: 'Cognitive-effect language on this page describes ingredient mechanisms studied in clinical trials. Health claims on supplements sold in the EU are governed by Regulation (EC) No 1924/2006; only European Food Safety Authority (EFSA) approved claims may appear on product labelling. This page is editorial, not promotional, and does not constitute medical advice. Consult a qualified healthcare professional before starting any supplement.',
  // Health Canada quotes (checked 2026-10-08):
  // "assures consumers ... reviewed and approved by Health Canada for safety and efficacy" —
  //   https://www.canada.ca/en/health-canada/services/drugs-health-products/natural-non-prescription/applications-submissions/product-licensing.html
  // "To be licensed in Canada, natural health products must be safe, effective, of high quality" —
  //   https://www.canada.ca/en/health-canada/services/drugs-health-products/natural-non-prescription/regulation/about-products.html
  ca: 'Natural health products available in Canada are regulated by Health Canada under the Natural Health Products Regulations. Where a product holds an NPN (Natural Product Number), Health Canada says that number "assures consumers that the product has been reviewed and approved by Health Canada for safety and efficacy"; it also states, "To be licensed in Canada, natural health products must be safe, effective, of high quality" (canada.ca, checked 2026-10-08). Cross-border imports without an NPN are not Health Canada licensed. This page is for educational purposes only and is not medical advice. Consult a qualified healthcare professional before starting any supplement.',
  au: 'Therapeutic goods available in Australia are regulated by the Therapeutic Goods Administration (TGA). AUST L–listed products carry pre-approved permitted indications; AUST R–registered products are higher-evidence. Imported products without TGA listing are not assessed by Australian regulators. This page is editorial, not promotional, and does not constitute medical advice. Always read the label and follow directions for use. Consult a qualified healthcare professional before starting any supplement.',
  // The English half says what the Japanese half says, nothing more. CAA public-comment case 235080088
  // (1–30 July 2026, result published 1 October 2026) amends seasoning-sauce names, nutrient reference
  // values and nutrient-function claims for vitamins B1/K and zinc — it is not an FFC claim-wording
  // consultation for DHA, phosphatidylserine or NMN (checked 2026-10-12):
  //   https://www.caa.go.jp/notice/consultation/
  jp: '本ページは教育目的の編集コンテンツであり、医学的助言を構成するものではありません。日本国内で販売される機能性表示食品（FFC）および特定保健用食品（FOSHU）は、消費者庁への届出または許可を必要とします。届出のない輸入品については、日本の薬機法（旧薬事法）の下で疾病治療を示唆する表現は規制されます。サプリメントを開始する前に、必ず資格のある医療専門家にご相談ください。This page is editorial and not medical advice. Foods with Function Claims (FFC) and Foods for Specified Health Uses (FOSHU) sold in Japan require notification or approval from the Consumer Affairs Agency. Imported products without notification cannot make disease-treatment claims under the Pharmaceuticals and Medical Devices (PMD) Act. Consult a qualified healthcare professional before starting any supplement.',
  // ANVISA, 2 July 2026: some injectable peptides "NÃO estão regularizados … em nenhuma categoria -
  // alimento, medicamento, cosmético, suplemento alimentar -, ou seja, são ILEGAIS para qualquer uso em
  // saúde, inclusive estético"; names GHK-CU, BPC-157, TB500, CJC-1295 and Ipamorelina (checked 2026-10-12):
  //   https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/checamos-peptideos-que-prometem-milagres-nao-estao-registrados-na-anvisa
  latam: 'Esta página es contenido editorial con fines educativos y no constituye consejo médico. Los suplementos alimenticios están regulados por agencias nacionales: la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil bajo RDC 243/2018, la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, y el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia. En Argentina, la Disposición 2105/2022 de la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica (ANMAT) prohíbe siete productos concretos de las marcas Newmind y PURENOOTROPICS (Noopept, F-Phenibut y Bacopa) — no recomendamos productos con Noopept ni F-Phenibut a lectores en Argentina. Aviso para lectores en Brasil: el 2 de julio de 2026, ANVISA informó que algunos péptidos inyectables promocionados en internet, entre ellos GHK-Cu, BPC-157, TB-500, CJC-1295 e ipamorelin, no están regularizados en ninguna categoría (alimento, medicamento, cosmético ni suplemento alimentario) y son ilegales para cualquier uso en salud, incluido el estético. No enlazamos ni recomendamos proveedores que realicen envíos de formulaciones inyectables a Brasil. Consulte siempre a un profesional de la salud calificado antes de comenzar cualquier suplemento. / This page is editorial and not medical advice. Supplements are regulated by national agencies: the Agência Nacional de Vigilância Sanitária (ANVISA) in Brazil, the Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) in Mexico, and the Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) in Colombia. In Argentina, ANMAT Disposition 2105/2022 prohibits seven specific products of the Newmind and PURENOOTROPICS brands (Noopept, F-Phenibut and Bacopa) — we do not recommend products containing Noopept or F-Phenibut to Argentine readers. Brazil notice: on 2 July 2026, ANVISA stated that some injectable peptides promoted online, including GHK-Cu, BPC-157, TB-500, CJC-1295 and ipamorelin, are not regularised in any category (food, medicine, cosmetic or food supplement) and are illegal for any health use, including aesthetic use. We do not link to or recommend vendors that ship injectable formulations to Brazil. Consult a qualified healthcare professional before starting any supplement.',
  // Federal Decree-Law No. 38 of 2024, Art. 1: "Marketing Approval: The approval granted by the EDE to a
  // legal entity licensed in the State to market a specific Medical Product" (checked 2026-10-12):
  //   https://uaelegislation.gov.ae/en/legislations/2751/download
  gcc: 'Dietary supplements sold in Saudi Arabia are regulated by the Saudi Food and Drug Authority (SFDA); in the UAE, general food supplements are regulated by Dubai Municipality while products making medicinal or therapeutic claims require marketing authorisation from the Emirates Drug Establishment (EDE, ede.gov.ae), which now handles drug registrations previously processed through the Ministry of Health and Prevention (MOHAP). Many GCC consumers prefer Halal-certified supplements; capsule shells (gelatin vs HPMC vegetable cellulose) are a meaningful differentiator. We surface Halal-certifying authority where verifiable and never fabricate certifications. This page is editorial, not medical advice. Always consult a qualified healthcare professional before starting any supplement.',
  sea: 'Health supplements in Singapore are regulated by the Health Sciences Authority (HSA); in Malaysia by the National Pharmaceutical Regulatory Agency (NPRA); in Indonesia by the Badan Pengawas Obat dan Makanan (BPOM); in the Philippines by FDA Philippines; in Thailand by FDA Thailand. Halal certification is required by law for supplements marketed to Indonesian consumers from 18 October 2026, regulated by the Badan Penyelenggara Jaminan Produk Halal (BPJPH); in Malaysia, products described as halal must be certified, with the Jabatan Kemajuan Islam Malaysia (JAKIM) as the certifying body. We surface certification status per product where verifiable. This page is editorial, not medical advice. Consult a qualified healthcare professional before starting any supplement.',
};

const generic =
  'This page is editorial content for educational purposes only and is not medical advice. Dietary supplements are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any supplement, especially if you are pregnant, nursing, taking medication, or have a medical condition. Individual results vary.';

export function getRegionalHealthDisclaimer(market?: DisclaimerMarket | string): string {
  if (!market) return generic;
  const normalized = market.toLowerCase() as DisclaimerMarket;
  return disclaimers[normalized] ?? generic;
}

/** One language run of a disclaimer as it renders; `lang` is set when the run is not in the page's English. */
export interface DisclaimerPart {
  text: string;
  lang?: 'ja';
}

// The JP disclaimer is bilingual. Its Japanese half is a protective notice that
// stays on the English JP host (owner decision 2026-10-13, "keep notices"), so
// renderers mark it lang="ja". The split point is the start of the English half;
// the text itself is unchanged and the halves join back to the full string.
const JP_ENGLISH_HALF_START = 'This page is editorial and not medical advice.';
const jpSplit = disclaimers.jp.indexOf(JP_ENGLISH_HALF_START);
if (jpSplit <= 0) throw new Error('regional-disclaimers: the jp disclaimer no longer starts its English half with the expected sentence');
const JP_PARTS: readonly DisclaimerPart[] = [
  { text: disclaimers.jp.slice(0, jpSplit), lang: 'ja' },
  { text: disclaimers.jp.slice(jpSplit) },
];

/**
 * The language runs of a regional disclaimer string as a page renders it: the
 * JP disclaimer comes back as its Japanese half (lang 'ja') and its English
 * half; any other text is one run in the page language.
 */
export function disclaimerParts(text: string): readonly DisclaimerPart[] {
  return text === disclaimers.jp ? JP_PARTS : [{ text }];
}

/**
 * The JP imprint's bilingual region note, a protective notice kept under the same
 * decision: its Japanese half renders lang="ja", the English half after it. It
 * lives here, not in the JP page file, so JP app sources never mark Japanese
 * themselves (jp-japanese-paused.test.ts).
 */
export const jpImprintNoteParts: readonly DisclaimerPart[] = [
  {
    text: '日本国内で販売される機能性表示食品（FFC）および特定保健用食品（FOSHU）は、消費者庁への届出または許可を必要とします。届出のない輸入品については、本サイトは消費者体験および成分研究のレビューとして編集しており、薬機法（旧薬事法）の下で疾病治療を示唆する表現は行いません。',
    lang: 'ja',
  },
  {
    text: ' / Foods with Function Claims (FFC) and Foods for Specified Health Uses (FOSHU) sold in Japan require notification or approval from the Consumer Affairs Agency. For imported products without notification, our editorial framing covers consumer experience and ingredient research only — disease-treatment claims under PMD Act are not asserted.',
  },
];
