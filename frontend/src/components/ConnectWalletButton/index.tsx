'use client';

import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { Wallet, ChevronDown, Copy, Check } from 'lucide-react';
import { formatAddress } from '@/utils/format';

export default function ConnectWalletButton() {
  const { open } = useAppKit();
  const appKitAccount = useAppKitAccount();
  const wagmiAccount = useAccount();
  
  // Use AppKit account first, fallback to Wagmi account for better reactivity
  const address = appKitAccount.address || wagmiAccount.address;
  const isConnected = appKitAccount.isConnected || wagmiAccount.isConnected;
  
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Debug: Log connection state changes (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Wallet connection state:', { 
        address, 
        isConnected, 
        appKitAddress: appKitAccount.address,
        appKitConnected: appKitAccount.isConnected,
        wagmiAddress: wagmiAccount.address,
        wagmiConnected: wagmiAccount.isConnected
      });
    }
  }, [address, isConnected, appKitAccount.address, appKitAccount.isConnected, wagmiAccount.address, wagmiAccount.isConnected]);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">{formatAddress(address)}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Connected Wallet</div>
                <div className="text-sm font-medium text-gray-900">{formatAddress(address)}</div>
              </div>
              
              <button
                onClick={handleCopyAddress}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  open({ view: 'Account' });
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                <Wallet className="h-4 w-4" />
                <span>View Account</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => open({ view: 'Connect' })}
      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    >
      <Wallet className="h-4 w-4" />
      <span>Connect Wallet</span>
    </button>
  );
}
