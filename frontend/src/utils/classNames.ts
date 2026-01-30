/**
 * Utility to conditionally join classNames
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create a className builder with conditional classes
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classNames(...classes);
}

