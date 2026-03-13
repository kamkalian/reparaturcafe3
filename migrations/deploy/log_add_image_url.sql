-- Deploy reparaturcafe:log_add_image_url to mysql

BEGIN;

ALTER TABLE logs ADD COLUMN image_url varchar(512) DEFAULT NULL;

COMMIT;
