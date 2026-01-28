import { useState, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

export function useDataCache<T>(options: CacheOptions = {}) {
  const { ttl = 5 * 60 * 1000 } = options; // Default 5 minutes
  const cache = useRef<Map<string, CacheEntry<T>>>(new Map());

  const get = useCallback((key: string): T | null => {
    const entry = cache.current.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      cache.current.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const set = useCallback((key: string, data: T, customTtl?: number) => {
    const expiresAt = Date.now() + (customTtl || ttl);
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt,
    });
  }, [ttl]);

  const invalidate = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  return {
    get,
    set,
    invalidate,
    clear,
  };
}
