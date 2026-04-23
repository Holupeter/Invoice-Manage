import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockInvoices } from '../utils/mockData';

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : mockInvoices;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const openForm = (invoice = null) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingInvoice(null);
    setIsFormOpen(false);
  };

  const addInvoice = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
    closeForm();
  };

  const updateInvoice = (updatedInvoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    closeForm();
  };

  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const markAsPaid = (id) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: 'paid' } : inv
    ));
  };

  return (
    <InvoiceContext.Provider value={{ 
      invoices, 
      isFormOpen, 
      editingInvoice, 
      openForm, 
      closeForm,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => useContext(InvoiceContext);
