-- Revert reparaturcafe:owner from mysql

BEGIN;

drop table owners;

COMMIT;
