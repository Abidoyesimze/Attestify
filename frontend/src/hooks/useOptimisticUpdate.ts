import { useState, useCallback } from 'react';

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  rollbackOnError?: boolean;
}

export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [previousData, setPreviousData] = useState<T | null>(null);

  const update = useCallback(async (optimisticData: T) => {
    setIsLoading(true);
    setError(null);
    setPreviousData(data);
    setData(optimisticData);

    try {
      const result = await updateFn(optimisticData);
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Update failed');
      setError(error);
      
      if (options.rollbackOnError && previousData !== null) {
        setData(previousData);
      }
      
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [data, updateFn, options, previousData]);

  return { data, update, isLoading, error };
}
