export interface AUState {
  slug: string;
  name: string;
  note: string;
}

export const auStates: AUState[] = [
  { slug: 'new-south-wales', name: 'New South Wales', note: 'NSW is Australia\'s largest supplement market. Sydney has a growing biohacking community. Most international brands reach NSW in 7-12 business days from the UK or 10-15 days from the US.' },
  { slug: 'victoria', name: 'Victoria', note: 'Melbourne\'s wellness culture drives strong nootropic interest. Victoria receives international shipments in 7-14 business days. The state has no additional supplement restrictions beyond TGA national rules.' },
  { slug: 'queensland', name: 'Queensland', note: 'QLD residents receive international supplement orders in 8-14 business days. Brisbane is the main delivery hub.' },
  { slug: 'western-australia', name: 'Western Australia', note: 'Perth-based buyers should expect slightly longer delivery times — 10-18 business days for international orders due to WA\'s geographical distance.' },
  { slug: 'south-australia', name: 'South Australia', note: 'South Australia receives international shipments in 8-14 business days. Adelaide has no state-level supplement restrictions.' },
  { slug: 'tasmania', name: 'Tasmania', note: 'Tasmanian buyers typically receive international orders in 10-16 business days. Add 1-3 days for Bass Strait shipping from mainland.' },
  { slug: 'australian-capital-territory', name: 'Australian Capital Territory', note: 'ACT residents (Canberra) receive international shipments in 7-12 business days. Proximity to Sydney\'s logistics hub makes ACT one of the faster delivery regions.' },
  { slug: 'northern-territory', name: 'Northern Territory', note: 'NT buyers should expect 12-18 business days for international supplement orders. Darwin is the main distribution point.' },
];
