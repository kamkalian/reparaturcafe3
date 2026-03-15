-- Revert reparaturcafe:log_increase_comment_length from mysql

BEGIN;

ALTER TABLE logs MODIFY COLUMN comment VARCHAR(255);

COMMIT;
