/**
 * Error handling utilities
 */

export interface AppError {
  code?: string;
  message: string;
  details?: unknown;
}

/**
 * Parse error from various sources (API, contract, etc.)
 */
export function parseError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: (error as { code?: string }).code,
      details: error,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: String(error.message),
      code: 'code' in error ? String(error.code) : undefined,
      details: error,
    };
  }

  return {
    message: 'An unexpected error occurred',
    details: error,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  const parsed = parseError(error);
  
  // Handle common error patterns
  if (parsed.message.includes('user rejected')) {
    return 'Transaction was cancelled';
  }
  
  if (parsed.message.includes('insufficient funds')) {
    return 'Insufficient balance for this transaction';
  }
  
  if (parsed.message.includes('network')) {
    return 'Network error. Please check your connection.';
  }
  
  if (parsed.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  return parsed.message || 'An unexpected error occurred';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const parsed = parseError(error);
  const message = parsed.message.toLowerCase();
  
  return (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('rate limit') ||
    message.includes('temporarily unavailable')
  );
}

/**
 * Log error for debugging
 */
export function logError(error: unknown, context?: string): void {
  const parsed = parseError(error);
  
  if (typeof window !== 'undefined' && window.console) {
    console.error(`[Error${context ? ` - ${context}` : ''}]`, {
      message: parsed.message,
      code: parsed.code,
      details: parsed.details,
    });
  }
}

