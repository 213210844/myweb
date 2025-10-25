import React from 'react';
import styles from './CodeBlock.module.css';

const CodeBlock = ({ code }) => {
    return (
        <pre className={styles.codeBlock}>
            <code>{code}</code>
        </pre>
    );
};

export default CodeBlock;