"""
Services for Attestify features - notification sending, achievement checking, etc.
"""
import logging
from django.utils import timezone
from django.contrib.auth.models import User
from .models import (
    Notification,
    NotificationPreference,
    Achievement,
    CommunityActivity,
    SavingsGoal,
    UserProfile,
    Referral,
)

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for creating and sending notifications"""
    
    @staticmethod
    def create_notification(
        user,
        wallet_address,
        notification_type,
        title,
        message,
        data=None,
        priority=2,
        action_url=None,
        action_text=None,
        send_email=True
    ):
        """Create a notification for a user"""
        try:
            notification = Notification.objects.create(
                user=user,
                wallet_address=wallet_address,
                notification_type=notification_type,
                title=title,
                message=message,
                data=data or {},
                priority=priority,
                action_url=action_url or '',
                action_text=action_text or ''
            )
            
            # Check if user wants email notifications
            if send_email:
                try:
                    prefs = NotificationPreference.objects.get(user=user)
                    if prefs.email_enabled:
                        # TODO: Send email notification
                        # For now, just mark as email should be sent
                        notification.is_email_sent = False
                        notification.save()
                except NotificationPreference.DoesNotExist:
                    pass
            
            return notification
        except Exception as e:
            logger.error(f"Error creating notification: {str(e)}")
            return None
    
    @staticmethod
    def notify_goal_milestone(goal, milestone):
        """Notify user about goal milestone"""
        NotificationService.create_notification(
            user=goal.user,
            wallet_address=goal.wallet_address,
            notification_type='goal_milestone',
            title=f"Milestone Reached: {milestone.title}",
            message=f"Congratulations! You've reached the '{milestone.title}' milestone for your goal '{goal.title}'.",
            data={'goal_id': goal.id, 'milestone_id': milestone.id},
            action_url=f'/dashboard/goals/{goal.id}',
            action_text='View Goal'
        )
    
    @staticmethod
    def notify_goal_completed(goal):
        """Notify user about goal completion"""
        NotificationService.create_notification(
            user=goal.user,
            wallet_address=goal.wallet_address,
            notification_type='goal_completed',
            title=f"Goal Completed: {goal.title}",
            message=f"🎉 Amazing! You've completed your goal '{goal.title}'. You saved {goal.target_amount} cUSD!",
            data={'goal_id': goal.id},
            priority=3,
            action_url=f'/dashboard/goals/{goal.id}',
            action_text='View Goal'
        )
    
    @staticmethod
    def notify_deposit_success(user, wallet_address, amount, transaction_hash):
        """Notify user about successful deposit"""
        NotificationService.create_notification(
            user=user,
            wallet_address=wallet_address,
            notification_type='deposit_success',
            title='Deposit Successful',
            message=f'Your deposit of {amount} cUSD has been successfully processed.',
            data={'amount': str(amount), 'transaction_hash': transaction_hash},
            action_url=f'/dashboard',
            action_text='View Dashboard'
        )
    
    @staticmethod
    def notify_referral_activated(referral):
        """Notify referrer about referral activation"""
        NotificationService.create_notification(
            user=referral.referrer,
            wallet_address=referral.referrer_wallet,
            notification_type='referral_activated',
            title='Referral Activated',
            message=f'Someone used your referral code! You\'ll earn rewards when they make their first deposit.',
            data={'referral_id': referral.id},
            action_url='/dashboard/referrals',
            action_text='View Referrals'
        )


class AchievementService:
    """Service for checking and awarding achievements"""
    
    @staticmethod
    def check_and_award_achievement(user, achievement_type, title, description, data=None):
        """Check if achievement exists, if not create it"""
        try:
            achievement, created = Achievement.objects.get_or_create(
                user=user,
                achievement_type=achievement_type,
                defaults={
                    'title': title,
                    'description': description,
                    'data': data or {},
                    'is_public': True
                }
            )
            
            if created:
                # Create community activity
                try:
                    profile = UserProfile.objects.get(user=user)
                    if profile.is_public and profile.show_achievements:
                        CommunityActivity.objects.create(
                            user=user,
                            activity_type='achievement_earned',
                            title=f"{user.username} earned: {title}",
                            description=description,
                            data={'achievement_id': achievement.id},
                            is_public=True
                        )
                except UserProfile.DoesNotExist:
                    pass
            
            return achievement
        except Exception as e:
            logger.error(f"Error awarding achievement: {str(e)}")
            return None
    
    @staticmethod
    def check_first_deposit(user, wallet_address):
        """Check if this is user's first deposit"""
        from .models import GoalProgress
        progress_count = GoalProgress.objects.filter(
            goal__user=user,
            goal__wallet_address=wallet_address
        ).count()
        
        if progress_count == 1:  # First deposit
            AchievementService.check_and_award_achievement(
                user=user,
                achievement_type='first_deposit',
                title='First Steps',
                description='Made your first deposit on Attestify!',
                data={'wallet_address': wallet_address}
            )
    
    @staticmethod
    def check_goal_completed(user, goal):
        """Check achievements when goal is completed"""
        # Goal completed achievement
        AchievementService.check_and_award_achievement(
            user=user,
            achievement_type='goal_completed',
            title='Goal Achiever',
            description=f'Completed your goal: {goal.title}',
            data={'goal_id': goal.id, 'target_amount': str(goal.target_amount)}
        )
        
        # Update profile stats
        try:
            profile = UserProfile.objects.get(user=user)
            profile.total_goals_completed += 1
            profile.save()
        except UserProfile.DoesNotExist:
            pass
    
    @staticmethod
    def check_referral_milestones(user, referral_count):
        """Check referral-based achievements"""
        if referral_count >= 10:
            AchievementService.check_and_award_achievement(
                user=user,
                achievement_type='referral_master',
                title='Referral Master',
                description='Referred 10+ users to Attestify!',
                data={'referral_count': referral_count}
            )


class CommunityService:
    """Service for community activities"""
    
    @staticmethod
    def create_goal_activity(goal, activity_type='goal_created'):
        """Create community activity for goal"""
        if not goal.is_public:
            return
        
        try:
            profile = UserProfile.objects.get(user=goal.user)
            if not profile.is_public or not profile.show_goals:
                return
        except UserProfile.DoesNotExist:
            return
        
        title_map = {
            'goal_created': f"{goal.user.username} created a new goal: {goal.title}",
            'goal_completed': f"🎉 {goal.user.username} completed their goal: {goal.title}!",
            'milestone_reached': f"{goal.user.username} reached a milestone in {goal.title}",
        }
        
        CommunityActivity.objects.create(
            user=goal.user,
            activity_type=activity_type,
            title=title_map.get(activity_type, goal.title),
            description=f"Target: {goal.target_amount} cUSD • Category: {goal.get_category_display()}",
            data={'goal_id': goal.id, 'category': goal.category},
            is_public=True
        )

