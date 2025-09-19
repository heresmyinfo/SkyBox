import React from 'react';
import { FiFile, FiDatabase, FiEye, FiDownload, FiArrowRight } from 'react-icons/fi';

const WorkflowDiagram = () => {
  const WorkflowStep = ({ icon: Icon, title, description, color, fileType, fileCount, dateRange }) => (
    <div className="workflow-step">
      <div className="workflow-icon" style={{ backgroundColor: color }}>
        <Icon />
      </div>
      <div className="workflow-content">
        <h4>{title}</h4>
        <p>{description}</p>
        {fileType && (
          <div className="workflow-details">
            <span className="file-type">{fileType}</span>
            <span className="file-count">{fileCount} files</span>
            {dateRange && <span className="date-range">{dateRange}</span>}
          </div>
        )}
      </div>
    </div>
  );

  const Arrow = () => (
    <div className="workflow-arrow">
      <FiArrowRight />
    </div>
  );

  return (
    <div className="workflow-container">
      <div className="workflow-header">
        <h2>Data Workflow Process</h2>
        <p>Understanding how design data flows from ArtiosCAD to SkyBox</p>
      </div>
      
      <div className="workflow-diagram">
        <WorkflowStep
          icon={FiFile}
          title="ArtiosCAD Design Files"
          description="Original cardboard box designs created in ArtiosCAD software"
          color="#007bff"
          fileType="ARD Files"
          fileCount="20"
          dateRange="Mar 2023 - Sep 2024"
        />
        
        <Arrow />
        
        <WorkflowStep
          icon={FiEye}
          title="ERP System Integration"
          description="Design data imported into business ERP system for manufacturing"
          color="#28a745"
          fileType="PDF Screenshots"
          fileCount="20"
          dateRange="Sep 9, 2025"
        />
        
        <Arrow />
        
        <WorkflowStep
          icon={FiDownload}
          title="Data Extraction"
          description="Structured data extracted from ARD files for application use"
          color="#ffc107"
          fileType="TXT Files"
          fileCount="20"
          dateRange="Sep 17, 2025"
        />
        
        <Arrow />
        
        <WorkflowStep
          icon={FiDatabase}
          title="SkyBox Database"
          description="Design data imported into SkyBox for management and search"
          color="#dc3545"
          fileType="Database Records"
          fileCount="20 designs"
          dateRange="Current"
        />
      </div>
      
      <div className="workflow-details-section">
        <div className="workflow-info">
          <h3>File Relationships</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>ARD Files (84KB - 176KB)</strong>
              <p>Native ArtiosCAD design files containing complete cardboard design data including dimensions, materials, and manufacturing specifications.</p>
            </div>
            <div className="info-item">
              <strong>PDF Files (6.5KB - 6.8KB)</strong>
              <p>ERP system screenshots showing how design data appears in the business system interface. All created on the same date indicating batch export.</p>
            </div>
            <div className="info-item">
              <strong>TXT Files (3.5KB - 14KB)</strong>
              <p>Parsed data extracted from ARD files containing structured design information for database import into SkyBox.</p>
            </div>
          </div>
        </div>
        
        <div className="workflow-benefits">
          <h3>Benefits of This Workflow</h3>
          <ul>
            <li><strong>Data Integrity:</strong> Original design files preserved while enabling business system integration</li>
            <li><strong>Visual Documentation:</strong> PDF screenshots provide visual reference for ERP system data display</li>
            <li><strong>Structured Access:</strong> Parsed data enables searchable, manageable design information</li>
            <li><strong>Traceability:</strong> Complete audit trail from design creation to application data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
