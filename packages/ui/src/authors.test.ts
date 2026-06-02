import { describe, test, expect } from 'vitest';
import {
  authors,
  getAuthorBySlug,
  buildPersonSchema,
  buildPersonAuthorReference,
} from '@nootropic/data';

// Tests for packages/data/src/authors.ts.
//
// This file deliberately encodes the 2026-05-04 Org-only authorship
// rollback rule as executable constraints. Each helper is intentionally
// a no-op or Organization-only fallback; if someone in the future
// repopulates the authors[] array or wires up Person schemas, these
// tests will fail loudly at CI and force a conversation before any
// Person-author byline ships.
//
// Per the operator's standing rule (documented in auto-memory):
// "Do NOT re-introduce named bylines without explicit operator
// instruction."
//
// Cross-package test placement: see product-schema.test.ts for the
// rationale.

const SITE_URL = 'https://example.com';

describe('authors[] — Org-only rollback rule enforcement', () => {
  test('authors[] is intentionally empty (2026-05-04 rollback)', () => {
    expect(authors).toEqual([]);
    expect(authors.length).toBe(0);
  });
});

describe('getAuthorBySlug', () => {
  test('always returns undefined regardless of slug', () => {
    expect(getAuthorBySlug('stephan-kulik')).toBeUndefined();
    expect(getAuthorBySlug('')).toBeUndefined();
    expect(getAuthorBySlug('non-existent')).toBeUndefined();
  });
});

describe('buildPersonSchema', () => {
  test('returns null (no Person schema emitted under Org-only rule)', () => {
    // Even if a caller somehow constructs an Author object, the helper
    // must not produce a Person JSON-LD block.
    const stubAuthor = {
      slug: 'stub',
      name: 'Stub Author',
      jobTitle: 'Editor',
      bio: 'Test bio',
      bioShort: 'Test',
      expertise: [],
      education: [],
      email: 'stub@example.com',
      sameAs: [],
    };
    expect(buildPersonSchema(stubAuthor, SITE_URL)).toBeNull();
  });
});

describe('buildPersonAuthorReference', () => {
  test('returns Organization reference (not Person) when author is undefined', () => {
    const ref = buildPersonAuthorReference(undefined, SITE_URL);
    expect(ref['@type']).toBe('Organization');
    expect(ref['@type']).not.toBe('Person');
  });

  test('still returns Organization reference even when an author object is passed', () => {
    // Defensive: the function signature accepts an Author, but the
    // rollback rule says it must NEVER produce Person output. This
    // verifies the function doesn't accidentally start respecting
    // the author argument in a future refactor.
    const stubAuthor = {
      slug: 'stub',
      name: 'Stub Author',
      jobTitle: 'Editor',
      bio: 'Test bio',
      bioShort: 'Test',
      expertise: [],
      education: [],
      email: 'stub@example.com',
      sameAs: [],
    };
    const ref = buildPersonAuthorReference(stubAuthor, SITE_URL);
    expect(ref['@type']).toBe('Organization');
    expect((ref as { name: string }).name).toBe('The Nootropic Lab Editorial Team');
  });

  test('returns the editorial-team brand name (not a Person name)', () => {
    const ref = buildPersonAuthorReference(undefined, SITE_URL);
    expect(ref).toMatchObject({
      '@type': 'Organization',
      name: 'The Nootropic Lab Editorial Team',
    });
  });

  test('propagates the passed siteUrl as the organization url', () => {
    const ref = buildPersonAuthorReference(undefined, SITE_URL);
    expect((ref as { url: string }).url).toBe(SITE_URL);
    // And with a different siteUrl
    const ref2 = buildPersonAuthorReference(undefined, 'https://au.thenootropiclab.com');
    expect((ref2 as { url: string }).url).toBe('https://au.thenootropiclab.com');
  });
});
