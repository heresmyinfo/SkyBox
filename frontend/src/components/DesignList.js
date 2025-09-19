import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPackage, FiUser, FiCalendar, FiFilter } from 'react-icons/fi';
import { designAPI } from '../services/api';

const DesignList = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await designAPI.getAllDesigns();
        setDesigns(response.data);
      } catch (err) {
        setError('Failed to load designs');
        console.error('Error fetching designs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = !searchTerm || 
      design.design_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (design.description && design.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (design.designer && design.designer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
      (design.specifications && design.specifications.some(spec => spec.box_type === filterType));
    
    return matchesSearch && matchesFilter;
  });

  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.created_date || 0) - new Date(a.created_date || 0);
      case 'name':
        return a.design_id.localeCompare(b.design_id);
      case 'designer':
        return (a.designer || '').localeCompare(b.designer || '');
      default:
        return 0;
    }
  });

  const DesignCard = ({ design }) => (
    <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
      <Link 
        to={`/designs/${design.design_id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <h3 style={{ color: '#007bff', fontSize: '1.2rem', margin: 0 }}>
            {design.design_id}
          </h3>
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
          <p style={{ color: '#6c757d', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            {design.description}
          </p>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#6c757d' }}>
          <FiUser style={{ marginRight: '0.5rem' }} />
          {design.designer || 'Unknown Designer'}
        </div>
        
        {design.dimensions && design.dimensions.length > 0 && design.dimensions[0].length && (
          <div style={{ 
            marginBottom: '0.5rem',
            padding: '0.5rem',
            background: '#f8f9fa',
            borderRadius: '5px',
            fontSize: '0.9rem',
            color: '#495057'
          }}>
            <strong>Dimensions:</strong> {design.dimensions[0].length}" × {design.dimensions[0].width}" × {design.dimensions[0].height}"
          </div>
        )}
        
        {design.specifications && design.specifications.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {design.specifications.map((spec, index) => (
              <span key={index} style={{
                background: '#007bff',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.8rem'
              }}>
                {spec.box_type}
              </span>
            ))}
          </div>
        )}
        
        <div style={{ 
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#6c757d'
        }}>
          <span>Components: {design.components_count || 0}</span>
          <span>Parts: {design.parts_required || 0}</span>
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading designs...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
          Design Library
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
          Browse and manage all your cardboard box designs
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ 
                position: 'absolute', 
                left: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }} />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 35px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiFilter />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            >
              <option value="all">All Types</option>
              <option value="OPF">OPF</option>
              <option value="Folder">Folder</option>
              <option value="Air Cell">Air Cell</option>
              <option value="PAD">PAD</option>
              <option value="FLUTE">FLUTE</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="designer">Designer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ marginBottom: '1rem', color: '#6c757d' }}>
        Showing {sortedDesigns.length} of {designs.length} designs
        {searchTerm && ` matching "${searchTerm}"`}
        {filterType !== 'all' && ` of type "${filterType}"`}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error">{error}</div>
      )}

      {/* Designs Grid */}
      {sortedDesigns.length > 0 ? (
        <div className="grid grid-3">
          {sortedDesigns.map((design) => (
            <DesignCard key={design.design_id} design={design} />
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <FiPackage style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }} />
          <h3 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>
            No designs found
          </h3>
          <p style={{ color: '#6c757d' }}>
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No designs have been imported yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DesignList;
