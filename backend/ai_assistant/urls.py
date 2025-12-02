from django.urls import path
from . import views

app_name = 'ai_assistant'

urlpatterns = [
    path('chat/', views.chat, name='chat'),
    path('conversations/', views.user_conversations, name='user_conversations'),
    path('conversations/<str:session_id>/', views.conversation_history, name='conversation_history'),
    path('conversations/<str:session_id>/delete/', views.delete_conversation, name='delete_conversation'),
    path('explain/', views.explain_term, name='explain_term'),
    path('strategies/', views.strategy_comparison, name='strategy_comparison'),
]
