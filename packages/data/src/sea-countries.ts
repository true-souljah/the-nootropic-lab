export interface SEACountry {
  code: string;
  name: string;
  slug: string;
  currency: string;
  language: string;
  shippingNote: string;
  regulatoryNote: string;
  popularBrands: string[];
}

export const seaCountries: SEACountry[] = [
  {
    code: 'SG',
    name: 'Singapore',
    slug: 'singapore',
    currency: 'SGD',
    language: 'English',
    shippingNote: 'Singapore is the fastest delivery hub in Southeast Asia. International shipping from the US typically takes 5-8 business days. Singapore Post and DHL offer consistent, reliable delivery.',
    regulatoryNote: 'The Health Sciences Authority (HSA) regulates health supplements in Singapore. Most nootropic supplements imported for personal use are classified as health products and allowed in quantities up to 3 months supply. Products are not required to be HSA-registered for personal import, but they must not contain any listed controlled substances. Singapore has a well-enforced regulatory environment -- verify ingredient lists against the HSA prohibited substances list.',
    popularBrands: ['Mind Lab Pro', 'Performance Lab Mind', 'Nootropics Depot'],
  },
  {
    code: 'MY',
    name: 'Malaysia',
    slug: 'malaysia',
    currency: 'MYR',
    language: 'Malay',
    shippingNote: 'International shipping from the US typically takes 7-12 business days. English is widely spoken and written, making Malaysia one of the most accessible SEA markets for English-language supplement brands.',
    regulatoryNote: 'The National Pharmaceutical Regulatory Agency (NPRA), under the Ministry of Health Malaysia, regulates health supplements. Products sold commercially in Malaysia require NPRA registration (Product Registration). Personal imports in small quantities are generally allowed without registration. Malaysia is English-friendly and has a growing nootropics awareness market.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
  {
    code: 'TH',
    name: 'Thailand',
    slug: 'thailand',
    currency: 'THB',
    language: 'Thai',
    shippingNote: 'International shipping from the US typically takes 8-14 business days. DHL and FedEx provide the most reliable delivery for supplement imports into Bangkok.',
    regulatoryNote: 'The Thai Food and Drug Administration (Thai FDA), under the Ministry of Public Health, regulates dietary supplements in Thailand. Personal-use imports are generally permitted in small quantities (typically up to 3 months supply). Supplements with unapproved health claims or controlled ingredients may be detained. Thai FDA registration is required for commercial sale.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Qualia Mind'],
  },
  {
    code: 'PH',
    name: 'Philippines',
    slug: 'philippines',
    currency: 'PHP',
    language: 'Filipino',
    shippingNote: 'International shipping from the US typically takes 10-15 business days. Island geography can add variability to last-mile delivery times. DHL Express is the most consistent option for Manila delivery.',
    regulatoryNote: 'The Food and Drug Administration Philippines (FDA Philippines), under the Department of Health, regulates food supplements. Products sold commercially require FDA Philippines registration. Personal imports for individual use are generally tolerated in small quantities. English is widely spoken and most US supplement brands are familiar to Filipino consumers.',
    popularBrands: ['Mind Lab Pro', 'Alpha Brain', 'NooCube'],
  },
  {
    code: 'ID',
    name: 'Indonesia',
    slug: 'indonesia',
    currency: 'IDR',
    language: 'Indonesian',
    shippingNote: 'Indonesia is the largest market in Southeast Asia. International shipping from the US to Jakarta typically takes 10-15 business days. Island geography means delivery times to outer islands may be longer.',
    regulatoryNote: 'BPOM (Badan Pengawas Obat dan Makanan -- National Agency of Drug and Food Control) regulates dietary supplements and health products in Indonesia. Commercially sold supplements require BPOM registration. Personal imports in small quantities are generally allowed but may be subject to inspection. Certain stimulant or nootropic ingredients may face additional regulatory scrutiny under BPOM guidelines.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
  {
    code: 'VN',
    name: 'Vietnam',
    slug: 'vietnam',
    currency: 'VND',
    language: 'Vietnamese',
    shippingNote: 'International shipping from the US typically takes 10-15 business days. Ho Chi Minh City and Hanoi have the most reliable delivery infrastructure for imported supplement parcels.',
    regulatoryNote: 'The Drug Administration of Vietnam (DAV), under the Ministry of Health, regulates functional foods and dietary supplements. Imported supplements for personal use are generally allowed in small quantities. Commercially distributed supplements require DAV registration and must comply with Vietnamese labelling requirements including Vietnamese-language labels. The market is growing rapidly with increasing consumer interest in cognitive supplements.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Nootropics Depot'],
  },
];
