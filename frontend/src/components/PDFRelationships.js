import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FiFileText, FiDollarSign, FiTrendingUp, FiTrendingDown, FiPercent, FiPackage, FiUsers } from 'react-icons/fi';

const PDFRelationships = () => {
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);

  useEffect(() => {
    // Mock data extracted from PDF files - in real app this would come from API
    const mockPdfData = [
      {
        design_id: "MRO32920",
        customer_name: "ACCHROMA",
        box_size: "22.00 x 10.00 x 1.12",
        box_style: "OPF",
        board_grade: "32ECTc",
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
        base_cost: 1313.01,
        setup_cost: 269.71,
        pricing_tiers: [
          { quantity: 500, price: 2101.0, full_cost: 1991.24 },
          { quantity: 1000, price: 1750.0, full_cost: 1695.35 },
          { quantity: 10000, price: 1340.0, full_cost: 1334.47 }
        ],
        board_breaks: []
      },
      {
        design_id: "MRO35174",
        customer_name: "ACADEMY GRAPHIC COMMUNICATIO",
        box_size: "11.04 x 8.12 x 10.00",
        box_style: "RSC JntW/L",
        board_grade: "200 C",
        unit_count: 500,
        board_cost: 371.46,
        total_board_cost: 371.46,
        subtotal_materials: 391.55,
        converting_costs: 1.41,
        direct_cost: 402.69,
        fixed_mfg_overhead: 49.5,
        selling_overheads: 5.85,
        fixed_overheads: 167.12,
        full_cost: 569.81,
        profit_cost: 50.0,
        base_cost: 694.87,
        setup_cost: 221.86,
        pricing_tiers: [
          { quantity: 500, price: 1248.0, full_cost: 1148.47 },
          { quantity: 1000, price: 997.0, full_cost: 947.44 },
          { quantity: 10000, price: 717.0, full_cost: 712.06 }
        ],
        board_breaks: []
      }
    ];

    setPdfData(mockPdfData);
    setLoading(false);
  }, []);

  // Create refs for each input to maintain focus
  const inputRefs = useRef({});
  const [focusedInput, setFocusedInput] = useState(null);

  const updatePricingTier = useCallback((designId, tierIndex, field, value) => {
    setPdfData(prevData => {
      return prevData.map(design => {
        if (design.design_id === designId) {
          const updatedTiers = [...design.pricing_tiers];
          updatedTiers[tierIndex] = {
            ...updatedTiers[tierIndex],
            [field]: value
          };
          return {
            ...design,
            pricing_tiers: updatedTiers
          };
        }
        return design;
      });
    });
  }, []);

  const handleInputFocus = useCallback((designId, tierIndex, field) => {
    const inputKey = `${designId}-${tierIndex}-${field}`;
    setFocusedInput(inputKey);
  }, []);

  const handleInputBlur = useCallback((designId, tierIndex, field, value) => {
    setFocusedInput(null);
    const trimmedValue = value.trim();
    if (trimmedValue === '' || isNaN(trimmedValue)) {
      updatePricingTier(designId, tierIndex, field, '0');
    } else {
      updatePricingTier(designId, tierIndex, field, trimmedValue);
    }
  }, [updatePricingTier]);

  // Restore focus after re-render
  useEffect(() => {
    if (focusedInput && inputRefs.current[focusedInput]) {
      const input = inputRefs.current[focusedInput];
      input.focus();
      // Restore cursor position
      const cursorPosition = input.selectionStart || 0;
      input.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [pdfData, focusedInput]);

  const calculatePDFRelationships = (design) => {
    const relationships = {
      // Cost Structure Relationships
      materialPercentage: (design.subtotal_materials / design.full_cost) * 100,
      overheadPercentage: (design.fixed_overheads / design.full_cost) * 100,
      profitPercentage: (design.profit_cost / design.full_cost) * 100,
      convertingPercentage: (design.converting_costs / design.full_cost) * 100,
      
      // Unit Economics
      costPerUnit: design.full_cost / design.unit_count,
      profitPerUnit: design.profit_cost / design.unit_count,
      materialCostPerUnit: design.subtotal_materials / design.unit_count,
      
      // Pricing Relationships
      markupPercentage: ((design.pricing_tiers[0]?.price - design.full_cost) / design.full_cost) * 100,
      volumeDiscountPercentage: design.pricing_tiers.length > 1 ? 
        ((design.pricing_tiers[0]?.price - design.pricing_tiers[1]?.price) / design.pricing_tiers[0]?.price) * 100 : 0,
      
      // Efficiency Metrics
      overheadToDirectRatio: design.fixed_overheads / design.direct_cost,
      materialEfficiency: design.board_cost / design.subtotal_materials,
      totalOverhead: design.fixed_mfg_overhead + design.selling_overheads + design.fixed_overheads,
      
      // Setup Economics
      setupCostPerUnit: design.setup_cost / design.unit_count,
      baseCostPerUnit: design.base_cost / design.unit_count
    };

    return relationships;
  };

  const PDFDataCard = ({ design, relationships }) => (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #007bff, #0056b3)',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px 8px 0 0',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
          <FiFileText style={{ marginRight: '0.5rem' }} />
          PDF Data: {design.design_id}
        </h3>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
          Customer: {design.customer_name}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <FiDollarSign style={{ fontSize: '2rem', color: '#28a745', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
            ${design.full_cost.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Full Cost</div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <FiTrendingUp style={{ fontSize: '2rem', color: '#007bff', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
            ${design.profit_cost.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Profit</div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <FiPercent style={{ fontSize: '2rem', color: '#ffc107', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
            {relationships.profitPercentage.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Profit Margin</div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ color: '#333', marginBottom: '1rem' }}>Cost Structure from PDF</h4>
        <div className="grid grid-2">
          <div>
            <h5 style={{ color: '#007bff', marginBottom: '0.5rem' }}>Direct Costs</h5>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Board Cost:</strong> ${design.board_cost.toFixed(2)}
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Subtotal Materials:</strong> ${design.subtotal_materials.toFixed(2)}
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Converting Costs:</strong> ${design.converting_costs.toFixed(2)}
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Direct Cost:</strong> ${design.direct_cost.toFixed(2)}
              </li>
            </ul>
          </div>
          <div>
            <h5 style={{ color: '#dc3545', marginBottom: '0.5rem' }}>Overhead Costs</h5>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Fixed Mfg Overhead:</strong> ${design.fixed_mfg_overhead.toFixed(2)}
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Selling Overheads:</strong> ${design.selling_overheads.toFixed(2)}
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Fixed Overheads:</strong> ${design.fixed_overheads.toFixed(2)}
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Total Overhead:</strong> ${relationships.totalOverhead.toFixed(2)}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing Tiers from PDF */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ color: '#333', margin: 0 }}>Pricing Tiers from PDF</h4>
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            Direct editing • Changes update automatically • Use bulk actions for quick adjustments
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Quantity</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Price/M</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Full Cost/M</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Markup</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Per Unit</th>
              </tr>
            </thead>
            <tbody>
              {design.pricing_tiers.map((tier, index) => {
                const price = parseFloat(tier.price) || 0;
                const fullCost = parseFloat(tier.full_cost) || 0;
                const quantity = parseFloat(tier.quantity) || 0;
                const markup = fullCost > 0 ? ((price - fullCost) / fullCost) * 100 : 0;
                
                return (
                  <tr key={index}>
                    <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                      <input
                        ref={(el) => {
                          inputRefs.current[`${design.design_id}-${index}-quantity`] = el;
                        }}
                        type="text"
                        value={tier.quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          updatePricingTier(design.design_id, index, 'quantity', value);
                        }}
                        onBlur={(e) => {
                          handleInputBlur(design.design_id, index, 'quantity', e.target.value);
                        }}
                        onFocus={(e) => {
                          e.target.style.outline = 'none';
                          handleInputFocus(design.design_id, index, 'quantity');
                        }}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #dee2e6',
                          borderRadius: '3px',
                          fontSize: '0.9rem',
                          background: 'transparent',
                          textAlign: 'left'
                        }}
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter
                          if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                              (e.keyCode === 65 && e.ctrlKey === true) ||
                              (e.keyCode === 67 && e.ctrlKey === true) ||
                              (e.keyCode === 86 && e.ctrlKey === true) ||
                              (e.keyCode === 88 && e.ctrlKey === true) ||
                              // Allow: home, end, left, right
                              (e.keyCode >= 35 && e.keyCode <= 39)) {
                            return;
                          }
                          // Ensure that it is a number and stop the keypress
                          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', fontWeight: 'bold', color: '#007bff' }}>
                      <input
                        ref={(el) => {
                          inputRefs.current[`${design.design_id}-${index}-price`] = el;
                        }}
                        type="text"
                        value={tier.price}
                        onChange={(e) => {
                          const value = e.target.value;
                          updatePricingTier(design.design_id, index, 'price', value);
                        }}
                        onBlur={(e) => {
                          handleInputBlur(design.design_id, index, 'price', e.target.value);
                        }}
                        onFocus={(e) => {
                          e.target.style.outline = 'none';
                          handleInputFocus(design.design_id, index, 'price');
                        }}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #dee2e6',
                          borderRadius: '3px',
                          fontSize: '0.9rem',
                          background: 'transparent',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          color: '#007bff'
                        }}
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter, decimal point
                          if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                              (e.keyCode === 65 && e.ctrlKey === true) ||
                              (e.keyCode === 67 && e.ctrlKey === true) ||
                              (e.keyCode === 86 && e.ctrlKey === true) ||
                              (e.keyCode === 88 && e.ctrlKey === true) ||
                              // Allow: home, end, left, right
                              (e.keyCode >= 35 && e.keyCode <= 39)) {
                            return;
                          }
                          // Ensure that it is a number and stop the keypress
                          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', color: '#6c757d' }}>
                      <input
                        ref={(el) => {
                          inputRefs.current[`${design.design_id}-${index}-full_cost`] = el;
                        }}
                        type="text"
                        value={tier.full_cost}
                        onChange={(e) => {
                          const value = e.target.value;
                          updatePricingTier(design.design_id, index, 'full_cost', value);
                        }}
                        onBlur={(e) => {
                          handleInputBlur(design.design_id, index, 'full_cost', e.target.value);
                        }}
                        onFocus={(e) => {
                          e.target.style.outline = 'none';
                          handleInputFocus(design.design_id, index, 'full_cost');
                        }}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #dee2e6',
                          borderRadius: '3px',
                          fontSize: '0.9rem',
                          background: 'transparent',
                          textAlign: 'left',
                          color: '#6c757d'
                        }}
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter, decimal point
                          if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                              (e.keyCode === 65 && e.ctrlKey === true) ||
                              (e.keyCode === 67 && e.ctrlKey === true) ||
                              (e.keyCode === 86 && e.ctrlKey === true) ||
                              (e.keyCode === 88 && e.ctrlKey === true) ||
                              // Allow: home, end, left, right
                              (e.keyCode >= 35 && e.keyCode <= 39)) {
                            return;
                          }
                          // Ensure that it is a number and stop the keypress
                          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', color: '#28a745', fontWeight: 'bold' }}>
                      {markup.toFixed(1)}%
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', color: '#6c757d' }}>
                      ${quantity > 0 ? (price / quantity).toFixed(2) : '0.00'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Real-time Calculations */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#f8f9fa', 
          borderRadius: '5px',
          fontSize: '0.85rem'
        }}>
          <h5 style={{ color: '#333', marginBottom: '0.5rem' }}>Real-time Calculations</h5>
          <div className="grid grid-3">
            <div>
              <strong>Volume Discount:</strong> 
              <span style={{ color: '#dc3545', marginLeft: '0.5rem' }}>
                {design.pricing_tiers.length > 1 ? 
                  (((design.pricing_tiers[0].price - design.pricing_tiers[1].price) / design.pricing_tiers[0].price) * 100).toFixed(1) + '%' 
                  : 'N/A'}
              </span>
            </div>
            <div>
              <strong>Average Markup:</strong> 
              <span style={{ color: '#28a745', marginLeft: '0.5rem' }}>
                {(design.pricing_tiers.reduce((sum, tier) => sum + ((tier.price - tier.full_cost) / tier.full_cost) * 100, 0) / design.pricing_tiers.length).toFixed(1)}%
              </span>
            </div>
            <div>
              <strong>Price Range:</strong> 
              <span style={{ color: '#007bff', marginLeft: '0.5rem' }}>
                ${Math.min(...design.pricing_tiers.map(t => t.price)).toFixed(2)} - ${Math.max(...design.pricing_tiers.map(t => t.price)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Bulk Edit Actions */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#e3f2fd', 
          borderRadius: '5px',
          fontSize: '0.85rem'
        }}>
          <h5 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>Bulk Edit Actions</h5>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const newTiers = design.pricing_tiers.map(tier => ({
                  ...tier,
                  price: tier.price * 1.05 // 5% increase
                }));
                setPdfData(prevData => prevData.map(d => 
                  d.design_id === design.design_id ? { ...d, pricing_tiers: newTiers } : d
                ));
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              +5% Price Increase
            </button>
            <button
              onClick={() => {
                const newTiers = design.pricing_tiers.map(tier => ({
                  ...tier,
                  price: tier.price * 0.95 // 5% decrease
                }));
                setPdfData(prevData => prevData.map(d => 
                  d.design_id === design.design_id ? { ...d, pricing_tiers: newTiers } : d
                ));
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              -5% Price Decrease
            </button>
            <button
              onClick={() => {
                const newTiers = design.pricing_tiers.map(tier => ({
                  ...tier,
                  full_cost: tier.price * 0.85 // Set full cost to 85% of price
                }));
                setPdfData(prevData => prevData.map(d => 
                  d.design_id === design.design_id ? { ...d, pricing_tiers: newTiers } : d
                ));
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '3px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Set 15% Margin
            </button>
            <button
              onClick={() => {
                // Reset to original values
                const originalData = [
                  {
                    design_id: "MRO32920",
                    pricing_tiers: [
                      { quantity: 500, price: 2101.0, full_cost: 1991.24 },
                      { quantity: 1000, price: 1750.0, full_cost: 1695.35 },
                      { quantity: 10000, price: 1340.0, full_cost: 1334.47 }
                    ]
                  },
                  {
                    design_id: "MRO35174",
                    pricing_tiers: [
                      { quantity: 500, price: 1248.0, full_cost: 1148.47 },
                      { quantity: 1000, price: 997.0, full_cost: 947.44 },
                      { quantity: 10000, price: 717.0, full_cost: 712.06 }
                    ]
                  }
                ];
                const originalDesign = originalData.find(d => d.design_id === design.design_id);
                if (originalDesign) {
                  setPdfData(prevData => prevData.map(d => 
                    d.design_id === design.design_id ? { ...d, pricing_tiers: originalDesign.pricing_tiers } : d
                  ));
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Reset to Original
            </button>
          </div>
        </div>
      </div>

      {/* Mathematical Relationships */}
      <div>
        <h4 style={{ color: '#333', marginBottom: '1rem' }}>Mathematical Relationships from PDF</h4>
        <div className="grid grid-2">
          <div>
            <h5 style={{ color: '#007bff', marginBottom: '0.5rem' }}>Cost Relationships</h5>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Material %:</strong> {relationships.materialPercentage.toFixed(1)}% of total cost
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Overhead %:</strong> {relationships.overheadPercentage.toFixed(1)}% of total cost
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Converting %:</strong> {relationships.convertingPercentage.toFixed(1)}% of total cost
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Overhead/Direct Ratio:</strong> {relationships.overheadToDirectRatio.toFixed(2)}
              </li>
            </ul>
          </div>
          <div>
            <h5 style={{ color: '#28a745', marginBottom: '0.5rem' }}>Unit Economics</h5>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Cost per Unit:</strong> ${relationships.costPerUnit.toFixed(2)}
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Profit per Unit:</strong> ${relationships.profitPerUnit.toFixed(2)}
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Material per Unit:</strong> ${relationships.materialCostPerUnit.toFixed(2)}
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <strong>Setup per Unit:</strong> ${relationships.setupCostPerUnit.toFixed(2)}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const ComparisonAnalysis = () => {
    if (!pdfData || pdfData.length < 2) return null;

    const design1 = pdfData[0];
    const design2 = pdfData[1];
    const rel1 = calculatePDFRelationships(design1);
    const rel2 = calculatePDFRelationships(design2);

    return (
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#007bff', marginBottom: '1rem', textAlign: 'center' }}>
          PDF Data Comparison Analysis
        </h3>
        
        <div className="grid grid-2">
          <div>
            <h4 style={{ color: '#333', marginBottom: '1rem' }}>{design1.design_id} vs {design2.design_id}</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ color: '#007bff', marginBottom: '0.5rem' }}>Cost Differences</h5>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>Full Cost:</strong> 
                  <span style={{ color: design2.full_cost > design1.full_cost ? '#dc3545' : '#28a745' }}>
                    ${(design2.full_cost - design1.full_cost).toFixed(2)} 
                    ({((design2.full_cost - design1.full_cost) / design1.full_cost * 100).toFixed(1)}%)
                  </span>
                </li>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>Material Cost:</strong> 
                  <span style={{ color: design2.subtotal_materials > design1.subtotal_materials ? '#dc3545' : '#28a745' }}>
                    ${(design2.subtotal_materials - design1.subtotal_materials).toFixed(2)}
                  </span>
                </li>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>Overhead:</strong> 
                  <span style={{ color: design2.fixed_overheads > design1.fixed_overheads ? '#dc3545' : '#28a745' }}>
                    ${(design2.fixed_overheads - design1.fixed_overheads).toFixed(2)}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h5 style={{ color: '#28a745', marginBottom: '0.5rem' }}>Profit Differences</h5>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>Profit Amount:</strong> 
                  <span style={{ color: design2.profit_cost > design1.profit_cost ? '#28a745' : '#dc3545' }}>
                    ${(design2.profit_cost - design1.profit_cost).toFixed(2)}
                  </span>
                </li>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>Profit Margin:</strong> 
                  <span style={{ color: rel2.profitPercentage > rel1.profitPercentage ? '#28a745' : '#dc3545' }}>
                    {rel2.profitPercentage.toFixed(1)}% vs {rel1.profitPercentage.toFixed(1)}%
                  </span>
                </li>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>Cost per Unit:</strong> 
                  <span style={{ color: rel2.costPerUnit > rel1.costPerUnit ? '#dc3545' : '#28a745' }}>
                    ${rel2.costPerUnit.toFixed(2)} vs ${rel1.costPerUnit.toFixed(2)}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#333', marginBottom: '1rem' }}>Pricing Analysis</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ color: '#007bff', marginBottom: '0.5rem' }}>Volume Discounts</h5>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>{design1.design_id}:</strong> {rel1.volumeDiscountPercentage.toFixed(1)}% discount
                </li>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>{design2.design_id}:</strong> {rel2.volumeDiscountPercentage.toFixed(1)}% discount
                </li>
              </ul>
            </div>

            <div>
              <h5 style={{ color: '#28a745', marginBottom: '0.5rem' }}>Markup Analysis</h5>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>{design1.design_id}:</strong> {rel1.markupPercentage.toFixed(1)}% markup
                </li>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>{design2.design_id}:</strong> {rel2.markupPercentage.toFixed(1)}% markup
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading PDF relationship data...</div>;
  }

  if (!pdfData) {
    return <div className="error">Failed to load PDF data</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
          PDF Number Relationships
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
          Mathematical relationships extracted from PDF screenshots of ERP system data
        </p>
      </div>

      {/* Design Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        {pdfData.map((design) => (
          <button
            key={design.design_id}
            onClick={() => setSelectedDesign(selectedDesign === design.design_id ? null : design.design_id)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '5px',
              background: selectedDesign === design.design_id ? '#007bff' : '#e9ecef',
              color: selectedDesign === design.design_id ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {design.design_id}
          </button>
        ))}
        <button
          onClick={() => setSelectedDesign('comparison')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '5px',
            background: selectedDesign === 'comparison' ? '#007bff' : '#e9ecef',
            color: selectedDesign === 'comparison' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Comparison
        </button>
      </div>

      {/* Render Selected View */}
      {selectedDesign === 'comparison' && <ComparisonAnalysis />}
      
      {selectedDesign && selectedDesign !== 'comparison' && (
        <PDFDataCard 
          design={pdfData.find(d => d.design_id === selectedDesign)} 
          relationships={calculatePDFRelationships(pdfData.find(d => d.design_id === selectedDesign))}
        />
      )}

      {!selectedDesign && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FiFileText style={{ fontSize: '4rem', color: '#6c757d', marginBottom: '1rem' }} />
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>Select a Design to View PDF Relationships</h3>
          <p style={{ color: '#6c757d', fontSize: '1rem' }}>
            Choose a design ID above to see the mathematical relationships extracted from the PDF data,
            or select "Comparison" to see side-by-side analysis.
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>PDF Data Extraction Summary</h3>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', lineHeight: '1.5' }}>
          This analysis shows the mathematical relationships extracted from PDF screenshots of the ERP system. 
          The data includes cost structures, pricing tiers, profit margins, and unit economics as they appear 
          in the original business system. All calculations are based on the actual values captured from the PDF files.
        </p>
        <div style={{ 
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: '#495057'
        }}>
          <strong>Data Source:</strong> PDF screenshots from ERP system → OCR text extraction → Mathematical relationship analysis
        </div>
      </div>
    </div>
  );
};

export default PDFRelationships;
