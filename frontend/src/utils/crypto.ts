/**
 * Cryptographic utilities
 */

/**
 * Generate a random hex string
 */
export function randomHex(length: number): string {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
}

/**
 * Hash a string (simple hash, not cryptographically secure)
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Generate a unique ID
 */
export function generateUniqueId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${randomHex(8)}`;
}

