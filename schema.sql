
-- LearnPlay PostgreSQL Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Firebase UID
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    photo_url TEXT,
    total_xp INTEGER DEFAULT 0,
    plan TEXT DEFAULT 'free',
    is_premium BOOLEAN DEFAULT FALSE,
    subscription_expiry TIMESTAMP WITH TIME ZONE,
    billing_cycle TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Game Engines Table
CREATE TABLE IF NOT EXISTS game_engines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    author_id TEXT REFERENCES users(id),
    game_schema JSONB,
    rating DECIMAL(3, 2) DEFAULT 0,
    plays_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Datasets Table
CREATE TABLE IF NOT EXISTS datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    domain TEXT,
    content JSONB NOT NULL,
    game_type TEXT,
    author_id TEXT REFERENCES users(id),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id),
    game_id UUID REFERENCES game_engines(id),
    dataset_id UUID REFERENCES datasets(id),
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 0,
    accuracy DECIMAL(5, 2) DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'ILS',
    status TEXT NOT NULL,
    keva_id TEXT,
    plan TEXT,
    billing_cycle TEXT,
    method TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_datasets_author_id ON datasets(author_id);
CREATE INDEX IF NOT EXISTS idx_datasets_is_public ON datasets(is_public);
CREATE INDEX IF NOT EXISTS idx_engines_type ON game_engines(type);
