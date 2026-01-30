from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal
from .models import (
    SavingsGoal,
    GoalMilestone,
    GoalProgress,
    Referral,
    ReferralProgram,
    Notification,
    NotificationPreference,
    UserProfile,
    Achievement,
)


class SavingsGoalModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_create_savings_goal(self):
        goal = SavingsGoal.objects.create(
            user=self.user,
            wallet_address='0x1234567890123456789012345678901234567890',
            title='Test Goal',
            target_amount=Decimal('1000.00'),
            current_amount=Decimal('500.00'),
            category='emergency',
            strategy='balanced'
        )
        self.assertEqual(goal.title, 'Test Goal')
        self.assertEqual(goal.progress_percentage, 50.0)

    def test_goal_progress_calculation(self):
        goal = SavingsGoal.objects.create(
            user=self.user,
            wallet_address='0x1234567890123456789012345678901234567890',
            title='Test Goal',
            target_amount=Decimal('1000.00'),
            current_amount=Decimal('250.00'),
        )
        self.assertEqual(goal.progress_percentage, 25.0)

    def test_goal_days_remaining(self):
        goal = SavingsGoal.objects.create(
            user=self.user,
            wallet_address='0x1234567890123456789012345678901234567890',
            title='Test Goal',
            target_amount=Decimal('1000.00'),
            target_date=timezone.now().date() + timezone.timedelta(days=30),
        )
        self.assertIsNotNone(goal.days_remaining)
        self.assertGreater(goal.days_remaining, 0)


class ReferralModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='referrer',
            email='referrer@example.com',
            password='testpass123'
        )

    def test_generate_referral_code(self):
        referral = Referral.objects.create(
            referrer=self.user,
            referrer_wallet='0x1234567890123456789012345678901234567890',
            referral_code=Referral.generate_code(self.user)
        )
        self.assertIsNotNone(referral.referral_code)
        self.assertEqual(len(referral.referral_code), 12)

    def test_referral_unique_code(self):
        code1 = Referral.generate_code(self.user)
        code2 = Referral.generate_code(self.user)
        self.assertNotEqual(code1, code2)


class NotificationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_create_notification(self):
        notification = Notification.objects.create(
            user=self.user,
            wallet_address='0x1234567890123456789012345678901234567890',
            notification_type='deposit_success',
            title='Deposit Successful',
            message='Your deposit was processed',
            priority=2
        )
        self.assertFalse(notification.is_read)
        self.assertEqual(notification.notification_type, 'deposit_success')

    def test_mark_notification_as_read(self):
        notification = Notification.objects.create(
            user=self.user,
            wallet_address='0x1234567890123456789012345678901234567890',
            notification_type='deposit_success',
            title='Test',
            message='Test message',
        )
        notification.mark_as_read()
        self.assertTrue(notification.is_read)
        self.assertIsNotNone(notification.read_at)


class UserProfileModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_create_user_profile(self):
        profile = UserProfile.objects.create(
            user=self.user,
            wallet_address='0x1234567890123456789012345678901234567890',
            display_name='Test User',
            is_public=False
        )
        self.assertEqual(profile.display_name, 'Test User')
        self.assertFalse(profile.is_public)
