from django.contrib import admin
from .models import Broadcast, BroadcastLike, BroadcastComment, UserProfile, UserBroadcastView

@admin.register(Broadcast)
class BroadcastAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'broadcast_type', 'priority', 'is_published', 'created_at']
    list_filter = ['broadcast_type', 'priority', 'is_published', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['views_count', 'likes_count', 'comments_count']

@admin.register(BroadcastComment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'broadcast', 'content_short', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'user__username']
    
    def content_short(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_short.short_description = '内容'

@admin.register(BroadcastLike)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'broadcast', 'created_at']
    list_filter = ['created_at']

@admin.register(UserBroadcastView)
class ViewAdmin(admin.ModelAdmin):
    list_display = ['user', 'broadcast', 'viewed_at']
    list_filter = ['viewed_at']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'location', 'total_broadcasts', 'total_likes_received']
    search_fields = ['user__username', 'location']