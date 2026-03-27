// Feature: admin-dashboard-redesign, Property 7: Form pre-population matches source data
// Feature: admin-dashboard-redesign, Property 8: Tag list mutation correctness
// Feature: admin-dashboard-redesign, Property 9: Input string parsing (features, colors, sizes)
// Feature: admin-dashboard-redesign, Property 10: Form validation rejects missing required fields

/**
 * Property 7: Form pre-population matches source data
 * Validates: Requirements 7.2, 11.2
 *
 * Property 8: Tag list mutation correctness
 * Validates: Requirements 7.5
 *
 * Property 9: Input string parsing (features, colors, sizes)
 * Validates: Requirements 7.6, 7.7
 *
 * Property 10: Form validation rejects missing required fields
 * Validates: Requirements 7.9, 11.7
 */

import * as fc from 'fast-check';
import {
  populateProductForm,
  addTag,
  removeTag,
  parseFeatures,
  parseCommaSeparated,
  validateProductForm,
  ProductFormData,
} from '../../app/admin/utils/productUtils';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Non-empty string that won't be trimmed to empty */
const nonEmptyStr = fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0);

/** A valid positive price string */
const priceStr = fc.integer({ min: 1, max: 999999 }).map((n) => String(n));

/** A product source object as returned by the API */
const productSourceArb = fc.record({
  name: nonEmptyStr,
  price: fc.integer({ min: 1, max: 999999 }),
  originalPrice: fc.option(fc.integer({ min: 1, max: 999999 }), { nil: undefined }),
  description: nonEmptyStr,
  category: nonEmptyStr,
  features: fc.array(nonEmptyStr, { minLength: 0, maxLength: 10 }),
  colors: fc.array(nonEmptyStr, { minLength: 0, maxLength: 10 }),
  sizes: fc.array(nonEmptyStr, { minLength: 0, maxLength: 10 }),
  featured: fc.boolean(),
  tags: fc.array(nonEmptyStr, { minLength: 0, maxLength: 10 }),
  images: fc.array(fc.webUrl(), { minLength: 0, maxLength: 5 }),
});

// ---------------------------------------------------------------------------
// Property 7: Form pre-population matches source data
// ---------------------------------------------------------------------------

