import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiSearch, FiPackage, FiUser, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { designAPI } from '../services/api';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchDesigns = async () => {
      try {
        const response = await designAPI.searchDesigns(query);
        setResults(response.data);
      } catch (err) {
        setError('Failed to search designs');
        console.error('Error searching designs:', err);
      } finally {
        setLoading(false);
      }
    };

    searchDesigns();
  }, [query]);

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
      </Link>
    </div>
  );

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ background: '#ffeb3b', padding: '0.1rem' }}>
          {part}
        </mark>
      ) : part
    );
  };

  if (loading) {
    return <div className="loading">Searching designs...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/designs" className="btn btn-secondary" style={{ textDecoration: 'none', marginBottom: '1rem' }}>
          <FiArrowLeft style={{ marginRight: '0.5rem' }} />
          Back to Designs
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <FiSearch style={{ marginRight: '0.5rem', color: '#007bff', fontSize: '1.5rem' }} />
          <h1 style={{ fontSize: '2rem', margin: 0, color: '#333' }}>
            Search Results
          </h1>
        </div>
        
        <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
          Found {results.length} design{results.length !== 1 ? 's' : ''} matching "{query}"
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error">{error}</div>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-3">
          {results.map((design) => (
            <DesignCard key={design.design_id} design={design} />
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <FiSearch style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }} />
          <h3 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>
            No designs found
          </h3>
          <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
            No designs match your search for "{query}"
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/designs" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Browse All Designs
            </Link>
            <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {results.length === 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Search Tips</h3>
          <ul style={{ color: '#6c757d', paddingLeft: '1.5rem' }}>
            <li>Try searching by design ID (e.g., "MRO32920")</li>
            <li>Search by designer name</li>
            <li>Look for box types like "OPF", "Folder", "Air Cell"</li>
            <li>Search by board specifications like "32ECT"</li>
            <li>Use partial matches - you don't need to type the full term</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
