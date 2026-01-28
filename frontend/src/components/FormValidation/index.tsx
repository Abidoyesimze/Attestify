'use client';

import { ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFieldProps {
  label: string;
  error?: string;
  success?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ 
  label, 
  error, 
  success, 
  required, 
  children 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      {success && !error && (
        <div className="flex items-center gap-1 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

export function useFormValidation(rules: ValidationRule[]) {
  const validate = (value: string): string | undefined => {
    for (const rule of rules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }
    return undefined;
  };

  return { validate };
}
