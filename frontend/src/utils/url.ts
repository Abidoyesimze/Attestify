/**
 * URL manipulation utilities
 */

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, string | number | boolean | null | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

/**
 * Parse query string to object
 */
export function parseQueryString(query: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(query);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Get query parameter from URL
 */
export function getQueryParam(key: string, defaultValue?: string): string | null {
  if (typeof window === 'undefined') return defaultValue || null;
  
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || defaultValue || null;
}

/**
 * Update URL without page reload
 */
export function updateUrl(params: Record<string, string | number | boolean | null>, replace = false): void {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  });
  
  if (replace) {
    window.history.replaceState({}, '', url.toString());
  } else {
    window.history.pushState({}, '', url.toString());
  }
}

