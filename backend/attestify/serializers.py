from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    SavingsGoal,
    GoalMilestone,
    GoalProgress,
    ReferralProgram,
    Referral,
    ReferralReward,
    Notification,
    NotificationPreference,
    UserProfile,
    Achievement,
    CommunityActivity,
    UserFollow,
)


# ============================================================================
# GOAL-BASED SAVINGS SERIALIZERS
# ============================================================================

class GoalMilestoneSerializer(serializers.ModelSerializer):
    is_achieved = serializers.ReadOnlyField()
    
    class Meta:
        model = GoalMilestone
        fields = ['id', 'title', 'target_amount', 'is_achieved', 'achieved_at', 'order', 'created_at']


class GoalProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalProgress
        fields = ['id', 'amount_added', 'previous_amount', 'new_amount', 'source', 
                 'transaction_hash', 'notes', 'created_at']


class SavingsGoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    is_on_track = serializers.ReadOnlyField()
    milestones = GoalMilestoneSerializer(many=True, read_only=True)
    progress_updates = GoalProgressSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SavingsGoal
        fields = ['id', 'user', 'user_username', 'wallet_address', 'title', 'description',
                 'category', 'target_amount', 'current_amount', 'target_date', 'strategy',
                 'status', 'is_public', 'color', 'icon', 'progress_percentage', 
                 'days_remaining', 'is_on_track', 'milestones', 'progress_updates',
                 'created_at', 'updated_at', 'completed_at']
        read_only_fields = ['user', 'current_amount', 'created_at', 'updated_at', 'completed_at']


class SavingsGoalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingsGoal
        fields = ['title', 'description', 'category', 'target_amount', 'target_date',
                 'strategy', 'is_public', 'color', 'icon']


# ============================================================================
# REFERRAL SYSTEM SERIALIZERS
# ============================================================================

class ReferralProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralProgram
        fields = ['id', 'is_active', 'referrer_reward_percentage', 'referee_reward_amount',
                 'min_deposit_for_reward', 'max_referrals_per_user', 'created_at', 'updated_at']


class ReferralRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralReward
        fields = ['id', 'amount', 'reward_type', 'status', 'transaction_hash',
                 'created_at', 'paid_at']


class ReferralSerializer(serializers.ModelSerializer):
    referrer_username = serializers.CharField(source='referrer.username', read_only=True)
    referee_username = serializers.CharField(source='referee.username', read_only=True, allow_null=True)
    rewards = ReferralRewardSerializer(many=True, read_only=True)
    
    class Meta:
        model = Referral
        fields = ['id', 'referrer', 'referrer_username', 'referrer_wallet', 'referee',
                 'referee_username', 'referee_wallet', 'referral_code', 'status',
                 'first_deposit_amount', 'referrer_reward_amount', 'referee_reward_amount',
                 'referrer_reward_paid', 'referee_reward_paid', 'rewards',
                 'created_at', 'activated_at', 'rewarded_at']


class ReferralCreateSerializer(serializers.Serializer):
    referral_code = serializers.CharField(max_length=20, required=False)


# ============================================================================
# NOTIFICATIONS SERIALIZERS
# ============================================================================

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 'data', 'is_read',
                 'priority', 'action_url', 'action_text', 'created_at', 'read_at']
        read_only_fields = ['created_at', 'read_at']


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['email_enabled', 'email_goal_updates', 'email_deposits', 'email_withdrawals',
                 'email_yield_updates', 'email_referrals', 'email_announcements',
                 'email_security_alerts', 'in_app_enabled', 'in_app_goal_updates',
                 'in_app_transactions', 'in_app_referrals', 'in_app_announcements',
                 'email_frequency']
        read_only_fields = ['updated_at']


# ============================================================================
# SOCIAL FEATURES SERIALIZERS
# ============================================================================

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'achievement_type', 'title', 'description', 'icon', 'data',
                 'is_public', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    achievements = AchievementSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'wallet_address', 'display_name', 'bio',
                 'avatar_url', 'is_public', 'show_balance', 'show_goals', 'show_achievements',
                 'total_deposited', 'total_earned', 'total_referrals', 'total_goals_completed',
                 'followers_count', 'following_count', 'achievements', 'created_at', 'updated_at']
        read_only_fields = ['user', 'total_deposited', 'total_earned', 'total_referrals',
                           'total_goals_completed', 'followers_count', 'following_count',
                           'created_at', 'updated_at']


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['display_name', 'bio', 'avatar_url', 'is_public', 'show_balance',
                 'show_goals', 'show_achievements']


class CommunityActivitySerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_display_name = serializers.CharField(source='user.profile.display_name', read_only=True, allow_null=True)
    
    class Meta:
        model = CommunityActivity
        fields = ['id', 'user', 'user_username', 'user_display_name', 'activity_type',
                 'title', 'description', 'data', 'is_public', 'likes_count', 'comments_count',
                 'created_at']
        read_only_fields = ['user', 'likes_count', 'comments_count', 'created_at']


class UserFollowSerializer(serializers.ModelSerializer):
    follower_username = serializers.CharField(source='follower.username', read_only=True)
    following_username = serializers.CharField(source='following.username', read_only=True)
    
    class Meta:
        model = UserFollow
        fields = ['id', 'follower', 'follower_username', 'following', 'following_username',
                 'created_at']
        read_only_fields = ['follower', 'created_at']

