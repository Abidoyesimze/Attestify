// User Types
export interface User {
  id: string;
  username: string;
  email?: string;
  wallet_address: string;
  is_verified: boolean;
  created_at: string;
}

// Goal Types
export interface SavingsGoal {
  id: number;
  title: string;
  description: string;
  category: GoalCategory;
  target_amount: string;
  current_amount: string;
  target_date: string | null;
  strategy: StrategyType;
  status: GoalStatus;
  progress_percentage: number;
  days_remaining: number | null;
  is_on_track: boolean;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export type GoalCategory =
  | 'emergency'
  | 'vacation'
  | 'education'
  | 'house'
  | 'vehicle'
  | 'wedding'
  | 'retirement'
  | 'other';

export type StrategyType = 'conservative' | 'balanced' | 'growth';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

// Referral Types
export interface Referral {
  id: number;
  referral_code: string;
  status: ReferralStatus;
  first_deposit_amount: string | null;
  referrer_reward_amount: string;
  referee_reward_amount: string;
  created_at: string;
  activated_at: string | null;
}

export type ReferralStatus = 'pending' | 'active' | 'rewarded' | 'expired';

// Notification Types
export interface Notification {
  id: number;
  notification_type: NotificationType;
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

export type NotificationType =
  | 'goal_milestone'
  | 'goal_completed'
  | 'deposit_success'
  | 'withdrawal_success'
  | 'yield_earned'
  | 'referral_activated'
  | 'referral_reward'
  | 'system_announcement'
  | 'strategy_change'
  | 'security_alert';

// Transaction Types
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: string;
  timestamp: number;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}
