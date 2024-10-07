-- Revert reparaturcafe:users from mysql

BEGIN;

drop table users;

COMMIT;
