import logging
from decimal import Decimal
from django.db.models import Q, Sum, Count
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.request import Request
from django.shortcuts import get_object_or_404
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
from .serializers import (
    SavingsGoalSerializer,
    SavingsGoalCreateSerializer,
    GoalMilestoneSerializer,
    GoalProgressSerializer,
    ReferralProgramSerializer,
    ReferralSerializer,
    ReferralCreateSerializer,
    ReferralRewardSerializer,
    NotificationSerializer,
    NotificationPreferenceSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    AchievementSerializer,
    CommunityActivitySerializer,
    UserFollowSerializer,
)

logger = logging.getLogger(__name__)


# ============================================================================
# GOAL-BASED SAVINGS VIEWS
# ============================================================================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def goals_list_create(request: Request) -> Response:
    """List user's goals or create a new goal"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if request.method == 'GET':
        if wallet_address:
            goals = SavingsGoal.objects.filter(wallet_address=wallet_address)
        elif request.user.is_authenticated:
            goals = SavingsGoal.objects.filter(user=request.user)
        else:
            return Response(
                {'error': 'Wallet address or authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = SavingsGoalSerializer(goals, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not wallet_address:
            return Response(
                {'error': 'Wallet address required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user based on wallet
        user = request.user if request.user.is_authenticated else None
        if not user:
            # For wallet-based access, create anonymous user or use existing
            user, _ = User.objects.get_or_create(
                username=f"wallet_{wallet_address[:10]}",
                defaults={'email': ''}
            )
        
        serializer = SavingsGoalCreateSerializer(data=request.data)
        if serializer.is_valid():
            goal = serializer.save(user=user, wallet_address=wallet_address)
            return Response(
                SavingsGoalSerializer(goal).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def goal_detail(request: Request, goal_id: int) -> Response:
    """Get, update, or delete a specific goal"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if wallet_address:
        goal = get_object_or_404(SavingsGoal, id=goal_id, wallet_address=wallet_address)
    elif request.user.is_authenticated:
        goal = get_object_or_404(SavingsGoal, id=goal_id, user=request.user)
    else:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if request.method == 'GET':
        serializer = SavingsGoalSerializer(goal)
        return Response(serializer.data)
    
    elif request.method == 'PUT' or request.method == 'PATCH':
        serializer = SavingsGoalCreateSerializer(goal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(SavingsGoalSerializer(goal).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        goal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([AllowAny])
def update_goal_progress(request: Request, goal_id: int) -> Response:
    """Update goal progress (called after deposits)"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if wallet_address:
        goal = get_object_or_404(SavingsGoal, id=goal_id, wallet_address=wallet_address)
    elif request.user.is_authenticated:
        goal = get_object_or_404(SavingsGoal, id=goal_id, user=request.user)
    else:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    amount_added = Decimal(str(request.data.get('amount_added', 0)))
    source = request.data.get('source', 'deposit')
    transaction_hash = request.data.get('transaction_hash', '')
    notes = request.data.get('notes', '')
    
    previous_amount = goal.current_amount
    goal.current_amount += amount_added
    
    # Check if goal is completed
    if goal.current_amount >= goal.target_amount and goal.status == 'active':
        goal.status = 'completed'
        goal.completed_at = timezone.now()
    
    goal.save()
    
    # Create progress record
    progress = GoalProgress.objects.create(
        goal=goal,
        amount_added=amount_added,
        previous_amount=previous_amount,
        new_amount=goal.current_amount,
        source=source,
        transaction_hash=transaction_hash,
        notes=notes
    )
    
    # Check milestones
    milestones = GoalMilestone.objects.filter(
        goal=goal,
        achieved_at__isnull=True,
        target_amount__lte=goal.current_amount
    )
    for milestone in milestones:
        milestone.achieved_at = timezone.now()
        milestone.save()
    
    return Response(SavingsGoalSerializer(goal).data)


# ============================================================================
# REFERRAL SYSTEM VIEWS
# ============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def referral_program_info(request: Request) -> Response:
    """Get referral program information"""
    program = ReferralProgram.get_active_program()
    if not program:
        return Response(
            {'error': 'Referral program is not active'},
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = ReferralProgramSerializer(program)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def referrals_list_create(request: Request) -> Response:
    """List user's referrals or create a new referral"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if request.method == 'GET':
        if wallet_address:
            referrals = Referral.objects.filter(referrer_wallet=wallet_address)
        elif request.user.is_authenticated:
            referrals = Referral.objects.filter(referrer=request.user)
        else:
            return Response(
                {'error': 'Wallet address or authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = ReferralSerializer(referrals, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Create referral code for user
        if not wallet_address:
            return Response(
                {'error': 'Wallet address required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user if request.user.is_authenticated else None
        if not user:
            user, _ = User.objects.get_or_create(
                username=f"wallet_{wallet_address[:10]}",
                defaults={'email': ''}
            )
        
        # Check if user already has a referral code
        existing = Referral.objects.filter(referrer=user, referrer_wallet=wallet_address).first()
        if existing:
            return Response(ReferralSerializer(existing).data)
        
        # Generate referral code
        referral_code = Referral.generate_code(user)
        referral = Referral.objects.create(
            referrer=user,
            referrer_wallet=wallet_address,
            referral_code=referral_code
        )
        
        return Response(
            ReferralSerializer(referral).data,
            status=status.HTTP_201_CREATED
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def use_referral_code(request: Request) -> Response:
    """Use a referral code when signing up"""
    referral_code = request.data.get('referral_code', '').strip()
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if not referral_code or not wallet_address:
        return Response(
            {'error': 'Referral code and wallet address required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        referral = Referral.objects.get(referral_code=referral_code)
        
        # Check if already used
        if referral.referee_wallet == wallet_address:
            return Response(
                {'error': 'Referral code already used'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update referral
        referral.referee_wallet = wallet_address
        referral.status = 'active'
        referral.activated_at = timezone.now()
        referral.save()
        
        return Response(ReferralSerializer(referral).data)
    
    except Referral.DoesNotExist:
        return Response(
            {'error': 'Invalid referral code'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def referral_stats(request: Request) -> Response:
    """Get referral statistics for user"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if wallet_address:
        referrals = Referral.objects.filter(referrer_wallet=wallet_address)
    elif request.user.is_authenticated:
        referrals = Referral.objects.filter(referrer=request.user)
    else:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    stats = {
        'total_referrals': referrals.count(),
        'active_referrals': referrals.filter(status='active').count(),
        'rewarded_referrals': referrals.filter(status='rewarded').count(),
        'total_rewards_earned': referrals.aggregate(
            total=Sum('referrer_reward_amount')
        )['total'] or 0,
        'pending_rewards': referrals.filter(
            referrer_reward_paid=False
        ).aggregate(total=Sum('referrer_reward_amount'))['total'] or 0,
    }
    
    return Response(stats)


# ============================================================================
# NOTIFICATIONS VIEWS
# ============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def notifications_list(request: Request) -> Response:
    """Get user's notifications"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    is_read = request.query_params.get('is_read')
    
    if wallet_address:
        notifications = Notification.objects.filter(wallet_address=wallet_address)
    elif request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user)
    else:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if is_read is not None:
        notifications = notifications.filter(is_read=is_read.lower() == 'true')
    
    notifications = notifications.order_by('-created_at')[:50]
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def notifications_unread_count(request: Request) -> Response:
    """Get count of unread notifications"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if wallet_address:
        count = Notification.objects.filter(wallet_address=wallet_address, is_read=False).count()
    elif request.user.is_authenticated:
        count = Notification.objects.filter(user=request.user, is_read=False).count()
    else:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    return Response({'unread_count': count})


@api_view(['POST'])
@permission_classes([AllowAny])
def notification_mark_read(request: Request, notification_id: int) -> Response:
    """Mark a notification as read"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if wallet_address:
        notification = get_object_or_404(Notification, id=notification_id, wallet_address=wallet_address)
    elif request.user.is_authenticated:
        notification = get_object_or_404(Notification, id=notification_id, user=request.user)
    else:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    notification.mark_as_read()
    return Response(NotificationSerializer(notification).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def notifications_mark_all_read(request: Request) -> Response:
    """Mark all notifications as read"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if wallet_address:
        notifications = Notification.objects.filter(wallet_address=wallet_address, is_read=False)
    elif request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user, is_read=False)
    else:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    count = notifications.update(is_read=True, read_at=timezone.now())
    return Response({'marked_read': count})


@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def notification_preferences(request: Request) -> Response:
    """Get or update notification preferences"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if not wallet_address and not request.user.is_authenticated:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    user = request.user if request.user.is_authenticated else None
    if not user:
        user, _ = User.objects.get_or_create(
            username=f"wallet_{wallet_address[:10]}",
            defaults={'email': ''}
        )
    
    if request.method == 'GET':
        prefs, _ = NotificationPreference.objects.get_or_create(
            user=user,
            defaults={'wallet_address': wallet_address}
        )
        serializer = NotificationPreferenceSerializer(prefs)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        prefs, _ = NotificationPreference.objects.get_or_create(
            user=user,
            defaults={'wallet_address': wallet_address}
        )
        serializer = NotificationPreferenceSerializer(prefs, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================================
# SOCIAL FEATURES VIEWS
# ============================================================================

@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def user_profile(request: Request) -> Response:
    """Get or update user profile"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if not wallet_address and not request.user.is_authenticated:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    user = request.user if request.user.is_authenticated else None
    if not user:
        user, _ = User.objects.get_or_create(
            username=f"wallet_{wallet_address[:10]}",
            defaults={'email': ''}
        )
    
    if request.method == 'GET':
        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={'wallet_address': wallet_address}
        )
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={'wallet_address': wallet_address}
        )
        serializer = UserProfileUpdateSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(UserProfileSerializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def achievements_list(request: Request) -> Response:
    """Get user's achievements"""
    wallet_address = request.headers.get('X-Wallet-Address', '').strip()
    
    if wallet_address:
        # Get user by wallet
        try:
            profile = UserProfile.objects.get(wallet_address=wallet_address)
            achievements = Achievement.objects.filter(user=profile.user)
        except UserProfile.DoesNotExist:
            achievements = Achievement.objects.none()
    elif request.user.is_authenticated:
        achievements = Achievement.objects.filter(user=request.user)
    else:
        return Response(
            {'error': 'Wallet address or authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    serializer = AchievementSerializer(achievements, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def community_feed(request: Request) -> Response:
    """Get community activity feed"""
    limit = int(request.query_params.get('limit', 20))
    activity_type = request.query_params.get('type')
    
    activities = CommunityActivity.objects.filter(is_public=True)
    
    if activity_type:
        activities = activities.filter(activity_type=activity_type)
    
    activities = activities.order_by('-created_at')[:limit]
    serializer = CommunityActivitySerializer(activities, many=True)
    return Response(serializer.data)
