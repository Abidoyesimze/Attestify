'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div>
        <label
          htmlFor={checkboxId}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={`
                sr-only peer
                ${className}
              `}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error || helperText
                  ? `${checkboxId}-${error ? 'error' : 'helper'}`
                  : undefined
              }
              {...props}
            />
            <div
              className={`
                w-5 h-5 border-2 rounded transition-all duration-200
                peer-checked:bg-green-600 peer-checked:border-green-600
                peer-focus:ring-2 peer-focus:ring-green-500 peer-focus:ring-offset-2
                ${
                  error
                    ? 'border-red-300'
                    : 'border-gray-300 group-hover:border-gray-400'
                }
              `}
            >
              <Check
                className={`
                  w-full h-full text-white opacity-0 peer-checked:opacity-100
                  transition-opacity duration-200
                `}
              />
            </div>
          </div>
          {label && (
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              {helperText && !error && (
                <p id={`${checkboxId}-helper`} className="text-xs text-gray-500 mt-1">
                  {helperText}
                </p>
              )}
            </div>
          )}
        </label>
        {error && (
          <p
            id={`${checkboxId}-error`}
            className="mt-1 text-sm text-red-600 ml-8"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

