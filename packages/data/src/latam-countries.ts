export interface LatamCountry {
  code: string;       // 2-letter ISO
  name: string;
  slug: string;
  currency: string;   // e.g. 'MXN'
  language: string;   // primary language
  shippingNote: string;
  customsNote: string;
  popularBrands: string[];  // 2-3 brand names popular there
}

export const latamCountries: LatamCountry[] = [
  {
    code: 'MX',
    name: 'Mexico',
    slug: 'mexico',
    currency: 'MXN',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Mexico as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Import duties and personal-use quantity rules were not confirmed from an official page in our 2026-10-05 check — confirm with customs or the brand before ordering.',
    popularBrands: ['Mind Lab Pro', 'Alpha Brain', 'Nootropics Depot'],
  },
  {
    code: 'BR',
    name: 'Brazil',
    slug: 'brazil',
    currency: 'BRL',
    language: 'Portuguese',
    shippingNote: 'International supplement parcels enter Brazil as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Import duties and personal-use quantity rules were not confirmed from an official page in our 2026-10-05 check — confirm with customs or the brand before ordering.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Qualia Mind'],
  },
  {
    code: 'AR',
    name: 'Argentina',
    slug: 'argentina',
    currency: 'ARS',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Argentina as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout. Currency controls and economic volatility may affect payment processing with international merchants.',
    customsNote: 'ANMAT (Administración Nacional de Medicamentos, Alimentos y Tecnología Médica) lists dietary supplements among the products it regulates, per argentina.gob.ar/anmat. Import duties and personal-use quantity rules were not confirmed from an official page in our 2026-10-05 check — confirm with customs or the brand before ordering.',
    popularBrands: ['Mind Lab Pro', 'Alpha Brain', 'NooCube'],
  },
  {
    code: 'CO',
    name: 'Colombia',
    slug: 'colombia',
    currency: 'COP',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Colombia as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Import duties and personal-use quantity rules were not confirmed from an official page in our 2026-10-05 check — confirm with customs or the brand before ordering.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
  {
    code: 'CL',
    name: 'Chile',
    slug: 'chile',
    currency: 'CLP',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Chile as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Import duties and personal-use quantity rules were not confirmed from an official page in our 2026-10-05 check — confirm with customs or the brand before ordering.',
    popularBrands: ['Mind Lab Pro', 'Nootropics Depot', 'Alpha Brain'],
  },
  {
    code: 'PE',
    name: 'Peru',
    slug: 'peru',
    currency: 'PEN',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Peru as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Import duties and personal-use quantity rules were not confirmed from an official page in our 2026-10-05 check — confirm with customs or the brand before ordering.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
];
