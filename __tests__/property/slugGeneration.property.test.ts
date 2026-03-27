// Feature: admin-dashboard-redesign, Property 16: Slug auto-generation produces URL-safe lowercase strings

/**
 * Property 16: Slug auto-generation produces URL-safe lowercase strings
 * Validates: Requirements 11.4
 */

import * as fc from 'fast-check';
import { generateSlug } from '../../app/admin/utils/slugGeneration';

describe('Property 16: Slug auto-generation produces URL-safe lowercase strings', () => {
  it('output is entirely lowercase', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const slug = generateSlug(name);
        expect(slug).toBe(slug.toLowerCase());
      }),
      { numRuns: 100 }
    );
  });

  it('output contains only [a-z0-9-] characters (or is empty)', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const slug = generateSlug(name);
        expect(slug).toMatch(/^[a-z0-9-]*$/);
      }),
      { numRuns: 100 }
    );
  });

  it('output has no leading or trailing hyphens', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const slug = generateSlug(name);
        if (slug.length > 0) {
          expect(slug[0]).not.toBe('-');
          expect(slug[slug.length - 1]).not.toBe('-');
        }
      }),
      { numRuns: 100 }
    );
  });
});
