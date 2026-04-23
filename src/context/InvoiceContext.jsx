import React, { createContext, useState, useContext } from 'react';
import { mockInvoices } from '../utils/mockData';

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const openForm = (invoice = null) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingInvoice(null);
    setIsFormOpen(false);
  };

  return (
    <InvoiceContext.Provider value={{ 
      invoices, 
      isFormOpen, 
      editingInvoice, 
      openForm, 
      closeForm 
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => useContext(InvoiceContext);
