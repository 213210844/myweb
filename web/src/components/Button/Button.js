import React from 'react';
import styles from './Button.module.css';

const Button = ({ text, onClick, disabled = false }) => {
    return (
        <button 
            className={styles.btn} 
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

export default Button;