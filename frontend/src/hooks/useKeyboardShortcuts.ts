import { useEffect } from 'react';

interface Shortcut {
  keys: string[];
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const { keys, callback } = shortcut;
        const modifiers = ['Control', 'Meta', 'Alt', 'Shift'];
        const key = event.key;

        // Check if all required keys are pressed
        const allKeysPressed = keys.every((k) => {
          if (k === 'Ctrl' || k === 'Cmd') {
            return event.ctrlKey || event.metaKey;
          }
          if (k === 'Alt') {
            return event.altKey;
          }
          if (k === 'Shift') {
            return event.shiftKey;
          }
          return key.toLowerCase() === k.toLowerCase();
        });

        // Check that no extra modifiers are pressed
        const noExtraModifiers = modifiers.every((mod) => {
          if (keys.includes('Ctrl') || keys.includes('Cmd')) {
            return true; // Allow Ctrl/Cmd
          }
          if (keys.includes('Alt')) {
            return true; // Allow Alt
          }
          if (keys.includes('Shift')) {
            return true; // Allow Shift
          }
          return !event.getModifierState(mod);
        });

        if (allKeysPressed && noExtraModifiers) {
          event.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
