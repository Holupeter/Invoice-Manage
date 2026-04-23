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
  const [filterStatus, setFilterStatus] = useState([]); // Array to store multiple active filters

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

  const toggleFilter = (status) => {
    setFilterStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  // Compute filtered list
  const filteredInvoices = invoices.filter(invoice => {
    if (filterStatus.length === 0) return true;
    return filterStatus.includes(invoice.status.toLowerCase());
  });

  return (
    <InvoiceContext.Provider value={{ 
      invoices: filteredInvoices, // Export the filtered list
      allInvoices: invoices,      // Original list
      isFormOpen, 
      editingInvoice, 
      filterStatus,
      openForm, 
      closeForm,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid,
      toggleFilter
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => useContext(InvoiceContext);
