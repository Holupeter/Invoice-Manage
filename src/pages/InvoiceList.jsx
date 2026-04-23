import React, { useState } from 'react';
import DashboardHeader from '../components/invoice/DashboardHeader';
import InvoiceCard from '../components/invoice/InvoiceCard';
import { mockInvoices } from '../utils/mockData';

const InvoiceList = () => {
  const [invoices] = useState(mockInvoices);

  return (
    <div style={{ width: '100%' }}>
      <DashboardHeader count={invoices.length} />
      
      <div className="invoice-list-container">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </div>
  );
};

export default InvoiceList;
