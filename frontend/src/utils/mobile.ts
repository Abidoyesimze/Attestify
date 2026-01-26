/**
 * Mobile-specific utilities
 */

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
  );
}

export function getViewportSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function isLandscape(): boolean {
  const { width, height } = getViewportSize();
  return width > height;
}

export function isPortrait(): boolean {
  const { width, height } = getViewportSize();
  return height > width;
}
