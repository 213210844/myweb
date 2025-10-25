import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBroadcast } from '../../hooks/useBroadcast';
import BroadcastList from './broadcastList';
import BroadcastFilter from './broadcastFilter';
import BroadcastForm from './broadcastForm';
import BroadcastStats from './broadcastStats';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import styles from './broadcast.module.css';

const Broadcast = () => {
  const { isAuthenticated } = useAuth();
  const { broadcasts, loading, error, filters, updateFilters, createBroadcast } = useBroadcast();
  const [showForm, setShowForm] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' 或 'register'

  const handleCreateBroadcast = async (formData) => {
    const result = await createBroadcast(formData);
    if (result.success) {
      setShowForm(false);
    } else {
      alert('创建失败: ' + JSON.stringify(result.error));
    }
  };

  const handleRegisterSuccess = () => {
    setAuthMode('login');
    window.location.reload(); // 刷新页面以更新认证状态
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.broadcastContainer}>
        <div className={styles.authRequired}>
          <h3>请登录后查看广播</h3>
          {authMode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <RegisterForm 
              onSwitchToLogin={() => setAuthMode('login')}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.broadcastContainer}>
      <div className={styles.broadcastHeader}>
        <h2>系统广播</h2>
        <button 
          onClick={() => setShowForm(true)}
          className={styles.newBroadcastButton}
        >
          发布新广播
        </button>
      </div>

      <BroadcastStats />
      <BroadcastFilter filters={filters} onFilterChange={updateFilters} />

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formModal}>
            <BroadcastForm 
              onSubmit={handleCreateBroadcast}
              onClose={() => setShowForm(false)} 
            />
          </div>
        </div>
      )}

      <BroadcastList 
        broadcasts={broadcasts}
        loading={loading}
      />
    </div>
  );
};

// 确保这里是默认导出
export default Broadcast;