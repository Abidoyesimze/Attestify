'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Users, Copy, Check, Gift, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks/useToast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Referral {
  id: number;
  referral_code: string;
  status: string;
  first_deposit_amount: string | null;
  referrer_reward_amount: string;
  referee_reward_amount: string;
  created_at: string;
  activated_at: string | null;
}

interface ReferralStats {
  total_referrals: number;
  active_referrals: number;
  rewarded_referrals: number;
  total_rewards_earned: string;
  pending_rewards: string;
}

export default function ReferralDashboard() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [showUseCodeModal, setShowUseCodeModal] = useState(false);
  const [inputCode, setInputCode] = useState('');

  useEffect(() => {
    if (address) {
      fetchReferrals();
      fetchStats();
      getOrCreateReferralCode();
    }
  }, [address]);

  const getOrCreateReferralCode = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/referrals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setReferralCode(data.referral_code);
      }
    } catch (error) {
      console.error('Error getting referral code:', error);
    }
  };

  const fetchReferrals = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/referrals/`, {
        headers: {
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setReferrals(data);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/referrals/stats/`, {
        headers: {
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const copyReferralCode = () => {
    if (!referralCode) return;
    
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      message: 'Referral link copied to clipboard!',
      type: 'success',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const useReferralCode = async () => {
    if (!address || !inputCode.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/referrals/use/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': address,
        },
        body: JSON.stringify({ referral_code: inputCode.trim() }),
      });
      
      if (response.ok) {
        toast({
          message: 'Referral code applied successfully!',
          type: 'success',
        });
        setShowUseCodeModal(false);
        setInputCode('');
      } else {
        const error = await response.json();
        toast({
          message: error.error || 'Failed to use referral code',
          type: 'error',
        });
      }
    } catch (error) {
      toast({
        message: 'Error using referral code',
        type: 'error',
      });
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Referral Program</h2>
          <p className="text-gray-600 mt-1">Earn rewards by referring friends</p>
        </div>
        <Button onClick={() => setShowUseCodeModal(true)} variant="outline">
          Use Referral Code
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Referrals</span>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total_referrals}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active</span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.active_referrals}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Earned</span>
              <Gift className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.total_rewards_earned)}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pending</span>
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.pending_rewards)}
            </div>
          </Card>
        </div>
      )}

      {/* Referral Code Card */}
      {referralCode && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Referral Code</h3>
              <div className="flex items-center gap-3">
                <code className="px-4 py-2 bg-white rounded-lg text-lg font-mono font-bold text-gray-900 border-2 border-blue-300">
                  {referralCode}
                </code>
                <Button
                  onClick={copyReferralCode}
                  variant="outline"
                  size="sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Share this code with friends. When they sign up and make their first deposit, you both earn rewards!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Referrals List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referrals</h3>
        {referrals.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No referrals yet</h3>
            <p className="text-gray-600 mb-6">Share your referral code to start earning rewards!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral) => (
              <Card key={referral.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono text-gray-900">{referral.referral_code}</code>
                      <Badge
                        variant={
                          referral.status === 'rewarded' ? 'default' :
                          referral.status === 'active' ? 'secondary' : 'outline'
                        }
                      >
                        {referral.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {referral.activated_at ? (
                        <>Activated {new Date(referral.activated_at).toLocaleDateString()}</>
                      ) : (
                        <>Created {new Date(referral.created_at).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {referral.first_deposit_amount && (
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(referral.first_deposit_amount)}
                      </div>
                    )}
                    {referral.referrer_reward_amount && parseFloat(referral.referrer_reward_amount) > 0 && (
                      <div className="text-xs text-green-600">
                        +{formatCurrency(referral.referrer_reward_amount)} reward
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Use Referral Code Modal */}
      {showUseCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Use Referral Code</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Referral Code
                </label>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={useReferralCode} className="flex-1">
                  Apply Code
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setShowUseCodeModal(false); setInputCode(''); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

