import { useState, useCallback } from 'react';
import { retry, RetryOptions } from '@/utils/retry';

export interface UseRetryReturn<T> {
  execute: () => Promise<T | undefined>;
  isLoading: boolean;
  error: Error | null;
  attempt: number;
  reset: () => void;
}

/**
 * Hook to retry async operations
 */
export function useRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): UseRetryReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAttempt(0);

    try {
      const result = await retry(
        async () => {
          setAttempt((prev) => prev + 1);
          return await fn();
        },
        {
          ...options,
          onRetry: (attemptNumber, err) => {
            setAttempt(attemptNumber);
            setError(err);
            options.onRetry?.(attemptNumber, err);
          },
        }
      );

      setIsLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsLoading(false);
      return undefined;
    }
  }, [fn, options]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setAttempt(0);
  }, []);

  return { execute, isLoading, error, attempt, reset };
}

