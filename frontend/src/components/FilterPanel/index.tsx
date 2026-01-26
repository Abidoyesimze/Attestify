'use client';

import { X, Filter } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  id: string;
  label: string;
  type: 'select' | 'date' | 'range';
  options?: FilterOption[];
  value: any;
  onChange: (value: any) => void;
}

interface FilterPanelProps {
  filters: Filter[];
  onReset: () => void;
  className?: string;
}

export default function FilterPanel({ filters, onReset, className = '' }: FilterPanelProps) {
  const activeFiltersCount = filters.filter(f => f.value && f.value !== 'all').length;

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filters.map((filter) => (
          <div key={filter.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filter.label}
            </label>
            {filter.type === 'select' && filter.options && (
              <Select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                options={filter.options}
              />
            )}
            {filter.type === 'date' && (
              <input
                type="date"
                value={filter.value || ''}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
