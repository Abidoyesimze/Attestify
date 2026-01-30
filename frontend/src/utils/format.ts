/**
 * Format utilities for displaying data
 */

/**
 * Format Ethereum address to shortened version
 * @param address - Full Ethereum address
 * @param chars - Number of characters to show on each side (default: 4)
 * @returns Formatted address (e.g., 0x1234...5678)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length < 10) return address;
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(value: number | string): string {
  return new Intl.NumberFormat('en-US').format(Number(value));
}

/**
 * Format currency amount with proper decimals
 */
export function formatCurrency(
  value: number | string | bigint,
  decimals = 2,
  currency = 'USD'
): string {
  const numValue = typeof value === 'bigint' ? Number(value) / 1e18 : Number(value);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(value: number | string | bigint): string {
  const numValue = typeof value === 'bigint' ? Number(value) / 1e18 : Number(value);
  
  if (numValue >= 1e9) {
    return `${(numValue / 1e9).toFixed(2)}B`;
  }
  if (numValue >= 1e6) {
    return `${(numValue / 1e6).toFixed(2)}M`;
  }
  if (numValue >= 1e3) {
    return `${(numValue / 1e3).toFixed(2)}K`;
  }
  return numValue.toFixed(2);
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const then = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  return then.toLocaleDateString();
}

/**
 * Format transaction hash for display
 */
export function formatTransactionHash(hash: string, chars = 8): string {
  if (!hash) return '';
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

