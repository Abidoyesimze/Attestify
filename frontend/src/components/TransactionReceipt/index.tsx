'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Download,
  Calendar,
  Hash
} from 'lucide-react';
import { formatEther } from 'viem';
import { useState } from 'react';

interface TransactionReceiptProps {
  hash: string;
  from: string;
  to: string;
  amount: bigint;
  gasUsed?: bigint;
  gasPrice?: bigint;
  timestamp: Date;
  status: 'success' | 'failed';
  explorerUrl?: string;
  onClose?: () => void;
}

export default function TransactionReceipt({
  hash,
  from,
  to,
  amount,
  gasUsed,
  gasPrice,
  timestamp,
  status,
  explorerUrl,
  onClose
}: TransactionReceiptProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadReceipt = () => {
    const receipt = {
      hash,
      from,
      to,
      amount: formatEther(amount),
      gasUsed: gasUsed ? formatEther(gasUsed) : 'N/A',
      gasPrice: gasPrice ? formatEther(gasPrice) : 'N/A',
      timestamp: timestamp.toISOString(),
      status
    };
    
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${hash.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${
            status === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <CheckCircle2 className={`h-6 w-6 ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Transaction Receipt
            </h2>
            <p className={`text-sm ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {status === 'success' ? 'Success' : 'Failed'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
              Transaction Hash
            </label>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-gray-900 flex-1 truncate">
                {hash}
              </code>
              <button
                onClick={() => copyToClipboard(hash, 'hash')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Copy className={`h-4 w-4 ${
                  copied === 'hash' ? 'text-green-600' : 'text-gray-400'
                }`} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
              Amount
            </label>
            <p className="text-sm font-semibold text-gray-900">
              {formatEther(amount)} cUSD
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
              From
            </label>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-gray-900 flex-1 truncate">
                {from}
              </code>
              <button
                onClick={() => copyToClipboard(from, 'from')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Copy className={`h-4 w-4 ${
                  copied === 'from' ? 'text-green-600' : 'text-gray-400'
                }`} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
              To
            </label>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-gray-900 flex-1 truncate">
                {to}
              </code>
              <button
                onClick={() => copyToClipboard(to, 'to')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Copy className={`h-4 w-4 ${
                  copied === 'to' ? 'text-green-600' : 'text-gray-400'
                }`} />
              </button>
            </div>
          </div>

          {gasUsed && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                Gas Used
              </label>
              <p className="text-sm text-gray-900">
                {formatEther(gasUsed)} CELO
              </p>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
              Timestamp
            </label>
            <p className="text-sm text-gray-900">
              {timestamp.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 pt-6 border-t border-gray-200">
        {explorerUrl && (
          <a
            href={`${explorerUrl}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </a>
        )}
        <button
          onClick={downloadReceipt}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Receipt
        </button>
      </div>
    </motion.div>
  );
}
