-- Verify reparaturcafe:log on mysql

BEGIN;

select
    id,
    creation_date,
    comment,
    record_type,
    task_id,
    supervisor_id
from logs where 0;

ROLLBACK;
