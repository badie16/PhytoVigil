-- Table users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table plant_images
CREATE TABLE IF NOT EXISTS plant_images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table disease_predictions
CREATE TABLE IF NOT EXISTS disease_predictions (
    id SERIAL PRIMARY KEY,
    plant_image_id INTEGER NOT NULL REFERENCES plant_images(id) ON DELETE CASCADE,
    disease_name VARCHAR NOT NULL,
    confidence FLOAT NOT NULL,
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);


-- Migration pour créer la table activities
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    plant_id INTEGER REFERENCES plants(id) ON DELETE CASCADE,
    scan_id INTEGER REFERENCES plant_scans(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    meta_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_plant_id ON activities(plant_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);

-- Index composé pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_activities_user_status_created ON activities(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user_type_created ON activities(user_id, type, created_at DESC);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_activities_updated_at 
    BEFORE UPDATE ON activities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();