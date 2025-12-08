-- Create assets table for asset register management (SQLite)
CREATE TABLE IF NOT EXISTS assets (
    asset_id TEXT NOT NULL UNIQUE PRIMARY KEY,
    asset_name TEXT NOT NULL,
    asset_category TEXT NOT NULL,
    asset_description TEXT,
    purchase_date TEXT NOT NULL,
    purchase_price REAL NOT NULL,
    current_value REAL,
    asset_condition TEXT NOT NULL,
    location TEXT NOT NULL,
    serial_number TEXT,
    warranty_expiry TEXT,
    status TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_asset_category ON assets(asset_category);
CREATE INDEX IF NOT EXISTS idx_asset_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_asset_location ON assets(location);