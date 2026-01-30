import { useRef, useCallback, useEffect } from 'react';
import { throttle } from '@/utils/throttle';

/**
 * Hook to throttle a callback function
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);
  const throttledRef = useRef<ReturnType<typeof throttle<T>> | null>(null);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Recreate throttled function when delay changes
  useEffect(() => {
    throttledRef.current = throttle(
      ((...args: Parameters<T>) => {
        callbackRef.current(...args);
      }) as T,
      delay
    );
  }, [delay]);

  return useCallback(
    ((...args: Parameters<T>) => {
      throttledRef.current?.(...args);
    }) as T,
    []
  );
}

