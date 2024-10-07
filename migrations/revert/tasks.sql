-- Revert reparaturcafe:tasks from mysql

BEGIN;

drop table tasks;

COMMIT;
