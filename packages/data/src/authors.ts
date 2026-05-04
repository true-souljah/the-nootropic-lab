export interface Author {
  slug: string;
  name: string;
  jobTitle: string;
  bio: string;
  bioShort: string;
  expertise: string[];
  education: string[];
  email: string;
  sameAs: string[];
  imageUrl?: string;
}

export const authors: Author[] = [
  {
    slug: 'stephan-kulik',
    name: 'Stephan Kulik',
    jobTitle: 'Founder & Editorial Lead, The Nootropic Lab',
    bioShort:
      'Editorial lead for The Nootropic Lab. Builds evidence-graded comparison sites in regulated verticals — financial, supplements, prediction markets — with an obsessive focus on clinical-dose transparency and conflict-of-interest disclosure.',
    bio:
      'Stephan Kulik is the editorial lead and operator of The Nootropic Lab. His background spans seven years building evidence-graded comparison sites in regulated and high-consideration verticals — neobanks, peptides, prediction markets, and now cognitive supplements — with an explicit focus on three things: clinical-dose transparency, transparent affiliate disclosure, and a conflict-of-interest policy that puts editorial scoring ahead of commercial relationships. Every product reviewed on The Nootropic Lab carries a clinical dosing audit comparing each ingredient against peer-reviewed minimum effective dose, and every commercial page carries an FTC-compliant affiliate disclosure. Stephan operates The Nootropic Lab through Kulik Media UG (registered in Germany).',
    expertise: [
      'Comparison-site editorial methodology',
      'Clinical-dose evidence grading',
      'Affiliate disclosure compliance (FTC, ASA UK, EU/EFSA)',
      'Supplement industry regulatory frameworks (DSHEA, EFSA, TGA, NHPD, MHLW)',
      'YMYL content trust signals',
    ],
    education: [
      'Editorial methodology informed by reading peer-reviewed clinical trials (PubMed, Examine.com) — not a clinician.',
    ],
    email: 'editorial@thenootropiclab.com',
    sameAs: ['https://www.linkedin.com/in/stephan-kulik-editorial001/'],
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find(a => a.slug === slug);
}

export function buildPersonSchema(author: Author, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.jobTitle,
    url: `${siteUrl}/authors/${author.slug}/`,
    sameAs: author.sameAs,
    description: author.bioShort,
    email: author.email,
    knowsAbout: author.expertise,
  };
}

export function buildPersonAuthorReference(author: Author, siteUrl: string) {
  return {
    '@type': 'Person',
    '@id': `${siteUrl}/authors/${author.slug}/#person`,
    name: author.name,
    url: `${siteUrl}/authors/${author.slug}/`,
    sameAs: author.sameAs,
  };
}
