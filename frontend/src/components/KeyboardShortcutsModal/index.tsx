'use client';

import { Keyboard } from 'lucide-react';
import { Modal } from '@/components/Modal';

interface Shortcut {
  keys: string[];
  description: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['Ctrl', 'K'], description: 'Open search' },
  { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
  { keys: ['Ctrl', 'D'], description: 'Quick deposit' },
  { keys: ['Ctrl', 'W'], description: 'Quick withdraw' },
  { keys: ['Ctrl', 'G'], description: 'Go to goals' },
  { keys: ['Ctrl', 'R'], description: 'Go to referrals' },
  { keys: ['Ctrl', 'N'], description: 'Go to notifications' },
  { keys: ['Esc'], description: 'Close modal/dialog' },
];

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Keyboard className="h-5 w-5" />
          <p className="text-sm">Use these shortcuts to navigate faster</p>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex}>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="mx-1 text-gray-400">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 Tip: Press <kbd className="px-1.5 py-0.5 text-xs bg-blue-100 rounded">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-blue-100 rounded">/</kbd> anytime to see this menu
          </p>
        </div>
      </div>
    </Modal>
  );
}
