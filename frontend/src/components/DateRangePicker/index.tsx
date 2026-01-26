'use client';

import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/Button';

interface DateRangePickerProps {
  onRangeChange: (start: Date | null, end: Date | null) => void;
  className?: string;
}

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This year', days: 365 },
];

export default function DateRangePicker({ onRangeChange, className = '' }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    onRangeChange(start, end);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onRangeChange(null, null);
  };

  const handleDateChange = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    onRangeChange(start, end);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Date Range</span>
        {(startDate || endDate) && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            handleDateChange();
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Start date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            handleDateChange();
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="End date"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => handlePreset(preset.days)}
            className="text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
