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
    regulatoryNote: 'The Health Sciences Authority (HSA) regulates health supplements in Singapore. Most nootropic supplements imported for personal use are classified as health products and allowed in quantities up to 3 months supply. Products are not required to be HSA-registered for personal import, but they must not contain any listed controlled substances. Singapore has a well-enforced regulatory environment -- verify ingredient lists against the HSA prohibited substances list.',
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
    regulatoryNote: 'The Thai Food and Drug Administration (Thai FDA), under the Ministry of Public Health, regulates dietary supplements in Thailand. Personal-use imports are generally permitted in small quantities (typically up to 3 months supply). Supplements with unapproved health claims or controlled ingredients may be detained. Thai FDA registration is required for commercial sale.',
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
    regulatoryNote: 'BPOM (Badan Pengawas Obat dan Makanan -- National Agency of Drug and Food Control) regulates dietary supplements and health products in Indonesia. Commercially sold supplements require BPOM registration. Personal imports in small quantities are generally allowed but may be subject to inspection. Certain stimulant or nootropic ingredients may face additional regulatory scrutiny under BPOM guidelines. Separately, halal certification from BPJPH (Badan Penyelenggara Jaminan Produk Halal -- Halal Product Assurance Agency) becomes mandatory for health supplements on 17 October 2026 under UU JPH 2014 (the Halal Product Assurance Law). Health supplements fall in the phase covering herbal and quasi medicines, which runs to that date -- the earlier 17 October 2024 deadline applied to food and beverage products, not supplements. Expect some imported brands to leave the Indonesian market around that date rather than certify.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
  {
    code: 'VN',
    name: 'Vietnam',
    slug: 'vietnam',
    currency: 'VND',
    language: 'Vietnamese',
    shippingNote: 'International supplement parcels enter Vietnam as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.',
    regulatoryNote: 'The Drug Administration of Vietnam (DAV), under the Ministry of Health, regulates functional foods and dietary supplements. Imported supplements for personal use are generally allowed in small quantities. Commercially distributed supplements require DAV registration and must comply with Vietnamese labelling requirements including Vietnamese-language labels. The market is growing rapidly with increasing consumer interest in cognitive supplements.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Nootropics Depot'],
  },
];
