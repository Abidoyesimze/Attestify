'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

interface ComparisonData {
  period: string;
  yourYield: number;
  benchmark: number;
}

interface ComparisonChartProps {
  data: ComparisonData[];
  benchmarkLabel?: string;
}

export default function ComparisonChart({
  data,
  benchmarkLabel = 'Market Average'
}: ComparisonChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      difference: item.yourYield - item.benchmark,
      differencePercent: ((item.yourYield - item.benchmark) / item.benchmark) * 100
    }));
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{data.period}</p>
          <p className="text-sm text-green-600">
            Your Yield: {formatCurrency(data.yourYield)}
          </p>
          <p className="text-sm text-blue-600">
            {benchmarkLabel}: {formatCurrency(data.benchmark)}
          </p>
          <p className={`text-sm font-semibold mt-2 ${
            data.difference >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Difference: {data.difference >= 0 ? '+' : ''}{formatCurrency(data.difference)} 
            ({data.differencePercent >= 0 ? '+' : ''}{data.differencePercent.toFixed(2)}%)
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
          Performance Comparison
        </h3>
        <p className="text-sm text-gray-600">
          Your yield vs {benchmarkLabel}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="yourYield" 
            fill="#35D07F" 
            name="Your Yield"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="benchmark" 
            fill="#3b82f6" 
            name={benchmarkLabel}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
