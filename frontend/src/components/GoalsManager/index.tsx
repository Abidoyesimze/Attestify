'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Target, Plus, TrendingUp, Calendar, CheckCircle2, X, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { ProgressBar } from '@/components/ProgressBar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SavingsGoal {
  id: number;
  title: string;
  description: string;
  category: string;
  target_amount: string;
  current_amount: string;
  target_date: string | null;
  strategy: string;
  status: string;
  progress_percentage: number;
  days_remaining: number | null;
  is_on_track: boolean;
  color: string;
  icon: string;
  created_at: string;
}

interface GoalFormData {
  title: string;
  description: string;
  category: string;
  target_amount: string;
  target_date: string;
  strategy: string;
  is_public: boolean;
  color: string;
  icon: string;
}

const CATEGORIES = [
  { value: 'emergency', label: 'Emergency Fund' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'education', label: 'Education' },
  { value: 'house', label: 'House/Property' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'other', label: 'Other' },
];

const STRATEGIES = [
  { value: 'conservative', label: 'Conservative (3-5% APY)' },
  { value: 'balanced', label: 'Balanced (5-10% APY)' },
  { value: 'growth', label: 'Growth (10-15% APY)' },
];

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export default function GoalsManager() {
  const { address } = useAccount();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    category: 'other',
    target_amount: '',
    target_date: '',
    strategy: 'balanced',
    is_public: false,
    color: '#3B82F6',
    icon: 'target',
  });

  useEffect(() => {
    if (address) {
      fetchGoals();
    }
  }, [address]);

  const fetchGoals = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/attestify/goals/`, {
        headers: {
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/goals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': address,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        await fetchGoals();
        setShowCreateModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateGoal = async () => {
    if (!address || !editingGoal) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/goals/${editingGoal.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': address,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        await fetchGoals();
        setEditingGoal(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!address) return;
    
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/goals/${goalId}/`, {
        method: 'DELETE',
        headers: {
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        await fetchGoals();
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'other',
      target_amount: '',
      target_date: '',
      strategy: 'balanced',
      is_public: false,
      color: '#3B82F6',
      icon: 'target',
    });
  };

  const openEditModal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      target_amount: goal.target_amount,
      target_date: goal.target_date || '',
      strategy: goal.strategy,
      is_public: goal.is_public || false,
      color: goal.color,
      icon: goal.icon,
    });
    setShowCreateModal(true);
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
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
          <h2 className="text-2xl font-bold text-gray-900">Savings Goals</h2>
          <p className="text-gray-600 mt-1">Set and track your financial goals</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingGoal(null); setShowCreateModal(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-6">Create your first savings goal to get started!</p>
          <Button onClick={() => { resetForm(); setEditingGoal(null); setShowCreateModal(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
                  >
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{goal.category.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(goal)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {goal.progress_percentage.toFixed(1)}%
                  </span>
                </div>
                <ProgressBar 
                  value={goal.progress_percentage} 
                  className="h-2"
                  style={{ backgroundColor: goal.color }}
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-600">{formatCurrency(goal.current_amount)}</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(goal.target_amount)}</span>
                </div>
              </div>

              {goal.target_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{goal.days_remaining !== null ? `${goal.days_remaining} days remaining` : 'No deadline'}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                  goal.status === 'active' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {goal.status}
                </span>
                <span className="text-xs text-gray-500 capitalize">{goal.strategy}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setEditingGoal(null); resetForm(); }}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
      >
        <div className="space-y-4">
          <Input
            label="Goal Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Emergency Fund"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What are you saving for?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={CATEGORIES}
            />

            <Select
              label="Strategy"
              value={formData.strategy}
              onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
              options={STRATEGIES}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Amount (cUSD)"
              type="number"
              value={formData.target_amount}
              onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              placeholder="1000"
            />

            <Input
              label="Target Date"
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Make this goal public</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={editingGoal ? handleUpdateGoal : handleCreateGoal}
              className="flex-1"
            >
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowCreateModal(false); setEditingGoal(null); resetForm(); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

