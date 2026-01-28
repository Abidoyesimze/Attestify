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
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (optimisticData: T) => {
    const previousData = data;
    
    // Optimistically update UI
    setData(optimisticData);
    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateFn(optimisticData);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Update failed');
      setError(error);
      
      if (options.rollbackOnError !== false) {
        setData(previousData);
      }
      
      options.onError?.(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [data, updateFn, options]);

  return {
    data,
    update,
    isUpdating,
    error,
  };
}
