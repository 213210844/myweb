from rest_framework import serializers
from .models import User, Broadcast

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'MechatID', 'email', 'date_joined']

class BroadcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Broadcast
        fields = ['id', 'time', 'content']