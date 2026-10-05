export interface GCCCountry {
  code: string;
  name: string;
  slug: string;
  currency: string;
  shippingNote: string;
  customsNote: string;
  popularBrands: string[];
}

export const gccCountries: GCCCountry[] = [
  {
    code: "SA",
    name: "Saudi Arabia",
    slug: "saudi-arabia",
    currency: "SAR",
    shippingNote: "International supplement parcels enter Saudi Arabia as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "The Saudi Food and Drug Authority (SFDA) registers food supplements through its Electronic Food Registration System, per sfda.gov.sa. Personal-import quantity rules were not confirmed from an official page in our 2026-09-29 check — confirm with customs or the brand before ordering.",
    popularBrands: ["Mind Lab Pro", "Alpha Brain", "Nootropics Depot"],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    slug: "uae",
    currency: "AED",
    shippingNote: "International supplement parcels enter the United Arab Emirates as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "The Emirates Drug Establishment (EDE) registers dietary supplements as general pharmaceutical products, per ede.gov.ae. Personal-import quantity rules were not confirmed from an official page in our 2026-09-29 check — confirm with customs or the brand before ordering.",
    popularBrands: ["Mind Lab Pro", "Qualia Mind", "NooCube"],
  },
  {
    code: "QA",
    name: "Qatar",
    slug: "qatar",
    currency: "QAR",
    shippingNote: "International supplement parcels enter Qatar as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "Personal-import quantity rules were not confirmed from an official page in our 2026-09-29 check — confirm with customs or the brand before ordering.",
    popularBrands: ["Mind Lab Pro", "Alpha Brain", "NooCube"],
  },
  {
    code: "KW",
    name: "Kuwait",
    slug: "kuwait",
    currency: "KWD",
    shippingNote: "International supplement parcels enter Kuwait as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "Personal-import quantity rules were not confirmed from an official page in our 2026-09-29 check — confirm with customs or the brand before ordering.",
    popularBrands: ["Mind Lab Pro", "Alpha Brain", "Nootropics Depot"],
  },
  {
    code: "BH",
    name: "Bahrain",
    slug: "bahrain",
    currency: "BHD",
    shippingNote: "International supplement parcels enter Bahrain as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "Personal-import quantity rules were not confirmed from an official page in our 2026-09-29 check — confirm with customs or the brand before ordering.",
    popularBrands: ["Mind Lab Pro", "NooCube", "Alpha Brain"],
  },
  {
    code: "OM",
    name: "Oman",
    slug: "oman",
    currency: "OMR",
    shippingNote: "International supplement parcels enter Oman as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "Personal-import quantity rules were not confirmed from an official page in our 2026-09-29 check — confirm with customs or the brand before ordering.",
    popularBrands: ["Mind Lab Pro", "Alpha Brain", "Nootropics Depot"],
  },
];
