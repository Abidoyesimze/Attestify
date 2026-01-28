'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorRecoveryProps {
  error: Error | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  children: ReactNode;
}

export default function ErrorRecovery({
  error,
  onRetry,
  onDismiss,
  children
}: ErrorRecoveryProps) {
  const [isVisible, setIsVisible] = useState(!!error);

  useEffect(() => {
    setIsVisible(!!error);
  }, [error]);

  if (!error) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    Error Occurred
                  </h3>
                  <p className="text-sm text-red-700 mb-3">
                    {error.message || 'An unexpected error occurred'}
                  </p>
                  <div className="flex items-center gap-2">
                    {onRetry && (
                      <button
                        onClick={() => {
                          onRetry();
                          setIsVisible(false);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                      </button>
                    )}
                    {onDismiss && (
                      <button
                        onClick={() => {
                          onDismiss();
                          setIsVisible(false);
                        }}
                        className="px-3 py-1.5 text-red-700 text-sm rounded hover:bg-red-100 transition-colors"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
