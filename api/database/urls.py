from django.urls import path
from . import views

urlpatterns = [
    # 用户相关URL
    path('users/', views.user_list, name='user-list'),
    path('users/create/', views.user_create, name='user-create'),
    path('users/<int:user_id>/', views.user_detail, name='user-detail'),
    
    # 广播相关URL
    path('broadcasts/', views.broadcast_list, name='broadcast-list'),
    path('broadcasts/create/', views.broadcast_create, name='broadcast-create'),
    
    # API概览
    path('', views.api_overview, name='api-overview'),
]