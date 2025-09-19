import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiCalendar, FiUser, FiPackage, FiTrendingUp } from 'react-icons/fi';

const MROList = () => {
  const [mroDrawings, setMroDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data for MRO drawings
    const mockMROData = [
      {
        id: 1,
        mro_number: 'MRO40611',
        filename: 'MRO40611.pdf',
        description: 'Custom Shipping Box - Electronics',
        designer: 'John Smith',
        created_date: '2024-01-15',
        design_lab_status: 'Approved',
        box_type: 'OPF',
        dimensions: '12x8x4',
        status: 'Ready for Quote'
      },
      {
        id: 2,
        mro_number: 'MRO32920',
        filename: 'MRO32920.pdf',
        description: 'Retail Display Box',
        designer: 'Sarah Johnson',
        created_date: '2024-01-10',
        design_lab_status: 'Released',
        box_type: 'Folder',
        dimensions: '24x18x6',
        status: 'Quoted'
      },
      {
        id: 3,
        mro_number: 'MRO35174',
        filename: 'MRO35174.pdf',
        description: 'Protective Packaging',
        designer: 'Mike Chen',
        created_date: '2024-01-08',
        design_lab_status: 'Draft',
        box_type: 'Air Cell',
        dimensions: '16x12x3',
        status: 'In Design'
      }
    ];

    setMroDrawings(mockMROData);
    setLoading(false);
  }, []);

  const filteredMROs = mroDrawings.filter(mro =>
    mro.mro_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mro.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mro.designer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready for Quote': return '#28a745';
      case 'Quoted': return '#007bff';
      case 'In Design': return '#ffc107';
      case 'Production': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Approved': return '#28a745';
      case 'Released': return '#007bff';
      case 'Draft': return '#ffc107';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading MRO Drawings...</div>
      </div>
    );
  }

  return (
    <div className="mro-list">
      <div className="page-header">
        <h1>
          <FiFileText style={{ marginRight: '0.5rem' }} />
          MRO Drawings
        </h1>
        <p>Manage MRO drawings from Design Lab and track their progression through the workflow</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search MRO drawings by number, description, or designer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #dee2e6',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div className="mro-grid">
        {filteredMROs.map((mro) => (
          <div key={mro.id} className="mro-card">
            <div className="mro-card-header">
              <div className="mro-number">
                <FiPackage style={{ marginRight: '0.25rem' }} />
                {mro.mro_number}
              </div>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusBadgeColor(mro.design_lab_status) }}
              >
                {mro.design_lab_status}
              </div>
            </div>
            
            <div className="mro-card-body">
              <h3>{mro.description}</h3>
              
              <div className="mro-details">
                <div className="detail-item">
                  <FiUser style={{ marginRight: '0.25rem' }} />
                  <span>{mro.designer}</span>
                </div>
                
                <div className="detail-item">
                  <FiCalendar style={{ marginRight: '0.25rem' }} />
                  <span>{new Date(mro.created_date).toLocaleDateString()}</span>
                </div>
                
                <div className="detail-item">
                  <FiPackage style={{ marginRight: '0.25rem' }} />
                  <span>{mro.box_type} - {mro.dimensions}</span>
                </div>
              </div>
              
              <div className="workflow-status">
                <div 
                  className="status-indicator"
                  style={{ color: getStatusColor(mro.status) }}
                >
                  <FiTrendingUp style={{ marginRight: '0.25rem' }} />
                  {mro.status}
                </div>
              </div>
            </div>
            
            <div className="mro-card-footer">
              <Link 
                to={`/mro-drawings/${mro.mro_number}`}
                className="btn btn-primary"
              >
                View Details
              </Link>
              <Link 
                to={`/mtech-specs?mro=${mro.mro_number}`}
                className="btn btn-secondary"
              >
                MTECH Spec
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredMROs.length === 0 && (
        <div className="no-results">
          <FiFileText size={48} style={{ color: '#6c757d', marginBottom: '1rem' }} />
          <h3>No MRO drawings found</h3>
          <p>Try adjusting your search terms or check if drawings have been imported.</p>
        </div>
      )}
    </div>
  );
};

export default MROList;

