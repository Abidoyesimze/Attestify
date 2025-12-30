'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Bell, Check, CheckCheck, Settings, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Notification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  priority: number;
  action_url: string;
  action_text: string;
  created_at: string;
  read_at: string | null;
}

const NOTIFICATION_ICONS: Record<string, string> = {
  goal_milestone: '🎯',
  goal_completed: '🎉',
  deposit_success: '💰',
  withdrawal_success: '💸',
  yield_earned: '📈',
  referral_activated: '👥',
  referral_reward: '🎁',
  system_announcement: '📢',
  strategy_change: '⚙️',
  security_alert: '🔒',
};

const PRIORITY_COLORS: Record<number, string> = {
  1: 'bg-gray-100 border-gray-300',
  2: 'bg-blue-50 border-blue-200',
  3: 'bg-yellow-50 border-yellow-200',
  4: 'bg-red-50 border-red-200',
};

export default function NotificationCenter() {
  const { address } = useAccount();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (address) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Poll for new notifications
      const interval = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [address]);

  const fetchNotifications = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/notifications/?is_read=${showAll ? '' : 'false'}`, {
        headers: {
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/notifications/unread-count/`, {
        headers: {
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    if (!address) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/notifications/${notificationId}/read/`, {
        method: 'POST',
        headers: {
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        await fetchNotifications();
        await fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attestify/notifications/mark-all-read/`, {
        method: 'POST',
        headers: {
          'X-Wallet-Address': address,
        },
      });
      
      if (response.ok) {
        await fetchNotifications();
        await fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <p className="text-gray-600 mt-1">Stay updated with your account activity</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            size="sm"
          >
            {showAll ? 'Unread only' : 'Show all'}
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all ${
                !notification.is_read ? PRIORITY_COLORS[notification.priority] : 'bg-white'
              } ${!notification.is_read ? 'border-l-4' : ''}`}
              style={!notification.is_read ? { borderLeftColor: notification.priority >= 3 ? '#EF4444' : '#3B82F6' } : {}}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl flex-shrink-0">
                  {NOTIFICATION_ICONS[notification.notification_type] || '📬'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-900 ${!notification.is_read ? 'font-bold' : ''}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.created_at)}
                        </span>
                        {notification.action_url && (
                          <a
                            href={notification.action_url}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {notification.action_text || 'View →'}
                          </a>
                        )}
                      </div>
                    </div>
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

