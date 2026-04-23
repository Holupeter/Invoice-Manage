import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './InvoiceDetail.module.css';
import { mockInvoices } from '../utils/mockData';
import StatusBadge from '../components/invoice/StatusBadge';
import ArrowLeft from '../assets/icon-arrow-left.svg';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoice = mockInvoices.find(inv => inv.id === id);

  if (!invoice) return <div style={{ color: 'var(--color-text-main)', padding: '48px' }}>Invoice not found</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <img src={ArrowLeft} alt="" />
        <span>Go back</span>
      </button>

      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusLabel}>Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className={styles.desktopActions}>
          <button className={styles.editBtn}>Edit</button>
          <button className={styles.deleteBtn}>Delete</button>
          <button className={styles.paidBtn}>Mark as Paid</button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.contentHeader}>
           <div>
             <span className={styles.id}><span>#</span>{invoice.id}</span>
             <p className={styles.description}>Graphic Design</p>
           </div>
           <div className={styles.senderAddress}>
             <p>19 Union Terrace</p>
             <p>London</p>
             <p>E1 3EZ</p>
             <p>United Kingdom</p>
           </div>
        </header>

        <div className={styles.infoGrid}>
          <div className={styles.dates}>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Invoice Date</span>
              <p className={styles.value}>21 Aug 2021</p>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Payment Due</span>
              <p className={styles.value}>20 Sep 2021</p>
            </div>
          </div>

          <div className={styles.billTo}>
            <span className={styles.label}>Bill To</span>
            <p className={styles.value}>{invoice.clientName}</p>
            <div className={styles.clientAddress}>
              <p>84 Church Way</p>
              <p>Bradford</p>
              <p>BD1 9PB</p>
              <p>United Kingdom</p>
            </div>
          </div>

          <div className={styles.sentTo}>
            <span className={styles.label}>Sent to</span>
            <p className={styles.value}>alexgrim@mail.com</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <span>Item Name</span>
            <span style={{ textAlign: 'center' }}>QTY.</span>
            <span style={{ textAlign: 'right' }}>Price</span>
            <span style={{ textAlign: 'right' }}>Total</span>
          </div>

          <div className={styles.tableItems}>
             <div className={styles.itemRow}>
               <div className={styles.itemName}>
                 <p>Banner Design</p>
                 <span className={styles.itemMetaMobile}>1 x £ 156.00</span>
               </div>
               <span className={styles.itemQty}>1</span>
               <span className={styles.itemPrice}>£ 156.00</span>
               <span className={styles.itemTotal}>£ 156.00</span>
             </div>
             <div className={styles.itemRow}>
               <div className={styles.itemName}>
                 <p>Email Design</p>
                 <span className={styles.itemMetaMobile}>2 x £ 200.00</span>
               </div>
               <span className={styles.itemQty}>2</span>
               <span className={styles.itemPrice}>£ 200.00</span>
               <span className={styles.itemTotal}>£ 400.00</span>
             </div>
          </div>

          <div className={styles.tableFooter}>
            <span>Amount Due</span>
            <p>£ 556.00</p>
          </div>
        </div>
      </div>

      <div className={styles.mobileActions}>
        <button className={styles.editBtn}>Edit</button>
        <button className={styles.deleteBtn}>Delete</button>
        <button className={styles.paidBtn}>Mark as Paid</button>
      </div>
    </div>
  );
};

export default InvoiceDetail;
