import { useRef, useCallback } from 'react';
import { throttle } from '@/utils/throttle';

/**
 * Hook to throttle a callback function
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  const throttledCallbackRef = useRef<T | null>(null);

  if (!throttledCallbackRef.current) {
    throttledCallbackRef.current = throttle(callback, delay) as T;
  }

  return useCallback(
    ((...args: Parameters<T>) => {
      throttledCallbackRef.current?.(...args);
    }) as T,
    [delay]
  );
}

