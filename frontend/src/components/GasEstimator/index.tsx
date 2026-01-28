'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatEther } from 'viem';
import { useFeeData } from 'wagmi';

interface GasEstimatorProps {
  gasLimit?: bigint;
  showTrend?: boolean;
}

export default function GasEstimator({ 
  gasLimit = 21000n,
  showTrend = false 
}: GasEstimatorProps) {
  const { data: feeData, isLoading } = useFeeData();
  const [gasPrice, setGasPrice] = useState<bigint | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<string>('0');

  useEffect(() => {
    if (feeData?.gasPrice) {
      setGasPrice(feeData.gasPrice);
      const cost = feeData.gasPrice * gasLimit;
      setEstimatedCost(formatEther(cost));
    }
  }, [feeData, gasLimit]);

  const getGasStatus = () => {
    if (!gasPrice) return 'unknown';
    
    // Assuming average gas price is around 1 gwei
    const averageGasPrice = 1000000000n; // 1 gwei
    
    if (gasPrice > averageGasPrice * 2n) return 'high';
    if (gasPrice < averageGasPrice / 2n) return 'low';
    return 'normal';
  };

  const status = getGasStatus();
  const statusConfig = {
    high: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: TrendingUp,
      label: 'High'
    },
    low: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: TrendingDown,
      label: 'Low'
    },
    normal: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: Zap,
      label: 'Normal'
    },
    unknown: {
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: AlertCircle,
      label: 'Unknown'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Zap className="h-4 w-4 animate-pulse" />
        <span>Loading gas estimate...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}
    >
      <Icon className={`h-4 w-4 ${config.color}`} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${config.color}`}>
            Gas: {config.label}
          </span>
          {showTrend && status !== 'unknown' && (
            <span className="text-xs text-gray-500">
              {gasPrice ? `~${formatEther(gasPrice * gasLimit)} CELO` : 'N/A'}
            </span>
          )}
        </div>
        {estimatedCost !== '0' && (
          <span className="text-xs text-gray-600">
            Est. cost: {parseFloat(estimatedCost).toFixed(6)} CELO
          </span>
        )}
      </div>
    </motion.div>
  );
}
