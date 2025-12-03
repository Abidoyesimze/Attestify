from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Conversation, ConversationSession
from .services import AIAssistantService
from .serializers import MessageSerializer, ConversationSerializer
import uuid

ai_service = AIAssistantService()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat(request):
    """
    Main chat endpoint for AI assistant
    
    POST /api/ai/chat/
    {
        "message": "What's the best strategy for me?",
        "session_id": "optional-session-id"
    }
    """
    user = request.user
    user_message = request.data.get('message', '').strip()
    session_id = request.data.get('session_id')
    
    if not user_message:
        return Response(
            {'error': 'Message cannot be empty'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get or create conversation session
    if session_id:
        session = get_object_or_404(
            ConversationSession, 
            session_id=session_id, 
            user=user
        )
    else:
        session_id = str(uuid.uuid4())
        session = ConversationSession.objects.create(
            user=user,
            session_id=session_id
        )
    
    # Save user message
    Conversation.objects.create(
        user=user,
        session_id=session_id,
        message=user_message,
        role='user',
        metadata={}
    )
    
    # Get conversation history (last 10 messages for context)
    recent_messages = Conversation.objects.filter(
        session_id=session_id
    ).order_by('-created_at')[:10]
    
    # Format messages for API (reverse to chronological order)
    messages_for_api = []
    for msg in reversed(recent_messages):
        messages_for_api.append({
            'role': msg.role,
            'content': msg.message
        })
    
    # Get user context data
    user_data = {
        'is_new_user': not hasattr(user, 'deposits') or not user.deposits.exists(),
    }
    
    # Get latest balance if exists
    if hasattr(user, 'balances'):
        latest_balance = user.balances.first()
        if latest_balance:
            user_data.update({
                'balance': float(latest_balance.current_balance),
                'total_deposited': float(latest_balance.total_deposited),
                'total_earned': float(latest_balance.total_earned),
            })
    
    # Get current strategy from latest deposit
    if hasattr(user, 'deposits'):
        latest_deposit = user.deposits.filter(
            transaction_type='deposit',
            strategy__isnull=False
        ).first()
        if latest_deposit:
            user_data['current_strategy'] = latest_deposit.strategy.name
    
    # Get AI response
    ai_response = ai_service.get_response(messages_for_api, user_data)
    
    # Save assistant message
    assistant_message = Conversation.objects.create(
        user=user,
        session_id=session_id,
        message=ai_response['message'],
        role='assistant',
        metadata={
            'source': ai_response.get('source', 'api'),
            'error': ai_response.get('error')
        },
        response_source=ai_response.get('source', 'api')
    )
    
    # Update session
    session.message_count = Conversation.objects.filter(session_id=session_id).count()
    session.save()
    
    return Response({
        'session_id': session_id,
        'message': ai_response['message'],
        'source': ai_response.get('source', 'api'),
        'timestamp': assistant_message.created_at.isoformat()
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_history(request, session_id):
    """
    Get conversation history
    
    GET /api/ai/conversations/<session_id>/
    """
    session = get_object_or_404(
        ConversationSession,
        session_id=session_id,
        user=request.user
    )
    
    messages = Conversation.objects.filter(session_id=session_id).order_by('created_at')
    serializer = MessageSerializer(messages, many=True)
    
    return Response({
        'session_id': session_id,
        'title': session.title,
        'messages': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_conversations(request):
    """
    Get all user conversations
    
    GET /api/ai/conversations/
    """
    sessions = ConversationSession.objects.filter(user=request.user)
    serializer = ConversationSerializer(sessions, many=True)
    
    return Response({
        'conversations': serializer.data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_conversation(request, session_id):
    """
    Delete a conversation
    
    DELETE /api/ai/conversations/<session_id>/
    """
    session = get_object_or_404(
        ConversationSession,
        session_id=session_id,
        user=request.user
    )
    
    # Delete all messages in this session
    Conversation.objects.filter(session_id=session_id).delete()
    
    # Delete the session
    session.delete()
    
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def explain_term(request):
    """
    Explain a DeFi term
    
    GET /api/ai/explain/?term=apy
    """
    term = request.query_params.get('term', '')
    
    if not term:
        return Response(
            {'error': 'Term parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    explanation = ai_service.explain_term(term)
    
    return Response({
        'term': term,
        'explanation': explanation
    })


@api_view(['GET'])
def strategy_comparison(request):
    """
    Get strategy comparison
    
    GET /api/ai/strategies/
    """
    comparison = ai_service.compare_strategies()
    
    return Response({
        'comparison': comparison,
        'strategies': {
            'conservative': {
                'apy_range': '3-5%',
                'risk': 'Low',
                'best_for': 'Beginners, emergency funds, short-term savings'
            },
            'balanced': {
                'apy_range': '5-10%',
                'risk': 'Medium',
                'best_for': 'Regular savers, medium-term goals'
            },
            'growth': {
                'apy_range': '10-15%',
                'risk': 'High',
                'best_for': 'Experienced users, long-term growth'
            }
        }
    })