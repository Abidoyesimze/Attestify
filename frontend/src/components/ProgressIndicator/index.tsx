'use client';

import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
}

interface ProgressIndicatorProps {
  steps: Step[];
  className?: string;
}

export default function ProgressIndicator({ steps, className = '' }: ProgressIndicatorProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.status === 'completed'
                  ? 'bg-green-600 border-green-600 text-white'
                  : step.status === 'current'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {step.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : step.status === 'current' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                step.status === 'completed' || step.status === 'current'
                  ? 'text-gray-900'
                  : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 ${
                step.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
