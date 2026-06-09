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
  eu: 'Cognitive-effect language on this page describes ingredient mechanisms studied in clinical trials. Health claims on supplements sold in the EU are governed by Regulation (EC) No 1924/2006; only EFSA-approved claims may appear on product labelling. This page is editorial, not promotional, and does not constitute medical advice. Consult a qualified healthcare professional before starting any supplement.',
  ca: 'Natural health products available in Canada are regulated by Health Canada under the Natural Health Products Regulations. Where a product holds an NPN (Natural Product Number), it has been assessed for safety, efficacy, and quality. Cross-border imports without an NPN are not Health Canada licensed. This page is for educational purposes only and is not medical advice. Consult a qualified healthcare professional before starting any supplement.',
  au: 'Therapeutic goods available in Australia are regulated by the Therapeutic Goods Administration. AUST L–listed products carry pre-approved permitted indications; AUST R–registered products are higher-evidence. Imported products without TGA listing are not assessed by Australian regulators. This page is editorial, not promotional, and does not constitute medical advice. Always read the label and follow directions for use. Consult a qualified healthcare professional before starting any supplement.',
  jp: '本ページは教育目的の編集コンテンツであり、医学的助言を構成するものではありません。日本国内で販売される機能性表示食品（FFC）および特定保健用食品（FOSHU）は、消費者庁への届出または許可を必要とします。届出のない輸入品については、日本の薬機法（旧薬事法）の下で疾病治療を示唆する表現は規制されます。サプリメントを開始する前に、必ず資格のある医療専門家にご相談ください。This page is editorial and not medical advice. Foods with Function Claims (FFC) and Foods for Specified Health Uses (FOSHU) sold in Japan require notification or approval from the Consumer Affairs Agency. Imported products without notification cannot make disease-treatment claims under the PMD Act. Consult a qualified healthcare professional before starting any supplement.',
  latam: 'Esta página es contenido editorial con fines educativos y no constituye consejo médico. Los suplementos alimenticios están regulados por agencias nacionales: la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil bajo RDC 243/2018, la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, y el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia. En Argentina, ANMAT Disposición 2105/2022 prohíbe ciertos compuestos nootrópicos (incluyendo Noopept) — no recomendamos productos con esos ingredientes a lectores en Argentina. Consulte siempre a un profesional de la salud calificado antes de comenzar cualquier suplemento. / This page is editorial and not medical advice. Supplements are regulated by national agencies: ANVISA (Brazil), COFEPRIS (Mexico), INVIMA (Colombia). In Argentina, ANMAT Disposition 2105/2022 prohibits certain nootropic compounds (including Noopept) — we do not recommend products containing those ingredients to Argentine readers. Consult a qualified healthcare professional before starting any supplement.',
  gcc: 'Dietary supplements sold in Saudi Arabia are regulated by the Saudi Food and Drug Authority (SFDA); in the UAE by the Ministry of Health and Prevention (MOHAP). GCC consumers preference Halal-certified supplements; capsule shells (gelatin vs HPMC vegetable cellulose) are a meaningful differentiator. We surface Halal-certifying authority where verifiable and never fabricate certifications. This page is editorial, not medical advice. Always consult a qualified healthcare professional before starting any supplement.',
  sea: 'Health supplements in Singapore are regulated by the Health Sciences Authority (HSA); in Malaysia by NPRA; in Indonesia by BPOM; in the Philippines by FDA Philippines; in Thailand by FDA Thailand. Halal certification is mandatory for supplements marketed to Indonesian (BPJPH) and Malaysian (JAKIM) consumers under federal law. We surface certification status per product where verifiable. This page is editorial, not medical advice. Consult a qualified healthcare professional before starting any supplement.',
};

const generic =
  'This page is editorial content for educational purposes only and is not medical advice. Dietary supplements are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any supplement, especially if you are pregnant, nursing, taking medication, or have a medical condition. Individual results vary.';

export function getRegionalHealthDisclaimer(market?: DisclaimerMarket | string): string {
  if (!market) return generic;
  const normalized = market.toLowerCase() as DisclaimerMarket;
  return disclaimers[normalized] ?? generic;
}
