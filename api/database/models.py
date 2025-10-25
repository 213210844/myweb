from django.db import models
from django.contrib.auth.models import User

class Broadcast(models.Model):
    PRIORITY_CHOICES = [
        ('low', '低'),
        ('medium', '中'),
        ('high', '高'),
    ]
    
    TYPE_CHOICES = [
        ('system', '系统通知'),
        ('feature', '功能更新'),
        ('event', '活动预告'),
        ('security', '安全提醒'),
        ('general', '一般通知'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='标题')
    content = models.TextField(verbose_name='内容')
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='作者')
    broadcast_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='general', verbose_name='类型')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium', verbose_name='优先级')
    tags = models.JSONField(default=list, blank=True, verbose_name='标签')
    is_published = models.BooleanField(default=True, verbose_name='是否发布')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    # 统计字段
    views_count = models.PositiveIntegerField(default=0, verbose_name='浏览数')
    likes_count = models.PositiveIntegerField(default=0, verbose_name='点赞数')
    comments_count = models.PositiveIntegerField(default=0, verbose_name='评论数')
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = '广播'
        verbose_name_plural = '广播'
    
    def __str__(self):
        return self.title

class BroadcastLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户')
    broadcast = models.ForeignKey(Broadcast, on_delete=models.CASCADE, verbose_name='广播')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='点赞时间')
    
    class Meta:
        unique_together = ['user', 'broadcast']
        verbose_name = '广播点赞'
        verbose_name_plural = '广播点赞'

class BroadcastComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户')
    broadcast = models.ForeignKey(Broadcast, on_delete=models.CASCADE, verbose_name='广播')
    content = models.TextField(verbose_name='评论内容')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='评论时间')
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, verbose_name='父评论')
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = '广播评论'
        verbose_name_plural = '广播评论'

class UserBroadcastView(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户')
    broadcast = models.ForeignKey(Broadcast, on_delete=models.CASCADE, verbose_name='广播')
    viewed_at = models.DateTimeField(auto_now_add=True, verbose_name='浏览时间')
    
    class Meta:
        unique_together = ['user', 'broadcast']
        verbose_name = '用户浏览记录'
        verbose_name_plural = '用户浏览记录'
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='用户')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name='头像')
    bio = models.TextField(max_length=500, blank=True, verbose_name='个人简介')
    location = models.CharField(max_length=100, blank=True, verbose_name='位置')
    website = models.URLField(blank=True, verbose_name='网站')
    
    # 统计信息
    total_broadcasts = models.PositiveIntegerField(default=0, verbose_name='发布广播数')
    total_likes_received = models.PositiveIntegerField(default=0, verbose_name='收到点赞数')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        verbose_name = '用户资料'
        verbose_name_plural = '用户资料'
    
    def __str__(self):
        return f"{self.user.username}的资料"