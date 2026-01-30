import { useEffect, RefObject } from 'react';
import { trapFocus } from '@/utils/accessibility';

export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const cleanup = trapFocus(ref.current);
    return cleanup;
  }, [ref, isActive]);
}
