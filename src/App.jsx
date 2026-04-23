import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import { InvoiceProvider, useInvoices } from './context/InvoiceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import InvoiceForm from './components/invoice/InvoiceForm';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import { Navigate } from 'react-router-dom';
import './index.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main layout wrapper for authenticated users
const AuthenticatedLayout = ({ isDarkMode, onToggleTheme, children }) => {
  const { isFormOpen, closeForm, editingInvoice } = useInvoices();

  return (
    <>
      <Sidebar isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      <InvoiceForm 
        isOpen={isFormOpen} 
        onClose={closeForm} 
        invoiceData={editingInvoice}
        type={editingInvoice ? 'edit' : 'new'}
      />
    </>
  );
};

// This sub-component allows us to access the context values
const AppContent = ({ isDarkMode, onToggleTheme }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout isDarkMode={isDarkMode} onToggleTheme={onToggleTheme}>
              <InvoiceList />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invoice/:id" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout isDarkMode={isDarkMode} onToggleTheme={onToggleTheme}>
              <InvoiceDetail />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
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
      <AuthProvider>
        <InvoiceProvider>
          <AppContent isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
        </InvoiceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
