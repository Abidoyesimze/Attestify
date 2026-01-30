from django.test import TestCase
from django.contrib.auth.models import User
from decimal import Decimal
from .models import SavingsGoal
from .serializers import SavingsGoalSerializer


class SavingsGoalSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_goal_serialization(self):
        goal = SavingsGoal.objects.create(
            user=self.user,
            wallet_address='0x1234567890123456789012345678901234567890',
            title='Test Goal',
            target_amount=Decimal('1000.00'),
            current_amount=Decimal('500.00'),
        )
        serializer = SavingsGoalSerializer(goal)
        data = serializer.data
        self.assertEqual(data['title'], 'Test Goal')
        self.assertIn('progress_percentage', data)
        self.assertEqual(data['progress_percentage'], 50.0)
