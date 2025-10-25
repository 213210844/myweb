import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // 修复路径
import { useBroadcast } from '../../hooks/useBroadcast'; // 修复路径
import styles from './broadcastBlock.module.css';

const BroadcastBlock = ({ broadcast }) => {
  const { user } = useAuth();
  const { likeBroadcast, deleteBroadcast } = useBroadcast();

  const handleLike = async () => {
    await likeBroadcast(broadcast.id);
  };

  const handleDelete = async () => {
    if (window.confirm('确定要删除这条广播吗？')) {
      await deleteBroadcast(broadcast.id);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return styles.priorityHigh;
      case 'medium': return styles.priorityMedium;
      case 'low': return styles.priorityLow;
      default: return styles.priorityMedium;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <div className={styles.broadcastBlock}>
      <div className={styles.broadcastHeader}>
        <h3 className={styles.broadcastTitle}>{broadcast.title}</h3>
        <span className={`${styles.priorityBadge} ${getPriorityClass(broadcast.priority)}`}>
          {broadcast.priority === 'high' ? '高' : 
           broadcast.priority === 'medium' ? '中' : '低'}
        </span>
      </div>

      <div className={styles.broadcastMeta}>
        <span className={styles.author}>{broadcast.author?.username || '未知用户'}</span>
        <span className={styles.timestamp}>{formatTime(broadcast.created_at)}</span>
        <span className={styles.typeTag}>{broadcast.broadcast_type}</span>
      </div>

      <div className={styles.broadcastContent}>
        {broadcast.content}
      </div>

      {broadcast.tags && broadcast.tags.length > 0 && (
        <div className={styles.broadcastTags}>
          {broadcast.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}

      <div className={styles.broadcastActions}>
        <div className={styles.actionButtons}>
          <button 
            onClick={handleLike}
            className={`${styles.actionButton} ${styles.likeButton} ${
              broadcast.has_liked ? styles.liked : ''
            }`}
          >
            ❤️ {broadcast.likes_count}
          </button>
          
          {user?.id === broadcast.author?.id && (
            <button 
              onClick={handleDelete}
              className={styles.actionButton}
            >
              删除
            </button>
          )}
        </div>

        <div className={styles.broadcastStats}>
          <span className={styles.stat}>👁️ {broadcast.views_count}</span>
          <span className={styles.stat}>💬 {broadcast.comments_count}</span>
        </div>
      </div>
    </div>
  );
};

export default BroadcastBlock;