'use client';

import { ReactNode } from 'react';

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  className?: string;
}

export default function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 6,
  className = '',
}: ResponsiveGridProps) {
  const gridCols = {
    mobile: `grid-cols-${cols.mobile || 1}`,
    tablet: `md:grid-cols-${cols.tablet || 2}`,
    desktop: `lg:grid-cols-${cols.desktop || 3}`,
  };

  return (
    <div
      className={`grid ${gridCols.mobile} ${gridCols.tablet} ${gridCols.desktop} gap-${gap} ${className}`}
    >
      {children}
    </div>
  );
}
