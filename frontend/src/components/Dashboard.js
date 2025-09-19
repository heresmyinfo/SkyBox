import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiUser, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { designAPI } from '../services/api';

const Dashboard = ({ stats }) => {
  const [recentDesigns, setRecentDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentDesigns = async () => {
      try {
        const response = await designAPI.getAllDesigns();
        // Get the 5 most recent designs
        const recent = response.data.slice(0, 5);
        setRecentDesigns(recent);
      } catch (err) {
        setError('Failed to load recent designs');
        console.error('Error fetching recent designs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDesigns();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color = '#007bff' }) => (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ color, fontSize: '2rem', marginBottom: '1rem' }}>
        <Icon />
      </div>
      <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#333' }}>
        {value}
      </h3>
      <p style={{ color: '#6c757d', fontSize: '1rem' }}>{title}</p>
    </div>
  );

  const DesignCard = ({ design }) => (
    <div className="card" style={{ cursor: 'pointer' }}>
      <Link 
        to={`/designs/${design.design_id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <h4 style={{ color: '#007bff', fontSize: '1.1rem' }}>
            {design.design_id}
          </h4>
          <span style={{ 
            background: '#e9ecef', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '3px',
            fontSize: '0.8rem',
            color: '#6c757d'
          }}>
            {design.created_date ? new Date(design.created_date).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        
        {design.description && (
          <p style={{ color: '#6c757d', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            {design.description}
          </p>
        )}
        
        {design.designer && (
          <p style={{ color: '#6c757d', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <FiUser style={{ marginRight: '0.25rem' }} />
            {design.designer}
          </p>
        )}
        
        {design.dimensions && design.dimensions.length > 0 && (
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            {design.dimensions[0].length && design.dimensions[0].width && design.dimensions[0].height && (
              <span>
                {design.dimensions[0].length}" × {design.dimensions[0].width}" × {design.dimensions[0].height}"
              </span>
            )}
          </div>
        )}
        
        {design.specifications && design.specifications.length > 0 && design.specifications[0].box_type && (
          <div style={{ 
            marginTop: '0.5rem',
            padding: '0.25rem 0.5rem',
            background: '#f8f9fa',
            borderRadius: '3px',
            fontSize: '0.8rem',
            color: '#495057'
          }}>
            {design.specifications[0].box_type}
          </div>
        )}
      </Link>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
          Welcome to SkyBox Design Management
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
          Manage and explore your cardboard box manufacturing designs
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
          <StatCard 
            icon={FiPackage} 
            title="Total Designs" 
            value={stats.totalDesigns}
            color="#007bff"
          />
          <StatCard 
            icon={FiTrendingUp} 
            title="Recent Designs" 
            value={stats.recentDesigns}
            color="#28a745"
          />
          <StatCard 
            icon={FiUser} 
            title="Designers" 
            value={stats.designers?.length || 0}
            color="#ffc107"
          />
          <StatCard 
            icon={FiCalendar} 
            title="Box Types" 
            value={stats.boxTypes?.length || 0}
            color="#dc3545"
          />
        </div>
      )}

      {/* Recent Designs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#333' }}>Recent Designs</h2>
          <Link 
            to="/designs" 
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            View All Designs
          </Link>
        </div>
        
        {error && (
          <div className="error">{error}</div>
        )}
        
        {recentDesigns.length > 0 ? (
          <div className="grid grid-3">
            {recentDesigns.map((design) => (
              <DesignCard key={design.design_id} design={design} />
            ))}
          </div>
        ) : (
          <div className="card text-center">
            <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
              No designs found. Import some design files to get started.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/designs" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Browse All Designs
          </Link>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
