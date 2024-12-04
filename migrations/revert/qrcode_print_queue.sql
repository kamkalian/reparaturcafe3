-- Revert reparaturcafe:qrcode_print_queue from mysql

BEGIN;

drop table qrcode_print_queue;

COMMIT;
