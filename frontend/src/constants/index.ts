/**
 * Application constants
 * Centralized location for magic numbers and configuration values
 */

// Transaction limits
export const TRANSACTION_LIMITS = {
  MIN_DEPOSIT: 1, // 1 cUSD
  MAX_DEPOSIT: 10000, // 10,000 cUSD
  MIN_WITHDRAWAL: 0.01, // 0.01 cUSD
  MAX_DECIMAL_PLACES: 18,
} as const;

// Gas limits
export const GAS_LIMITS = {
  DEPOSIT: 500000n,
  WITHDRAW: 300000n,
  APPROVAL: 100000n,
  STRATEGY_CHANGE: 200000n,
} as const;

// Time intervals (in milliseconds)
export const INTERVALS = {
  BALANCE_REFRESH: 10000, // 10 seconds
  VERIFICATION_CHECK: 5000, // 5 seconds
  CHART_UPDATE: 60000, // 1 minute
  CONNECTION_CHECK: 30000, // 30 seconds
} as const;

// UI constants
export const UI = {
  MAX_MESSAGE_LENGTH: 10000,
  MAX_SEARCH_RESULTS: 50,
  MESSAGE_HISTORY_LIMIT: 100,
  DEBOUNCE_DELAY: 300, // milliseconds
  TOAST_DURATION: 5000, // milliseconds
  ANIMATION_DURATION: 200, // milliseconds
} as const;

// Strategy indices
export const STRATEGIES = {
  CONSERVATIVE: 0,
  BALANCED: 1,
  GROWTH: 2,
} as const;

// Strategy names
export const STRATEGY_NAMES = {
  [STRATEGIES.CONSERVATIVE]: 'Conservative',
  [STRATEGIES.BALANCED]: 'Balanced',
  [STRATEGIES.GROWTH]: 'Growth',
} as const;

// APY ranges (for display)
export const APY_RANGES = {
  CONSERVATIVE: { min: 3, max: 5 },
  BALANCED: { min: 5, max: 10 },
  GROWTH: { min: 10, max: 15 },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  INSUFFICIENT_BALANCE: 'Insufficient balance.',
  INVALID_AMOUNT: 'Invalid amount entered.',
  WALLET_NOT_CONNECTED: 'Please connect your wallet.',
  NOT_VERIFIED: 'Please verify your identity first.',
  CONTRACT_PAUSED: 'Contract is currently paused.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  DEPOSIT_SUCCESS: 'Deposit successful!',
  WITHDRAW_SUCCESS: 'Withdrawal successful!',
  STRATEGY_CHANGED: 'Strategy changed successfully!',
  VERIFICATION_COMPLETE: 'Verification complete!',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AI_CHAT_MESSAGES: 'ai_chat_messages',
  AI_CHAT_SESSION: 'ai_chat_session_id',
  AUTH_TOKEN: 'auth_token',
  WALLET_ADDRESS: 'wallet_address',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Chart configuration
export const CHART_CONFIG = {
  DAYS_TO_SHOW: 7,
  UPDATE_INTERVAL: 60000, // 1 minute
  POINT_RADIUS: 4,
  STROKE_WIDTH: 3,
} as const;

// Accessibility
export const A11Y = {
  MIN_TOUCH_TARGET: 44, // pixels
  FOCUS_VISIBLE: true,
  REDUCED_MOTION: 'prefers-reduced-motion',
} as const;

