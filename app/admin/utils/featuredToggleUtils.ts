/**
 * Pure helper: returns the CSS class string for the FeaturedToggle star icon.
 * Exported separately (no JSX) so property tests can import without JSX parsing.
 */
export function getFeaturedIconClass(featured: boolean): string {
  return featured ? 'text-amber-500 fill-current' : 'text-neutral-300';
}