describe('Property 7: Form pre-population matches source data', () => {
  // Feature: admin-dashboard-redesign, Property 7: Form pre-population matches source data
  it('name field equals source name after population', () => {
    fc.assert(
      fc.property(productSourceArb, (p) => {
        const form = populateProductForm(p);
        expect(form.name).toBe(p.name);
      }),
      { numRuns: 100 }
    );
  });

  it('price field equals String(source.price) after population', () => {
    fc.assert(
      fc.property(productSourceArb, (p) => {
        const form = populateProductForm(p);
        expect(form.price).toBe(String(p.price));
      }),
      { numRuns: 100 }
    );
  });

  it('originalPrice field equals String(source.originalPrice) when present, empty string when absent', () => {
    fc.assert(
      fc.property(productSourceArb, (p) => {
        const form = populateProductForm(p);
        if (p.originalPrice != null) {
          expect(form.originalPrice).toBe(String(p.originalPrice));
        } else {
          expect(form.originalPrice).toBe('');
        }
      }),
      { numRuns: 100 }
    );
  });

  it('description field equals source description after population', () => {
    fc.assert(
      fc.property(productSourceArb, (p) => {
        const form = populateProductForm(p);
        expect(form.description).toBe(p.description);
      }),
      { numRuns: 100 }
    );
  });

  it('tags array equals source tags after population', () => {
    fc.assert(
      fc.property(productSourceArb, (p) => {
        const form = populateProductForm(p);
        expect(form.tags).toEqual(p.tags);
      }),
      { numRuns: 100 }
    );
  });

  it('features textarea equals source features joined by newline', () => {
    fc.assert(
      fc.property(productSourceArb, (p) => {
        const form = populateProductForm(p);
        expect(form.features).toBe(p.features.join('\n'));
      }),
      { numRuns: 100 }
    );
  });

  it('colors textarea equals source colors joined by ", "', () => {
    fc.assert(
      fc.property(productSourceArb, (p) => {
        const form = populateProductForm(p);
        expect(form.colors).toBe(p.colors.join(', '));
      }),
      { numRuns: 100 }
    );
  });

  it('sizes textarea equals source sizes joined by ", "', () => {
    fc.assert(
      fc.property(productSourceArb, (p) => {
        const form = populateProductForm(p);
        expect(form.sizes).toBe(p.sizes.join(', '));
      }),
      { numRuns: 100 }
    );
  });

  it('featured boolean equals source featured after population', () => {
    fc.assert(
      fc.property(productSourceArb, (p) => {
        const form = populateProductForm(p);
        expect(form.featured).toBe(!!p.featured);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 8: Tag list mutation correctness
// ---------------------------------------------------------------------------

describe('Property 8: Tag list mutation correctness', () => {
  // Feature: admin-dashboard-redesign, Property 8: Tag list mutation correctness
  it('adding a new tag increases length by exactly 1 and tag appears in list', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyStr, { minLength: 0, maxLength: 20 }),
        nonEmptyStr,
        (tags, newTag) => {
          // Ensure newTag is not already in the list to test the "add" path
          fc.pre(!tags.includes(newTag.trim()));
          const result = addTag(tags, newTag);
          expect(result).toHaveLength(tags.length + 1);
          expect(result).toContain(newTag.trim());
        }
      ),
      { numRuns: 100 }
    );
  });

  it('adding a duplicate tag does not change the list', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyStr, { minLength: 1, maxLength: 20 }),
        (tags) => {
          // Use the trimmed form of the first tag (as addTag trims before checking)
          const existing = tags[0].trim();
          fc.pre(existing.length > 0);
          // Rebuild tags so the first element is already trimmed (matches what addTag stores)
          const normalizedTags = [existing, ...tags.slice(1)];
          const result = addTag(normalizedTags, existing);
          expect(result).toHaveLength(normalizedTags.length);
          expect(result).toEqual(normalizedTags);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('removing an existing tag decreases length by exactly 1 and tag is gone', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyStr, { minLength: 1, maxLength: 20 }),
        fc.nat(),
        (tags, rawIndex) => {
          const index = rawIndex % tags.length;
          const tagToRemove = tags[index];
          // Ensure the tag appears exactly once for a clean test
          fc.pre(tags.filter((t) => t === tagToRemove).length === 1);
          const result = removeTag(tags, tagToRemove);
          expect(result).toHaveLength(tags.length - 1);
          expect(result).not.toContain(tagToRemove);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('removing a tag that does not exist leaves the list unchanged', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyStr, { minLength: 0, maxLength: 20 }),
        nonEmptyStr,
        (tags, absentTag) => {
          fc.pre(!tags.includes(absentTag));
          const result = removeTag(tags, absentTag);
          expect(result).toEqual(tags);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9: Input string parsing (features, colors, sizes)
// ---------------------------------------------------------------------------

describe('Property 9: Input string parsing (features, colors, sizes)', () => {
  // Feature: admin-dashboard-redesign, Property 9: Input string parsing (features, colors, sizes)
  it('parseFeatures: every element in result is a non-empty string', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyStr, { minLength: 1, maxLength: 20 }),
        (items) => {
          const text = items.join('\n');
          const result = parseFeatures(text);
          expect(result.length).toBeGreaterThan(0);
          result.forEach((item) => {
            expect(item.length).toBeGreaterThan(0);
            expect(item).toBe(item.trim());
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('parseFeatures: result contains no empty strings even with blank lines', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ maxLength: 30 }), { minLength: 1, maxLength: 20 }),
        (items) => {
          const text = items.join('\n');
          const result = parseFeatures(text);
          result.forEach((item) => {
            expect(item.trim().length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('parseCommaSeparated: every element in result is a non-empty string', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyStr, { minLength: 1, maxLength: 20 }),
        (items) => {
          const text = items.join(',');
          const result = parseCommaSeparated(text);
          expect(result.length).toBeGreaterThan(0);
          result.forEach((item) => {
            expect(item.length).toBeGreaterThan(0);
            expect(item).toBe(item.trim());
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('parseCommaSeparated: result contains no empty strings even with extra commas', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ maxLength: 30 }), { minLength: 1, maxLength: 20 }),
        (items) => {
          const text = items.join(',');
          const result = parseCommaSeparated(text);
          result.forEach((item) => {
            expect(item.trim().length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('parseFeatures round-trip: joining non-empty items by newline and parsing returns same items', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyStr, { minLength: 1, maxLength: 10 }),
        (items) => {
          // Items must not contain newlines themselves
          const clean = items.map((s) => s.replace(/\n/g, ' ').trim()).filter(Boolean);
          fc.pre(clean.length > 0);
          const text = clean.join('\n');
          const result = parseFeatures(text);
          expect(result).toEqual(clean);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 10: Form validation rejects missing required fields
// ---------------------------------------------------------------------------

describe('Property 10: Form validation rejects missing required fields', () => {
  // Feature: admin-dashboard-redesign, Property 10: Form validation rejects missing required fields
  it('returns error for missing name', () => {
    fc.assert(
      fc.property(priceStr, nonEmptyStr, nonEmptyStr, (price, description, category) => {
        const errors = validateProductForm({ name: '', price, description, category });
        expect(errors).toHaveProperty('name');
      }),
      { numRuns: 100 }
    );
  });

  it('returns error for missing price', () => {
    fc.assert(
      fc.property(nonEmptyStr, nonEmptyStr, nonEmptyStr, (name, description, category) => {
        const errors = validateProductForm({ name, price: '', description, category });
        expect(errors).toHaveProperty('price');
      }),
      { numRuns: 100 }
    );
  });

  it('returns error for zero or negative price', () => {
    fc.assert(
      fc.property(
        nonEmptyStr,
        fc.integer({ min: -999999, max: 0 }),
        nonEmptyStr,
        nonEmptyStr,
        (name, price, description, category) => {
          const errors = validateProductForm({ name, price: String(price), description, category });
          expect(errors).toHaveProperty('price');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns error for missing description', () => {
    fc.assert(
      fc.property(nonEmptyStr, priceStr, nonEmptyStr, (name, price, category) => {
        const errors = validateProductForm({ name, price, description: '', category });
        expect(errors).toHaveProperty('description');
      }),
      { numRuns: 100 }
    );
  });

  it('returns error for missing category', () => {
    fc.assert(
      fc.property(nonEmptyStr, priceStr, nonEmptyStr, (name, price, description) => {
        const errors = validateProductForm({ name, price, description, category: '' });
        expect(errors).toHaveProperty('category');
      }),
      { numRuns: 100 }
    );
  });

  it('returns errors for all missing required fields when data is empty', () => {
    fc.assert(
      fc.property(fc.constant({}), (data) => {
        const errors = validateProductForm(data);
        expect(Object.keys(errors).length).toBeGreaterThan(0);
        expect(errors).toHaveProperty('name');
        expect(errors).toHaveProperty('price');
        expect(errors).toHaveProperty('description');
        expect(errors).toHaveProperty('category');
      }),
      { numRuns: 100 }
    );
  });

  it('returns empty errors object when all required fields are valid', () => {
    fc.assert(
      fc.property(nonEmptyStr, priceStr, nonEmptyStr, nonEmptyStr, (name, price, description, category) => {
        const errors = validateProductForm({ name, price, description, category });
        expect(Object.keys(errors)).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });
});
