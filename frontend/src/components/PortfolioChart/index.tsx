'use client';

import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatEther } from 'viem';

interface PortfolioDataPoint {
  date: string;
  balance: number;
  earnings: number;
  deposits: number;
}

interface PortfolioChartProps {
  data: PortfolioDataPoint[];
  type?: 'line' | 'area';
  showLegend?: boolean;
}

export default function PortfolioChart({ 
  data, 
  type = 'area',
  showLegend = true 
}: PortfolioChartProps) {
  const chartData = useMemo(() => {
    return data.map(point => ({
      ...point,
      total: point.balance + point.earnings
    }));
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#35D07F" 
            strokeWidth={2}
            name="Balance"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="earnings" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Earnings"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#35D07F" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#35D07F" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `$${value.toFixed(0)}`}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Area 
          type="monotone" 
          dataKey="balance" 
          stroke="#35D07F" 
          fill="url(#colorBalance)"
          strokeWidth={2}
          name="Balance"
        />
        <Area 
          type="monotone" 
          dataKey="earnings" 
          stroke="#10b981" 
          fill="url(#colorEarnings)"
          strokeWidth={2}
          name="Earnings"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
