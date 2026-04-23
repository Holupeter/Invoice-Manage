import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar/Header will go here */}
        
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<h1>Invoice Dashboard</h1>} />
            <Route path="/invoice/:id" element={<h1>Invoice Detail</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
