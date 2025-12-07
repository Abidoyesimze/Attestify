import { type Address, type EstimateGasParameters } from 'viem';

/**
 * Gas estimation utilities for contract interactions
 */

// Standard gas limits for common operations
export const GAS_LIMITS = {
  DEPOSIT: BigInt(500000),
  WITHDRAW: BigInt(300000),
  APPROVE: BigInt(100000),
  STRATEGY_CHANGE: BigInt(200000),
  VERIFY_IDENTITY: BigInt(150000),
} as const;

/**
 * Estimate gas for deposit transaction
 */
export function estimateDepositGas(amount: bigint): bigint {
  // Base gas + amount-dependent gas (larger amounts may need more gas)
  const baseGas = GAS_LIMITS.DEPOSIT;
  const amountGas = amount > parseEther('1000') ? BigInt(50000) : BigInt(0);
  return baseGas + amountGas;
}

/**
 * Estimate gas for withdraw transaction
 */
export function estimateWithdrawGas(amount: bigint): bigint {
  return GAS_LIMITS.WITHDRAW;
}

/**
 * Estimate gas for approval transaction
 */
export function estimateApprovalGas(): bigint {
  return GAS_LIMITS.APPROVE;
}

/**
 * Get recommended gas limit for a transaction type
 */
export function getRecommendedGasLimit(
  transactionType: 'deposit' | 'withdraw' | 'approve' | 'strategy' | 'verify'
): bigint {
  switch (transactionType) {
    case 'deposit':
      return GAS_LIMITS.DEPOSIT;
    case 'withdraw':
      return GAS_LIMITS.WITHDRAW;
    case 'approve':
      return GAS_LIMITS.APPROVE;
    case 'strategy':
      return GAS_LIMITS.STRATEGY_CHANGE;
    case 'verify':
      return GAS_LIMITS.VERIFY_IDENTITY;
    default:
      return BigInt(300000); // Default fallback
  }
}

/**
 * Format gas limit for display
 */
export function formatGasLimit(gas: bigint): string {
  return gas.toString();
}

// Helper to parse ether (needed for gas estimation)
function parseEther(value: string): bigint {
  return BigInt(Math.floor(parseFloat(value) * 1e18));
}

