const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
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
app.get('/api/interact', async (req, res) => {
  try {
    // List available MRO IDs from mounted data directories
    const roots = [
      path.resolve(__dirname, 'data'),
      path.resolve(process.cwd(), 'data'),
      path.resolve('/app/designs/data')
    ];
    const seen = new Set();
    const ids = [];
    for (const root of roots) {
      if (!fs.existsSync(root)) continue;
      const files = fs.readdirSync(root);
      for (const f of files) {
        const m = f.match(/^(MRO\d+)\.txt$/i);
        if (m) {
          const id = m[1].toUpperCase();
          if (!seen.has(id)) { seen.add(id); ids.push(id); }
        }
      }
    }
    ids.sort();
    res.json({ ids });
  } catch (error) {
    console.error('Error listing INTERACT IDs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/interact/:id', async (req, res) => {
  try {
    const { id } = req.params; // Expect like MRO32920 or 32920
    const baseId = id.startsWith('MRO') ? id : `MRO${id}`;
    const fileName = `${baseId}.txt`;
    const candidatePaths = [
      // In-image default (Docker mounts ./data to /app/data)
      path.resolve(__dirname, 'data', fileName),
      // Fallback to CWD when running locally with node server.js in backend/
      path.resolve(process.cwd(), 'data', fileName),
      // Extra compose mount maps repo root to /app/designs
      path.resolve('/app/designs/data', fileName)
    ];
    const txtPath = candidatePaths.find((p) => fs.existsSync(p));

    if (!txtPath) {
      return res.status(404).json({ error: `Text file not found for ${baseId}` });
    }

    const raw = fs.readFileSync(txtPath, 'utf8');
    const lines = raw.split(/\r?\n/);
    const text = raw;

    // helpers
    const matchFirst = (regex) => {
      const m = text.match(regex);
      return m ? m[1] || m[0] : null;
    };
    const matchAll = (regex) => {
      const ms = [...text.matchAll(regex)];
      return ms.map((m) => m[1] || m[0]);
    };

    // Extract fields
    const ardFile = matchFirst(/\b(MRO\d+\.ARD)\b/i);
    // Prefer pattern like "10 x 22 x 1+3/4" or "22 x 10 x 1.75"
    const dimCandidates = matchAll(/(\d+\s*x\s*\d+\s*x\s*[\d+/.]+(?:\s*OPF)?)/gi);
    const displayDimensions = Array.from(new Set(dimCandidates));

    const designCode = matchFirst(/\b(\d+\s*x\s*\d+\s*x\s*[\d+/.]+)\b/i);

    // Extract numeric width/height/depth best-effort from a dims candidate (choose one with decimals if available)
    const preferredDim = displayDimensions.find((d) => /\d+\.\d+|\d+\+\d+\/\d+/.test(d)) || displayDimensions[0] || '';
    let width = null, height = null, depth = null;
    const dimParts = preferredDim ? preferredDim.replace(/opf/i, '').split('x').map((s) => s.trim()) : [];
    const toNumber = (s) => {
      if (!s) return null;
      // handle formats like 1+3/4
      if (/\d+\+\d+\/\d+/.test(s)) {
        const [i, frac] = s.split('+');
        const [n, d] = frac.split('/');
        return Number(i) + Number(n) / Number(d);
      }
      return Number(s);
    };
    if (dimParts.length === 3) {
      // The files sometimes appear as W x H x D in either order; we will map as given
      width = toNumber(dimParts[0]);
      height = toNumber(dimParts[1]);
      depth = toNumber(dimParts[2]);
    }

    const blankSize = matchFirst(/\b(\d+(?:\+\d+\/\d+)?\s*x\s*\d+(?:\+\d+\/\d+)?)\b/);
    const recordId = matchFirst(/\b(\d{9,})\b\s+\d+\s*x\s*\d+\s*x\s*[\d+/.]+/);
    const dates = matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g);
    const orientationFlags = matchFirst(/\b(AT\s+[^\r\n]+)\b/);
    const colorNote = matchFirst(/100%\s*Cyan/i) ? '100% Cyan' : null;
    const cmykMatch = matchFirst(/\b(\d{1,3}\s+\d{1,3}\s+\d{1,3}\s+\d{1,3})\b/);
    const cmyk = cmykMatch ? cmykMatch.split(/\s+/).map((n) => Number(n)) : null;
    const networkPath = matchFirst(/[+\\][\\/][^\r\n]*MRO\d+\.ARD\b/);

    // Database fields best-effort
    const dbFields = {};
    if (blankSize) dbFields['Blank Size'] = blankSize;
    // Pull adjacent labels where available
    const labelLine = lines.find((l) => /Grain\/Corr:/.test(l));
    if (labelLine) {
      const pairs = labelLine.split(/\s{2,}|\t/g).filter(Boolean);
      // naive split by colon
      for (const p of pairs) {
        const idx = p.indexOf(':');
        if (idx > 0) {
          const k = p.slice(0, idx).trim();
          const v = p.slice(idx + 1).trim() || null;
          if (k) dbFields[k] = v || dbFields[k] || null;
        }
      }
    }
    ['Grain/Corr', 'Side Shown', 'Description', 'Total Rule', 'Blank Size', 'Mfg Joint', 'Specific Rule Legend', '# of Components', '# Parts Req', 'Designer']
      .forEach((k) => { if (!(k in dbFields)) dbFields[k] = null; });

    // Compose INTERACT-like schema
    const result = {
      Units: 'IN',
      DesignName: designCode || baseId,
      FileName: ardFile || `${baseId}.ARD`,
      Width: width,
      Height: height,
      Depth: depth,
      Board: null,
      Display: {
        DesignCode: designCode,
        DisplayDimensions: displayDimensions,
        BlankSize: blankSize,
        RecordId: recordId,
        Dates: dates,
        OrientationFlags: orientationFlags,
        ColorNote: colorNote,
        CMYK: cmyk,
        NetworkPath: networkPath
      },
      DatabaseFields: dbFields,
      Geometry: {
        Layers: {
          Cut: [],
          Crease: [],
          Perf: [],
          HalfCut: [],
          ReverseCrease: [],
          Emboss: [],
          Score: [],
          Other: []
        },
        Arcs: [],
        Text: [],
        Dimensions: []
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Error building INTERACT output:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
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
