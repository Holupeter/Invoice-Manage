import React, { useState, useEffect, useRef } from 'react';
import styles from './InvoiceForm.module.css';
import TrashIcon from '../../assets/icon-delete.svg';
import ArrowDown from '../../assets/icon-arrow-down.svg';
import DatePicker from './DatePicker';
import { useInvoices } from '../../context/InvoiceContext';

const PAYMENT_OPTIONS = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
];

const InvoiceForm = ({ isOpen, onClose, type = 'new', invoiceData }) => {
  const { addInvoice, updateInvoice } = useInvoices();
  const [termsOpen, setTermsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const termsRef = useRef(null);

  const [formData, setFormData] = useState({
    description: '',
    paymentTerms: 30,
    clientName: '',
    clientEmail: '',
    createdAt: '',
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: []
  });

  useEffect(() => {
    if (invoiceData) {
      setFormData({
        ...invoiceData,
        senderAddress: invoiceData.senderAddress || { street: '', city: '', postCode: '', country: '' },
        clientAddress: invoiceData.clientAddress || { street: '', city: '', postCode: '', country: '' },
        items: invoiceData.items || []
      });
    } else {
      setFormData({
        description: '',
        paymentTerms: 30,
        clientName: '',
        clientEmail: '',
        createdAt: '',
        senderAddress: { street: '', city: '', postCode: '', country: '' },
        clientAddress: { street: '', city: '', postCode: '', country: '' },
        items: []
      });
    }
    setTermsOpen(false);
    setErrors({});
  }, [invoiceData, isOpen]);

  // Close terms dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (termsRef.current && !termsRef.current.contains(e.target)) {
        setTermsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const generateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 2; i++) id += chars[Math.floor(Math.random() * 26)];
    for (let i = 0; i < 4; i++) id += chars[Math.floor(Math.random() * 10) + 26];
    return id;
  };

  const calculateTotal = (items) => {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0);
  };

  const handleItemChange = (id, field, value) => {
    const newItems = (formData.items || []).map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.total = (updatedItem.quantity || 0) * (updatedItem.price || 0);
        return updatedItem;
      }
      return item;
    });
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...(formData.items || []), { id: Date.now(), name: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  // =============================
  // VALIDATION
  // =============================
  const validate = () => {
    const errs = {};

    // Bill From
    if (!formData.senderAddress.street.trim()) errs.senderStreet = true;
    if (!formData.senderAddress.city.trim()) errs.senderCity = true;
    if (!formData.senderAddress.postCode.trim()) errs.senderPostCode = true;
    if (!formData.senderAddress.country.trim()) errs.senderCountry = true;

    // Bill To
    if (!formData.clientName.trim()) errs.clientName = true;
    if (!formData.clientEmail.trim()) errs.clientEmail = true;
    if (!formData.clientAddress.street.trim()) errs.clientStreet = true;
    if (!formData.clientAddress.city.trim()) errs.clientCity = true;
    if (!formData.clientAddress.postCode.trim()) errs.clientPostCode = true;
    if (!formData.clientAddress.country.trim()) errs.clientCountry = true;

    // Date & Description
    if (!formData.createdAt) errs.createdAt = true;
    if (!formData.description.trim()) errs.description = true;

    // Items — must have at least one
    if (!formData.items || formData.items.length === 0) {
      errs.noItems = true;
    } else {
      formData.items.forEach((item, i) => {
        if (!item.name.trim()) errs[`itemName_${item.id}`] = true;
        if (!item.quantity || item.quantity <= 0) errs[`itemQty_${item.id}`] = true;
        if (!item.price || item.price <= 0) errs[`itemPrice_${item.id}`] = true;
      });
    }

    return errs;
  };

  const handleSubmit = (e, status = 'pending') => {
    if (e) e.preventDefault();

    // Skip validation for drafts
    if (status !== 'draft') {
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
    }

    setErrors({});

    const finalInvoice = {
      ...formData,
      id: invoiceData?.id || generateId(),
      status: invoiceData?.status || status,
      total: calculateTotal(formData.items),
      createdAt: formData.createdAt || new Date().toISOString().split('T')[0],
      paymentDue: new Date(Date.now() + (formData.paymentTerms || 30) * 86400000).toISOString().split('T')[0]
    };

    if (type === 'edit') updateInvoice(finalInvoice);
    else addInvoice(finalInvoice);
  };

  // Helper: returns error class if field has error
  const err = (key) => errors[key] ? styles.fieldError : '';
  const errLabel = (key) => errors[key] ? styles.labelError : '';

  const selectedTermsLabel = PAYMENT_OPTIONS.find(o => o.value === formData.paymentTerms)?.label || 'Net 30 Days';

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>{type === 'new' ? 'New Invoice' : `Edit #${invoiceData.id}`}</h1>
        </div>

        <div className={styles.formContent}>
          <form id="invoice-form" onSubmit={(e) => handleSubmit(e)}>
            {/* BILL FROM */}
            <section>
              <h3 className={styles.sectionTitle}>Bill From</h3>
              <div className={styles.field}>
                <div className={styles.labelRow}><label>Street Address</label>{errors.senderStreet && <span className={styles.errorText}>can't be empty</span>}</div>
                <input className={err('senderStreet')} type="text" value={formData.senderAddress.street} onChange={(e) => setFormData({...formData, senderAddress: {...formData.senderAddress, street: e.target.value}})} />
              </div>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <div className={styles.labelRow}><label>City</label>{errors.senderCity && <span className={styles.errorText}>can't be empty</span>}</div>
                  <input className={err('senderCity')} type="text" value={formData.senderAddress.city} onChange={(e) => setFormData({...formData, senderAddress: {...formData.senderAddress, city: e.target.value}})} />
                </div>
                <div className={styles.field}>
                  <div className={styles.labelRow}><label>Post Code</label>{errors.senderPostCode && <span className={styles.errorText}>can't be empty</span>}</div>
                  <input className={err('senderPostCode')} type="text" value={formData.senderAddress.postCode} onChange={(e) => setFormData({...formData, senderAddress: {...formData.senderAddress, postCode: e.target.value}})} />
                </div>
                <div className={styles.field}>
                  <div className={styles.labelRow}><label>Country</label>{errors.senderCountry && <span className={styles.errorText}>can't be empty</span>}</div>
                  <input className={err('senderCountry')} type="text" value={formData.senderAddress.country} onChange={(e) => setFormData({...formData, senderAddress: {...formData.senderAddress, country: e.target.value}})} />
                </div>
              </div>
            </section>

            {/* BILL TO */}
            <section style={{ marginTop: '48px' }}>
              <h3 className={styles.sectionTitle}>Bill To</h3>
              <div className={styles.field}>
                <div className={styles.labelRow}><label>Client's Name</label>{errors.clientName && <span className={styles.errorText}>can't be empty</span>}</div>
                <input className={err('clientName')} type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} />
              </div>
              <div className={styles.field}>
                <div className={styles.labelRow}><label>Client's Email</label>{errors.clientEmail && <span className={styles.errorText}>can't be empty</span>}</div>
                <input className={err('clientEmail')} type="email" placeholder="e.g. email@example.com" value={formData.clientEmail} onChange={(e) => setFormData({...formData, clientEmail: e.target.value})} />
              </div>
              <div className={styles.field}>
                <div className={styles.labelRow}><label>Street Address</label>{errors.clientStreet && <span className={styles.errorText}>can't be empty</span>}</div>
                <input className={err('clientStreet')} type="text" value={formData.clientAddress.street} onChange={(e) => setFormData({...formData, clientAddress: {...formData.clientAddress, street: e.target.value}})} />
              </div>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <div className={styles.labelRow}><label>City</label>{errors.clientCity && <span className={styles.errorText}>can't be empty</span>}</div>
                  <input className={err('clientCity')} type="text" value={formData.clientAddress.city} onChange={(e) => setFormData({...formData, clientAddress: {...formData.clientAddress, city: e.target.value}})} />
                </div>
                <div className={styles.field}>
                  <div className={styles.labelRow}><label>Post Code</label>{errors.clientPostCode && <span className={styles.errorText}>can't be empty</span>}</div>
                  <input className={err('clientPostCode')} type="text" value={formData.clientAddress.postCode} onChange={(e) => setFormData({...formData, clientAddress: {...formData.clientAddress, postCode: e.target.value}})} />
                </div>
                <div className={styles.field}>
                  <div className={styles.labelRow}><label>Country</label>{errors.clientCountry && <span className={styles.errorText}>can't be empty</span>}</div>
                  <input className={err('clientCountry')} type="text" value={formData.clientAddress.country} onChange={(e) => setFormData({...formData, clientAddress: {...formData.clientAddress, country: e.target.value}})} />
                </div>
              </div>
            </section>

            {/* DATE & TERMS */}
            <section style={{ marginTop: '48px' }}>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <div className={styles.labelRow}><label>Invoice Date</label>{errors.createdAt && <span className={styles.errorText}>can't be empty</span>}</div>
                  <DatePicker
                    value={formData.createdAt}
                    onChange={(val) => setFormData({...formData, createdAt: val})}
                    hasError={!!errors.createdAt}
                  />
                </div>

                {/* Payment Terms — custom dropdown */}
                <div className={styles.field} ref={termsRef}>
                  <label>Payment Terms</label>
                  <button
                    type="button"
                    className={styles.termsButton}
                    onClick={() => setTermsOpen(!termsOpen)}
                  >
                    <span>{selectedTermsLabel}</span>
                    <img src={ArrowDown} alt="" className={termsOpen ? styles.arrowRotated : ''} />
                  </button>
                  {termsOpen && (
                    <div className={styles.termsDropdown}>
                      {PAYMENT_OPTIONS.map((opt, i) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`${styles.termsOption} ${formData.paymentTerms === opt.value ? styles.termsOptionActive : ''}`}
                          onClick={() => { setFormData({...formData, paymentTerms: opt.value}); setTermsOpen(false); }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.field}>
                <div className={styles.labelRow}><label>Project Description</label>{errors.description && <span className={styles.errorText}>can't be empty</span>}</div>
                <input className={err('description')} type="text" placeholder="e.g. Graphic Design Service" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
            </section>

            {/* ITEM LIST */}
            <section style={{ marginTop: '32px' }}>
              <h2 className={styles.itemTitle}>Item List</h2>

              {/* Column header — desktop/tablet only */}
              <div className={styles.itemHeader}>
                <span>Item Name</span>
                <span>Qty.</span>
                <span>Price</span>
                <span>Total</span>
                <span></span>
              </div>

              {(formData.items || []).map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemNameInput}>
                    <label className={styles.mobileLabel}>Item Name</label>
                    <input className={err(`itemName_${item.id}`)} type="text" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} />
                  </div>
                  <div className={styles.itemQtyInput}>
                    <label className={styles.mobileLabel}>Qty.</label>
                    <input className={err(`itemQty_${item.id}`)} type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value))} />
                  </div>
                  <div className={styles.itemPriceInput}>
                    <label className={styles.mobileLabel}>Price</label>
                    <input className={err(`itemPrice_${item.id}`)} type="number" step="0.01" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))} />
                  </div>
                  <div className={styles.itemTotalGroup}>
                    <label className={styles.mobileLabel}>Total</label>
                    <span className={styles.itemTotal}>{((item.quantity || 0) * (item.price || 0)).toFixed(2)}</span>
                  </div>
                  <button type="button" onClick={() => setFormData({...formData, items: formData.items.filter(i => i.id !== item.id)})} className={styles.deleteBtn}>
                    <img src={TrashIcon} alt="Delete" />
                  </button>
                </div>
              ))}

              <button type="button" className={styles.addNewBtn} onClick={addItem}>+ Add New Item</button>

              {/* Error messages at bottom */}
              {Object.keys(errors).length > 0 && (
                <div className={styles.formErrors}>
                  <p>- All fields must be added</p>
                  {errors.noItems && <p>- An item must be added</p>}
                </div>
              )}
            </section>
          </form>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          {type === 'new' ? (
            <>
              <div className={styles.footerLeft}>
                <button type="button" className={styles.discardBtn} onClick={onClose}>Discard</button>
              </div>
              <div className={styles.footerRight}>
                <button type="button" className={styles.draftBtn} onClick={() => handleSubmit(null, 'draft')}>
                  Save as Draft
                </button>
                <button type="submit" className={styles.saveBtn} form="invoice-form">
                  Save & Send
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.footerLeft}></div>
              <div className={styles.footerRight}>
                <button type="button" className={styles.discardBtn} onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} form="invoice-form">
                  Save Changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
