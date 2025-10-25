import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import styles from './AuthForms.module.css';

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 前端验证
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('密码至少需要6位');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        username: formData.username,
        password: formData.password,
        email: formData.email
      });

      if (response.data.message) {
        // 注册成功后自动登录
        const loginResponse = await authAPI.login({
          username: formData.username,
          password: formData.password
        });

        const { token } = loginResponse.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          username: formData.username,
          id: response.data.user.id
        }));

        onRegisterSuccess?.();
      }
    } catch (error) {
      setError(error.response?.data?.error || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // 清除错误信息
    if (error) setError('');
  };

  return (
    <div className={styles.authForm}>
      <h3>用户注册</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">用户名 *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">邮箱</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">密码 *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">确认密码 *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? '注册中...' : '注册'}
        </button>

        <div className={styles.switchAuth}>
          已有账号？ 
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            className={styles.switchButton}
          >
            立即登录
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;