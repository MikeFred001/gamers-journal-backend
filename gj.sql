\echo 'Delete and recreate gamers_journal db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE gamers_journal;
CREATE DATABASE gamers_journal;
\connect gamers_journal

\i gamers-journal-schema.sql
\i gamers-journal-seed.sql

\echo 'Delete and recreate gamers_journal_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE gamers_journal_test;
CREATE DATABASE gamers_journal_test;
\connect gamers_journal_test

\i gamers-journal-schema.sql