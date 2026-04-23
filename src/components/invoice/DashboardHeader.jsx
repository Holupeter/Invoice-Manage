import React, { useState } from 'react';
import styles from './DashboardHeader.module.css';
import { useInvoices } from '../../context/InvoiceContext';
import ArrowDown from '../../assets/icon-arrow-down.svg';
import PlusIcon from '../../assets/icon-plus.svg';

const DashboardHeader = ({ count }) => {
  const { openForm, filterStatus, toggleFilter } = useInvoices();
  const [isOpen, setIsOpen] = useState(false);

  const statuses = ['Draft', 'Pending', 'Paid'];

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>Invoices</h1>
        <p className={styles.count}>
          {count === 0 ? 'No invoices' : `There are ${count} total invoices`}
        </p>
        <p className={styles.countMobile}>
          {count === 0 ? 'No invoices' : `${count} invoices`}
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.filterContainer}>
          <button className={styles.filterBtn} onClick={() => setIsOpen(!isOpen)}>
            <span>Filter<span className={styles.byStatus}> by status</span></span>
            <img src={ArrowDown} alt="" className={isOpen ? styles.rotated : ''} />
          </button>

          {isOpen && (
            <div className={styles.dropdown}>
              {statuses.map((status) => (
                <label key={status} className={styles.option}>
                  <input 
                    type="checkbox" 
                    checked={filterStatus.includes(status.toLowerCase())}
                    onChange={() => toggleFilter(status.toLowerCase())}
                  />
                  <span className={styles.checkbox}></span>
                  <span className={styles.statusText}>{status}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button className={styles.newInvoiceBtn} onClick={() => openForm()}>
          <div className={styles.plusCircle}>
            <img src={PlusIcon} alt="" />
          </div>
          <span>New<span className={styles.invoiceText}> Invoice</span></span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
