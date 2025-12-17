/**
 * Input validation utilities for frontend forms
 */

/**
 * Validate cUSD amount input
 * @param amount - Amount string to validate
 * @param min - Minimum allowed amount (in wei or string)
 * @param max - Maximum allowed amount (in wei or string)
 * @returns Error message or null if valid
 */
export function validateAmount(
  amount: string,
  min?: bigint | string,
  max?: bigint | string
): string | null {
  if (!amount || amount.trim() === '') {
    return 'Please enter an amount';
  }

  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return 'Please enter a valid number';
  }

  if (numAmount <= 0) {
    return 'Amount must be greater than 0';
  }

  if (min) {
    const minNum = typeof min === 'bigint' ? Number(min) / 1e18 : parseFloat(String(min));
    if (numAmount < minNum) {
      return `Minimum amount is ${minNum} cUSD`;
    }
  }

  if (max) {
    const maxNum = typeof max === 'bigint' ? Number(max) / 1e18 : parseFloat(String(max));
    if (numAmount > maxNum) {
      return `Maximum amount is ${maxNum} cUSD`;
    }
  }

  // Check for too many decimal places (max 18 for Ethereum)
  const decimalPlaces = amount.split('.')[1]?.length || 0;
  if (decimalPlaces > 18) {
    return 'Amount cannot have more than 18 decimal places';
  }

  return null;
}

/**
 * Validate wallet address format
 */
export function validateWalletAddress(address: string): string | null {
  if (!address) {
    return 'Wallet address is required';
  }

  if (!/^0x[a-fA-F0-9]{40}$/i.test(address)) {
    return 'Invalid wallet address format';
  }

  return null;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 10000); // Limit length
}

/**
 * Validate email format (if needed for future features)
 */
export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
}

/**
 * Validate percentage input (0-100)
 */
export function validatePercentage(percentage: string): string | null {
  const num = parseFloat(percentage);
  
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }

  if (num < 0 || num > 100) {
    return 'Percentage must be between 0 and 100';
  }

  return null;
}

/**
 * Format validation error for display
 */
export function formatValidationError(error: string | null): string {
  if (!error) return '';
  return error;
}

