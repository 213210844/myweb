import React from 'react';
import Button from '../Button/Button';
import CodeBlock from '../CodeBlock/CodeBlock';
import styles from './Card.module.css';

const Card = ({ 
    title, 
    description, 
    buttonText, 
    result, 
    onButtonClick, 
    type, 
    code 
}) => {
    return (
        <div className={styles.card}>
            <h2>{title}</h2>
            <p>{description}</p>
            
            {type === 'code' && code && (
                <CodeBlock code={code} />
            )}
            
            <Button 
                text={buttonText} 
                onClick={onButtonClick}
            />
            
            {result && (
                <div className={styles.result}>
                    {result.split(/(<span class="highlight">.*?<\/span>)/g).map((part, index) => {
                        if (part.includes('highlight')) {
                            const match = part.match(/<span class="highlight">(.*?)<\/span>/);
                            return match ? (
                                <span key={index} className="highlight">{match[1]}</span>
                            ) : part;
                        }
                        return part;
                    })}
                </div>
            )}
        </div>
    );
};

export default Card;