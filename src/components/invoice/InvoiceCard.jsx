import React from 'react';
import { Link } from 'react-router-dom';
import styles from './InvoiceCard.module.css';
import StatusBadge from './StatusBadge';
import ArrowRight from '../../assets/icon-arrow-right.svg';

const InvoiceCard = ({ invoice }) => {
  // Destructuring for cleaner code
  const { id, paymentDue, clientName, total, status } = invoice;

  return (
    <Link to={`/invoice/${id}`} className={styles.card}>
      <div className={styles.left}>
        <span className={styles.id}><span className={styles.hash}>#</span>{id}</span>
        <span className={styles.dueDate}>Due {paymentDue}</span>
        <span className={styles.clientName}>{clientName}</span>
      </div>

      <div className={styles.right}>
        <span className={styles.total}>£ {total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
        <div className={styles.statusWrapper}>
          <StatusBadge status={status} />
          <img src={ArrowRight} alt="" className={styles.arrow} />
        </div>
      </div>
    </Link>
  );
};

export default InvoiceCard;
