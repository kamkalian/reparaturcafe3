-- Revert reparaturcafe:log_add_image_url from mysql

BEGIN;

ALTER TABLE logs DROP COLUMN image_url;

COMMIT;
