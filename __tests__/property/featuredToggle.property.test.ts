// Feature: admin-dashboard-redesign, Property 6: FeaturedToggle renders correct icon variant for any boolean

/**
 * Property 6: FeaturedToggle renders correct icon variant for any boolean
 * Validates: Requirements 5.1
 *
 * For any boolean `initialFeatured`, the icon class should be:
 *   - 'text-amber-500 fill-current' when featured is true (filled amber star)
 *   - 'text-neutral-300' when featured is false (outline star)
 */

import * as fc from 'fast-check';
import { getFeaturedIconClass } from '../../app/admin/utils/featuredToggleUtils';

describe('Property 6: FeaturedToggle renders correct icon variant for any boolean', () => {
  it('returns amber filled class when featured is true', () => {
    fc.assert(
      fc.property(fc.constant(true), (featured) => {
        const cls = getFeaturedIconClass(featured);
        expect(cls).toContain('text-amber-500');
        expect(cls).toContain('fill-current');
      }),
      { numRuns: 100 }
    );
  });

  it('returns neutral outline class when featured is false', () => {
    fc.assert(
      fc.property(fc.constant(false), (featured) => {
        const cls = getFeaturedIconClass(featured);
        expect(cls).toBe('text-neutral-300');
        expect(cls).not.toContain('fill-current');
      }),
      { numRuns: 100 }
    );
  });

  it('correct icon class for any boolean value', () => {
    fc.assert(
      fc.property(fc.boolean(), (featured) => {
        const cls = getFeaturedIconClass(featured);
        if (featured) {
          expect(cls).toContain('text-amber-500');
          expect(cls).toContain('fill-current');
        } else {
          expect(cls).toBe('text-neutral-300');
          expect(cls).not.toContain('fill-current');
        }
      }),
      { numRuns: 100 }
    );
  });
});
