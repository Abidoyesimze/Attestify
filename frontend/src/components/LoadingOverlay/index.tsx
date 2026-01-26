'use client';

import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export default function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  className = '',
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}
