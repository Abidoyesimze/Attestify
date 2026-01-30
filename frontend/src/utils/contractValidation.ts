/**
 * Contract address and network validation utilities
 */

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate contract address and return normalized format
 */
export function validateContractAddress(address: string | undefined): `0x${string}` | null {
  if (!address) return null;
  if (!isValidAddress(address)) return null;
  return address as `0x${string}`;
}

/**
 * Check if address is a zero address
 */
export function isZeroAddress(address: string): boolean {
  return address === '0x0000000000000000000000000000000000000000' || 
         address === '0x0';
}

/**
 * Format address for display (truncate middle)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Get block explorer URL for address
 */
export function getExplorerUrl(address: string, network: 'celoSepolia' | 'celoMainnet' = 'celoSepolia'): string {
  const baseUrls = {
    celoSepolia: 'https://sepolia.celoscan.io',
    celoMainnet: 'https://celoscan.io',
  };
  return `${baseUrls[network]}/address/${address}`;
}

/**
 * Get block explorer URL for transaction
 */
export function getTransactionUrl(txHash: string, network: 'celoSepolia' | 'celoMainnet' = 'celoSepolia'): string {
  const baseUrls = {
    celoSepolia: 'https://sepolia.celoscan.io',
    celoMainnet: 'https://celoscan.io',
  };
  return `${baseUrls[network]}/tx/${txHash}`;
}



