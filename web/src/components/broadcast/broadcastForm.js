import React, { useState } from 'react';
import styles from './broadcastForm.module.css';

const BroadcastForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        broadcast_type: 'general',
        priority: 'medium',
        tags: []
    });
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // 重要：阻止表单默认提交行为
        console.log('表单提交被触发', formData); // 添加调试日志
        
        setIsSubmitting(true);
        setErrors([]);

        // 基本验证
        if (!formData.title.trim()) {
            setErrors(['标题不能为空']);
            setIsSubmitting(false);
            return;
        }

        if (!formData.content.trim()) {
            setErrors(['内容不能为空']);
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('准备调用onSubmit', formData);
            await onSubmit(formData);
            console.log('onSubmit调用完成');
        } catch (error) {
            console.error('提交错误:', error);
            setErrors(['提交失败，请重试']);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
        console.log(`字段 ${name} 更新为:`, value); // 调试日志
    };

    const handleTagsChange = (e) => {
        const tagsString = e.target.value;
        const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
        setFormData(prev => ({ 
            ...prev, 
            tags: tagsArray 
        }));
        console.log('标签更新为:', tagsArray); // 调试日志
    };

    return (
        <div className={styles.formContainer}>
            <h3>发布新广播</h3>
            
            {errors.length > 0 && (
                <div className={styles.errors}>
                    {errors.map((error, index) => (
                        <div key={index} className={styles.error}>{error}</div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">标题 *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="请输入广播标题"
                        maxLength={100}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="content">内容 *</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="请输入广播内容"
                        rows="5"
                        maxLength={1000}
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="broadcast_type">类型</label>
                        <select
                            id="broadcast_type"
                            name="broadcast_type"
                            value={formData.broadcast_type}
                            onChange={handleChange}
                        >
                            <option value="general">一般通知</option>
                            <option value="system">系统通知</option>
                            <option value="feature">功能更新</option>
                            <option value="event">活动预告</option>
                            <option value="security">安全提醒</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="priority">优先级</label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="tags">标签</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags_input"
                        onChange={handleTagsChange}
                        placeholder="用逗号分隔标签（例如：新闻,更新,重要）"
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.cancelButton}
                        disabled={isSubmitting}
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles.submitButton}
                    >
                        {isSubmitting ? '发布中...' : '发布广播'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BroadcastForm;