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
    username VARCHAR(25) REFERENCES users ON DELETE CASCADE, --FK
    title TEXT NOT NULL,
    release_date VARCHAR(10) CHECK (LENGTH(release_date) = 10), --MM-DD-YYYY
    preferred_system VARCHAR(30),
    store_link TEXT,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    note TEXT
);