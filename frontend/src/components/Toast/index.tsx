'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const Icon = icons[type];

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${colors[type]} shadow-lg min-w-[300px] max-w-[500px] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-current rounded"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: Array<Omit<ToastProps, 'onClose'>>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

