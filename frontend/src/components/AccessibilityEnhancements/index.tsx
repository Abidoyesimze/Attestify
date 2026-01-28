'use client';

import { useEffect } from 'react';

export function useFocusManagement() {
  useEffect(() => {
    // Add keyboard navigation improvements
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content with Alt+M
      if (e.altKey && e.key === 'm') {
        const main = document.querySelector('main');
        if (main) {
          (main as HTMLElement).focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-lg"
    >
      Skip to main content
    </a>
  );
}

export function HighContrastMode() {
  useEffect(() => {
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };

    prefersHighContrast.addEventListener('change', handleChange);
    
    if (prefersHighContrast.matches) {
      document.documentElement.classList.add('high-contrast');
    }

    return () => {
      prefersHighContrast.removeEventListener('change', handleChange);
    };
  }, []);
}
