import React from 'react';
import { useBroadcast } from '../../hooks/useBroadcast';
import BroadcastBlock from './broadcastBlock';
import styles from './broadcastList.module.css';

const BroadcastList = () => {
    const { broadcasts, loading } = useBroadcast();

    if (loading) {
        return <div className={styles.loading}>加载中...</div>;
    }

    if (broadcasts.length === 0) {
        return <div className={styles.empty}>暂无广播消息</div>;
    }

    return (
        <div className={styles.listContainer}>
            {broadcasts.map(broadcast => (
                <BroadcastBlock 
                    key={broadcast.id} 
                    broadcast={broadcast}
                />
            ))}
        </div>
    );
};

export default BroadcastList;  // 确保使用默认导出