'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  className = '',
}: StatsCardProps) {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      {change && (
        <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${trendColors[trend]}`}>
          {trend === 'up' && <TrendingUp className="h-3 w-3" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3" />}
          <span>{change.value > 0 ? '+' : ''}{change.value}%</span>
          <span className="text-xs opacity-75">{change.label}</span>
        </div>
      )}
    </Card>
  );
}
