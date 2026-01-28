'use client';

import { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import PortfolioChart from '@/components/PortfolioChart';

interface HistoricalDataViewProps {
  data: Array<{
    date: string;
    balance: number;
    earnings: number;
    deposits: number;
  }>;
  period: '7d' | '30d' | '90d' | '1y' | 'all';
  onPeriodChange: (period: '7d' | '30d' | '90d' | '1y' | 'all') => void;
}

export default function HistoricalDataView({
  data,
  period,
  onPeriodChange
}: HistoricalDataViewProps) {
  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ];

  const filteredData = data; // Filter logic would go here based on period

  const totalEarnings = filteredData.reduce((sum, item) => sum + item.earnings, 0);
  const totalDeposits = filteredData.reduce((sum, item) => sum + item.deposits, 0);
  const currentBalance = filteredData[filteredData.length - 1]?.balance || 0;
  const previousBalance = filteredData[filteredData.length - 2]?.balance || 0;
  const balanceChange = currentBalance - previousBalance;
  const balanceChangePercent = previousBalance > 0 
    ? ((balanceChange / previousBalance) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Historical Performance
        </h3>
        <div className="flex items-center gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value as any)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                period === p.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Earnings</span>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${totalEarnings.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Deposits</span>
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${totalDeposits.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Balance Change</span>
            {balanceChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-bold ${
            balanceChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {balanceChange >= 0 ? '+' : ''}${balanceChange.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {balanceChangePercent >= 0 ? '+' : ''}{balanceChangePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PortfolioChart data={filteredData} type="area" />
      </div>
    </div>
  );
}
