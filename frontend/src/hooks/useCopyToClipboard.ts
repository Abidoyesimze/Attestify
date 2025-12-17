import { useState, useCallback } from 'react';

/**
 * Hook to copy text to clipboard
 */
export function useCopyToClipboard(): [
  boolean,
  (text: string) => Promise<boolean>,
  () => void
] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not available');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return [copied, copy, reset];
}

