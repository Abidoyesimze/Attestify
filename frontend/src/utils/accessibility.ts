/**
 * Accessibility utilities
 */

export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
    if (document.activeElement === firstElement) {
        e.preventDefault();
      lastElement?.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
        e.preventDefault();
      firstElement?.focus();
    }
  }
}

  element.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function getAriaLabel(element: HTMLElement): string | null {
  return element.getAttribute('aria-label') || 
         element.getAttribute('aria-labelledby') ||
         element.textContent?.trim() ||
         null;
}

export function isKeyboardNavigation(event: KeyboardEvent): boolean {
  return event.key === 'Tab' || 
         event.key === 'Enter' || 
         event.key === ' ' ||
         event.key.startsWith('Arrow');
}
