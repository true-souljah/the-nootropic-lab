export interface CAProvince {
  slug: string;
  name: string;
  note: string;
}

export const caProvinces: CAProvince[] = [
  { slug: 'ontario', name: 'Ontario', note: 'Ontario is Canada\'s largest province by population. Health Canada-licensed retailers ship across the province. Mind Lab Pro and NooCube are the most popular stacks among Toronto\'s professional community.' },
  { slug: 'british-columbia', name: 'British Columbia', note: 'BC\'s wellness culture makes it one of Canada\'s strongest nootropic markets. Vancouver has a high concentration of biohackers. Most international brands ship in 5-8 days to BC.' },
  { slug: 'quebec', name: 'Quebec', note: 'Quebec buyers may prefer French-language customer support. Most major brands (Mind Lab Pro, NooCube) offer bilingual support. Products ship in USD — verify exchange rates before ordering.' },
  { slug: 'alberta', name: 'Alberta', note: 'Alberta is a strong market for performance-focused nootropics. Calgary and Edmonton receive most international shipments in 4-7 business days from the US.' },
  { slug: 'manitoba', name: 'Manitoba', note: 'Manitoba receives international supplement shipments typically in 5-9 business days from US-based warehouses.' },
  { slug: 'saskatchewan', name: 'Saskatchewan', note: 'Saskatchewan buyers typically receive international supplement orders in 5-9 business days. Most US brands ship via USPS or FedEx.' },
  { slug: 'nova-scotia', name: 'Nova Scotia', note: 'Nova Scotia receives shipments from the UK in 7-12 business days and from US warehouses in 5-8 days.' },
  { slug: 'new-brunswick', name: 'New Brunswick', note: 'New Brunswick is bilingual English-French. Most international brands ship here in 5-9 business days.' },
  { slug: 'prince-edward-island', name: 'Prince Edward Island', note: 'PEI receives international supplement shipments typically in 6-10 business days.' },
  { slug: 'newfoundland-and-labrador', name: 'Newfoundland and Labrador', note: 'Remote delivery to NL may take 7-12 business days for international orders.' },
];
