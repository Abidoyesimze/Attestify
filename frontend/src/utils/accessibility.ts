/**
 * Accessibility utilities and helpers
 */

/**
 * Generate a unique ID for ARIA attributes
 */
let idCounter = 0;
export function generateId(prefix = 'id'): string {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}

/**
 * Get ARIA label for transaction status
 */
export function getTransactionAriaLabel(
  step: 'idle' | 'approving' | 'pending' | 'success' | 'error',
  action: 'deposit' | 'withdraw' | 'strategy'
): string {
  const actionMap = {
    deposit: 'deposit',
    withdraw: 'withdrawal',
    strategy: 'strategy change',
  };

  const stepMap = {
    idle: `Ready to ${actionMap[action]}`,
    approving: `Approving ${actionMap[action]}...`,
    pending: `Processing ${actionMap[action]}...`,
    success: `${actionMap[action]} successful`,
    error: `${actionMap[action]} failed`,
  };

  return stepMap[step];
}

/**
 * Get ARIA live region announcement for screen readers
 */
export function getAriaAnnouncement(
  type: 'success' | 'error' | 'info',
  message: string
): string {
  const prefix = {
    success: 'Success:',
    error: 'Error:',
    info: 'Info:',
  };

  return `${prefix[type]} ${message}`;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Focus management utilities
 */
export function focusElement(element: HTMLElement | null): void {
  if (element) {
    element.focus();
    // Ensure element is visible
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Trap focus within a container (for modals)
 */
export function trapFocus(
  container: HTMLElement,
  event: KeyboardEvent
): void {
  if (event.key !== 'Tab') return;

  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
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

