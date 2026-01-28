'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  TrendingUp,
  Users,
  Target,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'deposit' | 'withdraw' | 'yield' | 'referral' | 'goal';
  title: string;
  description: string;
  amount?: number;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'failed';
}

interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
}

export default function ActivityFeed({ activities, limit = 10 }: ActivityFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedActivities = showAll ? activities : activities.slice(0, limit);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'deposit':
        return ArrowDownLeft;
      case 'withdraw':
        return ArrowUpRight;
      case 'yield':
        return TrendingUp;
      case 'referral':
        return Users;
      case 'goal':
        return Target;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-600';
      case 'withdraw':
        return 'bg-blue-100 text-blue-600';
      case 'yield':
        return 'bg-purple-100 text-purple-600';
      case 'referral':
        return 'bg-yellow-100 text-yellow-600';
      case 'goal':
        return 'bg-pink-100 text-pink-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Activity
        </h3>
        {activities.length > limit && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {showAll ? 'Show Less' : `Show All (${activities.length})`}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayedActivities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                  {activity.amount && (
                    <div className="flex-shrink-0 text-right">
                      <p className={`text-sm font-semibold ${
                        activity.type === 'deposit' || activity.type === 'yield'
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}>
                        {activity.type === 'deposit' || activity.type === 'yield' ? '+' : '-'}
                        {formatAmount(activity.amount)}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                  {activity.status && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      activity.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : activity.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {activity.status}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No activity yet</p>
        </div>
      )}
    </div>
  );
}
