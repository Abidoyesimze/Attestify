'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react';
import { formatEther } from 'viem';

export interface TransactionStatusProps {
  hash?: string;
  status: 'pending' | 'success' | 'error' | 'confirming';
  type: 'deposit' | 'withdraw' | 'approve' | 'strategy';
  amount?: bigint;
  error?: string;
  onClose?: () => void;
  explorerUrl?: string;
}

export default function TransactionStatus({
  hash,
  status,
  type,
  amount,
  error,
  onClose,
  explorerUrl
}: TransactionStatusProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Transaction Pending',
          message: 'Waiting for confirmation...'
        };
      case 'confirming':
        return {
          icon: Loader2,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Confirming Transaction',
          message: 'Transaction is being confirmed on the blockchain'
        };
      case 'success':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Transaction Successful',
          message: 'Your transaction has been confirmed'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Transaction Failed',
          message: error || 'An error occurred'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Unknown Status',
          message: 'Transaction status is unknown'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const isSpinning = status === 'confirming' || status === 'pending';

  const getTypeLabel = () => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdraw': return 'Withdrawal';
      case 'approve': return 'Approval';
      case 'strategy': return 'Strategy Change';
      default: return 'Transaction';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 w-full max-w-md ${config.bgColor} ${config.borderColor} border-2 rounded-lg shadow-lg p-4`}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${config.color}`}>
            <Icon 
              className={`h-6 w-6 ${isSpinning ? 'animate-spin' : ''}`}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-semibold ${config.color}`}>
                {config.title}
              </h3>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {getTypeLabel()}: {amount ? `${formatEther(amount)} cUSD` : 'Processing...'}
            </p>
            
            <p className="text-sm text-gray-700 mb-3">
              {config.message}
            </p>

            {hash && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-gray-700 truncate">
                      {hash.slice(0, 10)}...{hash.slice(-8)}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copy hash"
                    >
                      <Copy className={`h-4 w-4 ${copied ? 'text-green-600' : 'text-gray-500'}`} />
                    </button>
                  </div>
                </div>
                
                {explorerUrl && (
                  <a
                    href={`${explorerUrl}/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="View on explorer"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
