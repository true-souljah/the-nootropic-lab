export interface SEACountry {
  code: string;
  name: string;
  slug: string;
  currency: string;
  language: string;
  shippingNote: string;
  regulatoryNote: string;
  popularBrands: string[];
  /** Optional standalone long-form country guide, linked from /countries/<slug>/. */
  guide?: { href: string; label: string };
}

export const seaCountries: SEACountry[] = [
  {
    code: 'SG',
    name: 'Singapore',
    slug: 'singapore',
    currency: 'SGD',
    language: 'English',
    shippingNote: 'International supplement parcels enter Singapore as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.',
    regulatoryNote: 'Singapore\'s Health Sciences Authority (HSA) states that "Health supplements are not subject to approvals and licensing by HSA for their importation, manufacture and sales", and a company may voluntarily notify HSA of a product (hsa.gov.sg, checked 2026-10-08). HSA\'s rule that a traveller "may bring up to 3 months’ supply" is on its personal-medications page and covers medications, not supplements; we found no personal-import quantity rule for supplements on HSA or Singapore Food Agency (SFA) pages, and SFA\'s traveller limit ("5kg or 5 litres" and "$100 per traveller") covers processed food and does not mention supplements (checked 2026-10-08). HSA states that health supplements imported or sold must not contain ingredients controlled and prohibited under the Poisons Act and the Misuse of Drugs Act. Check ingredient lists against HSA\'s Guidelines on Prohibited and Restricted Ingredients in Health Supplements and Traditional Medicines.',
    popularBrands: ['Mind Lab Pro', 'Performance Lab Mind', 'Nootropics Depot'],
  },
  {
    code: 'MY',
    name: 'Malaysia',
    slug: 'malaysia',
    currency: 'MYR',
    language: 'Malay',
    shippingNote: 'International supplement parcels enter Malaysia as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.',
    regulatoryNote: 'The National Pharmaceutical Regulatory Agency (NPRA), under the Ministry of Health Malaysia, regulates health supplements. Products sold commercially in Malaysia require NPRA registration (Product Registration). Personal imports in small quantities are generally allowed without registration. Malaysia is English-friendly and has a growing nootropics awareness market.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
  {
    code: 'TH',
    name: 'Thailand',
    slug: 'thailand',
    currency: 'THB',
    language: 'Thai',
    shippingNote: 'International supplement parcels enter Thailand as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.',
    regulatoryNote: 'The Thai Food and Drug Administration (Thai FDA), under the Ministry of Public Health, regulates dietary supplements in Thailand. The Thai FDA\'s personal-import limit for food supplements is a "Total of all items not exceeding 15 pieces", where "each item has a quantity equivalent to 3 months of consumption by product" (en.fda.moph.go.th, checked 2026-09-30). Supplements with unapproved health claims or controlled ingredients may be detained. Thai FDA registration is required for commercial sale.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Qualia Mind'],
    guide: { href: '/nootropics-in-thailand/', label: 'Full guide: Thai FDA supplement rules, personal-import limits and controlled substances' },
  },
  {
    code: 'PH',
    name: 'Philippines',
    slug: 'philippines',
    currency: 'PHP',
    language: 'Filipino',
    shippingNote: 'International supplement parcels enter the Philippines as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout. Island geography can add variability to last-mile delivery.',
    regulatoryNote: 'The Food and Drug Administration Philippines (FDA Philippines), under the Department of Health, regulates food supplements. Products sold commercially require FDA Philippines registration. Personal imports for individual use are generally tolerated in small quantities. English is widely spoken and most US supplement brands are familiar to Filipino consumers.',
    popularBrands: ['Mind Lab Pro', 'Alpha Brain', 'NooCube'],
    guide: { href: '/nootropics-in-the-philippines/', label: 'Full guide: FDA Philippines registration, labelling rules and personal-import limits' },
  },
  {
    code: 'ID',
    name: 'Indonesia',
    slug: 'indonesia',
    currency: 'IDR',
    language: 'Indonesian',
    shippingNote: 'International supplement parcels enter Indonesia as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout. Delivery to the outer islands can take longer than to Jakarta.',
    regulatoryNote: 'BPOM (Badan Pengawas Obat dan Makanan -- National Agency of Drug and Food Control) regulates dietary supplements and health products in Indonesia. Commercially sold supplements require BPOM registration. Personal imports in small quantities are generally allowed but may be subject to inspection. Certain stimulant or nootropic ingredients may face additional regulatory scrutiny under BPOM guidelines. Separately, halal certification from BPJPH (Badan Penyelenggara Jaminan Produk Halal -- Halal Product Assurance Agency) becomes mandatory for health supplements, imported ones included, from 18 October 2026 under UU JPH 2014 (the Halal Product Assurance Law) and Government Regulation 42/2024 (Art. 145 and 161). Health supplements fall in the phase covering herbal and quasi medicines, which runs to 17 October 2026 -- the earlier 17 October 2024 deadline applied to food and beverage products, not supplements. Expect some imported brands to leave the Indonesian market around that date rather than certify.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
  {
    code: 'VN',
    name: 'Vietnam',
    slug: 'vietnam',
    currency: 'VND',
    language: 'Vietnamese',
    shippingNote: 'International supplement parcels enter Vietnam as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.',
    // Sources (fetched 2026-10-05): xaydungchinhsach.chinhphu.vn (VFA role;
    // health-protection-food declarations under Decree 15/2018 Art. 6; Decree
    // 15 tied to the advertising rule, Art. 27), vpcp.chinhphu.vn (Decree 15
    // still in force), vanban.chinhphu.vn (Decision 01/2025/QĐ-TTg repealing
    // Decision 78/2010/QĐ-TTg), suckhoedoisong.vn (advert warning wording).
    // The Drug Administration of Vietnam covers drugs and cosmetics, not
    // these foods (chinhphu.vn, docid=81838). No official page
    // confirmed a personal-import licence rule or a current courier threshold.
    regulatoryNote: 'The Vietnam Food Administration (Cục An toàn thực phẩm, VFA), a unit of the Ministry of Health, manages food safety in Vietnam, and for products used as health-protection foods (thực phẩm bảo vệ sức khỏe) the VFA asks for the product declaration to be registered under Article 6 of Decree 15/2018/NĐ-CP, which remains in force (per chinhphu.vn, checked 2026-10-05). The duty exemption for low-value courier imports under Decision 78/2010/QĐ-TTg was repealed from 18 February 2025 by Decision 01/2025/QĐ-TTg (per vanban.chinhphu.vn, checked 2026-10-05); we found no official page confirming the current rules for personal imports of supplements, so confirm with Vietnamese customs before ordering. Adverts for health-protection foods must carry the warning "Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh" ("this food is not a medicine and does not replace medicines for treating disease"), as reported by suckhoedoisong.vn, with the government portal xaydungchinhsach.chinhphu.vn tying food-advertising rules to Article 27 of Decree 15/2018 (checked 2026-10-05).',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Nootropics Depot'],
  },
];
