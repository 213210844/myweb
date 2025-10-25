// 过滤广播
export const filterBroadcasts = (broadcasts, filter, searchTerm = '') => {
    let filtered = broadcasts;

    // 根据类型过滤
    if (filter !== 'all') {
        filtered = filtered.filter(broadcast => broadcast.type === filter);
    }

    // 根据搜索词过滤
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(broadcast =>
            broadcast.title.toLowerCase().includes(term) ||
            broadcast.content.toLowerCase().includes(term) ||
            broadcast.author.toLowerCase().includes(term)
        );
    }

    return filtered;
};

// 排序广播
export const sortBroadcasts = (broadcasts, sort) => {
    const sorted = [...broadcasts];
    
    switch (sort) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        case 'most_likes':
            return sorted.sort((a, b) => b.likes - a.likes);
        case 'most_views':
            return sorted.sort((a, b) => b.views - a.views);
        default:
            return sorted;
    }
};

// 格式化时间
export const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
};

// 验证广播数据
export const validateBroadcast = (broadcastData) => {
    const errors = [];
    
    if (!broadcastData.title?.trim()) {
        errors.push('标题不能为空');
    }
    
    if (!broadcastData.content?.trim()) {
        errors.push('内容不能为空');
    }
    
    if (broadcastData.title?.length > 100) {
        errors.push('标题不能超过100个字符');
    }
    
    if (broadcastData.content?.length > 1000) {
        errors.push('内容不能超过1000个字符');
    }
    
    return errors;
};
