from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Broadcast
from .serializers import UserSerializer, BroadcastSerializer

@api_view(['GET'])
def api_overview(request):
    """API 概览"""
    api_urls = {
        '用户列表': '/api/users/',
        '创建用户': '/api/users/create/',
        '广播列表': '/api/broadcasts/',
        '创建广播': '/api/broadcasts/create/',
    }
    return Response(api_urls)

# 用户相关操作
@api_view(['GET'])
def user_list(request):
    """获取所有用户"""
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def user_create(request):
    """创建新用户"""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_detail(request, user_id):
    """获取用户详情"""
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)

# 广播相关操作
@api_view(['GET'])
def broadcast_list(request):
    """获取所有广播"""
    broadcasts = Broadcast.objects.all().order_by('-time')
    serializer = BroadcastSerializer(broadcasts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def broadcast_create(request):
    """创建新广播"""
    serializer = BroadcastSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)