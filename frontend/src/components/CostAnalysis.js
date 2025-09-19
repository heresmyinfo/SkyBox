import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiPackage, FiBarChart, FiUsers } from 'react-icons/fi';

const CostAnalysis = () => {
  const [costData, setCostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load cost data from the extracted JSON
    const loadCostData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use the static data we extracted
        const mockCostData = [
          {
            design_id: "MRO32920",
            customer_name: "ACCHROMA",
            box_size: "22.00 x 10.00 x 1.12",
            box_style: "OPF",
            board_grade: "32ECT",
            unit_count: 500,
            board_cost: 331.81,
            total_board_cost: 331.81,
            subtotal_materials: 347.8,
            converting_costs: 0.33,
            direct_cost: 348.47,
            fixed_mfg_overhead: 71.62,
            selling_overheads: 6.14,
            fixed_overheads: 144.61,
            full_cost: 493.08,
            profit_cost: 55.13,
            pricing_tiers: [
              { quantity: 500, price: 2101.0 },
              { quantity: 1000, price: 1750.0 }
            ]
          },
          {
            design_id: "MRO35174",
            customer_name: "ACADEMY GRAPHIC COMMUNICATION",
            box_size: "11.04 x 8.12 x 10.00",
            box_style: "RSC",
            board_grade: "200",
            unit_count: 500,
            board_cost: 371.46,
            total_board_cost: 371.46,
            subtotal_materials: 391.55,
            converting_costs: 11.14,
            direct_cost: 402.69,
            fixed_mfg_overhead: 49.5,
            selling_overheads: 5.85,
            fixed_overheads: 167.12,
            full_cost: 569.81,
            profit_cost: 50.0,
            pricing_tiers: [
              { quantity: 500, price: 1248.0 },
              { quantity: 1000, price: 997.0 }
            ]
          }
        ];
        
        setCostData(mockCostData);
      } catch (err) {
        setError('Failed to load cost data');
        console.error('Error loading cost data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCostData();
  }, []);

  const CostCard = ({ icon: Icon, title, value, color = '#007bff', subtitle = '' }) => (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ color, fontSize: '2rem', marginBottom: '1rem' }}>
        <Icon />
      </div>
      <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#333' }}>
        ${value.toLocaleString()}
      </h3>
      <p style={{ color: '#6c757d', fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</p>
      {subtitle && <p style={{ color: '#6c757d', fontSize: '0.8rem' }}>{subtitle}</p>}
    </div>
  );

  const DesignCostCard = ({ design }) => (
    <div className="card">
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
          {design.box_style}
        </span>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <strong>Customer:</strong> {design.customer_name}
        </p>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <strong>Box Size:</strong> {design.box_size}
        </p>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <strong>Board Grade:</strong> {design.board_grade}
        </p>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <strong>Unit Count:</strong> {design.unit_count.toLocaleString()}
        </p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ 
          padding: '0.5rem',
          background: '#f8f9fa',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Full Cost</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#dc3545' }}>
            ${design.full_cost.toLocaleString()}
          </div>
        </div>
        <div style={{ 
          padding: '0.5rem',
          background: '#f8f9fa',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Profit</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
            ${design.profit_cost.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h5 style={{ fontSize: '0.9rem', color: '#333', marginBottom: '0.5rem' }}>Cost Breakdown:</h5>
        <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Materials:</span>
            <span>${design.subtotal_materials.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Converting:</span>
            <span>${design.converting_costs.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Overhead:</span>
            <span>${design.fixed_overheads.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {design.pricing_tiers && design.pricing_tiers.length > 0 && (
        <div>
          <h5 style={{ fontSize: '0.9rem', color: '#333', marginBottom: '0.5rem' }}>Pricing Tiers:</h5>
          {design.pricing_tiers.map((tier, index) => (
            <div key={index} style={{ 
              fontSize: '0.8rem', 
              color: '#6c757d',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.25rem'
            }}>
              <span>{tier.quantity.toLocaleString()} units:</span>
              <span>${tier.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="loading">Loading cost analysis...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Calculate summary statistics
  const totalFullCost = costData.reduce((sum, design) => sum + design.full_cost, 0);
  const totalProfit = costData.reduce((sum, design) => sum + design.profit_cost, 0);
  const avgFullCost = totalFullCost / costData.length;
  const avgProfit = totalProfit / costData.length;
  const profitMargin = totalProfit / totalFullCost * 100;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
          Cost & Profit Analysis
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
          Financial analysis extracted from ERP system cost reports
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
        <CostCard 
          icon={FiDollarSign} 
          title="Total Full Cost" 
          value={totalFullCost}
          color="#dc3545"
          subtitle="All designs combined"
        />
        <CostCard 
          icon={FiTrendingUp} 
          title="Total Profit" 
          value={totalProfit}
          color="#28a745"
          subtitle="Revenue potential"
        />
        <CostCard 
          icon={FiBarChart} 
          title="Average Cost" 
          value={avgFullCost}
          color="#007bff"
          subtitle="Per design"
        />
        <CostCard 
          icon={FiUsers} 
          title="Profit Margin" 
          value={profitMargin}
          color="#ffc107"
          subtitle={`${profitMargin.toFixed(1)}%`}
        />
      </div>

      {/* Individual Design Costs */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1rem' }}>
          Design Cost Breakdown
        </h2>
        
        <div className="grid grid-2">
          {costData.map((design) => (
            <DesignCostCard key={design.design_id} design={design} />
          ))}
        </div>
      </div>

      {/* Data Source Information */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Data Source</h3>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Cost and profit data extracted from ERP system cost estimating reports (PDF files) 
          using OCR technology. This data represents actual manufacturing costs including 
          materials, labor, overhead, and profit margins for cardboard box designs.
        </p>
        <div style={{ 
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: '#495057'
        }}>
          <strong>Note:</strong> Data extracted from {costData.length} cost reports. 
          Full cost includes materials, converting costs, manufacturing overhead, 
          and selling overhead. Profit represents the margin above full cost.
        </div>
      </div>
    </div>
  );
};

export default CostAnalysis;
