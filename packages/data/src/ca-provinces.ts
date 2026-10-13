export interface CAProvince {
  slug: string;
  name: string;
  note: string;
}

export const caProvinces: CAProvince[] = [
  { slug: 'ontario', name: 'Ontario', note: 'Ontario is Canada\'s largest province by population. Delivery estimates vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'british-columbia', name: 'British Columbia', note: 'Delivery estimates to British Columbia vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'quebec', name: 'Quebec', note: 'Our Canada home page, best-of list and comparison tool are also available in French. Delivery estimates to Quebec vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'alberta', name: 'Alberta', note: 'Delivery estimates to Alberta vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'manitoba', name: 'Manitoba', note: 'Delivery estimates to Manitoba vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'saskatchewan', name: 'Saskatchewan', note: 'Delivery estimates to Saskatchewan vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'nova-scotia', name: 'Nova Scotia', note: 'Delivery estimates to Nova Scotia vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'new-brunswick', name: 'New Brunswick', note: 'New Brunswick is bilingual English-French. Delivery estimates vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'prince-edward-island', name: 'Prince Edward Island', note: 'Delivery estimates to PEI vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'newfoundland-and-labrador', name: 'Newfoundland and Labrador', note: 'Delivery estimates to Newfoundland and Labrador vary by brand and carrier, so check the estimate at checkout.' },
];
