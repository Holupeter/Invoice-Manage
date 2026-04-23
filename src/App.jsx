import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import { InvoiceProvider, useInvoices } from './context/InvoiceContext';
import InvoiceForm from './components/invoice/InvoiceForm';
import './index.css';

// This sub-component allows us to access the context values
const AppContent = ({ isDarkMode, onToggleTheme }) => {
  const { isFormOpen, closeForm, editingInvoice } = useInvoices();

  return (
    <>
      <Sidebar isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
      
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<InvoiceList />} />
            <Route path="/invoice/:id" element={<InvoiceDetail />} />
          </Routes>
        </div>
      </main>

      {/* The Global Slide-over Form */}
      <InvoiceForm 
        isOpen={isFormOpen} 
        onClose={closeForm} 
        invoiceData={editingInvoice}
        type={editingInvoice ? 'edit' : 'new'}
      />
    </>
  );
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <InvoiceProvider>
        <AppContent isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      </InvoiceProvider>
    </Router>
  );
}

export default App;
