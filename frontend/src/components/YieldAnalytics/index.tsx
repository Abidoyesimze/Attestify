'use client';

import { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

interface YieldData {
  totalYield: number;
  apy: number;
  periodYield: number;
  breakdown: {
    name: string;
    value: number;
    color: string;
  }[];
}

interface YieldAnalyticsProps {
  data: YieldData;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const COLORS = ['#35D07F', '#10b981', '#059669', '#047857', '#065f46'];

export default function YieldAnalytics({ 
  data, 
  period = 'monthly' 
}: YieldAnalyticsProps) {
  const periodLabel = useMemo(() => {
    switch (period) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'Period';
    }
  }, [period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {data.name}
          </p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Yield Analytics
        </h3>
        <p className="text-sm text-gray-600">
          Performance breakdown and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Yield</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(data.totalYield)}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">APY</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {data.apy.toFixed(2)}%
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">{periodLabel}</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {formatCurrency(data.periodYield)}
          </p>
        </div>
      </div>

      {data.breakdown && data.breakdown.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Yield Breakdown
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.breakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
