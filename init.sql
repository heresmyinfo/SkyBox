-- SkyBox MRO Design Management Database Schema
-- Supports PDF-to-MTECH translation workflow

-- MRO Drawings table (from Design Lab)
CREATE TABLE mro_drawings (
    id SERIAL PRIMARY KEY,
    mro_number VARCHAR(50) UNIQUE NOT NULL, -- MRO40611, MRO32920, etc.
    filename VARCHAR(255) NOT NULL,
    created_date DATE,
    modified_date DATE,
    description TEXT,
    designer VARCHAR(200),
    design_lab_status VARCHAR(50) DEFAULT 'Draft', -- Draft, Approved, Released
    pdf_path VARCHAR(500),
    ard_path VARCHAR(500),
    txt_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Box Dimensions table (extracted from MRO PDF)
CREATE TABLE box_dimensions (
    id SERIAL PRIMARY KEY,
    mro_number VARCHAR(50) REFERENCES mro_drawings(mro_number),
    dimension_type VARCHAR(100), -- Overall, Inside, Outside, etc.
    length DECIMAL(10,3),
    width DECIMAL(10,3),
    height DECIMAL(10,3),
    depth DECIMAL(10,3),
    units VARCHAR(10) DEFAULT 'inches',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Box Specifications table (extracted from MRO PDF)
CREATE TABLE box_specifications (
    id SERIAL PRIMARY KEY,
    mro_number VARCHAR(50) REFERENCES mro_drawings(mro_number),
    box_type VARCHAR(200), -- OPF, Folder, Air Cell, PAD, etc.
    board_type VARCHAR(200), -- 32ECT C, etc.
    flute_type VARCHAR(100), -- C FLUTE, etc.
    material_description TEXT,
    glue_joint VARCHAR(100),
    colors INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MTECH Specs table (generated from MRO PDF)
CREATE TABLE mtech_specs (
    id SERIAL PRIMARY KEY,
    mro_number VARCHAR(50) REFERENCES mro_drawings(mro_number),
    spec_name VARCHAR(200),
    machine_routing VARCHAR(200), -- Which machine to route to
    setup_time DECIMAL(8,2), -- Setup time in hours
    run_speed DECIMAL(8,2), -- Pieces per hour
    material_cost DECIMAL(10,2),
    labor_cost DECIMAL(10,2),
    overhead_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    profit_margin DECIMAL(5,2), -- Percentage
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Quoted, Ordered, Production
    created_by VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Machine Performance table (run speeds and setup times)
CREATE TABLE machine_performance (
    id SERIAL PRIMARY KEY,
    machine_id VARCHAR(50), -- 144, etc.
    machine_name VARCHAR(200),
    box_type VARCHAR(200),
    min_quantity INTEGER,
    max_quantity INTEGER,
    setup_time DECIMAL(8,2), -- Hours
    run_speed DECIMAL(8,2), -- Pieces per hour
    efficiency_factor DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing Tiers table (for different quantities)
CREATE TABLE pricing_tiers (
    id SERIAL PRIMARY KEY,
    mtech_spec_id INTEGER REFERENCES mtech_specs(id),
    quantity_min INTEGER,
    quantity_max INTEGER,
    unit_price DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    markup_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File references table
CREATE TABLE file_references (
    id SERIAL PRIMARY KEY,
    mro_number VARCHAR(50) REFERENCES mro_drawings(mro_number),
    file_type VARCHAR(20), -- ARD, PDF, TXT
    file_path VARCHAR(500),
    file_size BIGINT,
    last_modified TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_mro_drawings_mro_number ON mro_drawings(mro_number);
CREATE INDEX idx_mro_drawings_created_date ON mro_drawings(created_date);
CREATE INDEX idx_box_dimensions_mro_number ON box_dimensions(mro_number);
CREATE INDEX idx_box_specs_mro_number ON box_specifications(mro_number);
CREATE INDEX idx_mtech_specs_mro_number ON mtech_specs(mro_number);
CREATE INDEX idx_mtech_specs_status ON mtech_specs(status);
CREATE INDEX idx_machine_performance_machine_id ON machine_performance(machine_id);
CREATE INDEX idx_pricing_tiers_mtech_spec_id ON pricing_tiers(mtech_spec_id);
CREATE INDEX idx_file_refs_mro_number ON file_references(mro_number);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_mro_drawings_updated_at BEFORE UPDATE ON mro_drawings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mtech_specs_updated_at BEFORE UPDATE ON mtech_specs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
