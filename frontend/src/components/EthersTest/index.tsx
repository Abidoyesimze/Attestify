'use client';

import { useState } from 'react';
import { ethersIntegration } from '@/utils/ethersDirect';

export default function EthersTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const address = await ethersIntegration.connectWallet();
      setIsConnected(true);
      
      // Get account info
      const info = await ethersIntegration.getAccountInfo();
      setAccountInfo(info);
      setResult(`✅ Connected: ${address}`);
    } catch (error: any) {
      setResult(`❌ Connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyUser = async () => {
    try {
      setIsLoading(true);
      await ethersIntegration.verifyUser();
      setResult('✅ User verified successfully!');
      
      // Refresh account info
      const info = await ethersIntegration.getAccountInfo();
      setAccountInfo(info);
    } catch (error: any) {
      setResult(`❌ Verification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deposit = async () => {
    try {
      setIsLoading(true);
      const result = await ethersIntegration.deposit(depositAmount);
      
      if (result.success) {
        setResult(`✅ Deposit successful! TX: ${result.txHash}`);
        
        // Refresh account info
        const info = await ethersIntegration.getAccountInfo();
        setAccountInfo(info);
      } else {
        setResult(`❌ Deposit failed: ${result.error}`);
      }
    } catch (error: any) {
      setResult(`❌ Deposit error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Ethers.js Direct Test</h2>
      
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Account Info:</h3>
            {accountInfo && (
              <div className="text-sm space-y-1">
                <p>Address: {accountInfo.address.slice(0, 10)}...</p>
                <p>ETH Balance: {accountInfo.ethBalance} ETH</p>
                <p>cUSD Balance: {accountInfo.cusdBalance} cUSD</p>
                <p>Verified: {accountInfo.isVerified ? '✅' : '❌'}</p>
                <p>Min Deposit: {accountInfo.minDeposit} cUSD</p>
                <p>Contract Paused: {accountInfo.isPaused ? '⚠️' : '✅'}</p>
              </div>
            )}
          </div>

          {!accountInfo?.isVerified && (
            <button
              onClick={verifyUser}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Verifying...' : 'Verify User'}
            </button>
          )}

          {accountInfo?.isVerified && (
            <div className="space-y-2">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount in cUSD"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                step="0.1"
                min="1"
              />
              <button
                onClick={deposit}
                disabled={isLoading || !depositAmount}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Depositing...' : `Deposit ${depositAmount} cUSD`}
              </button>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
