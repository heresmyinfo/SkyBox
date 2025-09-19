import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiUser, FiCalendar, FiMaximize, FiFile, FiDownload } from 'react-icons/fi';
import { designAPI } from '../services/api';

const DesignDetail = () => {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const response = await designAPI.getDesignById(id);
        setDesign(response.data);
      } catch (err) {
        setError('Failed to load design details');
        console.error('Error fetching design:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [id]);

  const InfoCard = ({ title, children, icon: Icon }) => (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        {Icon && <Icon style={{ marginRight: '0.5rem', color: '#007bff' }} />}
        <h3 style={{ margin: 0, color: '#333' }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  const DimensionRow = ({ label, value, unit = 'inches' }) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '0.5rem 0',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <span style={{ fontWeight: '500' }}>{label}:</span>
      <span style={{ color: '#6c757d' }}>
        {value ? `${value} ${unit}` : 'N/A'}
      </span>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading design details...</div>;
  }

  if (error) {
    return (
      <div>
        <Link to="/designs" className="btn btn-secondary" style={{ textDecoration: 'none', marginBottom: '1rem' }}>
          <FiArrowLeft style={{ marginRight: '0.5rem' }} />
          Back to Designs
        </Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!design) {
    return (
      <div>
        <Link to="/designs" className="btn btn-secondary" style={{ textDecoration: 'none', marginBottom: '1rem' }}>
          <FiArrowLeft style={{ marginRight: '0.5rem' }} />
          Back to Designs
        </Link>
        <div className="error">Design not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/designs" className="btn btn-secondary" style={{ textDecoration: 'none', marginBottom: '1rem' }}>
          <FiArrowLeft style={{ marginRight: '0.5rem' }} />
          Back to Designs
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
              {design.design.design_id}
            </h1>
            {design.design.description && (
              <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                {design.design.description}
              </p>
            )}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {design.design.designer && (
                <div style={{ display: 'flex', alignItems: 'center', color: '#6c757d' }}>
                  <FiUser style={{ marginRight: '0.25rem' }} />
                  {design.design.designer}
                </div>
              )}
              {design.design.created_date && (
                <div style={{ display: 'flex', alignItems: 'center', color: '#6c757d' }}>
                  <FiCalendar style={{ marginRight: '0.25rem' }} />
                  {new Date(design.design.created_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ 
            background: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '8px',
            minWidth: '200px'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>
              Design Statistics
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Components:</span>
              <span style={{ fontWeight: 'bold' }}>{design.design.components_count || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Parts Required:</span>
              <span style={{ fontWeight: 'bold' }}>{design.design.parts_required || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-2">
        {/* Dimensions */}
        {design.dimensions && design.dimensions.length > 0 && (
          <InfoCard title="Dimensions" icon={FiMaximize}>
            {design.dimensions.map((dim, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#007bff', marginBottom: '0.5rem' }}>
                  {dim.dimension_type}
                </h4>
                <DimensionRow label="Length" value={dim.length} />
                <DimensionRow label="Width" value={dim.width} />
                <DimensionRow label="Height" value={dim.height} />
                <DimensionRow label="Depth" value={dim.depth} />
              </div>
            ))}
          </InfoCard>
        )}

        {/* Specifications */}
        {design.specifications && design.specifications.length > 0 && (
          <InfoCard title="Box Specifications" icon={FiPackage}>
            {design.specifications.map((spec, index) => (
              <div key={index}>
                {spec.box_type && (
                  <DimensionRow label="Box Type" value={spec.box_type} unit="" />
                )}
                {spec.board_type && (
                  <DimensionRow label="Board Type" value={spec.board_type} unit="" />
                )}
                {spec.flute_type && (
                  <DimensionRow label="Flute Type" value={spec.flute_type} unit="" />
                )}
                {spec.material_description && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Material Description:</strong>
                    <p style={{ color: '#6c757d', marginTop: '0.5rem' }}>
                      {spec.material_description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </InfoCard>
        )}

        {/* Design Information */}
        <InfoCard title="Design Information">
          {design.design.grain_corr && (
            <DimensionRow label="Grain/Corr" value={design.design.grain_corr} unit="" />
          )}
          {design.design.side_shown && (
            <DimensionRow label="Side Shown" value={design.design.side_shown} unit="" />
          )}
          {design.design.total_rule && (
            <DimensionRow label="Total Rule" value={design.design.total_rule} unit="" />
          )}
          {design.design.blank_size && (
            <DimensionRow label="Blank Size" value={design.design.blank_size} unit="" />
          )}
          {design.design.mfg_joint && (
            <DimensionRow label="Mfg Joint" value={design.design.mfg_joint} unit="" />
          )}
          {design.design.specific_rule && (
            <DimensionRow label="Specific Rule" value={design.design.specific_rule} unit="" />
          )}
        </InfoCard>

        {/* Files */}
        {design.files && design.files.length > 0 && (
          <InfoCard title="Files" icon={FiFile}>
            {design.files.map((file, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>
                    {file.file_type} File
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                    {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : 'Unknown size'}
                  </div>
                </div>
                <button 
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    // In a real application, this would download the file
                    alert(`Download ${file.file_type} file: ${file.file_path}`);
                  }}
                >
                  <FiDownload style={{ marginRight: '0.25rem' }} />
                  Download
                </button>
              </div>
            ))}
          </InfoCard>
        )}
      </div>

      {/* Parameters */}
      {design.parameters && design.parameters.length > 0 && (
        <InfoCard title="Design Parameters" style={{ marginTop: '2rem' }}>
          <div className="grid grid-3">
            {design.parameters.map((param, index) => (
              <div key={index} style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '5px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  {param.parameter_name}
                </div>
                <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                  {param.parameter_value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#adb5bd', marginTop: '0.25rem' }}>
                  {param.parameter_type}
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      )}
    </div>
  );
};

export default DesignDetail;
