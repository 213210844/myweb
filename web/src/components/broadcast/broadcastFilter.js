import React from 'react';
import { useBroadcast } from '../../hooks/useBroadcast'; // 修正路径
import styles from './broadcastFilter.module.css';

const BroadcastFilter = () => {
    const {
        filter,
        setFilter,
        sort,
        setSort,
        searchTerm,
        setSearchTerm
    } = useBroadcast();

    return (
        <div className={styles.filterContainer}>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="搜索广播..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.filterControls}>
                <div className={styles.filterGroup}>
                    <label>类型筛选:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="all">全部</option>
                        <option value="system">系统通知</option>
                        <option value="feature">功能更新</option>
                        <option value="event">活动预告</option>
                        <option value="security">安全提醒</option>
                        <option value="general">一般通知</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>排序方式:</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="newest">最新发布</option>
                        <option value="oldest">最早发布</option>
                        <option value="most_likes">最多点赞</option>
                        <option value="most_views">最多浏览</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default BroadcastFilter;
