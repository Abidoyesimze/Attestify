'use client';

import React from 'react';

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'red' | 'yellow';
  className?: string;
}

const sizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const colors = {
  green: 'bg-green-600',
  blue: 'bg-blue-600',
  red: 'bg-red-600',
  yellow: 'bg-yellow-600',
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'green',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} transition-all duration-300 ease-out ${sizes[size]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

