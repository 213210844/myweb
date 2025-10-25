import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AuthForms.module.css';

const LoginForm = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);
    
    if (!result.success) {
      setError(result.error.non_field_errors?.[0] || result.error.error || '登录失败');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleDemoLogin = () => {
    setCredentials({
      username: 'demo',
      password: 'demopassword123'
    });
  };

  return (
    <div className={styles.authForm}>
      <h3>用户登录</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">用户名:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">密码:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
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
          {loading ? '登录中...' : '登录'}
        </button>

        <div className={styles.switchAuth}>
          没有账号？ 
          <button 
            type="button" 
            onClick={onSwitchToRegister}
            className={styles.switchButton}
          >
            立即注册
          </button>
        </div>

        <div className={styles.demoSection}>
          <button 
            type="button" 
            onClick={handleDemoLogin}
            className={styles.demoButton}
          >
            使用演示账号
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;