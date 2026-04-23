import React from 'react';
import styles from './InvoiceList.module.css';
import DashboardHeader from '../components/invoice/DashboardHeader';
import InvoiceCard from '../components/invoice/InvoiceCard';
import { useInvoices } from '../context/InvoiceContext';
import EmptyIllustration from '../assets/illustration-empty.svg';

const InvoiceList = () => {
  const { invoices } = useInvoices();

  return (
    <main className={styles.container}>
      <DashboardHeader count={invoices.length} />
      
      <section className={styles.list} aria-label="Invoices list">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <img src={EmptyIllustration} alt="" role="presentation" />
            <h2>There is nothing here</h2>
            <p>
              Create an invoice by clicking the <strong>New Invoice</strong> button and get started
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default InvoiceList;
