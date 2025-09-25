import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPercent, FiPackage } from 'react-icons/fi';

const PricingTiers = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMRO, setSelectedMRO] = useState(null);

  useEffect(() => {
    // Mock data for pricing tiers
    const mockPricingData = [
      {
        mro_number: 'MRO40611',
        description: 'Custom Shipping Box - Electronics',
        base_cost: 24.44,
        pricing_tiers: [
          { quantity_min: 100, quantity_max: 499, unit_price: 30.55, markup_percentage: 25, total_revenue: 3055 },
          { quantity_min: 500, quantity_max: 999, unit_price: 29.33, markup_percentage: 20, total_revenue: 14665 },
          { quantity_min: 1000, quantity_max: 2499, unit_price: 28.11, markup_percentage: 15, total_revenue: 28110 },
          { quantity_min: 2500, quantity_max: 4999, unit_price: 27.37, markup_percentage: 12, total_revenue: 68425 },
          { quantity_min: 5000, quantity_max: 9999, unit_price: 26.88, markup_percentage: 10, total_revenue: 134400 }
        ]
      },
      {
        mro_number: 'MRO32920',
        description: 'Retail Display Box',
        base_cost: 35.94,
        pricing_tiers: [
          { quantity_min: 100, quantity_max: 499, unit_price: 42.41, markup_percentage: 18, total_revenue: 4241 },
          { quantity_min: 500, quantity_max: 999, unit_price: 40.81, markup_percentage: 15, total_revenue: 20405 },
          { quantity_min: 1000, quantity_max: 2499, unit_price: 39.21, markup_percentage: 12, total_revenue: 39210 },
          { quantity_min: 2500, quantity_max: 4999, unit_price: 38.16, markup_percentage: 10, total_revenue: 95400 },
          { quantity_min: 5000, quantity_max: 9999, unit_price: 37.48, markup_percentage: 8, total_revenue: 187400 }
        ]
      },
      {
        mro_number: 'MRO35174',
        description: 'Protective Packaging',
        base_cost: 18.75,
        pricing_tiers: [
          { quantity_min: 100, quantity_max: 499, unit_price: 23.44, markup_percentage: 25, total_revenue: 2344 },
          { quantity_min: 500, quantity_max: 999, unit_price: 22.50, markup_percentage: 20, total_revenue: 11250 },
          { quantity_min: 1000, quantity_max: 2499, unit_price: 21.56, markup_percentage: 15, total_revenue: 21560 },
          { quantity_min: 2500, quantity_max: 4999, unit_price: 21.00, markup_percentage: 12, total_revenue: 52500 },
          { quantity_min: 5000, quantity_max: 9999, unit_price: 20.63, markup_percentage: 10, total_revenue: 103150 }
        ]
      }
    ];

    setPricingData(mockPricingData);
    setLoading(false);
  }, []);

  const calculateProfitMargin = (unitPrice, baseCost) => {
    return ((unitPrice - baseCost) / baseCost) * 100;
  };

  const getMarkupColor = (markup) => {
    if (markup >= 20) return '#28a745';
    if (markup >= 15) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading Pricing Tiers...</div>
      </div>
    );
  }

  return (
    <div className="pricing-tiers">
      <div className="page-header">
        <h1>
          <FiDollarSign style={{ marginRight: '0.5rem' }} />
          Pricing Tiers
        </h1>
        <p>Manage pricing tiers and markup strategies for different quantities</p>
      </div>

      <div className="pricing-overview">
        <div className="grid grid-3">
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Total Projects</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
              {pricingData.length}
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Average Markup</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              15.2%
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Total Revenue</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
              $485,000
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-projects">
        {pricingData.map((project) => (
          <div key={project.mro_number} className="pricing-project-card">
            <div className="project-header">
              <div className="project-title">
                <FiPackage style={{ marginRight: '0.25rem' }} />
                {project.mro_number}
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedMRO(selectedMRO === project.mro_number ? null : project.mro_number)}
              >
                {selectedMRO === project.mro_number ? 'Hide' : 'View'} Details
              </button>
            </div>

            <div className="project-body">
              <h3>{project.description}</h3>
              <div className="project-summary">
                <div className="summary-item">
                  <span className="summary-label">Base Cost:</span>
                  <span className="summary-value">${project.base_cost.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Tiers:</span>
                  <span className="summary-value">{project.pricing_tiers.length}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Max Markup:</span>
                  <span className="summary-value">{Math.max(...project.pricing_tiers.map(t => t.markup_percentage))}%</span>
                </div>
              </div>
            </div>

            {selectedMRO === project.mro_number && (
              <div className="pricing-tiers-detail">
                <h4>Pricing Tiers Breakdown</h4>
                <div className="tiers-table">
                  <div className="tiers-header">
                    <span>Quantity Range</span>
                    <span>Unit Price</span>
                    <span>Markup %</span>
                    <span>Profit Margin</span>
                    <span>Total Revenue</span>
                  </div>
                  {project.pricing_tiers.map((tier, index) => (
                    <div key={index} className="tiers-row">
                      <span>{tier.quantity_min.toLocaleString()} - {tier.quantity_max.toLocaleString()}</span>
                      <span>${tier.unit_price.toFixed(2)}</span>
                      <span 
                        style={{ color: getMarkupColor(tier.markup_percentage) }}
                      >
                        {tier.markup_percentage}%
                      </span>
                      <span>{calculateProfitMargin(tier.unit_price, project.base_cost).toFixed(1)}%</span>
                      <span>${tier.total_revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="tier-analysis">
                  <h5>Analysis</h5>
                  <div className="analysis-items">
                    <div className="analysis-item">
                      <FiTrendingUp style={{ color: '#28a745', marginRight: '0.25rem' }} />
                      <span>Best margin tier: {Math.max(...project.pricing_tiers.map(t => t.markup_percentage))}%</span>
                    </div>
                    <div className="analysis-item">
                      <FiDollarSign style={{ color: '#007bff', marginRight: '0.25rem' }} />
                      <span>Highest revenue: ${Math.max(...project.pricing_tiers.map(t => t.total_revenue)).toLocaleString()}</span>
                    </div>
                    <div className="analysis-item">
                      <FiPercent style={{ color: '#ffc107', marginRight: '0.25rem' }} />
                      <span>Average markup: {(project.pricing_tiers.reduce((sum, t) => sum + t.markup_percentage, 0) / project.pricing_tiers.length).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pricing Strategy Recommendations */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Pricing Strategy Recommendations</h3>
        <div className="recommendations">
          <div className="recommendation-item">
            <div className="recommendation-icon">
              <FiTrendingUp />
            </div>
            <div className="recommendation-content">
              <h4>Volume Discount Strategy</h4>
              <p>Consider reducing markup for quantities above 5000 to increase competitiveness and volume.</p>
            </div>
          </div>
          <div className="recommendation-item">
            <div className="recommendation-icon">
              <FiDollarSign />
            </div>
            <div className="recommendation-content">
              <h4>Premium Pricing</h4>
              <p>MRO32920 shows strong performance with 18% markup - consider similar strategy for complex designs.</p>
            </div>
          </div>
          <div className="recommendation-item">
            <div className="recommendation-icon">
              <FiPercent />
            </div>
            <div className="recommendation-content">
              <h4>Margin Optimization</h4>
              <p>Focus on 100-499 quantity range for highest margins while maintaining competitive pricing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTiers;









