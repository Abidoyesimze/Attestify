'use client';

import { useState, useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import TransactionStatus from '@/components/TransactionStatus';
import { TransactionStatusProps } from '@/components/TransactionStatus';

interface TransactionTrackerProps {
  hash: `0x${string}` | undefined;
  type: TransactionStatusProps['type'];
  amount?: bigint;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  explorerUrl?: string;
}

export default function TransactionTracker({
  hash,
  type,
  amount,
  onSuccess,
  onError,
  explorerUrl = 'https://alfajores.celoscan.io'
}: TransactionTrackerProps) {
  const [status, setStatus] = useState<TransactionStatusProps['status']>('pending');
  const [error, setError] = useState<string>();

  const { data: receipt, isError, error: txError } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  useEffect(() => {
    if (!hash) {
      setStatus('pending');
      return;
    }

    if (isError) {
      setStatus('error');
      const errorMessage = txError?.message || 'Transaction failed';
      setError(errorMessage);
      onError?.(new Error(errorMessage));
      return;
    }

    if (receipt) {
      if (receipt.status === 'success') {
        setStatus('success');
        onSuccess?.();
      } else {
        setStatus('error');
        setError('Transaction reverted');
        onError?.(new Error('Transaction reverted'));
      }
    } else {
      setStatus('confirming');
    }
  }, [hash, receipt, isError, txError, onSuccess, onError]);

  if (!hash) return null;

  return (
    <TransactionStatus
      hash={hash}
      status={status}
      type={type}
      amount={amount}
      error={error}
      explorerUrl={explorerUrl}
    />
  );
}
