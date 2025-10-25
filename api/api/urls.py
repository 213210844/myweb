from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views as auth_views
from database import views

router = routers.DefaultRouter()
router.register(r'broadcasts', views.BroadcastViewSet, basename='broadcast')
router.register(r'comments', views.CommentViewSet, basename='comment')
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'profiles', views.UserProfileViewSet, basename='profile')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
    path('api/token-auth/', auth_views.obtain_auth_token),
]