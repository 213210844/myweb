export const mockBroadcasts = [
    {
        id: '1',
        title: '系统维护通知',
        content: '本周六凌晨2:00-4:00将进行系统维护，届时服务将短暂不可用。',
        type: 'system',
        author: '系统管理员',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
        priority: 'high',
        likes: 5,
        comments: 2,
        views: 150,
        tags: ['维护', '系统']
    },
    {
        id: '2',
        title: '新功能上线',
        content: '我们很高兴地宣布，实时聊天功能已经上线！快来体验吧。',
        type: 'feature',
        author: '产品团队',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
        priority: 'medium',
        likes: 23,
        comments: 8,
        views: 320,
        tags: ['新功能', '更新']
    },
    {
        id: '3',
        title: '社区活动预告',
        content: '下周六将举办线上技术分享会，主题是"React最佳实践"。',
        type: 'event',
        author: '社区经理',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1天前
        priority: 'low',
        likes: 15,
        comments: 5,
        views: 280,
        tags: ['活动', '技术分享']
    },
    {
        id: '4',
        title: '安全更新提醒',
        content: '请尽快更新到最新版本，修复了一个重要的安全漏洞。',
        type: 'security',
        author: '安全团队',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6小时前
        priority: 'high',
        likes: 8,
        comments: 3,
        views: 420,
        tags: ['安全', '更新']
    },
];
