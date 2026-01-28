from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from decimal import Decimal
from .models import SavingsGoal, Referral, Notification


class GoalsAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.wallet_address = '0x1234567890123456789012345678901234567890'

    def test_create_goal(self):
        response = self.client.post(
            '/api/attestify/goals/',
            {
                'title': 'Test Goal',
                'target_amount': '1000.00',
                'category': 'emergency',
                'strategy': 'balanced',
            },
            HTTP_X_WALLET_ADDRESS=self.wallet_address,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SavingsGoal.objects.count(), 1)

    def test_list_goals(self):
        SavingsGoal.objects.create(
            user=self.user,
            wallet_address=self.wallet_address,
            title='Test Goal',
            target_amount=Decimal('1000.00'),
        )
        response = self.client.get(
            '/api/attestify/goals/',
            HTTP_X_WALLET_ADDRESS=self.wallet_address
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)


class ReferralsAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.wallet_address = '0x1234567890123456789012345678901234567890'

    def test_create_referral_code(self):
        response = self.client.post(
            '/api/attestify/referrals/',
            {},
            HTTP_X_WALLET_ADDRESS=self.wallet_address,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertIn('referral_code', response.json())


class NotificationsAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.wallet_address = '0x1234567890123456789012345678901234567890'

    def test_list_notifications(self):
        Notification.objects.create(
            user=self.user,
            wallet_address=self.wallet_address,
            notification_type='deposit_success',
            title='Test',
            message='Test message',
        )
        response = self.client.get(
            '/api/attestify/notifications/',
            HTTP_X_WALLET_ADDRESS=self.wallet_address
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_unread_count(self):
        Notification.objects.create(
            user=self.user,
            wallet_address=self.wallet_address,
            notification_type='deposit_success',
            title='Test',
            message='Test message',
            is_read=False,
        )
        response = self.client.get(
            '/api/attestify/notifications/unread-count/',
            HTTP_X_WALLET_ADDRESS=self.wallet_address
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['unread_count'], 1)
