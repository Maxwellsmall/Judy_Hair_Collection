/**
 * Pure file validation helper — exported separately (no JSX) for property tests.
 * Validates: Requirements 8.5, 8.6
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validates a file's type and size.
 * Returns an error message string if invalid, or null if valid.
 */
export function validateFile(file: { size: number; type: string }): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, WebP allowed';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'Image must be under 10MB';
  }
  return null;
}

export { ALLOWED_TYPES, MAX_SIZE_BYTES };
