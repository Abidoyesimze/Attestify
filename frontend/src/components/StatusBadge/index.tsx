'use client';

import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'pending' | 'warning';
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    colors: 'bg-green-100 text-green-700 border-green-200',
  },
  error: {
    icon: XCircle,
    colors: 'bg-red-100 text-red-700 border-red-200',
  },
  pending: {
    icon: Clock,
    colors: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  warning: {
    icon: AlertCircle,
    colors: 'bg-orange-100 text-orange-700 border-orange-200',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export default function StatusBadge({
  status,
  label,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.colors} ${sizeClasses[size]} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
