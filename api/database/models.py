from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    name = models.CharField(max_length=100, default="", blank=False)
    MechatID = models.CharField(max_length=100, default="", blank=True)
    
    def __str__(self):
        return self.name

class Broadcast(models.Model):
    time = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=200, default="", blank=False)
    
    def __str__(self):
        return f"Broadcast at {self.time}: {self.content[:20]}..."