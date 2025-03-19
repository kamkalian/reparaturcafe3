-- Deploy reparaturcafe:oskar to mysql

BEGIN;

CREATE USER IF NOT EXISTS 'oskar'@'localhost' IDENTIFIED BY 'rootpassword';

COMMIT;
