import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './InvoiceDetail.module.css';
import StatusBadge from '../components/invoice/StatusBadge';
import { useInvoices } from '../context/InvoiceContext';
import ArrowLeft from '../assets/icon-arrow-left.svg';
import DeleteModal from '../components/invoice/DeleteModal';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, deleteInvoice, markAsPaid, openForm } = useInvoices();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const invoice = invoices?.find(inv => inv.id.toUpperCase() === id?.toUpperCase());

  if (!invoice) return <div style={{ color: 'var(--color-text-main)', padding: '48px' }}>Invoice not found</div>;

  const confirmDelete = () => {
    deleteInvoice(id);
    navigate('/');
  };

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
          <button className={styles.editBtn} onClick={() => openForm(invoice)}>Edit</button>
          <button className={styles.deleteBtn} onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
          {invoice.status?.toLowerCase() !== 'paid' && (
            <button className={styles.paidBtn} onClick={() => markAsPaid(invoice.id)}>Mark as Paid</button>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.contentHeader}>
           <div><span className={styles.id}><span>#</span>{invoice.id}</span><p className={styles.description}>{invoice.description}</p></div>
           <div className={styles.senderAddress}>
             <p>{invoice.senderAddress?.street}</p>
             <p>{invoice.senderAddress?.city}</p>
             <p>{invoice.senderAddress?.postCode}</p>
             <p>{invoice.senderAddress?.country}</p>
           </div>
        </header>

        <div className={styles.infoGrid}>
          <div className={styles.dates}>
            <div className={styles.infoGroup}><span className={styles.label}>Invoice Date</span><p className={styles.value}>{invoice.createdAt}</p></div>
            <div className={styles.infoGroup}><span className={styles.label}>Payment Due</span><p className={styles.value}>{invoice.paymentDue}</p></div>
          </div>
          <div className={styles.billTo}>
            <span className={styles.label}>Bill To</span><p className={styles.value}>{invoice.clientName}</p>
            <div className={styles.clientAddress}><p>{invoice.clientAddress?.street}</p><p>{invoice.clientAddress?.city}</p><p>{invoice.clientAddress?.postCode}</p><p>{invoice.clientAddress?.country}</p></div>
          </div>
          <div className={styles.sentTo}><span className={styles.label}>Sent to</span><p className={styles.value}>{invoice.clientEmail}</p></div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}><span>Item Name</span><span style={{ textAlign: 'center' }}>QTY.</span><span style={{ textAlign: 'right' }}>Price</span><span style={{ textAlign: 'right' }}>Total</span></div>
          <div className={styles.tableItems}>
            {(invoice.items || []).map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <div className={styles.itemName}><p>{item.name}</p><span className={styles.itemMetaMobile}>{item.quantity} x £ {item.price?.toFixed(2)}</span></div>
                <span className={styles.itemQty}>{item.quantity}</span>
                <span className={styles.itemPrice}>£ {item.price?.toFixed(2)}</span>
                <span className={styles.itemTotal}>£ {item.total?.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className={styles.tableFooter}><span>Amount Due</span><p>£ {invoice.total?.toFixed(2)}</p></div>
        </div>
      </div>

      <div className={styles.mobileActions}>
        <button className={styles.editBtn} onClick={() => openForm(invoice)}>Edit</button>
        <button className={styles.deleteBtn} onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
        {invoice.status?.toLowerCase() !== 'paid' && (
          <button className={styles.paidBtn} onClick={() => markAsPaid(invoice.id)}>Mark as Paid</button>
        )}
      </div>

      {/* PIXEL-PERFECT DELETE MODAL */}
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete}
        invoiceId={invoice.id}
      />
    </div>
  );
};

export default InvoiceDetail;
