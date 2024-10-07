-- Revert reparaturcafe:log from mysql

BEGIN;

drop table logs;

COMMIT;
