'use client';

import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean | 'full';
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = true,
  className = '',
}: SkeletonProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  const roundedClass =
    rounded === 'full' ? 'rounded-full' : rounded ? 'rounded' : '';

  return (
    <div
      className={`bg-gray-200 animate-pulse ${roundedClass} ${className}`}
      style={{ width: widthStyle, height: heightStyle }}
      aria-label="Loading..."
      role="status"
    />
  );
}

