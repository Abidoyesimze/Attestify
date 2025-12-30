from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import json
import uuid


# ============================================================================
# PHASE 1: GOAL-BASED SAVINGS SYSTEM
# ============================================================================

class SavingsGoal(models.Model):
    """Model for user savings goals"""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]
    
    CATEGORY_CHOICES = [
        ('emergency', 'Emergency Fund'),
        ('vacation', 'Vacation'),
        ('education', 'Education'),
        ('house', 'House/Property'),
        ('vehicle', 'Vehicle'),
        ('wedding', 'Wedding'),
        ('retirement', 'Retirement'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='savings_goals'
    )
    wallet_address = models.CharField(
        max_length=42,
        db_index=True,
        help_text="User's wallet address"
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    target_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        validators=[MinValueValidator(1)],
        help_text="Target amount in cUSD"
    )
    current_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=0,
        help_text="Current saved amount"
    )
    target_date = models.DateField(null=True, blank=True)
    strategy = models.CharField(
        max_length=20,
        choices=[
            ('conservative', 'Conservative'),
            ('balanced', 'Balanced'),
            ('growth', 'Growth'),
        ],
        default='balanced'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_public = models.BooleanField(
        default=False,
        help_text="Allow sharing on community feed"
    )
    color = models.CharField(
        max_length=7,
        default='#3B82F6',
        help_text="Hex color for UI display"
    )
    icon = models.CharField(
        max_length=50,
        default='target',
        help_text="Icon identifier"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['wallet_address', 'status']),
        ]
    
    def __str__(self):
        return f"{self.user.username}: {self.title}"
    
    @property
    def progress_percentage(self):
        """Calculate progress percentage"""
        if self.target_amount == 0:
            return 0
        return min(100, (self.current_amount / self.target_amount) * 100)
    
    @property
    def days_remaining(self):
        """Calculate days until target date"""
        if not self.target_date:
            return None
        delta = self.target_date - timezone.now().date()
        return max(0, delta.days)
    
    @property
    def is_on_track(self):
        """Check if goal is on track based on timeline"""
        if not self.target_date or self.target_amount == 0:
            return True
        days_passed = (timezone.now().date() - self.created_at.date()).days
        total_days = (self.target_date - self.created_at.date()).days
        if total_days == 0:
            return self.current_amount >= self.target_amount
        expected_progress = (days_passed / total_days) * 100
        return self.progress_percentage >= expected_progress * 0.9  # 10% tolerance


