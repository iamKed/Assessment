import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import CreateRFP from './components/CreateRFP';
import RFPDetail from './components/RFPDetail';
import Vendors from './components/Vendors';
import CompareProposals from './components/CompareProposals';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <h1 className="logo">RFP Management System</h1>
            <ul className="nav-links">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/create-rfp">Create RFP</Link></li>
              <li><Link to="/vendors">Vendors</Link></li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-rfp" element={<CreateRFP />} />
            <Route path="/rfp/:id" element={<RFPDetail />} />
            <Route path="/rfp/:id/compare" element={<CompareProposals />} />
            <Route path="/vendors" element={<Vendors />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
