from django.urls import path
from . import views

app_name = 'attestify'

urlpatterns = [
    # Goal-based savings
    path('goals/', views.goals_list_create, name='goals-list-create'),
    path('goals/<int:goal_id>/', views.goal_detail, name='goal-detail'),
    path('goals/<int:goal_id>/progress/', views.update_goal_progress, name='goal-progress'),
    
    # Referral system
    path('referrals/program/', views.referral_program_info, name='referral-program'),
    path('referrals/', views.referrals_list_create, name='referrals-list-create'),
    path('referrals/use/', views.use_referral_code, name='use-referral-code'),
    path('referrals/stats/', views.referral_stats, name='referral-stats'),
    
    # Notifications
    path('notifications/', views.notifications_list, name='notifications-list'),
    path('notifications/unread-count/', views.notifications_unread_count, name='notifications-unread-count'),
    path('notifications/<int:notification_id>/read/', views.notification_mark_read, name='notification-mark-read'),
    path('notifications/mark-all-read/', views.notifications_mark_all_read, name='notifications-mark-all-read'),
    path('notifications/preferences/', views.notification_preferences, name='notification-preferences'),
    
    # Social features
    path('profile/', views.user_profile, name='user-profile'),
    path('achievements/', views.achievements_list, name='achievements-list'),
    path('community/feed/', views.community_feed, name='community-feed'),
]

