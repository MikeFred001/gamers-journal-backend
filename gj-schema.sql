-- Connect to the postgres database
\connect postgres

-- Terminate all active connections to the gamers_journal database
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'gamers_journal';

-- Drop the gamers_journal database if it exists
DROP DATABASE IF EXISTS gamers_journal;

-- Create a new gamers_journal database
CREATE DATABASE gamers_journal;

-- Connect to the new gamers_journal database
\connect gamers_journal

CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY, --PK
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY, --PK
    username VARCHAR(25) NOT NULL REFERENCES users ON DELETE CASCADE, --FK
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT CHECK (position('http' IN image_url) = 1),
    release_date VARCHAR(10) CHECK (LENGTH(release_date) = 10), --MM-DD-YYYY
    preferred_system VARCHAR(30),
    date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    note TEXT
);