-- Verify reparaturcafe:qrcode_print_queue on mysql

BEGIN;

select
    id,
    task_id,
    print_done,
    creation_date
from qrcode_print_queue where 0;

ROLLBACK;
