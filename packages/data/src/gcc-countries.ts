export interface GCCCountry {
  code: string;
  name: string;
  slug: string;
  currency: string;
  shippingNote: string;
  customsNote: string;
  vatRate: string;
  popularBrands: string[];
}

export const gccCountries: GCCCountry[] = [
  {
    code: "SA",
    name: "Saudi Arabia",
    slug: "saudi-arabia",
    currency: "SAR",
    shippingNote: "International supplement parcels enter Saudi Arabia as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "The SFDA (Saudi Food and Drug Authority) regulates dietary supplements. Personal-use imports are generally allowed in small quantities. Stimulant-containing products may face additional scrutiny.",
    vatRate: "15%",
    popularBrands: ["Mind Lab Pro", "Alpha Brain", "Nootropics Depot"],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    slug: "uae",
    currency: "AED",
    shippingNote: "International supplement parcels enter the United Arab Emirates as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "The MOHAP (UAE Ministry of Health and Prevention) regulates dietary supplements. Supplements imported for personal use in small quantities are generally allowed. Verify with local customs if importing more than a 3-month personal supply.",
    vatRate: "5%",
    popularBrands: ["Mind Lab Pro", "Qualia Mind", "NooCube"],
  },
  {
    code: "QA",
    name: "Qatar",
    slug: "qatar",
    currency: "QAR",
    shippingNote: "International supplement parcels enter Qatar as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "Qatar GOFS and the Ministry of Public Health oversee dietary supplement imports. Personal-use quantities are generally permitted. Verify ingredient compliance before ordering.",
    vatRate: "5%",
    popularBrands: ["Mind Lab Pro", "Alpha Brain", "NooCube"],
  },
  {
    code: "KW",
    name: "Kuwait",
    slug: "kuwait",
    currency: "KWD",
    shippingNote: "International supplement parcels enter Kuwait as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "The Ministry of Health Kuwait regulates dietary supplement imports. Personal-use imports are generally allowed. Kuwait has no VAT on consumer goods.",
    vatRate: "None",
    popularBrands: ["Mind Lab Pro", "Alpha Brain", "Nootropics Depot"],
  },
  {
    code: "BH",
    name: "Bahrain",
    slug: "bahrain",
    currency: "BHD",
    shippingNote: "International supplement parcels enter Bahrain as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "The NHRA (National Health Regulatory Authority) of Bahrain regulates dietary supplements and health products. Personal-use imports in small quantities are generally tolerated.",
    vatRate: "5%",
    popularBrands: ["Mind Lab Pro", "NooCube", "Alpha Brain"],
  },
  {
    code: "OM",
    name: "Oman",
    slug: "oman",
    currency: "OMR",
    shippingNote: "International supplement parcels enter Oman as personal-use imports. Carriers and brands do not publish country-specific delivery estimates for supplements, so check the estimate at checkout.",
    customsNote: "The MoH Oman regulates the import of dietary supplements. Personal-use quantities are generally allowed. Verify that specific ingredients are not restricted under Omani health regulations.",
    vatRate: "5%",
    popularBrands: ["Mind Lab Pro", "Alpha Brain", "Nootropics Depot"],
  },
];
