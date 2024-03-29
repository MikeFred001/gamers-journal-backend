CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,

    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,

    username VARCHAR(25) REFERENCES users ON DELETE CASCADE,

    title TEXT NOT NULL,
    edition TEXT DEFAULT 'Standard',
    retail_price NUMERIC(5, 2) CHECK (retail_price > 0),
    release_date DATE, --yyyy-mm-dd
    preferred_system VARCHAR(20),
    store_link TEXT,
    date_added TIMESTAMP WITH TIME ZONE NOT NULL,
    note TEXT
);