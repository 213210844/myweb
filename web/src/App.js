import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Card from './components/Card/Card';
import Broadcast from './components/broadcast/broadcast';
import { usePrompt } from './hooks/usePrompt';
import { cardData } from './data/cardData';
import styles from './App.module.css';
import './styles/global.css';

function AppContent() {
  const promptHook = usePrompt();
  const [activeTab, setActiveTab] = useState('prompt');

  const handleButtonClick = (type) => {
    switch (type) {
      case 'basic':
        promptHook.basicPrompt();
        break;
      case 'validation':
        promptHook.validationPrompt();
        break;
      case 'conditional':
        promptHook.conditionalPrompt();
        break;
      case 'calculator':
        promptHook.calculatorPrompt();
        break;
      case 'cancel':
        promptHook.cancelPrompt();
        break;
      case 'code':
        alert('查看页面源代码以获取完整代码示例！');
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'prompt' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('prompt')}
        >
          Prompt交互演示
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'broadcast' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('broadcast')}
        >
          系统广播
        </button>
      </div>

      {activeTab === 'prompt' && (
        <div className={styles.cardContainer}>
          {cardData.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              result={card.type !== 'code' ? promptHook.result : ''}
              onButtonClick={() => handleButtonClick(card.type)}
              type={card.type}
              code={card.code}
            />
          ))}
        </div>
      )}

      {activeTab === 'broadcast' && (
        <Broadcast />
      )}

      <footer className={styles.footer}>
        <p>JavaScript交互示例 &copy; 2023</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;