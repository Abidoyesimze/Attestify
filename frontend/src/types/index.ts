/**
 * Shared TypeScript types and interfaces
 */

// Transaction states
export type TransactionStep = 
  | 'idle'
  | 'approving'
  | 'pending'
  | 'success'
  | 'error';

// Strategy types
export type StrategyType = 'conservative' | 'balanced' | 'growth';
export type StrategyIndex = 0 | 1 | 2;

// User verification status
export interface VerificationStatus {
  isVerified: boolean;
  verifiedAt?: Date;
  walletAddress: string;
}

// Vault statistics
export interface VaultStats {
  totalValueLocked: bigint;
  totalShares: bigint;
  reserveBalance: bigint;
  deployedToAave: bigint;
  totalDeposited: bigint;
  totalWithdrawn: bigint;
}

// User profile data
export interface UserProfile {
  isVerified: boolean;
  verifiedAt: bigint;
  totalDeposited: bigint;
  totalWithdrawn: bigint;
  lastActionTime: bigint;
}

// Strategy details
export interface StrategyDetails {
  name: string;
  apyRange: { min: number; max: number };
  riskLevel: 'low' | 'medium' | 'high';
  allocation: {
    aave: number;
    reserve: number;
  };
}

// Balance history for charts
export interface BalanceHistoryPoint {
  date: string;
  value: number;
  timestamp: number;
}

// AI Chat message
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id?: string;
  error?: boolean;
  retryCount?: number;
  isEditing?: boolean;
}

// API response types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Transaction error
export interface TransactionError {
  code?: string;
  message: string;
  data?: unknown;
}

// Form validation result
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Wallet connection state
export interface WalletState {
  isConnected: boolean;
  address?: string;
  chainId?: number;
  isConnecting: boolean;
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Error state
export interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  retry?: () => void;
}

