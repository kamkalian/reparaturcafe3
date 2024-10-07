-- Verify reparaturcafe:tasks on mysql

BEGIN;

select 
    id,
    creation_date,
    supervisor_id,
    device_name,
    device_error_description,
    device_manufacturer,
    device_model,
    shelf_no,
    shelf_floor_no,
    other_location,
    task_state,
    task_next_step
from tasks where 0;

ROLLBACK;
