'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  error?: string;
  maxRetries?: number;
}

export default function RetryButton({ 
  onRetry, 
  error,
  maxRetries = 3 
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string>();

  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      return;
    }

    setIsRetrying(true);
    setLastError(undefined);

    try {
      await onRetry();
      setRetryCount(0);
    } catch (err) {
      setLastError(err instanceof Error ? err.message : 'Retry failed');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  };

  const displayError = error || lastError;
  const canRetry = retryCount < maxRetries;

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
      {displayError && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{displayError}</span>
        </div>
      )}
      
      {canRetry ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetry}
          disabled={isRetrying}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>
            {isRetrying ? 'Retrying...' : `Retry (${retryCount}/${maxRetries})`}
          </span>
        </motion.button>
      ) : (
        <p className="text-sm text-red-600">
          Maximum retry attempts reached. Please refresh the page.
        </p>
      )}
    </div>
  );
}
