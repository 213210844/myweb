import React from 'react';
import { useBroadcast } from '../../hooks/useBroadcast';
import { formatTime } from '../../utils/broadcastUtils';
import styles from './broadcastBlock.module.css';

const BroadcastBlock = ({ broadcast }) => {
    const { likeBroadcast, deleteBroadcast } = useBroadcast();

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return styles.highPriority;
            case 'medium': return styles.mediumPriority;
            case 'low': return styles.lowPriority;
            default: return styles.mediumPriority;
        }
    };

    const getTypeClass = (type) => {
        switch (type) {
            case 'system': return styles.systemType;
            case 'feature': return styles.featureType;
            case 'event': return styles.eventType;
            case 'security': return styles.securityType;
            default: return styles.generalType;
        }
    };

    return (
        <div className={`${styles.broadcastBlock} ${getPriorityClass(broadcast.priority)}`}>
            <div className={styles.broadcastHeader}>
                <div className={styles.broadcastMeta}>
                    <span className={`${styles.typeBadge} ${getTypeClass(broadcast.type)}`}>
                        {broadcast.type === 'system' ? '系统' : 
                         broadcast.type === 'feature' ? '功能' :
                         broadcast.type === 'event' ? '活动' :
                         broadcast.type === 'security' ? '安全' : '一般'}
                    </span>
                    <span className={styles.author}>{broadcast.author}</span>
                    <span className={styles.time}>{formatTime(broadcast.timestamp)}</span>
                </div>
                {broadcast.priority === 'high' && (
                    <span className={styles.urgentBadge}>紧急</span>
                )}
            </div>

            <h3 className={styles.broadcastTitle}>{broadcast.title}</h3>
            <p className={styles.broadcastContent}>{broadcast.content}</p>

            {broadcast.tags && broadcast.tags.length > 0 && (
                <div className={styles.tags}>
                    {broadcast.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>#{tag}</span>
                    ))}
                </div>
            )}

            <div className={styles.broadcastFooter}>
                <div className={styles.actions}>
                    <button 
                        onClick={() => likeBroadcast(broadcast.id)}
                        className={styles.actionButton}
                    >
                        👍 {broadcast.likes}
                    </button>
                    <button className={styles.actionButton}>
                        💬 {broadcast.comments}
                    </button>
                    <button className={styles.actionButton}>
                        👁️ {broadcast.views}
                    </button>
                </div>
                <div className={styles.manageActions}>
                    <button 
                        onClick={() => deleteBroadcast(broadcast.id)}
                        className={styles.deleteButton}
                    >
                        删除
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BroadcastBlock;  // 确保使用默认导出