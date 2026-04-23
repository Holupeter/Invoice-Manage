import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <Router>
      <Sidebar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      
      <main style={{ 
        flex: 1, 
        paddingLeft: 'var(--sidebar-width)', 
        transition: 'padding 0.3s ease' 
      }}>
        <div style={{ maxWidth: '730px', margin: '72px auto', padding: '0 24px' }}>
          <Routes>
            <Route path="/" element={<h1>Invoice Dashboard</h1>} />
            <Route path="/invoice/:id" element={<h1>Invoice Detail</h1>} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
