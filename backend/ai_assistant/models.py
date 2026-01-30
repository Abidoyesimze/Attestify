from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import json

class Conversation(models.Model):
    """Model to store AI assistant conversations"""
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='conversations',
        null=True,  
        blank=True
    )
    session_id = models.CharField(
        max_length=100, 
        db_index=True,
        help_text="Session ID for anonymous users"
    )
    message = models.TextField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional context like user_data, timestamps, etc."
    )
    model_used = models.CharField(
        max_length=50, 
        default='gemini-2.0-flash'
    )
    response_source = models.CharField(
        max_length=20,
        choices=[
            ('api', 'API Response'),
            ('fallback', 'Fallback Response'),
            ('cached', 'Cached Response')
        ],
        default='api'
    )
    tokens_used = models.IntegerField(
        default=0,
        help_text="Number of tokens used in this exchange"
    )
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['session_id', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.user or 'Anonymous'}: {self.message[:50]}..."
    
    @property
    def is_from_user(self):
        return self.role == 'user'
    
    @property
    def is_from_assistant(self):
        return self.role == 'assistant'

class ConversationSession(models.Model):
    """Model to group conversation messages into sessions"""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ai_sessions',
        null=True,
        blank=True
    )
    session_id = models.CharField(
        max_length=100,
        unique=True,
        db_index=True
    )
    title = models.CharField(
        max_length=200,
        blank=True,
        help_text="Auto-generated title for the conversation"
    )
    user_context = models.JSONField(
        default=dict,
        blank=True,
        help_text="User data/context for this session"
    )
    total_tokens = models.IntegerField(default=0)
    message_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Session: {self.title or self.session_id[:20]}"
    
    def get_conversation_history(self, limit=20):
        """Get recent messages for this session"""
        return self.conversations.order_by('created_at')[:limit]
    
    def add_message(self, role, message, metadata=None, model_used=None, source='api'):
        """Add a message to this session"""
        conv = Conversation.objects.create(
            user=self.user,
            session_id=self.session_id,
            role=role,
            message=message,
            metadata=metadata or {},
            model_used=model_used or 'gemini-2.0-flash',
            response_source=source
        )
        self.message_count += 1
        self.save()
        return conv

class AIFeedback(models.Model):
    """Model to store user feedback on AI responses"""
    
    RATING_CHOICES = [
        (1, 'Very Poor'),
        (2, 'Poor'),
        (3, 'Neutral'),
        (4, 'Good'),
        (5, 'Excellent'),
    ]
    
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='feedbacks',
        null=True,
        blank=True
    )
    session = models.ForeignKey(
        ConversationSession,
        on_delete=models.CASCADE,
        related_name='feedbacks',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    rating = models.IntegerField(choices=RATING_CHOICES)
    feedback_text = models.TextField(blank=True)
    response_helpful = models.BooleanField(
        null=True,
        blank=True,
        help_text="Was the response helpful?"
    )
    suggested_improvement = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback: {self.get_rating_display()}"

class DeFiTerm(models.Model):
    """Model to store DeFi terms and their explanations"""
    
    term = models.CharField(max_length=100, unique=True, db_index=True)
    short_definition = models.CharField(max_length=200)
    detailed_explanation = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=[
            ('basic', 'Basic'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('strategy', 'Strategy'),
            ('security', 'Security'),
            ('platform', 'Platform Specific')
        ],
        default='basic'
    )
    related_terms = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=True
    )
    search_keywords = models.TextField(
        blank=True,
        help_text="Comma-separated keywords for search"
    )
    usage_examples = models.TextField(
        blank=True,
        help_text="JSON array of usage examples"
    )
    popularity_score = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['term']
    
    def __str__(self):
        return self.term
    
    def increment_popularity(self):
        self.popularity_score += 1
        self.save()
    
    def get_usage_examples(self):
        """Parse usage examples JSON"""
        try:
            return json.loads(self.usage_examples) if self.usage_examples else []
        except json.JSONDecodeError:
            return []
    
    def get_keywords_list(self):
        """Parse search keywords"""
        return [kw.strip() for kw in self.search_keywords.split(',') if kw.strip()]

class StrategyExplanation(models.Model):
    """Model to store detailed strategy explanations"""
    
    STRATEGY_CHOICES = [
        ('conservative', 'Conservative Strategy'),
        ('balanced', 'Balanced Strategy'),
        ('growth', 'Growth Strategy'),
    ]
    
    strategy = models.CharField(max_length=20, choices=STRATEGY_CHOICES, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    apy_range = models.CharField(max_length=50)
    risk_level = models.CharField(max_length=20)
    
    # Detailed sections
    how_it_works = models.TextField()
    ideal_users = models.TextField()
    pros = models.TextField(help_text="JSON array of advantages")
    cons = models.TextField(help_text="JSON array of disadvantages")
    
    recommended_minimum = models.CharField(
        max_length=50,
        blank=True,
        help_text="e.g., '10 cUSD'"
    )
    recommended_duration = models.CharField(
        max_length=100,
        blank=True,
        help_text="e.g., '3-6 months'"
    )
    
    # Performance metrics
    historical_performance = models.JSONField(
        default=dict,
        blank=True,
        help_text="Historical APY data"
    )
    
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order']
        verbose_name_plural = "Strategy explanations"
    
    def __str__(self):
        return self.title
    
    def get_pros_list(self):
        try:
            return json.loads(self.pros)
        except json.JSONDecodeError:
            return []
    
    def get_cons_list(self):
        try:
            return json.loads(self.cons)
        except json.JSONDecodeError:
            return []

class AIConfiguration(models.Model):
    """Model to store AI service configuration"""
    
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    data_type = models.CharField(
        max_length=20,
        choices=[
            ('string', 'String'),
            ('integer', 'Integer'),
            ('float', 'Float'),
            ('boolean', 'Boolean'),
            ('json', 'JSON'),
        ],
        default='string'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['key']
        verbose_name_plural = "AI Configurations"
    
    def __str__(self):
        return self.key
    
    def get_value(self):
        """Get typed value based on data_type"""
        if self.data_type == 'integer':
            return int(self.value)
        elif self.data_type == 'float':
            return float(self.value)
        elif self.data_type == 'boolean':
            return self.value.lower() in ('true', 'yes', '1')
        elif self.data_type == 'json':
            try:
                return json.loads(self.value)
            except json.JSONDecodeError:
                return {}
        else:
            return self.value
        

class Message(models.Model):
    """Individual message in a conversation"""
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]
    
    conversation = models.ForeignKey(
        ConversationSession,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    model_used = models.CharField(max_length=50, default='gemini-2.0-flash-exp')
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."