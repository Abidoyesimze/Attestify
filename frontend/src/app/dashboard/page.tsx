'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Bell,
  ArrowLeft,
  BarChart3,
  PieChart,
  Home,
  Bot,
  Target
} from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/Navbar';
import Link from 'next/link';




export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'chat' | 'strategy' | 'analytics'>('overview');

  // Mock data for now (remove when contracts are integrated)
  const balance = parseEther('1000'); // Mock 1000 cUSD balance
  const earnings = parseEther('25.50'); // Mock 25.50 cUSD earnings
  const isVerified = true; // Mock verified status
  const currentAPY = 350; // Mock 3.50% APY (350 basis points)

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

  const balanceDisplay = formatEther(balance);
  const earningsDisplay = formatEther(earnings);
  const apyDisplay = (currentAPY / 100).toFixed(2);

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

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Verify Your Identity</h2>
          <p className="text-gray-600 mb-6">
            You need to verify your identity with Self Protocol before you can start earning.
          </p>
          <button className="w-full px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all">
            Start Verification
          </button>
        </div>
      </div>
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
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Deposit</h4>
                    <p className="text-sm text-gray-600 mb-4">Add funds to start earning</p>
                    <input
                      type="number"
                      placeholder="Amount in cUSD"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all">
                      Deposit
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                      <ArrowDownLeft className="h-5 w-5 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Withdraw</h4>
                    <p className="text-sm text-gray-600 mb-4">Take out your earnings</p>
                    <input
                      type="number"
                      placeholder="Amount in cUSD"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all">
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'chat' && (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Financial Advisor</h3>
                    <p className="text-sm text-gray-600">Your personalized investment assistant</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50">
                {/* AI Welcome Message */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-md p-6 shadow-sm max-w-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-gray-900">Attestify AI</span>
                      <span className="text-xs text-gray-500">• Just now</span>
                    </div>
                    <p className="text-gray-800 mb-4">
                      Welcome back! I'm here to help you optimize your DeFi investments. Based on your current portfolio, I can provide personalized insights and recommendations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-sm font-medium text-green-800">Current Performance</p>
                        <p className="text-xs text-green-600">+2.55% lifetime return</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-sm font-medium text-blue-800">Daily Earnings</p>
                        <p className="text-xs text-blue-600">~$0.10/day</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="ml-14 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Quick Actions:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-green-300 transition-all text-left text-gray-900">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>Portfolio Analysis</span>
                      </div>
                    </button>
                    <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-blue-300 transition-all text-left text-gray-900">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span>Strategy Optimization</span>
                      </div>
                    </button>
                    <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-purple-300 transition-all text-left text-gray-900">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                        <span>Yield Opportunities</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Ask about your investments, strategies, or market insights..."
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg">
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  AI responses are for informational purposes only. Always do your own research.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'strategy' && (
            <div className="flex-1 p-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Strategy</h3>
                <p className="text-gray-600">Strategy management coming soon...</p>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="flex-1 p-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics</h3>
                <p className="text-gray-600">Advanced analytics coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}