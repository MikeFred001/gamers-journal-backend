\connect gamers_journal

DELETE FROM games;
DELETE FROM users;

INSERT INTO users (username,
                   password,
                   first_name,
                   last_name,
                   email,
                   is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'test@user.com',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin',
        'test@admin.com',
        TRUE);

INSERT INTO games (username,
                   title,
                   release_date,
                   preferred_system,
                   store_link,
                   date_added,
                   note)
VALUES (
    'testuser',
    'testtitle',
    '2000-01-01',
    'PlayStation 4',
    'https://www.steam.com',
    CURRENT_TIMESTAMP,
    'Hey look, a note.'
),
(
    'testadmin',
    'testtitle2',
    '2000-01-02',
    'PlayStation 5',
    'https://www.steam2.com',
    CURRENT_TIMESTAMP,
    'Hey look, a note. Again.'
);