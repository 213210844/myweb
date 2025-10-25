import { useState, useEffect } from 'react';
import { broadcastAPI } from '../services/api';

export const useBroadcast = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    sort: 'newest',
    search: '',
  });

  // 获取广播列表
  const fetchBroadcasts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      if (filters.type !== 'all') {
        params.type = filters.type;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      params.sort = filters.sort;
      
      const response = await broadcastAPI.getBroadcasts(params);
      setBroadcasts(response.data.results || response.data);
    } catch (err) {
      setError('获取广播列表失败');
      console.error('Error fetching broadcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 创建新广播
  const createBroadcast = async (broadcastData) => {
    try {
      const response = await broadcastAPI.createBroadcast(broadcastData);
      setBroadcasts(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data || { non_field_errors: ['创建失败'] };
      return { success: false, error: errorMsg };
    }
  };

  // 点赞广播
  const likeBroadcast = async (broadcastId) => {
    try {
      const response = await broadcastAPI.likeBroadcast(broadcastId);
      
      // 更新本地状态
      setBroadcasts(prev => 
        prev.map(broadcast => 
          broadcast.id === broadcastId 
            ? { ...broadcast, likes_count: response.data.likes_count, has_liked: !broadcast.has_liked }
            : broadcast
        )
      );
      
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: '点赞失败' };
    }
  };

  // 添加评论
  const addComment = async (broadcastId, commentData) => {
    try {
      const response = await broadcastAPI.addComment(broadcastId, commentData);
      
      // 更新评论计数
      setBroadcasts(prev =>
        prev.map(broadcast =>
          broadcast.id === broadcastId
            ? { ...broadcast, comments_count: broadcast.comments_count + 1 }
            : broadcast
        )
      );
      
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: '评论失败' };
    }
  };

  // 删除广播
  const deleteBroadcast = async (broadcastId) => {
    try {
      await broadcastAPI.deleteBroadcast(broadcastId);
      setBroadcasts(prev => prev.filter(broadcast => broadcast.id !== broadcastId));
      return { success: true };
    } catch (err) {
      return { success: false, error: '删除失败' };
    }
  };

  // 更新筛选条件
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 当筛选条件变化时重新获取数据
  useEffect(() => {
    fetchBroadcasts();
  }, [filters]);

  return {
    broadcasts,
    loading,
    error,
    filters,
    fetchBroadcasts,
    createBroadcast,
    likeBroadcast,
    addComment,
    deleteBroadcast,
    updateFilters,
  };
};