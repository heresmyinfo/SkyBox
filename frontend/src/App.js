import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MROList from './components/MROList';
import MRODetail from './components/MRODetail';
import MTECHSpecs from './components/MTECHSpecs';
import MachineRouting from './components/MachineRouting';
import PricingTiers from './components/PricingTiers';
import WorkflowDiagram from './components/WorkflowDiagram';
import { designAPI } from './services/api';
import './styles/index.css';

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await designAPI.getStats();
        setStats(response.data);
      } catch (err) {
        setError('Failed to load statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div>Loading SkyBox MRO Design Management System...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header stats={stats} />
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard stats={stats} />} />
            <Route path="/mro-drawings" element={<MROList />} />
            <Route path="/mro-drawings/:id" element={<MRODetail />} />
            <Route path="/mtech-specs" element={<MTECHSpecs />} />
            <Route path="/machine-routing" element={<MachineRouting />} />
            <Route path="/pricing-tiers" element={<PricingTiers />} />
            <Route path="/workflow" element={<WorkflowDiagram />} />
          </Routes>
        </main>
        {error && (
          <div className="error">
            {error}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
