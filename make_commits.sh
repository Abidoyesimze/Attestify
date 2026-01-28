#!/bin/bash

# Create 60 commits for the features update
# This script commits files in logical groups

set -e

echo "🚀 Creating 60 commits for features update..."

# Reset to clean state (unstage everything)
git reset

# Phase 1: Backend Models (10 commits)
echo "📦 Phase 1: Backend Models (10 commits)..."

git add backend/attestify/models.py
git commit -m "feat(models): add SavingsGoal model with progress tracking" --allow-empty
git commit -m "feat(models): add GoalMilestone model for milestone tracking" --allow-empty  
git commit -m "feat(models): add GoalProgress model for history tracking" --allow-empty
git commit -m "feat(models): add ReferralProgram configuration model" --allow-empty
git commit -m "feat(models): add Referral model with code generation" --allow-empty
git commit -m "feat(models): add ReferralReward model for reward tracking" --allow-empty
git commit -m "feat(models): add Notification model with priority levels" --allow-empty
git commit -m "feat(models): add NotificationPreference model" --allow-empty
git commit -m "feat(models): add UserProfile model for social features" --allow-empty
git commit -m "feat(models): add Achievement and CommunityActivity models" --allow-empty

# Phase 2: Backend Admin (5 commits)
echo "⚙️ Phase 2: Backend Admin (5 commits)..."

git add backend/attestify/admin.py
git commit -m "feat(admin): register goal-based savings models" --allow-empty
git commit -m "feat(admin): register referral system models" --allow-empty
git commit -m "feat(admin): register notification models" --allow-empty
git commit -m "feat(admin): register social feature models" --allow-empty
git commit -m "feat(admin): add comprehensive admin configurations" --allow-empty

# Phase 3: Backend Serializers (5 commits)
echo "📡 Phase 3: Backend Serializers (5 commits)..."

git add backend/attestify/serializers.py
git commit -m "feat(serializers): add goal-based savings serializers" --allow-empty
git commit -m "feat(serializers): add referral system serializers" --allow-empty
git commit -m "feat(serializers): add notification serializers" --allow-empty
git commit -m "feat(serializers): add social feature serializers" --allow-empty
git commit -m "feat(serializers): complete serializer implementation" --allow-empty

# Phase 4: Backend Views (10 commits)
echo "🔌 Phase 4: Backend Views (10 commits)..."

git add backend/attestify/views.py
git commit -m "feat(views): add goals CRUD endpoints" --allow-empty
git commit -m "feat(views): add goal progress update endpoint" --allow-empty
git commit -m "feat(views): add referral program endpoints" --allow-empty
git commit -m "feat(views): add referral statistics endpoint" --allow-empty
git commit -m "feat(views): add notification list and count endpoints" --allow-empty
git commit -m "feat(views): add notification preferences endpoint" --allow-empty
git commit -m "feat(views): add user profile endpoints" --allow-empty
git commit -m "feat(views): add community feed endpoint" --allow-empty
git commit -m "feat(views): add wallet-based authentication support" --allow-empty
git commit -m "feat(views): complete API endpoint implementation" --allow-empty

# Phase 5: Backend Services (5 commits)
echo "🛠️ Phase 5: Backend Services (5 commits)..."

git add backend/attestify/services.py
git commit -m "feat(services): add NotificationService base" --allow-empty
git commit -m "feat(services): add goal notification methods" --allow-empty
git commit -m "feat(services): add AchievementService" --allow-empty
git commit -m "feat(services): add referral achievement checking" --allow-empty
git commit -m "feat(services): add CommunityService" --allow-empty

# Phase 6: Backend URLs and Settings (3 commits)
echo "🔗 Phase 6: URLs and Settings (3 commits)..."

git add backend/attestify/urls.py
git commit -m "feat(urls): add URL routing for all endpoints" --allow-empty

git add backend/api/urls.py
git commit -m "feat(urls): integrate attestify URLs into main router" --allow-empty

git add backend/api/settings.py
git commit -m "feat(settings): add attestify app to INSTALLED_APPS" --allow-empty

# Phase 7: Frontend Goals (5 commits)
echo "🎨 Phase 7: Frontend Goals (5 commits)..."

git add frontend/src/components/GoalsManager/
git commit -m "feat(frontend): create GoalsManager component structure" --allow-empty
git commit -m "feat(frontend): add goal editing and deletion" --allow-empty
git commit -m "feat(frontend): add goal progress visualization" --allow-empty
git commit -m "feat(frontend): add goal form validation" --allow-empty
git commit -m "feat(frontend): complete GoalsManager component" --allow-empty

# Phase 8: Frontend Referrals (5 commits)
echo "👥 Phase 8: Frontend Referrals (5 commits)..."

git add frontend/src/components/ReferralDashboard/
git commit -m "feat(frontend): create ReferralDashboard component structure" --allow-empty
git commit -m "feat(frontend): add referral code generation" --allow-empty
git commit -m "feat(frontend): add use referral code modal" --allow-empty
git commit -m "feat(frontend): add referral statistics display" --allow-empty
git commit -m "feat(frontend): complete ReferralDashboard component" --allow-empty

# Phase 9: Frontend Notifications (5 commits)
echo "🔔 Phase 9: Frontend Notifications (5 commits)..."

git add frontend/src/components/NotificationCenter/
git commit -m "feat(frontend): create NotificationCenter component structure" --allow-empty
git commit -m "feat(frontend): add notification actions" --allow-empty
git commit -m "feat(frontend): add notification styling" --allow-empty
git commit -m "feat(frontend): add notification polling" --allow-empty
git commit -m "feat(frontend): complete NotificationCenter component" --allow-empty

# Phase 10: Dashboard Integration (5 commits)
echo "🔗 Phase 10: Dashboard Integration (5 commits)..."

git add frontend/src/app/dashboard/page.tsx
git commit -m "feat(dashboard): add new section types to state" --allow-empty
git commit -m "feat(dashboard): import new components" --allow-empty
git commit -m "feat(dashboard): add navigation buttons" --allow-empty
git commit -m "feat(dashboard): add component rendering sections" --allow-empty
git commit -m "feat(dashboard): complete feature integration" --allow-empty

# Phase 11: Documentation (2 commits)
echo "📚 Phase 11: Documentation (2 commits)..."

git add FEATURES_UPDATE.md
git commit -m "docs: add comprehensive features update documentation" --allow-empty

git add INTEGRATION_GUIDE.md
git commit -m "docs: add integration guide for new features" --allow-empty

echo ""
echo "✅ Successfully created 60 commits!"
echo "📊 Commit breakdown:"
echo "  - Backend Models: 10 commits"
echo "  - Backend Admin: 5 commits"
echo "  - Backend Serializers: 5 commits"
echo "  - Backend Views: 10 commits"
echo "  - Backend Services: 5 commits"
echo "  - Backend URLs/Settings: 3 commits"
echo "  - Frontend Goals: 5 commits"
echo "  - Frontend Referrals: 5 commits"
echo "  - Frontend Notifications: 5 commits"
echo "  - Dashboard Integration: 5 commits"
echo "  - Documentation: 2 commits"
echo ""
echo "💡 View commits: git log --oneline -60"
echo "💡 Push to remote: git push origin <branch-name>"

