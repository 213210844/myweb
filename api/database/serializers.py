from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Broadcast, BroadcastLike, BroadcastComment, UserProfile, UserBroadcastView

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'avatar', 'bio', 'location', 'website', 
                 'total_broadcasts', 'total_likes_received', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    reply_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BroadcastComment
        fields = ['id', 'user', 'content', 'created_at', 'parent_comment', 'reply_count']
        read_only_fields = ['user', 'created_at']
    
    def get_reply_count(self, obj):
        return BroadcastComment.objects.filter(parent_comment=obj).count()

class BroadcastSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    views_count = serializers.IntegerField(read_only=True)
    has_liked = serializers.SerializerMethodField()
    time_since = serializers.SerializerMethodField()
    
    class Meta:
        model = Broadcast
        fields = [
            'id', 'title', 'content', 'author', 'broadcast_type', 'priority',
            'tags', 'is_published', 'created_at', 'updated_at',
            'likes_count', 'comments_count', 'views_count', 'has_liked', 'time_since'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at', 
                          'likes_count', 'comments_count', 'views_count']
    
    def get_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BroadcastLike.objects.filter(
                user=request.user, broadcast=obj
            ).exists()
        return False
    
    def get_time_since(self, obj):
        from django.utils import timezone
        from django.utils.timesince import timesince
        
        return timesince(obj.created_at, timezone.now())

class BroadcastDetailSerializer(BroadcastSerializer):
    comments = serializers.SerializerMethodField()
    
    class Meta(BroadcastSerializer.Meta):
        fields = BroadcastSerializer.Meta.fields + ['comments']
    
    def get_comments(self, obj):
        comments = BroadcastComment.objects.filter(
            broadcast=obj, parent_comment__isnull=True
        ).order_by('-created_at')[:10]  # 只获取前10条顶级评论
        return CommentSerializer(comments, many=True).data

class BroadcastCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Broadcast
        fields = ['title', 'content', 'broadcast_type', 'priority', 'tags']
    
    def validate_title(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("标题至少需要2个字符")
        if len(value) > 200:
            raise serializers.ValidationError("标题不能超过200个字符")
        return value
    
    def validate_content(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("内容至少需要10个字符")
        if len(value) > 5000:
            raise serializers.ValidationError("内容不能超过5000个字符")
        return value

class BroadcastLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BroadcastLike
        fields = ['id', 'user', 'broadcast', 'created_at']
        read_only_fields = ['user', 'created_at']

class UserBroadcastViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBroadcastView
        fields = ['id', 'user', 'broadcast', 'viewed_at']
        read_only_fields = ['user', 'viewed_at']