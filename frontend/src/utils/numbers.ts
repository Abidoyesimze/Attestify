/**
 * Number manipulation and calculation utilities
 */

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to specified decimal places
 */
export function round(value: number, decimals = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/**
 * Format number with fixed decimals, removing trailing zeros
 */
export function formatNumberFixed(value: number, decimals = 2): string {
  return value.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Parse string to number safely
 */
export function parseNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Check if number is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Convert wei to ether (or any token with 18 decimals)
 */
export function weiToEther(wei: bigint | string): number {
  const weiBigInt = typeof wei === 'string' ? BigInt(wei) : wei;
  return Number(weiBigInt) / 1e18;
}

/**
 * Convert ether to wei (or any token with 18 decimals)
 */
export function etherToWei(ether: number | string): bigint {
  const etherNum = typeof ether === 'string' ? parseFloat(ether) : ether;
  return BigInt(Math.floor(etherNum * 1e18));
}

/**
 * Calculate compound interest
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  compoundingFrequency = 365
): number {
  return principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time);
}

/**
 * Calculate simple interest
 */
export function calculateSimpleInterest(
  principal: number,
  rate: number,
  time: number
): number {
  return principal * (1 + rate * time);
}

