import { useState, useEffect } from 'react';
import { useBroadcastContext } from '../contexts/BroadcastContext';
import { mockBroadcasts } from '../data/mockBroadcasts';
import { filterBroadcasts, sortBroadcasts } from '../utils/broadcastUtils';

export const useBroadcast = () => {
    const { state, dispatch } = useBroadcastContext();
    const [searchTerm, setSearchTerm] = useState('');

    // 初始化模拟数据
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true });
        setTimeout(() => {
            dispatch({ type: 'SET_BROADCASTS', payload: mockBroadcasts });
            dispatch({ type: 'SET_LOADING', payload: false });
        }, 1000);
    }, [dispatch]);

    // 添加新广播
    const addBroadcast = (broadcastData) => {
        const newBroadcast = {
            id: Date.now().toString(),
            ...broadcastData,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0,
            views: 0
        };
        dispatch({ type: 'ADD_BROADCAST', payload: newBroadcast });
    };

    // 更新广播
    const updateBroadcast = (id, updates) => {
        const updatedBroadcast = { ...state.broadcasts.find(b => b.id === id), ...updates };
        dispatch({ type: 'UPDATE_BROADCAST', payload: updatedBroadcast });
    };

    // 删除广播
    const deleteBroadcast = (id) => {
        dispatch({ type: 'DELETE_BROADCAST', payload: id });
    };

    // 点赞广播
    const likeBroadcast = (id) => {
        const broadcast = state.broadcasts.find(b => b.id === id);
        if (broadcast) {
            updateBroadcast(id, { likes: broadcast.likes + 1 });
        }
    };

    // 过滤和排序后的广播列表
    const filteredBroadcasts = filterBroadcasts(
        sortBroadcasts(state.broadcasts, state.sort),
        state.filter,
        searchTerm
    );

    return {
        broadcasts: filteredBroadcasts,
        loading: state.loading,
        filter: state.filter,
        sort: state.sort,
        searchTerm,
        setSearchTerm,
        addBroadcast,
        updateBroadcast,
        deleteBroadcast,
        likeBroadcast,
        setFilter: (filter) => dispatch({ type: 'SET_FILTER', payload: filter }),
        setSort: (sort) => dispatch({ type: 'SET_SORT', payload: sort })
    };
};
