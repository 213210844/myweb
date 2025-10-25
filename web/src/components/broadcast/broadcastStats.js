import React from 'react';
import { useBroadcast } from '../../hooks/useBroadcast';
import styles from './broadcastStats.module.css';

const BroadcastStats = () => {
    const { broadcasts } = useBroadcast();

    const stats = {
        total: broadcasts.length,
        system: broadcasts.filter(b => b.type === 'system').length,
        feature: broadcasts.filter(b => b.type === 'feature').length,
        event: broadcasts.filter(b => b.type === 'event').length,
        security: broadcasts.filter(b => b.type === 'security').length,
        totalLikes: broadcasts.reduce((sum, b) => sum + b.likes, 0),
        totalViews: broadcasts.reduce((sum, b) => sum + b.views, 0)
    };

    return (
        <div className={styles.statsContainer}>
            <h4>广播统计</h4>
            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>{stats.total}</span>
                    <span className={styles.statLabel}>总广播数</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>{stats.system}</span>
                    <span className={styles.statLabel}>系统通知</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>{stats.feature}</span>
                    <span className={styles.statLabel}>功能更新</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>{stats.totalLikes}</span>
                    <span className={styles.statLabel}>总点赞数</span>
                </div>
            </div>
        </div>
    );
};

export default BroadcastStats;
