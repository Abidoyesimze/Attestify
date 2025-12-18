'use client';

import React, { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className = '',
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-t-lg"
        aria-expanded={isOpen}
        aria-controls="collapsible-content"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div
          id="collapsible-content"
          className="p-4 border-t border-gray-200"
        >
          {children}
        </div>
      )}
    </div>
  );
}

