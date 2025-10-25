import React, { useState } from 'react';
import { BroadcastProvider } from '../../contexts/BroadcastContext';
import BroadcastList from './broadcastList';
import BroadcastFilter from './broadcastFilter';
import BroadcastForm from './broadcastForm';
import BroadcastStats from './broadcastStats';
import styles from './broadcast.module.css';

const Broadcast = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <BroadcastProvider>
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
                <BroadcastFilter />

                {showForm && (
                    <div className={styles.formOverlay}>
                        <div className={styles.formModal}>
                            <BroadcastForm onClose={() => setShowForm(false)} />
                        </div>
                    </div>
                )}

                <BroadcastList />
            </div>
        </BroadcastProvider>
    );
};

export default Broadcast;
