-- Deploy reparaturcafe:tasks to mysql

BEGIN;

create table tasks (
    id smallint unsigned primary key auto_increment,
    creation_date timestamp not null default CURRENT_TIMESTAMP,
    supervisor_id int,

    device_name varchar(255) not null,
    device_error_description varchar(255) not null,
    device_manufacturer varchar(255),
    device_model varchar(255),

    shelf_no varchar(255),
    shelf_floor_no varchar(255),
    other_location varchar(255),

    task_state varchar(255) not null,
    task_next_step varchar(255)
);

COMMIT;
