'use client';

import { ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface MobileOptimizedProps {
  mobile: ReactNode;
  desktop: ReactNode;
  breakpoint?: number;
}

export default function MobileOptimized({
  mobile,
  desktop,
  breakpoint = 768
}: MobileOptimizedProps) {
  const isMobile = useMediaQuery(`(max-width: ${breakpoint}px)`);

  return (
    <>
      {isMobile ? mobile : desktop}
    </>
  );
}
