// Feature: admin-dashboard-redesign, Property 17: Category model enforces required fields

/**
 * Validates: Requirements 12.1
 *
 * Property 17: For any attempt to create a Category document with a missing
 * `name`, `slug`, or `color` field, Mongoose validation should throw a
 * ValidationError and the document should not be persisted.
 */

import * as fc from 'fast-check';
import mongoose from 'mongoose';
import Category from '../../app/models/Category';

// Arbitrary for a valid hex color
const hexColorArb = fc
  .tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 })
  )
  .map(([r, g, b]) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);

// Arbitrary for a valid slug
const slugArb = fc
  .array(fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0', '1', '2', '-'), {
    minLength: 1,
    maxLength: 20,
  })
  .map((chars) => chars.join('').replace(/^-+|-+$/g, '') || 'slug');

// Arbitrary for a non-empty name
const nameArb = fc.string({ minLength: 1, maxLength: 50 });

describe('Property 17: Category model enforces required fields', () => {
  // Ensure mongoose doesn't try to connect — we only call .validate()
  afterAll(async () => {
    // Clean up any registered models to avoid "Cannot overwrite model" errors
    // in repeated test runs
    if (mongoose.modelNames().includes('Category')) {
      // no-op: model already registered, that's fine
    }
  });

  it('should throw ValidationError when `name` is missing', async () => {
    await fc.assert(
      fc.asyncProperty(slugArb, hexColorArb, async (slug, color) => {
        const doc = new Category({ slug, color });
        await expect(doc.validate()).rejects.toMatchObject({
          name: 'ValidationError',
          errors: expect.objectContaining({ name: expect.anything() }),
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should throw ValidationError when `slug` is missing', async () => {
    await fc.assert(
      fc.asyncProperty(nameArb, hexColorArb, async (name, color) => {
        const doc = new Category({ name, color });
        await expect(doc.validate()).rejects.toMatchObject({
          name: 'ValidationError',
          errors: expect.objectContaining({ slug: expect.anything() }),
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should throw ValidationError when `color` is missing', async () => {
    await fc.assert(
      fc.asyncProperty(nameArb, slugArb, async (name, slug) => {
        const doc = new Category({ name, slug });
        await expect(doc.validate()).rejects.toMatchObject({
          name: 'ValidationError',
          errors: expect.objectContaining({ color: expect.anything() }),
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should throw ValidationError when all required fields are missing', async () => {
    await fc.assert(
      fc.asyncProperty(fc.record({}), async () => {
        const doc = new Category({});
        await expect(doc.validate()).rejects.toMatchObject({
          name: 'ValidationError',
          errors: expect.objectContaining({
            name: expect.anything(),
            slug: expect.anything(),
            color: expect.anything(),
          }),
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should NOT throw ValidationError when all required fields are present and valid', async () => {
    await fc.assert(
      fc.asyncProperty(nameArb, slugArb, hexColorArb, async (name, slug, color) => {
        const doc = new Category({ name, slug, color });
        await expect(doc.validate()).resolves.toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });
});
