import React, { useState } from 'react';
import { useBroadcast } from '../../hooks/useBroadcast';
import { validateBroadcast } from '../../utils/broadcastUtils';
import styles from './broadcastForm.module.css';

const BroadcastForm = ({ onClose }) => {
    const { addBroadcast } = useBroadcast();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'general',
        priority: 'medium',
        tags: ''
    });
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const validationErrors = validateBroadcast(formData);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await addBroadcast({
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            });
            
            setFormData({ title: '', content: '', type: 'general', priority: 'medium', tags: '' });
            setErrors([]);
            onClose?.();
        } catch (error) {
            setErrors(['发布失败，请重试']);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // 清除错误
        if (errors.length > 0) {
            setErrors([]);
        }
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
                    <div className={styles.charCount}>
                        {formData.title.length}/100
                    </div>
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
                    <div className={styles.charCount}>
                        {formData.content.length}/1000
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="type">类型</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
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
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="用逗号分隔标签"
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.cancelButton}
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
