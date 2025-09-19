const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://skybox_user:skybox_password@localhost:5432/skybox_designs',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/api/designs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.*,
        json_agg(
          json_build_object(
            'type', dr.dimension_type,
            'length', dr.length,
            'width', dr.width,
            'height', dr.height,
            'depth', dr.depth,
            'units', dr.units
          )
        ) as dimensions,
        json_agg(
          json_build_object(
            'box_type', bs.box_type,
            'board_type', bs.board_type,
            'flute_type', bs.flute_type,
            'material_description', bs.material_description
          )
        ) as specifications
      FROM designs d
      LEFT JOIN dimensions dr ON d.design_id = dr.design_id
      LEFT JOIN box_specifications bs ON d.design_id = bs.design_id
      GROUP BY d.id, d.design_id
      ORDER BY d.created_date DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/designs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get design details
    const designResult = await pool.query('SELECT * FROM designs WHERE design_id = $1', [id]);
    
    if (designResult.rows.length === 0) {
      return res.status(404).json({ error: 'Design not found' });
    }
    
    const design = designResult.rows[0];
    
    // Get dimensions
    const dimensionsResult = await pool.query('SELECT * FROM dimensions WHERE design_id = $1', [id]);
    
    // Get specifications
    const specsResult = await pool.query('SELECT * FROM box_specifications WHERE design_id = $1', [id]);
    
    // Get parameters
    const paramsResult = await pool.query('SELECT * FROM design_parameters WHERE design_id = $1', [id]);
    
    // Get file references
    const filesResult = await pool.query('SELECT * FROM file_references WHERE design_id = $1', [id]);
    
    res.json({
      design,
      dimensions: dimensionsResult.rows,
      specifications: specsResult.rows,
      parameters: paramsResult.rows,
      files: filesResult.rows
    });
  } catch (error) {
    console.error('Error fetching design:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/designs/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;
    
    const result = await pool.query(`
      SELECT DISTINCT d.*
      FROM designs d
      LEFT JOIN dimensions dr ON d.design_id = dr.design_id
      LEFT JOIN box_specifications bs ON d.design_id = bs.design_id
      WHERE 
        d.design_id ILIKE $1 OR
        d.description ILIKE $1 OR
        d.designer ILIKE $1 OR
        bs.box_type ILIKE $1 OR
        bs.board_type ILIKE $1
      ORDER BY d.created_date DESC
    `, [searchTerm]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching designs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const totalDesigns = await pool.query('SELECT COUNT(*) FROM designs');
    const recentDesigns = await pool.query(`
      SELECT COUNT(*) FROM designs 
      WHERE created_date >= CURRENT_DATE - INTERVAL '30 days'
    `);
    const designers = await pool.query(`
      SELECT designer, COUNT(*) as count 
      FROM designs 
      WHERE designer IS NOT NULL 
      GROUP BY designer 
      ORDER BY count DESC
    `);
    const boxTypes = await pool.query(`
      SELECT box_type, COUNT(*) as count 
      FROM box_specifications 
      WHERE box_type IS NOT NULL 
      GROUP BY box_type 
      ORDER BY count DESC
    `);
    
    res.json({
      totalDesigns: parseInt(totalDesigns.rows[0].count),
      recentDesigns: parseInt(recentDesigns.rows[0].count),
      designers: designers.rows,
      boxTypes: boxTypes.rows
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`SkyBox Backend API running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database connection pool closed');
    process.exit(0);
  });
});
