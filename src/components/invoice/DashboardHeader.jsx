import React from 'react';
import styles from './DashboardHeader.module.css';
import { useInvoices } from '../../context/InvoiceContext'; // Import hook
import PlusIcon from '../../assets/icon-plus.svg';
import ArrowDown from '../../assets/icon-arrow-down.svg';

const DashboardHeader = ({ count }) => {
  const { openForm } = useInvoices(); // Get the openForm function

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>Invoices</h1>
        <p className={styles.count}>
          {count === 0 ? 'No invoices' : `There are ${count} total invoices`}
        </p>
        <p className={styles.countMobile}>
          {count === 0 ? 'No invoices' : `${count} invoices`}
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.filter}>
          <span className={styles.filterText}>
            Filter <span className={styles.filterBy}>by status</span>
          </span>
          <img src={ArrowDown} alt="" className={styles.arrow} />
        </div>

        {/* Trigger the form on click */}
        <button className={styles.newButton} onClick={() => openForm()}>
          <div className={styles.plusBg}>
            <img src={PlusIcon} alt="" />
          </div>
          <span className={styles.btnText}>
            New <span className={styles.btnFullText}>Invoice</span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
