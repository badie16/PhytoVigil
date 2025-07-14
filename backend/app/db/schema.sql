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
