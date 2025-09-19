const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://skybox_user:skybox_password@localhost:5432/skybox_designs',
});

// Function to parse dimensions from MRO text
function parseMRODimensions(text) {
  const dimensions = [];
  
  // Look for dimension patterns like "22x10x1.75", "30 x 30 x 2", etc.
  const dimensionPatterns = [
    /(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)/g,
    /(\d+(?:\+\d+\/\d+)?)\s*[xX×]\s*(\d+(?:\+\d+\/\d+)?)\s*[xX×]\s*(\d+(?:\+\d+\/\d+)?)/g
  ];
  
  dimensionPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      dimensions.push({
        length: parseFloat(match[1].replace('+', '.').replace('/', '.')),
        width: parseFloat(match[2].replace('+', '.').replace('/', '.')),
        height: parseFloat(match[3].replace('+', '.').replace('/', '.')),
        dimension_type: 'Overall'
      });
    }
  });
  
  return dimensions;
}

// Function to parse MRO drawing information
function parseMROInfo(text, filename) {
  const lines = text.split('\n');
  const mroNumber = filename.replace('.txt', '');
  
  const info = {
    mro_number: mroNumber,
    filename: filename,
    description: '',
    designer: '',
    created_date: null,
    modified_date: null,
    design_lab_status: 'Draft'
  };
  
  // Parse basic info from first few lines
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    
    // Extract date patterns
    const dateMatch = line.match(/(\d{2}\/\d{2}\/\d{4})/);
    if (dateMatch && !info.created_date) {
      const [month, day, year] = dateMatch[1].split('/');
      info.created_date = new Date(year, month - 1, day);
    }
    
    // Extract designer
    if (line.includes('Designer:')) {
      const designerMatch = line.match(/Designer:\s*(.+)/);
      if (designerMatch) {
        info.designer = designerMatch[1].trim();
      }
    }
    
    // Extract description
    if (line.includes('Description:')) {
      const descMatch = line.match(/Description:\s*(.+)/);
      if (descMatch) {
        info.description = descMatch[1].trim();
      }
    }
  }
  
  return info;
}

// Function to parse box specifications from MRO
function parseMROBoxSpecifications(text) {
  const specs = {
    box_type: '',
    board_type: '',
    flute_type: '',
    material_description: '',
    glue_joint: '',
    colors: 1
  };
  
  // Look for box type patterns
  const boxTypePatterns = [
    /OPF/,
    /Folder/,
    /Air Cell/,
    /PAD/,
    /FLUTE/
  ];
  
  boxTypePatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      specs.box_type = match[0];
    }
  });
  
  // Look for board type patterns like "32ECT C"
  const boardTypeMatch = text.match(/(\d+ECT\s*[A-Z])/);
  if (boardTypeMatch) {
    specs.board_type = boardTypeMatch[1];
  }
  
  // Look for flute type
  const fluteMatch = text.match(/([A-Z]\s*FLUTE)/);
  if (fluteMatch) {
    specs.flute_type = fluteMatch[1];
  }
  
  // Look for glue joint
  const glueMatch = text.match(/Glue Joint:\s*(.+)/);
  if (glueMatch) {
    specs.glue_joint = glueMatch[1].trim();
  }
  
  // Look for colors
  const colorsMatch = text.match(/Colors:\s*(\d+)/);
  if (colorsMatch) {
    specs.colors = parseInt(colorsMatch[1]);
  }
  
  return specs;
}

// Function to determine optimal machine routing
function determineMachineRouting(boxSpecs, dimensions) {
  // This would integrate with your machine performance tables
  // For now, return a default routing based on box type
  const machineMap = {
    'OPF': 'Machine 144',
    'Folder': 'Machine 142',
    'Air Cell': 'Machine 145',
    'PAD': 'Machine 143',
    'FLUTE': 'Machine 144'
  };
  
  return machineMap[boxSpecs.box_type] || 'Machine 144';
}

