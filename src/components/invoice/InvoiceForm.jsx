import React, { useState } from 'react';
import styles from './InvoiceForm.module.css';
import TrashIcon from '../../assets/icon-delete.svg';

const InvoiceForm = ({ isOpen, onClose, type = 'new', invoiceData }) => {
  const [items, setItems] = useState(invoiceData?.items || []);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', qty: 1, price: 0, total: 0 }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* FIXED HEADER */}
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>{type === 'new' ? 'New Invoice' : `Edit #${invoiceData.id}`}</h1>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className={styles.formContent}>
          <form className={styles.form}>
            {/* Bill From */}
            <section>
              <h3 className={styles.sectionTitle}>Bill From</h3>
              <div className={styles.field}>
                <label>Street Address</label>
                <input type="text" defaultValue={invoiceData?.senderAddress?.street} />
              </div>
              <div className={styles.grid3}>
                <div className={styles.field}><label>City</label><input type="text" /></div>
                <div className={styles.field}><label>Post Code</label><input type="text" /></div>
                <div className={styles.field}><label>Country</label><input type="text" /></div>
              </div>
            </section>

            {/* Bill To */}
            <section style={{ marginTop: '48px' }}>
              <h3 className={styles.sectionTitle}>Bill To</h3>
              <div className={styles.field}><label>Client's Name</label><input type="text" /></div>
              <div className={styles.field}><label>Client's Email</label><input type="email" /></div>
              <div className={styles.field}><label>Street Address</label><input type="text" /></div>
              <div className={styles.grid3}>
                <div className={styles.field}><label>City</label><input type="text" /></div>
                <div className={styles.field}><label>Post Code</label><input type="text" /></div>
                <div className={styles.field}><label>Country</label><input type="text" /></div>
              </div>
            </section>

            {/* Item List */}
            <section style={{ marginTop: '32px' }}>
              <h2 className={styles.itemTitle}>Item List</h2>
              <div className={styles.itemHeader}>
                <span>Item Name</span>
                <span>Qty.</span>
                <span>Price</span>
                <span>Total</span>
                <span></span>
              </div>
              
              {items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemNameInput}>
                    <label className={styles.mobileLabel}>Item Name</label>
                    <input type="text" defaultValue={item.name} />
                  </div>
                  <div className={styles.itemQtyInput}>
                    <label className={styles.mobileLabel}>Qty.</label>
                    <input type="number" defaultValue={item.qty} />
                  </div>
                  <div className={styles.itemPriceInput}>
                    <label className={styles.mobileLabel}>Price</label>
                    <input type="number" defaultValue={item.price} />
                  </div>
                  <div className={styles.itemTotalGroup}>
                    <label className={styles.mobileLabel}>Total</label>
                    <span className={styles.itemTotal}>{(item.qty * item.price).toFixed(2)}</span>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className={styles.deleteBtn}>
                    <img src={TrashIcon} alt="Delete" />
                  </button>
                </div>
              ))}

              <button type="button" className={styles.addNewBtn} onClick={addItem}>
                + Add New Item
              </button>
            </section>
          </form>
        </div>

        {/* FIXED FOOTER */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <button className={styles.discardBtn} onClick={onClose}>Discard</button>
          </div>
          <div className={styles.footerRight}>
            <button className={styles.draftBtn}>Save as Draft</button>
            <button className={styles.saveBtn}>Save & Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
