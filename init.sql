-- SkyBox Design Database Schema
-- Based on ArtiosCAD design file analysis

-- Design files table
CREATE TABLE designs (
    id SERIAL PRIMARY KEY,
    design_id VARCHAR(50) UNIQUE NOT NULL, -- MRO32920, MRO35174, etc.
    filename VARCHAR(255) NOT NULL,
    created_date DATE,
    modified_date DATE,
    description TEXT,
    designer VARCHAR(200),
    grain_corr VARCHAR(100),
    side_shown VARCHAR(100),
    total_rule VARCHAR(100),
    blank_size VARCHAR(200),
    mfg_joint VARCHAR(100),
    specific_rule VARCHAR(100),
    legend TEXT,
    components_count INTEGER,
    parts_required INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dimensions table
CREATE TABLE dimensions (
    id SERIAL PRIMARY KEY,
    design_id VARCHAR(50) REFERENCES designs(design_id),
    dimension_type VARCHAR(100), -- Overall, Inside, Outside, etc.
    length DECIMAL(10,3),
    width DECIMAL(10,3),
    height DECIMAL(10,3),
    depth DECIMAL(10,3),
    units VARCHAR(10) DEFAULT 'inches',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Box specifications table
CREATE TABLE box_specifications (
    id SERIAL PRIMARY KEY,
    design_id VARCHAR(50) REFERENCES designs(design_id),
    box_type VARCHAR(200), -- OPF, Folder, Air Cell, PAD, etc.
    board_type VARCHAR(200), -- 32ECT C, etc.
    flute_type VARCHAR(100), -- C FLUTE, etc.
    material_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Design parameters table
CREATE TABLE design_parameters (
    id SERIAL PRIMARY KEY,
    design_id VARCHAR(50) REFERENCES designs(design_id),
    parameter_name VARCHAR(200),
    parameter_value VARCHAR(500),
    parameter_type VARCHAR(100), -- numeric, text, boolean, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File references table
CREATE TABLE file_references (
    id SERIAL PRIMARY KEY,
    design_id VARCHAR(50) REFERENCES designs(design_id),
    file_type VARCHAR(20), -- ARD, PDF, TXT
    file_path VARCHAR(500),
    file_size BIGINT,
    last_modified TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_designs_design_id ON designs(design_id);
CREATE INDEX idx_designs_created_date ON designs(created_date);
CREATE INDEX idx_dimensions_design_id ON dimensions(design_id);
CREATE INDEX idx_box_specs_design_id ON box_specifications(design_id);
CREATE INDEX idx_parameters_design_id ON design_parameters(design_id);
CREATE INDEX idx_file_refs_design_id ON file_references(design_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_designs_updated_at BEFORE UPDATE ON designs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