// Function to calculate costs and pricing
function calculateMROCosts(boxSpecs, dimensions, quantity = 1000) {
  // This would integrate with your cost calculation logic
  // For now, return mock calculations
  const materialCost = (dimensions.length * dimensions.width * dimensions.height) * 0.05;
  const laborCost = quantity * 0.02;
  const overheadCost = (materialCost + laborCost) * 0.15;
  const totalCost = materialCost + laborCost + overheadCost;
  const profitMargin = 20.0; // 20% profit margin
  
  return {
    material_cost: materialCost,
    labor_cost: laborCost,
    overhead_cost: overheadCost,
    total_cost: totalCost,
    profit_margin: profitMargin
  };
}

// Function to create pricing tiers
function createPricingTiers(baseCosts) {
  const tiers = [
    { quantity_min: 100, quantity_max: 499, markup: 25 },
    { quantity_min: 500, quantity_max: 999, markup: 20 },
    { quantity_min: 1000, quantity_max: 2499, markup: 15 },
    { quantity_min: 2500, quantity_max: 4999, markup: 12 },
    { quantity_min: 5000, quantity_max: 9999, markup: 10 }
  ];
  
  return tiers.map(tier => ({
    quantity_min: tier.quantity_min,
    quantity_max: tier.quantity_max,
    unit_price: baseCosts.total_cost * (1 + tier.markup / 100),
    total_cost: baseCosts.total_cost,
    markup_percentage: tier.markup
  }));
}

