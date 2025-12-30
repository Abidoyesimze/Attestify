# Integration Guide - Adding New Features to Dashboard

This guide shows how to integrate the new features (Goals, Referrals, Notifications) into the existing dashboard.

## Step 1: Update Dashboard Navigation

In `/frontend/src/app/dashboard/page.tsx`, update the `activeSection` type and add new sections:

```tsx
// Update the state type
const [activeSection, setActiveSection] = useState<
  'overview' | 'strategy' | 'analytics' | 'goals' | 'referrals' | 'notifications'
>('overview');
```

## Step 2: Add Navigation Tabs

Find where the navigation tabs are rendered and add:

```tsx
import { Target, Users, Bell } from 'lucide-react';

// In the navigation section, add:
<button
  onClick={() => setActiveSection('goals')}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
    activeSection === 'goals' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
  }`}
>
  <Target className="h-4 w-4" />
  Goals
</button>

<button
  onClick={() => setActiveSection('referrals')}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
    activeSection === 'referrals' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
  }`}
>
  <Users className="h-4 w-4" />
  Referrals
</button>

<button
  onClick={() => setActiveSection('notifications')}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg relative ${
    activeSection === 'notifications' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
  }`}
>
  <Bell className="h-4 w-4" />
  Notifications
  {/* Add unread badge here if needed */}
</button>
```

## Step 3: Import New Components

At the top of the dashboard file:

```tsx
import GoalsManager from '@/components/GoalsManager';
import ReferralDashboard from '@/components/ReferralDashboard';
import NotificationCenter from '@/components/NotificationCenter';
```

## Step 4: Add Component Rendering

Find where sections are rendered (around line 1000+) and add:

```tsx
{activeSection === 'goals' && (
  <div className="space-y-6">
    <GoalsManager />
  </div>
)}

{activeSection === 'referrals' && (
  <div className="space-y-6">
    <ReferralDashboard />
  </div>
)}

{activeSection === 'notifications' && (
  <div className="space-y-6">
    <NotificationCenter />
  </div>
)}
```

## Step 5: Add Notification Badge to Navbar

In `/frontend/src/components/Navbar/index.tsx`, add a notification bell with unread count:

```tsx
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Bell } from 'lucide-react';

// Inside the Navbar component:
const { address } = useAccount();
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  if (address) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/attestify/notifications/unread-count/`, {
      headers: { 'X-Wallet-Address': address },
    })
      .then(res => res.json())
      .then(data => setUnreadCount(data.unread_count || 0))
      .catch(console.error);
  }
}, [address]);

// In the navbar JSX:
<button
  onClick={() => router.push('/dashboard?section=notifications')}
  className="relative p-2 text-gray-600 hover:text-gray-900"
>
  <Bell className="h-5 w-5" />
  {unreadCount > 0 && (
    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  )}
</button>
```

## Step 6: Update Goal Progress After Deposits

In the deposit success handler, add goal progress update:

```tsx
// After successful deposit
const updateGoalProgress = async (amount: string) => {
  if (!address) return;
  
  // Get user's active goals
  const goalsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/attestify/goals/`,
    { headers: { 'X-Wallet-Address': address } }
  );
  
  if (goalsResponse.ok) {
    const goals = await goalsResponse.json();
    const activeGoals = goals.filter((g: any) => g.status === 'active');
    
    // Update each active goal
    for (const goal of activeGoals) {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/attestify/goals/${goal.id}/progress/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Wallet-Address': address,
          },
          body: JSON.stringify({
            amount_added: amount,
            source: 'deposit',
            transaction_hash: hash, // from transaction
          }),
        }
      );
    }
  }
};

// Call after deposit success
if (depositStep === 'success') {
  updateGoalProgress(depositAmount);
}
```

## Step 7: Environment Variables

Make sure `.env.local` has:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Step 8: Test Integration

1. Navigate to dashboard
2. Click on "Goals" tab - should show GoalsManager
3. Click on "Referrals" tab - should show ReferralDashboard
4. Click on "Notifications" tab - should show NotificationCenter
5. Create a goal
6. Make a deposit and verify goal progress updates
7. Check notifications appear

## Optional: Add Quick Actions

Add quick action buttons in the overview section:

```tsx
{activeSection === 'overview' && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <Card className="p-4 cursor-pointer hover:shadow-lg transition" onClick={() => setActiveSection('goals')}>
      <Target className="h-8 w-8 text-blue-600 mb-2" />
      <h3 className="font-semibold">Savings Goals</h3>
      <p className="text-sm text-gray-600">Set and track your financial goals</p>
    </Card>
    
    <Card className="p-4 cursor-pointer hover:shadow-lg transition" onClick={() => setActiveSection('referrals')}>
      <Users className="h-8 w-8 text-purple-600 mb-2" />
      <h3 className="font-semibold">Referrals</h3>
      <p className="text-sm text-gray-600">Earn rewards by referring friends</p>
    </Card>
    
    <Card className="p-4 cursor-pointer hover:shadow-lg transition" onClick={() => setActiveSection('notifications')}>
      <Bell className="h-8 w-8 text-yellow-600 mb-2" />
      <h3 className="font-semibold">Notifications</h3>
      <p className="text-sm text-gray-600">Stay updated with your account</p>
    </Card>
  </div>
)}
```

## Troubleshooting

### Components not showing
- Check imports are correct
- Verify API_BASE_URL is set
- Check browser console for errors
- Verify wallet is connected

### API errors
- Check backend is running
- Verify CORS settings
- Check X-Wallet-Address header is being sent
- Verify API endpoints match backend URLs

### Styling issues
- Ensure Tailwind CSS is configured
- Check component imports are correct
- Verify Card, Button, etc. components exist

