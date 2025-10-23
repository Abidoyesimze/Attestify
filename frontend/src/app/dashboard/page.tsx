'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Bell,
  ArrowLeft,
  BarChart3,
  PieChart,
  Home,
  Bot,
  Target,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CONTRACT_CONFIG, CUSD_CONFIG, CONTRACT_ADDRESSES } from '@/abis';
import VerificationModal from '@/components/VerificationModal';
import AIChat from '@/components/AIChat';




export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'chat' | 'strategy' | 'analytics'>('overview');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [depositStep, setDepositStep] = useState<'input' | 'approving' | 'depositing' | 'success' | 'error'>('input');
  const [withdrawStep, setWithdrawStep] = useState<'input' | 'withdrawing' | 'success' | 'error'>('input');
  const [strategyStep, setStrategyStep] = useState<'input' | 'changing' | 'success' | 'error'>('input');
  const [txError, setTxError] = useState('');

  // Check verification status
  const { data: isVerified, refetch: refetchVerification } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'isVerified',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Reset verification complete state when contract confirms verification
  useEffect(() => {
    if (isVerified) {
      setIsVerificationComplete(false);
    }
  }, [isVerified]);

  // Real contract data
  const { data: balance } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!isVerified,
      refetchInterval: 10000,
    },
  });

  const { data: earnings } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getEarnings',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!isVerified,
      refetchInterval: 10000,
    },
  });

  const { data: currentAPY } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getCurrentAPY',
    query: {
      enabled: !!address && !!isVerified,
    },
  });

  // Check if contract is paused
  const { data: isPaused } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'paused',
    query: {
      enabled: !!address,
    },
  });

  // Get deposit limits
  const { data: minDeposit } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'MIN_DEPOSIT',
  });

  const { data: maxDeposit } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'MAX_DEPOSIT',
  });

  // Get cUSD balance
  const { data: cUsdBalance, refetch: refetchCusdBalance } = useReadContract({
    ...CUSD_CONFIG,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  });

  // Get cUSD allowance for vault
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...CUSD_CONFIG,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.ATTESTIFY_VAULT] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get user's current strategy
  const { data: userStrategy, refetch: refetchStrategy } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'userStrategy',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!isVerified,
    },
  });

  // Get user's shares
  const { data: userShares } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'shares',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!isVerified,
      refetchInterval: 10000,
    },
  });

  // Get user profile data
  const { data: userProfile } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'users',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!isVerified,
      refetchInterval: 10000,
    },
  });

  // Get global vault statistics
  const { data: vaultStats } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getVaultStats',
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    },
  });

  // Get strategy details for all 3 strategies
  const { data: conservativeStrategy } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'strategies',
    args: [0],
  });

  const { data: balancedStrategy } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'strategies',
    args: [1],
  });

  const { data: growthStrategy } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'strategies',
    args: [2],
  });

  const { writeContract: writeApproval, data: approvalHash, error: approvalError } = useWriteContract();
  const { writeContract: writeDeposit, data: depositHash, error: depositError } = useWriteContract();
  const { writeContract: writeWithdraw, data: withdrawHash, error: withdrawError } = useWriteContract();
  const { writeContract: writeStrategyChange, data: strategyHash, error: strategyError } = useWriteContract();

  // Wait for approval transaction
  const { isSuccess: isApprovalSuccess } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  // Wait for deposit transaction
  const { isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  // Wait for withdraw transaction
  const { isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  // Wait for strategy change transaction
  const { isSuccess: isStrategySuccess } = useWaitForTransactionReceipt({
    hash: strategyHash,
  });

  // Mock chart data (replace with real historical data)
  const chartData = [
    { date: 'Mon', value: 1000 },
    { date: 'Tue', value: 1002.5 },
    { date: 'Wed', value: 1005.2 },
    { date: 'Thu', value: 1007.8 },
    { date: 'Fri', value: 1010.5 },
    { date: 'Sat', value: 1013.1 },
    { date: 'Sun', value: 1015.9 },
  ];

  const balanceDisplay = balance ? formatEther(balance as bigint) : '0.00';
  const earningsDisplay = earnings ? formatEther(earnings as bigint) : '0.00';
  const apyDisplay = currentAPY ? (Number(currentAPY) / 100).toFixed(2) : '0.00';

  // Handle approval success
  useEffect(() => {
    if (isApprovalSuccess) {
      console.log('✅ Approval successful, proceeding to deposit...');
      setDepositStep('depositing');
      handleDepositAfterApproval();
    }
  }, [isApprovalSuccess]);

  // Handle deposit success
  useEffect(() => {
    if (isDepositSuccess) {
      console.log('✅ Deposit successful!');
      setDepositStep('success');
      setDepositAmount('');
      refetchVerification();
      refetchCusdBalance();
      refetchAllowance();
      setTimeout(() => setDepositStep('input'), 3000);
    }
  }, [isDepositSuccess]);

  // Handle deposit error
  useEffect(() => {
    if (depositError) {
      console.error('❌ Deposit failed:', depositError);
      let errorMessage = 'Transaction failed';
      
      if (depositError.message.includes('InvalidAmount')) {
        errorMessage = 'Amount must be at least 1 cUSD';
      } else if (depositError.message.includes('NotVerified')) {
        errorMessage = 'Please verify your identity first';
      } else if (depositError.message.includes('ExceedsMaxDeposit')) {
        errorMessage = 'Amount exceeds maximum deposit limit';
      } else if (depositError.message.includes('ExceedsMaxTVL')) {
        errorMessage = 'Vault has reached maximum capacity';
      } else if (depositError.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient gas or cUSD balance';
      }
      
      setTxError(errorMessage);
      setDepositStep('error');
      setTimeout(() => setDepositStep('input'), 5000);
    }
  }, [depositError]);

  // Handle withdraw success
  useEffect(() => {
    if (isWithdrawSuccess) {
      console.log('✅ Withdrawal successful!');
      setWithdrawStep('success');
      setWithdrawAmount('');
      refetchVerification();
      refetchCusdBalance();
      setTimeout(() => setWithdrawStep('input'), 3000);
    }
  }, [isWithdrawSuccess]);

  // Handle strategy change success
  useEffect(() => {
    if (isStrategySuccess) {
      console.log('✅ Strategy changed successfully!');
      setStrategyStep('success');
      refetchStrategy();
      setTimeout(() => setStrategyStep('input'), 3000);
    }
  }, [isStrategySuccess]);

  // Handle verification completion
  const handleVerificationComplete = () => {
    console.log('🔄 Refetching verification status...');
    setIsVerificationComplete(true);
    refetchVerification();
    setShowVerificationModal(false);
  };

  // Validate deposit amount
  const validateDepositAmount = (): string | null => {
    if (!depositAmount || depositAmount === '0') return 'Please enter an amount';
    
    try {
      const amount = parseEther(depositAmount);
      
      if (minDeposit && typeof minDeposit === 'bigint' && amount < minDeposit) {
        return `Minimum deposit is ${formatEther(minDeposit)} cUSD`;
      }
      
      if (maxDeposit && typeof maxDeposit === 'bigint' && amount > maxDeposit) {
        return `Maximum deposit is ${formatEther(maxDeposit)} cUSD`;
      }
      
      if (cUsdBalance && typeof cUsdBalance === 'bigint' && amount > cUsdBalance) {
        return `Insufficient cUSD balance. You have ${formatEther(cUsdBalance)} cUSD`;
      }
    } catch {
      return 'Invalid amount';
    }
    
    return null;
  };

  // Validate withdraw amount
  const validateWithdrawAmount = (): string | null => {
    if (!withdrawAmount || withdrawAmount === '0') return 'Please enter an amount';
    
    const amount = parseEther(withdrawAmount);
    
    if (balance && amount > (balance as bigint)) {
      return `Insufficient balance. You have ${formatEther(balance as bigint)} cUSD`;
    }
    
    return null;
  };

  // Handle deposit flow
  const handleDeposit = async () => {
    try {
      const error = validateDepositAmount();
      if (error) {
        setTxError(error);
        setDepositStep('error');
        setTimeout(() => setDepositStep('input'), 3000);
        return;
      }

      const amount = parseEther(depositAmount);
      
      // Check if approval is needed
      if (!allowance || allowance < amount) {
        setDepositStep('approving');
        writeApproval({
          ...CUSD_CONFIG,
          functionName: 'approve',
          args: [CONTRACT_ADDRESSES.ATTESTIFY_VAULT, amount],
        });
      } else {
        // Already approved, deposit directly
        setDepositStep('depositing');
        writeDeposit({
          ...CONTRACT_CONFIG,
          functionName: 'deposit',
          args: [amount],
        });
      }
    } catch (error: unknown) {
      console.error('Deposit error:', error);
      setTxError(error instanceof Error ? error.message : 'Transaction failed');
      setDepositStep('error');
      setTimeout(() => setDepositStep('input'), 3000);
    }
  };

  // Handle deposit after approval
  const handleDepositAfterApproval = () => {
    try {
      const amount = parseEther(depositAmount);
      writeDeposit({
        ...CONTRACT_CONFIG,
        functionName: 'deposit',
        args: [amount],
        gas: BigInt(500000), // Increased gas limit
      });
    } catch (error: unknown) {
      console.error('Deposit error:', error);
      setTxError(error instanceof Error ? error.message : 'Transaction failed');
      setDepositStep('error');
      setTimeout(() => setDepositStep('input'), 3000);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async () => {
    try {
      const error = validateWithdrawAmount();
      if (error) {
        setTxError(error);
        setWithdrawStep('error');
        setTimeout(() => setWithdrawStep('input'), 3000);
        return;
      }

      setWithdrawStep('withdrawing');
      const amount = parseEther(withdrawAmount);
      
      writeWithdraw({
        ...CONTRACT_CONFIG,
        functionName: 'withdraw',
        args: [amount],
      });
    } catch (error: unknown) {
      console.error('Withdraw error:', error);
      setTxError(error instanceof Error ? error.message : 'Transaction failed');
      setWithdrawStep('error');
      setTimeout(() => setWithdrawStep('input'), 3000);
    }
  };

  // Handle strategy change
  const handleStrategyChange = async (newStrategy: number) => {
    try {
      if (userStrategy === newStrategy) {
        setTxError('Already using this strategy');
        setStrategyStep('error');
        setTimeout(() => setStrategyStep('input'), 3000);
        return;
      }

      setStrategyStep('changing');
      writeStrategyChange({
        ...CONTRACT_CONFIG,
        functionName: 'changeStrategy',
        args: [newStrategy],
      });
    } catch (error: unknown) {
      console.error('Strategy change error:', error);
      setTxError(error instanceof Error ? error.message : 'Transaction failed');
      setStrategyStep('error');
      setTimeout(() => setStrategyStep('input'), 3000);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access the dashboard</p>
        </div>
      </div>
    );
  }

  // Show verification screen if not verified and verification not just completed
  if (!isVerified && !isVerificationComplete) {
    return (
      <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Verify Your Identity</h2>
          <p className="text-gray-600 mb-6">
            You need to verify your identity with Self Protocol before you can start earning.
          </p>
            <button 
              onClick={() => setShowVerificationModal(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
            >
            Start Verification
          </button>
        </div>
      </div>

        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          onVerified={handleVerificationComplete}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-600">Manage your investments</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeSection === 'overview'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5" />
              Overview
            </button>
            
            <button
              onClick={() => setActiveSection('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeSection === 'chat'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bot className="h-5 w-5" />
              AI Assistant
            </button>
            
            <button
              onClick={() => setActiveSection('strategy')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeSection === 'strategy'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Target className="h-5 w-5" />
              Strategy
            </button>
            
            <button
              onClick={() => setActiveSection('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeSection === 'analytics'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Analytics
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeSection === 'overview' && (
            <>
        {/* Stats Cards */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
                  <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">Total Balance</p>
                <h3 className="text-3xl font-bold">${parseFloat(balanceDisplay).toFixed(2)}</h3>
              </div>
              <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>+{parseFloat(earningsDisplay).toFixed(2)} cUSD earned</span>
            </div>
          </div>

          {/* Current APY */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Current APY</p>
                <h3 className="text-3xl font-bold text-gray-900">{apyDisplay}%</h3>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Earning ~${(parseFloat(balanceDisplay) * parseFloat(apyDisplay) / 100 / 365).toFixed(2)}/day
            </p>
          </div>

          {/* Total Earnings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
                <h3 className="text-3xl font-bold text-gray-900">${parseFloat(earningsDisplay).toFixed(2)}</h3>
              </div>
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-green-600">
              +{((parseFloat(earningsDisplay) / parseFloat(balanceDisplay)) * 100).toFixed(2)}% lifetime return
            </p>
          </div>
        </div>
            </div>

              {/* Chart and Actions */}
              <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Balance Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Balance History</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#35D07F" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  {/* Deposit Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Deposit</h4>
                    <p className="text-sm text-gray-600 mb-4">Add funds to start earning</p>
                    
                    {/* Wallet Balance */}
                    <div className="mb-3 flex justify-between text-xs text-gray-600">
                      <span>Wallet Balance:</span>
                      <span className="font-medium">{cUsdBalance ? formatEther(cUsdBalance) : '0.00'} cUSD</span>
                    </div>

                    <input
                      type="number"
                      placeholder="Amount in cUSD"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      disabled={depositStep !== 'input'}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
                    />
                    
                    {/* Min/Max info */}
                    <div className="mb-3 text-xs text-gray-500">
                      Min: {minDeposit && typeof minDeposit === 'bigint' ? formatEther(minDeposit) : '10'} cUSD | Max: {maxDeposit && typeof maxDeposit === 'bigint' ? formatEther(maxDeposit) : '10,000'} cUSD
                    </div>

                    {depositStep === 'input' && (
                      <>
                        {!!isPaused && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 font-medium">⚠️ Contract is paused</p>
                            <p className="text-xs text-red-700">Deposits are temporarily disabled</p>
                          </div>
                        )}
                        <button 
                          onClick={handleDeposit}
                          disabled={!depositAmount || depositAmount === '0' || !!isPaused}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {isPaused ? 'Deposits Paused' : '💰 Deposit cUSD'}
                        </button>
                      </>
                    )}

                    {depositStep === 'approving' && (
                      <button disabled className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Approving cUSD...
                      </button>
                    )}

                    {depositStep === 'depositing' && (
                      <button disabled className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Depositing...
                      </button>
                    )}

                    {depositStep === 'success' && (
                      <button disabled className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Deposit Successful!
                      </button>
                    )}

                    {depositStep === 'error' && (
                      <button disabled className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {txError || 'Transaction Failed'}
                      </button>
                    )}
                  </div>

                  {/* Withdraw Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                      <ArrowDownLeft className="h-5 w-5 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Withdraw</h4>
                    <p className="text-sm text-gray-600 mb-4">Take out your earnings</p>
                    
                    {/* Vault Balance */}
                    <div className="mb-3 flex justify-between text-xs text-gray-600">
                      <span>Vault Balance:</span>
                      <span className="font-medium">{balanceDisplay} cUSD</span>
                    </div>

                    <input
                      type="number"
                      placeholder="Amount in cUSD"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      disabled={withdrawStep !== 'input'}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
                    />

                    {withdrawStep === 'input' && (
                      <button 
                        onClick={handleWithdraw}
                        disabled={!withdrawAmount || withdrawAmount === '0'}
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Withdraw
                      </button>
                    )}

                    {withdrawStep === 'withdrawing' && (
                      <button disabled className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Withdrawing...
                      </button>
                    )}

                    {withdrawStep === 'success' && (
                      <button disabled className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Withdrawal Successful!
                      </button>
                    )}

                    {withdrawStep === 'error' && (
                      <button disabled className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {txError || 'Transaction Failed'}
                      </button>
                    )}
                  </div>
                  </div>
                </div>

                {/* Ethers.js Direct Test Component */}
                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-800">🧪 Ethers.js Direct Test</h3>
                  <p className="text-sm text-yellow-700 mb-4">
                    Test deposit functionality using ethers.js directly to bypass Wagmi gas estimation issues.
                  </p>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-4">
                      This test component will help us identify if the deposit issue is with Wagmi gas estimation or the contract itself.
                    </p>
                    <button 
                      onClick={() => {
                        console.log('🧪 Ethers test button clicked!');
                        alert('Ethers test component is working! Check console for logs.');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Test Ethers Integration
                    </button>
                  </div>
                </div>
              </>
          )}

          {activeSection === 'chat' && (
            <AIChat
              vaultBalance={balanceDisplay}
              currentAPY={apyDisplay}
              currentStrategy={userStrategy === 0 ? 'Conservative' : userStrategy === 1 ? 'Balanced' : 'Growth'}
              earnings={earningsDisplay}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onStrategyChange={handleStrategyChange}
            />
          )}


          {activeSection === 'strategy' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Strategy</h3>
                <p className="text-gray-600 mb-6">Choose how your funds are allocated to optimize returns</p>

                {/* Current Strategy Badge */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">
                      Current Strategy: {userStrategy === 0 ? 'Conservative' : userStrategy === 1 ? 'Balanced' : 'Growth'}
                    </span>
                  </div>
                </div>

                {/* Strategy Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Conservative Strategy */}
                  <div className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${
                    userStrategy === 0 ? 'border-green-600' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      {userStrategy === 0 && (
                        <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                          Active
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Conservative</h4>
                    <p className="text-sm text-gray-600 mb-4">Lowest risk, stable returns</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Moola Allocation</span>
                        <span className="font-semibold text-gray-900">
                          {conservativeStrategy && Array.isArray(conservativeStrategy) ? `${conservativeStrategy[1]}%` : '100%'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reserve</span>
                        <span className="font-semibold text-gray-900">
                          {conservativeStrategy && Array.isArray(conservativeStrategy) ? `${conservativeStrategy[2]}%` : '0%'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Risk Level</span>
                        <span className="font-semibold text-gray-900">Low</span>
                      </div>
                    </div>

                    {userStrategy !== 0 && strategyStep === 'input' && (
                      <button
                        onClick={() => handleStrategyChange(0)}
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
                      >
                        Select Strategy
                      </button>
                    )}
                  </div>

                  {/* Balanced Strategy */}
                  <div className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${
                    userStrategy === 1 ? 'border-green-600' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <PieChart className="h-6 w-6 text-purple-600" />
                      </div>
                      {userStrategy === 1 && (
                        <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                          Active
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Balanced</h4>
                    <p className="text-sm text-gray-600 mb-4">Moderate risk, balanced returns</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Moola Allocation</span>
                        <span className="font-semibold text-gray-900">
                          {balancedStrategy && Array.isArray(balancedStrategy) ? `${balancedStrategy[1]}%` : '90%'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reserve</span>
                        <span className="font-semibold text-gray-900">
                          {balancedStrategy && Array.isArray(balancedStrategy) ? `${balancedStrategy[2]}%` : '10%'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Risk Level</span>
                        <span className="font-semibold text-gray-900">Medium</span>
                      </div>
                    </div>

                    {userStrategy !== 1 && strategyStep === 'input' && (
                      <button
                        onClick={() => handleStrategyChange(1)}
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
                      >
                        Select Strategy
                      </button>
                    )}
                  </div>

                  {/* Growth Strategy */}
                  <div className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${
                    userStrategy === 2 ? 'border-green-600' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                      </div>
                      {userStrategy === 2 && (
                        <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                          Active
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Growth</h4>
                    <p className="text-sm text-gray-600 mb-4">Higher risk, potential for growth</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Moola Allocation</span>
                        <span className="font-semibold text-gray-900">
                          {growthStrategy && Array.isArray(growthStrategy) ? `${growthStrategy[1]}%` : '80%'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reserve</span>
                        <span className="font-semibold text-gray-900">
                          {growthStrategy && Array.isArray(growthStrategy) ? `${growthStrategy[2]}%` : '20%'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Risk Level</span>
                        <span className="font-semibold text-gray-900">High</span>
                      </div>
                    </div>

                    {userStrategy !== 2 && strategyStep === 'input' && (
                      <button
                        onClick={() => handleStrategyChange(2)}
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
                      >
                        Select Strategy
                      </button>
                    )}
                  </div>
                </div>

                {/* Transaction Status */}
                {strategyStep === 'changing' && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    <span className="text-blue-900 font-medium">Changing strategy...</span>
                  </div>
                )}

                {strategyStep === 'success' && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-900 font-medium">Strategy changed successfully!</span>
                  </div>
                )}

                {strategyStep === 'error' && (
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-900 font-medium">{txError || 'Transaction failed'}</span>
                  </div>
                )}

                {/* Strategy Information */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">About Strategies</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>All strategies use Moola Market for yield generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>You can change your strategy at any time without fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>Reserve allocation keeps funds liquid for instant withdrawals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>Target APY is approximately 3.5% for all strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-6xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Statistics</h3>

                {/* Global Vault Statistics */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Vault Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Value Locked (TVL) */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5" />
                        <p className="text-blue-100 text-sm">Total Value Locked</p>
                      </div>
                      <h3 className="text-3xl font-bold">
                        ${vaultStats && Array.isArray(vaultStats) && vaultStats[0] 
                          ? parseFloat(formatEther(vaultStats[0] as bigint)).toFixed(2)
                          : '0.00'}
                      </h3>
                      <p className="text-blue-100 text-sm mt-2">
                        {vaultStats && Array.isArray(vaultStats) && vaultStats[1]
                          ? `${formatEther(vaultStats[1] as bigint)} total shares`
                          : '0 total shares'}
                      </p>
                    </div>

                    {/* Aave Deployed */}
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <p className="text-gray-600 text-sm">Deployed to Aave</p>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">
                        ${vaultStats && Array.isArray(vaultStats) && vaultStats[3]
                          ? parseFloat(formatEther(vaultStats[3] as bigint)).toFixed(2)
                          : '0.00'}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2">
                        {vaultStats && Array.isArray(vaultStats) && vaultStats[0] && vaultStats[3]
                          ? `${((Number(vaultStats[3]) / Number(vaultStats[0])) * 100).toFixed(1)}% of TVL`
                          : '0% of TVL'}
                      </p>
                    </div>

                    {/* Reserve Balance */}
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <p className="text-gray-600 text-sm">Reserve Balance</p>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">
                        ${vaultStats && Array.isArray(vaultStats) && vaultStats[2]
                          ? parseFloat(formatEther(vaultStats[2] as bigint)).toFixed(2)
                          : '0.00'}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2">
                        {vaultStats && Array.isArray(vaultStats) && vaultStats[0] && vaultStats[2]
                          ? `${((Number(vaultStats[2]) / Number(vaultStats[0])) * 100).toFixed(1)}% liquid`
                          : '0% liquid'}
                      </p>
                    </div>
                  </div>

                  {/* Historical Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                        <p className="text-gray-600 text-sm">Total Deposited (All Time)</p>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        ${vaultStats && Array.isArray(vaultStats) && vaultStats[4]
                          ? parseFloat(formatEther(vaultStats[4] as bigint)).toFixed(2)
                          : '0.00'}
                      </h3>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowDownLeft className="h-5 w-5 text-red-600" />
                        <p className="text-gray-600 text-sm">Total Withdrawn (All Time)</p>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        ${vaultStats && Array.isArray(vaultStats) && vaultStats[5]
                          ? parseFloat(formatEther(vaultStats[5] as bigint)).toFixed(2)
                          : '0.00'}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* User Profile & Stats */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h4>
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Verification Status */}
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Verification Status</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-gray-900">Verified</span>
                        </div>
                        {userProfile && Array.isArray(userProfile) && userProfile[1] && (
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(Number(userProfile[1]) * 1000).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Total Shares */}
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Your Shares</p>
                        <p className="text-xl font-bold text-gray-900">
                          {userShares ? parseFloat(formatEther(userShares as bigint)).toFixed(4) : '0.0000'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {vaultStats && Array.isArray(vaultStats) && vaultStats[1] && userShares
                            ? `${((Number(userShares) / Number(vaultStats[1])) * 100).toFixed(2)}% of pool`
                            : '0% of pool'}
                        </p>
                      </div>

                      {/* Total Deposited */}
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Total Deposited</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${userProfile && Array.isArray(userProfile) && userProfile[2]
                            ? parseFloat(formatEther(userProfile[2] as bigint)).toFixed(2)
                            : '0.00'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Lifetime deposits</p>
                      </div>

                      {/* Total Withdrawn */}
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Total Withdrawn</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${userProfile && Array.isArray(userProfile) && userProfile[3]
                            ? parseFloat(formatEther(userProfile[3] as bigint)).toFixed(2)
                            : '0.00'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Lifetime withdrawals</p>
                      </div>
                    </div>

                    {/* Last Activity */}
                    {userProfile && Array.isArray(userProfile) && userProfile[4] && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Last activity: {new Date(Number(userProfile[4]) * 1000).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ROI */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <p className="text-gray-600 text-sm mb-2">Return on Investment (ROI)</p>
                      <h3 className="text-3xl font-bold text-green-600">
                        {userProfile && Array.isArray(userProfile) && userProfile[2] && balance
                          ? `+${((parseFloat(formatEther(balance as bigint)) / parseFloat(formatEther(userProfile[2] as bigint)) - 1) * 100).toFixed(2)}%`
                          : '0.00%'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">Since first deposit</p>
                    </div>

                    {/* Daily Earnings */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <p className="text-gray-600 text-sm mb-2">Estimated Daily Earnings</p>
                      <h3 className="text-3xl font-bold text-gray-900">
                        ${(parseFloat(balanceDisplay) * parseFloat(apyDisplay) / 100 / 365).toFixed(4)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">Based on current APY</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerified={handleVerificationComplete}
      />
    </div>
  );
}