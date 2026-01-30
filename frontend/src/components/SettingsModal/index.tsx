'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { X, Save, Bell, Globe, Shield, Palette } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import DarkModeToggle from '@/components/DarkModeToggle';

interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    deposits: boolean;
    withdrawals: boolean;
  };
  preferences: {
    currency: string;
    language: string;
    dateFormat: string;
  };
  privacy: {
    showBalance: boolean;
    showTransactions: boolean;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { address } = useAccount();
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      email: true,
      push: true,
      deposits: true,
      withdrawals: true,
    },
    preferences: {
      currency: 'USD',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
    },
    privacy: {
      showBalance: false,
      showTransactions: false,
    },
  });
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences' | 'privacy'>('notifications');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && address) {
      fetchSettings();
    }
  }, [isOpen, address]);

  const fetchSettings = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/notifications/preferences/`, {
        headers: {
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Map API data to settings format
        setSettings(prev => ({
          ...prev,
          notifications: {
            email: data.email_enabled || false,
            push: data.in_app_enabled || false,
            deposits: data.email_deposits || false,
            withdrawals: data.email_withdrawals || false,
          },
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/attestify/notifications/preferences/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': address,
        },
        body: JSON.stringify({
          email_enabled: settings.notifications.email,
          in_app_enabled: settings.notifications.push,
          email_deposits: settings.notifications.deposits,
          email_withdrawals: settings.notifications.withdrawals,
        }),
      });
      
      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Notification Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Email Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: e.target.checked }
                    }))}
                    className="rounded border-gray-300"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: e.target.checked }
                    }))}
                    className="rounded border-gray-300"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Deposit Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.deposits}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, deposits: e.target.checked }
                    }))}
                    className="rounded border-gray-300"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Withdrawal Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.withdrawals}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, withdrawals: e.target.checked }
                    }))}
                    className="rounded border-gray-300"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Display Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <Select
                    value={settings.preferences.currency}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, currency: e.target.value }
                    }))}
                    options={[
                      { value: 'USD', label: 'USD ($)' },
                      { value: 'EUR', label: 'EUR (€)' },
                      { value: 'GBP', label: 'GBP (£)' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <Select
                    value={settings.preferences.language}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, language: e.target.value }
                    }))}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Dark Mode</span>
                    <DarkModeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Privacy Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Show Balance Publicly</span>
                    <p className="text-xs text-gray-500">Allow others to see your balance on your profile</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showBalance}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showBalance: e.target.checked }
                    }))}
                    className="rounded border-gray-300"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Show Transactions</span>
                    <p className="text-xs text-gray-500">Display your transaction history on your profile</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showTransactions}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showTransactions: e.target.checked }
                    }))}
                    className="rounded border-gray-300"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={saveSettings} className="flex-1" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
