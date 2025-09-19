import React, { useState, useEffect } from 'react';
import { FiBarChart, FiTrendingUp, FiTrendingDown, FiPercent, FiDollarSign, FiPackage } from 'react-icons/fi';

const NumberRelationships = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // Calculate relationships and patterns
    const analysis = calculateRelationships(mockData);
    setAnalysisData(analysis);
    setLoading(false);
  }, []);

  const calculateRelationships = (data) => {
    const relationships = {
      costStructure: [],
      pricingPatterns: [],
      efficiencyMetrics: [],
      comparisons: [],
      formulas: []
    };

    data.forEach(design => {
      // Cost Structure Analysis
      const materialPercentage = (design.subtotal_materials / design.full_cost) * 100;
      const overheadPercentage = (design.fixed_overheads / design.full_cost) * 100;
      const convertingPercentage = (design.converting_costs / design.full_cost) * 100;
      const profitMargin = (design.profit_cost / design.full_cost) * 100;

      relationships.costStructure.push({
        design_id: design.design_id,
        materialPercentage,
        overheadPercentage,
        convertingPercentage,
        profitMargin,
        costPerUnit: design.full_cost / design.unit_count,
        profitPerUnit: design.profit_cost / design.unit_count
      });

      // Pricing Pattern Analysis
      if (design.pricing_tiers.length >= 2) {
        const price500 = design.pricing_tiers.find(t => t.quantity === 500)?.price || 0;
        const price1000 = design.pricing_tiers.find(t => t.quantity === 1000)?.price || 0;
        const priceReduction = ((price500 - price1000) / price500) * 100;
        const volumeDiscount = price500 - price1000;

        relationships.pricingPatterns.push({
          design_id: design.design_id,
          price500,
          price1000,
          priceReduction,
          volumeDiscount,
          pricePerUnit500: price500 / 500,
          pricePerUnit1000: price1000 / 1000
        });
      }

      // Efficiency Metrics
      const materialEfficiency = design.board_cost / design.subtotal_materials;
      const overheadRatio = design.fixed_overheads / design.direct_cost;
      const totalOverhead = design.fixed_mfg_overhead + design.selling_overheads + design.fixed_overheads;

      relationships.efficiencyMetrics.push({
        design_id: design.design_id,
        materialEfficiency,
        overheadRatio,
        totalOverhead,
        overheadToDirectRatio: totalOverhead / design.direct_cost
      });
    });

    // Cross-Design Comparisons
    if (data.length >= 2) {
      const design1 = data[0];
      const design2 = data[1];
      
      relationships.comparisons = {
        costDifference: design2.full_cost - design1.full_cost,
        costDifferencePercentage: ((design2.full_cost - design1.full_cost) / design1.full_cost) * 100,
        profitDifference: design2.profit_cost - design1.profit_cost,
        profitDifferencePercentage: ((design2.profit_cost - design1.profit_cost) / design1.profit_cost) * 100,
        materialCostDifference: design2.subtotal_materials - design1.subtotal_materials,
        overheadDifference: design2.fixed_overheads - design1.fixed_overheads
      };
    }

    // Mathematical Formulas Identified
    relationships.formulas = [
      {
        name: "Full Cost Formula",
        formula: "Full Cost = Direct Cost + Fixed Overheads",
        description: "The total manufacturing cost includes direct costs plus all overhead allocations"
      },
      {
        name: "Direct Cost Formula", 
        formula: "Direct Cost = Subtotal Materials + Converting Costs",
        description: "Direct costs are the sum of material costs and converting/labor costs"
      },
      {
        name: "Profit Margin Formula",
        formula: "Profit Margin % = (Profit Cost / Full Cost) × 100",
        description: "Profit margin is calculated as a percentage of the full cost"
      },
      {
        name: "Volume Discount Formula",
        formula: "Volume Discount = Price(500) - Price(1000)",
        description: "Volume discounts are calculated as the difference between pricing tiers"
      },
      {
        name: "Cost Per Unit Formula",
        formula: "Cost Per Unit = Full Cost / Unit Count",
        description: "Unit cost is the total cost divided by the number of units"
      }
    ];

    return relationships;
  };

  const RelationshipCard = ({ icon: Icon, title, value, subtitle, color = '#007bff', trend = null }) => (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ color, fontSize: '2rem', marginBottom: '1rem' }}>
        <Icon />
      </div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>
        {value}
      </h3>
      <p style={{ color: '#6c757d', fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</p>
      {subtitle && <p style={{ color: '#6c757d', fontSize: '0.8rem' }}>{subtitle}</p>}
      {trend && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginTop: '0.5rem',
          color: trend > 0 ? '#28a745' : '#dc3545'
        }}>
          {trend > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
          <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem' }}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );

  const FormulaCard = ({ formula }) => (
    <div className="card">
      <h4 style={{ color: '#007bff', marginBottom: '0.5rem' }}>{formula.name}</h4>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '0.75rem', 
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
        color: '#495057'
      }}>
        {formula.formula}
      </div>
      <p style={{ color: '#6c757d', fontSize: '0.85rem', margin: 0 }}>
        {formula.description}
      </p>
    </div>
  );

  if (loading) {
    return <div className="loading">Analyzing number relationships...</div>;
  }

  if (!analysisData) {
    return <div className="error">Failed to analyze relationships</div>;
  }

  const avgMaterialPercentage = analysisData.costStructure.reduce((sum, item) => sum + item.materialPercentage, 0) / analysisData.costStructure.length;
  const avgOverheadPercentage = analysisData.costStructure.reduce((sum, item) => sum + item.overheadPercentage, 0) / analysisData.costStructure.length;
  const avgProfitMargin = analysisData.costStructure.reduce((sum, item) => sum + item.profitMargin, 0) / analysisData.costStructure.length;
  const avgVolumeDiscount = analysisData.pricingPatterns.reduce((sum, item) => sum + item.priceReduction, 0) / analysisData.pricingPatterns.length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
          Number Relationships Analysis
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
          Mathematical relationships and patterns in cost data
        </p>
      </div>

      {/* Key Relationships Summary */}
      <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
        <RelationshipCard 
          icon={FiPercent} 
          title="Avg Material %" 
          value={`${avgMaterialPercentage.toFixed(1)}%`}
          subtitle="of total cost"
          color="#007bff"
        />
        <RelationshipCard 
          icon={FiPercent} 
          title="Avg Overhead %" 
          value={`${avgOverheadPercentage.toFixed(1)}%`}
          subtitle="of total cost"
          color="#ffc107"
        />
        <RelationshipCard 
          icon={FiTrendingUp} 
          title="Avg Profit Margin" 
          value={`${avgProfitMargin.toFixed(1)}%`}
          subtitle="profitability"
          color="#28a745"
        />
        <RelationshipCard 
          icon={FiTrendingDown} 
          title="Avg Volume Discount" 
          value={`${avgVolumeDiscount.toFixed(1)}%`}
          subtitle="price reduction"
          color="#dc3545"
        />
      </div>

      {/* Cost Structure Breakdown */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1rem' }}>
          Cost Structure Analysis
        </h2>
        <div className="grid grid-2">
          {analysisData.costStructure.map((item, index) => (
            <div key={index} className="card">
              <h4 style={{ color: '#007bff', marginBottom: '1rem' }}>{item.design_id}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>
                    {item.materialPercentage.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Materials</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffc107' }}>
                    {item.overheadPercentage.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Overhead</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
                    {item.profitMargin.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Profit</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6c757d' }}>
                    ${item.costPerUnit.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Per Unit</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Patterns */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1rem' }}>
          Pricing Pattern Analysis
        </h2>
        <div className="grid grid-2">
          {analysisData.pricingPatterns.map((pattern, index) => (
            <div key={index} className="card">
              <h4 style={{ color: '#007bff', marginBottom: '1rem' }}>{pattern.design_id}</h4>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6c757d' }}>500 units:</span>
                  <span style={{ fontWeight: 'bold' }}>${pattern.price500.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6c757d' }}>1000 units:</span>
                  <span style={{ fontWeight: 'bold' }}>${pattern.price1000.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6c757d' }}>Volume Discount:</span>
                  <span style={{ fontWeight: 'bold', color: '#dc3545' }}>
                    ${pattern.volumeDiscount.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6c757d' }}>Discount %:</span>
                  <span style={{ fontWeight: 'bold', color: '#dc3545' }}>
                    {pattern.priceReduction.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Formulas */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1rem' }}>
          Identified Mathematical Formulas
        </h2>
        <div className="grid grid-2">
          {analysisData.formulas.map((formula, index) => (
            <FormulaCard key={index} formula={formula} />
          ))}
        </div>
      </div>

      {/* Cross-Design Comparison */}
      {analysisData.comparisons && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1rem' }}>
            Design Comparison Analysis
          </h2>
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ color: '#007bff', marginBottom: '1rem' }}>Cost Differences</h4>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6c757d' }}>Total Cost Difference: </span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: analysisData.comparisons.costDifference > 0 ? '#dc3545' : '#28a745'
                  }}>
                    ${analysisData.comparisons.costDifference.toFixed(2)}
                    ({analysisData.comparisons.costDifferencePercentage.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6c757d' }}>Material Cost Difference: </span>
                  <span style={{ fontWeight: 'bold' }}>
                    ${analysisData.comparisons.materialCostDifference.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6c757d' }}>Overhead Difference: </span>
                  <span style={{ fontWeight: 'bold' }}>
                    ${analysisData.comparisons.overheadDifference.toFixed(2)}
                  </span>
                </div>
              </div>
              <div>
                <h4 style={{ color: '#007bff', marginBottom: '1rem' }}>Profit Differences</h4>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6c757d' }}>Profit Difference: </span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: analysisData.comparisons.profitDifference > 0 ? '#28a745' : '#dc3545'
                  }}>
                    ${analysisData.comparisons.profitDifference.toFixed(2)}
                    ({analysisData.comparisons.profitDifferencePercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Source Information */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Analysis Methodology</h3>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', lineHeight: '1.5' }}>
          This analysis identifies mathematical relationships between cost components, pricing patterns, 
          and efficiency metrics. Key relationships include cost structure percentages, volume discount 
          calculations, profit margin formulas, and cross-design comparisons.
        </p>
        <div style={{ 
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: '#495057'
        }}>
          <strong>Key Insights:</strong> Material costs typically represent 70-80% of total costs, 
          overhead accounts for 20-30%, and profit margins average around 10%. Volume discounts 
          range from 15-20% when doubling order quantities.
        </div>
      </div>
    </div>
  );
};

export default NumberRelationships;
