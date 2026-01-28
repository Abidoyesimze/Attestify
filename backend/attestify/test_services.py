from django.test import TestCase
from django.contrib.auth.models import User
from .models import SavingsGoal, Notification, Achievement
from .services import NotificationService, AchievementService


class NotificationServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.wallet_address = '0x1234567890123456789012345678901234567890'

    def test_create_notification(self):
        notification = NotificationService.create_notification(
            user=self.user,
            wallet_address=self.wallet_address,
            notification_type='deposit_success',
            title='Test Notification',
            message='Test message',
        )
        self.assertIsNotNone(notification)
        self.assertEqual(notification.title, 'Test Notification')

    def test_notify_goal_completed(self):
        goal = SavingsGoal.objects.create(
            user=self.user,
            wallet_address=self.wallet_address,
            title='Test Goal',
            target_amount=1000.00,
            current_amount=1000.00,
            status='completed',
        )
        NotificationService.notify_goal_completed(goal)
        notification = Notification.objects.filter(
            user=self.user,
            notification_type='goal_completed'
        ).first()
        self.assertIsNotNone(notification)


class AchievementServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_check_and_award_achievement(self):
        achievement = AchievementService.check_and_award_achievement(
            user=self.user,
            achievement_type='first_deposit',
            title='First Steps',
            description='Made your first deposit',
        )
        self.assertIsNotNone(achievement)
        self.assertEqual(achievement.achievement_type, 'first_deposit')
