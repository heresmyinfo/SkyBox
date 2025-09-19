import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPercent, FiPackage } from 'react-icons/fi';

const DataVisualization = () => {
  const [visualizationData, setVisualizationData] = useState(null);
  const [selectedView, setSelectedView] = useState('costFlow');

  useEffect(() => {
    // Mock data - in real app this would come from API
    const mockData = [
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

    setVisualizationData(mockData);
  }, []);

  const CostFlowDiagram = ({ design }) => {
    const materialPercentage = (design.subtotal_materials / design.full_cost) * 100;
    const overheadPercentage = (design.fixed_overheads / design.full_cost) * 100;
    const profitPercentage = (design.profit_cost / design.full_cost) * 100;

    return (
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#007bff', marginBottom: '1rem', textAlign: 'center' }}>
          Cost Flow Diagram - {design.design_id}
        </h3>
        
        {/* Visual Flow Chart */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          {/* Input Stage */}
          <div style={{
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            textAlign: 'center',
            minWidth: '200px',
            boxShadow: '0 4px 8px rgba(0,123,255,0.3)'
          }}>
            <FiPackage style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Raw Materials</div>
            <div style={{ fontSize: '0.9rem' }}>${design.board_cost.toFixed(2)}</div>
          </div>

          {/* Arrow Down */}
          <div style={{ fontSize: '2rem', color: '#007bff', marginBottom: '1rem' }}>↓</div>

          {/* Processing Stage */}
          <div style={{
            background: 'linear-gradient(135deg, #28a745, #1e7e34)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            textAlign: 'center',
            minWidth: '200px',
            boxShadow: '0 4px 8px rgba(40,167,69,0.3)'
          }}>
            <FiTrendingUp style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Processing</div>
            <div style={{ fontSize: '0.9rem' }}>+${design.converting_costs.toFixed(2)}</div>
          </div>

          {/* Arrow Down */}
          <div style={{ fontSize: '2rem', color: '#28a745', marginBottom: '1rem' }}>↓</div>

          {/* Cost Breakdown */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            {/* Materials */}
            <div style={{
              background: 'linear-gradient(135deg, #ffc107, #e0a800)',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              textAlign: 'center',
              minWidth: '120px',
              boxShadow: '0 4px 8px rgba(255,193,7,0.3)'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Materials</div>
              <div style={{ fontSize: '0.8rem' }}>${design.subtotal_materials.toFixed(2)}</div>
              <div style={{ fontSize: '0.7rem' }}>({materialPercentage.toFixed(1)}%)</div>
            </div>

            {/* Overhead */}
            <div style={{
              background: 'linear-gradient(135deg, #dc3545, #c82333)',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              textAlign: 'center',
              minWidth: '120px',
              boxShadow: '0 4px 8px rgba(220,53,69,0.3)'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Overhead</div>
              <div style={{ fontSize: '0.8rem' }}>${design.fixed_overheads.toFixed(2)}</div>
              <div style={{ fontSize: '0.7rem' }}>({overheadPercentage.toFixed(1)}%)</div>
            </div>

            {/* Profit */}
            <div style={{
              background: 'linear-gradient(135deg, #6f42c1, #5a32a3)',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              textAlign: 'center',
              minWidth: '120px',
              boxShadow: '0 4px 8px rgba(111,66,193,0.3)'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Profit</div>
              <div style={{ fontSize: '0.8rem' }}>${design.profit_cost.toFixed(2)}</div>
              <div style={{ fontSize: '0.7rem' }}>({profitPercentage.toFixed(1)}%)</div>
            </div>
          </div>

          {/* Arrow Down */}
          <div style={{ fontSize: '2rem', color: '#6f42c1', marginBottom: '1rem' }}>↓</div>

          {/* Final Output */}
          <div style={{
            background: 'linear-gradient(135deg, #17a2b8, #138496)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            textAlign: 'center',
            minWidth: '200px',
            boxShadow: '0 4px 8px rgba(23,162,184,0.3)'
          }}>
            <FiDollarSign style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Cost</div>
            <div style={{ fontSize: '0.9rem' }}>${design.full_cost.toFixed(2)}</div>
          </div>
        </div>

        {/* Pricing Tiers Visualization */}
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ color: '#333', marginBottom: '1rem', textAlign: 'center' }}>
            Pricing Tiers Visualization
          </h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            {design.pricing_tiers.map((tier, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #e9ecef, #dee2e6)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                minWidth: '120px',
                border: '2px solid #007bff'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>
                  {tier.quantity} units
                </div>
                <div style={{ fontSize: '1rem', color: '#333', marginTop: '0.5rem' }}>
                  ${tier.price.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.25rem' }}>
                  ${(tier.price / tier.quantity).toFixed(2)}/unit
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ComparisonChart = () => {
    if (!visualizationData || visualizationData.length < 2) return null;

    const design1 = visualizationData[0];
    const design2 = visualizationData[1];

    const maxCost = Math.max(design1.full_cost, design2.full_cost);
    const maxProfit = Math.max(design1.profit_cost, design2.profit_cost);

    return (
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#007bff', marginBottom: '1rem', textAlign: 'center' }}>
          Design Comparison Chart
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'end', height: '300px' }}>
          {/* Design 1 */}
          <div style={{ textAlign: 'center', width: '45%' }}>
            <div style={{ 
              background: 'linear-gradient(to top, #007bff, #0056b3)',
              height: `${(design1.full_cost / maxCost) * 200}px`,
              borderRadius: '8px 8px 0 0',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem'
            }}>
              ${design1.full_cost.toFixed(0)}
            </div>
            <div style={{ 
              background: 'linear-gradient(to top, #28a745, #1e7e34)',
              height: `${(design1.profit_cost / maxProfit) * 100}px`,
              borderRadius: '8px 8px 0 0',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem'
            }}>
              ${design1.profit_cost.toFixed(0)}
            </div>
            <div style={{ fontWeight: 'bold', color: '#333' }}>{design1.design_id}</div>
            <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Full Cost / Profit</div>
          </div>

          {/* Design 2 */}
          <div style={{ textAlign: 'center', width: '45%' }}>
            <div style={{ 
              background: 'linear-gradient(to top, #dc3545, #c82333)',
              height: `${(design2.full_cost / maxCost) * 200}px`,
              borderRadius: '8px 8px 0 0',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem'
            }}>
              ${design2.full_cost.toFixed(0)}
            </div>
            <div style={{ 
              background: 'linear-gradient(to top, #ffc107, #e0a800)',
              height: `${(design2.profit_cost / maxProfit) * 100}px`,
              borderRadius: '8px 8px 0 0',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem'
            }}>
              ${design2.profit_cost.toFixed(0)}
            </div>
            <div style={{ fontWeight: 'bold', color: '#333' }}>{design2.design_id}</div>
            <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Full Cost / Profit</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          marginTop: '1rem',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', background: '#007bff', borderRadius: '4px' }}></div>
            <span>Full Cost</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', background: '#28a745', borderRadius: '4px' }}></div>
            <span>Profit</span>
          </div>
        </div>
      </div>
    );
  };

  const PieChart = ({ design }) => {
    const materialPercentage = (design.subtotal_materials / design.full_cost) * 100;
    const overheadPercentage = (design.fixed_overheads / design.full_cost) * 100;
    const profitPercentage = (design.profit_cost / design.full_cost) * 100;

    // Create SVG pie chart
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    
    const materialArc = (materialPercentage / 100) * circumference;
    const overheadArc = (overheadPercentage / 100) * circumference;
    const profitArc = (profitPercentage / 100) * circumference;

    return (
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#007bff', marginBottom: '1rem', textAlign: 'center' }}>
          Cost Distribution - {design.design_id}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* SVG Pie Chart */}
          <div style={{ marginRight: '2rem' }}>
            <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#e9ecef"
                strokeWidth="20"
              />
              
              {/* Material segment */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#ffc107"
                strokeWidth="20"
                strokeDasharray={`${materialArc} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              
              {/* Overhead segment */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#dc3545"
                strokeWidth="20"
                strokeDasharray={`${overheadArc} ${circumference}`}
                strokeDashoffset={`-${materialArc}`}
                strokeLinecap="round"
              />
              
              {/* Profit segment */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#6f42c1"
                strokeWidth="20"
                strokeDasharray={`${profitArc} ${circumference}`}
                strokeDashoffset={`-${materialArc + overheadArc}`}
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: '#ffc107', borderRadius: '4px' }}></div>
              <span style={{ fontWeight: 'bold' }}>Materials: {materialPercentage.toFixed(1)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: '#dc3545', borderRadius: '4px' }}></div>
              <span style={{ fontWeight: 'bold' }}>Overhead: {overheadPercentage.toFixed(1)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: '#6f42c1', borderRadius: '4px' }}></div>
              <span style={{ fontWeight: 'bold' }}>Profit: {profitPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!visualizationData) {
    return <div className="loading">Loading visualization data...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
          Data Visualization
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
          Interactive visual representations of cost data relationships
        </p>
      </div>

      {/* View Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <button
          onClick={() => setSelectedView('costFlow')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '5px',
            background: selectedView === 'costFlow' ? '#007bff' : '#e9ecef',
            color: selectedView === 'costFlow' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cost Flow Diagrams
        </button>
        <button
          onClick={() => setSelectedView('comparison')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '5px',
            background: selectedView === 'comparison' ? '#007bff' : '#e9ecef',
            color: selectedView === 'comparison' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Comparison Charts
        </button>
        <button
          onClick={() => setSelectedView('pieCharts')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '5px',
            background: selectedView === 'pieCharts' ? '#007bff' : '#e9ecef',
            color: selectedView === 'pieCharts' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Pie Charts
        </button>
      </div>

      {/* Render Selected View */}
      {selectedView === 'costFlow' && (
        <div>
          {visualizationData.map((design, index) => (
            <CostFlowDiagram key={index} design={design} />
          ))}
        </div>
      )}

      {selectedView === 'comparison' && (
        <ComparisonChart />
      )}

      {selectedView === 'pieCharts' && (
        <div className="grid grid-2">
          {visualizationData.map((design, index) => (
            <PieChart key={index} design={design} />
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Visualization Summary</h3>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', lineHeight: '1.5' }}>
          These visualizations show the mathematical relationships between cost components, 
          pricing structures, and design comparisons. The flow diagrams illustrate how costs 
          accumulate from raw materials to final pricing, while comparison charts highlight 
          differences between designs. Pie charts provide a clear view of cost distribution 
          percentages across materials, overhead, and profit components.
        </p>
      </div>
    </div>
  );
};

export default DataVisualization;