class GoalMilestone(models.Model):
    """Milestones for savings goals"""
    
    goal = models.ForeignKey(
        SavingsGoal,
        on_delete=models.CASCADE,
        related_name='milestones'
    )
    title = models.CharField(max_length=200)
    target_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    achieved_at = models.DateTimeField(null=True, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['order', 'target_amount']
    
    def __str__(self):
        return f"{self.goal.title}: {self.title}"
    
    @property
    def is_achieved(self):
        return self.achieved_at is not None


class GoalProgress(models.Model):
    """Track progress updates for goals"""
    
    goal = models.ForeignKey(
        SavingsGoal,
        on_delete=models.CASCADE,
        related_name='progress_updates'
    )
    amount_added = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=0
    )
    previous_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2
    )
    new_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2
    )
    source = models.CharField(
        max_length=50,
        choices=[
            ('deposit', 'Deposit'),
            ('yield', 'Yield Earnings'),
            ('manual', 'Manual Adjustment'),
        ],
        default='deposit'
    )
    transaction_hash = models.CharField(
        max_length=66,
        blank=True,
        help_text="Blockchain transaction hash"
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['goal', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.goal.title}: +{self.amount_added} cUSD"


# ============================================================================
# PHASE 2: REFERRAL & REWARDS PROGRAM
# ============================================================================

class ReferralProgram(models.Model):
    """Referral program configuration"""
    
    is_active = models.BooleanField(default=True)
    referrer_reward_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=5.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Percentage of referred user's first deposit"
    )
    referee_reward_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=10.00,
        help_text="Fixed reward for new user (in cUSD)"
    )
    min_deposit_for_reward = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=50.00,
        help_text="Minimum deposit required for referral reward"
    )
    max_referrals_per_user = models.IntegerField(
        default=100,
        help_text="Maximum referrals per user"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Referral Program"
        verbose_name_plural = "Referral Programs"
    
    def __str__(self):
        return f"Referral Program ({'Active' if self.is_active else 'Inactive'})"
    
    @classmethod
    def get_active_program(cls):
        """Get the active referral program"""
        return cls.objects.filter(is_active=True).first()


class Referral(models.Model):
    """Referral relationships"""
    
    referrer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='referrals_made',
        help_text="User who made the referral"
    )
    referrer_wallet = models.CharField(
        max_length=42,
        db_index=True
    )
    referee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='referral_received',
        null=True,
        blank=True,
        help_text="User who was referred (null if not yet registered)"
    )
    referee_wallet = models.CharField(
        max_length=42,
        db_index=True,
        help_text="Wallet address of referred user"
    )
    referral_code = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        help_text="Unique referral code"
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('active', 'Active'),
            ('rewarded', 'Rewarded'),
            ('expired', 'Expired'),
        ],
        default='pending'
    )
    first_deposit_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        null=True,
        blank=True
    )
    referrer_reward_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=0
    )
    referee_reward_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=0
    )
    referrer_reward_paid = models.BooleanField(default=False)
    referee_reward_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    activated_at = models.DateTimeField(null=True, blank=True)
    rewarded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['referrer', 'status']),
            models.Index(fields=['referrer_wallet', 'status']),
            models.Index(fields=['referral_code']),
        ]
        unique_together = [['referrer', 'referee_wallet']]
    
    def __str__(self):
        return f"{self.referrer.username} → {self.referee_wallet[:10]}... ({self.status})"
    
    @classmethod
    def generate_code(cls, user):
        """Generate unique referral code"""
        base_code = user.username[:6].upper() if hasattr(user, 'username') else 'USER'
        code = f"{base_code}{uuid.uuid4().hex[:6].upper()}"
        while cls.objects.filter(referral_code=code).exists():
            code = f"{base_code}{uuid.uuid4().hex[:6].upper()}"
        return code


