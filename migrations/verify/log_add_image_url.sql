-- Verify reparaturcafe:log_add_image_url on mysql

BEGIN;

SELECT image_url FROM logs LIMIT 0;

COMMIT;
