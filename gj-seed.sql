INSERT INTO users (username, password, first_name, last_name, email, is_admin)
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

INSERT INTO games (username, title, edition, retail_price, release_date, preferred_system, store_link, date_added, note)
VALUES (
    'testuser',
    'testtitle',
    'testedition',
    69.99,
    '2000-01-01',
    'PlayStation 4',
    'https://www.steam.com',
    '2002-10-19 10:23:54+02',
    'Hey look, a note.'
),
(
    'testadmin',
    'testtitle2',
    'testedition2',
    59.99,
    '2000-01-02',
    'PlayStation 5',
    'https://www.steam2.com',
    '2002-10-19 10:23:54+02',
    'Hey look, a note. Again.'
);