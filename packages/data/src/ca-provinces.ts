export interface CAProvince {
  slug: string;
  name: string;
  note: string;
}

export const caProvinces: CAProvince[] = [
  { slug: 'ontario', name: 'Ontario', note: 'Ontario is Canada\'s largest province by population. Health Canada-licensed retailers ship across the province. Mind Lab Pro and NooCube are the most popular stacks among Toronto\'s professional community.' },
  { slug: 'british-columbia', name: 'British Columbia', note: 'BC\'s wellness culture makes it one of Canada\'s strongest nootropic markets. Vancouver has a high concentration of biohackers. Delivery estimates vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'quebec', name: 'Quebec', note: 'Quebec buyers may prefer French-language customer support. Most major brands (Mind Lab Pro, NooCube) offer bilingual support. Products ship in USD — verify exchange rates before ordering.' },
  { slug: 'alberta', name: 'Alberta', note: 'Alberta is a strong market for performance-focused nootropics. Delivery estimates vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'manitoba', name: 'Manitoba', note: 'Delivery estimates to Manitoba vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'saskatchewan', name: 'Saskatchewan', note: 'Delivery estimates to Saskatchewan vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'nova-scotia', name: 'Nova Scotia', note: 'Delivery estimates to Nova Scotia vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'new-brunswick', name: 'New Brunswick', note: 'New Brunswick is bilingual English-French. Delivery estimates vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'prince-edward-island', name: 'Prince Edward Island', note: 'Delivery estimates to PEI vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'newfoundland-and-labrador', name: 'Newfoundland and Labrador', note: 'Delivery estimates to Newfoundland and Labrador vary by brand and carrier, so check the estimate at checkout.' },
];
