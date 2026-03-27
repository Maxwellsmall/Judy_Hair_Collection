/**
 * Converts a name string into a URL-safe slug.
 * - Lowercases the string
 * - Replaces any sequence of non-alphanumeric characters with a single hyphen
 * - Strips leading and trailing hyphens
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