// Main function to import MRO file
async function importMROFile(filePath, designsDir) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    if (lines.length === 0) {
      console.log(`File ${filePath} is empty, skipping...`);
      return;
    }

    // Extract MRO number from filename
    const filename = path.basename(filePath);
    const mroNumber = path.parse(filename).name;
    
    console.log(`Processing MRO drawing: ${mroNumber}`);

    // Check if MRO drawing already exists and delete it for re-import
    const existingMRO = await pool.query('SELECT id FROM mro_drawings WHERE mro_number = $1', [mroNumber]);
    if (existingMRO.rows.length > 0) {
      console.log(`MRO ${mroNumber} already exists, deleting for re-import...`);
      
      // Delete related records first (foreign key constraints)
      await pool.query('DELETE FROM pricing_tiers WHERE mtech_spec_id IN (SELECT id FROM mtech_specs WHERE mro_number = $1)', [mroNumber]);
      await pool.query('DELETE FROM mtech_specs WHERE mro_number = $1', [mroNumber]);
      await pool.query('DELETE FROM file_references WHERE mro_number = $1', [mroNumber]);
      await pool.query('DELETE FROM box_specifications WHERE mro_number = $1', [mroNumber]);
      await pool.query('DELETE FROM box_dimensions WHERE mro_number = $1', [mroNumber]);
      
      // Delete the main MRO drawing record
      await pool.query('DELETE FROM mro_drawings WHERE mro_number = $1', [mroNumber]);
      
      console.log(`MRO ${mroNumber} deleted, proceeding with re-import...`);
    }

    // Parse MRO information
    const mroInfo = parseMROInfo(content, filename);
    const dimensions = parseMRODimensions(content);
    const boxSpecs = parseMROBoxSpecifications(content);
    
    // Insert MRO drawing
    const mroResult = await pool.query(`
      INSERT INTO mro_drawings (mro_number, filename, description, designer, created_date, modified_date, design_lab_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      mroInfo.mro_number,
      mroInfo.filename,
      mroInfo.description,
      mroInfo.designer,
      mroInfo.created_date,
      mroInfo.modified_date,
      mroInfo.design_lab_status
    ]);
    
    const mroId = mroResult.rows[0].id;
    console.log(`Inserted MRO drawing: ${mroNumber} (ID: ${mroId})`);

    // Insert dimensions
    for (const dim of dimensions) {
      await pool.query(`
        INSERT INTO box_dimensions (mro_number, dimension_type, length, width, height, depth, units)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        mroNumber,
        dim.dimension_type,
        dim.length,
        dim.width,
        dim.height,
        dim.depth || null,
        'inches'
      ]);
    }

    // Insert box specifications
    await pool.query(`
      INSERT INTO box_specifications (mro_number, box_type, board_type, flute_type, material_description, glue_joint, colors)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      mroNumber,
      boxSpecs.box_type,
      boxSpecs.board_type,
      boxSpecs.flute_type,
      boxSpecs.material_description,
      boxSpecs.glue_joint,
      boxSpecs.colors
    ]);

    // Determine machine routing and calculate costs
    const primaryDimension = dimensions[0] || { length: 0, width: 0, height: 0 };
    const machineRouting = determineMachineRouting(boxSpecs, primaryDimension);
    const costs = calculateMROCosts(boxSpecs, primaryDimension);
    
    // Insert MTECH spec
    const mtechResult = await pool.query(`
      INSERT INTO mtech_specs (mro_number, spec_name, machine_routing, setup_time, run_speed, material_cost, labor_cost, overhead_cost, total_cost, profit_margin, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      mroNumber,
      `${mroNumber} Spec`,
      machineRouting,
      2.0, // Default setup time
      500.0, // Default run speed
      costs.material_cost,
      costs.labor_cost,
      costs.overhead_cost,
      costs.total_cost,
      costs.profit_margin,
      'Draft',
      'System Import'
    ]);
    
    const mtechSpecId = mtechResult.rows[0].id;
    console.log(`Inserted MTECH spec: ${mroNumber} (ID: ${mtechSpecId})`);

    // Insert pricing tiers
    const pricingTiers = createPricingTiers(costs);
    for (const tier of pricingTiers) {
      await pool.query(`
        INSERT INTO pricing_tiers (mtech_spec_id, quantity_min, quantity_max, unit_price, total_cost, markup_percentage)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        mtechSpecId,
        tier.quantity_min,
        tier.quantity_max,
        tier.unit_price,
        tier.total_cost,
        tier.markup_percentage
      ]);
    }

    // Insert file references
    const fileExtensions = ['ARD', 'PDF', 'TXT'];
    for (const ext of fileExtensions) {
      const sourceFilePath = path.join(designsDir, `${mroNumber}.${ext.toLowerCase()}`);
      if (fs.existsSync(sourceFilePath)) {
        const stats = fs.statSync(sourceFilePath);
        await pool.query(`
          INSERT INTO file_references (mro_number, file_type, file_path, file_size, last_modified)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          mroNumber,
          ext,
          sourceFilePath,
          stats.size,
          stats.mtime
        ]);
      }
    }

    console.log(`Successfully imported MRO ${mroNumber}`);
    
  } catch (error) {
    console.error(`Error importing MRO file ${filePath}:`, error);
  }
}

// Main execution
async function main() {
  console.log('Starting MRO data import...');
  
  const designsDir = '/app/data'; // Docker path for /app/data mount
  console.log('Looking for files in:', designsDir);
  
  try {
    // Check if directory exists
    if (!fs.existsSync(designsDir)) {
      console.log('Creating data directory...');
      fs.mkdirSync(designsDir, { recursive: true });
    }

    // Find all files in the directory
    const allFiles = fs.readdirSync(designsDir);
    console.log('All files found:', allFiles.length);

    // Filter for TXT files
    const txtFiles = allFiles.filter(file => file.toLowerCase().endsWith('.txt'));
    console.log('TXT files found:', txtFiles.length);

    if (txtFiles.length === 0) {
      console.log('Found 0 text files to import');
      return;
    }

    // Import each TXT file
    for (const file of txtFiles) {
      const filePath = path.join(designsDir, file);
      await importMROFile(filePath, designsDir);
    }

    console.log('MRO data import completed successfully!');
    
  } catch (error) {
    console.error('Error during MRO import:', error);
  } finally {
    await pool.end();
  }
}

// Run the import
main().catch(console.error);

