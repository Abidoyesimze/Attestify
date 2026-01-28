'use client';

import { motion } from 'framer-motion';
import { 
  ArrowDownLeft,
  ArrowUpRight,
  Settings,
  TrendingUp,
  Target,
  Bell
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: typeof ArrowDownLeft;
  color: string;
  onClick: () => void;
}

interface QuickActionsPanelProps {
  actions: QuickAction[];
  onActionClick: (actionId: string) => void;
}

export default function QuickActionsPanel({
  actions,
  onActionClick
}: QuickActionsPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onActionClick(action.id)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-lg
                border border-gray-200 hover:border-${action.color}-300
                bg-${action.color}-50 hover:bg-${action.color}-100
                transition-colors
              `}
            >
              <div className={`p-2 rounded-full bg-${action.color}-100`}>
                <Icon className={`h-5 w-5 text-${action.color}-600`} />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
