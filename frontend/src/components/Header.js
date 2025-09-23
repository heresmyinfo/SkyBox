import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHome, FiFileText, FiSettings, FiTrendingUp, FiDollarSign, FiGitBranch, FiGrid } from 'react-icons/fi';

const Header = ({ stats }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 0',
      marginBottom: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Logo and Title */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            <img 
              src="/logo.png" 
              alt="SkyBox Logo" 
              style={{ 
                marginRight: '0.5rem', 
                height: '9rem', 
                width: 'auto' 
              }} 
            />
            SkyBox MRO Management
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '25px',
            padding: '0.5rem 1rem',
            minWidth: '300px'
          }}>
            <input
              type="text"
              placeholder="Search MRO drawings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                outline: 'none',
                flex: 1,
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              <FiSearch />
            </button>
          </form>

          {/* Navigation */}
          <nav style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}>
              <FiHome style={{ marginRight: '0.25rem' }} />
              Dashboard
            </Link>
            <Link to="/mro-drawings" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}>
              <FiFileText style={{ marginRight: '0.25rem' }} />
              MRO Drawings
            </Link>
            <Link to="/mtech-specs" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}>
              <FiSettings style={{ marginRight: '0.25rem' }} />
              MTECH Specs
            </Link>
            <Link to="/machine-routing" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}>
              <FiTrendingUp style={{ marginRight: '0.25rem' }} />
              Machine Routing
            </Link>
            <Link to="/pricing-tiers" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}>
              <FiDollarSign style={{ marginRight: '0.25rem' }} />
              Pricing Tiers
            </Link>
            <Link to="/workflow" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}>
              <FiGitBranch style={{ marginRight: '0.25rem' }} />
              Workflow
            </Link>
            <Link to="/interact" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}>
              <FiGrid style={{ marginRight: '0.25rem' }} />
              INTERACT Output
            </Link>
          </nav>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats.totalDesigns}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                MRO Drawings
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats.mtechSpecs || 0}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                MTECH Specs
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats.quotedProjects || 0}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Quoted Projects
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
