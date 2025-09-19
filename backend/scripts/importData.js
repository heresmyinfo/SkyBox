const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://skybox_user:skybox_password@localhost:5432/skybox_designs',
});

// Function to parse dimensions from text
function parseDimensions(text) {
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

// Function to parse design information
function parseDesignInfo(text, filename) {
  const lines = text.split('\n');
  const designId = filename.replace('.txt', '');
  
  const info = {
    design_id: designId,
    filename: filename,
    description: '',
    designer: '',
    created_date: null,
    modified_date: null,
    grain_corr: '',
    side_shown: '',
    total_rule: '',
    blank_size: '',
    mfg_joint: '',
    specific_rule: '',
    legend: '',
    components_count: 0,
    parts_required: 0
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
    
    // Extract grain/corr
    if (line.includes('Grain/Corr:')) {
      const grainMatch = line.match(/Grain\/Corr:\s*(.+)/);
      if (grainMatch) {
        info.grain_corr = grainMatch[1].trim();
      }
    }
    
    // Extract blank size
    if (line.includes('Blank Size:')) {
      const blankMatch = line.match(/Blank Size:\s*(.+)/);
      if (blankMatch) {
        info.blank_size = blankMatch[1].trim();
      }
    }
    
    // Extract components count
    const componentsMatch = line.match(/# of Components:\s*(\d+)/);
    if (componentsMatch) {
      info.components_count = parseInt(componentsMatch[1]);
    }
    
    // Extract parts required
    const partsMatch = line.match(/# Parts Req:\s*(\d+)/);
    if (partsMatch) {
      info.parts_required = parseInt(partsMatch[1]);
    }
  }
  
  return info;
}

// Function to parse box specifications
function parseBoxSpecifications(text) {
  const specs = {
    box_type: '',
    board_type: '',
    flute_type: '',
    material_description: ''
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
  
  return specs;
}

// Function to import a single design file
async function importDesignFile(filePath, designsDir) {
  const filename = path.basename(filePath);
  const designId = filename.replace('.txt', '');
  
  try {
    
    console.log(`Importing design: ${designId}`);
    
    // Check if design already exists and delete it for re-import
    const existingDesign = await pool.query('SELECT id FROM designs WHERE design_id = $1', [designId]);
    if (existingDesign.rows.length > 0) {
      console.log(`Design ${designId} already exists, deleting for re-import...`);
      
      // Delete related records first (foreign key constraints)
      await pool.query('DELETE FROM file_references WHERE design_id = $1', [designId]);
      await pool.query('DELETE FROM box_specifications WHERE design_id = $1', [designId]);
      await pool.query('DELETE FROM dimensions WHERE design_id = $1', [designId]);
      
      // Delete the main design record
      await pool.query('DELETE FROM designs WHERE design_id = $1', [designId]);
      
      console.log(`Design ${designId} deleted, proceeding with re-import...`);
    }
    
    // Read and parse the file
    const text = fs.readFileSync(filePath, 'utf8');
    const designInfo = parseDesignInfo(text, filename);
    const dimensions = parseDimensions(text);
    const boxSpecs = parseBoxSpecifications(text);
    
    // Insert design
    const designResult = await pool.query(`
      INSERT INTO designs (
        design_id, filename, created_date, modified_date, description, designer,
        grain_corr, side_shown, total_rule, blank_size, mfg_joint, specific_rule,
        legend, components_count, parts_required
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id
    `, [
      designInfo.design_id, designInfo.filename, designInfo.created_date, designInfo.modified_date,
      designInfo.description, designInfo.designer, designInfo.grain_corr, designInfo.side_shown,
      designInfo.total_rule, designInfo.blank_size, designInfo.mfg_joint, designInfo.specific_rule,
      designInfo.legend, designInfo.components_count, designInfo.parts_required
    ]);
    
    const designDbId = designResult.rows[0].id;
    
    // Insert dimensions
    for (const dim of dimensions) {
      await pool.query(`
        INSERT INTO dimensions (design_id, dimension_type, length, width, height, depth, units)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [designId, dim.dimension_type, dim.length, dim.width, dim.height, dim.depth, 'inches']);
    }
    
    // Insert box specifications
    if (boxSpecs.box_type || boxSpecs.board_type || boxSpecs.flute_type) {
      await pool.query(`
        INSERT INTO box_specifications (design_id, box_type, board_type, flute_type, material_description)
        VALUES ($1, $2, $3, $4, $5)
      `, [designId, boxSpecs.box_type, boxSpecs.board_type, boxSpecs.flute_type, boxSpecs.material_description]);
    }
    
    // Insert file references
    const fileExtensions = ['ARD', 'PDF', 'TXT'];
    for (const ext of fileExtensions) {
      const sourceFilePath = path.join(designsDir, `${designId}.${ext.toLowerCase()}`);
      if (fs.existsSync(sourceFilePath)) {
        const stats = fs.statSync(sourceFilePath);
        await pool.query(`
          INSERT INTO file_references (design_id, file_type, file_path, file_size, last_modified)
          VALUES ($1, $2, $3, $4, $5)
        `, [designId, ext, sourceFilePath, stats.size, stats.mtime]);
      }
    }
    
    console.log(`Successfully imported design: ${designId}`);
    
  } catch (error) {
    console.error(`Error importing design ${designId}:`, error);
  }
}

// Main import function
async function importAllDesigns() {
  try {
    console.log('Starting data import...');
    
    // Get all .txt files from the designs directory (mounted from host)
    const designsDir = '/app/data';
    console.log('Looking for files in:', designsDir);
    const allFiles = fs.readdirSync(designsDir);
    console.log('All files found:', allFiles.length);
    const files = allFiles.filter(file => file.endsWith('.txt'));
    console.log('TXT files found:', files.length);
    
    // Create data directory for processing
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      console.log('Creating data directory...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    console.log(`Found ${files.length} text files to import`);
    
    for (const file of files) {
      const sourcePath = path.join(designsDir, file);
      const destPath = path.join(dataDir, file);
      
      // Copy file to data directory
      fs.copyFileSync(sourcePath, destPath);
      
      // Import the design
      await importDesignFile(destPath, designsDir);
    }
    
    console.log('Data import completed successfully!');
    
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await pool.end();
  }
}

// Run import if this script is executed directly
if (require.main === module) {
  importAllDesigns();
}

module.exports = { importAllDesigns, importDesignFile };
