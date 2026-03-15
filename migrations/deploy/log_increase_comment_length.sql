-- Deploy reparaturcafe:log_increase_comment_length to mysql

BEGIN;

ALTER TABLE logs MODIFY COLUMN comment VARCHAR(1000);

COMMIT;
