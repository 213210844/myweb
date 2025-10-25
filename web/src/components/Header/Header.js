import React from 'react';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <h1>JavaScript Prompt与Button交互</h1>
            <p className={styles.subtitle}>
                探索如何使用prompt函数与按钮创建动态用户交互体验
            </p>
        </header>
    );
};

export default Header;
