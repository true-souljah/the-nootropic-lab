// Author profiles intentionally empty.
// The shared content templates handle missing author by falling back to
// Organization-level schema (The Nootropic Lab Editorial Team).

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

export const authors: Author[] = [];

export function getAuthorBySlug(_slug: string): Author | undefined {
  return undefined;
}

export function buildPersonSchema(_author: Author, _siteUrl: string) {
  return null;
}

/**
 * Returns an Organization-only author reference. Kept for backwards
 * compatibility with existing template call sites that previously passed
 * a Person reference.
 */
export function buildPersonAuthorReference(_author: Author | undefined, siteUrl: string) {
  return {
    '@type': 'Organization',
    name: 'The Nootropic Lab Editorial Team',
    url: siteUrl,
  };
}
