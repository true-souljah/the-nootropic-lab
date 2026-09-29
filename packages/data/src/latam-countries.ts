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
    customsNote: 'Mexican customs (SAT) applies import duties on health supplements above the personal-use de minimis threshold. Declare accurately to avoid delays. Personal import limit is typically 3 units per SKU.',
    popularBrands: ['Mind Lab Pro', 'Alpha Brain', 'Nootropics Depot'],
  },
  {
    code: 'BR',
    name: 'Brazil',
    slug: 'brazil',
    currency: 'BRL',
    language: 'Portuguese',
    shippingNote: 'International supplement parcels enter Brazil as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Brazil applies a 60% import tax on dietary supplements imported from outside Mercosur. Packages may be held at Receita Federal (Brazilian IRS) customs. Factor this cost into your purchase decision -- total landed cost can nearly double the product price.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Qualia Mind'],
  },
  {
    code: 'AR',
    name: 'Argentina',
    slug: 'argentina',
    currency: 'ARS',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Argentina as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout. Currency controls and economic volatility may affect payment processing with international merchants.',
    customsNote: 'ANMAT (Administración Nacional de Medicamentos, Alimentos y Tecnología Médica) regulates dietary supplements in Argentina. Imported supplements not registered with ANMAT may be detained at customs. Import for personal use is generally permitted in small quantities.',
    popularBrands: ['Mind Lab Pro', 'Alpha Brain', 'NooCube'],
  },
  {
    code: 'CO',
    name: 'Colombia',
    slug: 'colombia',
    currency: 'COP',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Colombia as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'INVIMA (Instituto Nacional de Vigilancia de Medicamentos y Alimentos) regulates dietary supplements in Colombia. Personal-use imports are generally permitted. Commercial quantities require INVIMA registration. Customs duties vary by product classification.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
  {
    code: 'CL',
    name: 'Chile',
    slug: 'chile',
    currency: 'CLP',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Chile as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'The ISP (Instituto de Salud Pública de Chile) regulates dietary supplements. Imported supplements for personal use are generally allowed in small quantities (typically up to 3 months supply). Chile has a free trade agreement with the US which can reduce applicable tariffs.',
    popularBrands: ['Mind Lab Pro', 'Nootropics Depot', 'Alpha Brain'],
  },
  {
    code: 'PE',
    name: 'Peru',
    slug: 'peru',
    currency: 'PEN',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Peru as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'DIGEMID (Dirección General de Medicamentos, Insumos y Drogas) regulates health products in Peru. Personal-use imports are generally permitted. Customs may request documentation verifying the personal nature of the import. Duties apply above the de minimis threshold.',
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
];
