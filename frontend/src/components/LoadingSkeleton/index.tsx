'use client';

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

/**
 * Reusable loading skeleton component
 */
export function LoadingSkeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  rounded = true 
}: LoadingSkeletonProps) {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded ? 'rounded' : ''} ${className}`}
      style={{ width, height }}
      aria-label="Loading..."
      role="status"
    />
  );
}

/**
 * Card skeleton for dashboard cards
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <LoadingSkeleton height="0.875rem" width="40%" className="mb-2" />
          <LoadingSkeleton height="2rem" width="60%" />
        </div>
        <LoadingSkeleton height="2.5rem" width="2.5rem" rounded />
      </div>
      <LoadingSkeleton height="0.75rem" width="50%" />
    </div>
  );
}

/**
 * Chart skeleton
 */
export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <LoadingSkeleton height="1.25rem" width="30%" />
        <LoadingSkeleton height="0.875rem" width="20%" />
      </div>
      <div className="h-64 flex items-end justify-between gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <LoadingSkeleton
            key={i}
            height={`${Math.random() * 60 + 40}%`}
            width="12%"
            rounded
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Message skeleton for chat
 */
export function MessageSkeleton() {
  return (
    <div className="flex gap-3 mb-4">
      <LoadingSkeleton height="2rem" width="2rem" rounded />
      <div className="flex-1">
        <LoadingSkeleton height="1rem" width="30%" className="mb-2" />
        <LoadingSkeleton height="1rem" width="100%" className="mb-1" />
        <LoadingSkeleton height="1rem" width="80%" />
      </div>
    </div>
  );
}

/**
 * Button skeleton
 */
export function ButtonSkeleton({ width = '100%' }: { width?: string }) {
  return (
    <LoadingSkeleton 
      height="2.5rem" 
      width={width} 
      rounded 
      className="mb-2"
    />
  );
}

/**
 * Input skeleton
 */
export function InputSkeleton() {
  return (
    <div className="mb-4">
      <LoadingSkeleton height="0.875rem" width="30%" className="mb-2" />
      <LoadingSkeleton height="2.5rem" width="100%" rounded />
    </div>
  );
}

