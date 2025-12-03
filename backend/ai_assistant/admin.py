from django.contrib import admin
from .models import (
    Conversation, 
    ConversationSession, 
    AIFeedback,
    DeFiTerm,
    StrategyExplanation,
    AIConfiguration
)

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_id', 'role', 'created_at')
    list_filter = ('role', 'response_source', 'created_at')
    search_fields = ('message', 'session_id', 'user__username')
    readonly_fields = ('created_at',)
    list_per_page = 50

@admin.register(ConversationSession)
class ConversationSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'user', 'title', 'message_count', 'is_active', 'updated_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('session_id', 'title', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(AIFeedback)
class AIFeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'rating', 'response_helpful', 'created_at')
    list_filter = ('rating', 'response_helpful', 'created_at')
    search_fields = ('feedback_text', 'user__username')
    readonly_fields = ('created_at',)

@admin.register(DeFiTerm)
class DeFiTermAdmin(admin.ModelAdmin):
    list_display = ('term', 'category', 'popularity_score', 'last_updated')
    list_filter = ('category',)
    search_fields = ('term', 'short_definition', 'search_keywords')
    filter_horizontal = ('related_terms',)
    list_per_page = 50

@admin.register(StrategyExplanation)
class StrategyExplanationAdmin(admin.ModelAdmin):
    list_display = ('strategy', 'title', 'apy_range', 'risk_level', 'is_active', 'order')
    list_filter = ('strategy', 'is_active')
    search_fields = ('title', 'description')
    readonly_fields = ('last_updated',)

@admin.register(AIConfiguration)
class AIConfigurationAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'data_type', 'is_active', 'updated_at')
    list_filter = ('is_active', 'data_type')
    search_fields = ('key', 'description')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('value', 'is_active')