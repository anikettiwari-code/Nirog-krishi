-- Nirog Krishi Database Schema for Supabase
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- ==================== SCAN RESULTS TABLE ====================
CREATE TABLE IF NOT EXISTS scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_name TEXT,
    image_size INTEGER,
    mime_type TEXT,
    analysis_result TEXT,
    plant_type TEXT,
    disease_name TEXT,
    severity TEXT DEFAULT 'Unknown',
    is_healthy BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_results_plant_type ON scan_results(plant_type);

-- ==================== CHAT MESSAGES TABLE ====================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- ==================== OUTBREAKS TABLE ====================
CREATE TABLE IF NOT EXISTS outbreaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_name TEXT NOT NULL,
    plant_type TEXT,
    severity TEXT DEFAULT 'Moderate',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    report_count INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_outbreaks_status ON outbreaks(status);
CREATE INDEX IF NOT EXISTS idx_outbreaks_location ON outbreaks(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_outbreaks_reported_at ON outbreaks(reported_at DESC);

-- ==================== ROW LEVEL SECURITY (RLS) ====================
-- Enable RLS on all tables
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbreaks ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since we don't have authentication)
-- WARNING: This allows anyone to read/write. For production, implement proper auth.

-- Scan Results Policies
CREATE POLICY "Allow public read access on scan_results" 
    ON scan_results FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert access on scan_results" 
    ON scan_results FOR INSERT 
    WITH CHECK (true);

-- Chat Messages Policies
CREATE POLICY "Allow public read access on chat_messages" 
    ON chat_messages FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert access on chat_messages" 
    ON chat_messages FOR INSERT 
    WITH CHECK (true);

-- Outbreaks Policies
CREATE POLICY "Allow public read access on outbreaks" 
    ON outbreaks FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert access on outbreaks" 
    ON outbreaks FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update access on outbreaks" 
    ON outbreaks FOR UPDATE 
    USING (true);

-- ==================== VERIFICATION ====================
-- Check if tables were created successfully
SELECT 
    table_name, 
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_name IN ('scan_results', 'chat_messages', 'outbreaks')
ORDER BY table_name;