class ReferralReward(models.Model):
    """Individual referral rewards"""
    
    referral = models.ForeignKey(
        Referral,
        on_delete=models.CASCADE,
        related_name='rewards'
    )
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='referral_rewards'
    )
    recipient_wallet = models.CharField(max_length=42)
    amount = models.DecimalField(
        max_digits=18,
        decimal_places=2
    )
    reward_type = models.CharField(
        max_length=20,
        choices=[
            ('referrer', 'Referrer Reward'),
            ('referee', 'Referee Bonus'),
        ]
    )
    transaction_hash = models.CharField(
        max_length=66,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('paid', 'Paid'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    created_at = models.DateTimeField(default=timezone.now)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.recipient.username}: {self.amount} cUSD ({self.reward_type})"


# ============================================================================
# PHASE 3: NOTIFICATIONS SYSTEM
# ============================================================================

class Notification(models.Model):
    """In-app notifications"""
    
    NOTIFICATION_TYPES = [
        ('goal_milestone', 'Goal Milestone'),
        ('goal_completed', 'Goal Completed'),
        ('deposit_success', 'Deposit Success'),
        ('withdrawal_success', 'Withdrawal Success'),
        ('yield_earned', 'Yield Earned'),
        ('referral_activated', 'Referral Activated'),
        ('referral_reward', 'Referral Reward'),
        ('system_announcement', 'System Announcement'),
        ('strategy_change', 'Strategy Change'),
        ('security_alert', 'Security Alert'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    wallet_address = models.CharField(
        max_length=42,
        db_index=True
    )
    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional data for the notification"
    )
    is_read = models.BooleanField(default=False)
    is_email_sent = models.BooleanField(default=False)
    action_url = models.URLField(blank=True, help_text="URL for action button")
    action_text = models.CharField(max_length=50, blank=True)
    priority = models.IntegerField(
        default=1,
        choices=[
            (1, 'Low'),
            (2, 'Normal'),
            (3, 'High'),
            (4, 'Urgent'),
        ]
    )
    created_at = models.DateTimeField(default=timezone.now)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read', 'created_at']),
            models.Index(fields=['wallet_address', 'is_read']),
            models.Index(fields=['notification_type', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username}: {self.title}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()


class NotificationPreference(models.Model):
    """User notification preferences"""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )
    wallet_address = models.CharField(max_length=42, db_index=True)
    
    # Email preferences
    email_enabled = models.BooleanField(default=True)
    email_goal_updates = models.BooleanField(default=True)
    email_deposits = models.BooleanField(default=True)
    email_withdrawals = models.BooleanField(default=True)
    email_yield_updates = models.BooleanField(default=True)
    email_referrals = models.BooleanField(default=True)
    email_announcements = models.BooleanField(default=True)
    email_security_alerts = models.BooleanField(default=True)
    
    # In-app preferences
    in_app_enabled = models.BooleanField(default=True)
    in_app_goal_updates = models.BooleanField(default=True)
    in_app_transactions = models.BooleanField(default=True)
    in_app_referrals = models.BooleanField(default=True)
    in_app_announcements = models.BooleanField(default=True)
    
    # Frequency
    email_frequency = models.CharField(
        max_length=20,
        choices=[
            ('instant', 'Instant'),
            ('daily', 'Daily Digest'),
            ('weekly', 'Weekly Digest'),
        ],
        default='instant'
    )
    
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Preferences: {self.user.username}"


# ============================================================================
# PHASE 5: SOCIAL FEATURES & USER PROFILES
# ============================================================================

class UserProfile(models.Model):
    """Extended user profile with social features"""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    wallet_address = models.CharField(
        max_length=42,
        unique=True,
        db_index=True
    )
    display_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Public display name"
    )
    bio = models.TextField(
        max_length=500,
        blank=True,
        help_text="User bio for public profile"
    )
    avatar_url = models.URLField(blank=True)
    is_public = models.BooleanField(
        default=False,
        help_text="Make profile visible to others"
    )
    show_balance = models.BooleanField(
        default=False,
        help_text="Show balance on public profile"
    )
    show_goals = models.BooleanField(
        default=False,
        help_text="Show goals on public profile"
    )
    show_achievements = models.BooleanField(
        default=True,
        help_text="Show achievements on public profile"
    )
    
    # Statistics
    total_deposited = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=0
    )
    total_earned = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=0
    )
    total_referrals = models.IntegerField(default=0)
    total_goals_completed = models.IntegerField(default=0)
    
    # Social
    followers_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['wallet_address']),
            models.Index(fields=['is_public', 'created_at']),
        ]
    
    def __str__(self):
        return f"Profile: {self.user.username}"


class Achievement(models.Model):
    """User achievements/badges"""
    
    ACHIEVEMENT_TYPES = [
        ('first_deposit', 'First Deposit'),
        ('goal_completed', 'Goal Completed'),
        ('milestone_reached', 'Milestone Reached'),
        ('referral_master', 'Referral Master'),
        ('yield_earner', 'Yield Earner'),
        ('long_term_saver', 'Long Term Saver'),
        ('goal_setter', 'Goal Setter'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='achievements'
    )
    achievement_type = models.CharField(
        max_length=50,
        choices=ACHIEVEMENT_TYPES
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='trophy')
    data = models.JSONField(
        default=dict,
        blank=True,
        help_text="Achievement-specific data"
    )
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'achievement_type']),
        ]
        unique_together = [['user', 'achievement_type']]
    
    def __str__(self):
        return f"{self.user.username}: {self.title}"


class CommunityActivity(models.Model):
    """Community feed activities"""
    
    ACTIVITY_TYPES = [
        ('goal_created', 'Goal Created'),
        ('goal_completed', 'Goal Completed'),
        ('milestone_reached', 'Milestone Reached'),
        ('achievement_earned', 'Achievement Earned'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='activities'
    )
    activity_type = models.CharField(
        max_length=50,
        choices=ACTIVITY_TYPES
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    data = models.JSONField(
        default=dict,
        blank=True
    )
    is_public = models.BooleanField(default=True)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Community Activities"
        indexes = [
            models.Index(fields=['is_public', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username}: {self.activity_type}"


class UserFollow(models.Model):
    """User follow relationships"""
    
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='following'
    )
    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='followers'
    )
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = [['follower', 'following']]
        indexes = [
            models.Index(fields=['follower', 'created_at']),
            models.Index(fields=['following', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"
