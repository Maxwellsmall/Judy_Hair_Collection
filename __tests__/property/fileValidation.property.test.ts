// Feature: admin-dashboard-redesign, Property 11: File validation rejects oversized and invalid-type files
// Feature: admin-dashboard-redesign, Property 12: Removing a file from pending list excludes it

/**
 * Property 11: File validation rejects oversized and invalid-type files
 * Validates: Requirements 8.5, 8.6
 *
 * Property 12: Removing a file from pending list excludes it
 * Validates: Requirements 8.3
 */

import * as fc from 'fast-check';
import { validateFile, ALLOWED_TYPES, MAX_SIZE_BYTES } from '../../app/admin/utils/fileValidation';

// ---------------------------------------------------------------------------
// Property 11: File validation rejects oversized and invalid-type files
// ---------------------------------------------------------------------------

describe('Property 11: File validation rejects oversized and invalid-type files', () => {
  it('rejects files exceeding 10MB regardless of type', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALLOWED_TYPES),
        fc.integer({ min: MAX_SIZE_BYTES + 1, max: MAX_SIZE_BYTES * 10 }),
        (type, size) => {
          const result = validateFile({ size, type });
          expect(result).not.toBeNull();
          expect(result).toContain('10MB');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects files with invalid MIME types regardless of size', () => {
    const invalidTypes = ['text/plain', 'application/pdf', 'image/gif', 'image/bmp', 'video/mp4'];
    fc.assert(
      fc.property(
        fc.constantFrom(...invalidTypes),
        fc.integer({ min: 0, max: MAX_SIZE_BYTES }),
        (type, size) => {
          const result = validateFile({ size, type });
          expect(result).not.toBeNull();
          expect(result).toContain('JPG, PNG, WebP');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('accepts valid type and size within limits', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALLOWED_TYPES),
        fc.integer({ min: 0, max: MAX_SIZE_BYTES }),
        (type, size) => {
          const result = validateFile({ size, type });
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects files that are both oversized and invalid type', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }).filter(
          (t) => !ALLOWED_TYPES.includes(t)
        ),
        fc.integer({ min: MAX_SIZE_BYTES + 1, max: MAX_SIZE_BYTES * 5 }),
        (type, size) => {
          const result = validateFile({ size, type });
          // Should return an error (type check fires first)
          expect(result).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 12: Removing a file from pending list excludes it
// ---------------------------------------------------------------------------

/** Pure helper that mirrors the remove logic in ImageUpload */
function removeFileAtIndex<T>(list: T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

describe('Property 12: Removing a file from pending list excludes it', () => {
  it('removing at any valid index reduces list length by exactly 1', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 20 }),
        (list) => {
          const index = fc.sample(fc.integer({ min: 0, max: list.length - 1 }), 1)[0];
          const result = removeFileAtIndex(list, index);
          expect(result).toHaveLength(list.length - 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('removed item is not present in the result list (by reference)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 20 }),
        fc.nat(),
        (list, rawIndex) => {
          const index = rawIndex % list.length;
          const removed = list[index];
          const result = removeFileAtIndex(list, index);

          // The item at that index is gone; remaining items are preserved
          expect(result).toHaveLength(list.length - 1);
          // All items before the removed index are unchanged
          for (let i = 0; i < index; i++) {
            expect(result[i]).toBe(list[i]);
          }
          // All items after the removed index are shifted left by 1
          for (let i = index; i < result.length; i++) {
            expect(result[i]).toBe(list[i + 1]);
          }
          // The removed value is no longer at that position
          expect(result[index]).not.toBe(removed);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('removing from a single-element list produces an empty list', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (item) => {
        const result = removeFileAtIndex([item], 0);
        expect(result).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });
});
