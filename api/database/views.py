from rest_framework import viewsets, status, permissions, serializers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from django.db.models import Q, Count
from django.contrib.auth.models import User
from django.db import IntegrityError
from .models import Broadcast, BroadcastLike, BroadcastComment, UserProfile, UserBroadcastView

# 简单序列化器
class SimpleBroadcastSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    has_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Broadcast
        fields = ['id', 'title', 'content', 'author', 'broadcast_type', 'priority', 
                 'tags', 'is_published', 'created_at', 'updated_at',
                 'views_count', 'likes_count', 'comments_count', 'has_liked']
        read_only_fields = ['author', 'created_at', 'updated_at', 
                          'views_count', 'likes_count', 'comments_count']
    
    def get_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BroadcastLike.objects.filter(
                user=request.user, broadcast=obj
            ).exists()
        return False
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # 处理tags字段
        try:
            import json
            data['tags'] = json.loads(instance.tags)
        except:
            data['tags'] = []
        return data
    
    def to_internal_value(self, data):
        # 处理tags字段的输入
        tags = data.get('tags', [])
        if isinstance(tags, list):
            import json
            data['tags'] = json.dumps(tags)
        return super().to_internal_value(data)

class BroadcastViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Broadcast.objects.filter(is_published=True)
    serializer_class = SimpleBroadcastSerializer
    
    def get_queryset(self):
        queryset = Broadcast.objects.filter(is_published=True)
        
        # 筛选功能
        broadcast_type = self.request.query_params.get('type')
        if broadcast_type:
            queryset = queryset.filter(broadcast_type=broadcast_type)
            
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
            
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search)
            )
            
        # 排序功能
        sort = self.request.query_params.get('sort', 'newest')
        if sort == 'oldest':
            queryset = queryset.order_by('created_at')
        elif sort == 'most_likes':
            queryset = queryset.order_by('-likes_count')
        elif sort == 'most_views':
            queryset = queryset.order_by('-views_count')
        else:  # newest
            queryset = queryset.order_by('-created_at')
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # 记录用户浏览
        if request.user.is_authenticated:
            UserBroadcastView.objects.get_or_create(
                user=request.user,
                broadcast=instance
            )
            # 更新浏览计数
            instance.views_count = UserBroadcastView.objects.filter(broadcast=instance).count()
            instance.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        broadcast = self.get_object()
        like, created = BroadcastLike.objects.get_or_create(
            user=request.user,
            broadcast=broadcast
        )
        
        if not created:
            like.delete()
            broadcast.likes_count = BroadcastLike.objects.filter(broadcast=broadcast).count()
            broadcast.save()
            return Response({'status': 'unliked', 'likes_count': broadcast.likes_count})
        
        broadcast.likes_count = BroadcastLike.objects.filter(broadcast=broadcast).count()
        broadcast.save()
        return Response({'status': 'liked', 'likes_count': broadcast.likes_count})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, pk=None):
        broadcast = self.get_object()
        content = request.data.get('content', '').strip()
        
        if not content:
            return Response(
                {'error': '评论内容不能为空'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 创建评论
        comment = BroadcastComment.objects.create(
            user=request.user,
            broadcast=broadcast,
            content=content
        )
        
        # 更新评论计数
        broadcast.comments_count = BroadcastComment.objects.filter(broadcast=broadcast).count()
        broadcast.save()
        
        return Response({
            'id': comment.id,
            'content': comment.content,
            'user': {'username': request.user.username},
            'created_at': comment.created_at
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = {
            'total_broadcasts': Broadcast.objects.filter(is_published=True).count(),
            'total_views': UserBroadcastView.objects.count(),
            'total_likes': BroadcastLike.objects.count(),
            'total_comments': BroadcastComment.objects.count(),
            'by_type': list(Broadcast.objects.filter(is_published=True)
                .values('broadcast_type')
                .annotate(count=Count('id'))),
            'by_priority': list(Broadcast.objects.filter(is_published=True)
                .values('priority')
                .annotate(count=Count('id')))
        }
        return Response(stats)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    用户注册
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    
    # 验证输入
    if not username or not password:
        return Response(
            {'error': '用户名和密码是必填项'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(password) < 6:
        return Response(
            {'error': '密码至少需要6位'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(username) < 3:
        return Response(
            {'error': '用户名至少需要3位'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # 创建用户
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        
        # 创建用户资料
        UserProfile.objects.create(user=user)
        
        return Response({
            'message': '用户注册成功',
            'user': {
                'id': user.id,
                'username': user.username
            }
        }, status=status.HTTP_201_CREATED)
        
    except IntegrityError:
        return Response(
            {'error': '用户名已存在'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'注册失败: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )