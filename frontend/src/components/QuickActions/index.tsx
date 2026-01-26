'use client';

import { useState } from 'react';
import { Plus, Download, Settings, Search, Zap } from 'lucide-react';
import { Button } from '@/components/Button';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  shortcut?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export default function QuickActions({ actions, className = '' }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="gap-2"
      >
        <Zap className="h-4 w-4" />
        Quick Actions
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <Icon className="h-4 w-4 text-gray-600" />
                <span className="flex-1 text-sm text-gray-700">{action.label}</span>
                {action.shortcut && (
                  <kbd className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {action.shortcut}
                  </kbd>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
