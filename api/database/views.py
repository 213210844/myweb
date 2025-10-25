from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.db.models import Q, Count
from django.contrib.auth.models import User
from .models import Broadcast, BroadcastLike, BroadcastComment, UserProfile, UserBroadcastView
from .serializers import (
    BroadcastSerializer, BroadcastDetailSerializer, BroadcastCreateSerializer,
    CommentSerializer, UserSerializer, UserProfileSerializer,
    BroadcastLikeSerializer
)

class BroadcastViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return BroadcastCreateSerializer
        elif self.action == 'retrieve':
            return BroadcastDetailSerializer
        return BroadcastSerializer
    
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
                Q(content__icontains=search) |
                Q(tags__contains=[search])
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
        serializer = CommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user, broadcast=broadcast)
            # 更新评论计数
            broadcast.comments_count = BroadcastComment.objects.filter(broadcast=broadcast).count()
            broadcast.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BroadcastComment.objects.filter(parent_comment__isnull=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)