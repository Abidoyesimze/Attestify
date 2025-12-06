from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Conversation, ConversationSession
from .services import AIAssistantService
from .serializers import MessageSerializer, ConversationSerializer
import uuid

ai_service = AIAssistantService()


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow wallet-based access
def chat(request):
    """
    Main chat endpoint for AI assistant
    Supports both authenticated users and wallet-based access
    
    POST /api/ai_assistant/chat/
    {
        "message": "What's the best strategy for me?",
        "session_id": "optional-session-id",
        "wallet_address": "optional-wallet-address" (from header X-Wallet-Address)
    }
    """
    # Get wallet address from header or request data
    wallet_address = request.headers.get('X-Wallet-Address') or request.data.get('wallet_address')
    
    # For authenticated users, use the user object
    # For wallet-based access, use wallet address as identifier
    user = request.user if request.user.is_authenticated else None
    user_message = request.data.get('message', '').strip()
    session_id = request.data.get('session_id')
    
    if not user_message:
        return Response(
            {'error': 'Message cannot be empty'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get or create conversation session
    # For wallet-based access, use wallet address in session metadata
    if session_id:
        try:
            if user:
                session = get_object_or_404(
                    ConversationSession, 
                    session_id=session_id, 
                    user=user
                )
            else:
                # For wallet-based access, find session by session_id and wallet in metadata
                session = ConversationSession.objects.filter(
                    session_id=session_id,
                    user__isnull=True,
                    user_context__wallet_address=wallet_address
                ).first()
                if not session:
                    return Response(
                        {'error': 'Session not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
        except:
            return Response(
                {'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        session_id = str(uuid.uuid4())
        session = ConversationSession.objects.create(
            user=user,  # Can be None for wallet-based access
            session_id=session_id,
            user_context={'wallet_address': wallet_address} if wallet_address else {}
        )
    
    # Save user message
    Conversation.objects.create(
        user=user,  # Can be None for wallet-based access
        session_id=session_id,
        message=user_message,
        role='user',
        metadata={'wallet_address': wallet_address} if wallet_address else {}
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
    # For wallet-based access, we'll use data from request if provided
    user_data = {
        'is_new_user': True,  # Default for wallet-based access
    }
    
    # If authenticated user, get data from user model
    if user:
        user_data['is_new_user'] = not hasattr(user, 'deposits') or not user.deposits.exists()
        
        if hasattr(user, 'balances'):
            latest_balance = user.balances.first()
            if latest_balance:
                user_data.update({
                    'balance': float(latest_balance.current_balance),
                    'total_deposited': float(latest_balance.total_deposited),
                    'total_earned': float(latest_balance.total_earned),
                })
        
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
        user=user,  # Can be None for wallet-based access
        session_id=session_id,
        message=ai_response['message'],
        role='assistant',
        metadata={
            'source': ai_response.get('source', 'api'),
            'error': ai_response.get('error'),
            'wallet_address': wallet_address
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