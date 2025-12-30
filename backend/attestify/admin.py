from django.contrib import admin
from .models import (
    # Goal-based savings
    SavingsGoal,
    GoalMilestone,
    GoalProgress,
    # Referral system
    ReferralProgram,
    Referral,
    ReferralReward,
    # Notifications
    Notification,
    NotificationPreference,
    # Social features
    UserProfile,
    Achievement,
    CommunityActivity,
    UserFollow,
)


# ============================================================================
# GOAL-BASED SAVINGS ADMIN
# ============================================================================

@admin.register(SavingsGoal)
class SavingsGoalAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'category', 'current_amount', 'target_amount', 
                   'progress_percentage', 'status', 'created_at')
    list_filter = ('status', 'category', 'strategy', 'created_at')
    search_fields = ('title', 'description', 'user__username', 'wallet_address')
    readonly_fields = ('created_at', 'updated_at', 'completed_at', 'progress_percentage', 
                      'days_remaining', 'is_on_track')
    list_per_page = 50
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'wallet_address', 'title', 'description', 'category')
        }),
        ('Goal Details', {
            'fields': ('target_amount', 'current_amount', 'target_date', 'strategy', 'status')
        }),
        ('Display', {
            'fields': ('is_public', 'color', 'icon')
        }),
        ('Progress', {
            'fields': ('progress_percentage', 'days_remaining', 'is_on_track')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at')
        }),
    )


@admin.register(GoalMilestone)
class GoalMilestoneAdmin(admin.ModelAdmin):
    list_display = ('id', 'goal', 'title', 'target_amount', 'is_achieved', 'order', 'created_at')
    list_filter = ('is_achieved', 'created_at')
    search_fields = ('title', 'goal__title', 'goal__user__username')
    readonly_fields = ('achieved_at', 'is_achieved')
    list_per_page = 50


@admin.register(GoalProgress)
class GoalProgressAdmin(admin.ModelAdmin):
    list_display = ('id', 'goal', 'amount_added', 'previous_amount', 'new_amount', 
                   'source', 'created_at')
    list_filter = ('source', 'created_at')
    search_fields = ('goal__title', 'transaction_hash', 'notes')
    readonly_fields = ('created_at',)
    list_per_page = 50


# ============================================================================
# REFERRAL SYSTEM ADMIN
# ============================================================================

@admin.register(ReferralProgram)
class ReferralProgramAdmin(admin.ModelAdmin):
    list_display = ('id', 'is_active', 'referrer_reward_percentage', 'referee_reward_amount',
                   'min_deposit_for_reward', 'max_referrals_per_user', 'updated_at')
    list_filter = ('is_active',)
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('is_active',)


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('id', 'referrer', 'referee_wallet', 'referral_code', 'status',
                   'first_deposit_amount', 'referrer_reward_amount', 'created_at')
    list_filter = ('status', 'created_at', 'activated_at')
    search_fields = ('referral_code', 'referrer__username', 'referee_wallet', 
                    'referee__username')
    readonly_fields = ('created_at', 'activated_at', 'rewarded_at')
    list_per_page = 50
    fieldsets = (
        ('Referral Information', {
            'fields': ('referrer', 'referrer_wallet', 'referee', 'referee_wallet', 'referral_code', 'status')
        }),
        ('Rewards', {
            'fields': ('first_deposit_amount', 'referrer_reward_amount', 'referee_reward_amount',
                      'referrer_reward_paid', 'referee_reward_paid')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'activated_at', 'rewarded_at')
        }),
    )


@admin.register(ReferralReward)
class ReferralRewardAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipient', 'amount', 'reward_type', 'status', 'created_at', 'paid_at')
    list_filter = ('reward_type', 'status', 'created_at')
    search_fields = ('recipient__username', 'transaction_hash', 'referral__referral_code')
    readonly_fields = ('created_at', 'paid_at')
    list_per_page = 50


# ============================================================================
# NOTIFICATIONS ADMIN
# ============================================================================

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'notification_type', 'title', 'is_read', 
                   'priority', 'created_at')
    list_filter = ('notification_type', 'is_read', 'priority', 'created_at')
    search_fields = ('title', 'message', 'user__username', 'wallet_address')
    readonly_fields = ('created_at', 'read_at')
    list_per_page = 50
    fieldsets = (
        ('Notification Details', {
            'fields': ('user', 'wallet_address', 'notification_type', 'title', 'message', 'data')
        }),
        ('Status', {
            'fields': ('is_read', 'is_email_sent', 'read_at', 'priority')
        }),
        ('Action', {
            'fields': ('action_url', 'action_text')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_enabled', 'in_app_enabled', 'email_frequency', 'updated_at')
    list_filter = ('email_enabled', 'in_app_enabled', 'email_frequency')
    search_fields = ('user__username', 'wallet_address')
    readonly_fields = ('updated_at',)
    fieldsets = (
        ('User', {
            'fields': ('user', 'wallet_address')
        }),
        ('Email Preferences', {
            'fields': ('email_enabled', 'email_goal_updates', 'email_deposits', 
                      'email_withdrawals', 'email_yield_updates', 'email_referrals',
                      'email_announcements', 'email_security_alerts', 'email_frequency')
        }),
        ('In-App Preferences', {
            'fields': ('in_app_enabled', 'in_app_goal_updates', 'in_app_transactions',
                      'in_app_referrals', 'in_app_announcements')
        }),
    )


# ============================================================================
# SOCIAL FEATURES ADMIN
# ============================================================================

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'wallet_address', 'display_name', 'is_public', 
                   'total_deposited', 'total_earned', 'total_referrals', 'created_at')
    list_filter = ('is_public', 'show_balance', 'show_goals', 'created_at')
    search_fields = ('user__username', 'wallet_address', 'display_name', 'bio')
    readonly_fields = ('created_at', 'updated_at', 'followers_count', 'following_count')
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'wallet_address', 'display_name', 'bio', 'avatar_url')
        }),
        ('Privacy Settings', {
            'fields': ('is_public', 'show_balance', 'show_goals', 'show_achievements')
        }),
        ('Statistics', {
            'fields': ('total_deposited', 'total_earned', 'total_referrals', 
                      'total_goals_completed', 'followers_count', 'following_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'achievement_type', 'title', 'is_public', 'created_at')
    list_filter = ('achievement_type', 'is_public', 'created_at')
    search_fields = ('title', 'description', 'user__username')
    readonly_fields = ('created_at',)
    list_per_page = 50


@admin.register(CommunityActivity)
class CommunityActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'activity_type', 'title', 'is_public', 
                   'likes_count', 'comments_count', 'created_at')
    list_filter = ('activity_type', 'is_public', 'created_at')
    search_fields = ('title', 'description', 'user__username')
    readonly_fields = ('created_at', 'likes_count', 'comments_count')
    list_per_page = 50


@admin.register(UserFollow)
class UserFollowAdmin(admin.ModelAdmin):
    list_display = ('id', 'follower', 'following', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('follower__username', 'following__username')
    readonly_fields = ('created_at',)
    list_per_page = 50
