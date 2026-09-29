export interface AUState {
  slug: string;
  name: string;
  note: string;
}

export const auStates: AUState[] = [
  { slug: 'new-south-wales', name: 'New South Wales', note: 'NSW is Australia\'s largest supplement market. Sydney has a growing biohacking community. Delivery estimates vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'victoria', name: 'Victoria', note: 'Melbourne\'s wellness culture drives strong nootropic interest. Delivery estimates vary by brand and carrier, so check the estimate at checkout. The state has no additional supplement restrictions beyond TGA national rules.' },
  { slug: 'queensland', name: 'Queensland', note: 'Delivery estimates to Queensland vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'western-australia', name: 'Western Australia', note: 'Delivery estimates to Western Australia vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'south-australia', name: 'South Australia', note: 'Delivery estimates to South Australia vary by brand and carrier, so check the estimate at checkout. Adelaide has no state-level supplement restrictions.' },
  { slug: 'tasmania', name: 'Tasmania', note: 'Delivery estimates to Tasmania vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'australian-capital-territory', name: 'Australian Capital Territory', note: 'Delivery estimates to ACT (Canberra) vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'northern-territory', name: 'Northern Territory', note: 'Delivery estimates to the Northern Territory vary by brand and carrier, so check the estimate at checkout.' },
];
