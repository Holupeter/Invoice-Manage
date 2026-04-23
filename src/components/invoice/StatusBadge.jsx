import React from 'react';
import styles from './StatusBadge.module.css';

const StatusBadge = ({ status }) => {
  return (
    <div className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
      <div className={styles.dot}></div>
      <span>{status}</span>
    </div>
  );
};

export default StatusBadge;
